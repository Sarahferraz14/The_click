import type { Response } from 'express';
import { prisma } from '../lib/prisma'
import type { AuthRequest } from '../middleware/auth';

async function getMember(userId: string) {
    return (
        (await prisma.homeMember.findFirst({ where: { user_id: userId }, include: { home: true } })) ??
        (await prisma.homeMember.create({
            data: {
                role: 'owner',
                user: { connect: { id: userId } },
                home: { create: { name: 'Minha casa' } },
            },
            include: { home: true },
        }))
    );
}

async function getGate(homeId: string) {
    return (
        (await prisma.device.findFirst({ where: { type: 'gate', room: { home_id: homeId } } })) ??
        (await prisma.device.create({
            data: {
                name: 'Portão da garagem',
                type: 'gate',
                room: {
                    connectOrCreate: {
                        where: { home_id_name: { home_id: homeId, name: 'Garagem' } },
                        create: { home_id: homeId, name: 'Garagem' },
                    },
                },
            },
        }))
    );
}

export async function getSecurity(req: AuthRequest, res: Response) {
    try {
        const member = await getMember(req.userId!);
        const gate = await getGate(member.home_id);
        return res.json({
            gate: {
                id: gate.id,
                name: gate.name,
                state: gate.is_on ? 'open' : 'closed',
                online: gate.is_online,
                updated_at: gate.last_seen_at,
            },
            alarm: {
                armed: member.home.alarm_armed,
                changed_at: member.home.alarm_changed_at,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor!' });
    }
}

export async function setGate(req: AuthRequest, res: Response) {
    try {
        const state = req.body?.state;
        if (state !== 'open' && state !== 'closed') {
            return res.status(400).json({ error: 'Estado inválido!' });
        }

        const member = await getMember(req.userId!);

        if (member.role !== 'owner') {
            const perm = await prisma.memberPermission.findUnique({
                where: { member_id_permission: { member_id: member.id, permission: 'control_gate' } },
            });
            if (!perm) return res.status(403).json({ error: 'Sem permissão para controlar o portão!' });
        }

        const gate = await getGate(member.home_id);
        if (!gate.is_online) return res.status(409).json({ error: 'Portão offline!' });

        const updated = await prisma.device.update({
            where: { id: gate.id },
            data: { is_on: state == 'open', last_seen_at: new Date() },
        });

        const event = await prisma.event.create({
            data: {
                home_id: member.home_id,
                room_id: gate.room_id,
                device_id: gate.id,
                actor_user_id: req.userId!,
                kind: state == 'open' ? 'door_opened' : 'door_closed',
                source: 'user',
            },
        });

        let alerted = false;
        if (state == 'open' && member.home.alarm_armed) {
            await prisma.alert.create({
                data: {
                    home_id: member.home_id,
                    kind: 'manual',
                    severity: 'critical',
                    title: 'Portão aberto com o alarme armado!',
                    triggered_by_event_id: event.id,
                },
            });
            alerted = true;
        }

        return res.json({ ok: true, state, alerted, updated_at: updated.last_seen_at });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor!' });
    }
}

export async function setAlarm(req: AuthRequest, res: Response) {
    try {
        const armed = req.body?.armed;
        if (typeof armed !== 'boolean') return res.status(400).json({ error: 'Valor inválido!' });

        const member = await getMember(req.userId!);
        if (member.role !== 'owner') {
            return res.status(403).json({ error: 'Apenas o dono pode alterar o alarme!' });
        }

        const home = await prisma.home.update({
            where: { id: member.home_id },
            data: { alarm_armed: armed, alarm_changed_at: new Date() },
        });

        await prisma.event.create({
            data: {
                home_id: home.id,
                actor_user_id: req.userId!,
                kind: 'manual_command',
                source: 'user',
                payload: { alarm: armed },
            },
        });
        await prisma.auditLog.create({
            data: {
                home_id: home.id,
                user_id: req.userId!,
                action: armed ? 'alarm_armed' : 'alarm_disarmed',
                entity: 'home',
                entity_id: home.id,
            },
        });

        const gate = await getGate(home.id);
        return res.json({
            ok: true,
            armed: home.alarm_armed,
            changed_at: home.alarm_changed_at,
            warning: armed && gate.is_on ? 'gate_open' : null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor!' });
    }
}