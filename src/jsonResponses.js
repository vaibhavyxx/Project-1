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

const addDetails = (request, response) => {
    let content = "";
    //skipping to the data from request.body
    const message = {message: 'Everything is required'};
    let title = request.body["title"];
    let pages = request.body["pages"];
    let country = request.body["country"];

    if(title === undefined || pages === undefined || country === undefined){
        message.id = "Bad parameters";
        return respond(request, response, 400, message);
    }
    let responseCode = 204;
    if(!books[title]){
        responseCode = 201;
        books[title] = {title: title, pages: pages, country: country};
    }
    if(responseCode === 201){
        message.message = "Created successfully";
        return respond(request, response, responseCode, message);
    }
    return respond(request, response, responseCode, {});
}

const addBook = (request, response) => {
    let content = "";
    if(request.type === 'application/json'){
        content = (request.body);
    }else {
        //need to understand how url take it
    }
    const msg = {message: 'Everything is required'};
    let author = request.body["author"];
    let title = request.body["title"];
    let year = request.body["year"];
    let genres = request.body["genres"];

    if(author === undefined || title === undefined || year === undefined || genres === undefined){
        msg.id = 'Bad Parameters';
        return respond(request, response, 400, msg);
    }
    let responseCode = 204; //Updated
    if(!books[title]){
        responseCode = 201; //Created
        books[title] = {author: author, title: title, year: year, genres: genres};
    }
    if(responseCode === 201){
        msg.message = "Created Succesfully";
        return respond(request, response, responseCode, msg);
    }
    return respond(request, response, responseCode, {}); //No message
}

const addData = (request, response) => {

    let parsedBody = "";
    //need a condition to take url-encoded
    if(request.type === 'application/json'){    
    parsedBody = JSON.parse(request.body);
    }
    const jsonMessage = {message: 'Everything is required',};
    //const {author, country, language, url, page, title, year, genres} = parsedBody;
    const author = request.body["author"];
    const country = request.body["country"];
    const language = request.body["language"];
    const url = request.body["link"];
    const page = request.body["page"];
    const title = request.body["title"];
    const year = request.body["year"];
    const genres = request.body["genres"];
    console.log('response: '+ author+', '+ title+', '+ year);

    if(author === undefined || title === undefined || year === undefined){
        console.log("passing a bad req");
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
            link: url,
            page: page,
            title: title,
            year: year,
            genres: genres,
        };
        console.log(books[title]);  //load it into the array
    }
    
    console.log(books[title]);
    if(responseStatus === 201){
        jsonMessage.message = 'Created successfully';
        return respond(request, response, responseStatus, jsonMessage);
    }
    return respond(request, response, responseStatus, {});
};

module.exports = {getData, addBook, addDetails};