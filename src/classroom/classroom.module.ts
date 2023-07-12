import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';

@Module({
  providers: [ClassroomService],
  controllers: [ClassroomController],
  imports: [
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
  ],
  exports: [ClassroomService],
})
export class ClassroomModule {}
