/**
 * Created by hao.cheng on 2016/11/19.
 */
let fs = require('fs'),
    assert = require('assert'),
    mongo = require('./mongo');

let jsonFile = () => {
    mongo.Film.find({}, (err, docs) => {
        fs.writeFile('./data.json', JSON.stringify(docs), (err) => {
            assert.equal(err, null);
        })
    });
};
jsonFile();
