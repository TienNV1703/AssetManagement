import * as fs from 'fs';
import { Asset } from 'src/database/schemas/Asset.schema';
import stream from 'stream';
export interface BufferedFile {
  typeData: number;
  originalname: string;
  width: number;
  height: number;
  size: number;
  appId: string;
  path: string;
  contentType: string;
  mimetype: AppMimeType;
  buffer: Buffer | string;
}

export interface StoredFile extends HasFile, StoredFileMetadata {}

export interface HasFile {
  file: Buffer | string;
}
export interface StoredFileMetadata {
  id: string;
  name: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string;
}

export type AppMimeType = 'video' | 'image' | 'audio';

export interface DataAsset {
  typeData: number;
  name: string;
  contentType: string;
  size: number;
  dataBinary: Buffer | stream;
  appId: string;
}
export interface ImageDataAsset extends DataAsset {
  width: number;
  height: number;
}

export interface VideoInfo {
  sizeThumb: number;
  durationInSeconds: number;
  width: number;
  height: number;
}
