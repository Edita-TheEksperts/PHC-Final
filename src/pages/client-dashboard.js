import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm1 from "../components/RegisterForm1";
import RegisterForm2 from "../components/RegisterForm2";
import { ChevronDown, ChevronUp } from "lucide-react";
import Kundigung from "./dashboard/kundigung";
import RegisterForm3 from "../components/RegisterForm3";
import RegisterForm4 from "../components/RegisterForm4";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { parseISO } from "date-fns";
import { de } from "date-fns/locale";



import {
  CalendarDays,
  Clock,
  Plane,
  AlarmClock,
  Hourglass,
  Menu,
  X,
  Trash2,
} from "lucide-react";

import { addDays, format } from "date-fns";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

registerLocale("de", de);

export default function ClientDashboard() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [targetHours, setTargetHours] = useState([]); // Default target hours for overtime alerts
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
const [uiMessage, setUiMessage] = useState(null);
const [activeTab, setActiveTab] = useState("dashboard");
const [updatedData, setUpdatedData] = useState({});
const [showAppointments, setShowAppointments] = useState(true);
const [showHistory, setShowHistory] = useState(true);
const [showUserInfo, setShowUserInfo] = useState(true);
const [showVacations, setShowVacations] = useState(true);
const [showBooking, setShowBooking] = useState(true);
  const [services, setServices] = useState("");
  const [allServices, setAllServices] = useState([]);

  const [isNotifVisible, setIsNotifVisible] = useState(false);
  const [notifShownOnce, setNotifShownOnce] = useState(false);
  const [filter, setFilter] = useState("cancelled");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [vacations, setVacations] = useState([]);

  // ── NEW FEATURE STATE ──
  const [clientDetails, setClientDetails] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null); // { id, date, hours }
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherResult, setVoucherResult] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [ratingModal, setRatingModal] = useState(null); // { employeeId, employeeName, appointmentId }
  const [ratingData, setRatingData] = useState({ rating: 0, comment: "" });
  const [ratingLoading, setRatingLoading] = useState(false);
  const [submittedRatings, setSubmittedRatings] = useState([]); // employeeIds already rated
// Calculate total hours & km
const doneAppointments = appointments.filter(
  (a) => a.status === "done"
);

const totalHours = doneAppointments.reduce(
  (sum, a) => sum + (a.hours || 0),
  0
);

const totalKm = doneAppointments.reduce(
  (sum, a) => sum + (a.kilometers || 0),
  0
);


// Define a baseline (contracted) hours/km, for example:
const contractedHours = 20; // adjust based on your rules
const contractedKm = 50;

const extraHours = Math.max(0, totalHours - contractedHours);
const extraKm = Math.max(0, totalKm - contractedKm);

  const [form, setForm] = useState({
    date: null,
    time: "",
    hours: 2, // default to 2 hours

    service: "",
    subService: "",
  });

  const minSelectableDate = addDays(new Date(), 14);

  // ✅ Always defined (or null)
  const selectedService =
    allServices.find((srv) => String(srv.id) === String(form.service)) || null;

  // --- DEBUG: Track form + services state
  useEffect(() => {}, [allServices]);

  useEffect(() => {}, [form, selectedService]);

  useEffect(() => {}, [appointments]);

  useEffect(() => {}, [vacations]);

useEffect(() => {
  if (userData?.id) {
    fetchAppointments(userData.id);
    fetchClientDetails(userData.id);
    fetchSubmittedRatings(userData.id);
  }
}, [userData]);

  const markAsDone = async (id) => {
    await fetch("/api/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, update: { captured: true } }),
    });
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, captured: true } : appt))
    );
  };
