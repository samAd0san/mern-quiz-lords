// Implementing routes in nodeJS server
const http = require('http');

const server = http.createServer(handler);

// Through the handler function we are adding paths/url in the nodeJS server
function handler(req,res) {
    // req.url in Node.js represents the URL path of the incoming HTTP request.
    switch(req.url) {
        // This is home page if no url/path is given
        case '/':
        case '/home':
            res.write('Welcome to Home Page');
            res.end();
            break;

        default: // If the url requested does not exist 
            res.write('Not Found');
            res.end();
            break;
    }
}

const port = 3000;

server.listen(port,()=>{
    console.log(`The port is running on http://localhost:${port}`);
})