import './pollyfill';
import axios from 'axios';
import { load } from 'cheerio';
import { usage } from 'yargs';
import { writeFileSync } from 'fs';

import { args } from './args';
import { conn } from './conn';
import { Phone } from './phone';

conn.then(async c => {
  let query = c.getRepository(Phone)
    .createQueryBuilder('p')
    .select('phone')
    .where(`p."${args.column}" = :v`, { v: args.param });
  let ps = await query.getRawMany();
  c.close();
  let list = ps.map((p: Phone) => p.phone).join('\n');
  writeFileSync(args.out, list, { encoding: 'utf8' });
}).catch(err => console.error(err));
