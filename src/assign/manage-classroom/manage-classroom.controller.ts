import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ManageClassroomService } from './manage-classroom.service';
import { Types } from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('assign/classroom')
@Controller('assign/classroom/:id')
export class ManageClassroomController {
  constructor(private readonly service: ManageClassroomService) {}

  @Get('mentor')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: false,
    description: 'ID of the classroom',
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
  async findAllMentors(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
  ) {
    // Declare `options` object
    const options: any = {
      classrooms: { $in: [new Types.ObjectId(id)] },
    };

    // Update `options` when `queryString` is existing
    if (queryString) {
      options.$text = { $search: `\"${queryString}\"` };
    }

    const result = await this.service.findAllMentors(
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
    description: 'ID of the classroom',
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
      classrooms: { $in: [new Types.ObjectId(id)] },
    };

    // Update `options` when `queryString` is existing
    if (queryString) {
      options.$text = { $search: `\"${queryString}\"` };
    }

    const result = await this.service.findAllStudents(
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
}
