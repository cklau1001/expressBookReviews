const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
   //write code to check is the username is valid
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

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(401).json({ message: "Invalid login. Please provide both username and password" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        // return res.status(200).send("[" + username + "] successfully logged in");
        return res.status(200).json({message: "[" + username + "] successfully logged in"});
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    let isbn = req.params.isbn;    
    let reviewContent = req.body.review;
    let username = req.session.authorization['username'];

    console.log("isbn=" + isbn + ", user=" + username);
    let book = books[isbn];
  
    if (book && reviewContent) {
      let reviews = book.reviews;
      reviews[username] = reviewContent;

      // flatten book structure by destruture ...
        res.send(JSON.stringify({isbn, ...book}, null, 4));

    } else {
       return res.status(404).json({message: 'Unable to find book with ISBN=' + isbn});
    }
  


    res.send({message: 'a test'}, null, 4);


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
