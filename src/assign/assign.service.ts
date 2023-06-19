import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Student } from 'src/student/schemas/student.schema';
import { Assign } from './schemas/assign.schema';
import { AssignDto } from './dto/assign.dto';

@Injectable()
export class AssignService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Assign.name) private assignModel: Model<Assign>,
  ) {}

  /** Assign student to class */
  async assignStudent(assignDto: AssignDto): Promise<Student> {
    // Step 1: Check if able to assign student to classroom
    const checkAbleAssignToClass = await this.assignModel.find({
      classroom: { _id: assignDto.classId },
    });

    if (checkAbleAssignToClass.length > 30) {
      throw new BadRequestException(`Classroom is full.`);
    }
    // Step 2: Check if student already assigned to the classroom
    const isAssigned = await this.assignModel.find({
      classroom: { _id: assignDto.classId },
      student: { _id: assignDto.studentId },
    });

    if (isAssigned[0]) {
      throw new NotFoundException(
        `Classroom was not found or student already assigned to this classroom.`,
      );
    }

    // Step 3: Get classroom and student document
    const classroom = await this.classModel
      .findByIdAndUpdate(assignDto.classId, {
        $push: { students: assignDto.studentId },
      })
      .exec();
    const student = await this.studentModel
      .findByIdAndUpdate(
        assignDto.studentId,
        {
          $push: { classes: assignDto.classId },
        },
        { new: true },
      )
      .exec();

    if (!classroom || !student) {
      throw new NotFoundException(
        `Classroom or student with id was not found.`,
      );
    }

    await new this.assignModel({
      classroom,
      student,
      assignedAt: new Date(),
    }).save();

    return student;
  }

  /** Assign student to class */
  async unassignStudent(assignDto: AssignDto): Promise<Class> {
    // Step 1: Check if student already assigned to the classroom
    const isAssigned = await this.assignModel
      .findOneAndRemove({
        classroom: { _id: assignDto.classId },
        student: { _id: assignDto.studentId },
      })
      .exec();

    if (!isAssigned) {
      throw new NotFoundException(
        `Classroom was not found or student has not assigned to this classroom yet.`,
      );
    }

    // Step 2: Get classroom and student document
    const classroom = await this.classModel
      .findByIdAndUpdate(
        assignDto.classId,
        {
          $pull: { students: assignDto.studentId },
        },
        { new: true },
      )
      .exec();
    const student = await this.studentModel
      .findByIdAndUpdate(assignDto.studentId, {
        $pull: { classes: assignDto.classId },
      })
      .exec();

    if (!classroom || !student) {
      throw new NotFoundException(
        `Classroom or student with id was not found.`,
      );
    }

    return await classroom.populate({
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
    });
  }

  /** Assign mentor to classrooms
   * @param mentorId - Current logged in mentor Id
   * @param classId - Array of classroom Id
   * @returns - List of Classroom which mentor is assigned
   */
  async assignMentor(
    mentorId: Types.ObjectId,
    classId: Types.ObjectId,
  ): Promise<Class> {
    return await this.classModel
      .findOneAndUpdate(
        { _id: classId },
        { $push: { mentors: mentorId } },
        { new: true },
      )
      .exec();
  }
}
