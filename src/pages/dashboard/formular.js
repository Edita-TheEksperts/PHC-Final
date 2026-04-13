
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Menu, X, User } from "lucide-react"
import Input from "./Input"

const navItems = [
  { label: "Dashboard", path: "/client-dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Persönliche Informationen", path: "/dashboard/formular", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Finanzen", path: "/dashboard/finanzen", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Nachrichten & Feedback", path: "/dashboard/nachrichten", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
]

export default function FormularPage() {
  const [userData, setUserData] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (!token) return router.push("/")
        const res = await fetch("/api/user/getUserData", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setUserData(data)
        setForm(data)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = () => { setEditMode(true); setForm(userData); setMessage("") }
  const handleCancel = () => { setEditMode(false); setForm(userData); setMessage("") }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const token = localStorage.getItem("userToken")
      const res = await fetch(`/api/clients/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const updated = await res.json()
        setUserData(updated)
        setForm(updated)
        setEditMode(false)
        setMessage("Gespeichert!")
      } else {
        const err = await res.json()
        setMessage(err.message || "Fehler beim Speichern")
      }
    } catch (err) {
      setMessage("Fehler beim Speichern")
    } finally {
      setSaving(false)
    }
  }

  const userInitials = `${userData?.firstName?.[0] || ""}${userData?.lastName?.[0] || ""}`.toUpperCase() || "?"

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-gray-50">
        <div className="w-14 h-14 rounded-full border-4 border-[#B99B5F]/20 border-t-[#B99B5F] animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Daten werden geladen…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden bg-white border-b border-gray-200 w-full fixed top-0 left-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm">
        <span className="text-lg font-bold text-[#B99B5F]">PHC</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {isOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col pt-16">
          <ul className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <li
                key={item.path}
                onClick={() => { router.push(item.path); setIsOpen(false) }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition
                  ${item.danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col flex-shrink-0 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B99B5F] flex items-center justify-center cursor-pointer flex-shrink-0" onClick={() => router.push("/client-dashboard")}>
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 cursor-pointer select-none" onClick={() => router.push("/client-dashboard")}>PHC</h1>
            <p className="text-xs text-gray-400">Kundenportal</p>
          </div>
        </div>

        {/* User avatar */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 px-3 py-3 bg-[#B99B5F]/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B99B5F] to-[#8a7040] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userData?.firstName} {userData?.lastName}</p>
              <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = router.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition
                  ${item.danger ? "text-red-500 hover:bg-red-50"
                    : isActive ? "bg-[#B99B5F]/10 text-[#B99B5F] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <svg className={`w-4 h-4 flex-shrink-0 ${isActive && !item.danger ? "text-[#B99B5F]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="truncate">{item.label}</span>
                {isActive && !item.danger && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B99B5F]" />}
              </button>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={() => { localStorage.removeItem("userToken"); localStorage.removeItem("selectedService"); router.push("/") }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Abmelden
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-auto mt-14 lg:mt-0">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Persönliche Informationen</h2>
            <p className="text-sm text-gray-400 mt-0.5">Ihre gespeicherten Daten einsehen und bearbeiten</p>
          </div>
          {!editMode && (
            <button
              onClick={handleEdit}
              className="hidden lg:flex items-center gap-2 bg-[#B99B5F] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#a78a50] transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Bearbeiten
            </button>
          )}
        </div>

        <div className="px-6 lg:px-10 py-8">
          {!form ? (
            <div className="text-gray-500 text-sm">Keine Daten gefunden.</div>
          ) : !editMode ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {/* Section groups */}
              {[
                {
                  title: "Grunddaten", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  fields: [
                    ["Anrede", form.anrede], ["Vorname", form.firstName], ["Nachname", form.lastName],
                    ["E-Mail", form.email], ["Telefon", form.phone], ["Sprachen", form.languages],
                    ["Andere Sprache", form.otherLanguage],
                  ]
                },
                {
                  title: "Adresse", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                  fields: [
                    ["Strasse", form.careStreet], ["PLZ", form.carePostalCode], ["Stadt", form.careCity],
                    ["Telefon", form.carePhone], ["Parkplatz", form.careHasParking], ["Eingang", form.careEntrance],
                    ["Eingang Details", form.careEntranceDetails], ["Briefkasten Schlüsselort", form.mailboxKeyLocation],
                    ["Briefkasten Details", form.mailboxDetails],
                  ]
                },
                {
                  title: "Anfragende Person", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
                  fields: [
                    ["Vorname", form.requestFirstName], ["Nachname", form.requestLastName],
                    ["E-Mail", form.requestEmail], ["Telefon", form.requestPhone],
                  ]
                },
                {
                  title: "Gesundheit & Mobilität", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                  fields: [
                    ["Größe (cm)", form.height], ["Gewicht (kg)", form.weight],
                    ["Körperlicher Zustand", form.physicalState], ["Mobilität", form.mobility],
                    ["Hilfsmittel", form.mobilityAids], ["Pflegehilfsmittel", form.toolsAvailable],
                    ["Andere Hilfsmittel", form.toolsOther], ["Aids", form.aids], ["Aids Sonstige", form.aidsOther],
                    ["Inkontinenz", form.incontinence], ["Inkontinenz Typen", form.incontinenceTypes],
                    ["Ernährungsunterstützung", form.foodSupport], ["Typen", form.foodSupportTypes],
                    ["Medizinische Hinweise", form.medicalFindings], ["Gesundheitliche Hinweise", form.healthFindings],
                    ["Allergien?", form.hasAllergies], ["Allergie Details", form.allergyDetails],
                    ["Mentale Diagnosen", form.mentalDiagnoses], ["Verhalten", form.behaviorTraits],
                  ]
                },
                {
                  title: "Haushalt & Aktivitäten", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                  fields: [
                    ["Zimmer Anzahl", form.householdRooms], ["Personen im Haushalt", form.householdPeople],
                    ["Haustiere?", form.pets], ["Einkaufstyp", form.shoppingType],
                    ["Einkaufen mit Klient", form.shoppingWithClient], ["Einkaufsartikel", form.shoppingItems],
                    ["Gemeinsames Kochen", form.jointCooking], ["Kochen", form.cooking],
                    ["Begleitung", form.companionship], ["Beruflicher Werdegang", form.biographyWork],
                    ["Lesen", form.reading], ["Kartenspiele", form.cardGames], ["Ausflüge", form.trips],
                  ]
                },
                {
                  title: "Termine & Notfall", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
                  fields: [
                    ["Terminarten", form.appointmentTypes], ["Andere Termine", form.appointmentOther],
                    ["Zusätzliche Begleitung", form.additionalAccompaniment],
                    ["Notfall Kontakt Name", form.emergencyContactName],
                    ["Notfall Kontakt Telefon", form.emergencyContactPhone],
                    ["Zusätzliche Hinweise", form.specialRequests],
                  ]
                },
              ].map((section) => (
                <div key={section.title} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-6 py-4 flex items-center gap-2 bg-gray-50/50">
                    <svg className="w-4 h-4 text-[#B99B5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={section.icon} />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-700">{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-gray-50 md:divide-y-0">
                    {section.fields.map(([label, value]) => (
                      <div key={label} className="px-6 py-3 flex flex-col border-b border-gray-50 md:border-b-0 md:border-r last:border-r-0">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</span>
                        <span className="text-sm text-gray-900 whitespace-pre-line">{value || "–"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="px-6 py-5 flex items-center gap-4 bg-gray-50/50 rounded-b-2xl">
                <button
                  className="bg-[#B99B5F] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A6884A] transition"
                  onClick={handleEdit}
                >
                  Bearbeiten
                </button>
                {message && <span className="text-green-600 text-sm font-semibold">{message}</span>}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                onSubmit={e => { e.preventDefault(); handleSave() }}
              >
                <Input label="Anrede" name="anrede" value={form.anrede} onChange={handleChange} />
                <Input label="Vorname" name="firstName" value={form.firstName} onChange={handleChange} />
                <Input label="Nachname" name="lastName" value={form.lastName} onChange={handleChange} />
                <Input label="E-Mail" name="email" value={form.email} onChange={handleChange} type="email" />
                <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} />
                <Input label="Sprachen" name="languages" value={form.languages} onChange={handleChange} />
                <Input label="Andere Sprache" name="otherLanguage" value={form.otherLanguage} onChange={handleChange} />
                <Input label="Strasse" name="careStreet" value={form.careStreet} onChange={handleChange} />
                <Input label="PLZ" name="carePostalCode" value={form.carePostalCode} onChange={handleChange} />
                <Input label="Stadt" name="careCity" value={form.careCity} onChange={handleChange} />
                <Input label="Telefon" name="carePhone" value={form.carePhone} onChange={handleChange} />
                <Input label="Parkplatz vorhanden?" name="careHasParking" value={form.careHasParking} onChange={handleChange} yesNo={true} />
                <Input label="Eingang" name="careEntrance" value={form.careEntrance} onChange={handleChange} />
                <Input label="Eingang Details" name="careEntranceDetails" value={form.careEntranceDetails} onChange={handleChange} />
                <Input label="Briefkasten Schlüsselort" name="mailboxKeyLocation" value={form.mailboxKeyLocation} onChange={handleChange} />
                <Input label="Briefkasten Details" name="mailboxDetails" value={form.mailboxDetails} onChange={handleChange} />
                <Input label="Anfragende/r Vorname" name="requestFirstName" value={form.requestFirstName} onChange={handleChange} />
                <Input label="Anfragende/r Nachname" name="requestLastName" value={form.requestLastName} onChange={handleChange} />
                <Input label="Anfragende/r E-Mail" name="requestEmail" value={form.requestEmail} onChange={handleChange} />
                <Input label="Anfragende/r Telefon" name="requestPhone" value={form.requestPhone} onChange={handleChange} />
                <Input label="Größe (cm)" name="height" value={form.height} onChange={handleChange} />
                <Input label="Gewicht (kg)" name="weight" value={form.weight} onChange={handleChange} />
                <Input label="Körperlicher Zustand" name="physicalState" value={form.physicalState} onChange={handleChange} />
                <Input label="Mobilität" name="mobility" value={form.mobility} onChange={handleChange} />
                <Input label="Hilfsmittel" name="mobilityAids" value={form.mobilityAids} onChange={handleChange} />
                <Input label="Pflegehilfsmittel" name="toolsAvailable" value={form.toolsAvailable} onChange={handleChange} />
                <Input label="Andere Pflegehilfsmittel" name="toolsOther" value={form.toolsOther} onChange={handleChange} />
                <Input label="Hilfsmittel (aids)" name="aids" value={form.aids} onChange={handleChange} />
                <Input label="Andere Hilfsmittel (aidsOther)" name="aidsOther" value={form.aidsOther} onChange={handleChange} />
                <Input label="Inkontinenz" name="incontinence" value={form.incontinence} onChange={handleChange} />
                <Input label="Inkontinenz Typen" name="incontinenceTypes" value={form.incontinenceTypes} onChange={handleChange} />
                <Input label="Ernährungsunterstützung" name="foodSupport" value={form.foodSupport} onChange={handleChange} />
                <Input label="Ernährungsunterstützung Typen" name="foodSupportTypes" value={form.foodSupportTypes} onChange={handleChange} />
                <Input label="Medizinische Hinweise" name="medicalFindings" value={form.medicalFindings} onChange={handleChange} />
                <Input label="Gesundheitliche Hinweise" name="healthFindings" value={form.healthFindings} onChange={handleChange} />
                <Input label="Allergie Details" name="allergyDetails" value={form.allergyDetails} onChange={handleChange} />
                <Input label="Allergien?" name="hasAllergies" value={form.hasAllergies} onChange={handleChange} yesNo={true} />
                <Input label="Mentale Diagnosen" name="mentalDiagnoses" value={form.mentalDiagnoses} onChange={handleChange} />
                <Input label="Verhalten" name="behaviorTraits" value={form.behaviorTraits} onChange={handleChange} />
                <Input label="Zimmer Anzahl" name="householdRooms" value={form.householdRooms} onChange={handleChange} />
                <Input label="Personen im Haushalt" name="householdPeople" value={form.householdPeople} onChange={handleChange} />
                <Input label="Haustiere?" name="pets" value={form.pets} onChange={handleChange} yesNo={true} />
                <Input label="Einkaufstyp" name="shoppingType" value={form.shoppingType} onChange={handleChange} />
                <Input label="Einkaufen mit Klient" name="shoppingWithClient" value={form.shoppingWithClient} onChange={handleChange} yesNo={true} />
                <Input label="Einkaufsartikel" name="shoppingItems" value={form.shoppingItems} onChange={handleChange} yesNo={true} />
                <Input label="Gemeinsames Kochen" name="jointCooking" value={form.jointCooking} onChange={handleChange} yesNo={true} />
                <Input label="Kochen" name="cooking" value={form.cooking} onChange={handleChange} yesNo={true} />
                <Input label="Begleitung" name="companionship" value={form.companionship} onChange={handleChange} yesNo={true} />
                <Input label="Beruflicher Werdegang" name="biographyWork" value={form.biographyWork} onChange={handleChange} yesNo={true} />
                <Input label="Lesen" name="reading" value={form.reading} onChange={handleChange} yesNo={true} />
                <Input label="Kartenspiele" name="cardGames" value={form.cardGames} onChange={handleChange} yesNo={true} />
                <Input label="Ausflüge" name="trips" value={form.trips} onChange={handleChange} yesNo={true} />
                <Input label="Terminarten" name="appointmentTypes" value={form.appointmentTypes} onChange={handleChange} />
                <Input label="Andere Termine" name="appointmentOther" value={form.appointmentOther} onChange={handleChange} />
                <Input label="Zusätzliche Begleitung" name="additionalAccompaniment" value={form.additionalAccompaniment} onChange={handleChange} />
                <Input label="Notfall Kontakt Name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
                <Input label="Notfall Kontakt Telefon" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} />
                <Input label="Zusätzliche Hinweise" name="specialRequests" value={form.specialRequests} onChange={handleChange} />

                <div className="col-span-2 flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="bg-[#B99B5F] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A6884A] transition"
                    disabled={saving}
                  >
                    {saving ? "Speichern…" : "Speichern"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Abbrechen
                  </button>
                  {message && <span className={`text-sm font-semibold ${message === "Gespeichert!" ? "text-green-600" : "text-red-500"}`}>{message}</span>}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Kündigung - small, integrated */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Vertrag & Kündigung</h3>
          </div>
          <div className="p-6 space-y-3">
            <a href="/register-client" className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
              <span className="text-sm font-medium text-gray-700">Neue Buchung (Schnell Buchung inkl. Fragebogen)</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href="tel:+41432001020" className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
              <span className="text-sm font-medium text-gray-700">Kontakt aufnehmen: +41 43 200 10 20</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </a>
            <a href="/dashboard/kundigung" className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition">
              <span className="text-sm font-medium text-red-700">Vertrag kündigen</span>
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
