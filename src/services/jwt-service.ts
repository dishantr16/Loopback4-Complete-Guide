import {HttpErrors} from '@loopback/rest';
import {UserProfile,securityId} from '@loopback/security';
import {inject} from '@loopback/core';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);


export class JWTService {
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret: string;
  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
  public readonly jwtExpiresIn: string;

  async generateToken(userProfile: UserProfile): Promise<string> {
    if(!userProfile){
      throw new HttpErrors.Unauthorized('Error while generating a token: userprofile is null');
    }

  let token = '';
  try{
    token = await signAsync(userProfile, this.jwtSecret,{
      expiresIn: this.jwtExpiresIn,
    });
  } catch (err) {
    throw new HttpErrors.Unauthorized(`error generating token ${err}`);
  }
  return token;
  }
  async verifyToken(token:string) : Promise<UserProfile> {
    return Promise.resolve({name:'daisy', [securityId]:'15'});
  }
}
