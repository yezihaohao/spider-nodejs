/**
 * Created by hao.cheng on 2016/11/19.
 */
let mongoose = require('mongoose'),
    assert = require('assert'),
    Schema = mongoose.Schema,

    filmSchema = new Schema({
        title: String,
        type: String,
        directories: String,
        scriptwriter: String,
        actors: String
    }),

    Film = mongoose.model('Film', filmSchema)
    ;

let db = mongoose.connect('mongodb://127.0.0.1:27017/myproject');
db.connection.on('error', (err) => {
    console.log(`数据库连接失败：${err}`);
});
db.connection.on('open', () => {
    console.log('数据库连接成功');
});
// let FilmEntity = new Film({title: 'test'});
// FilmEntity.save((err, doc) => {
//     assert.equal(err, null);
//     console.log(doc);
// });

// Film.find({}, (err, docs) => {
//     console.log(docs);
// });
// Film.create({title: '12345', type: '喜剧'}, (err, doc) => {
//     console.log(doc);
// });
module.exports = {Film: Film};