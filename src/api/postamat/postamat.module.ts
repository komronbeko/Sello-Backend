import { Module } from '@nestjs/common';
import { PostamatService } from './postamat.service';
import { PostamatController } from './postamat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostamatEntity } from 'src/infra/entities/postamat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostamatEntity])],
  controllers: [PostamatController],
  providers: [PostamatService],
})
export class PostamatModule {}
