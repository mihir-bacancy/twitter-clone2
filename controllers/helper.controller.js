let bcrypt = require('bcrypt');

// Compare Hash Password
exports.comparePassword = function (password, data) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, data.password, function (err, res) {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
