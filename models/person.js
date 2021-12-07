const mongoose = require('mongoose');
require('dotenv').config();

const url = `mongodb+srv://super:${process.env.PW}@my-cluster.ew0ya.mongodb.net/phone-book?retryWrites=true&w=majority`;
mongoose
  .connect(url)
  .then(() => console.log('connected'))
  .catch((e) => console.error(e.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
