import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ClassroomService } from 'src/classroom/classroom.service';
import { MentorService } from 'src/mentor/mentor.service';
import { AssignService } from './assign.service';
import { AssignDto } from './dto/assign.dto';

@Controller('assign')
export class AssignController {
  constructor(
    private readonly service: AssignService,
    private readonly classroomService: ClassroomService,
    private readonly mentorService: MentorService,
  ) {}

  /** Assign mentor to classrooms
   * @param mentorId - Current logged in mentor Id
   * @param classIds - List of classroom Id
   * @returns - Classroom which current logged in mentor is assigned
   */
  @Patch('to-class/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async assignMento(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body('classIds') classIds: Types.ObjectId[],
  ) {
    const classrooms = await Promise.all(
      classIds.map(async (classId) => {
        const isAssigned = await this.classroomService.findExistingDoc(
          new Types.ObjectId(classId),
          mentorId,
        );

        if (isAssigned && isAssigned.length > 0) {
          throw new BadRequestException(
            `Mentor with id ${mentorId} is already assigned to classroom with id ${classId}`,
          );
        }

        return await this.classroomService.assignMentor(
          new Types.ObjectId(classId),
          mentorId,
        );
      }),
    );

    return {
      status: 'success',
      data: classrooms,
    };
  }

  // @Post('')
  // @ApiOkResponse()
  // @HttpCode(201)
  // async assignStudent(@Body() assignDto: AssignDto) {
  //   const result = await this.service.assignStudent(assignDto);

  //   if (!result) {
  //     throw new NotFoundException(`Classroom or student with Id was not`);
  //   }

  //   return {
  //     message: 'success',
  //     data: result,
  //   };
  // }

  // @Patch(':classId')
  // @ApiOkResponse()
  // @HttpCode(200)
  // async unassignStudent(
  //   @Param('classId') classId: Types.ObjectId,
  //   @Body('studentId') studentId: Types.ObjectId,
  // ) {
  //   const result = await this.service.unassignStudent({ classId, studentId });

  //   if (!result) {
  //     throw new NotFoundException(`Classroom or student with Id was not`);
  //   }

  //   return {
  //     message: 'success',
  //     data: result,
  //   };
  // }
}
