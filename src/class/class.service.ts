import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class, ClassDocument } from './schemas/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(@InjectModel(Class.name) private model: Model<Class>) {}

  /** Create classroom
   * @param createClassDto - Class create Dto
   * @returns - New classroom
   */
  async create(createClassDto: CreateClassDto): Promise<ClassDocument> {
    return await new this.model({
      ...createClassDto,
      createdAt: new Date(),
    }).save();
  }

  /** Get all classrooms
   * @returns - List of all classrooms
   */
  async findAll(): Promise<Class[]> {
    return await this.model.find().exec();
  }

  /** Get classroom
   * @param id - Classroom's Id
   * @returns - Founded classroom by Id
   */
  async findOne(id: Types.ObjectId): Promise<Class> {
    return await this.model.findById(id).exec();
  }

  /** Update classroom
   * @param id - Classroom's Id
   * @param updateClassDto - Classroom update Dto
   * @returns - Updated classroom
   */
  async update(
    id: Types.ObjectId,
    updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return await this.model
      .findByIdAndUpdate(id, updateClassDto, { new: true })
      .exec();
  }

  /** Delete classroom
   * @param id - Classroom's Id
   * @returns - Deleted classroom
   */
  async delete(id: Types.ObjectId): Promise<Class> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  /** Find Classroom for assign table list
   * @param id - Current logged in mentor id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of Classroom that unssigned to logged in menter yet
   */
  async findClassroomList(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Class[]> {
    return await this.model
      .find({ mentors: { $nin: [id] } })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .select('name description languages')
      .exec();
  }

  /** Find a classroom with list of assigned mentors
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Founded classroom with list of assigned mentors (pagination)
   */
  async findAssignedMentorList(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Class> {
    return await this.model
      .findById(id)
      .select('name')
      .populate({
        path: 'assignedMentors',
        options: {
          sort: { name: 1 },
          skip: limit * (page || 1) - limit,
          limit: limit,
          select: {
            studentId: 1,
            name: 1,
            gender: 1,
            status: 1,
            avatar: 1,
          },
        },
      })
      .populate({ path: 'mentorCnt' });
  }

  /** Find a classroom with list of assigned students
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Founded classroom with list of assigned students (pagination)
   */
  async findAssignedStudentList(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Class> {
    return await this.model
      .findById(id)
      .select('name')
      .populate({
        path: 'assignedStudents',
        options: {
          sort: { name: 1 },
          skip: limit * (page || 1) - limit,
          limit: limit,
          select: {
            studentId: 1,
            name: 1,
            gender: 1,
            status: 1,
            avatar: 1,
          },
        },
      })
      .populate({ path: 'studentCnt' });
  }

  /** Assign mentor to classroom
   * @param id - Classroom Id
   * @param mentorId - Current logged in mentor Id
   * @returns - Classroom which current logged in mentor is assigned
   */
  async assignMentor(
    id: Types.ObjectId,
    mentorId: Types.ObjectId,
  ): Promise<Class> {
    return await this.model
      .findOneAndUpdate(
        { _id: id },
        { $push: { mentors: mentorId } },
        { new: true },
      )
      .exec();
  }

  /** Get all classrooms by mentor Id (for mentor role)
   * @param id - Mentor's Id
   * @returns - List of classrooms belong to mentor
   */
  async findAllByMentorId(id: Types.ObjectId): Promise<Class[]> {
    return await this.model.find({ mentors: { $in: [id] } }).exec();
  }

  /** Find if current logged mentor is already existing in classroom
   * @param id - Classroom Id
   * @param mentorId - Current logged in mentor Id
   * @returns - Classroom which current logged in mentor is assigned
   */
  async findExistingDoc(
    id: Types.ObjectId,
    mentorId: Types.ObjectId,
  ): Promise<Class[]> {
    return await this.model
      .find({ _id: { $eq: id }, mentors: { $in: [mentorId] } })
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
