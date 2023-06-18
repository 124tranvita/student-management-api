import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { MentorDocument, Mentor } from './schemas/mentor.schema';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';

@Injectable()
export class MentorService {
  constructor(@InjectModel(Mentor.name) private model: Model<Mentor>) {}

  /** Create new mentor
   * @param createMentorDto - Create mentor Dto
   * @returns - New added mentor
   */
  async create(createMentorDto: CreateMentorDto): Promise<Mentor> {
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createMentorDto.password, salt);
    return await new this.model({
      ...createMentorDto,
      password: hashPassword,
      createdAt: new Date(),
    }).save();
  }

  /** Get all mentors */
  async findAll(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Mentor[]> {
    return await this.model
      .find({ _id: { $ne: id } })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .exec();
  }

  /** Get mentor */
  async findOne(id: Types.ObjectId): Promise<MentorDocument> {
    return await this.model
      .findById(id)
      .populate({
        path: 'classrooms',
      })
      .populate({
        path: 'events',
      })
      .exec();
  }

  /** Get mentor by email */
  async findByEmail(email: string): Promise<MentorDocument> {
    return await this.model.findOne({ email }).select('+password').exec();
  }

  /** Update mentor info */
  async update(
    id: Types.ObjectId,
    updateMentorDto: UpdateMentorDto,
  ): Promise<MentorDocument> {
    return await this.model
      .findByIdAndUpdate(id, updateMentorDto, {
        new: true,
      })
      .populate({
        path: 'classrooms',
      })
      .populate({
        path: 'events',
      })
      .exec();
  }

  /** Delete mentor */
  async delete(id: Types.ObjectId): Promise<MentorDocument> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  // Getting the numbers of documents stored in database
  async count(): Promise<number> {
    return await this.model.countDocuments();
  }
}
