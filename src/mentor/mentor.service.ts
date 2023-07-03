import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
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
    page: number,
    limit: number,
  ): Promise<Mentor[]> {
    return await this.model
      .find({ _id: { $ne: id } })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .exec();
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
   * @param id - Mentor's Id
   * @param studentId - Student's Id
   * @returns - Update Mentor document with has belong to mentor
   */
  async studentAssigned(id: Types.ObjectId, studentId: Types.ObjectId) {
    const mentor = await this.model
      .findOne({
        _id: id,
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
        id,
        {
          $push: { students: studentId },
        },
        { new: true },
      )
      .exec();
  }

  /** Unassign student from mentor
   * @param id - Mentor's Id
   * @param studentId - Student's Id
   * @returns - Update Mentor document with has belong to mentor
   */
  async studentUnassigned(id: Types.ObjectId, studentId: Types.ObjectId) {
    return await this.model
      .findByIdAndUpdate(
        id,
        {
          $pull: { students: studentId },
        },
        { new: true },
      )
      .exec();
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
