import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request as RequestType } from 'express';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AuthEntity } from './entity/auth.entity';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOkResponse({ type: AuthEntity })
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto.email, signinDto.password);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Request() req: RequestType) {
    return req.user;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Request() req: RequestType) {
    console.log({ user: req.user });
    this.authService.logout(req.user['sub']);
  }

  /** Refreshing the token */
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req: RequestType) {
    const mentorId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(mentorId, refreshToken);
  }
}
