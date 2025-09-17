const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "[" + username + "] successfully registered. Now you can login"});
      } else {
          return res.status(200).json({message: "[" + username + "] already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(401).json({message: "Unable to register user. Please provide a valid payload"});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here  
  res.json(books);

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {    
    res.json(book);
  } else {
    return res.status(404).json({message: 'Unable to find book with ISBN=' + isbn});
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
  let author = req.params.author;
  let target_books = {};

  for (let [key, value] of Object.entries(books)) {
    
    if (value.author == author) {
        target_books[key] = value;
    }
  }
  
  if (Object.keys(target_books).length > 0) {    
    res.json(target_books);
  } else {
    return res.status(404).json({message: 'Unable to find book written by ' + author});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
  let title = req.params.title;
  let target_books = {};

  for (let [key, value] of Object.entries(books)) {
    
    if (value.title == title) {
        target_books[key] = value;
    }
  }
  
  if (Object.keys(target_books).length > 0) {    
    res.json(target_books);
  } else {
    return res.status(404).json({message: 'Unable to find book with title: ' + title});
  }


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {

    //res.send(JSON.stringify({isbn: isbn, reviews: book.reviews}, null, 4));
    res.json({isbn: isbn, reviews: book.reviews})
  } else {
    return res.status(404).json({message: 'Unable to find book with ISBN=' + isbn});
  }
  

});

// Using axios
// Task 10 - get all books
public_users.get('/async', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching external data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }    
}); 

// Task 11 - get books by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        let isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching external data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }    
});

// Task 12 - get book details by author
public_users.get('/async/author/:author', async (req, res) => {
    try {
        let author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching external data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }    

});

// Task 13 - get book details by title
public_users.get('/async/title/:title', async (req, res) => {
    try {
        let title = req.params.title;
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching external data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }    

});

module.exports.general = public_users;
