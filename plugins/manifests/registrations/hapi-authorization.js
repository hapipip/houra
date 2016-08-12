import Config from '../config';

{
    register: 'hapi-authorization',
    options: {
      roles: Config.security.roles
    }
}
