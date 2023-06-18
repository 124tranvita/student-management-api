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

  /** Create new mentor
   * @param createMentorDto - Create mentor Dto
   * @returns - New added mentor
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
      grossCnt: count - 1, //gorssCnt exclude current mentor
      data: mentors,
    };
  }

  /** Get a mentor */
  @Get(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(@Param('id') id: Types.ObjectId) {
    const mentor = await this.service.findOne(id);

    // If no mentor was found
    if (!mentor) {
      throw new NotFoundException(`Mentor with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Update mentor */
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

  /** Delete mentor */
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
}
