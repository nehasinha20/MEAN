const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const dbConfig = require('./config/db.config');
const authenticate = require('./authenticate');

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database.', err);
    process.exit();
});

mongoose.Promise = global.Promise

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../dist')))

// Require Users routes
const userRoutes = require('./routes/user.routes')
const loginRoutes = require('./routes/login.routes')
// using as middleware

app.use('/api/users', authenticate, userRoutes)
app.use('/api', loginRoutes)


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../dist/index.html'))
})

server.listen(3000, () => console.log("Listening on port 3000..."))