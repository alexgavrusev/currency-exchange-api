import { Module } from '@nestjs/common';

import { CurrencyModule } from './currency';
import { ConversionModule } from './conversion';

import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';

@Module({
  imports: [ConversionModule, CurrencyModule],
  providers: [ExchangeService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
