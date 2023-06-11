import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AssignService } from './assign.service';
import { AssignDto } from './dto/assign.dto';

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

  @Post('/unassign')
  @ApiOkResponse()
  @HttpCode(201)
  async unassignStudent(@Body() assignDto: AssignDto) {
    const result = await this.service.unassignStudent(assignDto);

    if (!result) {
      throw new NotFoundException(`Classroom or student with Id was not`);
    }

    return {
      message: 'success',
      data: result,
    };
  }
}
