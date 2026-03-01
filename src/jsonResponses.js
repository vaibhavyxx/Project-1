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

//helper function for getting filtered data
const getFilteredData = (request, response, requestQuery, queryName) => {
    if(!request.query || !requestQuery){
        const json = {error: `${queryName} is required`};
        return respond(request, response, 400, json);
    }
    let indices = [];
    for(book in books){
        const filteredItem = requestQuery === books[book][`${queryName}`];
        if(filteredItem) indices.push(books[book]);
    }
    if(!indices){
        const json = {error: 'Invalid book'};
        return respond(request, response, 404, json);
    }
    return respond(request, response, 200, indices);
}

const getSelectedCountries = (request, response) => {
    getFilteredData(request, response, request.query.country, "country");
}

const getSelectedAuthors = (request, response) => {
    getFilteredData(request, response, request.query.author, "author");
}

const getSelectedTitles = (request, response) => {
    getFilteredData(request, response, request.query.title, "title");
}

const getData = (request, response) =>{
    return respond(request, response, 200, books);
}

const addDetails = (request, response) => {
    //skipping to the data from request.body
    const message = {message: 'Everything is required'};
    let title = request.body["title"];
    let pages = request.body["pages"];
    let country = request.body["country"];

    if(title === '' || pages === '' || country === ''){
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
    let author =  request.body["author"];
    let title = request.body["title"];
    let year = request.body["year"];
    let genres = request.body["genres"];
    //console.log(request.body);
    //console.log(`${author}, ${title}, ${year}, ${genres}`);

    if(author === '' || title === '' || year === '' || genres === ''){
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

const notFound = (request, respond) => {
    const message = {message: 'Not Found'};
    return respond(request, response, 404, message);
}

module.exports = {getData, addBook, addDetails, notFound, getSelectedTitles, getSelectedAuthors, getSelectedCountries};