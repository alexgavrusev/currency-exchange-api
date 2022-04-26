import { Module } from '@nestjs/common';

import { ExchangeClientModule } from '../client';
import { CurrencyValidatorConstraint } from './currency.validator';
import { CurrencyService } from './currency.service';

/**
 * Module to handle currency validation
 */
@Module({
  imports: [ExchangeClientModule],
  providers: [CurrencyValidatorConstraint, CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
