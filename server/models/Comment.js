import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  id: {
    type: String
  },
  author: {
    id: {
      type: String
    },
    profileName: {
      type: String
    },
    username: {
      type: String,
      default: 'N/A'
    },
    profilePicture: {
      type: String
    }
  },
  comment: {
    type: String,
    required: true
  },
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
