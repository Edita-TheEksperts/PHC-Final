import AdminLayout from "../../components/AdminLayout";
import EmailTemplatesAdmin from "../../components/EmailTemplatesAdmin";

export default function EmailTemplatesPage() {
  return (
    <AdminLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">E-Mail Vorlagen</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vorlagen für automatische E-Mails bearbeiten</p>
        </div>
        <EmailTemplatesAdmin />
      </div>
    </AdminLayout>
  );
}
