��# movie_api

Movie API Documentation
This API provides information about movies, genres, and directors. Users can interact with the API to retrieve details about movies, genres, directors, create new users, and manage their favorite movies.

Table of Contents
Endpoints
1. Get All Movies
2. Get All Users
3. Get Movie by Title
4. Get Genre 
5. Get Director by Name
6. Create New User
7. Update User Details
8. Add Movie to User's Favorites
9. Remove Movie from User's Favorites
10. Delete User
Endpoints
1. Get All Movies
Request:

Method: GET
URL: /movies
Request Body: None
Response:

Format: JSON
Description: A JSON object containing data on all movies.
2. Get All Users
Request:

Method: GET
URL: /users
Request Body: None
Response:

Format: JSON
Description: A JSON object containing data on all users.
3. Get Movie by ID
Request:

Method: GET
URL: /movies/[Title]
Request Body: None
Response:

Format: JSON
Description: A JSON object containing data about a specific movie, including title, description, director details, genre with description, and image URL.
4. Get Genre Description
Request:

Method: GET
URL: /movies/genre/[genreName]
Request Body: None
Response:

Format: JSON
Description: A JSON object containing the description of a genre.
5. Get Director by Name
Request:

Method: GET
URL: /movies/director/[name]
Request Body: None
Response:

Format: JSON
Description: A JSON object containing details about a director, including name, bio, and birth date.
6. Create New User
Request:

Method: POST
URL: /users
Request Body Format: JSON
{
  "username": "ILoveMovies",
  "password": "myFlix123",
  "email": "movieLover@email.com",
  "birthday": "1999-02-02"
}
Response:

Format: JSON
Description: A JSON object with user details, including the new user's ID, birthdate, and an empty list of favorite movies.
7. Update User Details
Request:

Method: PUT
URL: /users/[Username]
Request Body Format: JSON (with at least one updated field)
{
  "username": "vicmovie1",
  "email": "new.email@email.com"
}
Response:

Format: JSON
Description: Updated user details.
8. Add Movie to User's Favorites
Request:

Method: POST
URL: /users/[Username]/movies/[movie_id]
Request Body: None
Response:

Format: JSON
Description: Updated user details.
9. Remove Movie from User's Favorites
Request:

Method: DELETE
URL: /users/[Username]/movies/[movie_id]
Request Body: None
Response:

Format: JSON
Description: Updated user details.
10. Delete User
Request:

Method: DELETE
URL: /users/[Username]
Request Body: None
Response:

Format: JSON
Description: A message confirming the removal of the user.
Technologies Used
Node.js
Express.js
MongoDB with Mongoose
bcrypt
body-parser
cors
express-validator
jsonwebtoken
lodash
passport
passport-jwt
passport-local
uuid
Getting Started
Install dependencies: npm install
Start the server: npm start or for development with nodemon: npm run dev
Author:
Victor M. Pena Gonzalez

Feel free to explore and interact with the Movie API!
