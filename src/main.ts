import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // 프론트엔드 URL 또는 모든 출처 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 값은 제거
      forbidNonWhitelisted: true, // 정의되지 않은 값 있으면 예외
      transform: true, // 요청 값을 자동으로 DTO 타입으로 변환
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalGuards(new RolesGuard(reflector));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
