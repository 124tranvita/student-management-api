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
  Query,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly service: ClassroomService) {}

  /** Create classroom
   * @param createClassroomDto - Class create Dto
   * @returns - New classroom
   */
  @Post()
  @ApiOkResponse()
  @HttpCode(201)
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    const classroom = await this.service.create(createClassroomDto);
    return {
      status: 'success',
      data: classroom,
    };
  }

  /** Get all classrooms
   * @returns - List of all classrooms
   */
  @Get()
  @ApiOkResponse()
  @HttpCode(200)
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const classrooms = await this.service.findAll(page, limit);
    const count = await this.service.count();

    return {
      status: 'success',
      grossCnt: count,
      data: classrooms,
    };
  }

  /** Find all classrooms that unassign to any mentor yet
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of Classroom that unssigned to mentor
   */
  @Get('unassign-mentor/?')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllUnassignClassroomMentor(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classrooms = await this.service.findAllUnassignClassroomMentor(
      id,
      page,
      limit,
    );

    return {
      status: 'success',
      grossCnt: classrooms.length,
      data: classrooms,
    };
  }

  /** Find all classrooms that unassign to any mentor yet
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of Classroom that unssigned to mentor
   */
  @Get('unassign-student/?')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllUnassignClassroomStudent(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classrooms = await this.service.findAllUnassignClassroomStudent(
      id,
      page,
      limit,
    );

    return {
      status: 'success',
      grossCnt: classrooms.length,
      data: classrooms,
    };
  }

  /** Get classroom with number of assigned student and classroom
   * @param id - Classroom's Id
   * @returns - Founded classroom by Id with count of assigned students and classrooms
   */
  @Get(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(@Param('id') id: Types.ObjectId) {
    const classroom = await this.service.findOne(id);

    return {
      status: 'success',
      data: classroom,
      grossCnt: {
        mentorCnt: classroom.mentors.length,
        studentCnt: classroom.students.length,
      },
    };
  }

  /** Update classroom
   * @param id - Classroom's Id
   * @param updateClassroomDto - Classroom update Dto
   * @returns - Updated classroom
   */
  @Patch(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    const classroom = await this.service.update(id, updateClassroomDto);

    // If no classroom was found
    if (!classroom) {
      throw new NotFoundException(`Classroom with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: classroom,
    };
  }

  /** Delete classroom
   * @param id - Classroom's Id
   * @returns - Deleted classroom
   */
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
      data: classroom,
    };
  }

  /*************************
   *
   *  MENTOR ASSIGNMENT
   *
   ************************* */

  /** Find all classrooms that unassign to any mentor yet
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of Classroom that unssigned to mentor
   */
  @Get('assign-mentor/?')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllAssignedClassroomMentor(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classrooms = await this.service.findAllAssignedClassroomMentor(
      id,
      page,
      limit,
    );
    return {
      status: 'success',
      grossCnt: classrooms.length,
      data: classrooms,
    };
  }

  /** Find a classroom with list of assigned mentors
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Founded classroom with list of assigned mentors (pagination)
   */
  @Get('mentors/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findAssignedMentorList(
    @Param('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classroom = await this.service.findAssignedMentorList(
      id,
      page,
      limit,
    );

    if (!classroom) {
      throw new NotFoundException(`Classroom with id ${id} was not found`);
    }

    return {
      status: 'success',
      data: classroom,
    };
  }

  /** Find a classroom with list of assigned students
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Founded classroom with list of assigned students (pagination)
   */
  @Get('students/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findAssignedStudentList(
    @Param('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classroom = await this.service.findAssignedStudentList(
      id,
      page,
      limit,
    );

    if (!classroom) {
      throw new NotFoundException(`Classroom with id ${id} was not found`);
    }

    return {
      status: 'success',
      data: classroom,
    };
  }

  /** MENTOR ROLE */
  /** Get all classrooms by mentor Id (for mentor role)
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of classrooms belong to mentor
   */
  @Get('mentor/all/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllByMentor(
    @Param('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classrooms = await this.service.findAllByMentor(id, page, limit);

    const count = await this.service.countByCondition({
      mentors: { $in: [id] },
    });

    return {
      status: 'success',
      data: classrooms,
      grossCnt: count,
    };
  }

  /** Get a classroom (for mentor role)
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Classroom with pagination assgined student
   */
  @Get('mentor/one/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOneByMentor(
    @Param('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const classroom = await this.service.findOneByMentor(id, page, limit);

    if (!classroom) {
      throw new NotFoundException(`Classroom with id ${id} was not found`);
    }

    return {
      status: 'success',
      data: classroom,
    };
  }
}
