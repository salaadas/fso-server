const express = require('express');
const app = express();
const findWhat = require('./utils/findWhat');
const idGenerator = require('./utils/idGenerator');

app.use(express.json());

let notes = [
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

let persons = [
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
  res.json(persons);
});

app.get('/info', (_, res) => {
  const numbersOfPeople = persons.length;
  const date = new Date().toString();

  res.send(`
  <div>
    <p>Phonebook has info for ${numbersOfPeople} people</p>
    <p>${date}</p>
  </div>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  const person = findWhat(req.params.id, persons);
  if (!person) {
    res.status(404).end();
  }
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.status(404);
    res.json({ error: 'must provide name and number' });
    res.end();
  }
  if (persons.map((p) => p.name).includes(body.name)) {
    res.status(404);
    res.json({ error: 'name must be unique' });
    res.end();
  }

  const id = idGenerator(
    [persons.length, persons.length * 2],
    persons.map((p) => p.id)
  );

  const newPerson = {
    id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat([newPerson]);
  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
