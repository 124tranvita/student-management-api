import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private model: Model<Student>) {}

  /** ADMIN ROLE */
  /** Create classroom
   * @param createStudentDto - Create student  Dto
   * @returns - New student document
   */
  async create(createStudentDto: CreateStudentDto): Promise<StudentDocument> {
    return await new this.model({
      ...createStudentDto,
      createdAt: new Date(),
    }).save();
  }

  /** Get all students
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of all student documents
   */
  async findAll(page: number, limit: number): Promise<Student[]> {
    return await this.model
      .find()
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .exec();
  }

  /** Get student
   * @param id - student's Id
   * @returns - Founded student document by Id
   */
  async findOne(id: Types.ObjectId): Promise<Student> {
    return await this.model.findById(id).exec();
  }

  /** Update student
   * @param id - Student's Id
   * @param updateClassDto - student update Dto
   * @returns - Updated student
   */
  async update(
    id: Types.ObjectId,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return await this.model
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .exec();
  }

  /** Delete student
   * @param id - Student's Id
   * @returns - Deleted student document
   */
  async delete(id: Types.ObjectId): Promise<Student> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  /** Assign mentor to student
   * @param studentId - Student's Id
   * @param mentorId - Mentor's Id
   * @returns - Update Student document with has belong to mentor
   */
  async assignMentor(studentId: Types.ObjectId, mentorId: Types.ObjectId) {
    return await this.model
      .findByIdAndUpdate(
        studentId,
        {
          mentor: mentorId,
          isAssigned: '1',
        },
        { new: true },
      )
      .exec();
  }

  /** Unassign mentor to student
   * @param studentId - Student's Id
   * @param mentorId - Mentor's Id
   * @returns - Update Student document with has belong to mentor
   */
  async unassignMentor(studentId: Types.ObjectId, mentorId: Types.ObjectId) {
    return await this.model
      .findOneAndUpdate(
        {
          _id: { $eq: studentId },
          mentor: { $eq: mentorId },
        },
        {
          $unset: { mentor: 1 },
          $set: { isAssigned: '0' },
        },
        { new: true },
      )
      .exec();
  }

  /** Get all unassign students
   * @param page - Current page
   * @param limit - Limi per page
   * @returns - List of all students that not assigned to any mentor yet
   */
  async findAllUnassignStud(page: number, limit: number) {
    return this.model
      .find({ mentor: { $eq: undefined } })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .exec();
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
