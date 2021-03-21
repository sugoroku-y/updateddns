import {mkdirSync, writeFileSync, promises} from 'fs';
import {dirname} from 'path';
import {Crypto} from './crypto-lib';
import {rethrow} from './error-utils';

const modified = Symbol('modified');

interface CredentialsConfig {
  path: string;
  key: string;
}

export class Credentials {
  private static instance?: Credentials;
  private static path?: string;
  private static key?: string;
  static async init({path, key}: CredentialsConfig): Promise<Credentials> {
    if (this.instance) {
      if (this.path !== path || this.key !== key) {
        throw new Error('config');
      }
      return this.instance;
    }
    const cache: Credentials = JSON.parse(
      await promises
        .readFile(path, 'utf8')
        .catch(err => (err.code !== 'ENOENT' ? rethrow(err) : '{}'))
    );
    const crypto = new Crypto(key);
    this.instance = new Credentials(cache, crypto);
    this.path = path;
    this.key = key;
    process.on('exit', () => {
      if (!this.instance?.[modified]) {
        return;
      }
      // 終了処理中のためpromisesではなくSync版メソッドを使う
      mkdirSync(dirname(path), {recursive: true});
      writeFileSync(path, JSON.stringify(cache, undefined, 2), 'utf8');
    });
    return this.instance;
  }
  constructor(cache: Credentials, crypto: Crypto) {
    let _modified = false;
    return new Proxy<Credentials>(this, {
      get(
        _target: Credentials,
        name: string | symbol,
        _reciever?: unknown
      ): unknown {
        if (name === modified) {
          return _modified;
        }
        if (typeof name !== 'string') {
          return undefined;
        }
        const encrypted = cache[name];
        return encrypted ? crypto.decrypt(encrypted) : undefined;
      },
      set(
        _target: Credentials,
        name: string | symbol,
        value: string,
        _reciever?: unknown
      ): boolean {
        if (typeof name !== 'string') {
          return false;
        }
        const encrypted = crypto.encrypt(value);
        if (cache[name] !== encrypted) {
          _modified = true;
          cache[name] = encrypted;
        }
        return true;
      },
    });
  }
  readonly [modified]: boolean;
  [name: string]: string | undefined;
}
