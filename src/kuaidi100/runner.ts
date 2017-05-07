import axios from 'axios';
import { Runner, RunnerWithSchema, writeFile } from '../common';
import { Kuaidi100Config } from '../schemas';

export class Kuaidi100 implements Runner {

  static forLoader(): RunnerWithSchema {
    return {
      $tool: 'kuaidi100',
      schema: require('../schemas/kuaidi100.json'),
      runner: Kuaidi100,
    };
  }

  constructor(public config: Kuaidi100Config) { }

  run(): Promise<any> {
    // https://rawgit.com/simman/Kuaidi100/master/companys.json
    // https://rawgit.com/liyiorg/common/master/src/main/java/com/github/liyiorg/common/api/companys.json
    return axios.get(this.config.url).then(res => {
      const data: { number: string, name: string }[] = res.data;
      const map: any = {};
      data.forEach(com => {
        map[com.number] = { name: com.name };
      });

      return writeFile(this.config.dist, map);
    });
  }

}
