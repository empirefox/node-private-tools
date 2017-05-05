const ffmpeg = require('fluent-ffmpeg');

// ffmpeg -i 2.a.mp4 -acodec copy -f segment -segment_time 300 -vcodec copy -reset_timestamps 1 -map 0 ./poetry2/2.a/2.a.%d.mp4
export class Converter {

  static initOutputOptions(outputOptions: string[] = []): string[] {
    return [
      '-c:v mpeg4',
      '-q:v 1',
      '-c:a copy',
      ...outputOptions,
    ];
  }

  constructor(public basename: string, private src: string, private dst: string, private outputOptions: string[] = []) { }

  convert() {
    return new Promise<Error | undefined>(resolve => {
      ffmpeg(this.src)
        .outputOptions(this.outputOptions)
        .on('error', (err: Error) => resolve(err))
        .on('end', () => resolve())
        .save(this.dst);
    });
  }

}
