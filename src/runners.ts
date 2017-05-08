import { Arukas } from './arukas/runner';
import { CityMobileSections } from './city-mobile-sections/runner';
import { GoConstTs } from './go-const-ts/runner';
import { GoTagApis } from './go-tag-apis/runner';
import { Json2ts } from './json2ts/runner';
import { Kuaidi100 } from './kuaidi100/runner';
import { ReplaceInFile } from './replace-in-file/runner';
import { SvgPatterns } from './svg-patterns/runner';
import { ToMpeg4 } from './to-mpeg4/runner';
import { TsTrans } from './ts-trans/runner';

export {
  Arukas,
  CityMobileSections,
  GoConstTs,
  GoTagApis,
  Json2ts,
  Kuaidi100,
  ReplaceInFile,
  SvgPatterns,
  ToMpeg4,
  TsTrans,
}

export const RUNNERS = [
  Arukas,
  CityMobileSections,
  GoConstTs,
  GoTagApis,
  Json2ts,
  Kuaidi100,
  ReplaceInFile,
  SvgPatterns,
  ToMpeg4,
  TsTrans,
];

export * from './tools-loader/loader';
