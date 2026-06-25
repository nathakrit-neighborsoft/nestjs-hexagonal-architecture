import { ConfigModuleOptions } from '@nestjs/config';
import { Builder } from 'builder-pattern';
import 'dotenv/config';

export const configModule = Builder<ConfigModuleOptions>()
  .envFilePath(['.env', '.env.development.local'])
  .isGlobal(true)
  .build();

export const nodeEnv = process.env.NODE_ENV ?? 'develop';
export const port = process.env.PORT ?? 9009;
export const defaultTimeZone = process.env.DEFAULT_TIME_ZONE ?? 'Asia/Bangkok';
