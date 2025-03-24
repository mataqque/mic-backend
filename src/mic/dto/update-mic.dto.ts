import { PartialType } from '@nestjs/mapped-types';
import { CreateMicDto } from './create-mic.dto';

export class UpdateMicDto extends PartialType(CreateMicDto) {}
