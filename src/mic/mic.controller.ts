import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MicService } from './mic.service';
import { CreateMicDto } from './dto/create-mic.dto';
import { UpdateMicDto } from './dto/update-mic.dto';

@Controller('mic')
export class MicController {
  constructor(private readonly micService: MicService) {}

  @Post()
  create(@Body() createMicDto: CreateMicDto) {
    return this.micService.create(createMicDto);
  }

  @Get()
  findAll() {
    return this.micService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.micService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMicDto: UpdateMicDto) {
    return this.micService.update(+id, updateMicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.micService.remove(+id);
  }
}
