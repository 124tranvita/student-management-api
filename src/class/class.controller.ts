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
import { ClassService } from './class.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly service: ClassService) {}

  @Get()
  @ApiOkResponse()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  async findOne(@Param('id') id: Types.ObjectId) {
    const classroom = await this.service.findOne(id);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return classroom;
  }

  @Post()
  @ApiOkResponse()
  async create(@Body() createClassDto: CreateClassDto) {
    return await this.service.create(createClassDto);
  }

  @Patch(':id')
  @ApiOkResponse()
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    const classroom = await this.service.update(id, updateClassDto);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return classroom;
  }

  @Delete(':id')
  @ApiOkResponse()
  async delete(@Param('id') id: Types.ObjectId) {
    const classroom = await this.service.delete(id);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return classroom;
  }
}
