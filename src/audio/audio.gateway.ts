import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createAudioStream } from './createAudioStream';
import * as zlib from 'zlib';
import { join } from 'path';
import { createReadStream, statSync } from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@WebSocketGateway(8080, {
    cors: {
        origin: '*', // Configura esto adecuadamente en producción
    },
    transports: ['websocket'] // Fuerza WebSocket puro
})
export class AudioGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // private audioStream = <createAudioStream>();
    afterInit() {

    }
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        // Enviar mensaje de bienvenida
        client.emit('connection-status', 'Connected to audio stream');
        const filePath = join(__dirname, '../../../multimedia/doopdoop.mp3');

        const command = ffmpeg(filePath)
            .audioCodec('libopus') // Códec obligatorio para WebM
            .format('webm')
            .outputOptions([
                '-f webm', // Forzar formato WebM
                '-cluster_size_limit 2M', // Tamaño máximo de cluster
                '-cluster_time_limit 5000', // Tiempo máximo por cluster
                '-flush_packets 1' // Enviar paquetes inmediatamente
            ])

            .on('start', (cmd) => console.log('FFmpeg command:', cmd));

        const ffstream = command.pipe();

        ffstream.on('data', (chunk: Buffer) => {
            // Convert to ArrayBuffer before sending

            console.log(chunk);

            const arrayBuffer = chunk.buffer.slice(
                chunk.byteOffset,
                chunk.byteOffset + chunk.byteLength
            );
            this.server.emit('audio-chunk', arrayBuffer);
        });
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }
}