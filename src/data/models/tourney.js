const { model, Schema } = require('mongoose');

const schema = new Schema({
    maxRank: Number,
    minRank: Number,
    mode: String,
    name: String
});

module.exports = model('Tourney', schema);
