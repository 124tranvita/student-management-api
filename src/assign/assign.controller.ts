import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AssignStudentDto } from './dto/assign-student.dto';
import { AssignService } from './assign.service';

@Controller('assign')
export class AssignController {
  constructor(private readonly service: AssignService) {}

  @Patch('/:classId')
  @ApiOkResponse()
  assignStudent(
    @Param('classId') classId: Types.ObjectId,
    @Body() body: AssignStudentDto,
  ) {
    const { assignStudentId } = body;

    return this.service.assignStudent(classId, assignStudentId);
  }
}
