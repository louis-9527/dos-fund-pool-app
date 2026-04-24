import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class AdjustBalanceDto {
  @IsString()
  @IsNotEmpty({ message: 'poolId is required' })
  poolId: string;

  @IsNumber()
  @IsPositive({ message: 'amount must be a positive number' })
  amount: number;

  @IsString()
  @IsOptional()
  operatorId?: string;

  @IsString()
  @IsOptional()
  remark?: string;
}
