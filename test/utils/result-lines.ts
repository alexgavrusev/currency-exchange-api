import { ExchangeClientServiceMock } from 'src/exchange/client/mocks';

export const supportedCurrencies = ExchangeClientServiceMock.quotes;
export const expectedAllPairLength = supportedCurrencies.length - 1;

export const getConversionTargets = (to: string) => {
  const currenciesFrom = supportedCurrencies.filter((c) => c !== to);
  return new RegExp(currenciesFrom.join('|'), 'g');
};

export const getResultLineRegex = ({
  to,
  from,
  quantity = 1,
  prependLineNumber = true,
}: {
  to: string;
  from?: string;
  quantity?: number;
  prependLineNumber?: boolean;
}) => {
  const quantityRegex = new RegExp(`${quantity} `, 'g');

  const fromRegex = from
    ? new RegExp(from, 'g')
    : new RegExp('(' + getConversionTargets(to).source + ')', 'g');

  const lineNumberRegex = prependLineNumber ? /^\d+\. / : new RegExp('', 'g');

  return new RegExp(
    lineNumberRegex.source +
      quantityRegex.source +
      fromRegex.source +
      / - /.source +
      to +
      / -> \d+(\.\d+)?$/.source,
    'g',
  );
};
