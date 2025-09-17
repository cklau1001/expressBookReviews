# Introduction
This is a simple book review RESTful application implemented by Express with JWT authentication on protected endpoints.

# Usage
## Public endpoints
- GET / ( Get all books)
- GET /isbn/${isbn}  (Get the book by ISBN)
- GET /author/${author} (Get all books written by a given author)
- GET /title/${title}  (Get book by title)
- GET /review/${isbn}  (Get all reviews of a book by ISBN)
- POST /register (Register a user to this endpoint)
```json
{"username": "str", "password": "str"}
```
- POST /customer/login (Log on this application)
```json
{"username": "str", "password": "str"}
```

## Protected endpoints
- PUT /customer/auth/review/${isbn} (Add or update a book review)
```json
{"review": "str"}
```
- DELETE /customer/auth/review/${isbn} (Delete a book review)


