import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  const mimetype = file.mimetype.split('/')[0];
  if (!mimetype.match(/(video|image|audio)/)) {
    return callback(
      new Error('Only allowed to upload image, audio, video.'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const timestamp = Date.now();
  callback(null, `${name}-${timestamp}${fileExtName}`);
};
