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

    // Host the application on the 3120 port of localhost and listen to it
    app.listen(process.env.PORT || 3120, () => console.log("Server Up and running"));
});

// View engine configuration
app.set("view engine", "ejs");

// GET METHOD
app.get("/", (req, res) => {

        // Look for previous to-do tasks stored in MongoDB and render them into the to-do list
        TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD
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

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE
app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

// STAR (Marks as important)
// app.route("/star/:id").get((req, res) => {
//     const id = req.params.id;
//     TodoTask.findByIdAndRemove(id, err => {
//         if (err) return res.send(500, err);
//         res.redirect("/");
//     });
// });