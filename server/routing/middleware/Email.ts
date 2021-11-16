import { createParamDecorator } from '@tosarus/routing-express';

export function Email() {
  return createParamDecorator({
    required: true,
    value: (action) => (action.request as any).email,
  });
}
