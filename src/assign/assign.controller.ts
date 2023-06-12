import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AssignService } from './assign.service';
import { AssignDto } from './dto/assign.dto';
import { Types } from 'mongoose';

@Controller('assign')
export class AssignController {
  constructor(private readonly service: AssignService) {}

  @Post('')
  @ApiOkResponse()
  @HttpCode(201)
  async assignStudent(@Body() assignDto: AssignDto) {
    const result = await this.service.assignStudent(assignDto);

    if (!result) {
      throw new NotFoundException(`Classroom or student with Id was not`);
    }

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':classId')
  @ApiOkResponse()
  @HttpCode(200)
  async unassignStudent(
    @Param('classId') classId: Types.ObjectId,
    @Body('studentId') studentId: Types.ObjectId,
  ) {
    console.log({ classId, studentId });
    const result = await this.service.unassignStudent({ classId, studentId });

    if (!result) {
      throw new NotFoundException(`Classroom or student with Id was not`);
    }

    return {
      message: 'success',
      data: result,
    };
  }
}
