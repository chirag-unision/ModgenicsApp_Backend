var express = require('express');
const cors = require('cors');
require('dotenv').config()

var app = express();
var port = process.env.PORT || 3100;

// DB Config
const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require('./sequelize');

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

const db= {}; 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users= require('./modals/Users')(sequelize, DataTypes);
db.otps= require('./modals/Otps')(sequelize, DataTypes);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res)=>{
    console.log(req.body);
    res.send('Hey there! This is Modgenics App backend.'+process.env.DB_HOST);
});

//Middleware
function middleDB(req, res, next) {
  req.db = db;
  next();
}

//Routers
const AuthRoute= require('./routes/auth')
const CaptchaRoute= require('./routes/captcha')

// Apis
app.use('/api/auth/', middleDB, AuthRoute);
app.use('/api/captcha/', middleDB, CaptchaRoute);

app.use((req, res) => {
    res.status(404).send('Not found!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
