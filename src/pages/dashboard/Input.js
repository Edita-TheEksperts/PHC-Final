import { SELECT_FIELDS } from "../../lib/formOptions";

export default function Input({ label, name, value, onChange, type = "text", yesNo = false, options = null }) {
  const selectOptions = options || SELECT_FIELDS[name] || null;
  const cls = "text-gray-900 bg-white border border-gray-200 rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]";

  return (
    <div className="flex flex-col border-b border-gray-100 pb-2 mb-2">
      <label className="font-semibold text-gray-700" htmlFor={name}>{label}</label>
      {yesNo ? (
        <select className={cls} id={name} name={name} value={value || ""} onChange={onChange}>
          <option value="">Bitte wählen</option>
          <option value="Ja">Ja</option>
          <option value="Nein">Nein</option>
        </select>
      ) : selectOptions ? (
        <select className={cls} id={name} name={name} value={value || ""} onChange={onChange}>
          <option value="">Bitte wählen</option>
          {selectOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          className={cls}
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