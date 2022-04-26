import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, Validate } from 'class-validator';

import { CurrencyValidatorConstraint } from './currency.validator';

const UpperCase = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  );

export const Currency = () =>
  applyDecorators(
    UpperCase(),
    IsString(),
    Validate(CurrencyValidatorConstraint),
  );
