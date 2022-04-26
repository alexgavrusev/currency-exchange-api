import { Module } from '@nestjs/common';

import { ConfigModule } from 'src/config';

import { ExchangeClientService } from './exchange-client.service';

/**
 * Module to connect to RapidAPI exchange API
 */
@Module({
  imports: [ConfigModule],
  providers: [ExchangeClientService],
  exports: [ExchangeClientService],
})
export class ExchangeClientModule {}
