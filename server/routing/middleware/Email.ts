import { createParamDecorator } from '@shared/routing-controllers';

export function Email() {
  return createParamDecorator({
    required: true,
    value: (action) => (action.request as any).email,
  });
}
