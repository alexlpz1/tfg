// controllers/commentController.js
import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  const { text } = req.body;
  const comment = new Comment({
    user: req.user._id,
    product: req.params.id,
    text
  });
  const created = await comment.save();
  res.status(201).json(created);
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ product: req.params.id }).populate('user', 'name');
  res.json(comments);
};
