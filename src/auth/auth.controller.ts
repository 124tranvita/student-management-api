import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AuthEntity } from './entity/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin-admin')
  @ApiOkResponse({ type: AuthEntity })
  async signinAdmin(@Body() signinDto: SigninDto) {
    const tokens = await this.authService.signinAdmin(
      signinDto.email,
      signinDto.password,
    );

    return {
      status: 'success',
      data: tokens,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user;

    return {
      status: 'success',
      data: user,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  /** Refreshing the token */
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const mentorId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(mentorId, refreshToken);
  }
}
