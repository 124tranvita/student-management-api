import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class } from 'src/class/schemas/class.schema';
import { Student } from 'src/student/schemas/student.schema';

@Injectable()
export class AssignService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  /** Assign student to class */
  async assignStudent(
    classId: Types.ObjectId,
    assignStudentId: Types.ObjectId,
  ): Promise<Class> {
    // Step 1: Get student by Id
    const student = await this.studentModel.findById(assignStudentId);

    // Check if student was not found
    if (!student) {
      throw new NotFoundException(
        `Student with id: ${assignStudentId} was not found.`,
      );
    }

    // Step 2: Check if student already assigned to the classroom
    const isAssigned = await this.classModel
      .find({
        _id: new Types.ObjectId(classId),
        students: { _id: assignStudentId as Types.ObjectId },
      })
      .exec();

    if (isAssigned[0]) {
      throw new NotFoundException(
        `Classroom was not found or student already assigned to this classroom.`,
      );
    }

    // Step 3: Assign student to classroom
    const classroom = await this.classModel.findById(classId);

    classroom.students.push(student);
    student.classes.push(classroom);

    await classroom.save();
    await student.save();

    return classroom;
  }
}
