import {createCipheriv, createDecipheriv} from 'crypto';

// for (const algorithm of crypto.getCiphers()) {
//   const ks: number[] = [];
//   const is: number[] = [];
//   for (let k = 1; k < 256; ++k) {
//     for (let i = 1; i < 256; ++i) {
//       const key = Buffer.from(new Uint8Array(k));
//       const iv = Buffer.from(new Uint8Array(i));
//       try {
//         const cipher = crypto.createCipheriv(algorithm, key, iv);
//         const decipher = crypto.createDecipheriv(algorithm, key, iv);
//         if (
//           Buffer.concat([
//             decipher.update(
//               Buffer.concat([cipher.update('test'), cipher.final()])
//             ),
//             decipher.final(),
//           ]).toString() === 'test'
//         ) {
//           ks.push(k);
//           if (is.slice(-1)[0] !== i) is.push(i);
//         }
//       } catch (ex) {
//         // nothing to do
//       }
//     }
//   }
//   if (ks.length === 0 || is.length === 0) {
//     continue;
//   }
//   const kk =
//     ks.length === 1 ? ks[0] :
//     ks[0] === 1 && ks.slice(-1)[0] === 255 && ks.length === 255 ? NaN :
//     error`indefinite length of key: ${ks}`;
//   const ii =
//     is.length === 1 ? is[0] :
//     is[0] === 1 && is.slice(-1)[0] === 255 && is.length === 255 ? NaN :
//     error`indefinite length of iv: ${is}`;
//   console.log(`  '${algorithm}': [${kk}, ${ii}],`);
// }
const algorithmKeySpec = {
  'aes-128-cbc': [16, 16],
  'aes-128-cbc-hmac-sha1': [16, 16],
  'aes-128-cbc-hmac-sha256': [16, 16],
  'aes-128-cfb': [16, 16],
  'aes-128-cfb1': [16, 16],
  'aes-128-cfb8': [16, 16],
  'aes-128-ctr': [16, 16],
  'aes-128-ofb': [16, 16],
  'aes-192-cbc': [24, 16],
  'aes-192-cfb': [24, 16],
  'aes-192-cfb1': [24, 16],
  'aes-192-cfb8': [24, 16],
  'aes-192-ctr': [24, 16],
  'aes-192-ofb': [24, 16],
  'aes-256-cbc': [32, 16],
  'aes-256-cbc-hmac-sha1': [32, 16],
  'aes-256-cbc-hmac-sha256': [32, 16],
  'aes-256-cfb': [32, 16],
  'aes-256-cfb1': [32, 16],
  'aes-256-cfb8': [32, 16],
  'aes-256-ctr': [32, 16],
  'aes-256-ofb': [32, 16],
  'aes128': [16, 16],
  'aes192': [24, 16],
  'aes256': [32, 16],
  'aria-128-cbc': [16, 16],
  'aria-128-cfb': [16, 16],
  'aria-128-cfb1': [16, 16],
  'aria-128-cfb8': [16, 16],
  'aria-128-ctr': [16, 16],
  'aria-128-ofb': [16, 16],
  'aria-192-cbc': [24, 16],
  'aria-192-cfb': [24, 16],
  'aria-192-cfb1': [24, 16],
  'aria-192-cfb8': [24, 16],
  'aria-192-ctr': [24, 16],
  'aria-192-ofb': [24, 16],
  'aria-256-cbc': [32, 16],
  'aria-256-cfb': [32, 16],
  'aria-256-cfb1': [32, 16],
  'aria-256-cfb8': [32, 16],
  'aria-256-ctr': [32, 16],
  'aria-256-ofb': [32, 16],
  'aria128': [16, 16],
  'aria192': [24, 16],
  'aria256': [32, 16],
  'bf': [NaN, 8],
  'bf-cbc': [NaN, 8],
  'bf-cfb': [NaN, 8],
  'bf-ofb': [NaN, 8],
  'blowfish': [NaN, 8],
  'camellia-128-cbc': [16, 16],
  'camellia-128-cfb': [16, 16],
  'camellia-128-cfb1': [16, 16],
  'camellia-128-cfb8': [16, 16],
  'camellia-128-ctr': [16, 16],
  'camellia-128-ofb': [16, 16],
  'camellia-192-cbc': [24, 16],
  'camellia-192-cfb': [24, 16],
  'camellia-192-cfb1': [24, 16],
  'camellia-192-cfb8': [24, 16],
  'camellia-192-ctr': [24, 16],
  'camellia-192-ofb': [24, 16],
  'camellia-256-cbc': [32, 16],
  'camellia-256-cfb': [32, 16],
  'camellia-256-cfb1': [32, 16],
  'camellia-256-cfb8': [32, 16],
  'camellia-256-ctr': [32, 16],
  'camellia-256-ofb': [32, 16],
  'camellia128': [16, 16],
  'camellia192': [24, 16],
  'camellia256': [32, 16],
  'cast': [NaN, 8],
  'cast-cbc': [NaN, 8],
  'cast5-cbc': [NaN, 8],
  'cast5-cfb': [NaN, 8],
  'cast5-ofb': [NaN, 8],
  'chacha20': [32, 16],
  'des': [8, 8],
  'des-cbc': [8, 8],
  'des-cfb': [8, 8],
  'des-cfb1': [8, 8],
  'des-cfb8': [8, 8],
  'des-ede-cbc': [16, 8],
  'des-ede-cfb': [16, 8],
  'des-ede-ofb': [16, 8],
  'des-ede3-cbc': [24, 8],
  'des-ede3-cfb': [24, 8],
  'des-ede3-cfb1': [24, 8],
  'des-ede3-cfb8': [24, 8],
  'des-ede3-ofb': [24, 8],
  'des-ofb': [8, 8],
  'des3': [24, 8],
  'desx': [24, 8],
  'desx-cbc': [24, 8],
  'id-aes128-wrap-pad': [16, 4],
  'id-aes192-wrap-pad': [24, 4],
  'id-aes256-wrap-pad': [32, 4],
  'idea': [16, 8],
  'idea-cbc': [16, 8],
  'idea-cfb': [16, 8],
  'idea-ofb': [16, 8],
  'rc2': [NaN, 8],
  'rc2-128': [NaN, 8],
  'rc2-40': [NaN, 8],
  'rc2-40-cbc': [NaN, 8],
  'rc2-64': [NaN, 8],
  'rc2-64-cbc': [NaN, 8],
  'rc2-cbc': [NaN, 8],
  'rc2-cfb': [NaN, 8],
  'rc2-ofb': [NaN, 8],
  'seed': [16, 16],
  'seed-cbc': [16, 16],
  'seed-cfb': [16, 16],
  'seed-ofb': [16, 16],
  'sm4': [16, 16],
  'sm4-cbc': [16, 16],
  'sm4-cfb': [16, 16],
  'sm4-ctr': [16, 16],
  'sm4-ofb': [16, 16],
} as const;
export type Algorithm = keyof typeof algorithmKeySpec;

export class Crypto {
  private readonly key: Buffer;
  private readonly iv: Buffer;
  constructor(
    key: string,
    private readonly algorithm: Algorithm = 'aes-256-cbc',
    private readonly encoding: 'hex' | 'base64' = 'base64'
  ) {
    const buf = Buffer.from(key, encoding);
    const [k, i] = algorithmKeySpec[algorithm];
    if (buf.length < (k || 1) + (i || 1)) {
      throw new Error(`too short key length: ${key}`);
    }
    this.key = buf.slice(0, k ? k : i ? buf.length - i : (buf.length + 1) >> 1);
    this.iv = buf.slice(this.key.length, i ? this.key.length + i : buf.length);
  }
  encrypt(raw: string): string {
    const cipher = createCipheriv(this.algorithm, this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(raw), cipher.final()]);
    return encrypted.toString(this.encoding);
  }
  decrypt(encrypted: string): string {
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted, this.encoding),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
