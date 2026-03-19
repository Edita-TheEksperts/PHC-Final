import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EmailTemplatesAdmin() {
  const [emails, setEmails] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ subject: "", body: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/emails")
      .then(res => res.json())
      .then(setEmails);
  }, []);

  const startEdit = (email) => {
    setEditing(email.id);
    setForm({ subject: email.subject, body: email.body });
  };

  const saveEdit = async () => {
    const res = await fetch("/api/admin/emails", {
      method: "PUT",  
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing, ...form }),
    });
    const updated = await res.json();
    setEmails(emails.map(e => (e.id === updated.id ? updated : e)));
    setEditing(null);
  };

  const highlightPlaceholders = (text) => {
    return text.replace(/{{(.*?)}}/g,
      `<span class="px-1 bg-yellow-200 text-yellow-900 rounded">{{$1}}</span>`
    );
  };

  const filtered = emails.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Vorlage suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
        />
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((email) => (
          <div
            key={email.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col"
          >
            {editing === email.id ? (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Betreff</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="E-Mail Betreff"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Inhalt</label>
                  <ReactQuill
                    theme="snow"
                    value={form.body}
                    onChange={(value) => setForm({ ...form, body: value })}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link'],
                        ['clean']
                      ]
                    }}
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-[#0F1F38] hover:bg-[#1a3050] text-white text-sm font-medium rounded-lg transition"
                  >
                    Speichern
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{email.subject}</h3>
                    <span className="flex-shrink-0 font-mono text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
                      {email.name}
                    </span>
                  </div>
                  <div
                    className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3 h-28 overflow-hidden leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightPlaceholders(email.body) }}
                  />
                </div>
                <div className="px-5 py-3 border-t border-gray-100">
                  <button
                    onClick={() => startEdit(email)}
                    className="w-full py-2 bg-[#0F1F38] hover:bg-[#1a3050] text-white text-sm font-medium rounded-lg transition"
                  >
                    Vorlage bearbeiten
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
