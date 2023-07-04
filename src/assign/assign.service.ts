import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Classroom } from 'src/classroom/schemas/classroom.schema';
import { Student } from 'src/student/schemas/student.schema';
import { Assign } from './schemas/assign.schema';
import { AssignStudentMentor } from './schemas/assign-student-mentor.schema';
import { CreateAssignStudentMentorDto } from './dto/assign-student-mentor.dto';
import { CreateAssignClassroomMentorDto } from './dto/assign-classroom-mentor.dto';
import { AssignClassroomMentor } from './schemas/assign-classroom-mentor.schema';

@Injectable()
export class AssignService {
  constructor(
    @InjectModel(Classroom.name) private classModel: Model<Classroom>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Assign.name) private assignModel: Model<Assign>,
    @InjectModel(AssignStudentMentor.name)
    private assignStudentMentorModel: Model<AssignStudentMentor>,
    @InjectModel(AssignClassroomMentor.name)
    private assignClassroomMentorModel: Model<AssignClassroomMentor>,
  ) {}

  // /** Assign student to class */
  // async assignStudent(assignDto: AssignDto): Promise<Student> {
  //   // Step 1: Check if able to assign student to classroom
  //   const checkAbleAssignToClass = await this.assignModel.find({
  //     classroom: { _id: assignDto.classId },
  //   });

  //   if (checkAbleAssignToClass.length > 30) {
  //     throw new BadRequestException(`Classroom is full.`);
  //   }
  //   // Step 2: Check if student already assigned to the classroom
  //   const isAssigned = await this.assignModel.find({
  //     classroom: { _id: assignDto.classId },
  //     student: { _id: assignDto.studentId },
  //   });

  //   if (isAssigned[0]) {
  //     throw new NotFoundException(
  //       `Classroom was not found or student already assigned to this classroom.`,
  //     );
  //   }

  //   // Step 3: Get classroom and student document
  //   const classroom = await this.classModel
  //     .findByIdAndUpdate(assignDto.classId, {
  //       $push: { students: assignDto.studentId },
  //     })
  //     .exec();
  //   const student = await this.studentModel
  //     .findByIdAndUpdate(
  //       assignDto.studentId,
  //       {
  //         $push: { classes: assignDto.classId },
  //       },
  //       { new: true },
  //     )
  //     .exec();

  //   if (!classroom || !student) {
  //     throw new NotFoundException(
  //       `Classroom or student with id was not found.`,
  //     );
  //   }

  //   await new this.assignModel({
  //     classroom,
  //     student,
  //     assignedAt: new Date(),
  //   }).save();

  //   return student;
  // }

  // /** Assign student to class */
  // async unassignStudent(assignDto: AssignDto): Promise<Classroom> {
  //   // Step 1: Check if student already assigned to the classroom
  //   const isAssigned = await this.assignModel
  //     .findOneAndRemove({
  //       classroom: { _id: assignDto.classId },
  //       student: { _id: assignDto.studentId },
  //     })
  //     .exec();

  //   if (!isAssigned) {
  //     throw new NotFoundException(
  //       `Classroom was not found or student has not assigned to this classroom yet.`,
  //     );
  //   }

  //   // Step 2: Get classroom and student document
  //   const classroom = await this.classModel
  //     .findByIdAndUpdate(
  //       assignDto.classId,
  //       {
  //         $pull: { students: assignDto.studentId },
  //       },
  //       { new: true },
  //     )
  //     .exec();
  //   const student = await this.studentModel
  //     .findByIdAndUpdate(assignDto.studentId, {
  //       $pull: { classes: assignDto.classId },
  //     })
  //     .exec();

  //   if (!classroom || !student) {
  //     throw new NotFoundException(
  //       `Classroom or student with id was not found.`,
  //     );
  //   }

  //   return await classroom.populate({
  //     path: 'members',
  //     options: {
  //       select: {
  //         studentId: 1,
  //         name: 1,
  //         gender: 1,
  //         status: 1,
  //         avatar: 1,
  //       },
  //     },
  //   });
  // }

  // /** Assign mentor to classrooms
  //  * @param mentorId - Current logged in mentor Id
  //  * @param classId - Array of classroom Id
  //  * @returns - List of Classroom which mentor is assigned
  //  */
  // async assignMentor(
  //   mentorId: Types.ObjectId,
  //   classId: Types.ObjectId,
  // ): Promise<Classroom> {
  //   return await this.classModel
  //     .findOneAndUpdate(
  //       { _id: classId },
  //       { $push: { mentors: mentorId } },
  //       { new: true },
  //     )
  //     .exec();
  // }

  /********************************
   *
   *  STUDENT -> MENTOR ASSIGNMENT
   *
   ********************************/

  /** Create record when assign a student to a mentor
   * @param createAssignStudentMentorDto - Create a assign student to mentor record Dto
   * @returns - A new assigned document
   */
  async createAssignStudentMentorRecord(
    createAssignStudentMentorDto: CreateAssignStudentMentorDto,
  ) {
    const result = await this.assignStudentMentorModel
      .find({
        student: { $eq: createAssignStudentMentorDto.student },
      })
      .exec();

    if (result[0]) {
      throw new BadRequestException(
        `Student with id ${createAssignStudentMentorDto.student} is already assigned to mentor`,
      );
    }

    return await new this.assignStudentMentorModel({
      ...createAssignStudentMentorDto,
      assignedAt: new Date(),
    }).save();
  }

  /** Delete assign record when unassign a student from a mentor
   * @param id - Assign record Id
   * @param studentId - Student's Id
   * @param mentorId - Mentor's Id
   * @returns - A new assigned document
   */
  async delAssignStudentMentorRecord(id: Types.ObjectId) {
    return await this.assignStudentMentorModel.findByIdAndDelete(id).exec();
  }

  /** Find all student assgined to mentor record
   * @param id - Record's Id
   * @returns - Founed assgined record document
   */
  async findAssignStudentMentorRecord(
    assignedId: Types.ObjectId,
    mentorId: Types.ObjectId,
  ) {
    return await this.assignStudentMentorModel.findOne({
      _id: { $eq: assignedId },
      mentor: { $eq: mentorId },
    });
  }

  /** Find all assigned students belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  async findAllAssignedStudentMentor(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    return await this.assignStudentMentorModel
      .find({
        mentor: { $eq: id },
      })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ assignedAt: -1 })
      .exec();
  }

  /********************************
   *
   *  CLASSROOM -> MENTOR ASSIGNMENT
   *
   ********************************/

  /** Create record when assign a classrom to a mentor
   * @param createAssignClassroomMentorDto - Create a assign classroom to mentor record Dto
   * @returns - A new assigned document
   */
  async createAssignClassroomMentorRecord(
    createAssignClassroomMentorDto: CreateAssignClassroomMentorDto,
  ) {
    const result = await this.assignClassroomMentorModel
      .find({
        mentor: { $eq: createAssignClassroomMentorDto.mentor },
        classroom: { $eq: createAssignClassroomMentorDto.classroom },
      })
      .exec();

    if (result[0]) {
      throw new BadRequestException(
        `Classroom with id ${createAssignClassroomMentorDto.classroom} is already assigned to mentor`,
      );
    }

    return await new this.assignClassroomMentorModel({
      ...createAssignClassroomMentorDto,
      assignedAt: new Date(),
    }).save();
  }

  /** Delete assign record when unassign a classroom from a mentor
   * @param id - Assign record Id
   * @param classroomId - Classroom's Id
   * @param mentorId - Mentor's Id
   * @returns - A new assigned document
   */
  async delAssignClassroomMentorRecord(id: Types.ObjectId) {
    return await this.assignClassroomMentorModel.findByIdAndDelete(id).exec();
  }

  /** Find all student assgined to mentor record
   * @param id - Record's Id
   * @returns - Founed assgined record document
   */
  async findAssignClassroomMentorRecord(
    assignedId: Types.ObjectId,
    mentorId: Types.ObjectId,
  ) {
    return await this.assignClassroomMentorModel.findOne({
      _id: { $eq: assignedId },
      mentor: { $eq: mentorId },
    });
  }

  /** Find all assigned students belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  async findAllAssignedClassroomMentor(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    return await this.assignClassroomMentorModel
      .find({
        mentor: { $eq: id },
      })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ assignedAt: -1 })
      .exec();
  }
}
