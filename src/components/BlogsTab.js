import { useState, useEffect, useRef } from "react";
import { PlusCircle, Pencil, Trash2, Eye, X, Upload } from "lucide-react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const QUILL_FORMATS = ["bold", "italic", "underline", "list", "bullet", "link"];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[äöü]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue" }[c]))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPTY_FORM = {
  title: "", slug: "", metaTitle: "", metaDescription: "",
  category: "", image: "", date: "", maintext: "",
  authorName: "Martin Kälin", authorPosition: "Redakteur für Prime Home Care",
  authorImage: "/images/phc-author.png", authorDescription: "",
  sections: [], published: true,
};

export default function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [migrating, setMigrating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => { fetchBlogs(); }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/blogs");
      const d = await r.json();
      setBlogs(d.blogs || []);
    } catch { setBlogs([]); } finally { setLoading(false); }
  }

  function startCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMsg("");
    setView("form");
  }

  async function startEdit(id) {
    const r = await fetch(`/api/admin/blogs/${id}`);
    const d = await r.json();
    if (!d.blog) return;
    const b = d.blog;
    setForm({
      title: b.title || "", slug: b.slug || "", metaTitle: b.metaTitle || "",
      metaDescription: b.metaDescription || "", category: b.category || "",
      image: b.image || "", date: b.date || "", maintext: b.maintext || "",
      authorName: b.authorName || "", authorPosition: b.authorPosition || "",
      authorImage: b.authorImage || "", authorDescription: b.authorDescription || "",
      sections: Array.isArray(b.sections) ? b.sections : [],
      published: b.published !== false,
    });
    setEditingId(id);
    setMsg("");
    setView("form");
  }

  async function handleDelete(id, title) {
    if (!confirm(`Blog "${title}" wirklich löschen?`)) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    fetchBlogs();
  }

  async function handleSave() {
    setSaving(true); setMsg("");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/blogs/${editingId}` : "/api/admin/blogs";
    try {
      const r = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) { setMsg("❌ " + (d.error || "Fehler")); return; }
      setMsg("✅ Gespeichert!");
      fetchBlogs();
      setTimeout(() => setView("list"), 800);
    } catch { setMsg("❌ Serverfehler."); } finally { setSaving(false); }
  }

  async function handleMigrate() {
    if (!confirm("Alle Blogs aus blogsData.js importieren? Bestehende werden übersprungen.")) return;
    setMigrating(true);
    try {
      const r = await fetch("/api/admin/blogs/migrate", { method: "POST" });
      const d = await r.json();
      alert(`✅ Migration:\nErstellt: ${d.created}\nÜbersprungen: ${d.skipped}`);
      fetchBlogs();
    } catch { alert("❌ Migrationsfehler"); } finally { setMigrating(false); }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const r = await fetch("/api/admin/blogs/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: reader.result, filename: file.name }),
        });
        const d = await r.json();
        if (d.url) setForm(f => ({ ...f, image: d.url }));
      } catch { alert("Fehler beim Hochladen"); } finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  }

  // Section helpers
  function addSection() {
    setForm(f => ({ ...f, sections: [...f.sections, { title: "", title2: "", paragraphs: [{ text: "" }], faqs: [] }] }));
  }
  function removeSection(i) {
    setForm(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
  }
  function updateSection(i, key, val) {
    setForm(f => { const s = [...f.sections]; s[i] = { ...s[i], [key]: val }; return { ...f, sections: s }; });
  }
  function addParagraph(si) {
    setForm(f => { const s = [...f.sections]; s[si] = { ...s[si], paragraphs: [...(s[si].paragraphs || []), { text: "" }] }; return { ...f, sections: s }; });
  }
  function removeParagraph(si, pi) {
    setForm(f => { const s = [...f.sections]; s[si] = { ...s[si], paragraphs: s[si].paragraphs.filter((_, idx) => idx !== pi) }; return { ...f, sections: s }; });
  }
  function updateParagraph(si, pi, val) {
    setForm(f => { const s = [...f.sections]; const ps = [...(s[si].paragraphs || [])]; ps[pi] = { text: val }; s[si] = { ...s[si], paragraphs: ps }; return { ...f, sections: s }; });
  }
  function addFaq(si) {
    setForm(f => { const s = [...f.sections]; s[si] = { ...s[si], faqs: [...(s[si].faqs || []), { question: "", answer: "" }] }; return { ...f, sections: s }; });
  }
  function removeFaq(si, fi) {
    setForm(f => { const s = [...f.sections]; s[si] = { ...s[si], faqs: s[si].faqs.filter((_, idx) => idx !== fi) }; return { ...f, sections: s }; });
  }
  function updateFaq(si, fi, key, val) {
    setForm(f => { const s = [...f.sections]; const fs = [...(s[si].faqs || [])]; fs[fi] = { ...fs[fi], [key]: val }; s[si] = { ...s[si], faqs: fs }; return { ...f, sections: s }; });
  }

  // ── List view ────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Blog-Verwaltung</h1>
            <p className="text-sm text-gray-500 mt-0.5">{blogs.length} Blogs total</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleMigrate} disabled={migrating}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
              {migrating ? "Importiere..." : "Blogs importieren (einmalig)"}
            </button>
            <button onClick={startCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F1F38] text-white rounded-lg text-sm font-medium hover:bg-[#1a3050] transition">
              <PlusCircle size={16} /> Neuer Blog
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0F1F38] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-sm">Keine Blogs vorhanden.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 w-14"></th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Titel</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Kategorie</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Datum</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {blogs.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        {b.image
                          ? <img src={b.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">IMG</div>
                        }
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 max-w-[280px] truncate">{b.title}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{b.category || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{b.date || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${b.published ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                          {b.published ? "Veröffentlicht" : "Entwurf"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a href={`/blog/${b.slug}`} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                            <Eye size={14} />
                          </a>
                          <button onClick={() => startEdit(b.id)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(b.id, b.title)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition";
  const labelCls = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5";
  const cardCls = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

  // ── Form view ────────────────────────────────────────────
  return (
    <div className="px-6 lg:px-8 py-6 max-w-4xl space-y-6">
      <link rel="stylesheet" href="https://unpkg.com/react-quill@2.0.0/dist/quill.snow.css" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {editingId ? "Blog bearbeiten" : "Neuer Blog"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Alle Felder ausfüllen und speichern</p>
        </div>
        <button onClick={() => setView("list")} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          <X size={14} /> Abbrechen
        </button>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className={cardCls}>
          <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3">Grunddaten</h2>

          <div>
            <label className={labelCls}>Titel *</label>
            <input type="text" value={form.title}
              onChange={e => { const val = e.target.value; setForm(f => ({ ...f, title: val, ...(!editingId && { slug: slugify(val) }) })); }}
              className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input type="text" value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className={`${inputCls} font-mono`} />
            {form.slug && (
              <p className="mt-1 text-xs text-gray-400">
                phc.ch/blog/<strong className="text-[#0F1F38]">{form.slug}</strong>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Kategorie *</label>
              <input type="text" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Datum (z.B. 16. März 2026)</label>
              <input type="text" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Bild</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <input type="text" value={form.image} placeholder="https://... oder Datei hochladen"
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className={inputCls} />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition">
                    <Upload size={14} /> {uploading ? "Wird hochgeladen..." : "Bild hochladen"}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <span className="text-xs text-gray-400">JPG, PNG, WebP</span>
                </div>
              </div>
              {form.image && (
                <img src={form.image} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
              )}
            </div>
          </div>

          <div>
            <label className={labelCls}>Einleitungstext</label>
            <ReactQuill theme="snow" value={form.maintext || ""} onChange={val => setForm(f => ({ ...f, maintext: val }))}
              modules={QUILL_MODULES} formats={QUILL_FORMATS} className="bg-white rounded-lg" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="published" checked={form.published}
              onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-[#0F1F38]" />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">Veröffentlicht</label>
          </div>
        </div>

        {/* SEO */}
        <div className={cardCls}>
          <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3">SEO</h2>
          <div>
            <label className={labelCls}>Meta-Titel</label>
            <input type="text" value={form.metaTitle}
              onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
              placeholder="Für Suchergebnisse (max. 60 Zeichen)" className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">{form.metaTitle?.length || 0} / 60 Zeichen</p>
          </div>
          <div>
            <label className={labelCls}>Meta-Beschreibung</label>
            <textarea value={form.metaDescription}
              onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
              placeholder="Für Suchergebnisse (max. 160 Zeichen)"
              rows={2} className={`${inputCls} resize-y`} />
            <p className="text-xs text-gray-400 mt-1">{form.metaDescription?.length || 0} / 160 Zeichen</p>
          </div>
        </div>

        {/* Author */}
        <div className={cardCls}>
          <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3">Autor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Name</label><input type="text" value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} className={inputCls} /></div>
            <div><label className={labelCls}>Position</label><input type="text" value={form.authorPosition} onChange={e => setForm(f => ({ ...f, authorPosition: e.target.value }))} className={inputCls} /></div>
            <div className="md:col-span-2"><label className={labelCls}>Bild-URL</label><input type="text" value={form.authorImage} onChange={e => setForm(f => ({ ...f, authorImage: e.target.value }))} className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Kurzbeschreibung</label>
            <textarea value={form.authorDescription} onChange={e => setForm(f => ({ ...f, authorDescription: e.target.value }))} rows={2} className={`${inputCls} resize-y`} />
          </div>
        </div>

        {/* Sections */}
        <div className={cardCls}>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Abschnitte ({form.sections.length})</h2>
            <button onClick={addSection} className="flex items-center gap-1 text-xs font-medium text-[#0F1F38] hover:underline">
              <PlusCircle size={14} /> Abschnitt hinzufügen
            </button>
          </div>

          {form.sections.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Noch keine Abschnitte. Klicken Sie oben auf "Abschnitt hinzufügen".</p>
          )}

          {form.sections.map((sec, si) => (
            <div key={si} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Abschnitt {si + 1}</span>
                <button onClick={() => removeSection(si)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelCls}>Titel *</label><input type="text" value={sec.title || ""} onChange={e => updateSection(si, "title", e.target.value)} className={inputCls} /></div>
                <div><label className={labelCls}>Untertitel</label><input type="text" value={sec.title2 || ""} onChange={e => updateSection(si, "title2", e.target.value)} className={inputCls} /></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Absätze</label>
                  <button onClick={() => addParagraph(si)} className="text-xs font-medium text-[#0F1F38] hover:underline flex items-center gap-1">
                    <PlusCircle size={12} /> Absatz
                  </button>
                </div>
                {(sec.paragraphs || []).map((p, pi) => (
                  <div key={pi} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <ReactQuill theme="snow" value={p.text || ""} onChange={val => updateParagraph(si, pi, val)}
                        modules={QUILL_MODULES} formats={QUILL_FORMATS} className="bg-white rounded-lg text-sm" />
                    </div>
                    <button onClick={() => removeParagraph(si, pi)} className="text-red-400 hover:text-red-600 mt-2 flex-shrink-0">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">FAQs (optional)</label>
                  <button onClick={() => addFaq(si)} className="text-xs font-medium text-[#0F1F38] hover:underline flex items-center gap-1">
                    <PlusCircle size={12} /> FAQ
                  </button>
                </div>
                {(sec.faqs || []).map((faq, fi) => (
                  <div key={fi} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={faq.question || ""} placeholder="Frage"
                          onChange={e => updateFaq(si, fi, "question", e.target.value)} className={inputCls} />
                        <textarea value={faq.answer || ""} placeholder="Antwort"
                          onChange={e => updateFaq(si, fi, "answer", e.target.value)}
                          rows={2} className={`${inputCls} resize-y`} />
                      </div>
                      <button onClick={() => removeFaq(si, fi)} className="text-red-400 hover:text-red-600 mt-1 flex-shrink-0">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save bar */}
        <div className="flex items-center gap-4 pb-10">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-[#0F1F38] text-white rounded-lg text-sm font-medium hover:bg-[#1a3050] transition disabled:opacity-50">
            {saving ? "Speichern..." : editingId ? "Änderungen speichern" : "Blog erstellen"}
          </button>
          <button onClick={() => setView("list")} className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Abbrechen
          </button>
          {msg && (
            <span className={`text-sm font-medium ${msg.startsWith("❌") ? "text-red-600" : "text-emerald-600"}`}>
              {msg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
