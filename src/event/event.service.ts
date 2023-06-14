import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private model: Model<Event>) {}

  /** Create event */
  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    return await new this.model(createEventDto).save();
  }

  /** Get all events by student id */
  async findByStudent(studentId: Types.ObjectId): Promise<Event[]> {
    return await this.model.find({ student: studentId }).exec();
  }

  /** Get all events by mentor id */
  async findByMentor(mentorId: Types.ObjectId): Promise<Event[]> {
    return await this.model.find({ mentor: mentorId }).exec();
  }

  /** Get event */
  async findOne(id: Types.ObjectId): Promise<Event> {
    return await this.model.findById(id).exec();
  }

  /** Update event information */
  async update(
    id: Types.ObjectId,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return await this.model
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
  }

  /** Delete event */
  async delete(id: Types.ObjectId): Promise<Event> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
