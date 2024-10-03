var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var user = require("../models/user");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

/* GET home page. */
router.get("/", function (_req, res) {
  res.render("index", { title: "Express" });
});

/* GET edit record page. */
router.get("/editrecord", function (_req, res) {
  res.render("editrecord");
});
/* GET Log In record page. */
router.get("/login", function (_req, res) {
  res.render("login");
});
/* GET demo record page. */
router.get("/demo", function (_req, res) {
  res.render("demo");
});

/* Register a new user */
router.post("/register", async function (req, res) {
  try {
    const { fname, lname, email, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document in the database
    await user.create({
      fname,
      lname,
      email,
      password: hashedPassword, // Store the hashed password
    });
    console.log("User created successfully");

    // Redirect to /viewrecord to display the new data
    res.redirect("/viewrecord");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal server error.");
  }
});

// /* Register a new user */
// router.post("/register", async function (req, res) {
//   try {
//     // Validate that the form has all required fields
//     if (!req.body.fname || !req.body.lname || !req.body.email) {
//       return res.status(400).send("All fields are required.");
//     }

//     // Create a new document in the database
//     await user.create({
//       fname: req.body.fname,
//       lname: req.body.lname,
//       email: req.body.email,
//     });
//     console.log("Data created successfully");

//     // Redirect to /viewrecord to display the new data
//     res.redirect("/viewrecord");
//   } catch (err) {
//     console.error("Error creating data:", err);
//     res.status(500).send("Internal server error.");
//   }
// });

/* View all records */
router.get("/viewrecord", async function (req, res) {
  try {
    const resultdata = await user.find({});
    res.render("viewrecord", { resultdata: resultdata });
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).send("Error fetching records.");
  }
});

/* Render edit page with user data */
router.get("/edit/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await user.findById(userId);

    if (!userData) {
      return res.status(404).send("Record not found");
    }

    res.render("edit", { user: userData });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/* Handle form submission for updating user data */
router.post("/edit/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { fname, lname, email } = req.body;

    const userData = await user.findByIdAndUpdate(
      userId,
      { fname, lname, email },
      { new: true }
    );

    if (!userData) {
      return res.status(404).send("Record not found");
    }

    res.redirect("/viewrecord");
  } catch (err) {
    res.status(500).send("Server error");
  }
});
// delete user detail
router.get("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete the user by their ID
    await user.findByIdAndDelete(userId);

    // Redirect back to the view record page after deletion
    res.redirect("/viewrecord");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
}); //dfghjklfghjk
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.error("Email and password are required.");
      return res.status(400).send("Email and password are required.");
    }
    console.log("Input validated");

    // Find the user by email
    const foundUser = await user.findOne({ email });
    console.log("User found:", foundUser);

    if (!foundUser) {
      console.error("Invalid email or password.");
      return res.status(401).send("Invalid email or password.");
    }
    console.log("User verification successful");

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.error("Invalid email or password.");
      return res.status(401).send("Invalid email or password.");
    }
    console.log("Password verified");
    console.log(foundUser);
    // Set user info in session
    // req.session.userId = foundUser._id;
    // req.session.userName = foundUser.fname; // Store the user's first name

    // console.log("Session data:", req.session);

    // Redirect to the view record page
    res.redirect("/");
    console.log("Redirecting to Home page");
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error.");
  }
});

/* Handle user logout */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    }
    res.redirect("/");
  });
});

//

module.exports = router;
