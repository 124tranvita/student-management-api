import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import {
  Classroom,
  ClassroomSchema,
} from 'src/classroom/schemas/classroom.schema';
import { ClassroomModule } from 'src/classroom/classroom.module';
import { MentorModule } from 'src/mentor/mentor.module';
import { AssignController } from './assign.controller';
import { Assign, AssingSchema } from './schemas/assign.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
    MongooseModule.forFeature([{ name: Assign.name, schema: AssingSchema }]),
    ClassroomModule,
    MentorModule,
  ],
  providers: [AssignService],
  controllers: [AssignController],
})
export class AssignModule {}
