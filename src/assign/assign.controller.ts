import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ClassroomService } from 'src/classroom/classroom.service';
import { MentorService } from 'src/mentor/mentor.service';
import { StudentService } from 'src/student/student.service';
import { AssignService } from './assign.service';
import {
  AssignStudentMentorDto,
  UnassignStudentMentorDto,
} from './dto/assign.dto';
import { CreateAssignStudentMentorDto } from './dto/assign-student-mentor.dto';

@Controller('assign')
export class AssignController {
  constructor(
    private readonly assignService: AssignService,
    private readonly classroomService: ClassroomService,
    private readonly mentorService: MentorService,
    private readonly studentService: StudentService,
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

  /** Assign a student to mentor
   * @param id - Mentor's id
   * @param assignStudentMentorDto - Assign student to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('mentor/assign-student/:id')
  @ApiOkResponse()
  @HttpCode(200)
  async assignStudentMentor(
    @Param('id') id: Types.ObjectId,
    @Body() assignStudentMentorDto: AssignStudentMentorDto,
  ) {
    const studentIds = assignStudentMentorDto.studentIds;

    const result = await Promise.all(
      studentIds.map(async (studentId) => {
        const student = await this.studentService.mentorAssigned(studentId, id);

        const mentor = await this.mentorService.studentAssigned(id, studentId);

        if (!student || !mentor) {
          throw new NotFoundException(`Mentor or Student was not found`);
        }

        const createAssignStudentMentorDto: CreateAssignStudentMentorDto = {
          studentId: student.studentId,
          studentName: student.name,
          studentStatus: student.status,
          mentorName: mentor.name,
          mentor: mentor.id,
          student: student.id,
        };

        return await this.assignService.createAssignStudentMentorRecord(
          createAssignStudentMentorDto,
        );
      }),
    );

    return {
      message: 'success',
      data: result,
    };
  }

  /** Unassign a student from mentor
   * @param id - Mentor's id
   * @param unassignStudentMentorDto - Assign student to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('mentor/unassign-student/:mentorId')
  @ApiOkResponse()
  @HttpCode(201)
  async unassignStudentMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() unassignStudentMentorDto: UnassignStudentMentorDto,
  ) {
    const assignedIds = unassignStudentMentorDto.assignedIds;

    const result = Promise.all(
      assignedIds.map(async (assignedId) => {
        const record = await this.assignService.findAssignStudentMentorRecord(
          assignedId,
          mentorId,
        );

        if (!record) {
          throw new NotFoundException(
            `Assinged record with id ${assignedId} was not found`,
          );
        }

        const student = await this.studentService.mentorUnassigned(
          record.student._id,
          record.mentor._id,
        );

        const mentor = await this.mentorService.studentUnassigned(
          record.mentor._id,
          record.student._id,
        );

        if (!student || !mentor) {
          throw new NotFoundException(`Mentor or Student was not found`);
        }

        return await this.assignService.delAssignStudentMentorRecord(
          assignedId,
        );
      }),
    );

    return {
      message: 'success',
      data: result,
    };
  }

  /** Find all assigned students belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  @Get('student-to-mentor')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllAssignedStudentMentor(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const result = await this.assignService.findAllAssignedStudentMentor(
      id,
      page,
      limit,
    );

    return {
      message: 'success',
      data: result,
      grossCnt: result.length,
    };
  }
}
