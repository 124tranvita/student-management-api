import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

// export class AssignDto {
//   @IsNotEmpty()
//   @ApiProperty({
//     description: 'Student _id.',
//     type: Types.ObjectId,
//     format: 'ObjectId',
//   })
//   studentId: Types.ObjectId;

//   @IsNotEmpty()
//   @ApiProperty({
//     description: 'Class _id.',
//     type: Types.ObjectId,
//     format: 'ObjectId',
//   })
//   classId: Types.ObjectId;
// }

/********************************
 *
 *  STUDENT -> MENTOR ASSIGNMENT
 *
 ********************************/

export class AssignDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Student _id.',
    type: [Types.ObjectId],
    format: 'ObjectId',
  })
  selectedIds: [Types.ObjectId];
}

export class UnassignDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Assinged record _id.',
    type: [Types.ObjectId],
    format: 'ObjectId',
  })
  selectedIds: [Types.ObjectId];
}
