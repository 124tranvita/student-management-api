import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ManageMentorService } from './manage-mentor.service';
import { Types } from 'mongoose';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@ApiTags('assign/mentor')
@Controller('assign/mentor/:id')
export class ManageMentorController {
  constructor(private readonly service: ManageMentorService) {}

  @Get('classroom')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: false,
    description: 'ID of the mentor',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Current page',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit per page',
    type: Number,
  })
  @ApiQuery({
    name: 'queryString',
    required: false,
    description: 'Search query string',
    type: String,
  })
  async findAllClassrooms(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
  ) {
    // Declare `options` object
    const options: any = {
      mentors: { $in: [new Types.ObjectId(id)] },
    };

    // Update `options` when `queryString` is existing
    if (queryString) {
      options.$text = { $search: `\"${queryString}\"` };
    }

    const result = await this.service.findAllClassrooms(
      new Types.ObjectId(id),
      page,
      limit,
    );

    return {
      status: 'success',
      data: result,
      grossCnt: result.length,
    };
  }

  @Get('student')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: false,
    description: 'ID of the mentor',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Current page',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit per page',
    type: Number,
  })
  @ApiQuery({
    name: 'queryString',
    required: false,
    description: 'Search query string',
    type: String,
  })
  async findAllStudents(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
  ) {
    // Declare `options` object
    const options: any = {
      mentors: { $in: [new Types.ObjectId(id)] },
    };

    // Update `options` when `queryString` is existing
    if (queryString) {
      options.$text = { $search: `\"${queryString}\"` };
    }

    const result = await this.service.findAllStudent(
      new Types.ObjectId(id),
      page,
      limit,
    );

    return {
      status: 'success',
      data: result,
      grossCnt: result.length,
    };
  }

  @Post('classroom')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: false,
    description: 'ID of the mentor',
    type: String,
  })
  async assignClassroom(
    @Param('id') id: string,
    @Body() classroomIds: string[],
  ) {
    const result = await this.service.assignClassroom(id, classroomIds);

    return {
      status: 'success',
      data: result,
    };
  }

  @Post('students')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: false,
    description: 'ID of the mentor',
    type: String,
  })
  async assignStudent(@Param('id') id: string, @Body() studentIds: string[]) {
    const result = await this.service.assignStudent(id, studentIds);

    return {
      status: 'success',
      data: result,
    };
  }
}
