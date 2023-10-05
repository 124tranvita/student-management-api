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

  /********************************
   *  MENTOR ASSIGNMENT: STUDENT
   ********************************/

  /** Create a record when assign a student to a mentor complete
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

  /** Delete assign record when unassign a student from a mentor complete
   * @param id - Assign record Id
   * @param studentId - Student's Id
   * @param mentorId - Mentor's Id
   * @returns - A new assigned document
   */
  async delAssignStudentMentorRecord(id: Types.ObjectId) {
    return await this.assignStudentMentorModel.findByIdAndDelete(id).exec();
  }

  /** Find all student assgined to mentor records
   * @param id - Record's Id
   * @returns - Founed assgined records document
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
    queryString?: string,
  ) {
    let options = {};

    if (queryString) {
      options = {
        mentor: { $eq: id },
        $text: { $search: `\"${queryString}\"` },
      };
    } else {
      options = {
        mentor: { $eq: id },
      };
    }

    return await this.assignStudentMentorModel
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
    return await this.assignStudentMentorModel.count(condition);
  }
}
