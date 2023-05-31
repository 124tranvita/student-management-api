import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private model: Model<Student>) {}

  /** Create student */
  async create(createStudentDto: CreateStudentDto): Promise<StudentDocument> {
    return await new this.model({
      ...createStudentDto,
      createdAt: new Date(),
    }).save();
  }

  /** Get all students */
  async findAll(): Promise<Student[]> {
    return await this.model.find().exec();
  }

  /** Get student */
  async findOne(id: Types.ObjectId): Promise<Student> {
    return await this.model
      .findById(id)
      .populate({
        path: 'classroom',
        options: {
          select: {
            name: 1,
          },
        },
      })
      .exec();
  }

  /** Update student information */
  async update(
    id: Types.ObjectId,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return await this.model.findByIdAndUpdate(id, updateStudentDto).exec();
  }

  /** Delete student */
  async delete(id: Types.ObjectId): Promise<Student> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
