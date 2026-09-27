const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const databaseFile = "../database/database.json";

// GET USERS
app.get("/users", (req, res) => {
    const data = fs.readFileSync(databaseFile, "utf8");
    const users = JSON.parse(data);
    res.json(users);
});

// ADD USER
app.post("/users", (req, res) => {
    const data = fs.readFileSync(databaseFile, "utf8");
    const users = JSON.parse(data);

    const newUser = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);

    fs.writeFileSync(databaseFile, JSON.stringify(users, null, 2));

    res.json(newUser);
});

// UPDATE USER
app.put("/users/:id", (req, res) => {
    const data = fs.readFileSync(databaseFile, "utf8");
    const users = JSON.parse(data);

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    user.email = req.body.email;

    fs.writeFileSync(databaseFile, JSON.stringify(users, null, 2));

    res.json(user);
});

// DELETE USER
app.delete("/users/:id", (req, res) => {
    const data = fs.readFileSync(databaseFile, "utf8");
    const users = JSON.parse(data);

    const id = Number(req.params.id);

    const updatedUsers = users.filter(user => user.id !== id);

    fs.writeFileSync(
        databaseFile,
        JSON.stringify(updatedUsers, null, 2)
    );

    res.json({ message: "User deleted successfully" });
});

// HOME
app.get("/", (req, res) => {
    res.send("CRUD Dashboard Backend is running!");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
