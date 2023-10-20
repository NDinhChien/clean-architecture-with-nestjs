import * as path from 'path';
import * as fs from 'fs';

export function readPrivateKey() {
  return fs
    .readFileSync(path.join(path.resolve(), 'src/app/auth/keys/private.pem'))
    .toString();
}

export function readPublicKey() {
  return fs
    .readFileSync(path.join(path.resolve(), 'src/app/auth/keys/public.pem'))
    .toString();
}
