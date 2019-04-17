const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors())

const server = require('http').Server(app);

// Arquivos em tempo real para todos os dispositivos do usuário
const io = require('socket.io')(server);
io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    })
});

//Banco de dados Mongo
mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-ljce9.mongodb.net/omnistack?retryWrites=true', { useNewUrlParser: true });

app.use((req, res, next) => {
    req.io = io;
    return next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

require('./app/controllers/AuthController')(app)
require('./app/controllers/ProjectController')(app)

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')))

app.use(require('./routes'))


server.listen(process.env.PORT || 3333)