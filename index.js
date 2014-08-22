var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cheerio = require('cheerio')

var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080

var router = express.Router()

router.get('/', function(req, res) {
    res.json({ "message": "No velociraptors." })
})

var whatif = "http://whatif.xkcd.com/",
    blog = "http://blog.xkcd.com"

app.use('/api', router)

app.listen(port)
console.log('API is located on port ' + port)
