import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
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
      status: 'success',
      result: classrooms.length,
      data: classrooms,
    };
  }

  /** Get classroom with pagination members */
  @Get('member/:id?')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(
    @Param('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classroom = await this.service.findOne(id, page, limit);

    return {
      status: 'success',
      data: classroom,
      grossCnt: classroom.students.length,
    };
  }

  /** Create classroom */
  @Post()
  @ApiOkResponse()
  @HttpCode(201)
  async create(@Body() createClassDto: CreateClassDto) {
    const classroom = await this.service.create(createClassDto);
    return {
      status: 'success',
      data: classroom,
    };
  }

  /** Update classroom */
  @Patch(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async update(
    @Param('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    const classroom = await this.service.update(
      id,
      page,
      limit,
      updateClassDto,
    );

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: classroom,
      grossCnt: classroom.students.length,
    };
  }

  /** Delete classroom */
  @Delete(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async delete(@Param('id') id: Types.ObjectId) {
    const classroom = await this.service.delete(id);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: {},
    };
  }

  /** Find Classroom for assign table list
   * @param id - Current logged in mentor id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of Classroom that unssigned to logged in menter yet
   */
  @Get('list/?')
  @ApiOkResponse()
  @HttpCode(200)
  async findClassroomList(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log({ id, page, limit });
    const classrooms = await this.service.findClassroomList(id, page, limit);
    const count = await this.service.countByCondition({
      mentors: { $nin: [id] },
    });

    return {
      status: 'success',
      grossCnt: count,
      data: classrooms,
    };
  }

  /** Assign mentor to classroom
   * @param id - Classroom Id
   * @param mentorId - Current logged in mentor Id
   * @returns - Classroom which current logged in mentor is assigned
   */
  @Patch('assign/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async assignMento(
    @Param('id') id: Types.ObjectId,
    @Body('mentorId') mentorId: Types.ObjectId,
  ) {
    const isAssigned = await this.service.findExistingDoc(id, mentorId);

    console.log({ isAssigned });

    if (isAssigned && isAssigned.length > 0) {
      throw new BadRequestException(
        `Mentor with ${mentorId} is already assigned to this classroom`,
      );
    }

    const classroom = await this.service.assignMentor(id, mentorId);

    return {
      status: 'success',
      data: classroom,
    };
  }
}
