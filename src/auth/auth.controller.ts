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
import { GetRefreshTokenDto } from './dto/getRefreshToken.dto';
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOkResponse()
  async refreshTokens(@Body() getRefreshToken: GetRefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(
      getRefreshToken.userId,
      getRefreshToken.refreshToken,
    );

    return {
      status: 'success',
      data: tokens,
    };
  }
}
