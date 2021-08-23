import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';

import { BufferedFile, AppMimeType, DataAsset } from './file.model';
// import { MinioService } from 'nestjs-minio-client';
import { S3 } from 'aws-sdk';
import { InjectS3 } from 'nestjs-s3';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Asset, AssetDocument } from 'src/database/schemas/Asset.schema';
import { Model } from 'mongoose';
// import {Client} from 'minio';

@Injectable()
export class MinioClientPepository {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    // private readonly minio: MinioService,
    @InjectS3() private readonly s3: S3,
  ) {}

  public async uploadDataAsset(dataAsset: any) {
    await this.checkInputUploadAsset(dataAsset);
    const timestamp = Date.now();
    let saveResult;
    // let urlPreview;
    // Check bucket existed or not
    try {
      const createResult = await this.s3
        .createBucket({ Bucket: dataAsset.appId })
        .promise();
      console.log(createResult);
    } catch (e) {}

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
        try {
          await this.s3
            .upload({
              Bucket: dataAsset.appId,
              Key: String(path),
              Body: dataAsset.dataBinary,
            })
            .promise();
        } catch (e) {
          console.log(e);
        }

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
        const endFile = dataAsset.contentType.split('/')[1];
        const pathThumb =
          'asset' +
          '/' +
          dataAsset.typeData +
          '/' +
          dataAsset.name +
          '_' +
          timestamp +
          '.' +
          endFile;
        const contentTypeThumb = 'image/gif';
        const metaDataThumb = { 'Content-Type': contentTypeThumb };
        try {
          await this.s3
            .upload({
              Bucket: dataAsset.appId,
              Key: String(pathThumb),
              Body: dataAsset.dataBinary,
            })
            .promise();
        } catch (e) {
          console.log(e);
        }
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
