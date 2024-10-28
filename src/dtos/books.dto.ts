/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class AddBookDto {
  @IsString()
  @IsNotEmpty()
  public title: string;
  
  @IsString()
  @IsNotEmpty()
  public url: string;
  
  @IsDate()
  @IsNotEmpty()
  public uploadedAt?: Date;
}


export class UpdatebookDto {
  @IsString()
  @IsNotEmpty()
  public title: string;
}
