import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/module';
import { DatabaseConnectionModule } from './database/module';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Asset,
  AssetDocument,
  AssetSchema,
} from './database/schemas/Asset.schema';
import * as config from 'config';
// import { NestMinioClientController } from 'nestjs-minio';
import { NestMinioModule } from 'nestjs-minio';
import { MinioClientModule } from './minio-client/module';

@Module({
  imports: [
    ApiModule,
    DatabaseConnectionModule,
    MongooseModule.forRoot(config.get('mongodb.url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    NestMinioModule.register({
      endPoint: config.get('minio.endPoint'),
      port: config.get('minio.port'),
      useSSL: false,
      accessKey: config.get('minio.accessKey'),
      secretKey: config.get('minio.secretKey'),
    }),
    MinioClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Asset.name) private assetDocument: Model<AssetDocument>,
  ) {}

  async onApplicationBootstrap() {
    // const adminUser = await this.createAdminUser()
    // const apiGroups = await this.createDefaultApiGroups()
    // const defaultPkg = await this.createDefaultPackage(apiGroups)
    // const app = await this.createDefaultApp(adminUser, defaultPkg)
    // return { adminUser, defaultPkg, app, apiGroups }
  }
}
