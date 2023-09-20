const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const { title } = require('process');

const app = express();
app.use(bodyParser.json());


// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'log.txt'), 
    {flags: 'a'}
);

//users
let users = [
    {
      id: 1,
      name: 'Brittney',
      favoriteMovies: []
    },
    {
      id: 2,
      name: 'Pete',
      favoriteMovies: ['The Incredibles'] 
    }
];

//movies
let movies = [
    {
        'Title': 'Toy Story 1',
        'Description': 'A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy in a boys bedroom.',
        'Genre': {
            'Name': 'Computer-animated comedy',
            'Description': 'A computer-animated film is a feature film that has been computer-animated to appear three-dimensional.'
        },
        'Director': {
            'Name': 'John Lasseter',
            'Bio': 'John Lasseter was born in January 12, 1957. Lasseter began his career as an animator with The Walt Disney Company. After being fired from Disney for promoting computer animation, he joined Lucasfilm, where he worked on then-groundbreaking use of CGI animation. The Graphics Group of the Computer Division of Lucasfilm was sold to Steve Jobs and became Pixar in 1986. Lasseter oversaw all of Pixars films and associated projects as executive producer. In addition, he directed Toy Story (1995), A Bugs Life (1998), Toy Story 2 (1999), Cars (2006), and Cars 2 (2011). From 2006 to 2018, Lasseter also oversaw all of Walt Disney Animation Studios films and associated projects as executive producer. ',
            'Birth': 'January 12, 1957'
        },
        'ImageURL':'https://en.wikipedia.org/wiki/John_Lasseter#/media/File:JohnLasseterOct2011.jpg',
        'Featured':false
    },
    {
        'Title':'Ratatouille',
        'Description':'A rat who can cook makes an unusual alliance with a young kitchen worker at a famous Paris restaurant.',
        'Genre':{
            'Name':'Computer-animated comedy',
            'Description':'A computer-animated film is a feature film that has been computer-animated to appear three-dimensional.',
        },
        'Director': {
            'Name':'Brad Bird',
            'Bio':'Phillip Bradley "Brad" Bird is an American director, screenwriter, animator, producer and occasional voice actor, known for both animated and live-action films. Bird was born in Kalispell, Montana, the youngest of four children of Marjorie A. (née Cross) and Philip Cullen Bird. His father worked in the propane business, and his grandfather, Francis Wesley "Frank" Bird, who was born in County Sligo, Ireland, was a president and chief executive of the Montana Power Company.',
            'Birth': 'September 24, 1957'
        },
        'ImageURL':'https://www.imdb.com/name/nm0083348/mediaviewer/rm107908096/?ref_=nm_ov_ph',
        'Featured':false
    },
    {
        'Title':'The Incredibles',
        'Description':'While trying to lead a quiet suburban life, a family of undercover superheroes are forced into action to save the world.',
        'Genre': {
            'Name':'Computer-animated adventure',
            'Description':'A computer-animated film is a feature film that has been computer-animated to appear three-dimensional.'
        },
        'Director':{
            'Name':'Brad Bird',
            'Bio':'Phillip Bradley "Brad" Bird is an American director, screenwriter, animator, producer and occasional voice actor, known for both animated and live-action films. Bird was born in Kalispell, Montana, the youngest of four children of Marjorie A. (née Cross) and Philip Cullen Bird. His father worked in the propane business, and his grandfather, Francis Wesley "Frank" Bird, who was born in County Sligo, Ireland, was a president and chief executive of the Montana Power Company.',
            'Birth':'September 24, 1957'
        },
        'ImageURL':'https://www.imdb.com/name/nm0083348/mediaviewer/rm107908096/?ref_=nm_ov_ph',
        'Featured':false
    },
    {
        'Title':'Monster, Inc',
        'Description':'In order to power the city, monsters have to scare children so that they scream. However, the children are toxic to the monsters, and after a child gets through, two monsters realize things may not be what they think.',
        'Genre': {
            'Name':'Computer-animated comedy',
            'Description':'A computer-animated film is a feature film that has been computer-animated to appear three-dimensional.'
        },
        'Director':{
            'Name':'Pete Docter',
            'Bio':'Pete Docter is the Oscar®-winning director of "Monsters, Inc.," "Up," and "Inside Out," and Chief Creative Officer at Pixar Animation Studios. He is currently directing Pixars feature film "Soul" with producer Dana Murray, which is set to release June 19, 2020.',
            'Birth':'October 9, 1968'
        },
        'ImageURL':'https://www.imdb.com/name/nm0230032/mediaviewer/rm2102641409/?ref_=nm_ov_ph',
        'Featured':false
    },
    {
        'Title':'A Bugs Life',
        'Description':'A misfit ant, looking for "warriors" to save his colony from greedy grasshoppers, recruits a group of bugs that turn out to be an inept circus troupe.',
        'Genre':{
            'Name':'Computer-animated comedy',
            'Description':'A computer-animated film is a feature film that has been computer-animated to appear three-dimensional.'
        },
        'Director': {
            'Name':'John Lasseter',
            'Bio':'John Lasseter was born in January 12, 1957. Lasseter began his career as an animator with The Walt Disney Company. After being fired from Disney for promoting computer animation, he joined Lucasfilm, where he worked on then-groundbreaking use of CGI animation. The Graphics Group of the Computer Division of Lucasfilm was sold to Steve Jobs and became Pixar in 1986. Lasseter oversaw all of Pixars films and associated projects as executive producer. In addition, he directed Toy Story (1995), A Bugs Life (1998), Toy Story 2 (1999), Cars (2006), and Cars 2 (2011). From 2006 to 2018, Lasseter also oversaw all of Walt Disney Animation Studios films and associated projects as executive producer.',
            'Birth':'January 12, 1957'
        },
        'ImageURL':'https://en.wikipedia.org/wiki/John_Lasseter#/media/File:JohnLasseterOct2011.jpg',
        'Featured':false
    }
];


// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


//Setup App Routing
app.use(
    express.static('public') // routes all requests for static files to the 'public' folder
);

//Post(create) requests
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need name')
    }
});

//POST(create) requests
app.post('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;


    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else{
        res.status(400).send('no such user')
    }
});


//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;


    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else{
        res.status(400).send('no such user')
    }
});


//DELETE
app.delete('/users/:id/', (req, res) => {
    const {id} = req.params;


    let user = users.find( user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(` user ${id} has been deleted`);
    } else{
        res.status(400).send('no such user')
    }
});


// UPDATE(put) resquests
app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else{
        res.status(400).send('no such user')
    }
});


// GET(read) requests
app.get('/movies',(req, res) => {
    res.status(200).json(movies)
});

// GET(read) requests
app.get('/movies/:title',(req, res) => {
    const {title} = req.params;
    const movie = movies.find( movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    }

    else {
        res.status(400).send('movie not found')
    }
});

// GET(read) requests
app.get('/movies/genre/:genreName',(req, res) => {
    const {genreName} = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    }

    else {
        res.status(400).send('genre not found')
    }
});


// GET(read) requests
app.get('/movies/director/:directorName',(req, res) => {
    const {directorName} = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    }

    else {
        res.status(400).send('director not found')
    }
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