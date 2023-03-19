import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): any => {
    return v2.config({
      cloud_name: 'djwjancqr',
      api_key: '831297235466967',
      api_secret: 'NA65eosiMLvW7ja6HeMi6oanaWc',
    });
  },
};
