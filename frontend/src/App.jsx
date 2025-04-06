import { useState } from 'react'
import './App.css'
import TravelForm from './component/TravelForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TravelForm/>
    </>
  )
}

export default App
