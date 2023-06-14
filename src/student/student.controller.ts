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
import { StudentService } from './student.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  /** Get all students */
  @Get()
  @ApiOkResponse()
  @HttpCode(200)
  async findAll() {
    const students = await this.service.findAll();

    return {
      status: 'success',
      result: students.length,
      data: students,
    };
  }

  /** Get a student */
  @Get(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(@Param('id') id: Types.ObjectId) {
    const student = await this.service.findOne(id);

    // If no student was found
    if (!student) {
      throw new NotFoundException(`Student with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: student,
    };
  }

  /** Add student */
  @Post()
  @ApiOkResponse()
  @HttpCode(201)
  async create(@Body() createStudentDto: CreateStudentDto) {
    const student = await this.service.create(createStudentDto);

    return {
      status: 'success',
      data: student,
    };
  }

  /** Update student */
  @Patch(':id')
  @ApiOkResponse()
  @HttpCode(201)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const student = await this.service.update(id, updateStudentDto);

    // If no student was found
    if (!student) {
      throw new NotFoundException(`Student with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: student,
    };
  }

  /** Delete student */
  @Delete(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async delete(@Param('id') id: Types.ObjectId) {
    const student = await this.service.delete(id);

    // If no student was found
    if (!student) {
      throw new NotFoundException(`Student with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: {},
    };
  }
}
