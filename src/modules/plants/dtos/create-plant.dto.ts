import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlantDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsNumber()
  @IsNotEmpty()
  annualNetGeneration: number;
}
