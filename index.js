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

router.get('/xkcd', function(req, res) {
    request(xkcd + '/info.0.json', function(err, resp, body) {
        if(err) {
            res.json({ "message": err.message })
            return
        }
        var info = JSON.parse(body)
        var json = { "num": info["num"] }
        res.json(json)
    })
})

router.get('/xkcd/:id', function(req, res) {
    request(xkcd + '/' + req.params.id + '/info.0.json', function(err, resp, body) {
        if(err) {
            res.json({ "message": err.message })
            return
        }
        res.json(body)
    })
})

router.get('/whatif', function(req, res) {
    request(whatif, function(err, resp, body) {
        if(err) {
            res.json(resp.statusCode, { "message": err.message })
            return
        }
        $ = cheerio.load(body)
        var num = parseInt($('article.entry > a').attr('href').split('/')[3])
        res.json({ "num": num })
    })
})

router.get('/whatif/:id', function(req, res) {
    request(whatif + '/' + req.params.id, function(err, resp, body) {
        if(err) {
            res.json(resp.statusCode, { "message": err.message })
            return
        }
        $ = cheerio.load(body)
        var entry = $('article.entry'),
            title = $('article.entry > a > h1').text()
            question = $('p#question'),
            attribute = $('p#attribute'),
            content = $('article.entry > p'),
            images = $('img.illustration'),
            layout = [],
            contemp = [],
            imgtemp = []

        content.each(function(index, element) {
            element = $(element)
            if(element !== question && element !== attribute)
                contemp.push(element.text().replace(/\n/, ' '))
        })
        content = contemp

        images.each(function(index, element) {
            imgtemp.push($(element).attr('src'))
        })
        images = imgtemp

        entry.children().each(function(index, element) {
            element = $(element)
            if(element.is('p'))
                layout.push('p')
            else if(element.is('img'))
                layout.push('img')
        })

        question = question.text()
        attribute = attribute.text()

        var json = {}
        json["title"] = title
        json["question"] = question
        json["attribute"] = attribute
        json["content"] = content.join('_')
        json["images"] = images.join(', ')
        json["layout"] = layout.join(', ')

        json = JSON.parse(JSON.stringify(json).replace(/\\n/g, ' '))

        res.json(json)
    })
})

var xkcd = 'http://xkcd.com'
    whatif = 'http://whatif.xkcd.com',
    blog = 'http://blog.xkcd.com'

app.use('/api', router)

app.listen(port)
console.log('API is located on port ' + port)
