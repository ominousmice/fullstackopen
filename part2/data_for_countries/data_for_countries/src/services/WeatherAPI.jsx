import axios from 'axios'

const weatherURL = 'http://api.openweathermap.org/data/2.5/weather'
const key = import.meta.env.VITE_SOME_KEY

const geoURL = 'http://api.openweathermap.org/geo/1.0/direct'

const getWeather = (city) => {
    let lat, lon;
    
    return(
        getLatLon(city)
        .then(response => {
                lat = response[0]
                lon = response[1]
            }
        )
        .then(() => {
            return (
                axios.get(`${weatherURL}?lat=${lat}&lon=${lon}&units=metric&appid=${key}`)
                .then(response => {
                        return (response.data)
                    }
                )
            )
        })
    )
}

const getLatLon = (city) => {
    return (
        axios.get(`${geoURL}?q=${city}&appid=${key}`)
        .then(response => {
            return ([response.data[0].lat, response.data[0].lon])
            }
        )
    )
}

export default { getWeather }