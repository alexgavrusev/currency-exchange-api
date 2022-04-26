import { Currency } from '../currency';

export class ResultsQueryDto {
  /**
   * Currency from which should conversion results be returned
   */
  @Currency()
  currency?: string = 'CZK';
}
