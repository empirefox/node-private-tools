import { Runner, RunnerWithSchema } from '../common';
import { CityMobileSectionsConfig } from '../schemas';

import { connect } from './conn';
import { Phone } from './phone';

const { writeFileSync } = require('fs-plus');

export class CityMobileSections {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'city-mobile-sections',
      schema: require('../schemas/city-mobile-sections.json'),
      runner: CityMobileSections,
    };
  }

  constructor(public config: CityMobileSectionsConfig) { }

  run(): Promise<any> {
    return connect(this.config.driver).then(async c => {
      const { column, value, dist } = this.config;
      const query = c.getRepository(Phone)
        .createQueryBuilder('p')
        .select('phone')
        .where(`p."${column}" = :v`, { v: value });
      const ps = await query.getRawMany();
      c.close();
      const list = ps.map((p: Phone) => p.phone).join('\n');
      writeFileSync(dist, list, { encoding: 'utf8' });
    });
  }

}