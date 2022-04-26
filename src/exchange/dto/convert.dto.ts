import { Type } from 'class-transformer';
import { IsNumber, Min, ValidateNested } from 'class-validator';
import { Currency } from '../currency';

class ConvertFrom {
  /**
   * Currency to convert from
   * @example 'CZK'
   */
  @Currency()
  currency: string;

  /**
   * Amount of currency to convert from
   * @example 50
   */
  @IsNumber()
  @Min(0.0001)
  quantity: number;
}

export class ConvertDto {
  @ValidateNested()
  @Type(() => ConvertFrom)
  from: ConvertFrom;

  /**
   * Currency to convert to
   * @example 'USD'
   */
  @Currency()
  to: string;
}
