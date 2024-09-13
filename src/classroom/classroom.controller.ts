import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@ApiTags('classroom')
@Controller('classroom')
@UseGuards(AccessTokenGuard)
export class ClassroomController {
  constructor(private readonly service: ClassroomService) {}

  /** Create classroom
   * @param createClassroomDto - Class create Dto
   * @returns - New classroom
   */
  @Post()
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClassroomDto: CreateClassroomDto) {
    const classroom = await this.service.create(createClassroomDto);

    return {
      status: 'success',
      data: classroom,
    };
  }

  /** Get all classrooms
   * @returns - List of all classrooms
   * @param page - Current page
   * @param limit - Limit per page
   * @param queryString - Search query string
   */
  @Get()
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
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
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('queryString') queryString: string,
  ) {
    // Declare `options` object
    const options: any = {};

    // Update `options` when `queryString` is existing
    if (queryString) {
      options.$text = { $search: `\"${queryString}\"` }; // Searching with Full Phrases
    }

    const classrooms = await this.service.findAll(options, page, limit);

    return {
      status: 'success',
      data: classrooms,
      grossCnt: classrooms.length,
    };
  }

  /** Get classroom with number of assigned student and classroom
   * @param id - Classroom's Id
   * @returns - Founded classroom by Id with count of assigned students and classrooms
   */
  @Get(':id')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Classroom ID',
    type: String,
  })
  async findOne(@Param('id') id: string) {
    const classroom = await this.service.findOne(id);

    return {
      status: 'success',
      data: classroom,
    };
  }

  /** PATCH: Update classroom
   * @param id - Classroom's Id
   * @param updateClassroomDto - Classroom update Dto
   * @returns - Updated classroom
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Classroom ID',
    type: String,
  })
  async update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    const classroom = await this.service.update(id, updateClassroomDto);

    return {
      status: 'success',
      data: classroom,
    };
  }

  /** DELELTE: Delete classroom
   * @param id - Classroom's Id
   * @returns - Deleted classroom
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Classroom ID',
    type: String,
  })
  async delete(@Param('id') id: string) {
    const classroom = await this.service.delete(id);

    return {
      status: 'success',
      data: classroom,
    };
  }
}
