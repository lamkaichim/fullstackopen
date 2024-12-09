const express = require('express')
const app = express()
app.use(express.json())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons/', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const currentTime = new Date() // Get the current date and time
  const phonebookSize = persons.length // Get the number of entries in the phonebook

  const responseText = `
    <div>
      <p>Phonebook has info for ${phonebookSize} people</p>
      <p>${currentTime}</p>
    </div>
  `

  response.send(responseText) // Send the response as HTML
})

app.get('/api/persons/:id', (request, response) => {
  console.log('Request parameters:', request.params); // Debugging request.params
  const id = Number(request.params.id);
  console.log('Parsed ID:', id); // Log the parsed ID

  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(204).send({ error: 'Person not found' });
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})