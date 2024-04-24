import { useState, useEffect } from 'react'
import CountriesAPI from './services/CountriesAPI'

const FindCountryForm = ({ countryInput, onChange }) => {
  return(
    <div>
      Find countries: <input value={countryInput} onChange={onChange}/>
    </div>
  )
}

const CountryInfo = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map(eachLanguage => <li key={eachLanguage}>{eachLanguage}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}/>
    </div>
  )
}

const Countries = ({ filteredCountries, countryInput } ) => {
  if (countryInput.length === 0) {
    return (
      <div>
        <p>Enter a country in the search bar above</p>
      </div>
    )
  }

  if (filteredCountries.length > 10) {
    return (
      <div>
        <p>Too many matches, specifiy another filter.</p>
      </div>
    )
  }
  else if (filteredCountries.length === 1) {
    return (
      <CountryInfo country={filteredCountries[0]}/>
    )
  }

  return (
    <div>
      <ul>
        {filteredCountries.map(eachCountry => <li key={eachCountry.name.common}> {eachCountry.name.common} </li>)}
      </ul>
    </div>
  )
}

function App() {
  const [countryInput, setCountryInput] = useState('')
  const [filteredCountries, setfilteredCountries] = useState([])

  useEffect(() => {
    CountriesAPI.getCountries(countryInput)
    .then(response => {
      setfilteredCountries(response)
    })
  }, [countryInput])

  const handleCountryInput = (event) => {
    setCountryInput(event.target.value)
  }

  return (
    <div>
      <FindCountryForm countryInput={countryInput} onChange={handleCountryInput}/>
      <Countries filteredCountries={filteredCountries} countryInput={countryInput}/>
    </div>
  )
}

export default App
