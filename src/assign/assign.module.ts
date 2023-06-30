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
  AssignStudentMentor,
  AssignStudentMentorSchema,
} from './schemas/assign-student-mentor.schema';
import { AssignController } from './assign.controller';
import { Assign, AssingSchema } from './schemas/assign.schema';
import { AssignService } from './assign.service';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
    MongooseModule.forFeature([{ name: Mentor.name, schema: MentorSchema }]),
    MongooseModule.forFeature([{ name: Assign.name, schema: AssingSchema }]),
    MongooseModule.forFeature([
      { name: AssignStudentMentor.name, schema: AssignStudentMentorSchema },
    ]),
    ClassroomModule,
    MentorModule,
    StudentModule,
  ],
  providers: [AssignService],
  controllers: [AssignController],
})
export class AssignModule {}
