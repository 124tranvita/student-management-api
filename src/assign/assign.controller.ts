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
import { AssignDto, UnassignDto } from './dto/assign.dto';
import { CreateAssignStudentToMentorDto } from './dto/assign-student-to-mentor.dto';
import { CreateAssignClassroomToMentorDto } from './dto/assign-classroom-to-mentor.dto';
import { CreateAssignMentorToClassroomDto } from './dto/assign-mentor-to-classroom.dto';

@Controller('assign')
export class AssignController {
  constructor(
    private readonly assignService: AssignService,
    private readonly classroomService: ClassroomService,
    private readonly mentorService: MentorService,
    private readonly studentService: StudentService,
  ) {}

  /********************************
   *
   *  MENTOR ASSIGNMENT: STUDENT
   *
   ********************************/

  /** Assign a student to mentor
   * @param id - Mentor's id
   * @param assignDto - Assign student to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('mentor/assign-student/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async assignStudentMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() assignDto: AssignDto,
  ) {
    const assinged = await this.assignService.findAllStudentBelongToMentor(
      {
        mentor: { $eq: mentorId },
      },
      1,
      26,
    );

    if (assinged && assinged.length > 10) {
      throw new BadRequestException(
        `Mentor has reach the limit of assignment (25 students)`,
      );
    }

    const selectedIds = assignDto.selectedIds;

    const result = await Promise.all(
      selectedIds.map(async (selectedIds) => {
        const student = await this.studentService.assignMentor(
          selectedIds,
          mentorId,
        );

        const mentor = await this.mentorService.assignStudent(
          mentorId,
          selectedIds,
        );

        if (!student || !mentor) {
          throw new NotFoundException(`Mentor or Student was not found`);
        }

        const createAssignStudentToMentorDto: CreateAssignStudentToMentorDto = {
          studentId: student.studentId,
          studentName: student.name,
          studentStatus: student.status,
          studentAvatar: student.avatar,
          mentorName: mentor.name,
          mentor: mentor.id,
          student: student.id,
        };

        return await this.assignService.createAssignStudentToMentorRecord(
          createAssignStudentToMentorDto,
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
   * @param unassignDto - Assign student to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('mentor/unassign-student/:mentorId')
  @ApiOkResponse()
  @HttpCode(201)
  async unassignStudentMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() unassignDto: UnassignDto,
  ) {
    const selectedIds = unassignDto.selectedIds;

    const result = await Promise.all(
      selectedIds.map(async (selectedId) => {
        const record = await this.assignService.findStudentBelongToMentorRecord(
          selectedId,
          mentorId,
        );

        if (!record) {
          throw new NotFoundException(
            `Assinged record with id ${selectedId} was not found`,
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

        return await this.assignService.delStudentBelongToMentorRecord(
          selectedId,
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
   * @param queryString - Search keyword
   * @returns - List of assigned student documents that belong to mentor's id
   */
  @Get('mentor/student-to-mentor')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllStudentBelongToMentor(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
  ) {
    const result = await this.assignService.findAllStudentBelongToMentor(
      queryString
        ? {
            mentor: { $eq: id },
            $text: { $search: `\"${queryString}\"` },
          }
        : {
            mentor: { $eq: id },
          },
      page,
      limit,
    );

    const count = await this.assignService.countStudentToMentorByCondition({
      mentor: { $eq: id },
    });

    return {
      status: 'success',
      data: result,
      grossCnt: queryString ? result.length : count,
    };
  }

  /********************************
   * MENTOR ASSIGNMENT: CLASSROOM
   ********************************/

