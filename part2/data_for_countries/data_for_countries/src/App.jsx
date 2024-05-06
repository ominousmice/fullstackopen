import { useState, useEffect } from 'react'
import CountriesAPI from './services/CountriesAPI'
import WeatherAPI from './services/WeatherAPI'

const FindCountryForm = ({ countryInput, onChange }) => {
  return(
    <div>
      Find countries: <input value={countryInput} onChange={onChange}/>
    </div>
  )
}

const CountryInfo = ({ country, weather }) => {
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
      <h2>Weather in {country.capital}</h2>
      <p>Temperature: {weather.main.temp} °C</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

const Countries = ({ filteredCountries, countryInput, handleShowCountry, weather } ) => {
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
      <CountryInfo country={filteredCountries[0]} weather={weather}/>
    )
  }

  return (
    <div>
      <ul>
        {filteredCountries.map(eachCountry => {
          return (
            <li key={eachCountry.name.common}>
              {eachCountry.name.common}
              <button onClick={() => handleShowCountry(event, eachCountry.name.common)}>show</button>
            </li>
          )}
        )}
      </ul>
    </div>
  )
}

function App() {
  const [countryInput, setCountryInput] = useState('')
  const [filteredCountries, setfilteredCountries] = useState([])
  const [weather, setWeather] = useState([])

  useEffect(() => {
    CountriesAPI.getCountries(countryInput)
    .then(response => {
      setfilteredCountries(response)
    })
  }, [countryInput])

  useEffect(() => {
    try {
      WeatherAPI.getWeather(filteredCountries[0].capital)
      .then(response => {
        setWeather(response)
      })
      
    }
    catch (error) {
      // if we get an error we ignore it, it just means we don't have any filtered countries
    }
  }, [filteredCountries])

  const handleCountryInput = (event) => {
    setCountryInput(event.target.value)
  }

  const handleShowCountry = (event, country) => {
    setCountryInput(country)
  }

  return (
    <div>
      <FindCountryForm countryInput={countryInput} onChange={handleCountryInput}/>
      <Countries filteredCountries={filteredCountries} countryInput={countryInput}
        handleShowCountry={handleShowCountry} weather={weather}/>
    </div>
  )
}

export default App
