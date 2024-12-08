import { useState, useEffect } from 'react'
import PersonsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("") 

  useEffect(() => {
    PersonsService.getAll().then(response=>{setPersons(response.data)})
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
    PersonsService.create(person).then(response => {
      setPersons(persons.concat(response.data))
      setNewName("") 
      setNewNumber("") 
    })
  } 

  const deletePerson = (id, name) =>{
    if (window.confirm(`Detele ${name}?`)){
      PersonsService.remove(id)
      .then(()=>{
        setPersons(persons.filter((person)=>person.id !== id))
      })
      .catch((error)=>{
        console.error(`Failed to delete person with id ${id}:`, error)
        alert(`Information of ${name} has already been removed from server`)
      })
    }
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
      <Persons filteredPersons={filteredPersons} onDelete={deletePerson} />
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

const Persons = ({ filteredPersons,onDelete  }) => (
  <div>
    {filteredPersons.map((person) => (
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person.id, person.name)}>Delete</button>
      </p>
    ))}
  </div>
) 


export default App 
