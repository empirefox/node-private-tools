const ffmpeg = require('fluent-ffmpeg');

export function convert(src: string, dst: string) {
  return new Promise<Error>(resolve => {
    ffmpeg(src)
      .outputOptions([
        '-c:v mpeg4',
        '-q:v 1',
        '-c:a copy',
      ])
      .on('error', (err: Error) => resolve(err))
      .on('end', () => resolve())
      .save(dst);
  });
}
