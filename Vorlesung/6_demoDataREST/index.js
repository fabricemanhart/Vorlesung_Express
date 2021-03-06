const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-hbs');
const session = require("express-session");

const app = express();
app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(require("cookie-parser")());
app.use(session({ secret: 'casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda', resave: false, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("method-override")(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use("/", require('./routes/indexRoutes.js'));
app.use("/orders", require('./routes/orderRoutes.js'));
app.get("/ajax", function(req, res){
    res.sendFile("/html/ajaxSample.html",  {root: __dirname + '/public/'});
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

hbs.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });
