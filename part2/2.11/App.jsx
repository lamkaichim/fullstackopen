import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("") 

  useEffect(() => {
    const eventHandler = response => {
      setPersons(response.data)
    }
    const promise = axios.get('http://localhost:3001/persons')
    promise.then(eventHandler)
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value) 

  const handleNumberChange = (event) => setNewNumber(event.target.value) 

  const handleFilterChange = (event) => setFilter(event.target.value) 

  const addName = (event) => {
    event.preventDefault() 
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`) 
      return 
    }

    const person = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    } 

    setPersons(persons.concat(person)) 
    setNewName("") 
    setNewNumber("") 
  } 

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  ) 

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        addName={addName}
      />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} />
    </div>
  ) 
} 

const Filter = ({ filter, onFilterChange }) => (
  <div>
    filter shown with: <input value={filter} onChange={onFilterChange} />
  </div>
) 

const PersonForm = ({ newName, newNumber, onNameChange, onNumberChange, addName }) => (
  <form onSubmit={addName}>
    <div>
      name: <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
) 

const Persons = ({ filteredPersons }) => (
  <div>
    {filteredPersons.map((person) => (
      <p key={person.id}>
        {person.name} {person.number}
      </p>
    ))}
  </div>
) 

export default App 
