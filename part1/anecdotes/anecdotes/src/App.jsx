import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  // Every time the page is reloaded, a random anecdote is shown
  const randomIndex = Math.floor(Math.random() * anecdotes.length)
  const [selected, setSelected] = useState(randomIndex)

  // Create a 0-filled array to keep track of points for each anecdote
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length))

  // The initial state is selected because all anecdotes have 0 votes anyway
  const [mostVotedAnecdote, setMostVotedAnecdote] = useState(selected)

  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const handleVote = () => {
    const pointsCopy = {...points}
    pointsCopy[selected]++
    setPoints(pointsCopy)
    updateMostVotedAnecdote(pointsCopy)
  }

  const updateMostVotedAnecdote = (updatedPoints) => {
    console.log("update most voted anecdote called")
    console.log(updatedPoints)

    let maxValue = 0

    for (let i in updatedPoints) {
      if (updatedPoints[i] > maxValue) {
        maxValue = updatedPoints[i]
      }
    }

    console.log("maxvalue ", maxValue)

    if (updatedPoints[selected] >= maxValue) {
      setMostVotedAnecdote(selected)
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>Has {points[selected]} votes</p>
      <Button onClick={handleVote} text="vote"/>
      <Button onClick={handleNextAnecdote} text="next anecdote"/>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVotedAnecdote]}</p>
    </div>
  )
}

export default App