import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClassModule } from './class/class.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
