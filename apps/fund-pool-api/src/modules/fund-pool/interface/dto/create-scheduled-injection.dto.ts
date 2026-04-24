import { IsString, IsNotEmpty, IsNumber, IsPositive, IsInt, Min, IsDateString } from 'class-validator';

export class CreateScheduledInjectionDto {
  @IsString()
  @IsNotEmpty({ message: 'poolId is required' })
  poolId: string;

  @IsInt()
  @Min(1, { message: 'injectionCount must be at least 1' })
  injectionCount: number;

  @IsNumber()
  @IsPositive({ message: 'singleInjectionAmount must be a positive number' })
  singleInjectionAmount: number;

  @IsInt()
  @Min(1, { message: 'intervalSeconds must be at least 1' })
  intervalSeconds: number;

  @IsDateString({}, { message: 'firstInjectionAt must be a valid ISO date string' })
  firstInjectionAt: string;
}
