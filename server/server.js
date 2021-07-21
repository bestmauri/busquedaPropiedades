const http = require('http')
    , bodyParser = require('body-parser')
    , express = require('express')
    , cors = require('cors')
    , routes = require('./busqueda');

const port = process.env.PORT ||  3000,
      app = express(),
      server = http.createServer(app);

app.use(cors());

routes(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

server.listen(port, () => {
    console.log("Listening on port " + port);
});
