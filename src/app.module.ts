import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/users.module';
import { UserEntity } from './modules/users/entities/user.entity';
import { PlantModule } from './modules/plants/plants.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [UserEntity],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UserModule,
    PlantModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
