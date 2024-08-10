import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findAllClassrooms(
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

  async findAllStudent(
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

  /**
   * Assign classroom into mentor
   * @param id Mentor's id
   * @param classroomIds List of classroom's id
   * @returns
   */
  async assignClassroom(id: string, classroomIds: string[]): Promise<Mentor> {
    // Convert classroom IDs to ObjectIds
    const classroomIdsObjectId = classroomIds.map(
      (item) => new Types.ObjectId(item),
    );

    // Check if all classroom IDs exist
    const existingClassrooms = await this.classroomModel.find({
      _id: { $in: classroomIdsObjectId },
    });

    if (existingClassrooms.length !== existingClassrooms.length) {
      throw new NotFoundException(
        'ASSIGN001: One or more classrooms not found',
      );
    }

    return await this.mentorModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $addToSet: { classrooms: { $each: classroomIds } } },
      { new: true },
    );
  }

  /**
   * Assign student into mentor
   * @param id Mentor's id
   * @param studentIds List of student's id
   * @returns
   */
  async assignStudent(id: string, studentIds: string[]): Promise<Mentor> {
    // Convert student IDs to ObjectIds
    const studentIdsObjectId = studentIds.map(
      (item) => new Types.ObjectId(item),
    );

    // Check if all student IDs exist
    const existingStudents = await this.studentModel.find({
      _id: { $in: studentIdsObjectId },
    });

    if (existingStudents.length !== studentIdsObjectId.length) {
      throw new NotFoundException('ASSIGN001: One or more students not found');
    }

    return await this.mentorModel.findByIdAndUpdate(
      id,
      { $addToSet: { students: { $each: studentIds } } },
      { new: true },
    );
  }
}
