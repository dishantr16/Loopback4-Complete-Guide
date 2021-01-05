import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';
import {UserProfile,securityId} from '@loopback/security';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify)

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
    if(!token){
      throw new HttpErrors.Unauthorized(`error verifying token:'token' is null`,);
    }
    let userProfile: UserProfile;
    try{
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {id: decryptedToken.id, name: decryptedToken.name},
      );
    }catch(error){
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }
}
