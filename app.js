// app.js

require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const ejs = require('ejs')


const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');


const app = express();
const session = require('express-session');
const flash = require('express-flash');

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.dbURL }),
    cookie: {
      secure: true, 
      httpOnly: true,
      maxAge: 30 * 60 * 1000 //session cookies expires after 30minutes
    }
  })
);

// Set up flash middleware
app.use(flash());

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});





// Import routes
const authRouter = require('./Routes/auth.js')
const routesRouter = require('./Routes/routes.js');
const adminRouter = require('./Routes/admin.js')


//authentication middleware
const isAuthenticated = require('./middleware/authMiddleware.js');

// Middleware for serving static files and parsing body data
app.use(methodOverride('_method')); 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//seting ejs view engine
app.set('view engine','ejs')
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





// Use routes
app.use('/auth', authRouter)
app.use('/', routesRouter);
app.use('/admin', adminRouter);


// Database connection
const dbURL = process.env.dbURL;
mongoose.connect(dbURL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error(err));


    // Rendering 404 page for mispath
app.use((req, res) => {
    console.log('404 handler triggered');
    res.status(404).render('404');
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// Start the server
const port = process.env.PORT || 3000; // Provide a default port if `process.env.PORT` is undefined


app.listen(port, () => {
    console.log(`Server is up, listening for requests on port ${port}`);
});
