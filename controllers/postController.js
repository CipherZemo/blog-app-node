const Post = require("../models/Post");
const Comment = require("../models/Comment");
const fs = require("fs");
const path = require("path");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({
      author: req.user.id,
      title,
      content,
      image: req.file ? req.file.filename : null 
    });
//line 12 handles file uploads(multer), If a file exists (req.file) then store uploaded file name. if no file then store 'null'



    const savedPost = await newPost.save(); 
    res.status(201).json({output: "Post created",message: savedPost});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
//save()- Inserts the new document in db and returns saved doc including its fileds such as _id,timestamp etc. await pauses functn. until db is finished
};


exports.getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;// takes page no. and limit
    const search = req.query.search || "";// empty search retuns all

    const query = {
      title: { $regex: search, $options: "i" }//Apply regex: search for substring match and option i is to be case-insensitive
    };

    const totalPosts = await Post.countDocuments(query);// counts no of doc. for query

    const posts = await Post.find(query)
      .skip((page - 1) * limit)// skips some specific docs., skips first 20 doc if page=3
      .limit(limit)// limit doc. for page limit
      .sort({ createdAt: -1 })// sorts in desc order by created time
      .populate("author", "name email");//populates author field with name,email of user

    res.status(200).json({
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),// .ceil fn.
      posts
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};
//line 55 - refer post schema, author field only has objId which isnt friendly to render ui so we'll also fetch corresponding name,email and then it will be in output along with objid. google populate


exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)//id given in url/api
      .populate("author", "name email");

    if (!post) return res.status(404).json({ message: "Post not found" });//if id valid but no post(maybe deleted manually from db)

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Post not found",message: err.message });
  }
};
//params are parametres in url before "?" (usually contains id), search route and query parameters

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);// using params is an express standard bcuz while handling post we need that post's id

    if (!post) return res.status(404).json({ message: "Post not found" });

    // check ownership
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }//post.author is objId so hence coverted to string

    // delete old image if new one uploaded
    if (req.file && post.image) {
      const oldImagePath = path.join(__dirname, "..", "uploads", post.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log("Failed to delete old image:", err);
      });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    if (req.file)//req.file only exist if multer used 
      {
      post.image = req.file.filename; // replace old image
    }

    const updated = await post.save();
    res.status(200).json({message: "Post updated",updated});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// params is used bcuz while handling posts we need post id, or related info which isnt available in req but is in params

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author or admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    // delete associated image
    if (post.image) {
      const imagePath = path.join(__dirname, "..", "uploads", post.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.log("Failed to delete image:", err);
      });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });

  } catch (err) {
    res.status(500).json({ Output: "Post not deleted",message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Already liked" });
    }//includes() makes sure no infinite likes in like array(likes is given as array in schema)

    post.likes.push(req.user.id);// push() adds u_id in array. but if you want username in likes array fetch using populate -> Post.find().populate("likes", "name email");

    await post.save();

    res.json({ message: "Post liked" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(id => id.toString() !== req.user.id); // filter() creates new array that dont have req.user.id and toString() must be used bcuz mongo objId must be compared as strings

    await post.save();// updates no. of likes,timestamp etc.

    res.json({ message: "Post unliked" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const thepost = await Post.findById(req.params.id);//fetching the post

    const comment = new Comment({
      post: req.params.id,
      author: req.user.id,
      content: req.body.text
    });

    
    const savedComment = await comment.save();
    thepost.comments.push(comment._id);// saves comment_id in post array
    await thepost.save();


    res.status(201).json(savedComment);
    console.log(savedComment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const post = await Post.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Comment owner OR post owner OR admin can delete
    const isCommentOwner = comment.author.toString() === req.user.id;
    const isPostOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// no module is exported bcuz for every fn., multiple modules has to be thrown. so instead use exports.fnName and extract fn. at routes using {} 