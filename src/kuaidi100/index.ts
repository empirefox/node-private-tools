import axios from 'axios';
import { usage } from 'yargs';
import { writeFileSync } from 'fs';

let argv = usage('Usage: $0 [options]')
  .example('$0 -o coms.json', 'generate Kuaidi100 company list')
  .options({
    o: {
      alias: 'out',
      nargs: 1,
      describe: 'output file, support .js .json',
      demand: true,
      coerce: (arg: string) => /\.js(on)?$/.test(arg) ? arg : `${arg}.json`,
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

  let content = JSON.stringify(map, null, '\t');
  if ((<string>argv.o).endsWith('js')) {
    content = `export const companys = ${content};`;
  }

  writeFileSync(argv.o, content, { encoding: 'utf8' });
  process.stdout.write('done!\n');
});
