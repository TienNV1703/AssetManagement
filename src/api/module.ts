import { Module } from '@nestjs/common';
import { ApiService } from './service';
import { ApiController } from './controller';
// import { MinioClientService } from '../minio-client/service';
// import { MinioClientPepository } from '../minio-client/repository';
import { MinioClientModule } from '../minio-client/module';
@Module({
  imports: [MinioClientModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
