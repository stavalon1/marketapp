const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const csrf = require('csurf');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// USE BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// SET UP VIEWS
app.set('view engine', 'ejs');
app.set('views', 'views');

//MULTER - PATH - UPLOAD FILES
//STEP 1
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname);
    }
})
//2 שימוש בפונקציות של מאלטר
app.use(multer({storage: fileStorage, limits: {fileSize: 25033697}}).array('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));

//1
const csrfProtection = csrf();

const mongo_uri = 'mongodb+srv://fridayUser:8ofR97IIn8j8rILo@fridaycluster.vcaf3.mongodb.net/new_marketdb?retryWrites=true&w=majority';
const store = new MongoDBStore({
    uri: mongo_uri,
    collection: 'sessions'
})

app.use(session({
    secret: 'NOgbQtQglfnYJXOJAJRZvA5vjc6iQPts',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use((request, response, next) => {
    if(!request.session.account){
        return next();
    }
    account.findById(request.session.account._id)
    .then(account => {
        request.account = account;
        next();
    })
    .catch(error => console.log(error));
})
app.use(csrfProtection);

//2
app.use((request, response,next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
})

const indexController = require('./controllers/index');
app.use('/',indexController);



const port = 6060;
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(database_connect_results => {
    console.log(database_connect_results);
    app.listen(port, function(){
        console.log(`Server is running via ${port}`);
    });
})
.catch(error => console.log(error))
