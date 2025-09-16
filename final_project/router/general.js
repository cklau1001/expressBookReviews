const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "[" + username + "] successfully registered. Now you can login"});
      } else {
          return res.status(200).json({message: "[" + username + "] already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book, null, 4));
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
    res.send(JSON.stringify(target_books, null, 4));
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
    res.send(JSON.stringify(target_books, null, 4));
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

    res.send(JSON.stringify({isbn: isbn, reviews: book.reviews}, null, 4));
  } else {
    return res.status(404).json({message: 'Unable to find book with ISBN=' + isbn});
  }
  

});

module.exports.general = public_users;
