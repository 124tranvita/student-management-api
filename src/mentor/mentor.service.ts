import { BadRequestException, Injectable } from '@nestjs/common';
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
  /** Create new mentor/admin
   * @param createMentorDto - Create mentor Dto
   * @returns - New added mentor/admin document
   */
  async create(createMentorDto: CreateMentorDto): Promise<Mentor> {
    // If email already registered
    const mentor = await this.model.find({
      email: { $eq: createMentorDto.email },
    });

    if (mentor) {
      throw new BadRequestException(`Email already registered.`);
    }
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createMentorDto.password, salt);
    return await new this.model({
      ...createMentorDto,
      password: hashPassword,
      createdAt: new Date(),
    }).save();
  }

  /** Get all mentors/admins (excluded admin who is querying)
   * @param id - Currently logged in admin's id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of all mentors/admins (excluded admin who is querying) document
   */
  async findAll(
    id: Types.ObjectId,
    role: Role,
    page: number,
    limit: number,
  ): Promise<Mentor[]> {
    return await this.model.aggregate([
      {
        $match: { _id: { $ne: new Types.ObjectId(id) }, roles: { $eq: role } },
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

  /** Get mentor/admin
   * @param id - Menter/admin id
   * @returns - The mentor/admin document
   */
  async findOne(id: Types.ObjectId): Promise<MentorDocument> {
    return await this.model.findById(id).exec();
  }

  /** Update mentor/admin info
   * @param id - Mentor/admin Id
   * @param updateMentorDto - Mentor/admin update Dto
   * @returns - New updated mentor/adim document
   */
  async update(
    id: Types.ObjectId,
    updateMentorDto: UpdateMentorDto,
  ): Promise<MentorDocument> {
    return await this.model
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
  }

  /** Update mentor/admin refresh token
   * @param id - Mentor/admin Id
   * @param updateMentorDto - Mentor/admin update Dto
   * @returns - New updated mentor/adim document
   */
  async updateRefreshToken(
    id: Types.ObjectId,
    updateMentorDto: UpdateMentorDto,
  ): Promise<MentorDocument> {
    return await this.model
      .findByIdAndUpdate(id, updateMentorDto, {
        new: true,
      })
      .exec();
  }

  /** Delete mentor/admin
   * @param id - Mentor/admin id
   * @returns - The deleted mentor/admin document
   */
  async delete(id: Types.ObjectId): Promise<MentorDocument> {
    return await this.model.findByIdAndDelete(id).exec();
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

  // Getting the numbers of documents stored in database
  async count(): Promise<number> {
    return await this.model.countDocuments();
  }

  /** Get mentor by email */
  async findByEmail(email: string): Promise<MentorDocument> {
    return await this.model.findOne({ email }).select('+password').exec();
  }
}
