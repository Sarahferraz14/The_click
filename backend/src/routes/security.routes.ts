import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getSecurity, setGate, setAlarm } from '../controllers/security.controller';
import { get } from 'node:http';

const router = Router();

router.get('/garage', requireAuth, getSecurity);
router.post('/gate', requireAuth, setGate);
router.put('/alarm', requireAuth, setAlarm);

export default router;