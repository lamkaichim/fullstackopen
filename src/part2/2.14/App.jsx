import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null) // 新增天气数据状态

  const api_key = process.env.REACT_APP_API_KEY

  // 获取所有国家信息
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching countries data:', error)
      })
  }, [])

  // 根据搜索关键词过滤国家
  useEffect(() => {
    if (search === '') {
      setFilteredCountries([])
    } else {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredCountries(filtered)
    }
  }, [search, countries])

  // 获取天气信息
  useEffect(() => {
    if (selectedCountry) {
      const capital = selectedCountry.capital[0]
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

      axios.get(apiUrl)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
    }
  }, [selectedCountry, api_key])

  // 处理输入变化
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  // 显示某个国家的详细信息
  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  // 渲染国家信息
  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, please specify another filter.</p>
    } else if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleShowCountry(country)}>Show</button>
              {selectedCountry && selectedCountry.cca3 === country.cca3 && (
                <div>
                  <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
                </div>
              )}
            </li>
          ))}
        </ul>
      )
    } else if (filteredCountries.length === 1 || selectedCountry) {
      const country = selectedCountry || filteredCountries[0]
      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area} km²</p>
          <h4>Languages:</h4>
          <ul>
            {Object.values(country.languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
          {weather && (
            <div>
              <h4>Weather in {country.capital}</h4>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Weather: {weather.weather[0].description}</p>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={`Weather icon`}
              />
            </div>
          )}
        </div>
      )
    } else {
      return <p>No matches found.</p>
    }
  }

  return (
    <div>
      <h1>Country Information</h1>
      <div>
        Find countries: <input value={search} onChange={handleSearchChange} />
      </div>
      {renderCountries()}
    </div>
  )
}

export default App
