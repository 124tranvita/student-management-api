import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MentorDocument, Mentor } from './schemas/mentor.schema';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';

@Injectable()
export class MentorService {
  constructor(@InjectModel(Mentor.name) private model: Model<Mentor>) {}

  /** Create new mentor */
  async create(createMentorDto: CreateMentorDto): Promise<Mentor> {
    return await new this.model({
      ...createMentorDto,
      createdAt: new Date(),
    }).save();
  }

  /** Get all mentors */
  async findAll(): Promise<Mentor[]> {
    return await this.model.find().exec();
  }

  /** Get mentor */
  async findOne(id: Types.ObjectId): Promise<MentorDocument> {
    return await this.model
      .findById(id)
      .populate({
        path: 'classrooms',
      })
      .exec();
  }

  /** Get mentor by email */
  async findByEmail(email: string): Promise<MentorDocument> {
    return await this.model.findOne({ email }).exec();
  }

  /** Update mentor info */
  async update(
    id: Types.ObjectId,
    updateMentorDto: UpdateMentorDto,
  ): Promise<MentorDocument> {
    return await this.model.findByIdAndUpdate(id, updateMentorDto);
  }

  /** Delete mentor */
  async delete(id: Types.ObjectId): Promise<MentorDocument> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
