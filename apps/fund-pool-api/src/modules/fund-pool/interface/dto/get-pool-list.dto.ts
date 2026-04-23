import { IsString, IsNotEmpty } from 'class-validator';

export class GetPoolListDto {
  @IsString()
  @IsNotEmpty({ message: 'gameId is required' })
  gameId: string;
}
