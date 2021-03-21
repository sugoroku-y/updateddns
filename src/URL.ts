import {error} from './error-utils';

type Pathname = `/${string}`;
type Search = `?${string}`;
type URL = {
  protocol: 'http' | 'https';
  username?: string;
  password?: string;
  host: string;
  pathname?: Pathname;
  search?: Search;
};

function isPathname(s: string | undefined): s is Pathname | undefined {
  return s === undefined || s.charAt(0) === '/';
}

function isSearch(s: string | undefined): s is Search | undefined {
  return s === undefined || s.charAt(0) === '?';
}

export function parseURL(url: string): URL {
  const [, protocol, username, password, host, pathname, search] =
    /^(https?):\/\/(?:(.*?)(?::(.*))?@)?((?:\[.*?\]|[^:/]+)(?::\d+)?)(\/.*?)(\?.*)?$/.exec(
      url
    ) ?? error`Unrecognized url: ${url}`;
  if (protocol !== 'http' && protocol !== 'https') error(``);
  if (!isPathname(pathname)) error(``);
  if (!isSearch(search)) error(``);
  return {
    protocol,
    username,
    password,
    host,
    pathname,
    search,
  };
}

export function generateKey(url: URL) {
  return `${url.protocol}://${url.username?.concat('@') ?? ''}${url.host}`;
}
