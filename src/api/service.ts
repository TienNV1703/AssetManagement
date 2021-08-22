import { Injectable, Inject, Req, Res, Scope } from '@nestjs/common';
import { CreateApiInput } from './dto/create-api.input';
import { REQUEST } from '@nestjs/core';
import { Request, Response } from 'express';
import { MinioClientService } from '../minio-client/service';
import * as config from 'config';
import { BufferedFile } from '../minio-client/file.model';
import { Express } from 'express';
// import { multer } from 'multer'

@Injectable({ scope: Scope.REQUEST })
export class ApiService {
  // private readonly baseBucket = config.get('baseBucket');
  constructor(
    @Inject(REQUEST) private request: Request,
    private minioClientService: MinioClientService,
  ) {}

  async uploadSingle(file: Express.Multer.File, @Req() request: Request) {
    const uploaded_file = await this.minioClientService.uploadSingleFile(
      file,
      request,
    );
    return {
      image_url: uploaded_file,
      message: 'Successfully uploaded to MinIO S3',
    };
  }

  findOne(req: Request) {
    return `This action returns request  api`;
  }

  findDetail(id: string) {
    return `This action returns a #${id} api`;
  }

  remove(id: string) {
    return `This action removes a #${id} api`;
  }
}
