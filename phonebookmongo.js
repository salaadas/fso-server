const mongoose = require('mongoose');

const password = process.argv[2];

const url = `mongodb+srv://super:${password}@my-cluster.ew0ya.mongodb.net/phone-book?retryWrites=true&w=majority`;
mongoose.connect(url);

const main = async () => {
  const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
  });

  const Person = mongoose.model('Person', personSchema);

  const addPerson = async () => {
    const newPerson = new Person({
      name: process.argv[3],
      number: parseInt(process.argv[4]),
    });

    const result = await newPerson.save();
    console.log('added', result.name, 'number', result.number, 'to phonebook');
  };

  const defaultHandle = () => {
    console.log('node phonebookmongo.js <mongopw> <yourname> <yournumber>');
    process.exit(1);
  };

  const getAllPerson = async () => {
    const allPersons = await Person.find({});
    console.log('phonebook:');
    allPersons.forEach((p) => console.log(p.name, p.number));
  };

  switch (process.argv.length) {
    case 3:
      await getAllPerson();
      break;
    case 5:
      await addPerson();
      break;
    default:
      defaultHandle();
  }
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(() => mongoose.connection.close());
