import { ConfigService as NestConfigService } from '@nestjs/config';

import { Config } from './config';

export class ConfigService extends NestConfigService<Config, true> {}
