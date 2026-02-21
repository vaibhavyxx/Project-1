const fs = require('fs');   //file system
const { books } = require("./htmlResponses");
const { request } = require('http');

const respond = (request, response, status, object)=> {
    const content = JSON.stringify(object);
    response.writeHead(status, {                    
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    if(request.method !== 'HEAD' && status !== 204){ 
        response.write(content);
    }
    response.end();    
}

const getData = (request, response) =>{
    //read the data from parsed JSON 
    const responseJSON = {books};
    respond(request, response, 200, responseJSON);
}

const addData = (request, response) => {
    const jsonMessage = {message: 'Everything is required',};
    const {author, country, language, title, year, genres} = request.body;

    if(!author || !country || !language || !title || !year || !genres){
        jsonMessage.id = 'Missing parameters';
        return respond(request, response, 400, jsonMessage);
    }

    let responseStatus = 204; //updated
    if(!books[title]){
        responseStatus = 201;
        books[title] ={
            author: author,
            country: country,
            language: language,
            title: title,
            year: year,
            genres: genres,
        };
    }
    if(responseStatus === 201){
        jsonMessage.message = 'Created successfully';
        return respond(request, response, responseStatus, jsonMessage);
    }
    return respond(request, response, responseStatus, {});
}

module.exports = {getData};