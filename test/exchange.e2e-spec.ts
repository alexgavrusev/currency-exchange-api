import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';
import { setupApp } from 'src/setup';

import { ExchangeClientService } from 'src/exchange/client';
import { ExchangeClientServiceMock } from 'src/exchange/client/mocks';

import {
  expectedAllPairLength,
  getConversionTargets,
  getResultLineRegex,
  parseResponseAsString,
} from './utils';

describe('ExchangeController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ExchangeClientService)
      .useClass(ExchangeClientServiceMock)
      .compile();

    app = moduleRef.createNestApplication();

    await setupApp(app).init();
  });

  describe('results', () => {
    const assertResultLines = (to: string, resultLines: string[]) => {
      const resultLineRegex = getResultLineRegex({ to });

      resultLines.forEach((resultLine) => {
        expect(resultLine).toEqual(expect.stringMatching(resultLineRegex));
      });
    };

    describe('/results (GET)', () => {
      it('returns results for a valid currency', async () => {
        const res = await request(app.getHttpServer())
          .get('/results')
          .query({ currency: 'czk' })
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8');

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toEqual(expectedAllPairLength);
        assertResultLines('CZK', res.body);
      });

      it('uses CZK if currency is not provided', async () => {
        const res1 = await request(app.getHttpServer())
          .get('/results')
          .expect(200);
        const res2 = await request(app.getHttpServer())
          .get('/results')
          .query({ currency: 'czk' })
          .expect(200);

        expect(res1.body).toEqual(res2.body);
      });

      it('throws for invalid currency', async () => {
        await request(app.getHttpServer())
          .get('/results')
          .query({ currency: 'junk' })
          .expect(400)
          .expect('Content-Type', 'application/json; charset=utf-8');
      });
    });

    describe('/results/export (GET)', () => {
      it('exports results for a valid currency', async () => {
        const res = await request(app.getHttpServer())
          .get('/results/export')
          .query({ currency: 'czk' })
          .expect('Content-Type', 'text/plain; charset=utf-8')
          .buffer()
          .parse(parseResponseAsString);

        const resultLines = (res.body as string).split(',\n');
        expect(resultLines.length).toEqual(expectedAllPairLength);
        assertResultLines('CZK', resultLines);
      });

      it('uses CZK if currency is not provided', async () => {
        const res1 = await request(app.getHttpServer())
          .get('/results/export')
          .buffer()
          .parse(parseResponseAsString);

        const res2 = await request(app.getHttpServer())
          .get('/results/export')
          .query({ currency: 'czk' })
          .buffer()
          .parse(parseResponseAsString);

        expect(res1.body).toEqual(res2.body);
      });

      it('throws for invalid currency', async () => {
        await request(app.getHttpServer())
          .get('/results/export')
          .query({ currency: 'junk' })
          .expect(400)
          .expect('Content-Type', 'application/json; charset=utf-8');
      });
    });
  });

  describe('minmax', () => {
    describe('/minmax (GET)', () => {
      let res: request.Response;

      beforeEach(async () => {
        res = await request(app.getHttpServer())
          .get('/minmax')
          .expect('Content-Type', 'application/json; charset=utf-8');
      });

      it('returns an object with the correct shape', async () => {
        // HACK: fn to prevent string match regex from breaking on 2nd use
        const minMaxValue = () =>
          expect.objectContaining({
            currency: expect.stringMatching(getConversionTargets('CZK')),
            exchangeRate: expect.any(Number),
          });

        expect(res.body).toEqual({
          min: minMaxValue(),
          max: minMaxValue(),
        });
      });

      it('returns a min value that is smaller then the max value', () => {
        expect(res.body.min.exchangeRate).toBeLessThan(
          res.body.max.exchangeRate,
        );
      });
    });
  });

  describe('convert', () => {
    describe('/convert (POST)', () => {
      it('converts multiple targets', async () => {
        const from1 = 'CZK';
        const to1 = 'USD';
        const quantity1 = 1;

        const from2 = 'USD';
        const to2 = 'EUR';
        const quantity2 = 2;

        const payload = [
          {
            from: {
              currency: from1,
              quantity: quantity1,
            },
            to: to1,
          },
          {
            from: {
              currency: from2,
              quantity: quantity2,
            },
            to: to2,
          },
        ];

        const res = await request(app.getHttpServer())
          .post('/convert')
          .send(payload)
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8');

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toEqual(payload.length);

        expect(res.body).toEqual([
          expect.stringMatching(
            getResultLineRegex({
              to: to1,
              from: from1,
              quantity: quantity1,
              prependLineNumber: false,
            }),
          ),
          expect.stringMatching(
            getResultLineRegex({
              to: to2,
              from: from2,
              quantity: quantity2,
              prependLineNumber: false,
            }),
          ),
        ]);
      });

      it('throws if no conversion targets are provided', async () => {
        await request(app.getHttpServer())
          .post('/convert')
          .send([])
          .expect(400)
          .expect('Content-Type', 'application/json; charset=utf-8');
      });
    });
  });
});
