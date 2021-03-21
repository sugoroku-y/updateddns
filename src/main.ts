import {promises} from 'fs';
import {generateKey, parseURL} from './URL';
import {join} from 'path';
import {error, rethrow} from './error-utils';
import {getContent} from './getContent';
import {homedir} from 'os';

interface Config {
  ipcheck: {
    url: string;
    pattern: string;
  };
  update: string[];
  forceExecInterval?: number;
}

const basedir = join(homedir(), '.updateddns');
const configPath = join(basedir, 'config');
const cachePath = join(basedir, 'ip-cache');
const credentialsConfig = {
  path: join(basedir, 'credentials'),
  key: 'rR1x5slaGy133/06gZKTlRN0Et+bt8ibzWpKn+r7NNagp0vsxu+yWdEq8cWqeQj4',
};

(async () => {
  try {
    const config = JSON.parse(
      await promises.readFile(configPath, 'utf8')
    ) as Readonly<Config>;
    const cacheStat = await promises
      .stat(cachePath)
      .catch(ex => (ex.code === 'ENOENT' ? undefined : rethrow(ex)));
    const ipcache = cacheStat && (await promises.readFile(cachePath, 'utf8'));

    const response = await getContent(config.ipcheck.url, credentialsConfig);
    const re = new RegExp(config.ipcheck.pattern);
    const ipfound =
      (re.exec(response)?.slice(1) as Array<string | undefined> | null)?.reduce(
        (r, e) => r ?? e
      ) ?? error`Pattern not found: ${config.ipcheck.pattern}`;
    if (
      ipfound === ipcache &&
      Date.now() - (cacheStat?.mtime?.getTime() ?? NaN) <
        (config.forceExecInterval ?? Infinity) * 24 * 60 * 60 * 1000
    ) {
      return;
    }
    console.log(`ip address updated: ${ipfound}`);
    for (const url of config.update) {
      const u = parseURL(url);
      const id = generateKey(u);
      try {
        await getContent(url, credentialsConfig);
        console.log(`update ${id}`);
      } catch (ex) {
        console.error(`Failed updating ${id}: ${ex.message || String(ex)}`);
      }
    }
    await promises.writeFile(cachePath, ipfound, 'utf8');
  } catch (ex) {
    console.error(ex);
    if (ex.stack) {
      console.log(ex.stack);
    }
    process.exit(1);
  }
})();
