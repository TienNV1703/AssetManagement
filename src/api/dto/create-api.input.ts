// import { InputType, Int, Field } from '@nestjs/graphql';

// @InputType()
export class CreateApiInput {
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  appId: string;
  id: string;
  urlPreview: string;
  urlDetail: string;
  name: string;
  contentType: string;
  width: number;
  height: number;
  size: number;
  typeData: number;
  contentTypeThumb: string;
  path: string;
  pathThumb: string;
}
