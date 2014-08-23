var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cheerio = require('cheerio')

var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080

var router = express.Router()

var text = function(element) {
    return element
        .clone()
        .children()
        .remove()
        .end()
        .text()
}

router.get('/', function(req, res) {
    res.json({ "message": "No velociraptors." })
})

router.get('/xkcd', function(req, res) {
    request(xkcd + 'info.0.json', function(err, resp, body) {
        if(err) {
            res.json(resp.statusCode, { "message": err.message })
            return
        }
        var info = JSON.parse(body)
        var json = { "num": info["num"] }
        res.json(json)
    })
})

router.get('/xkcd/:id', function(req, res) {
    request(xkcd + req.params.id + '/info.0.json', function(err, resp, body) {
        if(err) {
            res.json(resp.statusCode, { "message": err.message })
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
    request(whatif + req.params.id, function(err, resp, body) {
        if(err) {
            res.json(resp.statusCode, { "message": err.message })
            return
        }
        $ = cheerio.load(body)
        var entry = text($('article#entry')),
            title = text(entry.children('a').first().children()),
            question = text(entry.children('p#question')),
            attribute = text(entry.children('p#attribute')),
            content = entry.children('p'),
            images = entry.children('img.illustration'),
            layout = [],
            contemp = [],
            imgtemp = []
        content.each(function(index, element) {
            if(element !== question && element !== attr)
                contemp.push(text(element))
        })
        images.each(function(index, element) {
            imgtemp.push(element.attr('src'))
        })
        images = temp

        entry.children().each(function(index, element) {
            if(element.prop('tagName') === 'p')
                layout.push('p')
            else(element.prop('tagName') === 'img')
                layout.push('img')
        })

        json = {}
        json["title"] = title
        json["question"] = question
        json["attribute"] = attribute
        json["content"] = content.join('\n')
        json["images"] = images.join(', ')

        res.json(json)
    })
})

var xkcd = 'http://xkcd.com/'
    whatif = 'http://whatif.xkcd.com/',
    blog = 'http://blog.xkcd.com/'

app.use('/api', router)

app.listen(port)
console.log('API is located on port ' + port)
