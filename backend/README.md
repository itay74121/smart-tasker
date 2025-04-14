# Express.js Basic Application

This is a basic Express.js application that demonstrates the use of routers and middleware.

## Project Structure

```
express-app
├── src
│   ├── app.js          # Entry point of the application
│   ├── routes
│   │   └── index.js    # Route definitions
│   ├── middleware
│   │   └── logger.js    # Middleware for logging requests
├── package.json        # NPM configuration file
└── README.md           # Project documentation
```

## Installation

To install the necessary dependencies, run:

```
npm install
```

## Usage

To start the application, use the following command:

```
npm start
```

The application will be running on `http://localhost:3000`.

## Middleware

The application includes a custom middleware for logging incoming requests. This middleware logs the request method and URL to the console.

## Routes

The application currently has a single route defined at the root path (`/`). You can extend this by adding more routes in the `src/routes/index.js` file.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features.