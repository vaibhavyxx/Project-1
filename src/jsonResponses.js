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

const getSelectedCountries = (request, response) => {
    if(!request.query || !request.query.country){
        const json = {error: 'Title is required'};
        return respond(request, response, 400, json);
    }
    let index = [];
    for(book in books){
        const country = request.query.country === books[book]["country"];
        if(country === true){
            index.push(books[book]);
            //break;
        }
    }
    //figure out how the array of countries save these values
    const countries = index;    //saves the array of countries
    //books[request.query.title];   //this is broken
    if(!countries){
        const json = {error: 'Invalid book'};
        return respond(request, response, 404, json);
    }
    return respond(request, response, 200, title);
}

//bad practice but can't think of anything else
const getSelectedAuthors = (request, response) => {
    if(!request.query || !request.query.author){
        const json = {error: 'Title is required'};
        return respond(request, response, 400, json);
    }
    let index;
    for(book in books){
        const author = request.query.author === books[book]["author"];
        if(author === true){
            index = book;
            break;
        }
    }
    const author = books[index];
    //books[request.query.title];   //this is broken
    if(!author){
        const json = {error: 'Invalid book'};
        return respond(request, response, 404, json);
    }
    return respond(request, response, 200, title);
}

const getSelectedTitles = (request, response) => {
    if(!request.query || !request.query.title){
        const json = {error: 'Title is required'};
        return respond(request, response, 400, json);
    }
    let index;
    for(book in books){
        const title = request.query.title === books[book]["title"];
        if(title === true){
            index = book;
            break;
        }
    }
    const title = books[index];
    //books[request.query.title];   //this is broken
    if(!title){
        const json = {error: 'Invalid book'};
        return respond(request, response, 404, json);
    }
    return respond(request, response, 200, title);
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
    console.log(request.body);
    console.log(`${author}, ${title}, ${year}, ${genres}`);

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

module.exports = {getData, addBook, addDetails, notFound, getSelectedTitles};