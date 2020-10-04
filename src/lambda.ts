import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastify, FastifyInstance } from 'fastify';
import *  as awsLambdaFastify from 'aws-lambda-fastify';
import {
  Context,
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult
} from 'aws-lambda';

import { bootstrap } from './app';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

let cachedServer: NestApp;

process.on('unhandledRejection', (reason) => {
  console.error(reason);
});

process.on('uncaughtException', (reason) => {
  console.error(reason);
});

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  cachedServer = await bootstrap();
  const proxy = awsLambdaFastify(cachedServer.instance, binaryMimeTypes);
  return proxy(event, context);
}

// export async function bootstrap(): Promise<FastifyInstance> {
//   const serverOptions = {
//     logger: true,
//   };
//   const instance: FastifyInstance = fastify(serverOptions);
//   const nestApp = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter(instance),
//   );
//   nestApp.setGlobalPrefix('api');
//   nestApp.enableCors();
//   await nestApp.init();
//   return instance;
// }

// let fastifyServer: FastifyInstance;

// export const handler: Handler = async (
//   event: APIGatewayProxyEvent,
//   context: Context,
// ): Promise<APIGatewayProxyResult> => {
//   if (!fastifyServer) {
//     fastifyServer = await bootstrap();
//   }
//   return await proxy(fastifyServer, event, context, binaryMimeTypes);
// };
