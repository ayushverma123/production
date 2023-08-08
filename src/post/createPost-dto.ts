import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ObjectIdSchemaDefinition } from 'mongoose';

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsMongoId()
    @IsString()
    @IsNotEmpty()
    groupId: ObjectId;

    @IsString()
    @IsOptional()
    tag: string;

    @IsMongoId({ each: true }) // Validate each element in the array as a MongoDB ID
    @IsString({ each: true }) // Validate each element as a string
    @IsOptional()
    steps: ObjectId[];

}





