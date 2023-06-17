import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { Class, ClassSchema } from 'src/class/schemas/class.schema';
import { ClassModule } from 'src/class/class.module';
import { MentorModule } from 'src/mentor/mentor.module';
import { AssignController } from './assign.controller';
import { Assign, AssingSchema } from './schemas/assign.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    MongooseModule.forFeature([{ name: Assign.name, schema: AssingSchema }]),
    ClassModule,
    MentorModule,
  ],
  providers: [AssignService],
  controllers: [AssignController],
})
export class AssignModule {}
