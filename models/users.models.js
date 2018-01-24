const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
   img: {
     data: Buffer, contentType: String, required: false,
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

module.exports. createUser = function(newUser, callback) {
  console.log("newUser.>>>>>.",newUser)
  bcrypt.genSalt(10, function(err, salt) {
    return bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
      console.log("User"+newUser);
    });
});
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
  console.log(">>>>");
  return new Promise((resolve, reject) => {
    User.update(query,condition,function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });

  })
}

module.exports.updateProfile = function(query, name, img, pw, email){
  return new Promise((resolve, reject) => {

    User.update(query, { $set : {name : name, img : img, email : email}}, function(err ,data) {
      if(err) {
        reject(err);

      }
      else{
         console.log("data inserted")
      }
        resolve(data);
    });
  });
}

module.exports.searchUser = function(query) {
  console.log(query);
  return new Promise((resolve, reject) => {
    User.find(query, function(err ,data) {
      if(err) {
        reject(err);
      }
      resolve(data);
    });
  })
}

module.exports.follow = function(newUser, callback) {

  newUser.save(function (err) {
  if (err) return handleError(err);

  follwer.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});
     // newUser.save(callback);

}

