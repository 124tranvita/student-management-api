import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { MentorShareService } from 'src/mentor/share.service';
import { Role } from './roles/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private mentorShareService: MentorShareService,
    private jwtService: JwtService,
  ) {}

  /** Hashing data using bcrypt
   * @param data - data to be hashed
   */
  async hashData(data: string) {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    return await bcrypt.hash(data, salt);
  }

  /** Signin
   * @param email - Email
   * @param password - Password
   */
  async signinAdmin(email: string, password: string): Promise<any> {
    // Step 1: Fetch a mentor with the given email
    const mentor = await this.mentorShareService.getUser(
      email,
      password,
      Role.Admin,
    );
    // Step 2: Generate a JWT contianing the mentor's `id` and `email`
    const tokens = await this.getTokens(mentor._id, mentor.email, mentor.roles);

    // Hash refresh token
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);

    // Update refresh
    await this.mentorShareService.updateRefreshToken(mentor._id, {
      refreshToken: hashedRefreshToken,
    });

    return tokens;
  }

  /** Generate Access token and Refresh token
   * @param id User's id
   * @param email - User's email
   */
  async getTokens(id: Types.ObjectId, email: string, roles: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
          roles,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRE,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
          roles,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_TOKEN_EXPIRE,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /** Refreshing the Tokens
   * @param id User's Id
   * @param refreshToken User's refresh token
   */
  async refreshTokens(id: Types.ObjectId, refreshToken: string) {
    // Step 1: Fetch a mentor with the given id
    const mentor = await this.mentorShareService.findOne(id);

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
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);

    await this.mentorShareService.updateRefreshToken(mentor._id, {
      refreshToken: hashedRefreshToken,
    });

    return tokens;
  }

  /**
   * Clear `refreshToken` on logout
   *  @param id User's Id
   */
  async logout(id: Types.ObjectId) {
    return this.mentorShareService.updateRefreshToken(id, {
      refreshToken: null,
    });
  }
}
