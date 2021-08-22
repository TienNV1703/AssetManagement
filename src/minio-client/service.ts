import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { MinioClientPepository } from './repository';
import { MinioClientHelper } from './helper';
import {
  BufferedFile,
  ImageDataAsset,
  DataAsset,
  VideoInfo,
} from './file.model';
import * as config from 'config';
import * as fs from 'fs';
import { Request } from 'express';
import sizeOf = require('image-size');
import Stream = require('stream');

@Injectable()
export class MinioClientService {
  constructor(
    private minioClientPepository: MinioClientPepository,
    private minioClientHelper: MinioClientHelper,
  ) {}

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
        // let dataAsset: ImageDataAsset;
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
        // let videoInfo: any ;
        const videoInfo: any = await this.minioClientHelper.getVideoInfo(
          file.path,
        );
        const timestamp = new Date().getTime();
        const pathFileThumbnailPreview = '/tmp/' + timestamp + '.gif';
        const contentTypeThumb = 'image/gif';
        if (videoInfo.width < 400) {
          await this.minioClientHelper.createFragmentPreviewConst(
            file.path,
            pathFileThumbnailPreview,
          );
        } else if (videoInfo.width >= 400) {
          await this.minioClientHelper.createFragmentPreview(
            file.path,
            pathFileThumbnailPreview,
          );
        }
        const dataBinaryThumb = fs.createReadStream(pathFileThumbnailPreview);
        const thumbnaiInfo: any = await this.minioClientHelper.getVideoInfo(
          file.path,
        );
        // const thumbnaiInfo: any = await this.minioClientHelper.getVideoInfo(pathFileThumbnailPreview);
        const { widthThumb, heightThumb, sizeThumb } = thumbnaiInfo;
        const width = videoInfo.width;
        const height = videoInfo.height;
        const dataAsset = {
          typeData,
          name,
          dataBinaryThumb,
          dataBinary,
          contentType,
          appId,
          width,
          height,
          size,
          widthThumb,
          heightThumb,
          sizeThumb,
          contentTypeThumb,
        };
        const result = await this.minioClientPepository.uploadDataAsset(
          dataAsset,
        );
        // await unlink(req.file.path)
        // await unlink(pathFileThumbnailPreview)
        // res.status(status.OK).json({ msg: 'Them thanh cong', result });
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
