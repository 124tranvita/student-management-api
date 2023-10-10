import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import {
  Classroom,
  ClassroomSchema,
} from 'src/classroom/schemas/classroom.schema';
import { ClassroomModule } from 'src/classroom/classroom.module';
import { MentorModule } from 'src/mentor/mentor.module';
import { Mentor, MentorSchema } from 'src/mentor/schemas/mentor.schema';
import {
  AssignStudentToMentor,
  AssignStudentToMentorSchema,
} from './schemas/assign-student-to-mentor.schema';
import { AssignController } from './assign.controller';
import { Assign, AssingSchema } from './schemas/assign.schema';
import { AssignService } from './assign.service';
import { StudentModule } from 'src/student/student.module';
import {
  AssignClassroomMentor,
  AssignClassroomMentorSchema,
} from './schemas/assign-classroom-mentor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
    MongooseModule.forFeature([{ name: Mentor.name, schema: MentorSchema }]),
    MongooseModule.forFeature([{ name: Assign.name, schema: AssingSchema }]),
    MongooseModule.forFeature([
      { name: AssignStudentToMentor.name, schema: AssignStudentToMentorSchema },
    ]),
    MongooseModule.forFeature([
      { name: AssignClassroomMentor.name, schema: AssignClassroomMentorSchema },
    ]),
    ClassroomModule,
    MentorModule,
    StudentModule,
  ],
  providers: [AssignService],
  controllers: [AssignController],
})
export class AssignModule {}
