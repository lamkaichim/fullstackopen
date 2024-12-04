import React, { useState, useEffect } from 'react' 
import axios from 'axios' 

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [search, setSearch] = useState('') 
  const [filteredCountries, setFilteredCountries] = useState([]) 

  // Fetch all countries when the component mounts
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data) 
      })
      .catch(error => {
        console.error('Error fetching countries data:', error) 
      }) 
  }, []) 

  // Update filtered countries whenever the search term changes
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

  // Handle input change
  const handleSearchChange = (event) => {
    setSearch(event.target.value) 
  } 

  // Render logic
  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, please specify another filter.</p> 
    } else if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>{country.name.common}</li>
          ))}
        </ul>
      ) 
    } else if (filteredCountries.length === 1) {
      const country = filteredCountries[0] 
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
