export default function Input({ label, name, value, onChange, type = "text", yesNo = false }) {
  return (
    <div className="flex flex-col border-b border-gray-100 pb-2 mb-2">
      <label className="font-semibold text-gray-700" htmlFor={name}>{label}</label>
      {yesNo ? (
        <select
          className="text-gray-900 bg-white border border-gray-200 rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
        >
          <option value="">Bitte wählen</option>
          <option value="Ja">Ja</option>
          <option value="Nein">Nein</option>
        </select>
      ) : (
        <input
          className="text-gray-900 bg-white border border-gray-200 rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          type={type}
          autoComplete="off"
        />
      )}
    </div>
  )
}