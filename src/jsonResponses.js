const { books } = require("./htmlResponses");

const respond = (request, response, status, object)=> {
    const acceptedType = request.headers['accept'];
    let content;
    let contentType;
    
    if(acceptedType === 'application/x-www-form-urlencoded'){
        content = Object.entries(object)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');
        contentType = 'application/x-www-form-urlencoded';
    } else {
        content = JSON.stringify(object);
        contentType = 'application/json';
    }

    response.writeHead(status, {                    
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    if(request.method !== 'HEAD' && status !== 204){ 
        response.write(content);
    }
    response.end();    
}

//takes in parameter, case-insensitive
const containsElement = (query, book) => {
    book = book.toLowerCase();
    const phrases = book.split(' ');
    let val = phrases.find(item => item === query.toLowerCase());
    return val;
}

//helper function for getting filtered data
const singleParamFilter = (request, response, requestQuery, queryName) => {
    if(!request.query || !requestQuery){
        const json = {error: `${queryName} is required`};
        return respond(request, response, 400, json);
    }
    let indices = [];
    for(let index in books){
        const filteredItem = containsElement(requestQuery, books[index][queryName]) || requestQuery === books[index][queryName];
        //requestQuery === books[index][`${queryName}`]; //this has to change
        if(filteredItem) indices.push(books[index]);
    }
    if(indices.length === 0){
        const json = {error: 'Invalid book'};
        return respond(request, response, 404, json);
    }
    return respond(request, response, 200, indices);
}

const getSelectedCountries = (request, response) => {
    singleParamFilter(request, response, request.query.country, "country");
}

const getSelectedAuthors = (request, response) => {
    singleParamFilter(request, response, request.query.author, "author");
}

const getSelectedTitles = (request, response) => {
    singleParamFilter(request, response, request.query.title, "title");
}

const getData = (request, response) =>{
    return respond(request, response, 200, books);
}

const addDetails = (request, response) => {
    const message = {message: 'Everything is required'};
    const title = request.body["title"];
    const pages = request.body["pages"] || request.body["page"]; // handle name mismatch
    const country = request.body["country"];
    const language = request.body["language"];

    if(!title || !pages || !country){
        message.id = "Bad parameters";
        return respond(request, response, 400, message);
    }

    let responseCode = 204; // updated

    if(!books[title]){
        responseCode = 201; // created
        books[title] = {}; // initialize empty so spread works below
    }

    books[title] = {
        ...books[title],  
        title,
        pages,
        country,
        language,
    };

    if(responseCode === 201){
        message.message = "Created successfully";
        return respond(request, response, responseCode, message);
    }
    return respond(request, response, responseCode, {});
}

const addBook = (request, response) => {
    const msg = {message: 'Everything is required'};
    const author = request.body["author"];
    const title = request.body["title"];
    const year = request.body["year"];
    const genres = request.body["genres"];
    const link = request.body["link"];

    if(!author || !title || !year || !genres || !link){
        msg.id = 'Bad Parameters';
        return respond(request, response, 400, msg);
    }

    let responseCode = 204; // updated

    if(!books[title]){
        responseCode = 201; // created
        books[title] = {}; // initialize empty so spread works below
    }

    books[title] = {
        ...books[title],  
        author,
        title,
        year,
        genres,
        link,
    };

    if(responseCode === 201){
        msg.message = "Created successfully";
        return respond(request, response, responseCode, msg);
    }
    return respond(request, response, responseCode, {});
}

const addGenres =(request, response) => {
    const message =  {message: 'Enter your genre'};
    const genre = request.body["genres"];
    const title = request.body["title"];

    if(genre == '' || title == ''){
        message.message = 'Bad parameters';
        return respond(request, response, 400, message);
    }
    let responseCode = 204;
    let genresArr = null;
    let index = -1;

    for(let i in books){
        if(books[i]["title"] === title){
            genresArr = books[i]["genres"];
            index = i;

            for(let g in genresArr){
                 if(genresArr[g] == genre){
                    message.message = 'Genre already added';
                    return respond(request, response, 204, message); // ✅ exit early, don't add
                }
            }

            genresArr[genresArr.length] = genre[0]; //adds the element
            books[i]["genres"] = genresArr;
            responseCode = 201;
            break;
        }
    }
    books[index]["genres"] = genresArr;   
    books[index]["title"] = title;

    if(responseCode === 201){
        message.message = "Created successfully";
        return respond(request, response, responseCode, message);
    }
    return respond(request, response, responseCode, {});
}

const notFound = (request, response) => {
    const message = {message: 'Not Found'};
    return respond(request, response, 404, message);
}

module.exports = {getData, addBook, addDetails, addGenres,
    notFound, 
    getSelectedTitles, getSelectedAuthors, 
    getSelectedCountries};