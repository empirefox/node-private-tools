'use strict';

let ffmpeg = require('fluent-ffmpeg');

function convert(src, dst) {
  return new Promise(resolve => {
    ffmpeg(src)
      .outputOptions([
        '-c:v mpeg4',
        '-q:v 1',
        '-c:a copy',
      ])
      .on('error', function(err) {
        console.log('An error occurred: ' + err.message);
        resolve();
      })
      .on('end', function() {
        console.log('OK: ' + dst);
        resolve();
      })
      .save(dst);
  });
}

module.exports = convert;
