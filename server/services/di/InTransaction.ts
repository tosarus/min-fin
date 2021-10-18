import { BaseService } from './BaseService';

export function InTransaction<Service extends BaseService>() {
  return function (target: Service, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const self = this as Service;
      const baseQm = self.getManager();
      try {
        return await baseQm.transaction((qm) => {
          self.setManager(qm);
          return method.apply(self, args);
        });
      } finally {
        self.setManager(baseQm);
      }
    };
  };
}
