import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongooseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const mongodbUri = configService.get<string>('MONGODB_URI');

  return {
    uri: mongodbUri,
  };
};
