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

  /** ADMIN ROLE */
  /** Create classroom
   * @param createStudentDto - Create student  Dto
   * @returns - New student document
   */
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

  /** Get all students
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of all student documents
   */
  @Get()
  @ApiOkResponse()
  @HttpCode(200)
  async findAll(@Param('page') page: number, @Param('limit') limit: number) {
    const students = await this.service.findAll(page, limit);
    const count = await this.service.count();

    return {
      status: 'success',
      grossCnt: count,
      data: students,
    };
  }

  /** Get student
   * @param id - student's Id
   * @returns - Founded student document by Id
   */
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

  /** Update student
   * @param id - Student's Id
   * @param updateClassDto - student update Dto
   * @returns - Updated student
   */
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

  /** Delete student
   * @param id - Student's Id
   * @returns - Deleted student document
   */
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
      data: student,
    };
  }
}
