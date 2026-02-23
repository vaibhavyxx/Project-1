const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getHTML,
    '/style.css':htmlHandler.getStyle,
    '/getData': jsonHandler.getData,
}

const parseBody = (request, response, handler) => {
    const parsedBody = [];
    request.on ('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        //console.log(chunk);
        parsedBody.push(chunk);
    });

    request.on('end', ()=> {
        const bodyString = Buffer.concat(parsedBody).toString();
        console.log('body: ' +bodyString);
        const type = request.headers['content-type'];
        if(type === 'application/x-www-form-urlencoded'){
            request.body = query.parse(bodyString);
        }else if(type === 'application/json'){
            //onsole.log("body string: "+ bodyString);
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
    /*else if(parsedURL.pathname === '/addAllData'){
        parseBody(request, response, jsonHandler.addData);
    }*/
};

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted? 'https':'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    request.query = Object.fromEntries(parsedURL.searchParams);
    if(urlStruct[parsedURL.pathname]) urlStruct[parsedURL.pathname](request, response);
    //have an else for not found
    if(request.method === 'POST'){
        handlePost(request, response, parsedURL);
    }
}

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);