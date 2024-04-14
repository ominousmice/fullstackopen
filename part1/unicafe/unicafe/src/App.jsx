import { useState } from 'react'

// Button component
const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}> {text} </button>
  )
}

// Statistics component
const Statistics = ({ good, neutral, bad, total, avg, positive }) => {
  if (total === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="total" value={total}/>
      <StatisticLine text="average" value={avg}/>
      <StatisticLine text="positive" value={positive}/>
    </div>
  )
}

// StatisticLine component
const StatisticLine = ({text, value}) => {
  if (text === "positive") {
    return <p>{text} {value}%</p>
  }
  return <p>{text} {value}</p>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [avg, setAvg] = useState(0)
  const [positive, setPositive] = useState(0)

  // Event handlers for the buttons
  const HandleGoodClick = () => {
    const updatedTotal = total + 1
    const updatedGood = good + 1
    setGood(good + 1)
    UpdateTotal()
    CalculateAvg(updatedGood, bad, updatedTotal)
    CalculatePositive(updatedGood, updatedTotal)
  }

  const HandleNeutralClick = () => {
    const updatedTotal = total + 1
    setNeutral(neutral + 1)
    UpdateTotal()
    CalculateAvg(good, bad, updatedTotal)
    CalculatePositive(good, updatedTotal)
  }

  const HandleBadClick = () => {
    const updatedTotal = total + 1
    const updatedBad = bad + 1
    setBad(bad + 1)
    UpdateTotal()
    CalculateAvg(good, updatedBad, updatedTotal)
    CalculatePositive(good, updatedTotal)
  }

  // Updates the total number of collected feedback
  const UpdateTotal = () => {
    setTotal(total + 1)
  }

  // Calculates the average score
  const CalculateAvg = (updatedGood, updatedBad, updatedTotal) => {
    setAvg((updatedGood - updatedBad) / updatedTotal)
  }

  // Calculates the percentage of positive feedback
  const CalculatePositive = (updatedGood, updatedTotal) => {
    setPositive(updatedGood / updatedTotal * 100)
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button text="good" onClick={HandleGoodClick}/>
      <Button text="neutral" onClick={HandleNeutralClick}/>
      <Button text="bad" onClick={HandleBadClick}/>

      <Statistics good={good} neutral={neutral} bad={bad}
        total={total} avg={avg} positive={positive}/>
    </div>
  )
}

export default App