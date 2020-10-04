import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastify, FastifyInstance } from 'fastify';

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
      const serverOptions = {
        logger: true,
      };
      instance = fastify(serverOptions);

      app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(instance),
      );

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
