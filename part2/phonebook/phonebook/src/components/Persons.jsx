const Persons = ({ people }) => {
    return (
        <div>
        { people.map((person) => <Person person={person} key={person.name}/>) }
        </div>
    )
}

const Person = ({ person }) => {
    return (
        <p> {person.name} {person.number}</p>
    )
}

export default Persons