const fs = require('fs');   //file system
const { request } = require('http');
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
let jsonData = [];

const parseJSON = fs.readFile(`${__dirname}/../data/books.json`, 'utf8', (err, jsonString) => {
    if(err) {
        console.log("Error reading file: ", err);
        return;
    }
    try{
        jsonData = JSON.parse(jsonString);
        //console.log("Parsed JSON data: ", jsonData);
    }catch (parseError){
        console.error("Error parsing JSON: ", parseError);
    }
}); 

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

module.exports = {getHTML, getStyle, jsonData};