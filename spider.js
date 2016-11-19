/**
 * Created by hao.cheng on 2016/11/19.
 */
let superagent = require('superagent'),
    cheerio = require('cheerio'),
    eventproxy = require('eventproxy'),
    assert = require('assert'),
    async = require('async'),
    mongo = require('./mongo');

const URL = 'https://movie.douban.com/j/chart/top_list?type=17&interval_id=100%3A90&action=&start=0&limit=20';
let start = () => {
    superagent.get(URL)
        .end((err, res) => {
            let _pageUrls = [];
            res.body.forEach((val) => {
               _pageUrls.push(val.url);
            });
            ep.emit('pageUrls', _pageUrls);
        })
};

let ep = eventproxy.create('pageUrls', (pageUrls) => {
    let _http = (url, callback) => {
        let _delay = parseInt((Math.random() * 30000000) % 1000, 10);
        superagent.get(url)
            .end((err, res) => {
                var $ = cheerio.load(res.text);
                var _data = {title:'', type: '', directories: '', scriptwriter: '', actors: ''};
                //好久没有过选择器了，凑合吧~-_-!。可以自己随意添加想要的数据
                _data.title = $('#content h1 span').text();
                _data.directories = $('#info .attrs').eq(0).text();
                _data.scriptwriter = $('#info .attrs').eq(1).text();
                _data.actors = $('#info .attrs').eq(2).text();
                $('span[property="v:genre"]').each(function (index) {
                    _data.type += ($(this).text() + (index == $('span[property="v:genre"]').length - 1 ? '' : '、'));
                });
                mongo.Film.create(_data, (err, doc) => {
                    assert.equal(err, null);
                    console.log(doc);
                });
            });
        setTimeout(() => {
            callback(null, url);
        }, _delay);
    };

    async.mapLimit(pageUrls, 3, (url, callback) => {
        _http(url, callback);
    }, (err, res) => {
        assert.equal(err, null);
    })
});
module.exports = {start: start};