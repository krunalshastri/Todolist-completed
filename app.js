//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash"); 
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Connect the mongoose
mongoose.connect("mongodb+srv://Admin-KruNULL:1234@cluster0.xoqc4.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useFindAndModify', false);
const todolistSchema = mongoose.Schema(
  {
    name:
    {
      type: String,
      required: true
    }
  }
);

const customSchema = mongoose.Schema(
  {
    name:
    {
      type: String,
      required: true
    },
    customListItems: [todolistSchema]
  }
);

//today's list
const Item = mongoose.model("items", todolistSchema);

//Any custom lists
const customList = mongoose.model("customlists", customSchema);

const welcome = new Item({
  name: "Welcome!!"
});

//Get request on home page i.e today's todolist
app.get("/", function (req, res) {
  Item.find(function (err, finalList) {
    if (err) console.log(err);
    else {
      res.render("list", { listTitle: "Today", upcomingItem: finalList });
    }
  });
});

//Get request on custom list by user
app.get("/:topic", function (req, res) {
  const customListName = _.capitalize(req.params.topic);

  //check if custom list DB is already there or not
  customList.findOne({ name: customListName }, function (err, finalList) {
    if (err) console.log(err);
    else {
      //If not present, Create new DB for that list name
      if (!finalList) {
        //create new list
        const customL1 = new customList(
          {
            name: customListName,
            customListItems: [welcome]
          }
        );
        customL1.save();
        
        res.redirect("/" + customListName);
      }
      //If present, directly render the page
      else {
        //show existing
        res.render("list", { listTitle: customListName, upcomingItem: finalList.customListItems})
      }
    }
  });
});

//Adding the data to diaplay homepage
app.post("/", function (req, res) {
  // console.log(req.body);
  const itemName = req.body.newItem;
  const listName = req.body.list;
  // console.log(listName);

  const I = new Item(
    {
      name: itemName
    }
  );

  if(listName === "Today") {
    I.save();
    res.redirect("/");
  }
  else 
  {
    customList.findOne({name: listName},function(err,finalList)
    {
      if(err) console.log(err);
      else 
      {
        finalList.customListItems.push(I);
        finalList.save();
        res.redirect("/" + listName);
      }
    });
  }

});

app.post('/delete', (req, res) => {
  const deleteItem = req.body.id;
  const listName = req.body.listName;

  if(listName === "Today")
  {
    Item.deleteOne({ _id: deleteItem }, function (err) {
      if (err) console.log(err);
    });
  
    res.redirect("/");
  }
  else 
  {
    customList.findOneAndUpdate({name:listName},{$pull : {customListItems:{_id: deleteItem}}}, function (err)
    {
      if(err) console.log(err);
      else res.redirect("/" + listName);
    });

    
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running.");
});




