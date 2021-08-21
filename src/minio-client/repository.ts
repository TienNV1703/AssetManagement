import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';

import { BufferedFile, AppMimeType, DataAsset } from './file.model';
import { MinioService } from 'nestjs-minio-client';

import * as config from 'config';
import * as fs from 'fs';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Asset, AssetDocument } from 'src/database/schemas/Asset.schema';
import { Model } from 'mongoose';
// import {Client} from 'minio';

@Injectable()
export class MinioClientPepository {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    private readonly minio: MinioService,
  ) {}

  public get client() {
    return this.minio.client;
  }

  public async uploadDataAsset(dataAsset: any) {
    await this.checkInputUploadAsset(dataAsset);
    const timestamp = Date.now();
    var saveResult;
    var urlPreview;
    // Check bucket existed or not
    const existedBuket = await this.client.bucketExists(dataAsset.appId);
    // If bucket is not existed, create bucket
    if (!existedBuket) {
      const region = 'us-east-1';
      await this.client.makeBucket(dataAsset.appId, region, (error) => {
        if (error) {
          throw new HttpException(
            'Fail to create new  bucket in MinIO S3',
            HttpStatus.BAD_REQUEST,
          );
        }
      });
    }
    switch (dataAsset.typeData) {
      case 1: {
        // get content type: sample "contentType": "image/jpg" -> return jpg
        const endFile = dataAsset.contentType.split('/')[1];
        // asset/1/balance_1629273617030.png
        const path =
          'asset' +
          '/' +
          dataAsset.typeData +
          '/' +
          dataAsset.name +
          '_' +
          timestamp +
          '.' +
          endFile;
        const metaData = {
          'Content-Type': dataAsset.contentType,
        };
        await this.client.putObject(
          dataAsset.appId,
          path,
          dataAsset.dataBinary,
          metaData,
        );

        // Image file
        if (dataAsset.contentType.split('/')[0] === 'image') {
          // save data to mongodb
          const model = new this.assetModel({
            typeData: dataAsset.typeData,
            name: dataAsset.name,
            size: dataAsset.size,
            width: dataAsset.width,
            height: dataAsset.height,
            appId: dataAsset.appId,
            path: path,
            contentType: dataAsset.contentType,
          });
          saveResult = await model.save();
        }

        // Audio file
        else if (dataAsset.contentType.split('/')[0] === 'audio') {
          // save data to mongodb
          const model = new this.assetModel({
            typeData: dataAsset.typeData,
            name: dataAsset.name,
            size: dataAsset.size,
            appId: dataAsset.appId,
            path: path,
            contentType: dataAsset.contentType,
          });
          saveResult = await model.save();
        }
        const id = saveResult._id.toString();
        // urlPreview = '/api/asset/' + id + pathLib.extname(path);
        break;
      }
      case 2: {
        const pathThumb =
          'asset' +
          '/' +
          dataAsset.typeData +
          '/' +
          'thumbnail' +
          dataAsset.name +
          '_' +
          timestamp +
          '.gif';
        const contentTypeThumb = 'image/gif';
        const metaDataThumb = { 'Content-Type': contentTypeThumb };
        // await minioClient.putObject(appId, path, dataBinary, metaData)s
        // ???? why?
        await this.client.putObject(
          dataAsset.appId,
          pathThumb,
          dataAsset.dataBinary,
          metaDataThumb,
        );
        // save data to mongodb
        const model = new this.assetModel({
          typeData: dataAsset.typeData,
          name: dataAsset.name,
          size: dataAsset.size,
          width: dataAsset.width,
          height: dataAsset.height,
          appId: dataAsset.appId,
          size_thumb: dataAsset.size_thumb,
          pathThumb: pathThumb,
          contentType: dataAsset.contentType,
        });
        const result = await model.save();
        break;
      }
      default: {
        const error = 'Invalid type data';
        throw error;
      }

      // Get path preview
    }
  }

  checkInputUploadAsset(dataAsset: any) {
    if (dataAsset.typeData !== 1 && dataAsset.typeData !== 2) {
      throw new HttpException(
        'type data must be 1 or 2',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
