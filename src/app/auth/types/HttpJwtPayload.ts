import { Rule } from '../../../config/RuleConfig';
import { Request } from 'express';
import { Optional } from '../../../core/common/CommonTypes';
import { Exception } from '../../../core/Exception';
import { Code } from '../../../core/common/Code';

export class HttpJwtPayload {
  iss: string;
  sub: string;
  prm: string;
  iat: number;
  exp: number;

  constructor(id: string, key: string, validity: number) {
    this.iss = Rule.TOKEN.ISSUER;
    this.sub = id;
    this.prm = key;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity / 1000;
  }
  public toPlain() {
    return Object.assign({}, this);
  }
  public static extractTokenFromRequest(req: Request) {
    const token = req.headers[Rule.TOKEN.HEADER] as Optional<string>;
    if (!token) {
      throw Exception.new({
        code: Code.UNAUTHORIZED_ERROR,
        overrideMessage: `missing header - ${Rule.TOKEN.HEADER} : <access_token>`,
      });
    }
    return token;
  }
}
