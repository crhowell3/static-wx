function ThreatcastForm(props) {
  const handleChange = (category: string, value: string) => {
    props.setThreatLevels(prev => ({ ...prev, [category]: value }))
  }

  const handleCityChange = (value: string) => {
    props.setCity(value)
  }

  const handleTimeframeChange = (value: string) => {
    props.setTimeframe(value)
  }

  return (
    <div
      className='flex flex-col mb-10 justify-center items-center'
      style={{ width: '700px' }}
    >
      <h2 className='text-lg font-bold mb-4 text-black'>Threat Level Editor</h2>
      <div className='grid grid-cols-4 gap-4'>
        {props.categories.map(category => (
          <div key={category} className='flex flex-col items-center'>
            <label className='font-semibold text-white'>{category}</label>
            <select
              value={props.threatLevels[category]}
              onChange={e => handleChange(category, e.target.value)}
              className='mt-2 p-2 border rounded-lg text-white'
            >
              {Object.keys(props.severityLabels).map(label => (
                <option key={label} value={label} className='text-black'>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className='flex flex-row gap-4'>
        <div className='flex flex-col items-center mt-5'>
          <label className='font-semibold text-white'>Location</label>
          <input
            type='text'
            name='City'
            className='mt-2 p-2 border rounded-lg text-white'
            onChange={e => handleCityChange(e.target.value)}
          />
        </div>
        <div className='flex flex-col items-center mt-5'>
          <label className='font-semibold text-white'>Timeframe</label>
          <input
            type='text'
            name='Timeframe'
            className='mt-2 p-2 border rounded-lg text-white'
            onChange={e => handleTimeframeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default ThreatcastForm
