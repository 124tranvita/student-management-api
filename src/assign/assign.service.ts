import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Classroom } from 'src/classroom/schemas/classroom.schema';
import { Student } from 'src/student/schemas/student.schema';
import { Assign } from './schemas/assign.schema';
import { AssignStudentToMentor } from './schemas/assign-student-to-mentor.schema';
import { CreateAssignStudentToMentorDto } from './dto/assign-student-to-mentor.dto';
import { AssignClassroomToMentor } from './schemas/assign-classroom-to-mentor.schema';
import { CreateAssignClassroomToMentorDto } from './dto/assign-classroom-to-mentor.dto';
import { CreateAssignMentorToClassroomDto } from './dto/assign-mentor-to-classroom.dto';
import { AssignMentorToClassroom } from './schemas/assign-mentor-to-classroom.schema';

@Injectable()
export class AssignService {
  constructor(
    @InjectModel(Classroom.name) private classModel: Model<Classroom>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Assign.name) private assignModel: Model<Assign>,
    @InjectModel(AssignStudentToMentor.name)
    private assignStudentToMentorModel: Model<AssignStudentToMentor>,
    @InjectModel(AssignClassroomToMentor.name)
    private assignClassroomToMentorModel: Model<AssignClassroomToMentor>,
    @InjectModel(AssignMentorToClassroom.name)
    private assignMentorToClassroomModel: Model<AssignMentorToClassroom>,
  ) {}

  /********************************
   *  MENTOR ASSIGNMENT: STUDENT
   ********************************/

  /** Create a record when assign a student to a mentor complete
   * @param createAssignStudentToMentorDto - Create a assign student to mentor record Dto
   * @returns - A new assigned document
   */
  async createAssignStudentToMentorRecord(
    createAssignStudentToMentorDto: CreateAssignStudentToMentorDto,
  ) {
    const result = await this.assignStudentToMentorModel
      .find({
        student: { $eq: createAssignStudentToMentorDto.student },
      })
      .exec();

    if (result[0]) {
      throw new BadRequestException(
        `Student with id ${createAssignStudentToMentorDto.student} is already assigned to mentor`,
      );
    }

    return await new this.assignStudentToMentorModel({
      ...createAssignStudentToMentorDto,
      assignedAt: new Date(),
    }).save();
  }

  /** Delete assign record when unassign a student from a mentor complete
   * @param id - Assign record Id
   * @param studentId - Student's Id
   * @param mentorId - Mentor's Id
   * @returns - A new assigned document
   */
  async delStudentBelongToMentorRecord(id: Types.ObjectId) {
    return await this.assignStudentToMentorModel.findByIdAndDelete(id).exec();
  }

  /** Find all student assgined to mentor records
   * @param id - Record's Id
   * @returns - Founed assgined records document
   */
  async findStudentBelongToMentorRecord(
    assignedId: Types.ObjectId,
    mentorId: Types.ObjectId,
  ) {
    return await this.assignStudentToMentorModel.findOne({
      _id: { $eq: assignedId },
      mentor: { $eq: mentorId },
    });
  }

  /** Find all assigned students belong to mentor
   * @param options - Find condition
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  async findAllStudentBelongToMentor(
    options: object,
    page: number,
    limit: number,
  ) {
    return await this.assignStudentToMentorModel
      .find(options)
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ assignedAt: -1 })
      .exec();
  }

  /********************************
   *  MENTOR ASSIGNMENT: CLASSROOM
   ********************************/

  /** Create record when assign a classrom to a mentor complete
   * @param createAssignClassroomToMentorDto - Create a assign classroom to mentor record Dto
   * @returns - A new assigned document
   */
  async createAssignClassroomToMentorRecord(
    createAssignClassroomToMentorDto: CreateAssignClassroomToMentorDto,
  ) {
    const result = await this.assignClassroomToMentorModel
      .find({
        mentor: { $eq: createAssignClassroomToMentorDto.mentor },
        classroom: { $eq: createAssignClassroomToMentorDto.classroom },
      })
      .exec();

    if (result[0]) {
      throw new BadRequestException(
        `Classroom with id ${createAssignClassroomToMentorDto.classroom} is already assigned to mentor`,
      );
    }

    return await new this.assignClassroomToMentorModel({
      ...createAssignClassroomToMentorDto,
      assignedAt: new Date(),
    }).save();
  }

  /** Delete assign record when unassign a classroom from a mentor complete
   * @param id - Assign record Id
   * @param classroomId - Classroom's Id
   * @param mentorId - Mentor's Id
   * @returns - A new assigned document
   */
  async delAllClassroomBelongToMentorRecord(id: Types.ObjectId) {
    return await this.assignClassroomToMentorModel.findByIdAndDelete(id).exec();
  }

  /** Find all classrooms assgined to mentor records
   * @param id - Record's Id
   * @returns - Founed assgined record document
   */
  async findAllClassroomBelongToMentorRecord(options: object) {
    return await this.assignClassroomToMentorModel.findOne(options);
  }

  /** Find all assigned classrooms belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  async findAllClassroomBelongToMentor(
    options: object,
    page: number,
    limit: number,
  ) {
    return await this.assignClassroomToMentorModel
      .find(options)
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ assignedAt: -1 })
      .exec();
  }

  // Getting the numbers of documents stored in database
  async countClassroomToMentorByCondition<T>(condition: T): Promise<number> {
    return await this.assignClassroomToMentorModel.count(condition);
  }

  // Getting the numbers of documents stored in database
  async countStudentToMentorByCondition<T>(condition: T): Promise<number> {
    return await this.assignStudentToMentorModel.count(condition);
  }

  /********************************
   *  CLASSROOM ASSIGNMENT: MENTOR
   ********************************/

  /** Create record when assign a classrom to a mentor complete
   * @param createAssignMentorToClassroomDto - Create a assign classroom to mentor record Dto
   * @returns - A new assigned document
   */
  async createAssignMentorToClassroomRecord(
    createAssignMentorToClassroomDto: CreateAssignMentorToClassroomDto,
  ) {
    const result = await this.assignMentorToClassroomModel
      .find({
        mentor: { $eq: createAssignMentorToClassroomDto.mentor },
        classroom: { $eq: createAssignMentorToClassroomDto.classroom },
      })
      .exec();

    if (result[0]) {
      throw new BadRequestException(
        `Classroom with id ${createAssignMentorToClassroomDto.classroom} is already assigned to mentor`,
      );
    }

    return await new this.assignMentorToClassroomModel({
      ...createAssignMentorToClassroomDto,
      assignedAt: new Date(),
    }).save();
  }

  /** Delete assign record when unassign a mentor from classroom complete
   * @param id - Assign record Id
   * @param classroomId - Classroom's Id
   * @param mentorId - Mentor's Id
   * @returns - A new assigned document
   */
  async delMentorBelongToClassroomRecord(id: Types.ObjectId) {
    return await this.assignMentorToClassroomModel.findByIdAndDelete(id).exec();
  }

  /** Find mentor assgined to classroom records
   * @param id - Record's Id
   * @returns - Founed assgined record document
   */
  async findMentorBelongToClassroomRecord(options: object) {
    return await this.assignMentorToClassroomModel.findOne(options);
  }

  /** Find all assigned mentors belong to classroom
   * @param id - classroom's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  async findAllMentorBelongToClassroom(
    options: object,
    page: number,
    limit: number,
  ) {
    return await this.assignMentorToClassroomModel
      .find(options)
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ assignedAt: -1 })
      .exec();
  }

  // Getting the numbers of documents stored in database
  async countMentorToClassroommByCondition<T>(condition: T): Promise<number> {
    return await this.assignMentorToClassroomModel.count(condition);
  }

  /********************************
   *  CLASSROOM ASSIGNMENT: STUDENT
   ********************************/
}
