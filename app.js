<<<<<<< HEAD
const express = require("express");
const app = express();
const mongoose = require('mongoose')
require('dotenv').config()

const cors = require('cors')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (err) => console.log(err));
db.once('open', () => console.log("connected to db"))
app.use(cors({
  origin: 'http://localhost:4000'
}))
app.use(express.json())

const subscriberRouter = require("./routes/subscribers.js")
app.use('/subscribers', subscriberRouter)


app.listen(3000, () => {
  console.log("server started " + new Date().toString());
});


=======
// example, 
// http://localhost:3000/?message=The message&number=447484760450&subject=SEANWASERE

const express = require('express');
const app = express();
require('dotenv').config();

var AWS = require('aws-sdk');

app.get('/', (req, res) => {

    console.log("Message = " + req.query.message);
    console.log("Number = " + req.query.number);
    console.log("Subject = " + req.query.subject);
    var params = {
        Message: req.query.message,
        PhoneNumber: '+' + req.query.number,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': req.query.subject
            }
        }
    };

    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then(
        function (data) {
            res.end(JSON.stringify({ MessageID: data.MessageId }));
        }).catch(
            function (err) {
                res.end(JSON.stringify({ Error: err }));
            });

});

app.listen(3000, () => console.log('SMS Service Listening on PORT 3000'))
>>>>>>> c76ba5d (initial commit)
