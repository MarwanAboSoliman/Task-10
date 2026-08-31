import express from "express";
import { createDb } from "./db.js";
const app = express();
const db = createDb();
app.use(express.json());
app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

app.get("/users", async (req, res) => {
  //Get All Users from db
  const users = await db.getAll("users");
  // Respond
  res.json({
    data: users,
  });
});

app.get("/users/:user_id", async (req, res) => {
  // get user by id from database
  const user = await db.getById("users", req.params.user_id);
  //send as json
  res.json({
    data: user,
  });
});

app.post("/users", async (req, res) => {
  //Get Data from body
  const userData = req.body;
  //add To dataBase
  await db.create("users", userData);
  //Response
  res.status(201).json({
    message: "User Created Successfully",
  });
});

app.patch("/users/:user_id", async (req, res) => {
  //get Id from params
  const id = req.params.user_id;
  //check
  const user = await db.getById("users", id);
  if (!user) {
    return res.status(404).json({
      error: "User NOt Found",
    });
  }
  //get Data from body
  const updatedData = req.body;
  //Updated To DataBase
  await db.update("users", id, updatedData);

  const newUser = await db.getById("users", id);

  //respond

  res.status(200).json({
    message: "User Updated Successfully",
    data: newUser,
  });
});

app.delete("/users/:user_id", async (req, res) => {
  const id = req.params.user_id;
  const user = await db.getById("users", id);
  if (user) {
    await db.delete("users", id);
    return res.status(200).json({
      message: "user Deleted ✅",
    });
  } else {
    return res.status(404).json({
      error: "User Not Found ❌",
    });
  }
});

//Search , GetAll
app.get("/authors", async (req, res) => {
  const search = req.query.search;
  let authors;
  if (search) {
    //If query Found Will Return The Specs Authour
    authors = await db.search("authors", search);
    if (authors.length === 0) {
      return res.status(404).json({
        error: "Not Found ",
      });
    } else {
      return res.status(200).json({
        data: authors,
      });
    }
  } else {
    // Will Get All Authour
    authors = await db.getAll("authors");
    return res.status(200).json({
      data: authors,
    });
  }
});

app.get("/authors/:authors_id", async (req, res) => {
  //get authors from db
  const author = await db.getById("authors", req.params.authors_id);
  //respond
  res.json({
    data: author,
  });
});

app.post("/authors", async (req, res) => {
  //take Data from body
  const authData = req.body;
  //add to dataBase
  await db.create("authors", authData);
  //return Response
  res.status(201).json({
    message: "Author created Successfully ✅",
  });
});

app.patch("/authors/:auth_id", async (req, res) => {
  //Check
  const id = req.params.auth_id;
  const auth = await db.getById("authors", id);
  if (!auth) {
    res.status(404).json({
      error: "Auth not Found ❌",
    });
  } else {
    //get Data From Body
    const updatedData = req.body;
    //Updated Data in DataBase
    await db.update("authors", id, updatedData);
    const newAuth = await db.getById("authors", id);
    //Response
    return res.status(200).json({
      message: "Updated ✅",
      data: newAuth,
    });
  }
});

app.delete("/authors/:auth_id", async (req, res) => {
  const id = req.params.auth_id;
  const auth = await db.getById("authors", id);
  if (!auth) {
    return res.status(404).json({
      error: "Author Not Found ❌",
    });
  } else {
    await db.delete("authors", id);
    return res.status(204).json({
      message: "Deleted Successfully ✅",
    });
  }
});

app.listen(3000, () => {
  console.log("Starts on port 3000");
});
