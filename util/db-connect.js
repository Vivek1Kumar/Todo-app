var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Todo = new Schema({
  task_id    : String,
  task    : String,
  status : Boolean,
  taskDate:{
  	type: Date,
  	default: Date.now
  }
});

mongoose.model('Todo', Todo);

var mongoUri = process.env.MONGODB_URI || 'mongodb://root:abc123@ds119820.mlab.com:19820/ecommerce';
console.log('making db connect to ', mongoUri);

mongoose.connect(mongoUri, (err) => {
  if (err) console.error(err);
  else console.log('mongo connected to:', mongoUri);
});
