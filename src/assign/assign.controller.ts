/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ClassroomService } from 'src/classroom/classroom.service';
import { MentorService } from 'src/mentor/mentor.service';
import { StudentService } from 'src/student/student.service';
import { AssignService } from './assign.service';
import {
  AssignClassroomMentorDto,
  AssignStudentMentorDto,
  UnassignClassroomMentorDto,
  UnassignStudentMentorDto,
} from './dto/assign.dto';
import { CreateAssignStudentMentorDto } from './dto/assign-student-mentor.dto';
import { CreateAssignClassroomMentorDto } from './dto/assign-classroom-mentor.dto';

@Controller('assign')
export class AssignController {
  constructor(
    private readonly assignService: AssignService,
    private readonly classroomService: ClassroomService,
    private readonly mentorService: MentorService,
    private readonly studentService: StudentService,
  ) {}

  // /** Assign mentor to classrooms
  //  * @param mentorId - Current logged in mentor Id
  //  * @param classIds - List of classroom Id
  //  * @returns - Classroom which current logged in mentor is assigned
  //  */
  // @Patch('to-class/:mentorId')
  // @ApiOkResponse()
  // @HttpCode(200)
  // async assignMento(
  //   @Param('mentorId') mentorId: Types.ObjectId,
  //   @Body('classIds') classIds: Types.ObjectId[],
  // ) {
  //   const classrooms = await Promise.all(
  //     classIds.map(async (classId) => {
  //       const isAssigned = await this.classroomService.findExistingDoc(
  //         new Types.ObjectId(classId),
  //         mentorId,
  //       );

  //       if (isAssigned && isAssigned.length > 0) {
  //         throw new BadRequestException(
  //           `Mentor with id ${mentorId} is already assigned to classroom with id ${classId}`,
  //         );
  //       }

  //       return await this.classroomService.assignMentor(
  //         new Types.ObjectId(classId),
  //         mentorId,
  //       );
  //     }),
  //   );

  //   return {
  //     status: 'success',
  //     data: classrooms,
  //   };
  // }

  /********************************
   *
   *  STUDENT -> MENTOR ASSIGNMENT
   *
   ********************************/

  /** Assign a student to mentor
   * @param id - Mentor's id
   * @param assignStudentMentorDto - Assign student to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('mentor/assign-student/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async assignStudentMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() assignStudentMentorDto: AssignStudentMentorDto,
  ) {
    const assinged = await this.assignService.findAllAssignedStudentMentor(
      mentorId,
      1,
      26,
    );

    if (assinged && assinged.length > 10) {
      throw new BadRequestException(
        `Mentor has reach the limit of assignment (25 students)`,
      );
    }

    const studentIds = assignStudentMentorDto.studentIds;

    const result = await Promise.all(
      studentIds.map(async (studentId) => {
        const student = await this.studentService.assignMentor(
          studentId,
          mentorId,
        );

        const mentor = await this.mentorService.assignStudent(
          mentorId,
          studentId,
        );

        if (!student || !mentor) {
          throw new NotFoundException(`Mentor or Student was not found`);
        }

        const createAssignStudentMentorDto: CreateAssignStudentMentorDto = {
          studentId: student.studentId,
          studentName: student.name,
          studentStatus: student.status,
          studentAvatar: student.avatar,
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
      status: 'success',
      data: result,
    };
  }

  /** Unassign a student from mentor
   * @param mentorId - Mentor's id
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

    const result = await Promise.all(
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

        const student = await this.studentService.unassignMentor(
          record.student._id,
          record.mentor._id,
        );

        const mentor = await this.mentorService.unassignStudent(
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
      status: 'success',
      data: result,
    };
  }

  /** Find all assigned students belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  @Get('mentor/student-to-mentor')
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
      status: 'success',
      data: result,
      grossCnt: result.length,
    };
  }

  /********************************
   *
   *  CLASSROOM -> MENTOR ASSIGNMENT
   *
   ********************************/

  /** Assign a Classroom to mentor
   * @param id - Mentor's id
   * @param assignClassroomMentorDto - Assign Classroom to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('mentor/assign-classroom/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async assignClassroomMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() assignClassroomMentorDto: AssignClassroomMentorDto,
  ) {
    const assinged = await this.assignService.findAllAssignedClassroomMentor(
      mentorId,
      1,
      10,
    );

    if (assinged && assinged.length > 10) {
      throw new BadRequestException(
        `Mentor has reach the limit of assignment (10 classrooms)`,
      );
    }

    const classroomIds = assignClassroomMentorDto.classroomIds;

    const result = await Promise.all(
      classroomIds.map(async (classroomId) => {
        const classroom = await this.classroomService.assignMentor(
          classroomId,
          mentorId,
        );

        const mentor = await this.mentorService.assignClassroom(
          mentorId,
          classroomId,
        );

        if (!classroom || !mentor) {
          throw new NotFoundException(`Mentor or Classroom was not found`);
        }

        const createAssignClassroomMentorDto: CreateAssignClassroomMentorDto = {
          classroomName: classroom.name,
          classroomDesc: classroom.description,
          classroomLanguages: classroom.languages,
          classroomCover: classroom.cover,
          mentor: mentor.id,
          classroom: classroom.id,
        };

        return await this.assignService.createAssignClassroomMentorRecord(
          createAssignClassroomMentorDto,
        );
      }),
    );

    return {
      status: 'success',
      data: result,
    };
  }

  /** Unassign a classroom from mentor
   * @param mentorId - Mentor's id
   * @param unassignClassroomMentorDto - Assign classroom to mentor record Dto
   * @returns - A deleted assigned document
   */
  @Patch('mentor/unassign-classroom/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async unassignClassroomMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() unassignClassroomMentorDto: UnassignClassroomMentorDto,
  ) {
    const assignedIds = unassignClassroomMentorDto.assignedIds;

    const result = await Promise.all(
      assignedIds.map(async (assignedId) => {
        const record = await this.assignService.findAssignClassroomMentorRecord(
          assignedId,
          mentorId,
        );

        if (!record) {
          throw new NotFoundException(
            `Assinged record with id ${assignedId} was not found`,
          );
        }

        const classroom = await this.classroomService.unassignMentor(
          record.classroom._id,
          record.mentor._id,
        );

        const mentor = await this.mentorService.unassignClassroom(
          record.mentor._id,
          record.classroom._id,
        );

        if (!classroom || !mentor) {
          throw new NotFoundException(`Mentor or Student was not found`);
        }

        return await this.assignService.delAssignClassroomMentorRecord(
          assignedId,
        );
      }),
    );

    return {
      status: 'success',
      data: result,
    };
  }

  /** Find all assigned students belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @returns - List of assigned student documents that belong to mentor's id
   */
  @Get('mentor/classroom-to-mentor')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllAssignedClassroomMentor(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const result = await this.assignService.findAllAssignedClassroomMentor(
      id,
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
