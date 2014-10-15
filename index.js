var express = require('express'),
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 8080,
    bodyParser = require('body-parser'),
    request = require('request'),
    cheerio = require('cheerio')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    console.log('Time: %d -> %s', Date.now(), req.path)
    next()
})

var getText = function(element) {
    return element
        .clone()
        .children('sup, span.ref')
        .remove()
        .end()
        .text()
}

router.get('/xkcd/:id?', function(req, res) {
    request(xkcd + (!req.params.id ? '' : '/' + req.params.id) + '/info.0.json', function(err, resp, body) {
        if(err) {
            res.json({ "message": err.message })
            return
        }
        res.json(JSON.parse(body.replace(/\\n/g, ' ')))
    })
})

router.get('/whatif/:id?', function(req, res) {
    request(whatif + (!req.params.id ? '' : '/' + req.params.id), function(err, resp, body) {
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
            alt = [],
            layout = [],
            temp = []

        content.each(function(index, element) {
            element = $(element)
            if(element.attr('id') !== "question" &&
                    element.attr('id') !=="attribute")
                temp[index] += (getText(element))
        })
        content = temp.slice(0)
        temp = []

        images.each(function(index, element) {
            temp.push(whatif + $(element).attr('src'))
            alt.push($(element).attr('title'))
        })
        images = temp.slice(0)
        temp = []

        entry.children().each(function(index, element) {
            element = $(element)
            if(element.is('p'))
                layout.push('p')
            else if(element.is('img'))
                layout.push('img')
        })

        question = getText(question)
        attribute = getText(attribute)

        res.json(JSON.parse(JSON.stringify(
            {
                "title": title,
                "question": question,
                "attribute": attribute,
                "content": content.join('|'),
                "img": images.join('|'),
                "alt": alt.join('|'),
                "layout": layout.join('|')
            }
        ).replace(/\\n/g, ' ') //random undefined statements
    })
})

router.get('/blog', function(req, res) {
    request(blog, function(err, resp, body) {
        if(err) {
            res.json(resp.statusCode, { "message": err.message() })
            return
        }
        $ = cheerio.load(body)
        var article = String($('article.post').attr('id'))
        article = article.substring(article.indexOf('post-') + 'post-'.length)
        res.json({ "num": parseInt(article)})
    })
})

var xkcd = 'http://xkcd.com'
    whatif = 'http://whatif.xkcd.com',
    blog = 'http://blog.xkcd.com'

app.use('/api', router)
app.use('/stylesheets', express.static('stylesheets'))

app.listen(port)
console.log('API is located on port ' + port)
