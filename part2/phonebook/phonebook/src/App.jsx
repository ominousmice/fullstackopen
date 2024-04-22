import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import peopleService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    peopleService.getAll()
      .then(allPeople => setPersons(allPeople))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.filter(person => person.name === newName).length === 0) {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      peopleService.create(newPerson)
        .then(response => setPersons(persons.concat(newPerson)))

    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.filter(person => person.name === newName)[0]
        peopleService.updateNumber(person, newNumber)
          .then(updatedPerson => {
            const newPersonArray = persons.map(eachPerson => eachPerson.id === updatedPerson.id ? updatedPerson : eachPerson)
            setPersons(newPersonArray)
          }
        )
      }
    }
    
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const onDelete = (event, person) => {
    if (window.confirm(`Do you want to delete ${person.name}?`)) {
      peopleService.deletePerson(person.id)
        .then(
          setPersons(persons.filter(eachPerson => eachPerson.id !== person.id))
        )
    }
  }

  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange}/>
      
      <h3>Add a new person</h3>
      <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handleNameChange} 
        numberValue={newNumber} numberOnChange={handleNumberChange}/>

      <h3>Numbers</h3>
      <Persons people={peopleToShow} onDelete={onDelete}/>
    </div>
  )
}

export default App