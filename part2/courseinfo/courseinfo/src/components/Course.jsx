const Course = ({ course }) => {
return (
    <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total sum={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
    </div>
)
}

const Header = ({ name }) => <h1>{name}</h1>

const Content = ({ parts }) => {
return parts.map(eachPart => <Part part={eachPart} key={eachPart.id}/>)
}

const Part = ({ part }) => 
<p>
{part.name} {part.exercises}
</p>

const Total = ({ sum }) => <p><strong>Total of {sum} exercises</strong></p>

export default Course