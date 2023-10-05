import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Classroom, ClassroomDocument } from './schemas/classroom.schema';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(@InjectModel(Classroom.name) private model: Model<Classroom>) {}

  /** ADMIN ROLE */
  /** Create classroom
   * @param createClassroomDto - Create class  Dto
   * @returns - New classroom document
   */
  async create(
    createClassroomDto: CreateClassroomDto,
  ): Promise<ClassroomDocument> {
    return await new this.model({
      ...createClassroomDto,
      createdAt: new Date(),
    }).save();
  }

  /** Get all classrooms
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of all classroom documents
   */
  async findAll(page: number, limit: number): Promise<Classroom[]> {
    return await this.model.aggregate([
      {
        $addFields: {
          assignedStudent: { $size: { $ifNull: ['$students', []] } },
          assignedMentor: { $size: { $ifNull: ['$mentors', []] } },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      { $sort: { createdAt: -1 } },
    ]);
  }

  /** Get classrooms base on search query string
   * @param queryString - Search keyword
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of all classroom documents
   */
  async search(
    queryString: string,
    page: number,
    limit: number,
  ): Promise<Classroom[]> {
    return await this.model.aggregate([
      {
        $match: {
          $text: { $search: `\"${queryString}\"` }, // Searching with Full Phrases
        },
      },
      {
        $addFields: {
          assignedStudent: { $size: { $ifNull: ['$students', []] } },
          assignedMentor: { $size: { $ifNull: ['$mentors', []] } },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      { $sort: { createdAt: -1 } },
    ]);
  }

  /** Get classroom
   * @param id - Classroom's Id
   * @returns - Founded classroom document by Id
   */
  async findOne(id: Types.ObjectId): Promise<Classroom> {
    return await this.model.findById(id).exec();
  }

  /** Update classroom
   * @param id - Classroom's Id
   * @param updateClassroomDto - Classroom update Dto
   * @returns - Updated classroom
   */
  async update(
    id: Types.ObjectId,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<Classroom> {
    return await this.model
      .findByIdAndUpdate(
        id,
        [
          {
            $set: updateClassroomDto,
          },
          {
            $addFields: {
              assignedStudent: { $size: { $ifNull: ['$students', []] } },
              assignedMentor: { $size: { $ifNull: ['$mentors', []] } },
            },
          },
          { $project: { password: 0 } },
        ],
        { new: true },
      )
      .exec();
  }

  /** Delete classroom
   * @param id - Classroom's Id
   * @returns - Deleted classroom document
   */
  async delete(id: Types.ObjectId): Promise<Classroom> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  /*************************
   *
   *  MENTOR ASSIGNMENT
   *
   ************************* */

  /** Find all classrooms that unassign to any mentor yet
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @param queryString - Search query string
   * @returns - List of Classroom that unssigned to mentor
   */
  async findAllUnassignClassroomMentor(
    id: Types.ObjectId,
    page: number,
    limit: number,
    queryString: string,
  ): Promise<Classroom[]> {
    let options = {};

    if (queryString) {
      options = {
        mentors: { $nin: [new Types.ObjectId(id)] },
        $text: { $search: `\"${queryString}\"` }, // Searching with Full Phrases
      };
    } else {
      options = {
        mentors: { $nin: [new Types.ObjectId(id)] },
      };
    }

    return await this.model.aggregate([
      { $match: options },
      {
        $addFields: {
          assginedMentor: { $size: { $ifNull: ['$mentors', []] } },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      { $sort: { createdAt: -1 } },
    ]);
  }

  /** Find all classrooms that assigned to mentor
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of Classroom that unssigned to mentor
   */
  async findAllAssignedClassroomMentor(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Classroom[]> {
    return await this.model
      .find({ mentors: { $in: [id] } })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .select('name description languages createdAt cover')
      .exec();
  }

  /** Assign mentor to classroom
   * @param id - Classroom Id
   * @param mentorId - Current logged in mentor Id
   * @returns - Classroom which current logged in mentor is assigned
   */
  async assignMentor(
    id: Types.ObjectId,
    mentorId: Types.ObjectId,
  ): Promise<ClassroomDocument> {
    return await this.model
      .findOneAndUpdate(
        { _id: id },
        { $push: { mentors: mentorId } },
        { new: true },
      )
      .exec();
  }

  /** Assign mentor to classroom
   * @param id - Classroom Id
   * @param mentorId - Current logged in mentor Id
   * @returns - Classroom which current logged in mentor is assigned
   */
  async unassignMentor(
    id: Types.ObjectId,
    mentorId: Types.ObjectId,
  ): Promise<Classroom> {
    return await this.model
      .findOneAndUpdate(id, { $pull: { mentors: mentorId } }, { new: true })
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
  ): Promise<Classroom> {
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
  ): Promise<Classroom> {
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

  /*************************
   *
   *  STUDENT ASSIGNMENT
   *
   ************************* */
  /** Find all classrooms that unassign to student's id
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of Classroom that unssigned to mentor
   */
  async findAllUnassignClassroomStudent(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Classroom[]> {
    return await this.model.aggregate([
      { $match: { students: { $nin: [new Types.ObjectId(id)] } } },
      {
        $addFields: {
          assginedStudents: { $size: { $ifNull: ['$students', []] } },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 },
      { $sort: { createdAt: -1 } },
    ]);
  }

  /** Find if current logged mentor is already existing in classroom
   * @param id - Classroom Id
   * @param mentorId - Current logged in mentor Id
   * @returns - Classroom which current logged in mentor is assigned
   */
  async findExistingDoc(
    id: Types.ObjectId,
    mentorId: Types.ObjectId,
  ): Promise<Classroom[]> {
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

  /** MENTOR ROLE */
  /** Get all classrooms by mentor Id (for mentor role)
   * @param id - Mentor's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of classrooms belong to mentor
   */
  async findAllByMentor(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Classroom[]> {
    return await this.model
      .find({ mentors: { $in: [id] } })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .exec();
  }

  /** Get a classroom (for mentor role)
   * @param id - Classroom's Id
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - Classroom with pagination assgined student
   */
  async findOneByMentor(
    id: Types.ObjectId,
    page: number,
    limit: number,
  ): Promise<Classroom> {
    return await this.model
      .findById(id)
      .populate({
        path: 'assignedStudents',
        options: {
          sort: {},
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
      .populate({
        path: 'studentCnt',
      })
      .exec();
  }
}
