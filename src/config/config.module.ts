import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';

import { loadConfig } from './config';
import { ConfigService } from './config.service';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(): DynamicModule {
    return NestConfigModule.forRoot({ load: [loadConfig] });
  }
}
