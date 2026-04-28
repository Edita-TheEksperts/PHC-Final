import {
  SELECT_FIELDS,
  CLIENT_MULTI_OPTIONS,
  CLIENT_COMM_OPTIONS,
  parseCsvSet,
} from "../../lib/formOptions";

export default function Input({ label, name, value, onChange, type = "text", yesNo = false, options = null }) {
  const cls = "text-gray-900 bg-white border border-gray-200 rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]";

  // 1) Multi-checkbox group (matches RegisterForm3/4 checkbox lists).
  //    Stored as comma-separated string so the existing PUT handler can persist as String? in DB.
  const multiOpts = CLIENT_MULTI_OPTIONS[name];
  if (multiOpts) {
    const set = parseCsvSet(value);
    return (
      <div className="flex flex-col border-b border-gray-100 pb-2 mb-2">
        <label className="font-semibold text-gray-700">{label}</label>
        <div className="mt-1 flex flex-col gap-1">
          {multiOpts.map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={set.has(opt)}
                onChange={() => {
                  const next = new Set(set);
                  if (next.has(opt)) next.delete(opt); else next.add(opt);
                  onChange({ target: { name, value: Array.from(next).join(", ") } });
                }}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // 2) Communication sense select (Sehen/Hören/Sprechen) — labeled options from RegisterForm3.
  const commOpts = CLIENT_COMM_OPTIONS[name];
  if (commOpts) {
    return (
      <div className="flex flex-col border-b border-gray-100 pb-2 mb-2">
        <label className="font-semibold text-gray-700" htmlFor={name}>{label}</label>
        <select className={cls} id={name} name={name} value={value || ""} onChange={onChange}>
          <option value="">Bitte wählen</option>
          {commOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }

  const selectOptions = options || SELECT_FIELDS[name] || null;

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
  );
}
