import { Module } from '@nestjs/common';
import { MicService } from './mic.service';
import { MicController } from './mic.controller';

@Module({
  controllers: [MicController],
  providers: [MicService],
})
export class MicModule {}
