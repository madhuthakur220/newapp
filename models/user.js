var mongoose = require("mongoose");
var Schema = mongoose.Schema; // Note the capital 'S' in 'Schema'

var userSchema = new Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  currentDate: {
    type: Date,
    default: Date.now,
  },
});
//

module.exports = mongoose.model("user", userSchema);
