import { Module } from '@nestjs/common';

import { ExchangeClientModule } from '../client';
import { CurrencyModule } from '../currency';

import { ConversionService } from './conversion.service';

/**
 * Module to handle conversions between currencies
 */
@Module({
  imports: [ExchangeClientModule, CurrencyModule],
  providers: [ConversionService],
  exports: [ConversionService],
})
export class ConversionModule {}
