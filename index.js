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

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.status(404).end({ error: 'must provide name and number' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, JSON.stringify(person), { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

const unknownEndpoint = (_, res) => {
  return res.status(404).end({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
