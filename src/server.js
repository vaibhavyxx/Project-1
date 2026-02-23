const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const query = require('querystring'); 

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getHTML,
    '/style.css':htmlHandler.getStyle,
    '/getData': jsonHandler.getData,
    'notFound':jsonHandler.notFound,
}

const parseBody = (request, response, handler) => {
    const parsedBody = [];
    request.on ('error', () => {
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        parsedBody.push(chunk);
    });

    request.on('end', ()=> {
        const bodyString = Buffer.concat(parsedBody).toString();
        const type = request.headers['content-type'];
        if(type === 'application/x-www-form-urlencoded'){
            request.body = query.parse(bodyString);
        }else if(type === 'application/json'){
            request.body = JSON.parse(bodyString);
        }else{
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.write(JSON.stringify({error:'invalid data format'}));
            return response.end();
        }
        handler(request, response);
    })
}

const handlePost = (request, response, parsedURL) => {
    if(parsedURL.pathname === '/addBook'){
        parseBody(request, response, jsonHandler.addBook);
    }else if(parsedURL.pathname === '/addDetails'){
        parseBody(request, response, jsonHandler.addDetails);
    }
};

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted? 'https':'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    request.query = Object.fromEntries(parsedURL.searchParams);
    if(urlStruct[parsedURL.pathname]) urlStruct[parsedURL.pathname](request, response);

    if(request.method === 'POST'){
        handlePost(request, response, parsedURL);
    }
}

http.createServer(onRequest).listen(port);
