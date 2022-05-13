const port = process.env.PORT || 5003;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const https = require('https');
var now = new Date(Date.now());
const express = require('express');
const app = express();

var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

require('dotenv').config();
app.set('view engine', 'ejs');

app.listen(process.env.PORT || 5002, err => {
    if (err) console.log(err)
    console.log('Listening on port: ', process.env.PORT || 5002)
})

app.get('/', (req, res) => {
    res.redirect('/home.html')
})

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));


mongoose.connect("mongodb+srv://kaioh:FftZ53g5udQxjh7D@cluster0.vwaeg.mongodb.net/timelineDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });

const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
const timelineModel = mongoose.model("timelineevents", timelineSchema);

app.get('/timeline/getAllEvents', function (req, res) {
    timelineModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
            console.log("Time" + Date.now());
        }
        res.send(data);
    });
})

app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    timelineModel.create({
        'text': req.body.text,
        'time': req.body.time,
        'hits': req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Insertion successful");
    });
})

app.get('/timeline/delete/:id', function (req, res) {
    // console.log(req.body)
    timelineModel.remove({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Deletion successful");
    });
})


app.get('/timeline/inscreaseHits/:id', function (req, res) {
    // console.log(req.body)
    timelineModel.updateOne({
        '_id': req.params.id
    },{
        $inc: {'hits': 1}
    } ,function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Update successful");
    });
})

app.get('/timeline', function (req, res) {
    timelineModel.find({}, function (err, timelineLogs) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + JSON.stringify(timelineLogs));
        }
        res.send(JSON.stringify(timelineLogs));
    });
})


app.put('/timeline/delete/:id', function (req, res) {
    timelineModel.deleteOne({
        id: req.params.id
    }, function (err, data) {
        if (err) console.log(err);
        else
            console.log(data);
        res.send("Deleted")
    });
})



app.get('/timeline/update/:id', function (req, res) {
    timelineModel.updateOne({
        id: req.params.id
    }, {
        $inc: { hits: 1 }
    }, function (err, data) {
        if (err) console.log(err);
        else
            console.log(data);
        res.send("Updated")
    });
})
