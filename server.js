const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/movieFetchDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const http = require("http");
const url = require("url");
const fs = require("fs");

http
  .createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.pathname;

    let filePath = path.includes("documentation")
      ? "documentation.html"
      : "index.html";

    let logMessage = `URL: ${request.url}\nTimestamp: ${new Date()}\n\n`;
    fs.appendFile("log.txt", logMessage, (err) => {
      if (err) console.log("Error logging request:", err);
    });

    fs.readFile(filePath, (err, data) => {
      if (err) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("File not found.");
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(data);
      }
    });
  })
  .listen(8080);

console.log("Server is listening on port 8080...");
