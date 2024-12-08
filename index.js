const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { rejects } = require("assert");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "mDmUNNA@9352004",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};

let count;

//TODO Home Route
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      // console.log(results[0][`count(*)`]);
      count = results[0][`count(*)`];
      res.render("home.ejs", { count });
      // console.log(results[1]);
    });
  } catch (err) {
    console.log(err);
    res.send("Errors in db");
  }
});

//TODO Show route
app.get("/users", (req, res) => {
  let q = `SELECT * FROM user ORDER BY username ASC`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let users = results;
      let i = 1;
      // console.log(results);
      res.render("showusers.ejs", {users, i}); 
    });
  } catch (err) {
    console.log(err);
    res.send("Errors in db");
  }
})

//TODO Edit Route
app.get("/users/:id/edit", (req, res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = "${id}"`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      console.log(results);
      let user = results[0];
      res.render("edit.ejs", {user}); 
    });
  } catch (err) {
    console.log(err);
    res.send("Errors in db");
  }
});

//TODO Update in DB
app.patch("/users/:id", (req, res)=>{
  let {id} = req.params;
  let {password: formPass, username: newUser} = req.body;
  let q = `SELECT * FROM user WHERE id = "${id}"`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      if(user.password != formPass){
        res.send("Wrong Password");
      }else{
        let q2 = `UPDATE user SET username = "${newUser}" WHERE id = "${id}"`;
        connection.query(q2, (err, results)=>{
          if(err) throw err;
          res.redirect("/users")
        })
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Errors in db");
  }
});

// TODO Create New User
app.get("/users/new", (req, res)=>{
  res.render("new.ejs");
})

// TODO Adding new user in DB
app.post("/users", (req, res)=>{
  let id = faker.string.uuid();
  let {username, email, password} = req.body;
  try {
    let q0 = `SELECT * FROM user`;
    connection.query(q0, (err, results) => {
      if (err) throw err;
      for(let i = 0; i < count; i++){
        while("${id}" === results[i].id){
          id = faker.string.uuid();
        }
      }
    });
    let q1 = `SELECT * FROM user WHERE id = "${id}" OR username = "${email}" OR email = "${password}"`;
    connection.query(q1, (err, results) => {
      if (err) throw err;
      if(results.length > 0) {
        return res.send.status(400).send("User with same data is already exists");
      }
    });
    let q2 = `INSERT INTO user (id, username, email, password) VALUES("${id}", "${username}", "${email}", "${password}")`;
    connection.query(q2, (err, results) => {
      if (err) throw err;
      // console.log(results);
      res.redirect("/users");
    });
  } catch (err) {
    console.log(err);
    res.send("Errors in db");
  }
})

//TODO Creating Delete Form
app.get("/users/:id/delete", (req, res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = "${id}"`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      console.log(results[0]);
      let user = results[0];
      res.render("delete.ejs", {user}); 
    });
  } catch (err) {
    console.log(err);
    res.send("Errors in db");
  }
});

//TODO Deleting From DB
app.delete("/users/:id", (req, res)=>{
  let {id} = req.params;
  let {email: formEm, password: formPass} = req.body;
  let q = `SELECT * FROM user WHERE id = "${id}"`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      if(user.password != formPass || user.email != formEm){
        res.send("Wrong Password or Email");
      }else{
        let q2 = `DELETE FROM user WHERE id = "${id}"`;
        connection.query(q2, (err, results)=>{
          if(err) throw err;
          console.log(results);
          res.redirect("/users");
        })
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Errors in db");
  }
})

app.listen("8080", () => {
  console.log("The app is listening on port 8080");
});




// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data = [];
// for(let i = 1; i <= 100; i++){
//   data.push(getRandomUser());
// }

// connection.query(q, [data], (err, results) => {
//         try{
//           if(err) throw err;
            // console.log(results.length);
//             console.log(results);
            // console.log(results[1]);
//         }catch(err){
//             console.log(err);
//         }
//     }
// );

// connection.end();
