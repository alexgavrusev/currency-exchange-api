import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TE from 'fp-ts/TaskEither';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { unsafeUnwrap as unwrapTE } from 'fp-ts-std/TaskEither';

import { ExchangeClientService } from '../client';

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(private exchangeClient: ExchangeClientService) {}

  // Assuming this is static
  private _supportedCurrencies: string[];

  get supportedCurrencies() {
    return this._supportedCurrencies;
  }

  async onModuleInit() {
    this._supportedCurrencies = await pipe(
      this.exchangeClient.listQuotes(),
      TE.map(A.append('CZK')),
      unwrapTE,
    );
  }

  isValidCurrency = (currency: unknown): boolean => {
    return (
      typeof currency === 'string' &&
      this.supportedCurrencies.includes(currency)
    );
  };
}
