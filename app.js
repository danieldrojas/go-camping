const { createServer } = require("http");
const { createReadStream } = require("fs");

const sendFile = (res, status, type, filePath) => {
    res.writeHead(status, { "content-type": type });
    createReadStream(filePath).pipe(res);
}

createServer((req, res) => {
    switch (req.url) {
        case "/": return sendFile(res, 200, "text/html", "./index.html")
    }
}).listen(3000);

console.log("Listening port: ", 3000)