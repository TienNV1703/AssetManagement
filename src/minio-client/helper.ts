import { Injectable } from '@nestjs/common';
import Ffmpeg = require('fluent-ffmpeg');
import * as config from 'config';

@Injectable()
export class MinioClientHelper {
  constructor() {}
  public async getVideoInfo(pathfile: string) {
    return new Promise((resolve, reject) => {
      return Ffmpeg.ffprobe(pathfile, (error, videoInfo) => {
        if (error) {
          return reject(error);
        }
        const { duration, size } = videoInfo.format;
        const width = videoInfo.streams[0].width;
        const height = videoInfo.streams[0].height;
        return resolve({
          sizeThumb: size,
          durationInSeconds: Math.floor(duration),
          width,
          height,
        });
      });
    });
  }

  public async createFragmentPreviewConst(
    inputPath: string,
    outputPath: string,
  ) {
    return new Promise((resolve, reject) => {
      this.getVideoInfo(inputPath).then((result) => {
        const durationInSeconds = result;
        const durationThumb: number = config.get(
          'thumbnailSettings.durationThumb',
        );
        const fpsThumb: number = config.get('thumbnailSettings.fpsThumb');
        const startTimeInSeconds = this.getStartTimeInSeconds(
          durationInSeconds,
          durationThumb,
        );
        return Ffmpeg()
          .input(inputPath)
          .inputOptions([`-ss ${startTimeInSeconds}`])
          .outputOptions([`-t ${durationThumb}`])
          .outputOption([`-r ${fpsThumb}`])
          .noAudio()
          .output(outputPath)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
    });
  }

  public async createFragmentPreview(
    pathFile: string,
    PathThumbnailFile: string,
  ) {
    return new Promise((resolve, reject) => {
      return Ffmpeg.ffprobe(pathFile, (error, videoInfo) => {
        if (error) {
          return reject(error);
        }
        const { duration, size } = videoInfo.format;
        const width = videoInfo.streams[0].width;
        const height = videoInfo.streams[0].height;
        return resolve({
          sizeThumb: size,
          durationInSeconds: Math.floor(duration),
          width,
          height,
        });
      });
    });
  }

  public async getStartTimeInSeconds(
    durationInSeconds: any,
    fragmentDurationInSeconds: number,
  ) {
    const safeVideoDurationInSeconds =
      durationInSeconds.durationInSeconds - fragmentDurationInSeconds;
    if (safeVideoDurationInSeconds <= 0) {
      return 0;
    }
    return this.getRandomIntegerInRange(
      0.25 * safeVideoDurationInSeconds,
      0.75 * safeVideoDurationInSeconds,
    );
  }

  public getRandomIntegerInRange(min: number, max: number) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);

    return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
  }
}
