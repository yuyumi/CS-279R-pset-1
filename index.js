// Import express, dotenv, and mongoose packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Create an application using Express
const app = express();

// Import the TodoTask mongoose model
const TodoTask = require("./models/TodoTask");

// Read the .env file
dotenv.config();

// Allow access to the stylesheet
app.use("/static", express.static("public"));

// Allows us to extract data from the html form
app.use(express.urlencoded({ extended: true }));


// Connect to the MongoDB using Mongoose and the DB_CONNECT environment variable from the .env file
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, err => {
    if(err) throw err;

    // Print a statement in the console if no errors thrown
    console.log("Connected to db!");

    // Host the application on the 3120 port of localhost or port defined by .env and listen to it
    app.listen(process.env.PORT || 3120, () => console.log("Server Up and running"));
});

// View engine configuration
app.set("view engine", "ejs");

// GET METHOD

// Activates when the page is on the index page
app.get("/", (req, res) => {

        // Look for to-do tasks stored in MongoDB and render them into the to-do list
        TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD

// Activates when the page is on the index page, async means the function will wait for certain functions to complete before finishing
// `req` is the request
app.post('/',async (req, res) => {

    // Make a new TodoTask model using the request content as the content field
    const todoTask = new TodoTask({
        content: req.body.content
    });

    // Save the model onto MongoDB and return to index page
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// UPDATE METHOD

// Activate the following methods if the app is routed to "/edit/<any to-do task id>"
app
    .route("/edit/:id")

    // Use a get method to rerender the page into the edit mode, and use the id of the request as the to-do task to be edited
    .get((req, res) => {
        const id = req.params.id;

        // Finds all the to-do tasks and passes it as the list variable for rendering the edit mode
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })

    // Post method to update MongoDB with the edited to-do task name and return to the index page
    .post((req, res) => {
        const id = req.params.id;

        // Find the task in MongoDB's collections by the to-do task id and update the content parameter by the new to-do task name
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            
            // Return to index page
            res.redirect("/");
        });
    });

//DELETE

// Activate the following get method if the app is routed to "/remove/<any to-do task id>"
app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;

        // Find the task in MongoDB's collections by the to-do task id and remove it
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);

            // Return to index page
            res.redirect("/");
        });
    });

// STAR (Marks as important)

// Activate the following get method if the app is routed to "/star/<any to-do task id>"
app.route("/star/:id").get((req, res) => {
    const id = req.params.id;

    // Find the task in MongoDB's collections by the to-do task id and mark the task as important (star: true)
    TodoTask.findByIdAndUpdate(id, { star: true }, err => {
        if (err) return res.send(500, err);

        // Return to index page
        res.redirect("/");
    });
});

// REMOVE STAR (Mark as not important)

// Activate the following get method if the app is routed to "/nostar/<any to-do task id>"
app.route("/nostar/:id").get((req, res) => {
    const id = req.params.id;

    // Find the task in MongoDB's collections by the to-do task id and mark the task as unimportant (star: false)
    TodoTask.findByIdAndUpdate(id, { star: false }, err => {
        if (err) return res.send(500, err);

        // Return to index page
        res.redirect("/");
    });
});