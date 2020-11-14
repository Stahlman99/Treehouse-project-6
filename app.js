/*
// Require resources
*/


const express = require('express');
const data = require('./data/data.json');


/*
// Set up
*/


//Create the app instance of Express
const app = express();
// Set the view engine to Pug
app.set('view engine', 'pug');
// Set the route to the public files to '/static'
app.use('/static', express.static('public'));
// Custom error to be used for displaying error data.
let custError = undefined;


/*
// Routes
*/


//Route to the 'Home' page
app.get('/', (req, res) => {
    res.locals.projects = data.projects;
    res.render('index');
});

// Route to the 'About' page.
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/projects', (req, res) => {
    res.redirect('/');
});

// Route to the projects.
app.get('/project/:id', (req, res, next) => {
    res.locals.projects = data.projects;
    let { id } = req.params;
    // The array is reversed
    res.locals.id = ((data.projects.length - id));

    // Checks to see if the projects exists. If not, it sends a custom error.
    if ((id - 1) >= data.projects.length) {
        const err = new Error(`Project ${id} does not exist.`);
        err.status = 404;
        err.id = `Project ${id} does not exist.`;
        next(err);
    }

    

    res.render('project');
});


/*
// Error Handlers
*/


// 404 'Not found' error.
app.use((req, res) => {
    res.status(404).render('page-not-found');
});

// Error handler for all other errors.
app.use((err, req, res, next) => {

    console.log(`${err} / Status ${err.status}`);

    if (err.status === 404) {
        res.status(404).render('page-not-found');
    } else {
        err.message = err.message || 'Oops! There was an error on the server.';
        if (err.status === undefined){
            err.status = 500;
        }
        res.status(err.status).render('error', { err } );
    }
});


/*
// Set the app to run at localhost:3000
*/


app.listen(3000, () => {
    console.log('The app is running at localhost:3000');
});