/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UseFilters,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
// import { parseValue } from 'graphql';
import {
  FileInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { Request, Response } from 'express';
// import { REQUEST } from '@nestjs/core';
import { ApiService } from './service';
import { CreateApiInput } from './dto/create-api.input';
import { BufferedFile } from '../minio-client/file.model';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import * as config from 'config';
import { InjectS3, S3 } from 'nestjs-s3';
const prefix: string = config.get('prefix');

@Controller('/api/asset')
export class ApiController {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly apiService: ApiService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async upLoadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const result = await this.apiService.uploadSingle(file, request);
    return result;
  }

  // get by id
  @Get()
  async findOne(@Req() request: Request) {
    try {
      const createResult = await this.s3
        .createBucket({ Bucket: 'bucket' })
        .promise();
      console.log(createResult);
    } catch (e) {}

    try {
      const list = await this.s3.listBuckets().promise();
      return list.Buckets;
    } catch (e) {
      console.log(e);
    }

    // const id = request.params;
    // return this.apiService.findOne(request);
  }

  // get detail by id
  @Get('detail/:id')
  findDetail(@Param('id') id: string): string {
    return this.apiService.findDetail(id);
  }

  // delte by id
  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.apiService.remove(id);
  }
}
