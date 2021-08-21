export class CreateAssetDto {
  readonly typeData: number;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly size: number;
  readonly widthThumb: number;
  readonly heightThumb: number;
  readonly sizeThumb: number;
  readonly appId: string;
  readonly path: string;
  readonly contentType: string;
  readonly pathThumb: string;
  readonly contentTypeThumb: string;
  readonly timestamp: number;
}
