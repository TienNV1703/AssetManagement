import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnectionService } from './service';
import { DatabaseConnectionController } from './controller';
import { Asset, AssetSchema } from './schemas/Asset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
  ],

  controllers: [DatabaseConnectionController],
  providers: [DatabaseConnectionService],
  exports: [DatabaseConnectionService],
})
export class DatabaseConnectionModule {}
