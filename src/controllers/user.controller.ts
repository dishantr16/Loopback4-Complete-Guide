import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, post, requestBody, SchemaObject} from '@loopback/rest';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import * as _ from 'lodash';
import {validateCredentials} from '../services/validator';
import {inject} from '@loopback/core';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {CredentialsRequestBody} from './specs/user.controller.spec';
import {MyUserService} from '../services/user-service';
import {JWTService} from '../services/jwt-service';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {UserProfile,securityId} from '@loopback/security';
import {authenticate} from '@loopback/authentication';


export class UserController {
  constructor(
    @repository(UserRepository)
    public UserRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })

  async signup(@requestBody() userData: User ){
    validateCredentials(_.pick(userData,['email','password']))

    userData.password = await this.hasher.hashPassword(userData.password);
    const savedUser = await this.UserRepository.create(userData);
    //delete savedUser.password;
    return savedUser;
  }

  @post('/users/login',{
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(@requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {

    const user =  await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile)
    return Promise.resolve({token});
  }
  @get('/users/me')
  @authenticate('jwt')
  async me(): Promise<UserProfile> {
    return Promise.resolve({[securityId]: '15', name:'daisy'})
  }
}
