import { Injectable } from '@nestjs/common';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/Array';
import * as NEA from 'fp-ts/NonEmptyArray';
import { flow, pipe } from 'fp-ts/function';
import { unsafeUnwrap as unwrapE } from 'fp-ts-std/Either';

import { ExchangeClientService } from '../client';
import { CurrencyService } from '../currency';

import { ConversionResult } from './conversion-result';
import { ConversionRequest } from './conversion-request';

@Injectable()
export class ConversionService {
  constructor(
    private exchangeClientService: ExchangeClientService,
    private currencyService: CurrencyService,
  ) {}

  private convertOne = ({
    from,
    to,
    quantity,
  }: ConversionRequest): TE.TaskEither<Error, ConversionResult> =>
    pipe(
      this.exchangeClientService.convert(from, to, quantity),
      TE.chain((result) =>
        result === 0
          ? TE.left(new Error(`Invalid result for ${from} -> ${to}`))
          : TE.of(result),
      ),
      TE.map((result) => new ConversionResult(from, to, quantity, result)),
    );

  /**
   * Convert many, failing only in case all conversions fail
   * If only some fail, omit them from the result
   */
  convertMany = (
    reqs: ConversionRequest[],
  ): TE.TaskEither<Error, NEA.NonEmptyArray<ConversionResult>> =>
    pipe(
      reqs,
      T.traverseArray(this.convertOne),
      T.map(flow(A.filter(E.isRight), A.map(unwrapE))),
      TE.fromTask,
      TE.filterOrElse(A.isNonEmpty, () => new Error(`Unable to convert`)),
    );

  convertAll = (
    from: string,
  ): TE.TaskEither<Error, NEA.NonEmptyArray<ConversionResult>> =>
    pipe(
      this.currencyService.supportedCurrencies,
      A.filter((c) => c !== from),
      A.map((to) => new ConversionRequest(from, to, 1)),
      this.convertMany,
    );
}
