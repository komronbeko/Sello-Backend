import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogEntity])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
