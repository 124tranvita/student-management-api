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
import { ManageClassroomService } from './manage-classroom.service';
import { Types } from 'mongoose';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AddStudentDto } from './dto/add-student.dto';

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
  async findAllAddedMentors(
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

    const result = await this.service.findAllAddedMentors(
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

  @Post('mentor')
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
  async addMentorsToClassroom(
    @Param('id') id: string,
    @Body() mentorIds: string[],
  ) {
    const result = await this.service.addMentorsToClassroom(id, mentorIds);

    return {
      status: 'success',
      data: result,
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
  async findAllAddedStudents(
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

    const result = await this.service.findAllAddedStudents(
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

  @Post('student')
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
  async addStudentsToClassroom(
    @Param('id') id: string,
    @Body() addStudentDto: AddStudentDto,
  ) {
    const result = await this.service.addStudentsToClassroom(
      id,
      addStudentDto.mentorId,
      addStudentDto.studentIds,
    );

    return {
      status: 'success',
      data: result,
    };
  }
}
