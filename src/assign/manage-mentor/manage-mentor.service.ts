import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Classroom } from 'src/classroom/schemas/classroom.schema';
import { Mentor } from 'src/mentor/schemas/mentor.schema';
import { Student } from 'src/student/schemas/student.schema';

@Injectable()
export class ManageMentorService {
  constructor(
    @InjectModel(Mentor.name) private mentorModel: Model<Mentor>,
    @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async findAllAddedClassrooms(
    options: object,
    page: number,
    limit: number,
  ): Promise<Classroom[]> {
    return await this.classroomModel
      .find(options)
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllAddedStudents(
    options: object,
    page: number,
    limit: number,
  ): Promise<Student[]> {
    return await this.studentModel
      .find(options)
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .exec();
  }
}
