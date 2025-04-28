import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const getMongooseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const mongodbUri = configService.get<string>('MONGODB_URI');
  const mongodbName = configService.get<string>('MONGODB_NAME');

  if (!mongodbUri) {
    console.error(
      'MongoDB URI is not defined. Please set the MONGODB_URI environment variable.',
    );
    // 개발 환경에서는 에러를 발생시키지만, 배포 환경에서는 Secret File이 로드되기 전에
    // 이 코드가 실행될 수 있으므로 대체 값을 제공합니다.
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using fallback connection method for production...');
    } else {
      throw new Error('MONGODB_URI is not defined');
    }
  }

  return {
    uri: mongodbUri,
    dbName: mongodbName,
    connectionFactory: (connection: Connection) => {
      connection.on('connected', () => {
        console.log('MongoDB is connected');
      });
      connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });
      return connection;
    },
  };
};
