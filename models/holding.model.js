const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const holdingSchema = new mongoose.Schema({
  holding_id        : { type : Number , unique : true , index : true},
  user_id           : { type: Number, index : true},
  data              : { type: String},
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

holdingSchema.plugin(AutoIncrement, { inc_field: 'holding_id' });

module.exports = mongoose.model('Holdings', holdingSchema, 'Holdings');
