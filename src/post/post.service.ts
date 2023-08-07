import { StepInterfaceResponse } from './interface/StepResponse.interface';
import { CreateStepDto } from './createStep-dto';
import { Step } from 'src/entities/step.schema';
import { Tag } from 'src/entities/tag.schema';
import { GetQueryDto } from './query-dto';
import { Group } from 'src/entities/group.schema';
import { PostInterfaceResponse } from './interface/PostResponse.interface';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Posts } from 'src/entities/post.schema';
import { CreatePostDto } from './createPost-dto';
import { title } from 'process';


@Injectable()
export class PostsService {
    constructor(@InjectModel('Posts') private readonly postsModel: Model<Posts>,
        @InjectModel('Group') private readonly groupModel: Model<Group>,
        @InjectModel('Tag') private readonly tagModel: Model<Tag>) { }
        @InjectModel('Step') private readonly stepModel: Model<Step>

    async createPost(createPostDto: CreatePostDto): Promise<PostInterfaceResponse> {
        const { groupId, ...postData } = createPostDto;
        const group = await this.groupModel.findById(groupId);
        const Tag = await this.tagModel.findOne({title});
        if (!group) {
            throw new NotFoundException('Invalid groupId');
        }
       /*if(!Tag)
        {
            throw new NotFoundException('Title does not exist')
        }   */
        const newPostData = {
            ...postData,
            //groupId: group._id,
            group:group.title,
            //tag: tag.title,

            // category: category.title,
        };

        const existingPost = await this.postsModel.findOne({

            title: createPostDto.title

        });


        if (existingPost) {
            // Customer with the same email or mobile number already exists, throw an error
            throw new NotFoundException('Post already exists');
        }

        // No existing customer found, create a new one
        const createdPost = await this.postsModel.create(newPostData);
        await createdPost.save();
        return {
            code: 200,
            message: 'Post created successfully',
            status: 'success',
            data: createdPost,
        };
    }


    async getAllPosts(): Promise<any> {
        return this.postsModel.find();
    }


    async getFilteredPosts(queryDto: GetQueryDto): Promise<any> {
        const { search, limit, pageNumber, pageSize, sortField, sortOrder } = queryDto;
        const query = this.postsModel.find();


        if (search) {
            query.or([
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tag: { $regex: search, $options: 'i' } },
                { group: { $regex: search, $options: 'i' } },

            ]);
        }

        if (pageNumber && pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            query.skip(skip).limit(pageSize);
        }

        if (sortField && sortOrder) {
            const sortOptions: [string, SortOrder][] = [[sortField, sortOrder as SortOrder]];
            query.sort(sortOptions);
        }

        const data = await query.exec();
        const totalRecords = await this.postsModel.find(query.getFilter()).countDocuments();

        return { data, totalRecords };
    }



    async getPostById(id: string): Promise<PostInterfaceResponse> {
        try {
            const FoundPost = await this.postsModel.findById(id).exec();

            if (!FoundPost) {
                throw new NotFoundException('Unable to find post');
            }
            else {

                return {
                    code: 200,
                    message: 'Post found successfully',
                    status: 'success',
                    data: FoundPost,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Post ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }


    async updatePost(id: string, updatePostDto: CreatePostDto): Promise<PostInterfaceResponse> {
        try {
            const updatedPost = await this.postsModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();

            if (!updatedPost) {
                throw new NotFoundException('Unable to update Post');
            }
            else {

                return {
                    code: 200,
                    message: 'Post updated successfully',
                    status: 'success',
                    data: updatedPost,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Post ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }



    async deletePost(id: string): Promise<PostInterfaceResponse
    > {
        try {
            const deletedPost = await this.postsModel.findByIdAndDelete(id).exec();

            if (!deletedPost) {
                throw new NotFoundException('Unable to delete Post');
            }
            else {

                return {
                    code: 200,
                    message: 'Post deleted successfully',
                    status: 'success',
                    data: deletedPost,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Post ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }


//==========================================Step Api===================================================

   

    async createStep(createStepDto: CreateStepDto): Promise<StepInterfaceResponse | null> {
        // Check if a customer with the same email or mobile number already exists
        const existingStep = await this.stepModel.findOne({

            title: createStepDto.title

        });

        if (existingStep) {
            // Customer with the same email or mobile number already exists, throw an error
            throw new NotFoundException('Step already exists');
        }

        // No existing customer found, create a new one
        const createdStep = await this.stepModel.create(createStepDto);
        await createdStep.save();
        return {
            code: 200,
            message: 'Step created successfully',
            status: 'success',
            data: createdStep,
        }
    }

    async getAllSteps(): Promise<any> {
        return this.stepModel.find();
    }



    async getStepById(id: string): Promise<StepInterfaceResponse> {
        try {
            const FoundStep = await this.stepModel.findById(id).exec();

            if (!FoundStep) {
                throw new NotFoundException('Unable to find step');
            }
            else {

                return {
                    code: 200,
                    message: 'Step found successfully',
                    status: 'success',
                    data: FoundStep,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Step ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }


    async updateStep(id: string, updateStepDto: CreateStepDto): Promise<StepInterfaceResponse> {
        try {
            const updatedStep = await this.stepModel.findByIdAndUpdate(id, updateStepDto, { new: true }).exec();

            if (!updatedStep) {
                throw new NotFoundException('Unable to update Step');
            }
            else {

                return {
                    code: 200,
                    message: 'Step updated successfully',
                    status: 'success',
                    data: updatedStep,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Step ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }



    async deleteStep(id: string): Promise<StepInterfaceResponse
    > {
        try {
            const deletedStep = await this.stepModel.findByIdAndDelete(id).exec();

            if (!deletedStep) {
                throw new NotFoundException('Unable to delete Step');
            }
            else {

                return {
                    code: 200,
                    message: 'Step deleted successfully',
                    status: 'success',
                    data: deletedStep,
                };
            }
        }
        catch (error) {
            // Handle the specific CastError here
            if (error) {
                throw new NotFoundException('Invalid Step ID');
            }

            // Handle other potential errors or rethrow them
            throw error;
        }
    }

}




