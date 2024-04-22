const Persons = ({ people, onDelete }) => {
    return (
        <div>
        { people.map((person) => <Person person={person} key={person.name} onDelete={onDelete}/>) }
        </div>
    )
}

const Person = ({ person, onDelete }) => {
    return (
        <p> {person.name} {person.number} <button onClick={() => onDelete(event, person)}> delete </button></p>
    )
}

export default Persons