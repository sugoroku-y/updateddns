import {get as httpGet, IncomingMessage} from 'http';
import {get as httpsGet} from 'https';
import {error} from './error-utils';
import {prompt} from './readline-utils';
import {Credentials} from './credentials';
import {parseURL, generateKey} from './URL';

export async function getContent(
  _url: string,
  credentialsConfig?: {path: string; key: string}
): Promise<string> {
  const credentials = credentialsConfig
    ? await Credentials.init(credentialsConfig)
    : undefined;
  const url = parseURL(_url);
  const get = url.protocol === 'https' ? httpsGet : httpGet;
  let count = 4;
  const options: {auth?: string} = {};
  const credentialsKey = generateKey(url);
  options.auth =
    url.username && url.password
      ? `${url.username}:${url.password}`
      : credentials?.[credentialsKey];
  const href = `${url.protocol}://${url.host}${url.pathname ?? ''}${
    url.search ?? ''
  }`;
  do {
    try {
      const res = await new Promise<IncomingMessage>(resolve =>
        get(href, {...options, rejectUnauthorized: false}, res => resolve(res))
      );
      if (res.statusCode === 401) {
        throw 'Unauthorized';
      }
      if (res.statusCode !== 200) {
        error(`${res.statusCode} ${res.statusMessage}`);
      }
      let content = Buffer.of();
      return await new Promise<string>(resolve =>
        res
          .on('data', chunk => {
            content = Buffer.concat([content, chunk]);
          })
          .on('end', () => {
            resolve(content.toString());
          })
          .on('error', err => {
            throw err;
          })
      );
    } catch (ex) {
      if (ex !== 'Unauthorized') {
        throw ex;
      }
      if (!credentials) {
        break;
      }
      const usernameDefault =
        options.auth?.match(/^[^:]+/)?.[0] ?? url.username;
      const username =
        (await prompt(
          `Username${usernameDefault ? `(${usernameDefault})` : ''}: `
        )) || usernameDefault;
      const password = await prompt('Password: ', '*');
      options.auth = `${username}:${password}`;
      credentials[credentialsKey] = options.auth;
    }
  } while (--count > 0);
  throw new Error('401 Unauthorized');
}
