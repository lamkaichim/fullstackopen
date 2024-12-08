import { useState, useEffect } from 'react'
import PersonsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    PersonsService.getAll()
      .then((response) => {
        setPersons(response.data)
      })
      .catch((error) => {
        console.error("Failed to fetch persons:", error)
        showNotification("Failed to load data. Please try again.", "error")
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setFilter(event.target.value)

  const addName = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        PersonsService.update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === existingPerson.id ? response.data : person
              )
            )
            setNewName("")
            setNewNumber("")
            showNotification(`Updated ${response.data.name}'s number`, "success")
          })
          .catch((error) => {
            console.error(`Failed to update person with id ${existingPerson.id}:`, error)
            if (error.response && error.response.status === 404) {
              alert(`Information of ${newName} has already been removed from server`)
              setPersons(persons.filter((person) => person.id !== existingPerson.id))
            }
            showNotification(`Failed to update ${newName}`, "error")
          })
      }
      return
    }

    const person = { name: newName, number: newNumber }

    PersonsService.create(person)
      .then((response) => {
        setPersons(persons.concat(response.data))
        setNewName("")
        setNewNumber("")
        showNotification(`Added ${response.data.name}`, "success")
      })
      .catch((error) => {
        console.error("Error creating person:", error)
        showNotification("Failed to add person. Please try again.", "error")
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      PersonsService.remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          showNotification(`Deleted ${name}`, "success")
        })
        .catch((error) => {
          console.error(`Failed to delete person with id ${id}:`, error)
          if (error.response && error.response.status === 404) {
            alert(`Information of ${name} has already been removed from server`)
            setPersons(persons.filter((person) => person.id !== id))
          }
          showNotification(`Failed to delete ${name}`, "error")
        })
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000) // Show notification for 5 seconds
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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

const Notification = ({ notification }) => {
  if (!notification.message) {
    return null
  }

  const notificationStyle = {
    color: notification.type === "success" ? "green" : "red",
    background: "lightgrey",
    fontSize: "20px",
    border: `2px solid ${notification.type === "success" ? "green" : "red"}`,
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  }

  return <div style={notificationStyle}>{notification.message}</div>
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

const Persons = ({ filteredPersons, onDelete }) => (
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
