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

// 
app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));


//connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, err => {
    if(err) throw err;
    console.log("Connected to db!");
    app.listen(process.env.PORT || 3120, () => console.log("Server Up and running"));
});

// view engine configuration
app.set("view engine", "ejs");

// GET METHOD
app.get("/", (req, res) => {
        TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD
app.post('/',async (req, res) => {
        const todoTask = new TodoTask({
        content: req.body.content
    });
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