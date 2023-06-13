import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(@InjectModel(Class.name) private model: Model<Class>) {}

  /** Create classroom */
  async create(createClassDto: CreateClassDto): Promise<ClassDocument> {
    return await new this.model({
      ...createClassDto,
      createdAt: new Date(),
    }).save();
  }

  /** Get all classrooms */
  async findAll(): Promise<Class[]> {
    return await this.model.find().exec();
  }

  /** Get classroom with members pagination*/
  async findOne(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Class> {
    return await this.model
      .findById(id)
      .populate({
        path: 'members',
        options: {
          sort: {},
          skip: limit * (page || 1) - limit,
          limit: limit,
          select: {
            studentId: 1,
            name: 1,
            gender: 1,
            status: 1,
            avatar: 1,
          },
        },
      })
      .populate({
        path: 'assigned',
      })
      .exec();
  }

  /** Update classroom information */
  async update(
    id: Types.ObjectId,
    page: number,
    limit: number,
    updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return await this.model
      .findByIdAndUpdate(id, updateClassDto, { new: true })
      .populate({
        path: 'members',
        options: {
          sort: {},
          skip: limit * (page || 1) - limit,
          limit: limit,
          select: {
            studentId: 1,
            name: 1,
            gender: 1,
            status: 1,
            avatar: 1,
          },
        },
      })
      .populate({
        path: 'assigned',
      })
      .exec();
  }

  /** Delete classroom */
  async delete(id: Types.ObjectId): Promise<Class> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
