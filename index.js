const fs = require("fs");
const http = require("http");

const db = require("./db.js");

const sanitizeHtml = require("sanitize-html");

const PORT = 3000;

async function reqListener(req, res) {
  const url = req.url;
  const method = req.method;
  //Regex to check for search post
  var expression = /\/post\/search\/\?search=(.+)/gi;
  var regex = new RegExp(expression);
  var search = regex.exec(url);

  if (url === "/post" && method == "GET") {
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
      const fields = formData.split("&");
      const title = fields[0].split("=")[1];
      let index = fields[1].indexOf("=");
      const content = fields[1].slice(index + 1, fields[1].length);

      await db.addPost(title, content);
      res.end();
    });
  } else if (search) {
    const title = decodeURI(search[1]);
    const result = await db.countPost(title);

    if (result !== 0) {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(title, "utf-8");
      res.end();
    } else {
      res.writeHead(404, { "content-type": "text/html" });
      res.write(title, "utf-8");
      res.end();
    }
    /* Safe version
    const cleanTitle = sanitizeHtml(title, {
      allowedTags: ["img"],
      allowedAttributes: {
        img: ["src"],
      },
    });
    
    if (result !== 0) {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(cleanTitle, "utf-8");
      res.end();
    } else {
      res.writeHead(404, { "content-type": "text/html" });
      res.write(cleanTitle, "utf-8");
      res.end();
    }
    */
  } else {
    res.writeHead(200, { "content-type": "text/html" });
    fs.createReadStream("public/index.html").pipe(res);
  }
}

const server = http.createServer(reqListener);

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);
