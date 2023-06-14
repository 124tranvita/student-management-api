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
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly service: EventService) {}

  /** Get all events by student id */
  @Get('/student/:studentId')
  @ApiOkResponse()
  @HttpCode(200)
  async findByStudent(@Param('studentId') studentId: Types.ObjectId) {
    const events = await this.service.findByStudent(studentId);

    return {
      message: 'success',
      result: events.length,
      data: events,
    };
  }

  /** Get all events by mentor */
  @Get('/mentor/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async findByMentor(@Param('mentorId') mentorId: Types.ObjectId) {
    const events = await this.service.findByMentor(mentorId);

    return {
      status: 'success',
      result: events.length,
      data: events,
    };
  }

  /** Get a event */
  @Get(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async findOne(@Param('id') id: Types.ObjectId) {
    const event = await this.service.findOne(id);

    // If no student was found
    if (!event) {
      throw new NotFoundException(`Event with id: ${id} was not found!`);
    }

    return {
      message: 'success',
      data: event,
    };
  }

  /** Add event */
  @Post()
  @ApiOkResponse()
  @HttpCode(201)
  async create(@Body() createEventDto: CreateEventDto) {
    const event = await this.service.create(createEventDto);

    return {
      status: 'success',
      data: event,
    };
  }

  /** Update event */
  @Patch(':id')
  @ApiOkResponse()
  @HttpCode(201)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const event = await this.service.update(id, updateEventDto);

    // If no event was found
    if (!event) {
      throw new NotFoundException(`Event with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: event,
    };
  }

  /** Delete event */
  @Delete(':id')
  @ApiOkResponse()
  @HttpCode(200)
  async delete(@Param('id') id: Types.ObjectId) {
    const event = await this.service.delete(id);

    // If no event was found
    if (!event) {
      throw new NotFoundException(`Event with id: ${id} was not found!`);
    }

    return {
      status: 'success',
      data: {},
    };
  }
}
