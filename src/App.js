import React, { useEffect, useState, useRef, useCallback } from 'react'
import TypeAhead from './components/TypeAhead'
import _ from 'lodash'
import './App.css'
const api = 'http://www.omdbapi.com/?apikey=24c2a9d1&type=movie&page=1'

function App () {
  const [options, setOptions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [pills, setPills] = useState([])

  const searchAction = useCallback(({ query, pills }) => {
    const autoOptions = []
    fetch(`${api}&s=${query}`)
      .then(res => res.json())
      .then(
        ({ Search = [] }) => {
          Search.map(({ Title: optionLabel, imdbID: optionId }) => {
            console.log(pills)
            return (
              !pills.find(({ optionId: id }) => optionId === id) &&
              autoOptions.push({ optionId, optionLabel })
            )
          })
          setOptions(autoOptions)
        },
        error => {
          console.log(error)
        }
      )
  }, [])

  const debounceSearch = useRef(
    _.debounce(
      (searchTerm, pills) => searchAction({ query: searchTerm, pills }),
      1000
    )
  )

  useEffect(() => {
    if (searchTerm) {
      debounceSearch.current(searchTerm, pills)
    }
  }, [searchTerm, pills])

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
