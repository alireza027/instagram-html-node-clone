const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    name: {
        type: String,
    },
    family: {
        type: String
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile_pic: {
        type: String,
        default: '/boy-1.svg'
    },
    bio: {
        type: String,
        default: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum suscipit beatae nulla sint. Maxime et quaerat vel vitae error nihil similique culpa cumque veniam? Molestias maxime odio nesciunt ipsum doloremque.",
    },
    created_user: {
        type: Date,
        default: new Date().toLocaleString()
    },
    updated_user: {
        type: Date,
        default: new Date().toLocaleString()
    },
    url_slug: {
        type: String
    },
    posts: {
        type: Array
    },
    story: {
        type: Array
    },
    followers: {
        type: Array
    },
    following: {
        type: Array
    },
    bookmarks: {
        type: Array
    },
    comments: {
        type: Array
    },
    likes: {
        type: Array
    },
    chats: {
        type: Array
    }
})
module.exports = mongoose.model('Users', UsersSchema);