useEffect(() => {
  if (!selectedAppointment?.date) return;

  // SIGURIA: kontrollo nëse data është valide
  const raw = selectedAppointment.date.split("T")[0]; // merr vetëm YYYY-MM-DD
  const d = new Date(raw + "T12:00:00");

  if (isNaN(d.getTime())) return; // shmang crash

  const formatted = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");

  setEditData({
    date: formatted,
    startTime: selectedAppointment.startTime,
    hours: selectedAppointment.hours,
    serviceName: selectedAppointment.serviceName,
    subServiceName: selectedAppointment.subServiceName,
  });
}, [selectedAppointment]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = appointments.filter((a) => {
    const d = a.date ? new Date(a.date) : null;
    const isFuture = d ? d >= today : true;
    return isFuture && !["cancelled", "terminated", "done"].includes(a.status);
  });

  const history = appointments.filter((a) => {
    const d = a.date ? new Date(a.date) : null;
    const isPast = d ? d < today : false;
    return ["cancelled", "terminated", "done"].includes(a.status) || isPast;
  });

  const fetchAppointments = async (userId) => {
    const res = await fetch(`/api/appointments?userId=${userId}`);
    if (res.ok) {
      const data = await res.json();
      setAppointments(data);
    }
  };

  const fetchClientDetails = async (userId) => {
    try {
      const res = await fetch(`/api/clients/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setClientDetails(data);
      }
    } catch {}
  };

  const fetchSubmittedRatings = async (userId) => {
    try {
      const res = await fetch(`/api/client/feedback?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSubmittedRatings(data.map((f) => f.employeeId));
      }
    } catch {}
  };

  // Refund % based on days until appointment
  const getRefundInfo = (dateStr) => {
    if (!dateStr) return { pct: 0, label: "Keine Rückerstattung" };
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (days > 14) return { pct: 100, label: "100% Rückerstattung", color: "text-green-600" };
    if (days > 7)  return { pct: 50,  label: "50% Rückerstattung",  color: "text-amber-600" };
    return           { pct: 0,   label: "Keine Rückerstattung",  color: "text-red-600" };
  };

  const handleCancelConfirmed = async () => {
    if (!cancelConfirm) return;
    await cancelAppointment(cancelConfirm.id);
    setCancelConfirm(null);
  };

  const handleVoucherSubmit = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    setVoucherResult(null);
    try {
      const res = await fetch("/api/vouchers/use", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode.trim(), userId: userData?.id }),
      });
      const data = await res.json();
      setVoucherResult({ success: res.ok, ...data });
      if (res.ok) setVoucherCode("");
    } catch {
      setVoucherResult({ success: false, error: "Netzwerkfehler. Bitte erneut versuchen." });
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!ratingModal || ratingData.rating === 0) return;
    setRatingLoading(true);
    try {
      const res = await fetch("/api/client/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          employeeId: ratingModal.employeeId,
          rating: ratingData.rating,
          comment: ratingData.comment,
        }),
      });
      if (res.ok) {
        setSubmittedRatings((prev) => [...prev, ratingModal.employeeId]);
        setRatingModal(null);
        setRatingData({ rating: 0, comment: "" });
        setUiMessage({ type: "success", text: "✅ Bewertung erfolgreich abgegeben!" });
        setTimeout(() => setUiMessage(null), 4000);
      }
    } catch {}
    finally { setRatingLoading(false); }
  };


const cancelAppointment = async (id) => {
  try {
    const res = await fetch(`/api/appointments?id=${id}&cancel=true`, {
      method: "DELETE",
    });

    // ✅ Përditëso UI menjëherë
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "cancelled" } : appt
      )
    );

    if (!res.ok) {
      // ⚠️ backend error (email), por UX vazhdon
      setUiMessage({
        type: "warning",
        text:
          "Termin wurde storniert, aber die Bestätigungs-E-Mail konnte nicht gesendet werden.",
      });
    } else {
      setUiMessage({
        type: "success",
        text: "✅ Termin erfolgreich storniert.",
      });
    }
  } catch (err) {
    setUiMessage({
      type: "error",
      text: "❌ Termin konnte nicht storniert werden. Bitte versuchen Sie es erneut.",
    });
  }

  // ⏳ fshi mesazhin pas 4 sekondash
  setTimeout(() => setUiMessage(null), 4000);
};

  const terminateAppointment = async (id, immediate = false) => {
    await fetch(
      `/api/appointments?id=${id}&terminate=true&immediate=${immediate}`,
      {
        method: "DELETE",
      }
    );

    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "terminated" } : appt
      )
    );
  };

  const fetchVacations = async (userId) => {
    const res = await fetch(`/api/vacation/get?userId=${userId}`);
    if (res.ok) {
      const data = await res.json();
      setVacations(data);
    }
  };

  const deleteVacation = async (vacationId) => {
    try {
      const res = await fetch(`/api/vacation/${vacationId}`, { method: "DELETE" });
      if (res.ok) {
        setVacations((prev) => prev.filter((v) => v.id !== vacationId));
      }
    } catch {}
  };

  useEffect(() => {
    if (userData?.id) {
      fetchVacations(userData.id);
    }
  }, [userData]);

useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("userToken");

  // nëse s'ka token → ridrejto menjëherë
if (!token && step !== "done" && step !== "payment") {
  router.replace("/login");
  return;
}


  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/getUserData", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        // token i pavlefshëm → fshi nga localStorage dhe ridrejto
        localStorage.removeItem("userToken");
        router.replace("/login");
        return;
      }

      if (!res.ok) throw new Error("Fehler beim Laden der Benutzerdaten");

      const user = await res.json();
      setUserData(user);
      setUpdatedData(user);
    } catch (err) {
      router.replace("/login"); // si fallback nëse ndodh ndonjë gabim
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [router]);


  // --- Fetch available services
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setAllServices(data);
      })
      .catch(() => {});
  }, []);

  const [step, setStep] = useState("booking"); // "booking" | "payment" | "done"
  const [pendingBooking, setPendingBooking] = useState(null);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const service = allServices.find(
      (s) => String(s.id) === String(form.service)
    );
    const subService =
      service?.subServices.find(
        (s) => String(s.id) === String(form.subService)
      ) || null;

    const payload = {
      userId: userData.id,
      date: form.date?.toISOString(),
      time: form.time,
      email: userData.email,
      hours: form.hours,
      service: service?.name || null,
      subService: subService?.name || null,
      serviceId: service?.id || null,
      subServiceId: subService?.id || null,
    };

    setPendingBooking(payload);
    setStep("payment"); // 👉 go to payment screen
  };

  const stripe = useStripe();
  const elements = useElements();
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [agbError, setAgbError] = useState("");

  const handleStripePayment = async () => {
    if (!agbAccepted) {
      setAgbError("Bitte AGB akzeptieren.");
      return;
    }

    try {
      // 1. Create PaymentIntent on backend
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: pendingBooking.hours * 5000 }), // 💰 e.g. 50 CHF per hour
      });
      const { clientSecret } = await res.json();

      // 2. Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: elements.getElement(CardElement) },
        }
      );

      if (error) {
        alert(error.message);
        return;
      }

      // 3. Save appointment after successful payment
      // Debug: Log the payload before sending
      const bookingPayload = {
        ...pendingBooking,
        email: userData.email,
        paymentIntentId: paymentIntent.id,
      };
      const saveRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (saveRes.ok) {
        alert("✅ Termin gebucht & Zahlung erfolgreich!");
        setStep("done");
        setForm({ date: "", time: "", hours: 2, service: "", subService: "" });
      } else {
        alert("❌ Fehler beim Speichern des Termins");
      }
    } catch (err) {
      alert("Fehler bei der Zahlung.");
    }
  };
  const [editingCard, setEditingCard] = useState(false);
