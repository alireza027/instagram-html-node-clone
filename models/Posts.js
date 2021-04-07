const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostsSchema = new Schema({
    title: {
        type: String
    },
    caption: {
        type: String,
    },
    tags: {
        type: Array
    },
    userId: {
        type: String
    },
    select: {
        type: String,
    },
    pictures: {
        type: Array
    },
    likes: {
        type: Array
    },
    countOfLikes: {
        type: Number
    },
    usernameUser: {
        type: String
    },
    comments: {
        type: Array
    },
    countOfComments: {
        type: Number
    },
    created_at: {
        type: Date,
        default: new Date().toLocaleString()
    },
    updated_at: {
        type: Date,
        default: new Date().toLocaleString()
    }
});

module.exports = mongoose.model('Posts', PostsSchema);