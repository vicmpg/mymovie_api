const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

let top10movies = [
    {
        title: 'Toy Story 1',
        author: 'John Lasseter'
    },
    {
        title: 'The Departed',
        author: 'Martin Scorsese'
    },
    {
        title: 'Good Will Hunting',
        author: 'Gus Van Sant'
    },
    {
        title: 'Inception',
        author: 'Christopher Nolan'
    },
    {
        title: 'Interstellar',
        author: 'Christopher Nolan'
    },
    {
        title: 'The Dark Knight Rises',
        author: 'Christopher Nolan'
    },
    {
        title: 'The Dark Knight',
        author: 'Christopher Nolan'
    },
    {
        title: 'The Sting',
        author: 'George Roy Hill'
    },
    {
        title:'La Grande Vadrouille',
        author:'Sofia Coppola'
    },
    {
        title:'Lost In Transition',
        author:'Sofia Coppola'
    }
];

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'log.txt'), 
    {flags: 'a'}
);

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


//Setup App Routing
app.use(
    express.static('public') // routes all requests for static files to the 'public' folder
);

// GET requests
app.get('/',(req,res) => {
    res.send('This is my top 10 movies')
});

app.get('/movies',(req, res) => {
    res.json(top10movies)
});

//Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

// setup Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack); // information about the error will be logged to the terminal, then logged in the console
    res.status(500).send('Something broke!')
});