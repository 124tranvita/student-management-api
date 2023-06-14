import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

  /** Get all mentors */
  @Get()
  @ApiOkResponse()
  @HttpCode(200)
  async findAll() {
    const mentors = await this.service.findAll();

    return {
      status: 'success',
      result: mentors.length,
      data: mentors,
    };
  }

  /** Get a mentor */
  @Get(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(@Param('id') id: Types.ObjectId) {
    const mentor = await this.service.findOne(id);

    // If no mentor was found
    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Add mentor */
  @Post()
  @ApiOkResponse()
  @HttpCode(201)
  async create(@Body() createMentorDto: CreateMentorDto) {
    const mentor = await this.service.create(createMentorDto);
    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Update mentor */
  @Patch(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const mentor = await this.service.update(id, updateMentorDto);

    // If no mentor was found
    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Delete mentor */
  @Delete(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async delete(@Param('id') id: Types.ObjectId) {
    const mentor = await this.service.delete(id);

    // If no mentor was found
    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: {},
    };
  }
}
