import { pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as OR from 'fp-ts/Ord';

export class ConversionResult {
  constructor(
    public from: string,
    public to: string,
    public quantity: number,
    public result: number,
  ) {}

  toString() {
    return `${this.quantity} ${this.from} - ${this.to} -> ${this.result}`;
  }

  /**
   * if 1 X is y Y,
   * then 1 Y is 1/y X
   *
   * e.g if 1 EUR = 25 CZK, then 1 CZK = 1/25 EUR
   */
  flip(): ConversionResult {
    return new ConversionResult(
      this.to,
      this.from,
      1 / this.quantity,
      1 / this.result,
    );
  }

  static ord: OR.Ord<ConversionResult> = pipe(
    N.Ord,
    OR.reverse,
    OR.contramap((cr: ConversionResult) => cr.result),
  );
}
