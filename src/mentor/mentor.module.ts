import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MentorService } from './mentor.service';
import { MentorShareService } from './share.service';
import { MentorController } from './mentor.controller';
import { Mentor, MentorSchema } from './schemas/mentor.schema';

@Module({
  providers: [MentorService, MentorShareService],
  controllers: [MentorController],
  imports: [
    MongooseModule.forFeature([{ name: Mentor.name, schema: MentorSchema }]),
  ],
  exports: [MentorShareService],
})
export class MentorModule {}
