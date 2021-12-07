const express = require('express');
const app = express();
const findWhat = require('./utils/findWhat');
const idGenerator = require('./utils/idGenerator');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

app.use(cors());

app.use(express.static('build'));

app.use(express.json());

morgan.token('body', (req, _) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
];

const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (_, res) => {
  res.send('hello world');
});

app.get('/api/persons', (_, res) => {
  Person.find({}).then((p) => {
    res.json(p);
  });
});

app.get('/info', (_, res) => {
  const numbersOfPeople = Person.length;
  const date = new Date().toString();

  res.send(`
  <div>
    <p>Phonebook has info for ${numbersOfPeople} people</p>
    <p>${date}</p>
  </div>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end();
  });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.status(404).end({ error: 'must provide name and number' });
  }

  // if (persons.map((p) => p.name).includes(body.name)) {
  //   res.status(404).end({ error: 'name must be unique' });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const unknownEndpoint = (_, res) => {
  return res.status(404).end({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
