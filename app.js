const { createServer } = require("http");




const server = createServer((req, res) => {
    console.log("request was made: ", req.url)
    res.writeHead(200, { "content-type": "text/html" });
    res.write(req.url)
    return res.end();
});

server.listen(8080)