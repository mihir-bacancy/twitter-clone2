const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type:Date,
    default:function() {
      return new Date();
    }
  },
  deletedAt: {
    type: Date,
    default: "",
  },
  updatedAt: {
    type:Date,
    default:function() {
      return new Date();
    },
  },
  updatedBy: {
    type:String,
    ref:'User'
  },
});

var User = module.exports = mongoose.model('users', UserSchema);

module.exports.createUser = function(newUser, callback) {
  newUser.save(callback);
  console.log("User"+newUser);
}
/*
module.exports.getUser = function(query, callback) {
  User.findOne(query, callback);
}
*/


module.exports.getUser = function(query) {
  console.log(query);
  return new Promise((resolve, reject) => {
    User.findOne(query, function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
  })
}

module.exports.updateUser = function(query,condition,callback) {
  return new Promise((resolve, reject) => {
    User.update(query,condition,function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });

  })
}


