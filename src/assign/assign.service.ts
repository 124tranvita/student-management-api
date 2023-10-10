import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Classroom } from 'src/classroom/schemas/classroom.schema';
import { Student } from 'src/student/schemas/student.schema';
import { Assign } from './schemas/assign.schema';
import { AssignStudentToMentor } from './schemas/assign-student-to-mentor.schema';
import { CreateAssignStudentToMentorDto } from './dto/assign-student-to-mentor.dto';
import { CreateAssignClassroomMentorDto } from './dto/assign-classroom-mentor.dto';
import { AssignClassroomMentor } from './schemas/assign-classroom-mentor.schema';

@Injectable()
export class AssignService {
  constructor(
    @InjectModel(Classroom.name) private classModel: Model<Classroom>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Assign.name) private assignModel: Model<Assign>,
    @InjectModel(AssignStudentToMentor.name)
    private assignStudentToMentorModel: Model<AssignStudentToMentor>,
    @InjectModel(AssignClassroomMentor.name)
    private assignClassroomMentorModel: Model<AssignClassroomMentor>,
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
  async delAssignStudentToMentorRecord(id: Types.ObjectId) {
    return await this.assignStudentToMentorModel.findByIdAndDelete(id).exec();
  }

  /** Find all student assgined to mentor records
   * @param id - Record's Id
   * @returns - Founed assgined records document
   */
  async findAssignStudentToMentorRecord(
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
  async findAllAssignedStudentMentor(
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
   * @param createAssignClassroomMentorDto - Create a assign classroom to mentor record Dto
   * @returns - A new assigned document
   */
  async createAssignMentorClassroomRecord(
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

  /** Delete assign record when unassign a classroom from a mentor complete
   * @param id - Assign record Id
   * @param classroomId - Classroom's Id
   * @param mentorId - Mentor's Id
   * @returns - A new assigned document
   */
  async delAssignMentorClassroomRecord(id: Types.ObjectId) {
    return await this.assignClassroomMentorModel.findByIdAndDelete(id).exec();
  }

  /** Find all classrooms assgined to mentor records
   * @param id - Record's Id
   * @returns - Founed assgined record document
   */
  async findAssignMentorClassroomRecord(options: object) {
    return await this.assignClassroomMentorModel.findOne(options);
  }

  /** Find all assigned classrooms belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  async findAllAssignedMentorClassroom(
    options: object,
    page: number,
    limit: number,
  ) {
    console.log({ options });
    return await this.assignClassroomMentorModel
      .find(options)
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ assignedAt: -1 })
      .exec();
  }

  // Getting the numbers of documents stored in database
  async countClassroomByCondition<T>(condition: T): Promise<number> {
    return await this.assignClassroomMentorModel.count(condition);
  }

  // Getting the numbers of documents stored in database
  async countStudentByCondition<T>(condition: T): Promise<number> {
    return await this.assignStudentToMentorModel.count(condition);
  }
}
