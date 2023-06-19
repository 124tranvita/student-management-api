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
import { MentorService } from './mentor.service';
import { Types } from 'mongoose';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';

@Controller('mentor')
export class MentorController {
  constructor(private readonly service: MentorService) {}

  /** ADMIN ROLE */
  /** Create new mentor/admin
   * @param createMentorDto - Create mentor Dto
   * @returns - New added mentor/admin document
   */
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

  /** Get all mentors/admins (excluded admin who is querying)
   * @param id - Currently logged in admin's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of all mentors/admins (excluded admin who is querying) document
   */
  @Get()
  @ApiOkResponse()
  @HttpCode(200)
  async findAll(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const mentors = await this.service.findAll(id, page, limit);
    const count = await this.service.count();

    return {
      status: 'success',
      grossCnt: count - 1, //gorssCnt excluded admin who is querying
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

  /** Get all classrooms that assigned to mentor
   * @param id - Mentor's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Mentor document with assigned classrooms list
   */
  @Get('classrooms/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findAssignedClass(id: Types.ObjectId, page: number, limit: number) {
    const mentor = this.service.findAssignedClass(id, page, limit);

    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} was not found`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Get all classrooms that assigned to mentor
   * @param id - Mentor's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Mentor document with assigned classrooms list
   */
  @Get('students/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async findAssignedStudent(id: Types.ObjectId, page: number, limit: number) {
    const mentor = this.service.findAssignedStudent(id, page, limit);

    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} was not found`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }
}
