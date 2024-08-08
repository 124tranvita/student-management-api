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
import { MentorService } from './mentor.service';
import { Types } from 'mongoose';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { convertRole } from 'src/utils';

@ApiTags('mentors')
@Controller('mentor')
@UseGuards(AccessTokenGuard)
export class MentorController {
  constructor(private readonly service: MentorService) {}

  /** POST: Create new mentor/admin
   * @requires Role `admin`
   * @param createMentorDto Create mentor Dto
   * @returns New added mentor/admin document
   */
  @Post()
  @Roles(Role.Admin)
  @ApiTags('create')
  @ApiOkResponse()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMentorDto: CreateMentorDto) {
    const mentor = await this.service.create(createMentorDto);

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** GET: Get all mentors/admins (excluded admin who is querying)
   * @requires Role `admin`
   * @returns - List of all mentors/admins (excluded admin who is querying) document
   */
  @Get()
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID of the admin making the query',
    type: String,
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Target role',
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
  async findAll(
    @Query('id') id?: string,
    @Query('role') role = '0',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('queryString') queryString = '',
  ) {
    // Get role: 0: Mentor 1: Admin
    const getRole = convertRole(role || '0');

    // Declare `options` object
    const options: any = {
      roles: { $eq: getRole },
    };

    // Update `options` when `id` is existing
    if (id) {
      options._id = { $ne: new Types.ObjectId(id) };
    }

    // Update `options` when `queryString` is existing
    if (queryString) {
      options.$text = { $search: `\"${queryString}\"` };
    }

    // Call query service
    const mentors = await this.service.findAll(options, page, limit);

    return {
      status: 'success',
      data: mentors,
      grossCnt: mentors.length,
    };
  }

  /** GET: Get mentor/admin
   * @returns - The mentor/admin document
   */
  @Get(':id')
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Mentor Id',
    type: String,
  })
  async findOne(@Param('id') id: string) {
    // Call query service
    const mentor = await this.service.findOne(id);

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** PATCH: Update mentor/admin info
   * @requires Role `admin`
   * @param updateMentorDto - Mentor/admin update Dto
   * @returns - New updated mentor/adim document
   */
  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Mentor Id',
    type: String,
  })
  async update(
    @Param('id') id: string,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    // Call query service
    const mentor = await this.service.update(id, updateMentorDto);

    return {
      status: 'success',
      data: mentor,
    };
  }

  /** Delete mentor/admin
   * @requires Role `admin`
   * @returns - The deleted mentor/admin document
   */
  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOkResponse()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Mentor Id',
    type: String,
  })
  async delete(@Param('id') id: string) {
    // Call query service
    const mentor = await this.service.delete(id);

    return {
      status: 'success',
      data: mentor,
    };
  }
}
