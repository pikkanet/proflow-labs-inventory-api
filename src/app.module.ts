import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/auth.guard';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [AuthModule, UsersModule, WarehousesModule, ItemsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
