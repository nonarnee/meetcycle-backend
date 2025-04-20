import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 값은 제거
      forbidNonWhitelisted: true, // 정의되지 않은 값 있으면 예외
      transform: true, // 요청 값을 자동으로 DTO 타입으로 변환
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
