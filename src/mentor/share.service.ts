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
      // MENTOR002: User was not found
      throw new NotFoundException('MENTOR002: User was not found');
    }

    // Compare given password
    const isPwdValid = await bcrypt.compare(password, doc.password);

    if (!isPwdValid) {
      // MENTOR003: Incorrect password
      throw new BadRequestException('MENTOR003: Incorrect password');
    }

    return doc;
  }

  /** Get document
   * @param id - Document's id
   * @returns - Queried document
   */
  async findOne(id: Types.ObjectId): Promise<MentorDocument> {
    // Get document from DB
    const doc = await this.model.findById(id).exec();

    if (!doc) {
      // MENTOR002: User was not found
      throw new NotFoundException('MENTOR002: User was not found');
    }

    if (!doc.refreshToken) {
      // MENTOR004: Permission denied
      throw new ForbiddenException('MENTOR004: Permission denied');
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
      // MENTOR002: User was not found
      throw new NotFoundException('MENTOR002: User was not found');
    }

    return doc;
  }
}
