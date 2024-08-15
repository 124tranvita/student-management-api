import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Classroom, ClassroomDocument } from './schemas/classroom.schema';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(@InjectModel(Classroom.name) private model: Model<Classroom>) {}

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
   * @param options - Query options
   * @param page - Current page
   * @param limit - Limit per page
   * @returns - List of all classroom documents
   */
  async findAll(
    options: object,
    page: number,
    limit: number,
  ): Promise<Classroom[]> {
    return await this.model.aggregate([
      { $match: options },
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
  async findOne(id: string): Promise<ClassroomDocument> {
    // Get doc from DB
    const doc = await this.model.findById(id).exec();

    if (!doc) {
      // MENTOR002: User was not found
      throw new NotFoundException('CLASSR002: Classroom was not found');
    }

    return doc;
  }

  /** Update classroom
   * @param id - Classroom's Id
   * @param updateClassroomDto - Classroom update Dto
   * @returns - Updated classroom
   */
  async update(
    id: string,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<ClassroomDocument> {
    const doc = await this.model
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        [
          {
            $set: { ...updateClassroomDto },
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

    if (!doc) {
      // MENTOR002: User was not found
      throw new NotFoundException('CLASSR002: Classroom was not found');
    }

    return doc;
  }

  /** Delete classroom
   * @param id - Classroom's Id
   * @returns - Deleted classroom document
   */
  async delete(id: string): Promise<ClassroomDocument> {
    const doc = await this.model.findByIdAndDelete(id).exec();

    if (!doc) {
      // MENTOR002: User was not found
      throw new NotFoundException('CLASSR002: Classroom was not found');
    }

    return doc;
  }
}
