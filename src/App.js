import React, { useEffect, useState, useRef } from 'react'
import TypeAhead from './components/TypeAhead'
import _ from 'lodash'
import './App.css'
const api = 'http://www.omdbapi.com/?apikey=24c2a9d1&type=movie&page=1'

function App () {
  const [options, setOptions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [pills, setPills] = useState([])

  const searchAction = ({ query }) => {
    const autoOptions = []
    fetch(`${api}&s=${query}`)
      .then(res => res.json())
      .then(
        ({ Search = [] }) => {
          Search.map(
            ({ Title: optionLabel, imdbID: optionId }) =>
              !pills.find(({ optionId: id }) => optionId === id) &&
              autoOptions.push({ optionId, optionLabel })
          )
          setOptions(autoOptions)
        },
        error => {
          console.log(error)
        }
      )
  }

  const debounceSearch = useRef(
    _.debounce(searchTerm => searchAction({ query: searchTerm }), 1000)
  )

  useEffect(() => {
    if (searchTerm) {
      debounceSearch.current(searchTerm)
    }
  }, [searchTerm])

  return (
    <div className='App'>
      <TypeAhead
        maxPills={5}
        options={options}
        pills={pills}
        setPills={setPills}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  )
}

export default App
