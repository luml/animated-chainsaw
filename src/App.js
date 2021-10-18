import { useState, useEffect, useCallback } from "react"
import Search from "./components/Search"
import AddAppointment from "./components/AddAppointment"
import AppointmentInfo from "./components/AppointmentInfo"
import { BiCalendar } from "react-icons/bi"

function App() {
  const [ appointmentList, setAppointmentList ] = useState([])
  const [ query, setQuery ] = useState("")
  const [ sortBy, setSortBy ] = useState('petName')
  const [ orderBy, setOrderBy ] = useState('asc')

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(res => res.json())
      .then((data) => {
        setAppointmentList(data)
      })
  }, [])

  const filteredAppointmentList = appointmentList.filter((item) => {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    )
  }).sort((a, b) => {
    let order = ( orderBy === 'asc' ) ? 1 : -1
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order
    )
  })

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3"><BiCalendar className="inline-block text-red-400 align-top"/>Your Appointents</h1>
      <AddAppointment />
      <Search
        query={query}
        onSearchQuery={(myQuery) => setQuery(myQuery)}
        sortBy={sortBy}
        onSortbyChange={(mySort) => setSortBy(mySort)}
        orderBy={orderBy}
        onOrderbyChange={(myOrder) => setOrderBy(myOrder)}
      />
      <ul className="divide-y divide-gray-200">
        {filteredAppointmentList
          .map(appointment => (
            <AppointmentInfo key={appointment.id} appointment={appointment} onDeleteAppointment={(appointmentId) => {
              setAppointmentList(filteredAppointmentList.filter(item => item.id !== appointmentId))
            }} />
          ))
        }
      </ul>
    </div>
  );
}

export default App;
