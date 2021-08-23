import { Module } from '@nestjs/common';
import { MinioClientService } from './service';
import { MinioClientPepository } from './repository';
import { MinioClientHelper } from './helper';
import { DatabaseConnectionModule } from '../database/module';
import { Asset, AssetSchema } from 'src/database/schemas/Asset.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule } from 'nestjs-minio-client';
import * as config from 'config';
import { S3Module } from 'nestjs-s3';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    DatabaseConnectionModule,
    S3Module.forRoot({
      config: {
        accessKeyId: config.get('minio.accessKey'),
        secretAccessKey: config.get('minio.secretKey'),
        endpoint: config.get('minio.endPoint'),
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      },
    }),
  ],
  providers: [MinioClientService, MinioClientPepository, MinioClientHelper],
  exports: [MinioClientService, MinioClientPepository],
})
export class MinioClientModule {}
