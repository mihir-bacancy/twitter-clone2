const mongoose = require('mongoose')
// var bcrypt = require('bcrypt')

var FollowSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  following: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: function () {
      return new Date()
    }
  }

})

var Follow = module.exports = mongoose.model('follow', FollowSchema)

module.exports.follow = function (newFollow, callback) {
  newFollow.save(callback)
}

module.exports.checkFollow = function (query) {
  return new Promise((resolve, reject) => {
    console.log(query)
    Follow.findOne(query, function (err, data) {
      if (err) {
        reject(err)
      }
      console.log('Datattttttt', data)
      resolve(data)
    })
  })
}

module.exports.updateFollow = function (query, condition) {
  return new Promise((resolve, reject) => {
    Follow.update(query, condition, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports.getFollowersCount = function (user) {
  // console.log(user);
  return new Promise((resolve, reject) => {
    Follow.count(user, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports.getFollowingList = function (user) {
  // console.log(user);
  return new Promise((resolve, reject) => {
    Follow.find(user, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}
