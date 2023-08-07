import mongoose, { Schema, Document } from 'mongoose';
export interface Posts extends Document {

  title: string,
  description: string,
  tag: string,

}

export const PostsSchema: Schema = new Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', },
// tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', },
  tag: { type: String, required: true },
  group: {type: String}

});


export const Posts = mongoose.model<Posts>('Post', PostsSchema);