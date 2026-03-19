const [appointments, setAppointments] = useState([])

useEffect(() => {
  fetchAppointments()
}, [])

const fetchAppointments = async () => {
  const res = await fetch("/api/appointments")
  const data = await res.json()
  setAppointments(data)
}
