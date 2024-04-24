import axios from 'axios'

const allCountriesURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getCountries = (filter) => {
    return (
        axios.get(allCountriesURL)
        .then(response => {
            const allCountries = response.data
            const filteredCountries = allCountries.filter(country => {
                return(
                    country.name.common.toLowerCase().includes(filter.toLowerCase())
                )
            })
            return filteredCountries
        })
    )
}

export default { getCountries }