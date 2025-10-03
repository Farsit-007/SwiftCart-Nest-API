/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const ResponseMessage = (message: string) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    descriptor.value.__responseMessage = message; // attach message to the handler
  };
};
