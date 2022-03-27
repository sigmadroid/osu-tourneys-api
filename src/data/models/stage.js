const { model, ObjectId, Schema } = require('mongoose');

const schema = new Schema({
    begin: Date,
    end: Date,
    name: String,
    tourney: {
        ref: 'Tourney',
        type: ObjectId
    }
});

module.exports = model('Stage', schema);
