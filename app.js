// add all dependecies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();


//add router
const usersRouter = require('./routes/users');


//connect to mongodb
mongoose.connect(process.env.MONGO_CLIENT, { useNewUrlParser: true, useUnifiedTopology: true }).then((value) => {
    console.log(`Connected On ${process.env.MONGO_CLIENT} DataBase`);
}).catch(err => {
    console.log(err);
})

//create template in express
const app = express();

//express midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(({ extended: true })));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + '/public'));


//use router
app.use('/', usersRouter);

// set
app.set('view engine', 'ejs');

app.listen(process.env.PORT, (err) => {
    if (err) console.log(err);
    console.log(`Listening On ${process.env.PORT} Port`);
});