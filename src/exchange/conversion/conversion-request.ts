import { ConvertDto } from '../dto';

export class ConversionRequest {
  constructor(
    public from: string,
    public to: string,
    public quantity: number,
  ) {}

  static fromDto = (dto: ConvertDto) => {
    return new this(dto.from.currency, dto.to, dto.from.quantity);
  };
}
