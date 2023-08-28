import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from 'src/infra/entities/banner.entity';
import { AdminEntity } from 'src/infra/entities/admin.entity';
import { CatalogEntity } from 'src/infra/entities/catalog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BannerEntity, AdminEntity, CatalogEntity]),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
