import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClassModule } from './class/class.module';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';

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
    ClassModule,
    MentorModule,
    StudentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
