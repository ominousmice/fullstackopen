import { useState } from 'react'

const AllPeople = ({ people }) => {
  return (
    <div>
      { people.map((person) => <p key={person.name}> {person.name} </p>) }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log(persons.filter(person => person.name === newName).length > 0)
    if (persons.filter(person => person.name === newName).length === 0) {
      const newPerson = {
        name: newName
      }
      setPersons(persons.concat(newPerson))
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <AllPeople people={persons}/>
    </div>
  )
}

export default App