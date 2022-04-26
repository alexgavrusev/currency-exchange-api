/**
 * NOTE(@ApiBody): Can't reflect generics (items of array), thus annotation required
 *
 * NOTE(@HttpCode): Nests default for `@Post` is 201, doesn't align semantically
 */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseArrayPipe,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { ApiBody, ApiProduces, ApiTags } from '@nestjs/swagger';

import { ConvertDto, MinMaxDto, ResultsQueryDto } from './dto';
import { ExchangeService } from './exchange.service';

@ApiTags('Exchange')
@Controller('/')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get('results')
  getResults(@Query() query: ResultsQueryDto): Promise<string[]> {
    return this.exchangeService.getResults(query.currency);
  }

  /**
   * Returns the textual file representation of the `/results`
   */
  @Get('results/export')
  @ApiProduces('text/plain')
  getResultsExport(@Query() query: ResultsQueryDto): Promise<StreamableFile> {
    return this.exchangeService.getResultsExport(query.currency);
  }

  @ApiBody({
    type: [ConvertDto],
  })
  @HttpCode(200)
  @Post('convert')
  convert(
    @Body(new ParseArrayPipe({ items: ConvertDto })) items: any,
  ): Promise<string[]> {
    return this.exchangeService.convert(items);
  }

  /**
   * Returns the currencies with the lowest and highest exhange rates to CZK
   */
  @Get('minmax')
  getMinMax(): Promise<MinMaxDto> {
    return this.exchangeService.minmax();
  }
}
