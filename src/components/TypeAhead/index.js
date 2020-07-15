import React, { useEffect, useState, useRef, memo } from 'react'
import './style.css'

const TypeAhead = ({
  maxPills = 5,
  options = [],
  pills = [],
  setPills = () => {},
  searchTerm = '',
  setSearchTerm = () => {}
}) => {
  const [display, setDisplay] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleClickOutside = event => {
    const { current: wrap } = wrapperRef
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false)
    }
  }

  const updateOptions = option => {
    setDisplay(false)
    setSearchTerm('')
    setPills([...pills, ...[option]])
  }

  const removePill = id => {
    const filterPills = pills.filter(({ optionId }) => optionId !== id)
    setPills(filterPills)
  }

  const handleKeyup = e => {
    e.preventDefault()
    if (e.keyCode !== 8 || searchTerm) return false
    if (pills.length) {
      const reducePills = pills
      reducePills.pop()
      setPills([...reducePills])
    }
  }

  return (
    <div ref={wrapperRef} className='typeAhead-wrap flex-container pos-rel'>
      <div className='typeAhead-box'>
        {
          <div className='pill-wrap'>
            {pills.map(({ optionLabel, optionId }, index) => {
              return (
                <div key={index} className='pills'>
                  <span className='label' title={optionLabel}>
                    {optionLabel}
                  </span>
                  <span className='remove' onClick={() => removePill(optionId)}>
                    X
                  </span>
                </div>
              )
            })}
          </div>
        }
        {pills.length !== maxPills && (
          <input
            id='auto'
            onClick={() => setDisplay(!display)}
            onKeyUp={e => handleKeyup(e)}
            placeholder='Add'
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        )}
      </div>
      {display && (
        <div className='autoContainer'>
          {options.map(({ optionLabel, optionId }, i) => {
            return (
              <div
                onClick={() => updateOptions({ optionLabel, optionId })}
                className='option'
                key={i}
                tabIndex='0'
              >
                <span>{optionLabel}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default memo(TypeAhead)
