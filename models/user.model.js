const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = mongoose.Schema({
    userId        : { type : Number , unique : true , index : true},
    username      : { type : String , lowercase : true , unique : true , index : true},
    email         : { type : String , unique : true , index : true},
    phone         : { type : String , unique : true , index : true},
    password      : { type : String },
    ip            : { type : String , default : "" },
    browser       : { type : String , default : "" },
    os            : { type : String , default : "" },
    is_active     : { type : Number , default : 1 , enum : [0,1] }, // 1 - Active , 0 - Deactive
    is_verified   : { type : Number , default : 1 , enum : [0,1] }, // 1 - Verify , 0 - Unverify
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

UserSchema.plugin(AutoIncrement, { inc_field: 'userId' });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Users', UserSchema, 'Users');
