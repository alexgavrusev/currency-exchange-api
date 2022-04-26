import { IsBoolean, IsInt, IsString, IsUrl, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class Config {
  @IsBoolean()
  devMode: boolean;

  @IsUrl()
  rapidApiUrl: string;

  @IsString()
  rapidApiKey: string;

  @IsInt()
  port: number;
}

export const loadConfig = async (): Promise<Config> => {
  const config = plainToClass(
    Config,
    {
      devMode: process.env.NODE_ENV === 'development',
      rapidApiUrl: process.env.RAPID_API_URL,
      rapidApiKey: process.env.RAPID_API_KEY,
      port: process.env.PORT,
    },
    { enableImplicitConversion: true },
  );

  const errors = await validate(config);

  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.toString()).join(', '));
  }

  return config;
};
