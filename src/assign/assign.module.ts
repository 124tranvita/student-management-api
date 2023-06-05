import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { Class, ClassSchema } from 'src/class/schemas/class.schema';
import { AssignController } from './assign.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  providers: [AssignService],
  controllers: [AssignController],
})
export class AssignModule {}
