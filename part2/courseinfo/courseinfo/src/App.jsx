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

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return courses.map(eachCourse => <Course course={eachCourse} key={eachCourse.id} />)
}

export default App