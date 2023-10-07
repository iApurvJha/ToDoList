import {} from 'dotenv/config'
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"


const app = express()
//Default port number
const port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}))
mongoose.connect("mongodb+srv://apurvjha302:"+`${process.env.PASSWORD}`+"@cluster0.xcxdkor.mongodb.net/todolistDB")
const db = mongoose.connection

db.on("connected", () => {
  console.log("connected to db")
})
const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please Enter Task name!']

  }
})


const Item = new mongoose.model("item", todoSchema)
const Work = new mongoose.model("Work", todoSchema)

//Task to do regular
const item1 = new Item({
  name: "Buy groceries"
})
const item2 = new Item({
  name: "Walk the dog"
})
const item3 = new Item({
  name: "Read a book"
})

//Task to do for Daily Work
const Work1 = new Item({
  name: "Work 1"
})
const Work2 = new Item({
  name: "Work 2"
})
const Work3 = new Item({
  name: "Work 3"
})


var monthNames = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var monthIndex = new Date().getMonth();
var dayIndex = new Date().getDay();

app.get("/",  (req, res) => {
   Item.find({}, (err, result) => {
    if (err) {
      console.log(`Error ${err}`)
    } else {
        if  (  result.length === 0) {
          Item.insertMany([item1, item2, item3], function (err) {
          if (err) {
            console.log(`Error Occured ${err}`)
          } else {
            console.log("Succesufull inserted items")
          }
        })
      }
    }
    res.render("index.ejs",{
      data:result,
      day:dayNames[dayIndex],
      month:monthNames[monthIndex]
    })
  })
})

app.post("/add", (req, res) => {
  var new_task = req.body.task
  const temp = new Item({
    name: new_task
  })
  Item.insertMany([temp], function (err) {
    if (err) {
      console.log(`Error Occured ${err}`)
    } else {
      console.log("Succesufull inserted items")
    }
  })
  res.redirect("/")
})

app.get("/work", (req, res) => {
  Work.find({}, (err, result) => {
    if (err) {
      console.log(`Error ${err}`)
    } else {
      if (result.length === 0) {
        Work.insertMany([Work1, Work2, Work3], function (err) {
          if (err) {
            console.log(`Error Occured ${err}`)
          } else {
            console.log("Succesufull inserted items")
          }
        })
      }
      res.render("work.ejs",{data:result})
    }
  })
})

app.post("/add/work", (req, res) => {
  var new_task = req.body.task
  const temp = new Work({
    name: new_task
  })
  Work.insertMany([temp], function (err) {
    if (err) {
      console.log(`Error Occured ${err}`)
    } else {
      console.log("Succesufull inserted items")
    }
  })
  res.redirect("/work")
})

app.post("/delete",(req,res)=>{
  Item.findByIdAndRemove(req.body.itemId, (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
    } else {
      console.log('Item deleted successfully:', result);
    }
  });
  res.redirect("/")
})

app.post("/delete/work",(req,res)=>{
  Work.findByIdAndRemove(req.body.itemId, (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
    } else {
      console.log('Item deleted successfully:', result);
    }
  });
  res.redirect("/work")
})

app.listen(port, (req, res) => {
  console.log(`server is listening through ${port}`)
})