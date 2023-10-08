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
  UseGuards,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { Types } from 'mongoose';
import { ApiOkResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { convertRole } from 'src/utils';

@Controller('mentor')
@UseGuards(AccessTokenGuard)
export class MentorController {
  constructor(private readonly service: MentorService) {}

  /** Find all mentors that not assinged to classroomId yet
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   */

  @Get('classroom-unassign')
  @Roles(Role.Admin)
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
      grossCnt: mentors.length,
      data: mentors,
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

  /**********************************
   * BASIC CRUD
   **********************************/

  /** Create new mentor/admin
   * @param createMentorDto - Create mentor Dto
   * @returns - New added mentor/admin document
   */
  @Post()
  @Roles(Role.Admin)
  @ApiOkResponse()
  @HttpCode(201)
  async create(@Body() createMentorDto: CreateMentorDto) {
    const mentor = await this.service.create(createMentorDto);

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Get all mentors/admins (excluded admin who is querying)
   * @param id - Currently logged in admin's id
   * @param page - Current page
   * @param limit - Limit per page
   * @param queryString - Search query string
   * @returns - List of all mentors/admins (excluded admin who is querying) document
   */
  @Get()
  @Roles(Role.Admin)
  @ApiOkResponse()
  @HttpCode(200)
  async findAll(
    @Query('id') id: Types.ObjectId,
    @Query('role') role: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
  ) {
    const mappedRole = convertRole(role);
    const options = queryString
      ? {
          $text: { $search: `\"${queryString}\"` }, // Searching with Full Phrases
          _id: { $ne: new Types.ObjectId(id) },
          roles: { $eq: mappedRole },
        }
      : {
          _id: { $ne: new Types.ObjectId(id) },
          roles: { $eq: mappedRole },
        };

    const mentors = await this.service.findAll(options, page, limit);
    const count = await this.service.countByCondition({
      _id: { $ne: new Types.ObjectId(id) },
      roles: { $eq: mappedRole },
    });

    return {
      status: 'success',
      grossCnt: count,
      data: mentors,
    };
  }

  /** Get mentor/admin
   * @param id - Mentor/admin id
   * @returns - The mentor/admin document
   */
  @Get(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(@Param('id') id: Types.ObjectId) {
    const mentor = await this.service.findOne(id);

    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Update mentor/admin info
   * @param id - Mentor/admin Id
   * @param updateMentorDto - Mentor/admin update Dto
   * @returns - New updated mentor/adim document
   */
  @Patch(':id')
  @Roles(Role.Admin)
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

  /** Delete mentor/admin
   * @param id - Mentor/admin id
   * @returns - The deleted mentor/admin document
   */
  @Delete(':id')
  @Roles(Role.Admin)
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
      data: mentor,
    };
  }
}
