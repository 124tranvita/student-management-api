import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { MentorService } from './mentor.service';
import { Types } from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('manage/mentor')
export class ManagementController {
  constructor(private readonly service: MentorService) {}

  /** Find all mentors that not assinged to classroomId yet
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   */
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Get('classroom-unassign')
  async findAllUnassignMentorClassroom(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const mentors = await this.service.findAllUnassignMentorClassroom(
      id,
      page,
      limit,
    );

    return {
      status: 'success',
      data: mentors,
      grossCnt: mentors.length,
    };
  }

  /** Find all classrooms that assigned to mentor
   * @param id - Mentor's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Mentor document with assigned classrooms list
   */
  @Get('classrooms/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findAssignedClass(
    @Param('id') id: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    const mentor = await this.service.findAssignedClass(id, page, limit);

    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} was not found`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Find all students that assigned to mentor
   * @param id - Mentor's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Mentor document with assigned classrooms list
   */
  @Get('students/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findAssignedStudent(
    @Param('id') id: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    const mentor = await this.service.findAssignedStudent(id, page, limit);

    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} was not found`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }
}
