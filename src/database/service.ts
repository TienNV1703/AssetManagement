import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { EventEmitter } from '@nestjs/event-emitter';
// import { dotenv }  from 'dotenv';
// dotenv.config();
// const mediator = new EventEmitter();
// // import config from './config';
// const { serverSettings } = config;
// const { minioSettings } = config;
import { CreateAssetDto } from './dto/create-asset';
// import { Connection, createConnection } from 'mongoose';
import { Model } from 'mongoose';
import { Asset, AssetDocument } from './schemas/Asset.schema';

@Injectable()
export class DatabaseConnectionService {
  constructor(
    @InjectModel(Asset.name) private readonly AssetModel: Model<AssetDocument>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const createdAsset = new this.AssetModel(createAssetDto);
    return createdAsset.save();
  }

  async findAll(): Promise<Asset[]> {
    return this.AssetModel.find().exec();
  }
}
