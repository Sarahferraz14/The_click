import { SerialPort } from 'serialport';

let port: SerialPort | null = null;

function getPort() {
    const path = process.env.ARDUINO_PORT;
    if (!path) return null; // sem Arduino configurado, o app continua funcionando
    if (!port) {
        port = new SerialPort({ path, baudRate: 9600 });
        port.on('error', (e) => console.error('Arduino:', e.message));
        port.on('close', () => { port = null; });
    }
    return port;
}

export type ArduinoCmd = 'LIGHT:ON' | 'LIGHT:OFF' | 'GATE:OPEN' | 'GATE:CLOSE';

export function sendArduino(cmd: ArduinoCmd) {
    const p = getPort();
    if (!p) return;
    p.write(cmd + '\n', (err) => {
        if (err) console.error('Falha ao enviar ao Arduino:', err.message);
    });
}