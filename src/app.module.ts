import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from './api/admins/admins.module';
import { UsersModule } from './api/users/users.module';
import { FileModule } from './api/file/file.module';
import { AuthModule } from './api/auth/auth.module';
import { BannerModule } from './api/banner/banner.module';
import { BrandModule } from './api/brand/brand.module';
import { CartModule } from './api/cart/cart.module';
import { CatalogModule } from './api/catalog/catalog.module';
import { CategoryModule } from './api/category/category.module';
import { DiscountModule } from './api/discount/discount.module';
import { LikeModule } from './api/like/like.module';
import { LocationModule } from './api/location/location.module';
import { NestedCategoryModule } from './api/nested-category/nested-category.module';
import { NotificationModule } from './api/notification/notification.module';
import { OrderModule } from './api/order/order.module';
import { PartnerModule } from './api/partner/partner.module';
import { ProductInfoModule } from './api/product-info/product-info.module';
import { ProductModule } from './api/product/product.module';
import { UserAddressModule } from './api/user-address/user-address.module';
import { PostamatModule } from './api/postamat/postamat.module';
import { DeliveryModule } from './api/delivery/delivery.module';
import { FilterProductsModule } from './api/filter-products/filter-products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:olimov0825@localhost:5432/sello',
      logging: false,
      synchronize: true,
      autoLoadEntities: true,
    }),
    AdminsModule,
    UsersModule,
    FileModule,
    AuthModule,
    BannerModule,
    BrandModule,
    CartModule,
    CatalogModule,
    CategoryModule,
    DiscountModule,
    LikeModule,
    LocationModule,
    NestedCategoryModule,
    NotificationModule,
    OrderModule,
    PartnerModule,
    ProductInfoModule,
    ProductModule,
    UserAddressModule,
    PostamatModule,
    DeliveryModule,
    FilterProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
