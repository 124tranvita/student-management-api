import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { MentorService } from 'src/mentor/mentor.service';
import { Role } from './roles/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private mentorService: MentorService,
    private jwtService: JwtService,
  ) {}

  /** Signin mentor
   * @param email - Mentor's email
   * @param password - Mentor's password
   */
  async signinAdmin(email: string, password: string): Promise<any> {
    // Step 1: Fetch a mentor with the given email
    const mentor = await this.mentorService.findByEmail(email);

    // If no mentor is found, throw an error
    if (!mentor) {
      throw new NotFoundException(`Email does not exist.`);
    }

    // If mentor is nod admin
    if (mentor.roles === Role.Mentor) {
      throw new ForbiddenException(`Permission denied.`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, mentor.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password.`);
    }

    // Step 3: Generate a JWT contianing the mentor's ID and return it
    const tokens = await this.getTokens(mentor._id, mentor.email, mentor.roles);
    await this.updateRefreshToken(mentor._id, tokens.refreshToken);

    return tokens;
  }

  async logout(mentorId: Types.ObjectId) {
    return this.mentorService.update(mentorId, { refreshToken: null });
  }

  /** Hashing data using bcrypt
   * @param data - data to be hashed
   */
  async hashData(data: string) {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    return await bcrypt.hash(data, salt);
  }

  /** Update new refresh token and assign to mentor
   * @param mentorId - mentor's Id
   * @param refreshToken - Generated refresh token from getTokens()
   */
  async updateRefreshToken(mentorId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.mentorService.updateRefreshToken(mentorId, {
      refreshToken: hashedRefreshToken,
    });
  }

  /** Generate Access Token and Refresh Toekn from mentorId and mentor Email
   * @param mentorId - mentor's Id
   * @param email - mentor's email
   */
  async getTokens(mentorId: Types.ObjectId, email: string, roles: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: mentorId,
          email,
          roles,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '5m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: mentorId,
          email,
          roles,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /** Refreshing the Tokens
   * @param mentorId - mentor's Id
   * @param refreshToken - mentor's refresh token
   */
  async refreshTokens(mentorId: Types.ObjectId, refreshToken: string) {
    // Step 1: Fetch a mentor with the given mentorId
    const mentor = await this.mentorService.findOne(mentorId);

    // If no mentor is found or mentor's token not found, throw an error
    if (!mentor || !mentor.refreshToken) {
      throw new ForbiddenException('Access Denied.');
    }

    // Step 2: Check if the refresh token is correct
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      mentor.refreshToken,
    );

    // If refresh token does not mtach, throw an error
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied.');
    }

    // Step 3: Generate a tokens contianing the mentor's ID
    const tokens = await this.getTokens(mentor._id, mentor.email, mentor.roles);

    // Step 4: Update the new Refresh token for mentor
    await this.updateRefreshToken(mentor._id, tokens.refreshToken);

    return tokens;
  }
}
