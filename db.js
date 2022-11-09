const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function init() {
  await Post.sync({ force: true });
}

init();

async function addPost(title, content) {
  return await Post.create({
    title,
    content,
  });
}

async function getPosts() {
  return await Post.findAll();
}

async function countPost(title) {
  return await Post.count({ where: { title: title } });
}

module.exports = { addPost, getPosts, countPost };
