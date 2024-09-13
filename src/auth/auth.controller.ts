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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { GetRefreshTokenDto } from './dto/getRefreshToken.dto';
import { AuthEntity } from './entity/auth.entity';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin-admin')
  @HttpCode(HttpStatus.OK)
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
  @Get('signout')
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  /** Refreshing the token */
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() getRefreshToken: GetRefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(
      new Types.ObjectId(getRefreshToken.userId),
      getRefreshToken.refreshToken,
    );

    return {
      status: 'success',
      data: tokens,
    };
  }
}
