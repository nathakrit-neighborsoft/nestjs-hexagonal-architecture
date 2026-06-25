import { HttpModuleOptions } from '@nestjs/axios';
import { Builder } from 'builder-pattern';

export const httpConfig = Builder<HttpModuleOptions>().global(true).build();
