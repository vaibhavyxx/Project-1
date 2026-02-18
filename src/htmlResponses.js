const fs = require('fs');   //file system
const { request } = require('http');
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const jsonString = fs.readFileSync(`${__dirname}/../data/books.json`);
const books = JSON.parse(jsonString);
//console.log(books);

const loadFile = (request, response, type, file) => {
    response.writeHead(200, {'Content-Type': type});
    response.write(file);
    response.end();
}

const getHTML = (request, response) => {
    loadFile(request, response, 'text/html', index);
}
const getStyle = (request, response) => {
    loadFile(request, response, 'text/css', style);
}
const getJSON = (request, response) => {
    loadFile(request,response, 'application/json', books)
}

module.exports = {getHTML, getStyle, getJSON, books};