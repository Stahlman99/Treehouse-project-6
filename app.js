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
    res.locals.id = id;

    // Checks to see if the projects exists. If not, it sends a custom error.
    if (id >= data.projects.length) {
        const err = new Error(`Project ${id} does not exist.`);
        err.status = 404;
        err.id = `Project ${id} does not exist.`;
        next(err);
    }

    res.render('project');
});

// Routes to 404 page.
app.get('/page-not-found', (req, res) => {
    const err = new Error('Page not found');
    err.status = 404;;

    res.locals.error = err;

    console.log(`${err} / Status ${err.status}`);
    res.render('page-not-found');
});


app.get('/error', (req, res) => {

    if (custError === undefined) {
        return res.redirect('page-not-found')
    }

    res.locals.error = custError;
    res.render('error');
    custError = undefined;
});


/*
// Error Handlers
*/


// 404 'Not found' error.
app.use((req, res) => {
    res.redirect('page-not-found');
});

// Error handler for all other errors.
app.use((err, req, res, next) => {
    console.log(`${err} / Status ${err.status}`);

    custError = err;
    res.redirect('error');
});


/*
// Set the app to run at localhost:3000
*/


app.listen(3000, () => {
    console.log('The app is running at localhost:3000');
});