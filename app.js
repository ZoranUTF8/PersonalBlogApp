//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash/string");

// MONGO DB
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-zoran:Moeko2021@personalblogdb.grkgh.mongodb.net/PersonalBlogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// blog post Schema
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Post title missing!"]
  },
  text: {
    type: String,
    required: [true, "Post text missing!"]
  }
});
// model name
const BlogPost = mongoose.model("BlogPost", blogPostSchema);



// DB END
const posts = [];

const startingText = "Gummi bears pie jelly beans pastry cupcake topping. Jelly ice cream jujubes cheesecake. Cheesecake marzipan danish. Fruitcake I love cookie danish marshmallow gingerbread. I love jelly-o I love ice cream sugar plum. Jujubes croissant marzipan muffin brownie pastry pie I love cheesecake. Sugar plum tiramisu croissant sweet jujubes marzipan. I love chocolate cake bear claw donut. Biscuit marshmallow tart halvah marshmallow cake jujubes croissant. Oat cake dragée cake brownie biscuit. Tootsie roll tootsie roll sugar plum carrot cake chocolate cake caramels. I love cookie bonbon";
const aboutMeText = "Fruitcake cotton candy carrot cake sesame snaps. Carrot cake danish bear claw. I love chocolate cake sweet roll candy cake carrot cake tootsie roll chocolate bar I love. Jujubes oat cake jelly beans carrot cake wafer I love I love I love brownie. Cupcake fruitcake sesame snaps oat cake biscuit cheesecake icing. Caramels chocolate powder I love tiramisu tart pastry. Fruitcake sugar plum cookie sweet oat cake gingerbread jelly-o tart sesame snaps. Dessert cotton candy pudding cake bonbon brownie. Gingerbread brownie croissant jelly beans cotton candy I love I love gummies pie. Topping tootsie roll apple pie tootsie roll caramels I love chocolate bar icing I love. Biscuit bear claw muffin candy I love cupcake. Tiramisu cake dragée caramels. I love topping chocolate marshmallow powder. Macaroon chupa chups candy canes liquorice tootsie roll gummies.";
const contactMeText = "Pudding I love chocolate cake fruitcake ice cream ice cream wafer jelly-o muffin. Gummi bears jelly liquorice chocolate dragée brownie cupcake fruitcake donut. Chocolate cake I love I love liquorice liquorice fruitcake danish. Caramels lemon drops candy. Candy canes muffin soufflé lollipop sweet roll I love macaroon caramels pastry. Jujubes I love macaroon bear claw oat cake. Gummies lollipop cake I love marzipan gummi bears I love. Lemon drops candy caramels marzipan danish gummi bears brownie sesame snaps danish. Soufflé brownie tart marzipan croissant sugar plum cake. Dragée gummies soufflé lollipop dessert tiramisu sweet pastry. Gingerbread I love ice cream marzipan cookie. Donut gummies chupa chups soufflé icing. Ice cream I love sweet jelly halvah ice cream sesame snaps gummi bears lemon drops. Gummi bears pudding tiramisu sugar plum.";

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));



// HOME ( dinamic page)
app.get("/posts/:postId", function(req, res) {

  const requestedPostId = req.params.postId;
  console.log("THIS IS  THE ID= " + requestedPostId);

  BlogPost.findById({
    _id: req.params.postId
  }, function(err, dataReturned) {
    res.render("post", {
      postTitle: dataReturned.title,
      postBody: dataReturned.text
    });
  });

});



// ROOT PAGE

app.get("/", function(req, res) {

  BlogPost.find(function(err, dataFound) {
    if (err) {
      console.log("ERROR READING FROM DATABASE.");
    } else {
      res.render("home", {
        startingText: startingText,
        allPosts: dataFound
      })
    }
  });


});
// END OF GET ROOT

// ABOUT
app.get("/about", function(req, res) {
  res.render("about", {
    startingAbout: aboutMeText
  });
});
// END OF ABOUT

// CONTACT
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactMe: contactMeText
  });
});
// END OF CONTACT

//COMPOSE
app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  const testPost = new BlogPost({
    title: req.body.postTitle,
    text: req.body.postBody
  });

  //callback to the save method to only redirect to the home page once save is complete with no errors.
  testPost.save(function(err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log("ERROR SAVING THE POST TO DATABASE!");
    }
  });


});
// END OF COMPOSE

// If no heroku port that use local
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has  started successfully.");
});
