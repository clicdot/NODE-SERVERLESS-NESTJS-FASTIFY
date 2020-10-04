import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as fs from 'fs-extra';
let config = {};

try {
  if (fs.existsSync(__dirname + '/.env')) {
    config = {
      envFilePath: __dirname + '/.env'
    };
  }
} catch(err) {
  config = {
    ignoreEnvFile: true
  };
}

@Module({
  imports: [
    ConfigModule.forRoot(config)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
