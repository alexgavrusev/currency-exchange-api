import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as O from 'fp-ts/Option';
import { pipe, flow } from 'fp-ts/function';
import { unsafeUnwrap as unwrapTE } from 'fp-ts-std/TaskEither';
import { join as joinA } from 'fp-ts-std/Array';

import { ConvertDto, MinMaxDto } from './dto';
import {
  ConversionRequest,
  ConversionService,
  ConversionResult,
} from './conversion';

@Injectable()
export class ExchangeService {
  constructor(private conversionService: ConversionService) {}

  private getAllConversionResults = (currency: string) =>
    pipe(
      currency,
      this.conversionService.convertAll,
      TE.map(
        flow(
          NEA.map((cr) => cr.flip()),
          NEA.sort(ConversionResult.ord),
        ),
      ),
    );

  getResults = (currency: string): Promise<NEA.NonEmptyArray<string>> =>
    pipe(
      currency,
      this.getAllConversionResults,
      TE.map(NEA.mapWithIndex((i, cr) => `${i + 1}. ${cr.toString()}`)),
      unwrapTE,
    );

  getResultsExport = (currency: string): Promise<StreamableFile> =>
    pipe(
      () => this.getResults(currency),
      T.map(
        flow(
          joinA(',\n'),
          (str) => Buffer.from(str, 'utf-8'),
          (buf) =>
            new StreamableFile(buf, {
              type: 'text/plain; charset=utf-8',
              disposition: 'attachment; filename="result.txt"',
            }),
        ),
      ),
      (t) => t(),
    );

  convert = (items: ConvertDto[]): Promise<string[]> =>
    pipe(
      items,
      NEA.fromArray,
      O.map(NEA.map(ConversionRequest.fromDto)),
      TE.fromOption(
        () => new BadRequestException('Did not provide currencies to convert'),
      ),
      TE.chain(this.conversionService.convertMany),
      TE.chain(flow(NEA.map(String), TE.of)),
      unwrapTE,
    );

  minmax = (): Promise<MinMaxDto> =>
    pipe(
      TE.Do,
      TE.bind('results', () => this.getAllConversionResults('CZK')),
      TE.bind('first', ({ results }) => pipe(NEA.head(results), TE.of)),
      TE.bind('last', ({ results }) => pipe(NEA.last(results), TE.of)),
      TE.chainW(({ first, last }) => {
        return TE.of<never, MinMaxDto>({
          min: {
            currency: last.from,
            exchangeRate: last.result,
          },
          max: {
            currency: first.from,
            exchangeRate: first.result,
          },
        });
      }),
      unwrapTE,
    );
}
