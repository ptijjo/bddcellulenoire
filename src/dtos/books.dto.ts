/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class AddBookDto {
  @IsString()
  @IsNotEmpty()
  public title: string;  
}


export class UpdatebookDto {
  @IsString()
  @IsNotEmpty()
  public title: string;
}
