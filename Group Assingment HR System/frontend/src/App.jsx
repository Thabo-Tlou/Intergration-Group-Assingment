import { useState } from 'react'
import EmployeeList from '../components/EmployeeList'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <EmployeeList />
    </>
  )
}

export default App
