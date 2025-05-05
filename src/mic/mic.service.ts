import { Injectable } from '@nestjs/common';
import { CreateMicDto } from './dto/create-mic.dto';
import { UpdateMicDto } from './dto/update-mic.dto';




@Injectable()
export class MicService {
    create(createMicDto: CreateMicDto) {

        return 'This action adds a new mic';
    }

    findAll() {
        return ''
    }

    findOne(id: number) {
        return `This action returns a #${id} mic`;
    }

    update(id: number, updateMicDto: UpdateMicDto) {
        return `This action updates a #${id} mic`;
    }

    remove(id: number) {
        return `This action removes a #${id} mic`;
    }
}
