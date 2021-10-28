import { Container } from 'typedi';
import { useContainer, useRoutingControllers } from '@shared/routing-controllers';
import { Configuration } from '../config';
import { controllers } from './controllers';
import { AUTH_CONFIG } from './injectTokens';

export const makeRouter = ({ auth: authConfig }: Configuration) => {
  Container.set(AUTH_CONFIG, authConfig);

  useContainer(Container);

  return useRoutingControllers({
    controllers,
  });
};
