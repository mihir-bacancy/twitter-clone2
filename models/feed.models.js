const mongoose = require('mongoose');


var feedSchema = mongoose.Schema({
  username: {
    type: String,
  },
  tweet: {
    type: String,
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

});

var Feed = module.exports = mongoose.model('feed', feedSchema);

module.exports.createTweet = function(newTweet, callback) {
    newTweet.save(callback);
  }


module.exports.getTweet = function(query) {
  return new Promise((resolve, reject) => {


    Feed.find(query, function(err ,data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  })
}


// module.exports.updateFollow = function(query,condition) {

//   return new Promise((resolve, reject) => {
//     Follow.update(query,condition,function(err ,data) {
//       if (err) {
//         reject(err);
//       }
//       resolve(data);
//     });

//   })
// }

// module.exports.getFollowers = function(user, callback) {
//   // console.log(user);
//   return new Promise((resolve, reject) => {
//   Follow.count(user, function(err ,data) {
//     if (err) {
//       reject(err);
//     }
//     resolve(data);
//   });
//   })
// }

