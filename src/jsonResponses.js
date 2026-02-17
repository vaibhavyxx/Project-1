const fs = require('fs');   //file system
const { jsonData } = require("./htmlResponses")

const respond = (request, response, status, object)=> {
    const content = JSON.stringify(object);
    response.writeHead(status, {                    //writes to the header
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    if(request.method !== 'HEAD' && status !== 204){ //204= No New Content
        response.write(content); //writes to the body
    }
    response.end();     //signals that the data has been sent
}

const getData = (request, response) =>{
    //parseJSON();
    const responseJSON = {jsonData};
    respond(request, response, 200, responseJSON);
}

module.exports = {getData};