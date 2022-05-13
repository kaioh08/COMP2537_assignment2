const timelineLink = `http://localhost:5002`
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
const mongoose = require('mongoose');

app.listen(process.env.PORT || 5002, err => {
    if (err) console.log(err)
    console.log('Listening on port: ', process.env.PORT || 5002)
})

app.get('/', (req, res) => {
    res.redirect('/home.html')
})

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}))

// [READ] all timelineDB events and render timeline.ejs
app.get("/timeline", (req, res) => {
    eventModel.find({}, (err, events) => {
        if (err) {
            console.log(err);
        }
        res.render("timeline", {
            "events": events
        })
    })
})
app.get("/events/readAllEvents", (req, res) => {
    eventModel.find({}, (err, events) => {
        if (err) {
            console.log(err)
        }
        res.json(events)
    })
})

// [CREATE] a new event and insert it to the timelineDB
app.put("/events/insertEvent", (req, res) => {
    console.log(req.body);
    eventModel.create({
        text: req.body.text,
        date: req.body.date,
        time: req.body.time,
        hits: req.body.hits
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.send("Created successfully")
    })
})

// [UPDATE] the `hits` field of an event in the timelineDB
app.get("/events/incrementHits/:id", (req, res) => {
    eventModel.updateOne(
        {_id: req.params.id},
        {$inc: {hits: 1}}, (err, data) => {
            if (err) {
                console.log(err);
            }
            res.send("Incremented successfully")
        })
})

// [DELETE] an event from timelineDB
app.get("/events/deleteEvent/:id", (req, res) => {
    eventModel.deleteOne({_id: req.params.id}, (err, data) => {
        if (err) {
            console.log(err);
        }
        res.send("Deleted successfully")
    })
})

// entry point
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server active on port ${port}!`);
    }
});
