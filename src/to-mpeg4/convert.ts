const ffmpeg = require('fluent-ffmpeg');

export function convert(src: string, dst: string, size?: string) {
  let options = [
    '-c:v mpeg4',
    '-q:v 1',
    '-c:a copy',
  ];
  if (size) {
    options.push(`-vf scale=${size}`);
  }
  return new Promise<Error>(resolve => {
    ffmpeg(src)
      .outputOptions(options)
      .on('error', (err: Error) => resolve(err))
      .on('end', () => resolve())
      .save(dst);
  });
}
