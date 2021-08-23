import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';
import { MinioClientPepository } from './repository';
import * as config from 'config';
import { Request } from 'express';
import sizeOf = require('image-size');
import Stream = require('stream');
import fs = require('fs');

@Injectable()
export class MinioClientService {
  constructor(private minioClientPepository: MinioClientPepository) {}

  public async uploadSingleFile(
    file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const appId = request.headers['x-app-id'].toString();
    const mimetype = file.mimetype.split('/')[0];

    switch (mimetype) {
      case 'image': {
        // max size of image is 4MB
        if (file.size > 4 * 1024 * 1024) {
          console.log({ msg: 'Kich thuoc file qua lon' });
          throw new HttpException(
            'Kich thuoc file upload qua lon',
            HttpStatus.BAD_REQUEST,
          );
        }
        const typeData = 1;
        const name = file.originalname.substring(
          0,
          file.originalname.lastIndexOf('.'),
        );
        const dataBinary = fs.createReadStream(file.path);
        const dimentions = sizeOf.imageSize(file.path);
        const width = dimentions.width;
        const height = dimentions.height;
        const contentType = file.mimetype;
        const size = file.size;
        const dataAsset = {
          typeData,
          name,
          dataBinary,
          contentType,
          appId,
          size,
          width,
          height,
        };
        const result = await this.minioClientPepository.uploadDataAsset(
          dataAsset,
        );
        await fs.unlinkSync(file.path);
        return result;
      }
      case 'audio': {
        if (file.size > 4 * 1024 * 1024) {
          console.log({ msg: 'Kich thuoc file qua lon' });
          throw new HttpException(
            'Kich thuoc file upload qua lon',
            HttpStatus.BAD_REQUEST,
          );
        }
        const typeData = 1;
        const name = file.originalname.substring(
          0,
          file.originalname.lastIndexOf('.'),
        );
        const dataBinary = fs.createReadStream(file.path);
        const contentType = file.mimetype;
        const size = file.size;
        // let dataAsset: DataAsset;
        const dataAsset = {
          typeData,
          name,
          size,
          dataBinary,
          contentType,
          appId,
        };
        const result = await this.minioClientPepository.uploadDataAsset(
          dataAsset,
        );
        await fs.unlinkSync(file.path);
        return result;
      }
      case 'video': {
        const typeData = 2;
        const name = file.originalname.substring(
          0,
          file.originalname.lastIndexOf('.'),
        );
        const dataBinary = fs.createReadStream(file.path);
        const contentType = file.mimetype;
        const size = file.size;
        const dataAsset = {
          typeData,
          name,
          dataBinary,
          contentType,
          appId,
          size,
        };
        const result = await this.minioClientPepository.uploadDataAsset(
          dataAsset,
        );
        const deletere = await fs.unlink(file.path, (error) => {
          if (error) {
            console.log(error);
          }
        });
        return result;
      }
    }
  }
  public bufferToStream(dataBinary: string | Buffer) {
    const streamData = new Stream.Readable();
    streamData.push(dataBinary);
    streamData.push(null);
    return streamData;
  }
}
