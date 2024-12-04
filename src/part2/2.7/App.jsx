import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }])
  const [newName, setNewName] = useState("")

  const handleNoteChange = (event) => {
    setNewName(event.target.value)
  };

  if (persons.some((person) => person.name === newName)) {
    alert(`${newName} is already added to phonebook`)
  }

  const addName = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
    };
    setPersons(persons.concat(person))
    setNewName("")
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNoteChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons.map((person) => (
        <p key={person.name}>{person.name}</p>
      ))}
    </div>
  )
}

export default App;
