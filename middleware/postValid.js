exports.validatePost= (req, res, next)=>{
  const { title, content } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }// trim() removes unwanted whitespaces

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content is required" });
  }

  next();
}
// no module is exported so add {} to the variable which needs the function