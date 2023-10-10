const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const { title } = require('process');
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { check, validationResult } = require('express-validator');

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];


app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


//mongoose.connect('mongodb://127.0.0.1/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

//Get
app.get('/', (req, res) => {
    res.send('Welcome to MyFlix');
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.get('/users',  passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
        .then(function (users) {
            res.status(201).json(users);
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
   Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/genre/:genreName',  passport.authenticate('jwt', {session: false}), (req, res) => {
   Movies.findOne({ 'Genre.Name': req.params.genreName})
    .then((movie) => {
        res.json(movie.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send ('Error: ' + err);
    });
});

app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID',  passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });


//allow users to register
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// UPDATE(put) resquests
app.put('/users/:Username',
    passport.authenticate('jwt', { session: false }),
    [
        // Validation logic here for request
        check('Username', 'Username is required.')
            .isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.')
            .isAlphanumeric(),
        check('Password', 'Password is required.')
            .isLength({ min: 8 }),
        check('Email', 'Email is required.')
            .not().isEmpty(),
        check('Email', 'Email does not appear to be valid.')
            .isEmail()
    ],
    async (req, res) => {
        // check the validation object for errors
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422)
                .json({ errors: errors.array() });
        }

        // Condition to check added here
        if (req.user.Username !== req.params.Username) {
            return res.status(400)
                .send('Permission denied');
        }
        // Condition ends
        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOneAndUpdate({ Username: req.params.Username },
            {
                $set:
                {
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birth_Date: req.body.Birth_Date
                }
            },
            { new: true }) // this makes sure that the updated document is returned
            // .populate('Favorite_Movies', 'Title')
            .then((updatedUser) => {
                res.status(201)
                    .json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500)
                    .send('Error: ' + err);
            });
    }
);

//DELETE
app.delete('/users/:Username',  passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove ({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + 'was not found');
            } else {
                res.status(200).send(req.params.Username + 'was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send ('Error: ' + err);
        });
});



// Allow users to remove a movie from the favorites list (DELETE)
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
});
});

//Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

// Handle any errors that occur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred on the server.');
});








