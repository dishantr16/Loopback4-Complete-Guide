import {SchemaObject} from '@loopback/rest';

export const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email','password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minlength: 6,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of Login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};



