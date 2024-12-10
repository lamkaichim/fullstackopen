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
  const id = Number(request.params.id);

  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(204).send({ error: 'Person not found' });
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000); // 生成一个 0 到 999999 的随机整数
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})