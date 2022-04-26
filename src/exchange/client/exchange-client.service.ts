import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { pipe, identity } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as R from 'fp-ts/Refinement';
import * as TE from 'fp-ts/TaskEither';

import { ConfigService } from 'src/config';

import { IExchangeClient } from './exchange-client.interface';

@Injectable()
export class ExchangeClientService implements IExchangeClient {
  private fetcher: AxiosInstance;

  constructor(private configService: ConfigService) {
    const apiUrl = this.configService.get('rapidApiUrl', { infer: true });
    const apiKey = this.configService.get('rapidApiKey', { infer: true });

    this.fetcher = axios.create({
      baseURL: apiUrl,
      headers: {
        'X-RapidAPI-Key': apiKey,
      },
    });
  }

  listQuotes = (): TE.TaskEither<HttpException, string[]> =>
    pipe(
      TE.tryCatch(async () => {
        const { data } = await this.fetcher.get<unknown>('/listquotes');

        return data;
      }, identity),
      // Ensure that the response is actually a non-empty string array
      TE.chain(
        TE.fromPredicate(
          pipe(
            Array.isArray,
            R.compose(A.isNonEmpty),
            R.compose((arr): arr is NEA.NonEmptyArray<string> =>
              arr.every((quote) => typeof quote === 'string'),
            ),
          ),
          identity,
        ),
      ),
      // Only obvious reason why any of the above checks may fail`
      TE.mapLeft(() => new ServiceUnavailableException()),
    );

  convert = (
    from: string,
    to: string,
    quantity: number,
  ): TE.TaskEither<HttpException, number> =>
    TE.tryCatch(
      async () => {
        const { data } = await this.fetcher.get<number>('/exchange', {
          params: {
            from,
            to,
          },
        });

        return data * quantity;
      },
      (error) => {
        if (axios.isAxiosError(error) && !error.response) {
          return new ServiceUnavailableException();
        }

        return new InternalServerErrorException();
      },
    );
}
