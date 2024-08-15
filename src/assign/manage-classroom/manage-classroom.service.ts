import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Classroom,
  ClassroomDocument,
} from 'src/classroom/schemas/classroom.schema';
import { Mentor } from 'src/mentor/schemas/mentor.schema';
import { Student } from 'src/student/schemas/student.schema';

@Injectable()
export class ManageClassroomService {
  constructor(
    @InjectModel(Mentor.name) private mentorModel: Model<Mentor>,
    @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  // Maximum limit of mentors per classroom
  MENTOR_LIMIT = 15;
  // Maximum limit of students per classroom
  STUDENT_LIMIT = 25;

  async findAllAddedMentors(
    options: object,
    page: number,
    limit: number,
  ): Promise<Mentor[]> {
    return await this.mentorModel
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

  // #region Assign Mentor
  /**
   * Assign mentor
   * @param id Classroom's id
   * @param mentorIds List of mentor's id
   * @returns
   */
  async addMentorsToClassroom(
    id: string,
    mentorIds: string[],
  ): Promise<ClassroomDocument> {
    // Start a session
    const session = await this.classroomModel.startSession();

    session.startTransaction();

    try {
      // Convert mentor IDs to ObjectIds
      const mentorIdsObjectId = mentorIds.map(
        (item) => new Types.ObjectId(item),
      );

      // Step 1: Validate Mentor IDs and Counts
      const existingMentors = await this.mentorModel
        .aggregate([
          { $match: { _id: { $in: mentorIdsObjectId } } },
          { $project: { classroomCount: { $size: '$classrooms' } } },
        ])
        .session(session); // Ensure the query is part of the transaction

      if (existingMentors.length !== mentorIdsObjectId.length) {
        throw new NotFoundException('ASSGMT001: One or more mentors not found');
      }

      const invalidMentors = existingMentors.filter(
        (mentor) => mentor.classroomCount >= 5,
      );

      if (invalidMentors.length) {
        throw new BadRequestException(
          'ASSGMT002: One or more mentors exceed the classroom limit',
        );
      }

      // Step 2: Validate Classroom
      const classroom = await this.classroomModel
        .findById(id)
        .select('mentors')
        .session(session);

      if (!classroom) {
        // CLASSR002: Classroom was not found
        throw new NotFoundException('CLASSR002: Classroom was not found');
      }

      // Step 3: Calculate the number of mentors if we add the new ones
      const currentMentorCount = classroom.mentors.length;
      const newTotalCount = currentMentorCount + mentorIdsObjectId.length;

      if (newTotalCount > this.MENTOR_LIMIT) {
        throw new BadRequestException(
          `ASSGMT003: Cannot add mentors. This operation would exceed the limit of ${this.MENTOR_LIMIT} mentors per classroom.`,
        );
      }

      // Step 4: Update Classroom
      const updatedClassroom = await this.classroomModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        { $addToSet: { mentors: { $each: mentorIdsObjectId } } },
        { new: true, session },
      );

      // Step 5: Update Mentors
      await this.mentorModel.updateMany(
        { _id: { $in: mentorIdsObjectId } },
        { $addToSet: { classrooms: new Types.ObjectId(id) } },
        { session },
      );

      // Commit the transaction
      await session.commitTransaction();

      return updatedClassroom;
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      throw error; // Re-throw the error to handle it in the calling function
    } finally {
      // Final phase: Always run this block, regardless of success or failure
      session.endSession();

      // Additional cleanup or logging can be added here
      console.log(
        `Transaction for classroom ${id} with mentors ${mentorIds} has completed.`,
      );
    }
  }

  // #region Assign student
  /**
   * Assign student
   * @param id Classroom's id
   * @param studentIds List of student's id
   * @returns
   */
  async addStudentsToClassroom(
    id: string,
    studentIds: string[],
  ): Promise<ClassroomDocument> {
    // Start a session
    const session = await this.classroomModel.startSession();

    session.startTransaction();

    try {
      // Convert student IDs to ObjectIds
      const studentIdsObjectId = studentIds.map(
        (item) => new Types.ObjectId(item),
      );

      //Step 1: Validate Student IDs
      const existingStudents = await this.studentModel
        .find({
          _id: { $in: studentIdsObjectId },
          classrooms: { $nin: [new Types.ObjectId(id)] }, // Ensure the classroom ID is not in the classrooms array
        })
        .session(session);

      if (existingStudents.length !== existingStudents.length) {
        throw new NotFoundException(
          'ASSGSD001: One or more students not found or already assigned',
        );
      }

      // Step 2: Validate classroom
      const classroom = await this.classroomModel
        .findById(id)
        .select('students')
        .session(session);

      if (!classroom) {
        // CLASSR002: Classroom was not found
        throw new NotFoundException('CLASSR002: Classroom was not found');
      }

      // Step 3: Calculate the number of students if we add the new ones
      const currentStudentCount = classroom.students.length;
      const newTotalCount = currentStudentCount + studentIdsObjectId.length;

      // Step 4: Check if the new total exceeds the limit
      if (newTotalCount > this.STUDENT_LIMIT) {
        throw new BadRequestException(
          `ASSGSD003: Cannot add students. This operation would exceed the limit of ${this.STUDENT_LIMIT} students per classroom.`,
        );
      }

      // Step 4: Update Classroom
      const updatedClassroom = await this.classroomModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        { $addToSet: { students: { $each: studentIdsObjectId } } },
        { new: true, session },
      );

      // Step 5: Update Students
      await this.studentModel.updateMany(
        { _id: { $in: studentIdsObjectId } },
        { $addToSet: { classrooms: new Types.ObjectId(id) } },
        { session },
      );

      // Commit the transaction
      await session.commitTransaction();

      return updatedClassroom;
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      throw error; // Re-throw the error to handle it in the calling function
    } finally {
      // Final phase: Always run this block, regardless of success or failure
      session.endSession();

      // Additional cleanup or logging can be added here
      console.log(
        `Transaction for classroom ${id} with mentors ${studentIds} has completed.`,
      );
    }
  }
}
