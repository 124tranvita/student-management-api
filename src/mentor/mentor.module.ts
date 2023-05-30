import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { Mentor, MentorSchema } from './schemas/mentor.schema';

@Module({
  providers: [MentorService],
  controllers: [MentorController],
  imports: [
    MongooseModule.forFeature([{ name: Mentor.name, schema: MentorSchema }]),
  ],
})
export class MentorModule {}
