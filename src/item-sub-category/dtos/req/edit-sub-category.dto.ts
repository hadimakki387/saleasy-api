import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class EditSubCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}
