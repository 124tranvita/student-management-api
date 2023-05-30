import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { Types } from 'mongoose';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';

@Controller('mentor')
export class MentorController {
  constructor(private readonly service: MentorService) {}

  @Get()
  @ApiOkResponse()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  async findOne(@Param('id') id: Types.ObjectId) {
    const mentor = await this.service.findOne(id);

    // If no mentor was found
    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return mentor;
  }

  @Post()
  @ApiOkResponse()
  async create(@Body() createMentorDto: CreateMentorDto) {
    return await this.service.create(createMentorDto);
  }

  @Patch(':id')
  @ApiOkResponse()
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const mentor = await this.service.update(id, updateMentorDto);

    // If no mentor was found
    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return mentor;
  }

  @Delete(':id')
  @ApiOkResponse()
  async delete(@Param('id') id: Types.ObjectId) {
    const mentor = await this.service.delete(id);

    // If no mentor was found
    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return mentor;
  }
}
