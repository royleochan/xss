const fs = require("fs");
const http = require("http");

const db = require("./db.js");

const PORT = 3000;

async function reqListener(req, res) {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    fs.createReadStream("public/index.html").pipe(res);
  } else if (url === "/post" && method == "GET") {
    const posts = await db.getPosts();
    res.writeHead(200, { "content-type": "application/json" });
    res.write(JSON.stringify(posts));
    res.end();
  } else if (url === "/post/create" && method == "POST") {
    var formData = "";

    req.on("data", function (data) {
      formData += data;
    });
    req.on("end", async function () {
      const fields = formData.split("\n");
      const title = fields[0].split("=")[1];
      const content = fields[1].split("=")[1];
      await db.addPost(title, content);
      res.end();
    });
  }
}

const server = http.createServer(reqListener);

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
