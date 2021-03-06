const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://super:${password}@my-cluster.ew0ya.mongodb.net/note-app?retryWrites=true&w=majority`;
mongoose.connect(url);

const main = async () => {
  const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
  });

  const Note = mongoose.model('Note', noteSchema);

  const myNote = new Note({
    content: 'eoivweo',
    date: new Date().toISOString(),
    important: true,
  });

  myNote
    .save()
    .then((saved) => saved.toJSON())
    .then((savedAndFormatted) => {
      res.json(savedAndFormatted);
    })
    .catch((err) => next(err));

  console.log('all notes', allNotes);
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(() => {
    mongoose.connection.close();
  });
