// ========================== add dependensies ==========================
const express = require("express");
const router = express.Router();
const session = require("express-session");
const cookie = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const faker = require("faker");

// ========================== use multer ==========================
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "public/uploads/");
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
   },
});

var upload = multer({ storage: storage });

// ========================== use ==========================
router.use(cookie());
router.use(
   session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: { expires: 24 * 3600 * 30 },
   })
);

// ========================== / ==========================
router.get("/", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findById(req.session.userid)
         .exec()
         .then((result) => {
            res.redirect(`/user/${result.username}`);
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.redirect("/login-user");
   }
});

// ========================== add model ==========================
const Users = require("../models/Users");
const Posts = require("../models/Posts");

// ========================== user ==========================
router.get("/user/:username", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findById(req.session.userid)
         .exec()
         .then((result) => {
            var userResult = {
               id: result.id,
               name: result.name,
               username: result.username,
               password: result.password,
               bio: result.bio != undefined ? "<div>" + result.bio.toString() + "</div>" : "",
               posts: result.posts,
               postCount: result.posts.length,
               followers: result.followers,
               followersCount: result.followers.length,
               following: result.following,
               followingCount: result.following.length,
               bookmarks: result.bookmarks,
               bookmarkCount: result.bookmarks.length,
               comments: result.comments,
               commentsCount: result.comments.length,
               like: result.likes,
               likeCount: result.likes.length,
               chats: result.chats,
               chatsCount: result.chats.length,
               created_user: result.created_user,
               updated_user: result.updated_user,
               profile_pic: result.profile_pic,
            };
            res.render("users/personal", { result: userResult }, (err, html) => {
               if (err) console.log(err);
               res.end(html);
            });
         });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== login-get ==========================
router.get("/login-user", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findById(req.session.userid)
         .exec()
         .then((result) => {
            res.redirect(`/user/${result.username}`);
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== login-post ==========================
router.post("/login-user", (req, res) => {
   Users.findOne({
      email: req.body.email,
      password: req.body.password,
   })
      .exec()
      .then((result) => {
         req.session.userid = result._id;
         req.session.username = result.username;
         if (result.email == "ali@gmail.com" && result.password == "ali") {
            res.redirect(`/admin/user-page/${result._id}`);
         } else {
            res.redirect(`/user/${result.username}`);
         }
      })
      .catch((err) => {
         res.render("loging_register/login", { error: "true" }, (err, html) => {
            if (err) console.log(err);
            res.end(html);
         });
      });
});

// ========================== register-get ==========================
router.get("/register-user", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findById(req.session.userid)
         .exec()
         .then((result) => {
            res.send(result);
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.render("loging_register/register", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== register-post ==========================
router.post("/register-user", (req, res) => {
   Users.findOne({ email: req.body.email }).then((results) => {
      if (results == null) {
         const newUser = new Users({
            name: req.body.name != undefined ? req.body.name : "",
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
         });
         newUser.save().then((result) => {
            res.redirect("/login-user");
         });
      } else {
         res.render("loging_register/register", { error: "true" }, (err, html) => {
            if (err) console.log(err);
            res.end(html);
         });
      }
   });
});

// ========================== add fake user ==========================
router.post("/add-fake-user", (req, res) => {
   let worlds = [
      "shop",
      "game",
      "play",
      "pc",
      "color",
      "name",
      "family",
      "person",
      "danger",
      "warning",
      "dance",
      "summer",
      "winter",
      "fall",
      "programming",
      "graphic",
   ];
   for (let i = 1; i <= 15; i++) {
      let posts = [];
      for (let j = 1; j < 10; j++) {
         var addPosts = {
            id: new mongoose.Types.ObjectId(),
            title: faker.name.title(),
            caption: faker.lorem.sentence(),
            tags: [
               worlds[Math.round(Math.random() * worlds.length - 1)],
               worlds[Math.round(Math.random() * worlds.length - 1)],
               worlds[Math.round(Math.random() * worlds.length - 1)],
               worlds[Math.round(Math.random() * worlds.length - 1)],
            ],
            select: Math.random() >= 0.5 ? "show" : "hide",
            pictures: [
               {
                  path: "15833338033021.jpg",
                  number: 1,
               },
               {
                  path: "15833338033021.jpg",
                  number: 2,
               },
               {
                  path: "15833338033021.jpg",
                  number: 3,
               },
            ],
            likes: [],
            comments: [],
            created_at: new Date().toLocaleString(),
            updated_at: new Date().toLocaleString(),
         };
         posts.push(addPosts);
      }
      var newUser = new Users({
         name: faker.name.firstName(),
         username: faker.name.lastName() + "-" + faker.name.suffix(),
         email: faker.internet.email(),
         password: faker.internet.password(),
         posts: posts,
      });
      newUser.save().then((result) => {});
   }
   res.send("OK Baby");
});

// ========================== admin-get ==========================
router.get("/admin/user-page/:id", (req, res) => {
   if (req.params.id === req.session.userid) {
      Users.find()
         .exec()
         .then((results) => {
            res.render("admin/user-page", { results: results }, (err, html) => {
               if (err) console.log(err);
               res.end(html);
            });
         })
         .catch((err) => {
            console.log(err);
         });
   }
});

// ========================== edit-profile-get ==========================
router.get("/user/:username/edit-profile", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findOne({
         username: req.params.username,
      })
         .then((result) => {
            var userResult = {
               id: result._id,
               name: result.name,
               family: result.family,
               username: result.username,
               password: result.password,
               bio: result.bio != undefined ? result.bio : "",
               created_user: result.created_user,
               updated_user: result.updated_user,
               profile_pic: result.profile_pic,
            };
            res.render("users/edit-profile", { result: userResult, username: req.session.username }, (err, html) => {
               if (err) console.log(err);
               res.end(html);
            });
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== edit-profile-put ==========================
router.put("/user/:username/edit-profile", upload.single("profile_pic"), (req, res) => {
   Users.updateOne(
      {
         username: req.params.username,
      },
      {
         name: req.body.name,
         family: req.body.family,
         password: req.body.password,
         bio: req.body.bio,
         updated_user: new Date().toLocaleString(),
         profile_pic: req.file != undefined ? path.normalize(req.file.filename) : req.body.ex_profile_pic,
      }
   )
      .then((result) => {
         res.redirect(`/user/${req.params.username}`);
      })
      .catch((err) => {
         console.log(err);
      });
});

// ========================== new-post-get ==========================
router.get("/user/:username/new-post", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findOne({ username: req.params.username })
         .then((result) => {
            res.render("users/new-post", { result: result, username: req.session.username }, (err, html) => {
               if (err) console.log(err);
               res.end(html);
            });
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== new-post-get ==========================
router.get("/user/:username/bookmarks", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findOne({
         username: req.params.username,
      })
         .then((result) => {
            res.render(
               "users/bookmarks",
               { results: result.bookmarks, username: req.session.username },
               (err, html) => {
                  if (err) console.log(err);
                  res.end(html);
               }
            );
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== new-post-put ==========================
router.put("/user/:username/new-post", upload.array("pictures", 10), (req, res) => {
   let pictures = [];
   req.files.forEach((file, index) => {
      pictures.push({ number: index + 1, path: file.filename });
   });

   let id = new mongoose.Types.ObjectId();
   let data = {
      id: id,
      title: req.body.title,
      caption: req.body.caption,
      tags: req.body.tags.split(","),
      select: req.body.select,
      pictures: pictures,
      likes: [],
      countOfLikes: 0,
      comments: [],
      countOfComments: 0,
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
   };

   Users.updateOne(
      {
         username: req.params.username,
      },
      {
         $push: { posts: data },
      }
   )
      .then((result) => {
         res.redirect(`/user/${req.params.username}`);
      })
      .catch((err) => {
         console.log(err);
      });

   // .then((result) => {
   //     res.redirect(`/user/${req.params.username}/new-post`);
   // }).catch(err => {
   //     console.log(err);
   // })
});

// ========================== all-created-posts-get ==========================
router.get("/user/:username/all-post", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findOne({
         username: req.params.username,
      })
         .then((result) => {
            let customPosts = [];
            result.posts.forEach((post) => {
               customPosts.push({
                  id: post.id,
                  username: req.params.username,
                  title: post.title,
                  caption: post.caption,
                  tags: post.tags,
                  saturate: post.select,
                  countOfLikes: post.likes.length,
                  countOfComments: post.comments.length,
                  pictures: post.pictures,
                  created: post.created_at,
                  updated: post.updated_at,
               });
            });
            res.render("users/all-posts", { results: customPosts, username: req.session.username }, (err, html) => {
               if (err) console.log(err);
               res.end(html);
            });
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== show-post-single-get ==========================
router.get("/user/:username/show-post/:postid", (req, res) => {
   if (req.session.userid != undefined) {
      Users.findOne({
         username: req.params.username,
      })
         .then((result) => {
            let showUser = result.posts.find((post) => {
               return post.id == req.params.postid;
            });

            res.render(
               "users/show-post",
               {
                  result: showUser,
                  countOfLikes: showUser.likes.length,
                  countOfComments: showUser.comments.length,
                  username: req.session.username,
               },
               (err, html) => {
                  if (err) console.log(err);
                  res.end(html);
               }
            );
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   }
});

// ========================== delete-post-single-delete ==========================
router.delete("/user/:username/show-post/:postid", (req, res) => {
   Users.findOne({
      username: req.params.username,
   }).then((result) => {
      let posts = result.posts.filter((post) => {
         return post.id != req.params.postid;
      });
      Users.updateOne(
         {
            username: req.params.username,
         },
         {
            posts: posts,
         }
      )
         .then((ans) => {
            res.redirect(`/user/${req.params.username}/all-post`);
         })
         .catch((err) => {
            console.log(err);
         });
   });
});

// ========================== search-get ==========================
router.get("/search", (req, res) => {
   if (req.session.userid != undefined) {
      res.render("search", { username: req.session.username }, (err, html) => {
         if (err) console.log(err);
         res.end(html);
      });
   } else {
      res.render("loging_register/login", { error: "false" }, (err, html) => {
         if (err) console.log(err);
         res.send(html);
      });
   }
});

// ========================== srch-get-ajax ==========================
router.post("/srch", (req, res) => {
   const responses = [];
   Users.find({})
      .select("posts username")
      .then((results) => {
         // each user show all post in the search
         // for (let i = 0; i < results.length - 1; i++) {
         //     if (results[i].username != req.session.username) {
         //         results[i].posts.forEach(result_post => {
         //             responses.push({ pictures: result_post.pictures[0], username: results[i].username, id: result_post.id });
         //         })
         //     }
         // }

         // each user show one post
         for (let i = 0; i < results.length - 1; i++) {
            if (results[i].username != req.session.username) {
               responses.push({
                  id: results[i].posts[0].id,
                  username: results[i].username,
                  pictures: results[i].posts[0].pictures[0],
               });
            }
         }
         let sliceRes = responses.slice(0, parseInt(req.body.count));
         res.send(sliceRes);
      })
      .catch((err) => {
         console.log(err);
      });
});

// ========================== sned-post-get ==========================
// router.get('/search/:username/:userid', (req, res) => {
//     Users.findOne({
//         username: req.params.username,
//     }).then((result) => {
//         var resultSelect;
//         var responses = [];
//         resultSelect = result.posts.find(post => {
//             return post.id == req.params.userid;
//         })
//         Users.find({}).select('posts username profile_pic').then((results) => {
//             for (let i = 0; i < results.length - 1; i++) {
//                 if (results[i].username != req.session.username && results[i].username != req.params.username) {
//                     responses.push({
//                         user_id: results[i]._id,
//                         username: results[i].username,
//                         profile_pic: results[i].profile_pic,
//                         post_id: results[i].posts[0].id,
//                         post_title: results[i].posts[0].title,
//                         caption: results[i].posts[0].caption,
//                         tags: results[i].posts[0].tags,
//                         pictures: results[i].posts[0].pictures,
//                         count_of_likes: results[i].posts[0].countOfLikes,
//                         count_of_comments: results[i].posts[0].countOfComments,
//                         created_at: results[i].posts[0].created_at,
//                     });
//                 }
//             }
//             let otherPost = responses.slice(0, 20);
//             res.render('users/search-post', { resultSelect: resultSelect, username: req.params.username, userid: req.params.userid, profile_pic: result.profile_pic, otherPost: otherPost }, (err, html) => {
//                 if (err) console.log(err);
//                 res.end(html);
//             })
//         });
//     }).catch(err => {
//         console.log(err);
//     })
// })

// ========================== sned-post-post-ajax ==========================
// router.post('/search/:username/:userid', (req, res) => {
//     let responses = [];
//     Users.find({}).select('posts username profile_pic').then((results) => {
//         // each user show all post
//         // for (let i = 0; i < results.length - 1; i++) {
//         //     if (results[i].username != req.session.username && results[i].username != req.params.username) {
//         //         results[i].posts.forEach(result_post => {
//         //             responses.push({
//         //                 user_id: results[i]._id,
//         //                 username: results[i].username,
//         //                 profile_pic_user: results[i].profile_pic,
//         //                 post_id: result_post.id,
//         //                 post_title: result_post.title,
//         //                 caption: result_post.caption,
//         //                 tags: result_post.tags,
//         //                 pictures: result_post.pictures,
//         //                 count_of_likes: result_post.countOfLikes,
//         //                 count_of_comments: result_post.countOfComments,
//         //                 created_at: result_post.result_post,
//         //             });
//         //         })
//         //     }
//         // }

//         // each user show one post

//         for (let i = 0; i < results.length - 1; i++) {
//             if (results[i].username != req.session.username && results[i].username != req.params.username) {
//                 responses.push({
//                     user_id: results[i]._id,
//                     username: results[i].username,
//                     profile_pic: results[i].profile_pic,
//                     post_id: results[i].posts[0].id,
//                     post_title: results[i].posts[0].title,
//                     caption: results[i].posts[0].caption,
//                     tags: results[i].posts[0].tags,
//                     pictures: results[i].posts[0].pictures,
//                     count_of_likes: results[i].posts[0].countOfLikes,
//                     count_of_comments: results[i].posts[0].countOfComments,
//                     created_at: results[i].posts[0].created_at,
//                 });
//             }
//         }
//         let sliceRes = responses.slice(0, parseInt(req.body.count));
//         res.send(sliceRes);
//     }).catch(err => {
//         console.log(err);
//     })
// })

// ========================== search-tag-get ==========================
router.get("/search-tag/:tag", (req, res) => {
   res.render("search-results", { username: req.session.username, tag: req.params.tag }, (err, html) => {
      if (err) console.log(err);
      res.end(html);
   });
});

// ========================== search-tag-post-ajax ==========================
router.post("/search-tag/:tag", (req, res) => {
   let responses = [];
   Users.find()
      .then((results) => {
         for (let i = 0; i < results.length; i++) {
            if (results[i].username != req.session.username) {
               results[i].posts.forEach((post) => {
                  post.tags.forEach((tag) => {
                     if (tag == req.params.tag) {
                        responses.push({
                           username: results[i].username,
                           id: post.id,
                           search_post: post,
                        });
                     }
                  });
               });
            }
         }
         let sliceSend = responses.slice(0, parseInt(req.body.count));
         res.send(sliceSend);
      })
      .catch((err) => {
         console.log(err);
      });
});

// ========================== search-url-get ==========================
router.get("/search-url", (req, res) => {
   let responses = [];
   Users.find({ username: req.query.search })
      .then((results) => {
         results.forEach((result) => {
            responses.push({
               profile_pic: result.profile_pic,
               userid: result._id,
               name: result.name,
               username_search: result.username,
            });
         });
         res.render(
            "search-url",
            { responses: responses, url: req.query.search, username: req.session.username },
            (err, html) => {
               if (err) console.log(err);
               res.end(html);
            }
         );
      })
      .catch((err) => {
         console.log(err);
      });
});

// ========================== user-page-get ==========================
router.get("/user-page/:username", (req, res) => {
   var is_username_session_is_follow = "false";
   if (req.session.userid != undefined) {
      Users.findOne({
         username: req.params.username,
      })
         .then((results) => {
            results.followers.forEach((follow) => {
               if (follow.follower_username == req.session.username) {
                  is_username_session_is_follow = "true";
               }
            });
            res.render(
               "users/user",
               { results: results, username: req.session.username, follow: is_username_session_is_follow },
               (err, html) => {
                  if (err) console.log(err);
                  res.end(html);
               }
            );
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.redirect("/login-user");
   }
});

// ========================== user-page-single-post-get ==========================
router.get("/user-page/:username/:postid", (req, res) => {
   if (req.session.userid != undefined) {
      let postt = {};
      let postf = [];
      Users.findOne({
         username: req.params.username,
      })
         .then((results) => {
            Users.findOne({
               username: req.session.username,
            }).then((usersPosts) => {
               results.posts.filter((result) => {
                  if (result.id == req.params.postid) {
                     var pt_liked = "false";
                     var pt_bookmark = "false";
                     result.likes.forEach((like) => {
                        if (like.Liked_user == req.session.username) {
                           pt_liked = "true";
                        }
                     });

                     usersPosts.bookmarks.forEach((bookmark) => {
                        if (bookmark.bookmarked_post == result.id) {
                           pt_bookmark = "true";
                        }
                     });
                     postt = {
                        post_id: result.id,
                        title: result.title,
                        caption: result.caption,
                        tags: result.tags,
                        pictures: result.pictures,
                        likes: result.likes,
                        count_of_likes: result.likes.length,
                        comments: result.comments,
                        count_of_comments: result.comments.length,
                        created_at: result.created_at,
                        username: results.username,
                        user_id: results._id,
                        profile_pic: results.profile_pic,
                        user_liked: pt_liked,
                        bookmarked: pt_bookmark,
                     };
                  } else {
                     var pf_liked = "false";
                     var pf_bookmark = "false";
                     result.likes.forEach((like) => {
                        if (like.Liked_user == req.session.username) {
                           pf_liked = "true";
                        }
                     });

                     usersPosts.bookmarks.forEach((bookmark) => {
                        if (bookmark.bookmarked_post == result.id) {
                           pf_bookmark = "true";
                        }
                     });

                     postf.push({
                        post_id: result.id,
                        title: result.title,
                        caption: result.caption,
                        tags: result.tags,
                        pictures: result.pictures,
                        likes: result.likes,
                        count_of_likes: result.likes.length,
                        comments: result.comments,
                        count_of_comments: result.comments.length,
                        created_at: result.created_at,
                        username: results.username,
                        user_id: results._id,
                        profile_pic: results.profile_pic,
                        user_liked: pf_liked,
                        bookmarked: pf_bookmark,
                     });
                  }
               });
               res.render(
                  "users/user-show",
                  { postt: postt, postf: postf, username: req.session.username },
                  (err, html) => {
                     if (err) console.log(err);
                     res.end(html);
                  }
               );
            });
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.redirect("/login-user");
   }
});

// ========================== user-page-follow-get ==========================
router.put("/user-page/follow/:username/:followerusername", (req, res) => {
   Users.findOne({
      username: req.params.username,
   }).then((results) => {
      Users.updateOne(
         {
            username: req.params.username,
         },
         {
            $push: {
               followers: {
                  id: new mongoose.Types.ObjectId(),
                  follower_username: req.params.followerusername,
                  created_at: new Date().toLocaleString(),
               },
            },
         }
      ).then(() => {
         Users.updateOne(
            {
               username: req.params.followerusername,
            },
            {
               $push: {
                  following: {
                     id: new mongoose.Types.ObjectId(),
                     following_username: req.params.username,
                     created_at: new Date().toLocaleString(),
                  },
               },
            }
         ).then((result) => {
            res.send("OK Baby");
         });
      });
   });
});

// ========================== user-page-unfollow-get ==========================
router.put("/user-page/unfollow/:username/:followerusername", (req, res) => {
   Users.findOne({
      username: req.params.username,
   })
      .then((result1) => {
         let filter_followers = result1.followers.filter((follow) => {
            return follow.follower_username != req.params.followerusername;
         });
         Users.updateOne(
            {
               username: req.params.username,
            },
            {
               followers: filter_followers,
            }
         ).then(() => {
            Users.findOne({
               username: req.params.followerusername,
            }).then((result2) => {
               let filter_following = result1.followers.filter((follow) => {
                  return follow.following_username != req.params.username;
               });
               Users.updateOne(
                  {
                     username: req.params.followerusername,
                  },
                  {
                     following: filter_following,
                  }
               ).then(() => {
                  res.send("OK Baby");
               });
            });
         });
      })
      .catch((err) => {
         console.log(err);
      });
});

// ========================== like-put ==========================
router.put("/post-like/:username/:postid", (req, res) => {
   Users.findOne({
      username: req.params.username,
   })
      .then((result1) => {
         var result_post = [];
         result1.posts.forEach((post) => {
            if (post.id == req.params.postid) {
               let post_likes = post.likes;
               post_likes.push({
                  id: new mongoose.Types.ObjectId(),
                  Liked_user: req.session.username,
                  created_at: new Date().toLocaleString(),
               });
               post.likes = post_likes;
               result_post.push(post);
            } else {
               result_post.push(post);
            }
         });

         Users.updateOne(
            {
               username: req.params.username,
            },
            {
               posts: result_post,
            },
            (err, raw) => {
               if (err) console.log(err);
               Users.updateOne(
                  {
                     username: req.session.username,
                  },
                  {
                     $push: {
                        likes: {
                           id: new mongoose.Types.ObjectId(),
                           Liked_user: req.params.username,
                           liked_post: req.params.postid,
                           created_at: new Date().toLocaleString(),
                        },
                     },
                  },
                  (err, raw2) => {
                     if (err) console.log(err);
                     res.send("OK Baby");
                  }
               );
            }
         );
      })
      .catch((err) => {
         console.log(err);
      });
});

// ========================== comment-get ==========================
router.get("/:username/:postid/comment", (req, res) => {
   Users.findOne({
      username: req.params.username,
   })
      .then((result) => {
         result.posts.forEach((post) => {
            if (post.id == req.params.postid) {
               res.render(
                  "users/show-comment",
                  {
                     comments: post.comments,
                     postid: post.id,
                     username: result.username,
                     session_username: req.session.username,
                  },
                  (err, html) => {
                     if (err) console.log(err);
                     res.end(html);
                  }
               );
            }
         });
      })
      .catch((err) => {
         console.log(err);
      });
});

// ========================== comment-put ==========================
router.put("/:username/:postid/comment", (req, res) => {
   Users.findOne({
      username: req.params.username,
   }).then((result1) => {
      var posts = [];
      var comments = [];
      result1.posts.forEach((post) => {
         if (post.id == req.params.postid) {
            if (post.comments.length > 0) {
               post.comments.forEach((comment) => {
                  comments.push(comment);
               });
               comments.push({
                  id: new mongoose.Types.ObjectId(),
                  comment_user: req.body.username,
                  comment_message: req.body.message,
                  created_at: new Date().toLocaleString(),
               });

               post.comments = comments;
               posts.push(post);
            } else {
               comments.push({
                  id: new mongoose.Types.ObjectId(),
                  comment_user: req.body.username,
                  comment_message: req.body.message,
                  created_at: new Date().toLocaleString(),
               });

               post.comments = comments;
               posts.push(post);
            }
         } else {
            posts.push(post);
         }
      });
      Users.updateOne(
         {
            username: req.params.username,
         },
         {
            posts: posts,
         },
         (err, raw) => {
            if (err) console.log(err);
            Users.updateOne(
               {
                  username: req.session.username,
               },
               {
                  $push: {
                     comments: {
                        id: new mongoose.Types.ObjectId(),
                        comment_user: req.params.username,
                        comment_post: req.params.postid,
                        created_at: new Date().toLocaleString(),
                     },
                  },
               },
               (err, raw1) => {
                  if (err) console.log(err);
                  res.send("OK Baby");
               }
            );
         }
      );
   });
});

// ========================== dislike-put ==========================
router.put("/post-dislike/:username/:postid", (req, res) => {
   Users.findOne({
      username: req.params.username,
   }).then((result1) => {
      var result_post = [];
      var result_like = [];
      result1.posts.forEach((post) => {
         if (post.id == req.params.postid) {
            post.likes.forEach((like) => {
               if (like.Liked_user != req.session.username) {
                  result_like.push(like);
               }
            });
            post.likes = result_like;
            result_post.push(post);
         } else {
            result_post.push(post);
         }
      });
      Users.updateOne(
         {
            username: req.params.username,
         },
         {
            posts: result_post,
         },
         (err, raw) => {
            if (err) console.log(err);
            Users.findOne({
               username: req.session.username,
            }).then((result2) => {
               var likes = [];
               result2.likes.forEach((like) => {
                  if (like.Liked_user != req.params.username) {
                     likes.push(like);
                  }
               });
               Users.updateOne(
                  {
                     username: req.session.username,
                  },
                  {
                     likes: likes,
                  },
                  (err, raw2) => {
                     if (err) console.log(err);
                     res.send("OK Baby");
                  }
               );
            });
         }
      );
   });
});

// ========================== bookmark-put ==========================
router.put("/post-add-bookmark/:username/:postid", (req, res) => {
   Users.updateOne(
      {
         username: req.session.username,
      },
      {
         $push: {
            bookmarks: {
               id: new mongoose.Types.ObjectId(),
               bookmarked_user: req.params.username,
               bookmarked_post: req.params.postid,
               created_at: new Date().toLocaleString(),
            },
         },
      },
      (err, raw) => {
         if (err) console.log(err);
         res.send("OK Baby");
      }
   );
});

// ========================== bookmark-put ==========================
router.put("/post-remove-bookmark/:username/:postid", (req, res) => {
   let bookmarks_user = [];
   Users.findOne({
      username: req.session.username,
   }).then((result1) => {
      result1.bookmarks.forEach((bookmark) => {
         if (bookmark.bookmarked_post != req.params.postid) {
            bookmarks_user.push(bookmark);
         }
      });

      Users.updateOne(
         {
            username: req.session.username,
         },
         {
            bookmarks: bookmarks_user,
         },
         (err, raw) => {
            if (err) console.log(err);
            res.send("OK Baby");
         }
      );
   });
});

// ========================== remove session ==========================
router.get("/activity/:username", (req, res) => {
   if (req.session.username != undefined) {
      Users.findOne({
         username: req.params.username,
      })
         .then((result) => {
            res.render(
               "users/activity",
               {
                  username: req.session.username,
                  likes: result.likes.reverse().slice(0, 7),
                  comments: result.comments.reverse().slice(0, 7),
                  bookmarks: result.bookmarks.reverse().slice(0, 7),
               },
               (err, html) => {
                  if (err) console.log(err);
                  res.end(html);
               }
            );
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.redirect("/login-user");
   }
});

// ========================== اhome-get ==========================
router.get("/user/:username/home", (req, res) => {
   if (req.session.username != undefined) {
      Users.findOne({
         username: req.params.username,
      })
         .select("following")
         .then((results) => {
            var ress = [];
            results.following.forEach((result1) => {
               ress.push(result1.following_username);
            });
            Users.find({
               username: {
                  $in: ress,
               },
            }).then((result1) => {
               var posts = [];
               result1.forEach((foll) => {
                  foll.posts.forEach((post) => {
                     var likes = "false";
                     post.likes.forEach((like) => {
                        if (like.Liked_user == req.session.username) {
                           likes = "true";
                        }
                     });
                     posts.push({
                        user_id: foll._id,
                        username: foll.username,
                        profile_pic: foll.profile_pic,
                        id: post.id,
                        title: post.title,
                        caption: post.caption,
                        tags: post.tags,
                        count_of_likes: post.likes.length,
                        count_of_comments: post.comments.length,
                        pic: post.pictures,
                        user_liked: likes,
                        created_at: post.created_at,
                     });
                  });
               });
               res.render("users/home", { results: posts, username: req.session.username }, (err, html) => {
                  if (err) console.log(err);
                  res.end(html);
               });
            });
         })
         .catch((err) => {
            console.log(err);
         });
   } else {
      res.redirect("/login-user");
   }
});

// ========================== remove session ==========================
router.get("/session-destroy", (req, res) => {
   req.session.destroy((err) => {
      if (err) console.log(err);
      res.redirect("/login-user");
   });
});

module.exports = router;