  /** Assign a Classroom to mentor
   * @param id - Mentor's id
   * @param assignDto - Assign Classroom to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('mentor/assign-classroom/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async assignClassroomToMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() assignDto: AssignDto,
  ) {
    const assinged = await this.assignService.findAllClassroomBelongToMentor(
      {
        mentor: { $eq: mentorId },
      },
      1,
      11,
    );

    if (assinged && assinged.length > 10) {
      throw new BadRequestException(
        `Mentor has reach the limit of assignment (10 classrooms)`,
      );
    }

    const classroomIds = assignDto.selectedIds;

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

        const createAssignClassroomToMentorDto: CreateAssignClassroomToMentorDto =
          {
            name: classroom.name,
            description: classroom.description,
            languages: classroom.languages,
            cover: classroom.cover,
            mentor: mentor.id,
            classroom: classroom.id,
          };

        return await this.assignService.createAssignClassroomToMentorRecord(
          createAssignClassroomToMentorDto,
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
   * @param unassignDto - Assign classroom to mentor record Dto
   * @returns - A deleted assigned document
   */
  @Patch('mentor/unassign-classroom/:mentorId')
  @ApiOkResponse()
  @HttpCode(200)
  async unassignClassroomFromMentor(
    @Param('mentorId') mentorId: Types.ObjectId,
    @Body() unassignDto: UnassignDto,
  ) {
    const selectedIds = unassignDto.selectedIds;

    const result = await Promise.all(
      selectedIds.map(async (selectedId) => {
        const record =
          await this.assignService.findAllClassroomBelongToMentorRecord({
            _id: { $eq: selectedId },
            mentor: { $eq: mentorId },
          });

        if (!record) {
          throw new NotFoundException(
            `Assinged record with id ${selectedId} was not found`,
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

        return await this.assignService.delAllClassroomBelongToMentorRecord(
          selectedId,
        );
      }),
    );

    return {
      status: 'success',
      data: result,
    };
  }

  /** Find all assigned classrooms belong to mentor
   * @param id - Mentor's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @param queryString - Search query string
   * @returns - List of assigned student documents that belong to mentor's id
   */
  @Get('mentor/classroom-to-mentor')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllClassroomBelongToMentor(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
  ) {
    const result = await this.assignService.findAllClassroomBelongToMentor(
      queryString
        ? {
            mentor: id,
            $text: { $search: `\"${queryString}\"` }, // Searching with Full Phrases
          }
        : {
            mentor: id,
          },
      page,
      limit,
    );

    const count = await this.assignService.countClassroomToMentorByCondition({
      mentor: id,
    });

    return {
      status: 'success',
      data: result,
      grossCnt: queryString ? result.length : count,
    };
  }
  /********************************
   * CLASSROOM ASSIGNMENT: MENTOR
   ********************************/

  /** Assign a mentor to classroom
   * @param id - Classroom's id
   * @param assignDto - Assign Classroom to mentor record Dto
   * @returns - A new assigned document
   */
  @Patch('classroom/assign-mentor/:classroomId')
  @ApiOkResponse()
  @HttpCode(200)
  async assignMentorToClassroom(
    @Param('classroomId') classroomId: Types.ObjectId,
    @Body() assignDto: AssignDto,
  ) {
    const assinged = await this.assignService.findAllMentorBelongToClassroom(
      {
        classroom: { $eq: classroomId },
      },
      1,
      11,
    );

    if (assinged && assinged.length > 10) {
      throw new BadRequestException(
        `Mentor has reach the limit of assignment (10 classrooms)`,
      );
    }

    const mentorIds = assignDto.selectedIds;

    const result = await Promise.all(
      mentorIds.map(async (mentorId) => {
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

        const createAssignMentorToClassroomDto: CreateAssignMentorToClassroomDto =
          {
            name: mentor.name,
            email: mentor.email,
            status: mentor.status,
            avatar: mentor.avatar,
            languages: mentor.languages,
            mentor: mentor.id,
            classroom: classroom.id,
          };

        return await this.assignService.createAssignMentorToClassroomRecord(
          createAssignMentorToClassroomDto,
        );
      }),
    );

    return {
      status: 'success',
      data: result,
    };
  }

  /** Unassign a mentor from classroom
   * @param classroomId - Classroom's id
   * @param unassignDto - Assign classroom to mentor record Dto
   * @returns - A deleted assigned document
   */
  @Patch('classroom/unassign-mentor/:classroomId')
  @ApiOkResponse()
  @HttpCode(200)
  async unassignMentorFromClassroom(
    @Param('classroomId') classroomId: Types.ObjectId,
    @Body() unassignDto: UnassignDto,
  ) {
    const selectedIds = unassignDto.selectedIds;

    const result = await Promise.all(
      selectedIds.map(async (selectedId) => {
        const record =
          await this.assignService.findMentorBelongToClassroomRecord({
            _id: { $eq: selectedId },
            classroom: { $eq: classroomId },
          });

        if (!record) {
          throw new NotFoundException(
            `Mentor Id: ${selectedId} was not assinged yet.`,
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

        return await this.assignService.delMentorBelongToClassroomRecord(
          selectedId,
        );
      }),
    );

    return {
      status: 'success',
      data: result,
    };
  }

  /** Find all assigned mentor belong to classroom's Id
   * @param id - Classroom's Id
   * @param page - Current Page
   * @param limit - Limit per page
   * @param queryString - Search query string
   * @returns - List of assigned student documents that belong to mentor's id
   */
  @Get('classroom/mentor-to-classroom')
  @ApiOkResponse()
  @HttpCode(200)
  async findAllMentorBelongToClassroom(
    @Query('id') id: Types.ObjectId,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
  ) {
    const options = queryString
      ? {
          classroom: { $eq: id },
          $text: { $search: `\"${queryString}\"` }, // Searching with Full Phrases
        }
      : {
          classroom: { $eq: id },
        };

    const result = await this.assignService.findAllMentorBelongToClassroom(
      options,
      page,
      limit,
    );

    const count = await this.assignService.countClassroomToMentorByCondition({
      classroomId: id,
    });

    return {
      status: 'success',
      data: result,
      grossCnt: count,
    };
  }
}
