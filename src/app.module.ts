import { Module } from '@nestjs/common';
import { ConfigModule } from './config';

import { ExchangeModule } from './exchange';

@Module({
  imports: [ConfigModule.forRoot(), ExchangeModule],
})
export class AppModule {}