const [cardLoading, setCardLoading] = useState(false);


async function handleUpdateCard() {
  setCardLoading(true);

  // 1) Create Stripe payment method
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: "card",
    card: elements.getElement(CardElement),
  });

  if (error) {
    alert(error.message);
    setCardLoading(false);
    return;
  }

  // 2) Send to backend
  const res = await fetch("/api/update-payment-method", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userData.id,
      customerId: userData.stripeCustomerId,
      newPaymentMethodId: paymentMethod.id,
    }),
  });

  const data = await res.json();
  setCardLoading(false);

  if (data.success) {
    alert("Zahlungsmethode erfolgreich aktualisiert!");
    setEditingCard(false);
    fetchPaymentMethod(); // Rifresko kartën e re
  } else {
    alert("Fehler: Zahlungsmethode konnte nicht gespeichert werden.");
  }
}

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "")
      .replace(/[^\w]/g, "") || "";

  const formMap = {
    haushaltshilfeundwohnpflege: RegisterForm1,
    freizeitundsozialeaktivitaeten: RegisterForm2,
    gesundheitsfuhrsorge: RegisterForm3,
    alltagsbegleitungundbesorgungen: RegisterForm4,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
  e.preventDefault();


if (!updatedData.careStreet || updatedData.careStreet.trim() === "") {
  alert("❌ Bitte geben Sie Ihre Hausnummer ein.");
  return;
}

if (!updatedData.careCity || updatedData.careCity.trim() === "") {
  alert("❌ Bitte geben Sie Ihren Wohnort ein.");
  return;
}


  // nëse do të mbash edhe fushat tjera si opsionale ose të kontrolluara
  const requiredFields = ["firstName", "lastName", "email", "phone"];
  for (let field of requiredFields) {
    const value = updatedData[field] ? String(updatedData[field]).trim() : "";
    if (value === "") {
      alert(`❌ Bitte füllen Sie das Feld "${field}" aus.`);
      return;
    }
  }

  try {

    const res = await fetch("/api/updateUserData", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userData.id, ...updatedData }),
    });


    if (res.ok) {
      alert("✅ Daten erfolgreich aktualisiert!");
    } else {
      alert("❌ Fehler beim Aktualisieren.");
    }
  } catch (err) {
    alert("❌ Serverfehler.");
  }
};


  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-gray-50">
        <div className="w-14 h-14 rounded-full border-4 border-[#B99B5F]/20 border-t-[#B99B5F] animate-spin" />
        <p className="text-sm text-gray-400 font-medium tracking-wide">Dashboard wird geladen…</p>
      </div>
    );

  const SelectedForm = formMap[services];
  function VacationForm({ userId, refreshVacations }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  const start = new Date(startDate);
  const end = new Date(endDate);

  await fetch("/api/vacation/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    }),
  });

// 🔁 për çdo termin aktiv gjatë Urlaub
for (const appt of appointments) {
  if (!appt.date || appt.status !== "active") continue;

  const apptDate = new Date(appt.date);
  const startDay = new Date(start);
  const endDay = new Date(end);

  apptDate.setHours(12, 0, 0, 0);
  startDay.setHours(0, 0, 0, 0);
  endDay.setHours(23, 59, 59, 999);

  if (apptDate >= startDay && apptDate <= endDay) {
    // ✅ KJO është STORNIEREN i vërtetë
    await fetch(
      `/api/admin/schedules/${appt.id}/cancel?cancelledBy=Urlaub`,
      {
        method: "PATCH",
      }
    );
  }
}

