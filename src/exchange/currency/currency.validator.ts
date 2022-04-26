import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { CurrencyService } from './currency.service';

@Injectable()
@ValidatorConstraint({ name: 'currency' })
export class CurrencyValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(private currencyService: CurrencyService) {}

  validate(value: any): boolean {
    return this.currencyService.isValidCurrency(value);
  }

  defaultMessage(): string {
    return '$property must be a valid currency';
  }
}
