import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassroomModule } from './classroom/classroom.module';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { AssignModule } from './assign/assign.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ClassroomModule,
    MentorModule,
    // StudentModule,
    AuthModule,
    // AssignModule,
    // EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
