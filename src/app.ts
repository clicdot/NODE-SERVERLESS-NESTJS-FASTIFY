import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastify, FastifyInstance } from 'fastify';
import helmet from 'fastify-helmet';
import { AppModule } from './app.module';
import { GlobalInterceptor } from './common/interceptor/global.interceptor';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { ErrorsInterceptor } from './common/interceptor/errors.interceptor';
import { HttpExceptionFilter } from './common/filters/errors.exception';
import { ResponseService } from './common/services/response/response.service';

interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

let cachedServer: NestApp;
let app;
let instance: FastifyInstance;

export async function bootstrap(): Promise<NestApp> {
  if (!cachedServer) {
    try {
      const responseSet = new ResponseService();
      const serverOptions = {
        logger: true,
      };
      instance = fastify(serverOptions);

      app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(instance),
      );

      app.register(helmet, {
        contentSecurityPolicy: false,
      });

      // nestApp configuration
      app.setGlobalPrefix('api');
      app.useGlobalFilters(new HttpExceptionFilter(responseSet));
      app.useGlobalInterceptors(new GlobalInterceptor());
      app.useGlobalInterceptors(new TransformInterceptor(responseSet));
      app.useGlobalInterceptors(new ErrorsInterceptor());

      // Swagger Docs
      const options = new DocumentBuilder()
        .setTitle(process.env.SWAGGER_TITLE)
        .setDescription(process.env.SWAGGER_DESCR)
        .setVersion(process.env.SWAGGER_VS)
        .addTag('Swagger')
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('swagger', app, document);

      await app.init();
      await instance.ready();
    }
    catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve({
    app,
    instance
  });
}
