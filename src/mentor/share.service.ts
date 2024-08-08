import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { MentorDocument, Mentor } from './schemas/mentor.schema';
import { UpdateMentorDto } from './dto/update-mentor.dto';

@Injectable()
export class MentorShareService {
  constructor(@InjectModel(Mentor.name) private model: Model<Mentor>) {}

  /** AUTHENTICATION */
  /**
   * Get user by email
   * @param email Email
   * @param roles Role
   * @returns Uer found by given email
   */
  async getUser(
    email: string,
    password: string,
    roles = Role.Mentor,
  ): Promise<MentorDocument> {
    // Get document from DB
    const doc = await this.model
      .findOne({ email, roles })
      .select('+password')
      .exec();

    if (!doc) {
      // AUTH404: Email was not found
      throw new NotFoundException('AUTH404');
    }

    // Compare given password
    const isPwdValid = await bcrypt.compare(password, doc.password);

    if (!isPwdValid) {
      // AUTH400: Password invalid
      throw new BadRequestException(`AUTH400`);
    }

    return doc;
  }

  /** Get document
   * @param id - Document's id
   * @returns - Queried document
   */
  async findOne(id: string): Promise<MentorDocument> {
    // Get document from DB
    const doc = await this.model.findById(id).exec();

    if (!doc) {
      // MENTOR404: Mentor is not found
      throw new NotFoundException('MENTOR404');
    }

    if (!doc.refreshToken) {
      // AUTH403: Access denied
      throw new ForbiddenException('AUTH403.');
    }

    return doc;
  }

  /** Update user refresh token
   * @param id Usern Id
   * @param updateMentorDto Update Dto
   * @returns Updated document
   */
  async updateRefreshToken(
    id: Types.ObjectId,
    updateMentorDto: UpdateMentorDto,
  ): Promise<MentorDocument> {
    const doc = await this.model
      .findByIdAndUpdate(id, updateMentorDto, {
        new: true,
      })
      .exec();

    if (!doc) {
      // AUTH404: Email was not found
      throw new NotFoundException('AUTH404');
    }

    return doc;
  }

  /** ASSIGN MANAGEMENT */

  /** Get all classrooms that assigned to mentor
   * @param id - Mentor's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Mentor document with assigned classrooms list
   */
  async findAssignedClass(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Mentor> {
    return await this.model
      .findById(id)
      .populate({
        path: 'assignedClasses',
        options: {
          sort: { name: 1 },
          skip: limit * (page || 1) - limit,
          limit: limit,
          select: { name: 1 },
        },
      })
      .exec();
  }

  /** Get all students that assigned to mentor
   * @param id - Mentor's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Mentor document with assigned students list
   */
  async findAssignedStudent(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Mentor> {
    return await this.model
      .findById(id)
      .populate({
        path: 'assignedStudents',
        options: {
          sort: { name: 1 },
          skip: limit * (page || 1) - limit,
          limit: limit,
          select: { name: 1, studentId: 1 },
        },
      })
      .exec();
  }

  /** Assign student to mentor
   * @param mentorId - Mentor's Id
   * @param studentId - Student's Id
   * @returns - Update Mentor document with has belong to mentor
   */
  async assignStudent(mentorId: Types.ObjectId, studentId: Types.ObjectId) {
    const mentor = await this.model
      .findOne({
        _id: mentorId,
        students: { $in: [studentId] },
      })
      .exec();

    if (mentor) {
      throw new BadRequestException(
        `Student with id ${studentId} is already assigned to this mentor`,
      );
    }
    return await this.model
      .findByIdAndUpdate(
        mentorId,
        {
          $push: { students: studentId },
        },
        { new: true },
      )
      .exec();
  }

  /** Unassign student from mentor
   * @param mentorId - Mentor's Id
   * @param studentId - Student's Id
   * @returns - Update Mentor document with has belong to mentor
   */
  async unassignStudent(mentorId: Types.ObjectId, studentId: Types.ObjectId) {
    return await this.model
      .findByIdAndUpdate(
        mentorId,
        {
          $pull: { students: studentId },
        },
        { new: true },
      )
      .exec();
  }

  /********************************
   *
   *  CLASSROOM -> MENTOR ASSIGNMENT
   *
   ********************************/

  /** Assign classroom to mentor
   * @param mentorId - Mentor's Id
   * @param classroomId - Classroom's Id
   * @returns - Update Mentor document with has belong to mentor
   */
  async assignClassroom(mentorId: Types.ObjectId, classroomId: Types.ObjectId) {
    const mentor = await this.model
      .findOne({
        _id: mentorId,
        classrooms: { $in: [classroomId] },
      })
      .exec();

    if (mentor) {
      throw new BadRequestException(
        `Classroom with id ${classroomId} is already assigned to this mentor`,
      );
    }
    return await this.model
      .findByIdAndUpdate(
        mentorId,
        {
          $push: { classrooms: classroomId },
        },
        { new: true },
      )
      .exec();
  }

  /** Unassign classroom from mentor
   * @param mentorId - Mentor's Id
   * @param classroomId - Classroom's Id
   * @returns - Update Mentor document with has belong to mentor
   */
  async unassignClassroom(
    mentorId: Types.ObjectId,
    classroomId: Types.ObjectId,
  ) {
    return await this.model
      .findByIdAndUpdate(
        mentorId,
        {
          $pull: { classrooms: classroomId },
        },
        { new: true },
      )
      .exec();
  }

  /********************************
   *
   *  CLASSROOM ASSIGNMENT -> MENTOR
   *
   ********************************/

  /** Find all mentors that not assinged to classroomId yet
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   */
  async findAllUnassignMentorClassroom(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    return await this.model.aggregate([
      {
        $match: {
          classrooms: { $nin: [new Types.ObjectId(id)] },
          roles: { $eq: Role.Mentor },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      { $sort: { name: -1 } },
      { $project: { password: 0 } },
    ]);
  }

  // Getting the numbers of documents stored in database
  async count(): Promise<number> {
    return await this.model.countDocuments();
  }

  // Getting the numbers of documents stored in database
  async countByCondition<T>(condition: T): Promise<number> {
    return await this.model.count(condition);
  }
}
