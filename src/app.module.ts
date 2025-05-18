import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { MicModule } from './mic/mic.module';
import { AudioGateway } from './audio/audio.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,  // Hace que ConfigService esté disponible en toda la aplicación
            envFilePath: '.env',  // Especifica la ruta de tu archivo .env
        }),
        PrismaModule,
        MicModule,
    ],
    controllers: [AppController],
    providers: [AppService, AudioGateway],
})
export class AppModule { }
