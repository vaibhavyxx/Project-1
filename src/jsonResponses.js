const { books } = require("./htmlResponses");

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
    const responseJSON = {books};
    respond(request, response, 200, responseJSON);
}

const addDetails = (request, response) => {
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
    }
    const msg = {message: 'Everything is required'};
    let author =  content["author"];//request.body["author"];
    let title = content["title"];//request.body["title"];
    let year = content["year"];//request.body["year"];
    let genres = content["genres"];

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

module.exports = {getData, addBook, addDetails};