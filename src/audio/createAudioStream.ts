import { PassThrough } from 'stream';
import { spawn } from 'child_process';

export function createAudioStream() {
    const audioStream = new PassThrough({ allowHalfOpen: false });
    const AUDIO_NODE_ID = "56";
    let retryCount = 0;
    const maxRetries = 3;
    let gstProcess: ReturnType<typeof spawn> | null = null;

    const startGStreamer = () => {
        try {
            // Clean up previous process if exists
            if (gstProcess && !gstProcess.killed) {
                gstProcess.kill('SIGTERM');
            }

            gstProcess = spawn('gst-launch-1.0', [
                'pipewiresrc',
                `target-object=${AUDIO_NODE_ID}`,
                '!',
                'audioconvert',
                '!',
                'audioresample',
                '!',
                'audio/x-raw,format=S16LE,channels=1,rate=48000',
                '!',
                'opusenc', 'bitrate=64000',
                '!',
                'oggmux',  // Prueba con OGG en lugar de WebM
                '!',
                'fdsink', 'fd=1'
            ], {
                stdio: ['ignore', 'pipe', 'pipe']
            });

            // Add null checks for stdout and stderr
            if (!gstProcess.stdout || !gstProcess.stderr) {
                throw new Error('Failed to create stdout or stderr streams');
            }

            // WebM format verification (matroska)
            const WEBM_HEADER = Buffer.from([0x1A, 0x45, 0xDF, 0xA3]);
            let headerChecked = false;

            gstProcess.stdout.on('data', (chunk: Buffer) => {
                try {
                    if (!headerChecked) {
                        headerChecked = true;
                        if (!chunk.slice(0, 4).equals(WEBM_HEADER)) {
                            console.error('Invalid WebM format - Incorrect header');
                            restartProcess('Invalid format');
                            return;
                        }
                    }

                    if (!audioStream.destroyed) {
                        audioStream.write(chunk);
                    }
                } catch (err) {
                    console.error('Error processing chunk:', err);
                    restartProcess('Processing error');
                }
            });

            gstProcess.stderr.on('data', (data: Buffer) => {
                console.error(`GStreamer stderr: ${data.toString()}`);
            });

            gstProcess.on('error', (err) => {
                console.error('GStreamer process error:', err);
                restartProcess('GStreamer error');
            });

            gstProcess.on('close', (code, signal) => {
                console.log(`GStreamer closed - Code: ${code}, Signal: ${signal}`);
                if (code !== 0 && !audioStream.destroyed) {
                    restartProcess(`GStreamer exited with code ${code}`);
                }
            });

        } catch (err) {
            console.error('Error starting GStreamer:', err);
            restartProcess('Startup error');
        }
    };

    const restartProcess = (reason: string) => {
        if (retryCount >= maxRetries) {
            console.error(`Max retries reached (${maxRetries})`);
            if (!audioStream.destroyed) {
                audioStream.destroy(new Error(`Max retries: ${reason}`));
            }
            return;
        }

        retryCount++;
        console.log(`Retrying (${retryCount}/${maxRetries}) - Reason: ${reason}`);

        // Clean up current process
        if (gstProcess && !gstProcess.killed) {
            gstProcess.removeAllListeners();
            gstProcess.kill('SIGTERM');
        }

        // Wait before retrying (exponential backoff)
        setTimeout(() => {
            if (!audioStream.destroyed) {
                startGStreamer();
            }
        }, Math.min(1000 * Math.pow(2, retryCount), 15000));
    };

    // Handlers for audioStream
    audioStream.on('error', (err) => {
        console.error('audioStream error:', err);
        if (!audioStream.destroyed) {
            audioStream.destroy();
        }
    });

    audioStream.on('close', () => {
        console.log('AudioStream closed - Cleaning up resources');
        if (gstProcess && !gstProcess.killed) {
            gstProcess.kill('SIGTERM');
        }
    });

    // Start the process
    startGStreamer();

    return audioStream;
}