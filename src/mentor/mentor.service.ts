import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/roles/role.enum';
import { MentorDocument, Mentor } from './schemas/mentor.schema';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';

@Injectable()
export class MentorService {
  constructor(@InjectModel(Mentor.name) private model: Model<Mentor>) {}

  /** ADMIN ROLE */
  /** Create document
   * @param createMentorDto Create Dto
   * @returns New created document
   */
  async create(createMentorDto: CreateMentorDto): Promise<Mentor> {
    // Query by the given email
    const mentor = await this.model.findOne({
      email: { $eq: createMentorDto.email },
    });

    if (mentor) {
      // MENTOR400: Email is duplicated
      throw new BadRequestException(`MENTOR001: Email is duplicated`);
    }
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createMentorDto.password, salt);

    // Write to DB
    return await new this.model({
      ...createMentorDto,
      password: hashPassword,
      createdAt: new Date(),
    }).save();
  }

  /** Get all documents
   * @param options Query options
   * @param page Current page
   * @param limit Limit per page
   * @returns List of queried documents
   */
  async findAll(
    options: object,
    page: number,
    limit: number,
  ): Promise<Mentor[]> {
    return await this.model.aggregate([
      {
        $match: options,
      },
      {
        $addFields: {
          assignedStudent: { $size: { $ifNull: ['$students', []] } },
          assignedClassroom: { $size: { $ifNull: ['$classrooms', []] } },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      { $sort: { createdAt: -1 } },
      { $project: { password: 0 } },
    ]);
  }

  /** Get document
   * @param id - Document's id
   * @returns - Queried document
   */
  async findOne(id: string): Promise<MentorDocument> {
    // Get document from DB
    const doc = await this.model.findById(id).exec();

    if (!doc) {
      // MENTOR002: User was not found
      throw new NotFoundException('MENTOR002: User was not found');
    }

    return doc;
  }

  /** Update document
   * @param id Document's id
   * @param updateMentorDto Update Dto
   * @returns New updated document
   */
  async update(
    id: string,
    updateMentorDto: UpdateMentorDto,
  ): Promise<MentorDocument> {
    // Get and update document from DB
    const doc = this.model
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        [
          {
            $set: { ...updateMentorDto },
          },
          {
            $addFields: {
              assignedStudent: { $size: { $ifNull: ['$students', []] } },
              assignedClassroom: { $size: { $ifNull: ['$classrooms', []] } },
            },
          },
        ],
        {
          new: true,
        },
      )
      .exec();

    if (!doc) {
      // MENTOR002: User was not found
      throw new NotFoundException('MENTOR002: User was not found');
    }

    return doc;
  }

  /** Delete document
   * @param id - Document's Id
   * @returns - The deleted document
   */
  async delete(id: string): Promise<MentorDocument> {
    const doc = this.model.findByIdAndDelete(id).exec();

    if (!doc) {
      // MENTOR002: User was not found
      throw new NotFoundException('MENTOR002: User was not found');
    }

    return doc;
  }

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

  /** Get mentor by email */
  async findByEmail(email: string): Promise<MentorDocument> {
    return await this.model.findOne({ email }).select('+password').exec();
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
