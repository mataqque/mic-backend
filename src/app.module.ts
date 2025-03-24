import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { MicModule } from './mic/mic.module';

@Module({
    imports: [
        PrismaModule,
        MicModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
