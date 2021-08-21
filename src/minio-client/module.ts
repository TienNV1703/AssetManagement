import { Module } from '@nestjs/common';
import { MinioClientService } from './service';
import { MinioClientPepository } from './repository';
import { MinioClientHelper } from './helper';
import { DatabaseConnectionModule } from '../database/module';
import { Asset, AssetSchema } from 'src/database/schemas/Asset.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule } from 'nestjs-minio-client';
import * as config from 'config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    DatabaseConnectionModule,
    MinioModule.register({
      endPoint: config.get('minio.endPoint'),
      port: config.get('minio.port'),
      useSSL: false,
      accessKey: config.get('minio.accessKey'),
      secretKey: config.get('minio.secretKey'),
    }),
  ],
  providers: [MinioClientService, MinioClientPepository, MinioClientHelper],
  exports: [MinioClientService, MinioClientPepository],
})
export class MinioClientModule {}
