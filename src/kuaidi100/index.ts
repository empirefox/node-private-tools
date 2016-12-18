import axios from 'axios';
import { usage } from 'yargs';
import { writeFile } from '../common';

let argv = usage('Usage: $0 [options]')
  .example('$0 -o coms.json', 'generate Kuaidi100 company list')
  .options({
    o: {
      alias: 'out',
      nargs: 1,
      describe: 'output file, support .ts .js .json',
      demand: true,
      coerce: (arg: string) => /\.(ts|js|json)$/.test(arg) ? arg : `${arg}.json`,
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;

// https://rawgit.com/simman/Kuaidi100/master/companys.json
// https://rawgit.com/liyiorg/common/master/src/main/java/com/github/liyiorg/common/api/companys.json

axios.get('https://rawgit.com/simman/Kuaidi100/master/companys.json').then(res => {
  let data: { number: string, name: string }[] = res.data;
  let map: any = {};
  data.forEach(com => {
    map[com.number] = { name: com.name };
  });

  writeFile(argv.o, map);
});
