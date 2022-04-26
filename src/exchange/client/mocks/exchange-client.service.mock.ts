import { HttpException, Injectable } from '@nestjs/common';
import * as TE from 'fp-ts/TaskEither';

import { IExchangeClient } from '../exchange-client.interface';

@Injectable()
export class ExchangeClientServiceMock implements IExchangeClient {
  static quotes = ['CZK', 'USD', 'EUR'];

  listQuotes(): TE.TaskEither<HttpException, string[]> {
    return TE.of(ExchangeClientServiceMock.quotes);
  }

  convert(
    from: string,
    to: string,
    quantity: number,
  ): TE.TaskEither<HttpException, number> {
    const quotes = ExchangeClientServiceMock.quotes;

    // Convert the combination of arguments to a single cons number
    return TE.of(
      1000 * (quotes.indexOf(from) + 1) +
        100 * (quotes.indexOf(to) + 1) +
        10 * quantity,
    );
  }
}
