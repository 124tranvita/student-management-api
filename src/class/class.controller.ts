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
import { ClassService } from './class.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly service: ClassService) {}

  /** Get all classrooms */
  @Get()
  @ApiOkResponse()
  @HttpCode(200)
  async findAll() {
    const classrooms = await this.service.findAll();

    return {
      message: 'success',
      result: classrooms.length,
      data: classrooms,
    };
  }

  /** Get a classroom */
  @Get(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(@Param('id') id: Types.ObjectId) {
    const classroom = await this.service.findOne(id);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }
    return {
      message: 'success',
      data: classroom,
    };
  }

  /** Create classroom */
  @Post()
  @ApiOkResponse()
  @HttpCode(201)
  async create(@Body() createClassDto: CreateClassDto) {
    const classroom = await this.service.create(createClassDto);
    return {
      message: 'success',
      data: classroom,
    };
  }

  /** Update classroom */
  @Patch(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    const classroom = await this.service.update(id, updateClassDto);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return {
      message: 'success',
      data: classroom,
    };
  }

  /** Delete classroom */
  @Delete(':id')
  @ApiOkResponse()
  @HttpCode(204)
  async delete(@Param('id') id: Types.ObjectId) {
    const classroom = await this.service.delete(id);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: null,
    };
  }
}
