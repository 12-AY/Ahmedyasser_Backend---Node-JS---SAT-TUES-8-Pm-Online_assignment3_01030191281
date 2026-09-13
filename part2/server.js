const express = require("express");
const { readUsers, writeUsers, getNextId } = require("./userStore");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /user - add a new user, rejecting duplicate emails
app.post("/user", async (req, res) => {
  try {
    const { name, age, email } = req.body;

    if (!name || !age || !email) {
      return res.status(400).json({ message: "name, age and email are required." });
    }

    const users = await readUsers();

    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = {
      id: getNextId(users),
      name,
      age,
      email,
    };

    users.push(newUser);
    await writeUsers(users);

    return res.status(201).json({ message: "User added successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// PATCH /user/:id - update name, age or email of an existing user
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const users = await readUsers();

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User ID not found." });
    }

    const { name, age, email } = req.body;

    if (email) {
      const emailTakenByAnotherUser = users.some(
        (user) => user.email === email && user.id !== userId
      );
      if (emailTakenByAnotherUser) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    if (name !== undefined) users[userIndex].name = name;
    if (age !== undefined) users[userIndex].age = age;
    if (email !== undefined) users[userIndex].email = email;

    await writeUsers(users);

    return res.json({ message: "User age updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// DELETE /user/:id - delete a user by id
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const users = await readUsers();

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User ID not found." });
    }

    users.splice(userIndex, 1);
    await writeUsers(users);

    return res.json({ message: "User deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// GET /user - get all users
app.get("/user", async (req, res) => {
  try {
    const users = await readUsers();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

// GET /user/:id - get a single user by id
app.get("/user/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const users = await readUsers();

    const user = users.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong.", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
