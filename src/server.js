const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getHTML,
    '/style.css':htmlHandler.getStyle,
    '/getData': jsonHandler.getData,
}

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted? 'https':'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    request.query = Object.fromEntries(parsedURL.searchParams);
    if(urlStruct[parsedURL.pathname]) urlStruct[parsedURL.pathname](request, response);
    //have an else for not found
}

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);