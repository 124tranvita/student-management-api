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
import { StudentService } from './student.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get()
  @ApiOkResponse()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  async findOne(@Param('id') id: Types.ObjectId) {
    const student = await this.service.findOne(id);

    // If no student was found
    if (!student) {
      throw new NotFoundException(`Student with id: ${id} was not found!`);
    }

    return student;
  }

  @Post()
  @ApiOkResponse()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.service.create(createStudentDto);
  }

  @Patch(':id')
  @ApiOkResponse()
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.service.update(id, updateStudentDto);

    // If no student was found
    if (!student) {
      throw new NotFoundException(`Student with id: ${id} was not found!`);
    }

    return student;
  }

  @Delete(':id')
  @ApiOkResponse()
  async delete(@Param('id') id: Types.ObjectId) {
    const student = await this.service.delete(id);

    // If no student was found
    if (!student) {
      throw new NotFoundException(`Student with id: ${id} was not found!`);
    }

    return student;
  }
}
