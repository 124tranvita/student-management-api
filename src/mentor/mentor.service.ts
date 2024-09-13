import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  /** Create document
   * @param createMentorDto Create Dto
   * @returns New created document
   */
  async create(createMentorDto: CreateMentorDto): Promise<MentorDocument> {
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

  // Getting the numbers of documents stored in database
  async count(): Promise<number> {
    return await this.model.countDocuments();
  }

  // Getting the numbers of documents stored in database
  async countByCondition<T>(condition: T): Promise<number> {
    return await this.model.count(condition);
  }
}
