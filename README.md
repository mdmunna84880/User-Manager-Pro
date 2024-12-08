# User Manager Pro

User Manager Pro is a Node.js-based CRUD application for managing user records in a MySQL database. It provides functionality to create, read, update, and delete users, along with secure password and email validation during updates and deletions. The application uses Express for routing and EJS templates for dynamic rendering.

## Features

- **View Users**: List all users in the database, sorted alphabetically by username.
- **Add New User**: Create a new user with a unique ID, username, email, and password.
- **Edit User**: Update a user’s username after password validation.
- **Delete User**: Remove a user from the database after email and password validation.
- **Secure Data Handling**: Prevent duplicate entries and validate user credentials before sensitive operations.
- **Dynamic Templates**: EJS is used to dynamically render pages for user interactions.

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Templating**: EJS (Embedded JavaScript)
- **Libraries**: 
  - `@faker-js/faker` for generating dummy data
  - `method-override` for supporting HTTP verbs like PATCH and DELETE
  - `mysql2` for database connectivity

