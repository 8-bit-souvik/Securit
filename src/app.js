const express = require('express');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');



const app = express();
app.use(cookieParser());

app.use(cors());

//body parser middleware 
const { urlencoded } = require('express');
app.use(express.json());
app.use(urlencoded({extended: false}));

app.set('views', path.join(__dirname, './../views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use("/public",express.static(__dirname + './../public'))

//routes
app.use('/', require('./template'));

app.use("/user", require('./user') );

app.use("/*", (req, res) => {
    res.status(404).send(`<br><br><h1 style="text-align: center;">404 || content not found</h1>`);
    
});

const PORT =  5510 ; 

app.listen(PORT, () => { console.log(`server started ar PORT number ${PORT}`)})