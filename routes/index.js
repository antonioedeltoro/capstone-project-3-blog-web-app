const express = require("express");
const router = express.Router();

let posts = []; // In-memory storage for posts
const POSTS_PER_PAGE = 5;

// Utility function to format text content
function formatContent(text) {
  const paragraphs = text.split(/\r?\n\r?\n/);
  return paragraphs
    .map((p) => `<p>${p.replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}

// GET Home Route - Display all posts and the creation form
router.get("/", (req, res) => {
  const currentPage = parseInt(req.query.page) || 1;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  res.render("index", {
    posts,
    formatContent,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
  });
});

// POST New Post
router.post("/posts", (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    const newPost = {
      id: Date.now(), // Unique ID based on timestamp
      title,
      content,
    };
    posts.push(newPost);
  }
  res.redirect("/");
});

// GET Edit Post Form
router.get("/posts/:id/edit", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (post) {
    res.render("edit", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// POST Update Post
router.post("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  const post = posts.find((p) => p.id === postId);
  if (post) {
    post.title = title;
    post.content = content;
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

// POST Delete Post
router.post("/posts/:id/delete", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((p) => p.id !== postId);
  res.redirect("/");
});

module.exports = router;
