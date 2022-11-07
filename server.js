const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://bellw10:freshman11@cluster0.rp9us5a.mongodb.net/Savage_auth?retryWrites=true&ssl=true&authSource=admin";
const dbName = "Savage_auth";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('photobooth').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {photobooth: result})
  })
})

app.post('/add', (req, res) => {
  db.collection('photobooth').insertOne({name: req.body.name, cohort: req.body.cohort, msg: req.body.msg}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/update', (req, res) => {
  db.collection('photobooth')
  .findOneAndUpdate({name: req.body.name, cohort: req.body.cohort, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/delete', (req, res) => {
  db.collection('photobooth').findOneAndDelete({name: req.body.name, cohort: req.body.cohort, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