// 🔄 rifresko nga backend
await fetchAppointments(userId);


  setStartDate(null);
  setEndDate(null);
  refreshVacations();
};

    function isUserDataIncomplete(data) {
      if (!data) return true;
      return (
        !data.firstName ||
        !data.lastName ||
        !data.email ||
        !data.phone ||
        !data.address
      );
    }

    useEffect(() => {
      if (!notifShownOnce && isUserDataIncomplete(userData)) {
        setIsNotifVisible(true);
        setNotifShownOnce(true);
      }
    }, [userData, notifShownOnce]);

    return (
<form onSubmit={handleSubmit} className="space-y-4">

  {/* Startdatum */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Startdatum
    </label>
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        setEndDate(null);
      }}
      dateFormat="dd.MM.yyyy"
      locale="de"
      placeholderText="dd.mm.yyyy"
      minDate={new Date()}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
    />
  </div>

  {/* Enddatum */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Enddatum
    </label>
    <DatePicker
      selected={endDate}
      onChange={(date) => setEndDate(date)}
      dateFormat="dd.MM.yyyy"
      locale="de"
      placeholderText="dd.mm.yyyy"
      minDate={startDate || new Date()}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
    />
  </div>

{/* Rule info */}
<div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3">
  <strong>Hinweis:</strong>  
  {" "}Gebuchte Termine, die in diesen Zeitraum fallen, werden automatisch storniert. 
  Es gelten unsere{" "}
  <a
    href="https://phc.ch/AVB"
    target="_blank"
    rel="noopener noreferrer"
    className="underline font-medium hover:text-yellow-900"
  >
    AVB
  </a>.
</div>

  <button
    type="submit"
    className="bg-[#B99B5F] text-white py-2 px-4 rounded-lg"
  >
    Urlaub speichern
  </button>
</form>

    );
  }

  const nextAppointment = appointments
    .filter((a) => a.status === "active" && a.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Guten Morgen";
    if (h < 18) return "Guten Tag";
    return "Guten Abend";
  };

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).setHours(12, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const userInitials = `${userData?.firstName?.[0] || ""}${userData?.lastName?.[0] || ""}`.toUpperCase() || "?";
  const todayFormatted = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const activeAppointments = appointments.filter((a) => a.status === "active");

  const navItems = [
    { label: "Dashboard", path: "/client-dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Persönliche Informationen", path: "/dashboard/formular", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { label: "Finanzen", path: "/dashboard/finanzen", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { label: "Kündigung", path: "/dashboard/kundigung", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", danger: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex min-h-screen">

        {/* ── MOBILE TOP BAR ── */}
        <div className="lg:hidden bg-white border-b border-gray-200 w-full fixed top-0 left-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm">
          <span className="text-lg font-bold text-[#B99B5F]">PHC</span>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            {isOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* ── MOBILE MENU OVERLAY ── */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col pt-16">
            <ul className="flex flex-col p-4 space-y-1">
              {navItems.map((item) => (
                <li
                  key={item.path}
                  onClick={() => { router.push(item.path); setIsOpen(false); }}
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
            <div
              className="w-9 h-9 rounded-xl bg-[#B99B5F] flex items-center justify-center cursor-pointer flex-shrink-0"
              onClick={() => router.push("/client-dashboard")}
            >
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 cursor-pointer select-none" onClick={() => router.push("/client-dashboard")}>PHC</h1>
              <p className="text-xs text-gray-400">Kundenportal</p>
            </div>
          </div>

          {/* User info block */}
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
              const isActive = router.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition
                    ${item.danger
                      ? "text-red-500 hover:bg-red-50"
                      : isActive
                        ? "bg-[#B99B5F]/10 text-[#B99B5F] font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 ${isActive && !item.danger ? "text-[#B99B5F]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span className="truncate">{item.label}</span>
                  {isActive && !item.danger && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B99B5F]" />}
                </button>
              );
            })}
          </nav>
          <div className="px-3 py-4 border-t border-gray-100">
            <button
              onClick={() => { localStorage.removeItem("userToken"); localStorage.removeItem("selectedService"); router.push("/"); }}
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

          {/* Top header */}
          <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {getGreeting()}, {userData?.firstName}! 👋
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">{todayFormatted}</p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              {activeAppointments.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#B99B5F] bg-[#B99B5F]/10 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B99B5F] animate-pulse" />
                  {activeAppointments.length} aktive{activeAppointments.length === 1 ? "r" : ""} Termin{activeAppointments.length !== 1 ? "e" : ""}
                </span>
              )}
              <button
                onClick={() => { localStorage.removeItem("userToken"); localStorage.removeItem("selectedService"); router.push("/"); }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Abmelden
              </button>
            </div>
          </div>

          <div className="px-6 lg:px-10 py-8 space-y-8">

            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Next appointment */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-[#B99B5F] col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#B99B5F]/10 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-[#B99B5F]" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nächster Termin</p>
                </div>
                {nextAppointment ? (
                  <>
                    <p className="text-base font-bold text-gray-900 leading-snug">
                      {format(parseISO(nextAppointment.date), "d. MMM yyyy", { locale: de })}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{nextAppointment.startTime} · {nextAppointment.hours} Std</p>
                    {daysUntil(nextAppointment.date) !== null && (
                      <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full
                        ${daysUntil(nextAppointment.date) <= 3 ? "bg-red-50 text-red-600" : "bg-[#B99B5F]/10 text-[#B99B5F]"}`}>
                        {daysUntil(nextAppointment.date) === 0 ? "Heute" : daysUntil(nextAppointment.date) === 1 ? "Morgen" : `in ${daysUntil(nextAppointment.date)} Tagen`}
                      </span>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Kein Termin geplant</p>
                )}
              </div>

              {/* Active appointments */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-amber-400">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktive Termine</p>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{activeAppointments.length}</p>
                <p className="text-xs text-gray-400 mt-1">Bevorstehend geplant</p>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-green-400">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Hourglass className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Abgeschlossen</p>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{doneAppointments.length}</p>
                <p className="text-xs text-gray-400 mt-1">{totalHours} Stunden gesamt</p>
              </div>

              {/* Vacations */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-blue-400">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Urlaub geplant</p>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{vacations.length}</p>
                <p className="text-xs text-gray-400 mt-1">Einträge vorhanden</p>
              </div>
            </div>

            {/* ── UI MESSAGE ── */}
            {uiMessage && (
              <div className={`px-4 py-3 rounded-lg text-sm font-medium border
                ${uiMessage.type === "success" ? "bg-green-50 text-green-700 border-green-200"
                  : uiMessage.type === "warning" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"}`}>
                {uiMessage.text}
              </div>
            )}

            {/* ── TOP ROW: Termine + Buchung ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Nächste Termine */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#B99B5F]/10 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-[#B99B5F]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Nächste Termine</h3>
                  {activeAppointments.length > 0 && (
                    <span className="ml-auto bg-[#B99B5F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {activeAppointments.length}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {activeAppointments.length > 0 ? (
                    activeAppointments.map((appt) => {
                      const days = daysUntil(appt.date);
                      return (
                        <div key={appt.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#B99B5F]/30 hover:bg-[#B99B5F]/5 transition group">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {appt.date && (
                                  <p className="text-sm font-bold text-gray-900">
                                    {format(parseISO(appt.date), "EEEE, d. MMM yyyy", { locale: de })}
                                  </p>
                                )}
                                {days !== null && (
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                                    ${days === 0 ? "bg-red-100 text-red-600" : days === 1 ? "bg-orange-100 text-orange-600" : days <= 7 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                                    {days === 0 ? "Heute" : days === 1 ? "Morgen" : `in ${days} Tagen`}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <AlarmClock className="w-3.5 h-3.5 text-[#B99B5F]" /> {appt.startTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Hourglass className="w-3.5 h-3.5 text-[#B99B5F]" /> {appt.hours} Std
                                </span>
                              </div>
                              {appt.serviceName && (
                                <span className="inline-block text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                  {appt.serviceName}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => { const f = appointments.find(a => a.id === appt.id); setSelectedAppointment(f || appt); }}
                                className="px-3 py-1.5 text-xs font-semibold text-[#B99B5F] bg-[#B99B5F]/10 rounded-lg hover:bg-[#B99B5F]/20 transition"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => setCancelConfirm({ id: appt.id, date: appt.date, hours: appt.hours })}
                                className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
                              >
                                Stornieren
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-14 text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <CalendarDays className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-400">Keine aktiven Termine</p>
                      <p className="text-xs text-gray-300 mt-1">Buchen Sie Ihren ersten Termin</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Neue Buchung */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#B99B5F]/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#B99B5F]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Neue Buchung</h3>
                  <div className="ml-auto flex items-center gap-1.5">
                    {["booking", "payment", "done"].map((s, i) => (
                      <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? "w-6 bg-[#B99B5F]" : ["booking","payment","done"].indexOf(step) > i ? "w-3 bg-[#B99B5F]/50" : "w-3 bg-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  {step === "booking" && (
                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Datum</label>
                        <DatePicker
                          selected={form.date}
                          onChange={(date) => setForm({ ...form, date })}
                          dateFormat="dd.MM.yyyy"
                          locale="de"
                          placeholderText="TT.MM.JJJJ"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]/30 focus:border-[#B99B5F]"
                          minDate={minSelectableDate}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Uhrzeit</label>
                        <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto pr-1">
                          {Array.from({ length: (20 - 7) * 2 + 2 }, (_, i) => {
                            const hour = 7 + Math.floor(i / 2);
                            const minutes = i % 2 === 0 ? "00" : "30";
                            const time = `${String(hour).padStart(2, "0")}:${minutes}`;
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setForm({ ...form, time })}
                                className={`py-1.5 rounded-lg text-xs font-medium border transition
                                  ${form.time === time
                                    ? "bg-[#B99B5F] text-white border-[#B99B5F]"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#B99B5F]/40"}`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Dauer</label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, hours: Math.max(2, (prev.hours || 2) - 0.5) }))}
                            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg font-bold"
                          >–</button>
                          <span className="text-base font-semibold text-gray-900 w-16 text-center">{form.hours || 2} Std</span>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, hours: Math.min(8, (prev.hours || 2) + 0.5) }))}
                            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg font-bold"
                          >+</button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Service</label>
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value, subService: "" })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]/30 focus:border-[#B99B5F]"
                        >
                          <option value="">Service auswählen</option>
                          {allServices.map((srv) => (
                            <option key={srv.id} value={String(srv.id)}>{srv.name}</option>
                          ))}
                        </select>
                      </div>

                      {selectedService?.subServices?.length > 0 && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5">Unterkategorie</label>
                          <select
                            value={form.subService}
                            onChange={(e) => setForm({ ...form, subService: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]/30 focus:border-[#B99B5F]"
                          >
                            <option value="">Unterkategorie auswählen</option>
                            {selectedService.subServices.map((sub) => (
                              <option key={sub.id} value={String(sub.id)}>{sub.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#B99B5F] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#a78a50] transition"
                      >
                        Termin buchen
                      </button>
                    </form>
                  )}

                  {step === "payment" && !editingCard && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => setStep("booking")} className="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1">
                          ← Zurück
                        </button>
                        <h4 className="text-sm font-bold text-gray-900 ml-auto">Zahlungsdetails</h4>
                      </div>
                      {pendingBooking && (
                        <div className="bg-[#B99B5F]/5 border border-[#B99B5F]/20 rounded-xl p-3 text-xs text-gray-600 space-y-1">
                          <p className="font-semibold text-gray-800">Buchungsübersicht</p>
                          {pendingBooking.date && <p>📅 {new Date(pendingBooking.date).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}</p>}
                          {pendingBooking.time && <p>🕐 {pendingBooking.time} Uhr · {pendingBooking.hours} Stunden</p>}
                          {pendingBooking.service && <p>🔧 {pendingBooking.service}{pendingBooking.subService ? ` · ${pendingBooking.subService}` : ""}</p>}
                          <p className="font-bold text-[#B99B5F] pt-1">CHF {(pendingBooking.hours * 50).toFixed(2)}</p>
                        </div>
                      )}
                      <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                        <CardElement />
                      </div>
                      <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agbAccepted}
                          onChange={(e) => setAgbAccepted(e.target.checked)}
                          className="mt-0.5 accent-[#B99B5F]"
                        />
                        <span>
                          Ich akzeptiere die{" "}
                          <a href="/AVB" target="_blank" className="text-[#B99B5F] underline font-medium">AVB</a>
                        </span>
                      </label>
                      {agbError && <p className="text-red-500 text-xs">{agbError}</p>}
                      <button
                        onClick={handleStripePayment}
                        className="w-full bg-gradient-to-r from-[#04436F] to-[#065a96] text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
                      >
                        Zahlung bestätigen · CHF {pendingBooking ? (pendingBooking.hours * 50).toFixed(2) : "–"}
                      </button>
                    </div>
                  )}

                  {step === "done" && (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-base font-semibold text-gray-900">Termin erfolgreich gebucht!</p>
                      <p className="text-sm text-gray-500">Ihre Zahlung wurde bestätigt.</p>
                      <button
                        onClick={() => setStep("booking")}
                        className="mt-2 text-sm text-[#B99B5F] font-medium hover:underline"
                      >
                        Neuen Termin buchen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── BOTTOM ROW: Serviceverlauf + Urlaub ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Serviceverlauf */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#B99B5F]/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[#B99B5F]" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Serviceverlauf</h3>
                  </div>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {["done", "cancelled", "terminated"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 text-xs rounded-md font-semibold transition
                          ${filter === f
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"}`}
                      >
                        {f === "done" ? "Erledigt" : f === "cancelled" ? "Storniert" : "Gekündigt"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {appointments.filter((a) => a.status === filter).length > 0 ? (
                    appointments.filter((a) => a.status === filter).map((item) => (
                      <div key={item.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
                              ${item.status === "done" ? "bg-green-100 text-green-700" : item.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                                ${item.status === "done" ? "bg-green-500" : item.status === "cancelled" ? "bg-red-500" : "bg-yellow-500"}`} />
                              {item.status === "done" ? "Erledigt" : item.status === "cancelled" ? "Storniert" : "Gekündigt"}
                            </span>
                            {item.serviceName && (
                              <span className="text-xs text-gray-400 truncate">{item.serviceName}</span>
                            )}
                          </div>
                          {item.date && (
                            <p className="text-sm font-medium text-gray-800">
                              {new Date(item.date).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
                              {item.startTime && ` · ${item.startTime}`}
                              {item.hours && ` · ${item.hours} Std`}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0 flex flex-col items-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedAppointment(item); }}
                            className="text-xs text-[#B99B5F] font-semibold hover:underline"
                          >
                            Details
                          </button>
                          {item.status === "done" && item.employeeId && (() => {
                            const rated = submittedRatings.includes(item.employeeId);
                            return (
                              <button
                                onClick={(e) => { e.stopPropagation(); if (!rated) setRatingModal({ employeeId: item.employeeId, employeeName: item.employeeName || "Betreuungsperson" }); }}
                                className={`text-xs font-semibold ${rated ? "text-gray-400 cursor-default" : "text-amber-500 hover:underline"}`}
                              >
                                {rated ? "✓ Bewertet" : "⭐ Bewerten"}
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-sm font-medium text-gray-400">Keine Einträge</p>
                      <p className="text-xs text-gray-300 mt-1">Filter ändern um mehr zu sehen</p>
                    </div>
                  )}
                </div>
                {doneAppointments.length > 0 && (
                  <div className="px-6 py-3.5 border-t border-gray-100 flex gap-4 text-sm bg-gray-50 rounded-b-2xl">
                    <span className="text-gray-500">Gesamt: <span className="font-bold text-gray-900">{totalHours} Std</span></span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500"><span className="font-bold text-gray-900">{totalKm}</span> km</span>
                    {extraHours > 0 && <span className="ml-auto text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">+{extraHours} Std extra</span>}
                  </div>
                )}
              </div>

              {/* Urlaub */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Urlaub verwalten</h3>
                  {vacations.length > 0 && (
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {vacations.length}
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-5">
                  <VacationForm userId={userData.id} refreshVacations={() => fetchVacations(userData.id)} />
                  {vacations.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Geplante Urlaube</p>
                      {vacations.map((v, i) => {
                        const start = new Date(v.startDate);
                        const end = new Date(v.endDate);
                        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={v.id} className="flex items-center gap-3 py-3 px-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800">
                                {start.toLocaleDateString("de-CH")} – {end.toLocaleDateString("de-CH")}
                              </p>
                              <p className="text-xs text-blue-500">{nights} {nights === 1 ? "Tag" : "Tage"}</p>
                            </div>
                            <button
                              onClick={() => deleteVacation(v.id)}
                              className="ml-auto p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition flex-shrink-0"
                              title="Urlaub löschen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── CONTRACT + EMPLOYEE ROW ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Contract Info Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#B99B5F]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#B99B5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Mein Vertrag</h3>
                </div>
                <div className="p-6">
                  {userData ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Service</p>
                        <p className="text-sm font-bold text-gray-900">
                          {userData.services?.map(s => s.name).join(", ") || "–"}
                        </p>
                        {userData.subServices?.length > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">{userData.subServices.map(s => s.name).join(", ")}</p>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Startdatum</p>
                        <p className="text-sm font-bold text-gray-900">
                          {userData.firstDate ? new Date(userData.firstDate).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }) : "–"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Häufigkeit</p>
                        <p className="text-sm font-bold text-gray-900">{userData.frequency || "–"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Laufzeit</p>
                        <p className="text-sm font-bold text-gray-900">{userData.duration ? `${userData.duration} Monate` : "–"}</p>
                      </div>
                      <div className="col-span-2 bg-[#B99B5F]/5 rounded-xl p-4 border border-[#B99B5F]/10">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Pflegeadresse</p>
                        <p className="text-sm font-bold text-gray-900">
                          {[userData.careStreet, userData.carePostalCode, userData.careCity].filter(Boolean).join(", ") || "–"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Keine Vertragsdaten gefunden.</p>
                  )}
                </div>
              </div>

              {/* Assigned Employee Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Meine Betreuungsperson</h3>
                </div>
                <div className="p-6">
                  {clientDetails?.assignments?.filter(a => a.status === "active").length > 0 ? (
                    <div className="space-y-4">
                      {clientDetails.assignments.filter(a => a.status === "active").map((assignment) => {
                        const emp = assignment.employee;
                        if (!emp) return null;
                        const alreadyRated = submittedRatings.includes(emp.id);
                        return (
                          <div key={assignment.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            {emp.profilePhoto ? (
                              <img src={emp.profilePhoto} alt={emp.firstName} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white shadow" />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B99B5F] to-[#8a7040] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow">
                                {emp.firstName?.[0]}{emp.lastName?.[0]}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-gray-900">{emp.firstName} {emp.lastName}</p>
                              {emp.city && <p className="text-xs text-gray-500 mt-0.5">📍 {emp.city}</p>}
                              {emp.phone && <p className="text-xs text-gray-500">📞 {emp.phone}</p>}
                              {Array.isArray(emp.languages) && emp.languages.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {emp.languages.map(lang => (
                                    <span key={lang} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{lang}</span>
                                  ))}
                                </div>
                              )}
                              {emp.experienceYears && (
                                <p className="text-xs text-[#B99B5F] font-semibold mt-2">{emp.experienceYears} Jahre Erfahrung</p>
                              )}
                              <button
                                onClick={() => !alreadyRated && setRatingModal({ employeeId: emp.id, employeeName: `${emp.firstName} ${emp.lastName}` })}
                                className={`mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${alreadyRated ? "bg-gray-100 text-gray-400 cursor-default" : "bg-[#B99B5F]/10 text-[#B99B5F] hover:bg-[#B99B5F]/20"}`}
                              >
                                {alreadyRated ? "✓ Bewertet" : "⭐ Bewertung abgeben"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-400">Noch keine Betreuungsperson zugewiesen</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── VOUCHER SECTION ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Gutschein einlösen</h3>
              </div>
              <div className="p-6">
                <div className="flex gap-3 max-w-md">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleVoucherSubmit()}
                    placeholder="GUTSCHEIN-CODE"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition"
                  />
                  <button
                    onClick={handleVoucherSubmit}
                    disabled={voucherLoading || !voucherCode.trim()}
                    className="px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-40"
                  >
                    {voucherLoading ? "…" : "Einlösen"}
                  </button>
                </div>

                {voucherResult && (
                  <div className={`mt-4 flex items-start gap-3 p-4 rounded-xl border ${voucherResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <span className="text-lg">{voucherResult.success ? "✅" : "❌"}</span>
                    <div>
                      {voucherResult.success ? (
                        <>
                          <p className="text-sm font-bold text-green-700">Gutschein erfolgreich eingelöst!</p>
                          <p className="text-sm text-green-600 mt-0.5">
                            Rabatt: <strong>{voucherResult.discountType === "percentage" ? `${voucherResult.discountValue}%` : `CHF ${voucherResult.discountValue}`}</strong>
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-bold text-red-600">{voucherResult.error || "Ungültiger Gutschein"}</p>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">Gutschein-Codes sind case-insensitiv und werden automatisch in Großbuchstaben umgewandelt.</p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── APPOINTMENT DETAIL MODAL ── */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Termin Details</h3>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1
                  ${selectedAppointment.status === "active" ? "bg-[#B99B5F]/10 text-[#B99B5F]"
                    : selectedAppointment.status === "done" ? "bg-green-100 text-green-700"
                    : selectedAppointment.status === "cancelled" ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full
                    ${selectedAppointment.status === "active" ? "bg-[#B99B5F]"
                      : selectedAppointment.status === "done" ? "bg-green-500"
                      : selectedAppointment.status === "cancelled" ? "bg-red-500"
                      : "bg-yellow-500"}`} />
                  {selectedAppointment.status === "active" ? "Aktiv" : selectedAppointment.status === "done" ? "Erledigt" : selectedAppointment.status === "cancelled" ? "Storniert" : "Gekündigt"}
                </span>
              </div>
              <button onClick={() => { setSelectedAppointment(null); setIsEditing(false); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {!isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Datum</p>
                      <p className="font-bold text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Uhrzeit</p>
                      <p className="font-bold text-gray-900">{selectedAppointment.startTime} Uhr</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Dauer</p>
                      <p className="font-bold text-gray-900">{selectedAppointment.hours} Stunden</p>
                    </div>
                    <div className="bg-[#B99B5F]/5 rounded-xl p-3 border border-[#B99B5F]/10">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Betrag</p>
                      <p className="font-bold text-[#B99B5F]">CHF {((selectedAppointment.hours || 0) * 50).toFixed(2)}</p>
                    </div>
                  </div>
                  {selectedAppointment.serviceName && (
                    <div className="bg-gray-50 rounded-xl p-3 text-sm">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Service</p>
                      <p className="font-bold text-gray-900">{selectedAppointment.serviceName}</p>
                      {selectedAppointment.subServiceName && <p className="text-gray-500 text-xs mt-0.5">{selectedAppointment.subServiceName}</p>}
                    </div>
                  )}
                  {selectedAppointment.status === "active" && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-2 bg-[#B99B5F] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#a78a50] transition"
                    >
                      Termin bearbeiten
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Datum</label>
                    <DatePicker
                      selected={editData.date && !isNaN(new Date(editData.date + "T12:00:00")) ? new Date(editData.date + "T12:00:00") : null}
                      onChange={(date) => setEditData((prev) => ({ ...prev, date: date.toISOString().split("T")[0] }))}
                      dateFormat="dd.MM.yyyy"
                      locale="de"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Uhrzeit</label>
                    <input
                      type="time"
                      value={editData.startTime || ""}
                      onChange={(e) => setEditData((prev) => ({ ...prev, startTime: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]/30"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={async () => {
                        await fetch("/api/appointments", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: selectedAppointment.id, update: { date: editData.date, startTime: editData.startTime, serviceName: serviceName, subServiceName: subServiceName } }),
                        });
                        setAppointments((prev) => prev.map((a) => a.id === selectedAppointment.id ? { ...a, ...editData, serviceName: serviceName, subServiceName: subServiceName } : a));
                        setIsEditing(false);
                        setSelectedAppointment(null);
                      }}
                      className="flex-1 py-2.5 rounded-lg bg-[#B99B5F] text-white text-sm font-medium hover:bg-[#a78a50] transition"
                    >
                      Speichern
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL CONFIRMATION MODAL ── */}
      {cancelConfirm && (() => {
        const refund = getRefundInfo(cancelConfirm.date);
        const amount = (cancelConfirm.hours || 0) * 50;
        const refundAmount = (amount * refund.pct) / 100;
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Termin stornieren?</h3>
                  <p className="text-xs text-gray-500">{cancelConfirm.date ? new Date(cancelConfirm.date).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" }) : ""}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${refund.pct === 100 ? "bg-green-50 border-green-200" : refund.pct === 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rückerstattung</p>
                <p className={`text-lg font-extrabold ${refund.color}`}>{refund.label}</p>
                <p className="text-sm text-gray-600 mt-1">
                  CHF <strong>{refundAmount.toFixed(2)}</strong> von CHF {amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {refund.pct === 100 ? "Mehr als 14 Tage Vorlauf → volle Rückerstattung"
                    : refund.pct === 50 ? "7–14 Tage Vorlauf → 50% Rückerstattung"
                    : "Weniger als 7 Tage Vorlauf → keine Rückerstattung"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCancelConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleCancelConfirmed}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
                >
                  Ja, stornieren
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── RATING MODAL ── */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Bewertung abgeben</h3>
                <p className="text-sm text-gray-500 mt-0.5">{ratingModal.employeeName}</p>
              </div>
              <button onClick={() => { setRatingModal(null); setRatingData({ rating: 0, comment: "" }); }} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Stars */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ihre Bewertung</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRatingData(prev => ({ ...prev, rating: star }))}
                    className="text-3xl transition hover:scale-110"
                  >
                    {star <= ratingData.rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
              {ratingData.rating > 0 && (
                <p className="text-xs text-[#B99B5F] font-semibold mt-1">
                  {["", "Sehr schlecht", "Schlecht", "Gut", "Sehr gut", "Ausgezeichnet"][ratingData.rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kommentar (optional)</label>
              <textarea
                rows={3}
                value={ratingData.comment}
                onChange={(e) => setRatingData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Wie war Ihre Erfahrung mit dieser Betreuungsperson?"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#B99B5F]/30 focus:border-[#B99B5F] transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setRatingModal(null); setRatingData({ rating: 0, comment: "" }); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Abbrechen
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={ratingData.rating === 0 || ratingLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#B99B5F] text-white text-sm font-bold hover:bg-[#a78a50] transition disabled:opacity-40"
              >
                {ratingLoading ? "…" : "Bewertung senden"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
