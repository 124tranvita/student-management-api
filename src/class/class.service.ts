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

  /** Get classroom */
  async findOne(id: Types.ObjectId): Promise<Class> {
    return await this.model
      .findById(id)
      .populate({
        path: 'members',
        options: {
          select: {
            studentId: 1,
            name: 1,
            gender: 1,
            status: 1,
            avatar: 1,
          },
        },
      })
      .exec();
  }

  /** Update classroom information */
  async update(
    id: Types.ObjectId,
    updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return await this.model
      .findByIdAndUpdate(id, updateClassDto, { new: true })
      .populate({
        path: 'members',
        options: {
          select: {
            studentId: 1,
            name: 1,
            gender: 1,
            status: 1,
            avatar: 1,
          },
        },
      })
      .exec();
  }

  /** Delete classroom */
  async delete(id: Types.ObjectId): Promise<Class> {
    return await this.model.findByIdAndDelete(id, { new: true }).exec();
  }
}
