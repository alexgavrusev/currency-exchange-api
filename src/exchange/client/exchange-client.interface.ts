import { HttpException } from '@nestjs/common';
import { TaskEither } from 'fp-ts/TaskEither';

export interface IExchangeClient {
  listQuotes(): TaskEither<HttpException, string[]>;

  convert(
    from: string,
    to: string,
    quantity: number,
  ): TaskEither<HttpException, number>;
}
