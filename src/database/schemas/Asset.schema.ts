import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uuid from 'uuid';

export type AssetDocument = Asset & Document;

@Schema({ _id: true })
export class Asset {
  // auto generated
  @Prop({ type: String, default: uuid.v4 })
  id: string;

  @Prop({ default: null })
  typeData: number;

  @Prop({ type: String, default: null })
  name: string;

  @Prop({ default: null })
  size: number;

  @Prop({ default: null })
  width: number;

  @Prop({ default: null })
  height: number;

  @Prop({ type: String, default: null })
  appId: string;

  @Prop({ default: null })
  widthThumb: number;

  @Prop({ default: null })
  heightThumb: number;

  @Prop({ default: null })
  sizeThumb: number;

  @Prop({ type: String, default: null })
  path: string;

  @Prop({ type: String, default: null })
  contentType: string;

  @Prop({ type: String, default: null })
  pathThumb: string;

  @Prop({ type: String, default: null })
  contentTypeThumb: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
