import axios from 'axios';
import { load } from 'cheerio';

export interface Pattern {
  name: string;
  base64: string;
  font: string;
}

export function parse(url: string): Promise<Pattern[]> {
  return axios.get(url).then(res => {
    const $ = load(res.data);
    return $('#patterns > li').toArray().map(e => {
      const li = $(e);
      const style = li.attr('style');
      const start = style.indexOf(',') + 1;
      return <Pattern>{
        name: li.attr('name'),
        base64: li.attr('style').slice(start, -3),
        font: li.find('span').first().attr('class'),
      };
    }).filter(e => !/,url\('data:image/.test(e.base64));
  });
}
