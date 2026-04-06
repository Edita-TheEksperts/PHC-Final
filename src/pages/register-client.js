import React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  parse,
  addMonths,
  startOfMonth,
  format,
  setDate,
  isAfter,
  startOfDay,
  isSameMonth,
  isBefore,
} from "date-fns";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { isSunday, isWithinInterval } from "date-fns";
import Holidays from "date-holidays";
import {  differenceInCalendarDays } from "date-fns";
import { de } from "date-fns/locale";
export default function RegisterPage() {
  const testMode = false;

    const summaryRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const hd = new Holidays("CH"); 
  const hdZH = new Holidays("CH", "ZH");

  const [loading, setLoading] = useState(false);
  const [voucherStatus, setVoucherStatus] = useState(null);
const [discountAmount, setDiscountAmount] = useState(0);
const [voucherSuccess, setVoucherSuccess] = useState(false);
const [voucherLoading, setVoucherLoading] = useState(false);
const [voucherMessage, setVoucherMessage] = useState("");
const [discountValue, setDiscountValue] = useState(0);
const [discountType, setDiscountType] = useState(null);
  const { watch } = useForm();
  const [formError, setFormError] = useState("");
    const router = useRouter();
  const { service, subService } = router.query;
  const [clientSecret, setClientSecret] = useState(null);
  const selectedServices = service
    ? service
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
    : [];

  const [subServices, setSubServices] = useState([]);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = parseInt(sessionStorage.getItem("step"));
      if (saved) setStep(saved);
    }
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
const [loadingStep4, setLoadingStep4] = useState(false);

  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const [user, setUser] = useState(null);
  const { session_id } = router.query;

  useEffect(() => {
    if (router.query.step) {
      setStep(Number(router.query.step)); 
    }
  }, [router.query.step]);

  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("userId");
      if (storedUserId) setUserId(storedUserId);
    }
  }, []);

  function getNthWeekdayOfMonth(year, month, weekdayName, nth) {
  const weekdaysMap = {
    Sonntag: 0,
    Montag: 1,
    Dienstag: 2,
    Mittwoch: 3,
    Donnerstag: 4,
    Freitag: 5,
    Samstag: 6,
  };

  const targetDay = weekdaysMap[weekdayName];
  const firstDay = new Date(year, month, 1);
  const dates = [];

  for (let d = new Date(firstDay); d.getMonth() === month; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === targetDay) {
      dates.push(new Date(d));
    }
  }

  if (nth === "last") {
    return dates[dates.length - 1];
  } else {
    const index = parseInt(nth, 10) - 1;
    return dates[index] || null;
  }
}

const [form, setForm] = useState({
  services: [],
  frequency: "",
  duration: 2,
  firstDate: "",
  anrede: "",       
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  street: "",
  postalCode: "",
  city: "",
  kanton: "",     
  subServices: [],
  schedules: [{ day: "", startTime: "08:00", hours: 2, subServices: [] }],
  arrivalConditions: [],
  hasParking: "",
  entranceLocation: "",
  mobilityAids: [],
  hasAllergies: "",
allergyDetails: "",

  transportOption: "",
  careFirstName: "",
  careLastName: "",
  carePhone: "",
});


const [sameAsEinsatzort, setSameAsEinsatzort] = useState(false);

useEffect(() => {
  if (sameAsEinsatzort) {
    setForm((prev) => ({
      ...prev,
      requestFirstName: prev.firstName || "",
      requestLastName: prev.lastName || "",
      requestPhone: prev.phone || "",
      requestEmail: prev.email || "",
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      requestFirstName: "",
      requestLastName: "",
      requestPhone: "",
      requestEmail: "",
    }));
  }
}, [
  sameAsEinsatzort,
  form.firstName,
  form.lastName,
  form.phone,
  form.email,
]);
const handleVoucherCheck = async () => {
  setVoucherLoading(true);

  try {
    const res = await fetch("/api/vouchers/use", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.voucher,   // ✅ FIXED
        userId: userId || null // ose hiqe fare
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setVoucherMessage(data.error || "Ungültiger Gutscheincode.");
      setVoucherSuccess(false);
      return;
    }

    const { discountType, discountValue } = data;

    setDiscountType(discountType);
    setDiscountValue(discountValue);
    setVoucherSuccess(true);
    setVoucherMessage("🎉 Gutschein erfolgreich eingelöst!");

  } catch (err) {
    setVoucherMessage("Fehler beim Einlösen des Gutscheins.");
    setVoucherSuccess(false);
  } finally {
    setVoucherLoading(false);
  }
};

useEffect(() => {
  if (form.frequency === "einmalig") {
    setForm((prev) => ({
      ...prev,
      schedules: [
        {
          day: prev.schedules[0]?.day || "",
          startTime: prev.schedules[0]?.startTime || "08:00",
          hours: 2,
          subServices: [],
        },
      ],
      subServices: [], 
    }));
  }
}, [form.frequency]);

  function isSwissHoliday(date) {
    return Boolean(hd.isHoliday(date));
  }
  function parseScheduleDate(entry) {
    if (!entry.day || !entry.startTime) return new Date();
    const [hours, minutes] = entry.startTime.split(":").map(Number);
    const date = new Date(entry.day);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  }
  function roundToSwissFrancs(amount) {
    return Math.ceil(amount * 20) / 20;
  }
  // Per-hour cost: night surcharge (+25%) only on hours 23:00–06:00,
  // Sunday/holiday surcharge (+50%) on any hour falling on Sunday or public holiday.
  // Both surcharges stack for Sunday-night hours.
  // Handles fractional hours (e.g. 0.5h increments from subservices).
  function calculateHourlyCost(startDate, totalHours, baseRate) {
    let cost = 0;
    const fullHours = Math.floor(totalHours);
    const remainder = parseFloat((totalHours - fullHours).toFixed(1));

    for (let i = 0; i < fullHours; i++) {
      const hourDate = new Date(startDate);
      hourDate.setHours(startDate.getHours() + i);
      const h = hourDate.getHours();
      const isNight = h >= 23 || h < 6;
      const isSundayOrHoliday = hourDate.getDay() === 0 || isSwissHoliday(hourDate);
      let rate = baseRate;
      if (isSundayOrHoliday) rate += baseRate * 0.5;
      if (isNight) rate += baseRate * 0.25;
      cost += rate;
    }

    if (remainder > 0) {
      const hourDate = new Date(startDate);
      hourDate.setHours(startDate.getHours() + fullHours);
      const h = hourDate.getHours();
      const isNight = h >= 23 || h < 6;
      const isSundayOrHoliday = hourDate.getDay() === 0 || isSwissHoliday(hourDate);
      let rate = baseRate;
      if (isSundayOrHoliday) rate += baseRate * 0.5;
      if (isNight) rate += baseRate * 0.25;
      cost += rate * remainder;
    }

    return cost;
  }
const [voucherCode, setVoucherCode] = useState("");

  const frequency = form?.frequency?.toLowerCase();
  const isRecurring = ["wöchentlich", "alle 2 wochen", "monatlich"].includes(
    frequency
  );

  function buildDate(entry, firstDateStr) {
    if (!firstDateStr) return new Date();
    const [day, month, year] = firstDateStr.split(".").map(Number);
    const [hours, minutes] = entry.startTime.split(":").map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    const targetDay = [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ].indexOf(entry.day);
    while (date.getDay() !== targetDay && targetDay !== -1) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  let totalPayment = 0;
  if (frequency === "einmalig") {
    const raw = form.schedules?.reduce((sum, entry) => {
      const date = buildDate(entry, form.firstDate);
      const hours = parseFloat(entry.hours) || 0;
      return sum + calculateHourlyCost(date, hours, 75);
    }, 0) || 0;
    totalPayment = roundToSwissFrancs(raw);
  } else if (isRecurring) {
    const raw = form.schedules?.reduce((sum, entry) => {
      const date = buildDate(entry, form.firstDate);
      const hours = parseFloat(entry.hours) || 0;
      return sum + calculateHourlyCost(date, hours, 59);
    }, 0) || 0;
    totalPayment = roundToSwissFrancs(raw);
  }

useEffect(() => {
  // 🛑 Skip auto creation if voucher was already applied
  if (step === 3 && !clientSecret && totalPayment > 0 && !voucherSuccess) {
    const fetchPaymentIntent = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPayment * 100 }),
        });

        const data = await res.json();

        setClientSecret(data.clientSecret);
        setForm((prev) => ({
          ...prev,
          paymentIntentId: data.paymentIntentId,
        }));
      } catch (err) {
      }
    };

    fetchPaymentIntent();
  }
}, [step, clientSecret, totalPayment, voucherSuccess]);
useEffect(() => {
  const updatePaymentIntent = async () => {
    if (voucherSuccess && totalPayment > 0) {
      const discountedAmount =
        discountType === "percent"
          ? totalPayment - (totalPayment * discountValue) / 100
          : totalPayment - discountValue;

      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(discountedAmount * 100) }),
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
      setForm((prev) => ({
        ...prev,
        paymentIntentId: data.paymentIntentId,
      }));
    }
  };

  updatePaymentIntent();
}, [voucherSuccess, discountType, discountValue, totalPayment]);


useEffect(() => {
  if (step === 4 && session_id) {
    fetch(`/api/complete-registration?session_id=${session_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.userId) throw new Error("❌ No userId returned");

        return fetch(`/api/get-user-by-id?id=${data.userId}`);
      })
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData);
        setForm((prev) => ({
          ...prev,
          ...userData,
          service: userData.services?.[0]?.name || "",
          postalCode: userData.carePostalCode || userData.postalCode || "",
        }));
      })
      .catch(() => {});
  }
}, [step, session_id]);

useEffect(() => {
  if (step === 4 && session_id) {
    setLoadingStep4(true);

    fetch(`/api/complete-registration?session_id=${session_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.userId)
          throw new Error("❌ No userId returned from /complete-registration");

        return fetch(`/api/get-user-by-id?id=${data.userId}`);
      })
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData);
        setForm((prev) => ({
          ...prev,
          ...userData,
          service: userData.services?.[0]?.name || "",
          postalCode: userData.carePostalCode || userData.postalCode || "",
        }));

        setStep(5);
      })
      .catch((err) => {
      })
      .finally(() => {
        setLoadingStep4(false);
      });
  }
}, [step, session_id]);


  useEffect(() => {
    if (user && user.services?.[0]?.name) {
      setForm((prev) => ({
        ...prev,
        service: user.services[0].name,
        postalCode: user.carePostalCode || user.postalCode || "",
      }));
    }
  }, [user]);

  {
    Array.isArray(form.schedules) &&
      form.schedules.map((entry, i) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
        >
        </div>
      ));
  }

   useEffect(() => {
    if (summaryRef.current) {

      setOffset(summaryRef.current.offsetHeight + 48);
    }
  }, []);

  const SummaryRow = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-[14px] font-semibold text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
const handleNextStep = () => {
  const valid = validateStep();
  if (valid) {
    setFormError("");
    setStep((prev) => prev + 1);
  }
};

const requiresAllergyInfo = Array.isArray(form.subServices)
  ? form.subServices.some((s) =>
      ["Gemeinsames Kochen", "Nahrungsaufnahme", "Kochen"].includes(
        typeof s === "string" ? s : s.name
      )
    )
  : false;

  const inputClass =
    "w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#B99B5F] placeholder-gray-500 mt-1";
  const arrJoin = (v) => (Array.isArray(v) ? v.join(", ") : v || "");

  const preparePayload = (form) => ({
    // ── Basic ──
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    anrede: form.anrede || "",
    kanton: form.kanton || "",
    phone: form.phone || "",
    address: form.address || "",
    frequency: form.frequency || "",
    duration: Number(form.duration) || null,
    firstDate: form.firstDate,
    paymentIntentId: form.paymentIntentId || "",

    // ── Services / Schedules ──
    services: form.services || [],
    subServices: form.subServices || [],
    schedules: form.schedules || [],

    // ── Care address ──
    careFirstName: form.careFirstName || "",
    careLastName: form.careLastName || "",
    carePhone: form.carePhone || "",
    street: form.street || "",
    postalCode: form.postalCode || "",
    city: form.city || "",
    careHasParking: form.hasParking || "",
    careEntrance: form.entranceLocation || "",
    careArrivalConditions: arrJoin(form.arrivalConditions),
    mailboxKeyLocation: form.mailboxKeyLocation || "",
    mailboxDetails: form.mailboxDetails || "",

    // ── Communication ──
    languages: form.languages || "",
    communicationVision: form.vision || "",
    communicationHearing: form.hearing || "",
    communicationSpeech: form.speaking || "",

    // ── Health ──
    hasAllergies: form.hasAllergies || "",
    allergyDetails: form.allergyDetails || "",
    healthFindings: form.healthFindings || "",
    medicalFindings: form.medicalFindings || "",
    height: form.height ? String(form.height) : "",
    weight: form.weight ? String(form.weight) : "",
    physicalState: form.physicalState || "",
    mobility: form.mobility || "",
    mobilityAids: arrJoin(form.mobilityAids),
    toolsAvailable: arrJoin(form.careTools),
    toolsOther: form.careToolsOther || "",
    incontinence: arrJoin(form.incontinence),
    foodSupport: arrJoin(form.nutritionSupport),
    basicCare: arrJoin(form.basicCare),
    basicCareOther: form.basicCareOther || "",
    healthPromotions: arrJoin(form.healthPromotion),
    healthPromotionOther: form.healthPromotionOther || "",
    mentalSupportNeeded: form.mentalSupportNeeded || "",
    mentalDiagnoses: arrJoin(form.diagnoses),
    behaviorTraits: arrJoin(form.behaviorTraits),

    // ── Household / Activities ──
    householdRooms: Number(form.roomCount) || null,
    householdPeople: Number(form.householdSize) || null,
    pets: form.pets || "",
    cooking: form.cooking || "",
    jointCooking: form.cookingTogether || "",
    shoppingType: form.shoppingType || "",
    shoppingWithClient: form.shoppingWithClient || "",
    shoppingItems: arrJoin(form.shoppingItems),
    transportOption: form.transportOption || "",
    companionship: form.companionship || "",
    biographyWork: form.biographyWork || "",
    hasTech: form.hasTech || "",
    reading: form.reading || "",
    cardGames: form.cardGames || "",
    trips: arrJoin(form.trips),
    additionalAccompaniment: form.additionalAccompaniment || "",

    // ── Request person ──
    requestFirstName: form.requestFirstName || "",
    requestLastName: form.requestLastName || "",
    requestEmail: form.requestEmail || "",
    requestPhone: form.requestPhone || "",

    // ── Emergency ──
    emergencyContactName: form.emergencyContactName || "",
    emergencyContactPhone: form.emergencyContactPhone || "",
  });
const [errors, setErrors] = useState({
  frequency: "",
  firstDate: "",
  services: "",
  day: "",
  subServices: "",
});
const refs = {
  frequency: useRef(null),
  firstDate: useRef(null),
  services: useRef(null),
  anrede: useRef(null),
  firstName: useRef(null),
  lastName: useRef(null),
  email: useRef(null),
  phone: useRef(null),
  houseNumber: useRef(null),
  postalCode: useRef(null),
  city: useRef(null),
  kanton: useRef(null),
  // dhe mund të shtosh më vonë për pjesët e tjera
};

  const [errorFrequency, setErrorFrequency] = useState("");
  const frequencyRef = useRef(null);
  


const [errorDayIndex, setErrorDayIndex] = useState(null);
const [errorDayMessage, setErrorDayMessage] = useState("");
const scrollToElement = (id) => {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      el.classList.add("ring-2", "ring-red-500", "rounded-md");
      setTimeout(() => el.classList.remove("ring-2", "ring-red-500"), 2500);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 400);
};

const validateStep = () => {
  const newErrors = {};
  setErrorDayIndex(null);
  setErrorDayMessage("");

  if (step === 1) {
    // 1️⃣ Frekuenca
    if (!form.frequency) {
      setErrors((prev) => ({
        ...prev,
        frequency: "Bitte wählen Sie die Häufigkeit der Unterstützung.",
      }));
      frequencyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    // 2️⃣ Data
    if (!form.firstDate) {
      setErrors((prev) => ({
        ...prev,
        firstDate: "Bitte wählen Sie ein Beginndatum.",
      }));
      refs.firstDate.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    // 3️⃣ Shërbimet
    if (!form.services || form.services.length === 0) {
      setErrors((prev) => ({
        ...prev,
        services: "Bitte wählen Sie mindestens eine Dienstleistung.",
      }));
      refs.services.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    // 4️⃣ Ditët
    const missingDayIndex = form.schedules.findIndex((entry) => !entry.day);
    if (missingDayIndex !== -1) {
      setErrors((prev) => ({
        ...prev,
        day: "Bitte wählen Sie einen Wochentag aus.",
      }));

      // ✅ Shto këtë:
      setErrorDayIndex(missingDayIndex);
      setErrorDayMessage("Bitte wählen Sie einen Wochentag aus.");

      scrollToElement(`schedule-day-${missingDayIndex}`);
      return false;
    }

    // 5️⃣ Nën-shërbimet
    const missingSubIndex = form.schedules.findIndex(
      (entry) => !entry.subServices || entry.subServices.length === 0
    );
    if (missingSubIndex !== -1) {
      setErrors((prev) => ({
        ...prev,
        subServices: "Bitte wählen Sie mindestens eine Zusatzleistung für diesen Tag.",
      }));

      // ✅ Dhe këtë:
      setErrorDayIndex(missingSubIndex);
      setErrorDayMessage("Bitte wählen Sie mindestens eine Zusatzleistung für diesen Tag.");

      scrollToElement(`schedule-day-${missingSubIndex}`);
      return false;
    }

    // Nëse çdo gjë është në rregull
    setErrors({
      frequency: "",
      firstDate: "",
      services: "",
      day: "",
      subServices: "",
    });

    setErrorDayIndex(null);
    setErrorDayMessage("");
    return true;
  }
  if (step === 2) {
  const newErrors = {};

  if (!form.anrede) newErrors.anrede = "Bitte wählen Sie eine Anrede.";
  if (!form.firstName) newErrors.firstName = "Bitte geben Sie Ihren Vornamen ein.";
  if (!form.lastName) newErrors.lastName = "Bitte geben Sie Ihren Nachnamen ein.";
  if (!form.phone) newErrors.phone = "Bitte geben Sie Ihre Telefonnummer ein.";
  if (!form.email) newErrors.email = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  if (!form.street) newErrors.street = "Bitte geben Sie Ihre Strasse ein.";
  if (!form.houseNumber) newErrors.houseNumber = "Bitte geben Sie Ihre Hausnummer ein.";
  if (!form.postalCode) newErrors.postalCode = "Bitte geben Sie Ihre PLZ ein.";
  if (!form.city) newErrors.city = "Bitte geben Sie Ihren Ort ein.";
  if (!form.kanton) newErrors.kanton = "Bitte wählen Sie Ihren Kanton.";

  // Nëse ka ndonjë gabim → ruaji dhe mos e lejo kalimin në hapin tjetër
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);

    // scroll automatik te fusha e parë që ka error
    const firstErrorField = Object.keys(newErrors)[0];
    document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return false;
  }

  // Nëse gjithçka është në rregull → pastro errorët
  setErrors({});
  return true;
}
  if (step === 3) {
    // Nëse s’ke asnjë fushë për të validuar në këtë hap, thjesht kthe true
    return true;
  }
  if (step === 4) {
  const newErrors = {};

  if (!form.requestFirstName) newErrors.requestFirstName = "Bitte geben Sie Ihren Vornamen ein.";
  if (!form.requestLastName) newErrors.requestLastName = "Bitte geben Sie Ihren Nachnamen ein.";
  if (!form.requestPhone) newErrors.requestPhone = "Bitte geben Sie Ihre Telefonnummer ein.";
  if (!form.requestEmail) newErrors.requestEmail = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
  if (!form.hasParking) newErrors.hasParking = "Bitte wählen Sie, ob ein Parkplatz vorhanden ist.";
  if (form.hasParking === "Ja" && !form.parkingLocation)
    newErrors.parkingLocation = "Bitte geben Sie den Standort des Parkplatzes an.";
  if (!form.hasPets) newErrors.hasPets = "Bitte wählen Sie, ob Haustiere vorhanden sind.";
  if (form.hasPets === "Ja" && !form.petDetails)
    newErrors.petDetails = "Bitte geben Sie Details zu den Haustieren an.";
  if (!form.hasAllergies) newErrors.hasAllergies = "Bitte wählen Sie, ob Allergien vorhanden sind.";
  if (form.hasAllergies === "Ja" && !form.allergyDetails)
    newErrors.allergyDetails = "Bitte geben Sie Details zu den Allergien an.";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    const firstErrorKey = Object.keys(newErrors)[0];
    const el = document.querySelector(`[name="${firstErrorKey}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  return true;
}

};


  const [streetWarning, setStreetWarning] = useState("");
  const [postalWarning, setPostalWarning] = useState("");

const handleChange = (e) => {
  const { name, value } = e.target;

  // Heq error-in sapo plotësohet një fushë (nëse më parë kishte mesazh)
  if (formError && value.trim() !== "") {
    setFormError("");
  }

  if (name === "street") {
    // Vetëm shkronja
    if (/\d/.test(value)) {
      setStreetWarning("Zahlen sind in diesem Feld nicht erlaubt.");
    } else {
      setStreetWarning("");
    }

    const onlyLetters = value.replace(/[^A-Za-zÄÖÜäöüß\s]/g, "");
    setForm({ ...form, [name]: onlyLetters });
  }

  else if (name === "postalCode") {
    // Vetëm numra (max 4)
    if (/[^0-9]/.test(value)) {
      setPostalWarning("Nur Zahlen sind in diesem Feld erlaubt.");
    } else if (value.length > 4) {
      setPostalWarning("PLZ darf nur 4 Ziffern enthalten.");
    } else {
      setPostalWarning("");
    }

    const onlyDigits = value.replace(/\D/g, "").slice(0, 4);
    setForm({ ...form, [name]: onlyDigits });
  }

  else {
    setForm({ ...form, [name]: value });
  }
};

const handleNext = async () => {

  setFormError("");

  if (!validateStep()) {
    return;
  }

  // STEP 2 → kalon në 3
  if (step === 2) {
    setStep(3);
    return;
  }

  // STEP 3 → procesi i pagesës
  if (step === 3 && !testMode) {

    if (!agbAccepted) {
      setFormError("Bitte akzeptieren Sie die AGB, um fortzufahren.");
      scrollToTop();
      return;
    }

    try {
      await handleSubmit({ preventDefault: () => {} });
    } catch (err) {
    }

    return;
  }

  // TEST MODE → kalon direkt në hapin 4
  if (step === 3 && testMode) {
    setStep(4);
    return;
  }

  // default → kalo në hapin tjetër
  setStep((prev) => prev + 1);
};


  useEffect(() => {
    const stepParam = new URLSearchParams(window.location.search).get("step");
    if (stepParam) {
      setStep(Number(stepParam));
    }
  }, []);

  const stripe = useStripe();
  const elements = useElements();
  

  function generateScheduleDates({
    firstDateStr,
    schedules,
    frequency,
    repeatYears = 10,
  }) {
    const weekdays = {
      Montag: 1,
      Dienstag: 2,
      Mittwoch: 3,
      Donnerstag: 4,
      Freitag: 5,
      Samstag: 6,
      Sonntag: 0,
    };

    const firstDate = parse(firstDateStr, "dd.MM.yyyy", new Date());
    const result = [];
    const weeks = repeatYears * 52;

    let step;
    if (frequency === "wöchentlich") step = 7;
    else if (frequency === "alle 2 Wochen") step = 14;
    else step = 7;

    for (const { day, startTime, hours, serviceName, subServiceName } of schedules) {
      if (!day) continue;

      let date = new Date(firstDate);
      while (date.getDay() !== weekdays[day]) {
        date = addDays(date, 1);
      }

      for (let i = 0; i < weeks; i++) {
        result.push({
          date: format(addDays(date, i * step), "yyyy-MM-dd"),
          day,
          startTime,
          hours,
          serviceName: serviceName || null,
          subServiceName: subServiceName || null,
        });
      }
    }

    return result;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("❌ Stripe ist nicht bereit");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert("❌ Kartenfeld fehlt");
      return;
    }

    // 1. Create user before payment (if not already created)
    let currentUserId = userId || null;
    if (!currentUserId) {
      try {
        const userRes = await fetch("/api/register-user-prepayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form }),
        });
        const userData = await userRes.json();
        if (userRes.status === 409 && userData.userId) {
          // User exists, proceed with userId
          currentUserId = userData.userId;
          setUserId(currentUserId);
          sessionStorage.setItem("userId", currentUserId);
        } else if (!userRes.ok || !userData.userId) {
          alert("❌ Fehler beim Anlegen des Benutzers: " + (userData?.message || "Serverfehler"));
          return;
        } else {
          currentUserId = userData.userId;
          setUserId(currentUserId);
          sessionStorage.setItem("userId", currentUserId);
        }
      } catch (err) {
        alert("Fehler beim Anlegen des Benutzers.");
        return;
      }
    }

    let secret = clientSecret;
    if (!secret) {
      try {
        let currentDiscountType = discountType;
        let currentDiscountValue = discountValue;

        if (form.voucher) {
          const res = await fetch("/api/admin/vouchers/use", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: form.voucher }),
          });

          const voucherData = await res.json();

          if (voucherData.success) {
            currentDiscountType = voucherData.discountType;
            currentDiscountValue = voucherData.discountValue;

            setDiscountType(voucherData.discountType);
            setDiscountValue(voucherData.discountValue);
            setVoucherMessage(voucherData.message);
            setVoucherSuccess(true);
          } else {
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        let finalAmount = totalPayment;

        if (currentDiscountType === "percent") {
          finalAmount = totalPayment - (totalPayment * currentDiscountValue) / 100;
        } else if (currentDiscountType === "fixed") {
          finalAmount = totalPayment - currentDiscountValue;
        }

        if (finalAmount < 0) finalAmount = 0;


        // 2. Create PaymentIntent with userId in metadata
        const intentRes = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(finalAmount * 100), userId: currentUserId }),
        });

        const data = await intentRes.json();

        if (!data.clientSecret) {
          alert("❌ clientSecret fehlt. Zahlung kann nicht durchgeführt werden.");
          return;
        }

        secret = data.clientSecret;
      } catch (err) {
        alert("Fehler beim Erstellen der Zahlungsanfrage.");
        return;
      }
    }
    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: form.billingName || `${form.firstName} ${form.lastName}`,
            email: form.billingEmail || form.email,
          },
        },
      });

      if (error) {
        alert("❌ Fehler bei der Karte: " + error.message);
        return;
      }
      const paymentMethodId = paymentIntent.payment_method;
      let generatedSchedules = [];

      if (form.frequency === "einmalig") {
        const firstDate = parse(form.firstDate, "dd.MM.yyyy", new Date());
        generatedSchedules = [
          {
            date: format(firstDate, "yyyy-MM-dd"),
            day: format(firstDate, "EEEE", { locale: de }),
            startTime: form.startTime || "08:00",
            hours: form.hours || 2, 
          },
        ];
      } else if (form.frequency === "monatlich") {
        if (form.monthlyMode === "pattern") {
          generatedSchedules = generateMonthlyDates({
            startDate: form.firstDate,
            weekIndex: form.monthlyWeekIndex,
            dayName: form.monthlyDay,
            startTime: form.startTime || "08:00",
            hours: form.hours || 2,
            countYears: 10,
          });
        } else if (form.monthlyMode === "date") {
          generatedSchedules = generateFixedDayDates({
            startDate: form.firstDate,
            fixedDay: Number(form.fixedDayOfMonth),
            startTime: form.startTime || "08:00",
            hours: form.hours || 2,
            countYears: 10,
          });
        }
      } else {
        generatedSchedules = generateScheduleDates({
          firstDateStr: form.firstDate,
          schedules: form.schedules,
          frequency: form.frequency,
          repeatYears: 10,
        });
      }

      const collectedSubservices = Array.from(
        new Set(
          (form.schedules || []).flatMap((entry) => entry.subServices || [])
        )
      );

      const serviceNameStr = (form.services || []).join(", ") || null;
      const subServiceNameStr = collectedSubservices.join(", ") || null;

      const payload = {
        ...form,
        subServices: collectedSubservices,
        schedules: generatedSchedules.map(s => ({
          ...s,
          serviceName: s.serviceName !== undefined ? s.serviceName : serviceNameStr,
          subServiceName: s.subServiceName !== undefined ? s.subServiceName : subServiceNameStr,
        })),
      };

const res = await fetch("/api/client-register-api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    // -------------------------
    // 🔵 Required fields for API
    // -------------------------
    firstName: form.firstName || "",
    lastName: form.lastName || "",
    email: form.email || "",
    phone: form.phone || "",
    address: form.address || "",
    street: form.street || "",
    postalCode: form.postalCode || "",
    city: form.city || "",

    frequency: form.frequency || "",
    duration: form.duration || "",
    firstDate: form.firstDate,

    // 🔵 Services & Subservices
    services: form.services || [],
    subServices: collectedSubservices || [],

    // 🔵 Payment
    paymentIntentId: form.paymentIntentId,

    // 🔵 Schedule data
    schedules: generatedSchedules || [],

    // 🔵 Optional fields
    anrede: form.anrede || "",
    communicationSehen: form.communicationSehen || "",
communicationHören: form.communicationHören || "",
communicationSprechen: form.communicationSprechen || "",
    kanton: form.kanton || "",

    // ----------------------------------------------------
    // ✅ Fragebogen / Profile fields (SAVE THEM IN DB)
    // ----------------------------------------------------
languages: Array.isArray(form.languages)
  ? form.languages.join(", ")
  : "",
    emergencyContactName: form.emergencyContactName || "",
    emergencyContactPhone: form.emergencyContactPhone || "",

    // Allergies & Health
    hasAllergies: form.allergies || "",
    allergyCheck: form.allergyCheck || "",
    allergies: form.allergies || "",
    allergyDetails: form.allergyDetails || "",
    allergyWhich: form.allergyWhich || "",
    healthFindings: form.healthFindings || "",
    medicalFindings: form.medicalFindings || "",

    // Mobility & Household (ints)
    mobility: form.mobility || "",
mobilityAids: Array.isArray(form.mobilityAids)
  ? form.mobilityAids.join(", ")
  : "",
    householdRooms:
      form.householdRooms === "" || form.householdRooms === undefined
        ? null
        : Number(form.householdRooms),
    householdPeople:
      form.householdPeople === "" || form.householdPeople === undefined
        ? null
        : Number(form.householdPeople),

    // Daily support
    cooking: form.cooking || "",
    jointCooking: form.jointCooking || "",
    shoppingType: form.shoppingType || "",
    shoppingWithClient: form.shoppingWithClient || "",

    // Communication (both versions supported)
    communicationVision: form.communicationVision || "",
    communicationSehen: form.communicationSehen || "",
    communicationHearing: form.communicationHearing || "",
    communicationHören: form.communicationHören || "",
    communicationSpeech: form.communicationSpeech || "",
    communicationSprechen: form.communicationSprechen || "",
    incontinence: Array.isArray(form.incontinence)
  ? form.incontinence.join(", ")
  : "",

  }),
});


const data = await res.json();

if (!res.ok) {
  alert("Fehler beim Registrieren: " + (data?.error || "Serverfehler"));
  return; // ⛔ STOP këtu
}

if (data.userId) {
  // vazhdo normal
}
      if (res.ok && data.userId) {
        const userId = data.userId;

        const setupRes = await fetch("/api/create-setup-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }), 
        });

        const { clientSecret, customerId } = await setupRes.json();

        const setupResult = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${form.firstName} ${form.lastName}`,
              email: form.email,
            },
          },
        });
        if (!setupResult.error) {
          const paymentMethodId = setupResult.setupIntent.payment_method;

          await fetch("/api/save-payment-method", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              stripeCustomerId: customerId,
              stripePaymentMethodId: paymentMethodId,
            }),
          });

          setUserId(userId);
          setIsSubmitted(true);
          setStep(4);
        } else {
          alert(
            "❌ Fehler beim Speichern der Karte: " + setupResult.error.message
          );
        }
      }
    } catch (err) {
      alert("Zahlungsfehler aufgetreten");
    }
  };

  const handleOptionalSubmit = async () => {
    if (!userId) {
      alert("❌ userId fehlt – Registrierung nicht abgeschlossen");
      return;
    }

    const optionalData = { ...form };

    if (
      optionalData.firstDate &&
      typeof optionalData.firstDate === "string" &&
      optionalData.firstDate.includes(".")
    ) {
      const [day, month, year] = optionalData.firstDate.split(".");
      if (day && month && year) {
        const fixedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        if (!isNaN(fixedDate.getTime())) {
          optionalData.firstDate = fixedDate.toISOString();
        } else {
        }
      }
    }

    try {
      const res = await fetch("/api/save-optional-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
body: JSON.stringify({
  userId,
  optionalData,
  // ✅ add these explicitly (or inside optionalData, but keep consistent with API)
  requestFirstName: form.requestFirstName || "",
  requestLastName: form.requestLastName || "",
  requestEmail: form.requestEmail || "",
  requestPhone: form.requestPhone || "",
})
,
      });
      const result = await res.json();
   
  if (res.ok) {
  return true;
}

       else {
        alert("❌ Fehler beim Speichern: " + result.error);
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    const fetchSubServices = async () => {
      if (!service) return;

      try {
        const res = await fetch(
          `/api/subservices?serviceName=${encodeURIComponent(service)}`
        );
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setSubServices(Array.isArray(data) ? data : []);
        setForm((prev) => ({
          ...prev,
          service: service,
          subService: prev.subService || data[0]?.name || "",
        }));
      } catch (err) {
      }
    };

    fetchSubServices();
  }, [service]);

  const steps = testMode
    ? ["Wann?", "Finalisieren", "Abschluss"]
    : ["Wann?", "Finalisieren", "Zahlungdetails", "Abschluss"];

  const parseSwissDate = (str) => {
    const [day, month, year] = str.split(".");
    
    return new Date(`${year}-${month}-${day}`);
  };

  const formatSwissDate = (date) => {
    return format(date, "dd.MM.yyyy");
  };
  const tenDaysFromToday = addDays(new Date(), 1);

  const [allServices, setAllServices] = useState([]);
  useEffect(() => {
    const fetchAllSubServices = async () => {
      if (!form.services || form.services.length === 0) return;

      try {
        const allFetched = await Promise.all(
          form.services.map((srv) =>
            fetch(`/api/subservices?serviceName=${encodeURIComponent(srv)}`)
              .then((res) => (res.ok ? res.json() : []))
              .then((subs) =>
                subs.map((sub) => ({
                  ...sub,
                  parentService: srv,
                }))
              )
          )
        );

        const allSubservices = allFetched.flat();
        const unique = Array.from(
          new Map(allSubservices.map((s) => [s.name, s])).values()
        );

        setSubServices(unique);
        setForm((prev) => ({
          ...prev,
          subServices: prev.subServices?.length
            ? prev.subServices
            : [unique[0]?.name].filter(Boolean),
        }));
      } catch (err) {
      }
    };

    fetchAllSubServices();
  }, [form.services]);
  useEffect(() => {
    if (service) {
      const selected = service
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      setForm((prev) => ({
        ...prev,
        services: selected, 
      }));
    }
  }, [service]);

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setAllServices(data);
      } catch (err) {
      }
    };

    fetchAllServices();
  }, []);
  useEffect(() => {
    if (service) {
      const selected = service
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      setForm((prev) => ({
        ...prev,
        services: selected, 
      }));
    }
  }, [service]);
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

  function TimeDropdown({ value, onChange }) {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (val) => {
      onChange(val);
      setOpen(false);
    };

    return (


      <div className="relative" style={{ width: "120px" }}>
        <div className="time-picker-display" onClick={() => setOpen(!open)}>
          {value || "Select time"}
        </div>
        {open && (
          <div className="time-grid-dropdown">
            {timeOptions.map((time) => (
              <div
                key={time}
                className={`time-option ${value === time ? "selected" : ""}`}
                onClick={() => handleSelect(time)}
              >
                {time}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[+\d\s]*$/;

  const handleChange1 = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Ungültige E-Mail-Adresse" }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }

    if (name === "phone") {
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phone: "Telefonnummer darf nur Zahlen, + und Leerzeichen enthalten",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
    }
  };

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirm = () => setShowConfirm(!showConfirm);


  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });

    setPasswordChecks({
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
      minLength: value.length >= 8,
    });
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    if (form.password !== e.target.value) {
      setError("Passwörter stimmen nicht überein");
    } else {
      setError("");
    }
  };
  const EyeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.05 10.05 0 0112 20c-7 0-11-8-11-8a18.94 18.94 0 014.24-5.31" />
      <path d="M1 1l22 22" />
      <path d="M9.88 9.88a3 3 0 014.24 4.24" />
    </svg>
  );

  const toggleCheckbox = (fieldName, value) => {
    const updated = new Set(form[fieldName] || []);
    updated.has(value) ? updated.delete(value) : updated.add(value);
    setForm((prev) => ({
      ...prev,

      [fieldName]: Array.from(updated),
    }));
  };
  const isEinmalig = form.frequency === "einmalig";
  const isMonatlich = form.frequency === "monatlich";

  const showTravelNotice = form.subServices?.includes(
    "Ausflüge und Reisebegleitung"
  );
  function generateMonthlyDates({
    startDate,
    weekIndex,
    dayName,
    countYears = 10,
    startTime = "08:00",
    hours = 2,
  }) {
    const weekdays = {
      Sonntag: 0,
      Montag: 1,
      Dienstag: 2,
      Mittwoch: 3,
      Donnerstag: 4,
      Freitag: 5,
      Samstag: 6,
    };

    const results = [];
    const baseDate =
      typeof startDate === "string"
        ? parse(startDate, "dd.MM.yyyy", new Date())
        : startDate;
    const months = countYears * 12; 
    const targetDay = weekdays[dayName];

    for (let i = 0; i < months; i++) {
      const monthDate = addMonths(baseDate, i);
      const firstOfMonth = startOfMonth(monthDate);

      let countDay = 0;
      let date = new Date(firstOfMonth);

      while (date.getMonth() === monthDate.getMonth()) {
        if (date.getDay() === targetDay) {
          countDay++;
          const isTargetWeek =
            (weekIndex === "last" &&
              addDays(date, 7).getMonth() !== date.getMonth()) ||
            countDay === parseInt(weekIndex);

          if (isTargetWeek) {
            results.push({
              date: format(date, "yyyy-MM-dd"),
              day: dayName,
              startTime,
              hours,
            });
            break;
          }
        }
        date.setDate(date.getDate() + 1);
      }
    }

    return results;
  }

  function generateFixedDayDates({
    startDate,
    fixedDay,
    startTime,
    hours,
    countYears = 10,
  }) {
    const start = parse(startDate, "dd.MM.yyyy", new Date());
    const results = [];
    const months = countYears * 12; 

    for (let i = 0; i < months; i++) {
      const dateObj = setDate(addMonths(start, i), fixedDay);
      results.push({
        date: format(dateObj, "yyyy-MM-dd"),
        day: format(dateObj, "EEEE", { locale: de }),
        startTime,
        hours,
      });
    }

    return results;
  }
const discountedTotal =
  discountType && discountValue > 0
    ? discountType === "percent"
      ? totalPayment - (totalPayment * discountValue) / 100
      : totalPayment - discountValue
    : totalPayment;


  useEffect(() => {
    if (
      form.frequency === "monatlich" &&
      form.monthlyMode === "date" &&
      form.fixedDayOfMonth
    ) {
      const today = startOfDay(new Date());
      const minAllowedDate = addDays(today, 1); 
      const dayOfMonth = Number(form.fixedDayOfMonth);

      let candidateMonth = new Date();
      let candidateDate = setDate(candidateMonth, dayOfMonth);

      while (isBefore(candidateDate, minAllowedDate)) {
        candidateMonth = addMonths(candidateMonth, 1);
        candidateDate = setDate(candidateMonth, dayOfMonth);
      }
      const formatted = format(candidateDate, "dd.MM.yyyy");

      if (form.autoGeneratedDate || !form.firstDate) {
        setForm((prev) => ({
          ...prev,
          firstDate: formatted,
          autoGeneratedDate: true,
        }));
      }
    }
  }, [form.fixedDayOfMonth, form.frequency, form.monthlyMode]);
const [dateError, setDateError] = useState("");
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    scrollToTop();
  }, [step]);

  const [agbAccepted, setAgbAccepted] = useState(false);
  const [agbError, setAgbError] = useState("");
const [isPaying, setIsPaying] = useState(false);
const handlePayment = async () => {
  try {
    setIsPaying(true); 
    await confirmPayment(); 
  } catch (err) {
  } finally {
    setIsPaying(false); 
  }
};

  function onSubmit(e) {
    e.preventDefault();
    if (!agbAccepted) {
      setAgbError("Bitte akzeptieren Sie die AGB, um fortzufahren.");
      return;
    }
    setAgbError(""); 
    handleSubmit(e); 
  }
  useEffect(() => {
  if (step === 4 && session_id) {
    fetch(`/api/complete-registration?session_id=${session_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.userId) throw new Error("❌ No userId returned");

        return fetch(`/api/get-user-by-id?id=${data.userId}`);
      })
      .then((res) => res.json())
      .then((userData) => {
        setUser(userData);
        setForm((prev) => ({
          ...prev,
          ...userData,
          service: userData.services?.[0]?.name || "",
          postalCode: userData.carePostalCode || userData.postalCode || "",
        }));
      })
      .catch(() => {});
  }
}, [step, session_id]);
  return (
    <div className="min-h-screen bg-white p-2 lg:p-12 flex flex-col lg:flex-row gap-4">
    <div className="flex-1 space-y-8">
      <div className="sticky top-[90px] z-50 bg-white  
                      py-4 flex flex-wrap gap-y-4 justify-center 
                      md:justify-between text-sm md:text-base 
                      font-medium text-[#B99B5F] ">
        {steps.map((label, i) => (
    <div key={i} className="flex-1 flex items-center gap-2">
      <div
        className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
          step > i
            ? "bg-[#B99B5F] text-white"
            : "border-[#B99B5F] text-[#B99B5F]"
        } text-sm font-bold`}
      >
        {i + 1}
      </div>
      <span className={step === i + 1 ? "font-bold" : ""}>{label}</span>
      {i < steps.length - 1 && (
        <div className="flex-1 h-px bg-gray-300 mx-2"></div>
      )}
    </div>
  ))}
</div>
        {formError && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded relative">
            {formError}
          </div>
        )}
<form onSubmit={(e) => e.preventDefault()}
          className="bg-white  p-2 lg:p-8 rounded-xl border-2 border-gray-200 space-y-8 text-base text-gray-800"
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-black">Wie oft & wann?</h2>
              <div className="space-y-4">
              <div ref={frequencyRef} className="space-y-2">
                  <p className="font-medium">
                    Wie oft wünschen Sie Unterstützung?
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "einmalig",
                      "wöchentlich",
                      "alle 2 Wochen",
                      "monatlich",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setForm({ ...form, frequency: option })}
                        className={`px-4 py-3 rounded-lg border text-center w-[140px] ${
                          form.frequency === option
                            ? "border-[#B99B5F] text-[#B99B5F] font-semibold"
                            : "border-gray-300 text-gray-800"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
       {errors.frequency && <p className="text-red-600 text-sm mt-1">{errors.frequency}</p>}
</div>

         {form.frequency === "monatlich" && (
  <div className="space-y-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900">
      Monatlicher Termin wählen
    </h3>
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">
        Art der Auswahl
      </label>
      <select
        value={form.monthlyMode || ""}
        onChange={(e) =>
          setForm({ ...form, monthlyMode: e.target.value })
        }
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
      >
        <option value="">Bitte wählen</option>
        <option value="pattern">Woche + Wochentag</option>
        <option value="date">Fester Kalendertag</option>
      </select>
    </div>
    {form.monthlyMode === "pattern" && (
      <>
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Woche im Monat
          </label>
          <select
            value={form.monthlyWeekIndex || ""}
            onChange={(e) =>
              setForm({ ...form, monthlyWeekIndex: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
          >
            <option value="">Woche wählen</option>
            <option value="1">Erste</option>
            <option value="2">Zweite</option>
            <option value="3">Dritte</option>
            <option value="4">Vierte</option>
            <option value="last">Letzte</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Wochentag
          </label>
          <select
            value={form.monthlyDay || ""}
            onChange={(e) => {
              const weekday = e.target.value;
              const updatedForm = { ...form, monthlyDay: weekday };

              if (updatedForm.monthlyWeekIndex && weekday) {
                const today = new Date();
                const minDate = addDays(today, 1);

                let year = today.getFullYear();
                let month = today.getMonth();

                let candidate = getNthWeekdayOfMonth(
                  year,
                  month,
                  weekday,
                  updatedForm.monthlyWeekIndex
                );

                if (!candidate || candidate < minDate) {
                  month++;
                  if (month > 11) {
                    month = 0;
                    year++;
                  }
                  candidate = getNthWeekdayOfMonth(
                    year,
                    month,
                    weekday,
                    updatedForm.monthlyWeekIndex
                  );
                }

                if (candidate) {
                  const formatted = format(candidate, "dd.MM.yyyy", { locale: de });
                  const weekdayName = format(candidate, "EEEE", { locale: de });

                  setForm({
                    ...updatedForm,
                    firstDate: formatted,
                    schedules: [
                      {
                        ...form.schedules[0],
                        day: weekdayName,
                      },
                      ...form.schedules.slice(1),
                    ],
                  });
                }
              } else {
                setForm(updatedForm);
              }
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
          >
            <option value="">Wochentag wählen</option>
            {[
              "Montag",
              "Dienstag",
              "Mittwoch",
              "Donnerstag",
              "Freitag",
              "Samstag",
              "Sonntag",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </>
    )}
    {form.monthlyMode === "date" && (
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Kalendertag im Monat
        </label>
        <select
          value={form.fixedDayOfMonth || ""}
          onChange={(e) => {
            const day = parseInt(e.target.value, 10);

            const baseDate = form.firstDate
              ? parseSwissDate(form.firstDate)
              : new Date();

            let newDate = new Date(
              baseDate.getFullYear(),
              baseDate.getMonth(),
              day
            );
            const minDate = addDays(new Date(), 1);
            if (newDate < minDate) {
              newDate.setMonth(newDate.getMonth() + 1);
            }
            const formatted = format(newDate, "dd.MM.yyyy", { locale: de });
            const weekday = format(newDate, "EEEE", { locale: de });
            setForm({
              ...form,
              fixedDayOfMonth: day,
              firstDate: formatted,
              schedules: [
                {
                  ...form.schedules[0],
                  day: weekday,
                },
                ...form.schedules.slice(1),
              ],
            });
          }}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
        >
          <option value="">Tag wählen</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Der ausgewählte Tag wird jeden Monat wiederholt (z. B. jeder 15.)
        </p>
      </div>
    )}
  </div>
)}
<div ref={refs.firstDate} className='mt-8 mb-8 w-[300px] max-w-full'>
  <label className="block mb-2 font-medium">Beginndatum auswählen</label>
<DatePicker
  selected={form.firstDate ? parseSwissDate(form.firstDate) : null}
onChange={(date) => {
  if (!date) {
    setForm({ ...form, firstDate: "" });
    return;
  }
  const formatted = format(date, "dd.MM.yyyy", { locale: de });
  const weekday = format(date, "EEEE", { locale: de });

  const updatedSchedules = [...form.schedules];
  if (updatedSchedules.length > 0) {
    updatedSchedules[0].day = weekday;
  }

  setForm({
    ...form,
    firstDate: formatted,
    schedules: updatedSchedules,
  });
  setErrors((prev) => ({ ...prev, firstDate: "" }));
}}

  dateFormat="dd.MM.yyyy"
  locale={de}
  placeholderText="TT.MM.JJJJ"
  minDate={tenDaysFromToday} 
  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
  calendarClassName="rounded-xl shadow-lg border border-gray-300"
  wrapperClassName="w-full"
    disabled={form.frequency === "monatlich"}


/>
  <p className="mt-2 text-sm text-gray-500">
    Es sind nur Termine ab morgen möglich.
  </p>
  {errors.firstDate && <p className="text-red-600 text-sm mt-1">{errors.firstDate}</p>}
</div>
    {form.frequency !== "Einmal" && (
  <div className="space-y-6">
    <p className="font-medium">
      Wann genau wünschen Sie Unterstützung?
    </p>
    <div className="flex items-center gap-4">
      <span className="text-gray-700 font-medium">
        Tage pro Woche:
      </span>
      <button
        type="button"
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            schedules: prev.schedules.slice(
              0,
              Math.max(1, prev.schedules.length - 1)
            ),
          }))
        }
        className="w-8 h-8 text-xl border rounded-full"
      >
        −
      </button>
      <span className="font-semibold">
        {form.schedules.length || 1}
      </span>
      <button
        type="button"
        onClick={() => {
          if (isEinmalig || isMonatlich) return;
          setForm((prev) => {
            const baseSubServices = prev.schedules[0]?.subServices || [];
            return {
              ...prev,
              schedules: [
                ...prev.schedules,
                {
                  day: "",
                  startTime: "08:00",
                  hours: 2,
                  subServices: [],
                },
              ].slice(0, 7),
            };
          });
        }}
        disabled={isEinmalig || isMonatlich}
        className={`w-8 h-8 text-xl border rounded-full ${
          isEinmalig || isMonatlich ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >   +
      </button>
    </div>

{form.schedules.map((entry, i) => (
  <div
    key={i}
    id={`schedule-day-${i}`}
    className={`space-y-6 border-b border-gray-200 pb-8 mb-8 transition-all duration-500 ${
      errorDayIndex === i ? "ring-2 ring-red-500 rounded-md p-4" : ""
    }`}
  >
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <select
            value={entry.day}
            onChange={(e) => {
              const updated = [...form.schedules];
              updated[i].day = e.target.value;
              setForm({ ...form, schedules: updated });
            }}
            className="border px-4 py-2 rounded-md"
            disabled={i === 0 && Boolean(form.firstDate)}
          >
            <option value="">Wochentag wählen</option>
            {[
              "Montag",
              "Dienstag",
              "Mittwoch",
              "Donnerstag",
              "Freitag",
              "Samstag",
              "Sonntag",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <TimeDropdown
            value={entry.startTime}
            onChange={(val) => {
              if (val) {
                const [hourStr, minuteStr] = val.split(":");
                const hour = parseInt(hourStr);
                const minute = parseInt(minuteStr);

                const snappedMinute =
                  minute < 15 ? "00" : minute < 45 ? "30" : "00";
                const nextHour =
                  minute >= 45 ? (hour + 1) % 24 : hour;

                const fixedTime = `${String(nextHour).padStart(
                  2,
                  "0"
                )}:${snappedMinute}`;

                const updated = [...form.schedules];
                updated[i].startTime = fixedTime;
                setForm({ ...form, schedules: updated });
              }
            }}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const updated = [...form.schedules];
                const subServiceCount =
                  updated[i].subServices?.length ?? 0;
                const minHours = Math.max(subServiceCount, 2);
                const current = updated[i].hours ?? 2;

                if (current > minHours) {
                  updated[i].hours = parseFloat(
                    (current - 0.5).toFixed(1)
                  );
                  setForm({ ...form, schedules: updated });
                }
              }}
              disabled={
                form.schedules[i].hours <=
                Math.max(
                  form.schedules[i].subServices?.length ?? 0,
                  2
                )
              }
              className={`w-8 h-8 border rounded-full text-xl flex items-center justify-center ${
                form.schedules[i].hours <=
                Math.max(
                  form.schedules[i].subServices?.length ?? 0,
                  2
                )
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              −
            </button>
            <span className="inline-block w-[60px] text-center">
              {form.schedules[i].hours} Std
            </span>

            <button
              type="button"
              onClick={() => {
                const updated = [...form.schedules];
                const current = updated[i].hours ?? 2;
                if (current < 24) {
                  updated[i].hours = parseFloat((current + 0.5).toFixed(1));
                  setForm({ ...form, schedules: updated });
                }
              }}
              disabled={form.schedules[i].hours >= 24}
              className={`w-8 h-8 border rounded-full text-xl flex items-center justify-center ${form.schedules[i].hours >= 24 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-6 mb-10">
          <label ref={i === 0 ? refs.services : null} className="block mb-3 font-medium text-gray-800 text-center lg:text-left">
            Welche Leistungen möchten Sie beanspruchen? ({entry.day || "Tag " + (i + 1)})
          </label>
          {i === 0 && errors.services && (
            <p className="text-red-600 text-sm mb-2">{errors.services}</p>
          )}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 flex-shrink-0 bg-white border border-gray-200 rounded-xl shadow-sm 
                            lg:sticky lg:top-36 self-start max-h-[70vh] flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 text-center bg-white sticky top-0 z-30 py-4 border-b border-gray-100">
                Ausgewählte Dienstleistungen
              </h3>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {allServices.map((srv) => {
                  const isSelected = (form.services || []).includes(srv.name);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          // Only allow removal if more than one service remains
                          if ((form.services || []).length > 1) {
                            const updatedServices = form.services.filter((s) => s !== srv.name);
                            // Also remove all subservices belonging to this main service
                            const subsToRemove = subServices
                              .filter((sub) => sub.parentService === srv.name)
                              .map((sub) => sub.name);
                            const updatedSchedules = form.schedules.map((sched) => ({
                              ...sched,
                              subServices: (sched.subServices || []).filter(
                                (s) => !subsToRemove.includes(s)
                              ),
                            }));
                            setForm((prev) => ({ ...prev, services: updatedServices, schedules: updatedSchedules }));
                          }
                        } else {
                          const updated = [...form.services, srv.name];
                          setForm((prev) => ({ ...prev, services: updated }));
                        }
                      }}
                      className={`w-full px-4 py-2 text-sm border rounded-lg text-center transition-all duration-200 ${
                        isSelected
                          ? "bg-[#B99B5F] text-white border-[#B99B5F]"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {srv.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {subServices.map((sub) => {
                  const isSelected = entry.subServices?.includes(sub.name);
                  return (
                 <button
  key={sub.id}
  type="button"
  onClick={() => {
    const updated = [...form.schedules];
    const currentList = updated[i].subServices || [];

    const nextSubServices = currentList.includes(sub.name)
      ? currentList.filter((s) => s !== sub.name)
      : [...currentList, sub.name];

    updated[i].subServices = nextSubServices;

    // 2h minimum; each subservice beyond the first 2 adds 0.5h
    const minHours = 2 + Math.max(0, nextSubServices.length - 2) * 0.5;

    // Only raise hours to meet the new minimum; never decrease what the user set
    if ((updated[i].hours ?? 2) < minHours) {
      updated[i].hours = minHours;
    }

    setForm({ ...form, schedules: updated });
  }}
  className={`w-full flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 text-center cursor-pointer ${
    entry.subServices?.includes(sub.name)
      ? "border-[#B99B5F] bg-gradient-to-br from-[#FFF8EA] to-[#FFF2D5] shadow-md scale-[1.02]"
      : "border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#B99B5F]/60 hover:scale-[1.01]"
  }`}
>
  <span className="text-[11px] font-semibold uppercase text-[#B99B5F] opacity-80">
    {sub.parentService}
  </span>
  <span className="text-[15px] font-semibold text-gray-900 mt-2 mb-2 leading-snug">
    {sub.name}
  </span>
  <span
    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
      entry.subServices?.includes(sub.name)
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    {entry.subServices?.includes(sub.name)
      ? "✓ Ausgewählt"
      : "+ Hinzufügen"}
  </span>
</button>
                  );
                })}
              </div>
            </div>
          </div>
    {errorDayIndex === i && (
      <p className="text-red-600 text-sm font-medium mt-2">
        {errorDayMessage}
      </p>
    )}
        </div>
 
      </div>
    ))}
  </div>
)}
      </div>
            </>
          )}
{step === 2 && (
  <>
    <h2 className="text-2xl font-bold text-black">
      Angaben der zu betreuenden Person
    </h2>

    <div className="text-sm text-left mt-6">
      <p>
        Bereits registriert?{" "}
        <span
          className="text-[#B99B5F] font-semibold cursor-pointer underline"
          onClick={() => router.push("/login")}
        >
          Hier einloggen
        </span>
      </p>
    </div>

    <div className="space-y-6 mt-6">
      <div>
        <label className="block font-semibold mb-1">
          Vollständiger Name
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="mb-2">
            <label className="block font-medium mb-1">
              Anrede <span className="text-red-500">*</span>
            </label>
            <select
              name="anrede"
              value={form.anrede || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Bitte wählen</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
            </select>
            {errors.anrede && (
              <p className="text-red-600 text-sm mt-1">{errors.anrede}</p>
            )}
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">
              Vorname <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              placeholder="Vorname"
              value={form.firstName || ""}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">
              Nachname<span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              placeholder="Nachname"
              value={form.lastName || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block  font-medium mb-1">
          Telefonnummer<span className="text-red-500">*</span>
        </label>
        <input
          name="phone"
          value={form.phone}
          placeholder="Telefonnummer"
          onChange={handleChange1}
          onKeyDown={(e) => {
            if (
              !/[0-9+\s]/.test(e.key) &&
              !["Backspace", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          className={inputClass}
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">
          E-Mail<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          value={form.email}
          onChange={handleChange1}
          className={inputClass}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block font-semibold text-base mb-2">Adresse</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Strasse<span className="text-red-500">*</span>
            </label>
            <input
              name="street"
              placeholder="z. B. Bahnhofstrasse"
              value={form.street || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {streetWarning && (
              <p className="text-yellow-600 text-sm mt-1">{streetWarning}</p>
            )}
            {errors.street && (
              <p className="text-red-600 text-sm mt-1">{errors.street}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Hausnummer<span className="text-red-500">*</span>
            </label>
            <input
              name="houseNumber"
              placeholder="z. B. 12a"
              value={form.houseNumber || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.houseNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.houseNumber}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-medium mb-1">
              PLZ<span className="text-red-500">*</span>
            </label>
            <input
              name="postalCode"
              placeholder="z. B. 8000"
              value={form.postalCode || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {postalWarning && (
              <p className="text-yellow-600 text-sm mt-1">{postalWarning}</p>
            )}
            {errors.postalCode && (
              <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Ort<span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              placeholder="z. B. Zürich"
              value={form.city || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">
            Kanton<span className="text-red-500">*</span>
          </label>
          <select
            name="kanton"
            value={form.kanton || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Bitte wählen</option>
            <option value="AG">Aargau</option>
            <option value="AI">Appenzell Innerrhoden</option>
            <option value="AR">Appenzell Ausserrhoden</option>
            <option value="BE">Bern</option>
            <option value="BL">Basel-Landschaft</option>
            <option value="BS">Basel-Stadt</option>
            <option value="FR">Freiburg</option>
            <option value="GE">Genf</option>
            <option value="GL">Glarus</option>
            <option value="GR">Graubünden</option>
            <option value="JU">Jura</option>
            <option value="LU">Luzern</option>
            <option value="NE">Neuenburg</option>
            <option value="NW">Nidwalden</option>
            <option value="OW">Obwalden</option>
            <option value="SG">St. Gallen</option>
            <option value="SH">Schaffhausen</option>
            <option value="SO">Solothurn</option>
            <option value="SZ">Schwyz</option>
            <option value="TG">Thurgau</option>
            <option value="TI">Tessin</option>
            <option value="UR">Uri</option>
            <option value="VD">Waadt</option>
            <option value="VS">Wallis</option>
            <option value="ZG">Zug</option>
            <option value="ZH">Zürich</option>
          </select>
          {errors.kanton && (
            <p className="text-red-600 text-sm mt-1">{errors.kanton}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">
            Land<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value="Schweiz"
            readOnly
            className={`${inputClass} bg-gray-100 cursor-not-allowed`}
          />
        </div>
      </div>
    </div>
  </>
)}


{step === 3 && !testMode && ( <> <h2 className="text-2xl font-bold text-gray-900 mb-6"> Zahlungsdetails 
  <span className="text-red-500">*</span></h2>
  {/* 🎟️ Gutschein Sektion – Modern Input Style */}
<div className="mb-6 mt-3 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="flex items-center gap-3">
      <div>
        <h3 className="font-semibold text-gray-900 text-base">
          Haben Sie einen Gutschein?
        </h3>
        <p className="text-sm text-gray-600">
          Geben Sie Ihren Gutscheincode unten ein.
        </p>
      </div>
    </div>
    <div className="relative w-full sm:w-72">
      <input
        type="text"
        id="voucher"
        placeholder="Gutscheincode eingeben"
        value={form.voucher || ""}
        onChange={(e) => setForm({ ...form, voucher: e.target.value })}
        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#B99B5F] focus:border-[#B99B5F] outline-none transition shadow-sm hover:border-[#B99B5F]/50"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔑</span>
    </div>
  </div>

  <div className="mt-3 flex justify-end">
 <button
  type="button"
  onClick={handleVoucherCheck}
  disabled={voucherLoading}
  className={`text-[#B99B5F] font-medium hover:text-[#a88d55] hover:underline transition ${
    voucherLoading ? "opacity-60 cursor-not-allowed" : ""
  }`}
>
  {voucherLoading ? "Wird überprüft..." : "Einlösen →"}
</button>
  </div>

  {voucherMessage && (
    <p
      className={`mt-2 text-sm ${
        voucherSuccess ? "text-green-600" : "text-red-600"
      }`}
    >
      {voucherMessage}
    </p>
  )}

<div className="mt-3 text-sm text-gray-700 border-t border-gray-100 pt-3">
  {discountType && discountValue > 0 ? (
    <>
      <p>
        Originalpreis:{" "}
        <span className="line-through text-gray-500">
          {totalPayment.toFixed(2)} CHF
        </span>
      </p>
      <p className="text-green-700 font-semibold">
        Neuer Gesamtbetrag: {discountedTotal.toFixed(2)} CHF
      </p>
    </>
  ) : (
    <p className="font-medium text-gray-800">
      Gesamtbetrag: {totalPayment.toFixed(2)} CHF
    </p>
  )}
</div>

</div>

 <div className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white">
   <CardElement   key={step} options={{ style:
     { base: { fontSize: "16px", color: "#1f2937", fontFamily: "system-ui, sans-serif", 
     "::placeholder": { color: "#9ca3af" }, }, invalid: { color: "#ef4444" }, }, 
     }} /> </div>
      {/* Hinweise */} <div className="mt-4 space-y-2"> <p className="text-sm sm:text-base text-gray-600">
       Alle Zahlungen werden sicher verarbeitet. </p> <p className="text-sm sm:text-base text-gray-600">
         Ihre Karte wird erst{" "} <span className="font-medium text-gray-800 block sm:inline"> 
          48 Stunden nach erfolgter Dienstleistung </span>{" "} belastet.
           </p> </div> 
         <div className="flex items-start mt-6 bg-gray-50 p-3 rounded-lg border
            border-gray-200"> <input type="checkbox" id="agb"
             checked={agbAccepted} onChange={(e) => { setAgbAccepted(e.target.checked); 
             if (e.target.checked) setAgbError(""); }} className="mt-1 mr-3 w-4 h-4 text-[#B99B5F]
              border-gray-300 rounded focus:ring-[#B99B5F]" /> 
              <label htmlFor="agb" className="text-sm text-gray-700 leading-relaxed" > 
                Ich akzeptiere die{" "} <a href="/AVB" className="text-[#B99B5F] underline font-medium" 
                target="_blank" rel="noopener noreferrer" > AVB </a> . </label> </div> {agbError && 
                ( <p className="text-red-600 text-sm mt-2">{agbError}</p> )} </> )}
          {(testMode ? step === 3 : step === 4) && (
            <>
              <div className="space-y-8 mt-6">
                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                  <h3 className="font-bold text-[20px] mb-6">
                    Angaben der zu betreuenden Person (Zusammenfassung)
                  </h3>
                  <div>
                    <h4 className="font-[600] text-[16px] ">Einsatzort</h4>
                    <p className="text-[14px] font-semibold mb-4">
                      zu betreuende Person
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div className="mb-2">
                        <label className="block font-medium mb-1">
                          Vorname
                        </label>
                        <input
                          name="firstName"
                          placeholder="Vorname"
                          defaultValue={form.firstName || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block font-medium mb-1">
                          Nachname
                        </label>
                        <input
                          name="lastName"
                          placeholder="Nachname"
                          value={form.lastName || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block font-medium mb-1">
                          Telefonnummer{" "}
                        </label>
                        <input
                          name="phone"
                          placeholder="Telefonnummer"
                          value={form.phone || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block font-medium mb-1">Email</label>
                        <input
                          name="email"
                          placeholder="Email"
                          value={form.email || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="mb-2">
                        <label className="block font-medium mb-1">
                          Adresse
                        </label>
                        <input
                          name="street"
                          placeholder="Adresse"
                          onChange={handleChange}
                          value={form.street || ""}
                          className={inputClass}
                        />
                      </div>

                      <div className="mb-2">
                        <label className="block font-medium mb-1">
                          Stockwerk / Eingangscode
                        </label>
                        <input
                          name="entranceLocation"
                          placeholder="Stockwerk / Eingangscode"
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>

                      <div className="mb-2">
                        <label className="block font-medium mb-1">PLZ</label>
                        <input
                          type="number"
                          name="postalCode"
                          placeholder="PLZ"
                          value={form.postalCode || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>

                      <div className="mb-2">
                        <label className="block font-medium mb-1">Ort</label>
                        <input
                          name="city"
                          placeholder="Ort"
                          value={form.city || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
<div className="mb-8">
  <h4 className="font-[600] text-[16px] mb-4">Zu betreuende Person</h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="mb-2">
      <label className="block font-medium mb-1">Vorname</label>
      <input
        name="careFirstName"
        placeholder="Vorname"
        value={form.careFirstName || ""}
        onChange={handleChange}
        className={inputClass}
      />
    </div>
    <div className="mb-2">
      <label className="block font-medium mb-1">Nachname</label>
      <input
        name="careLastName"
        placeholder="Nachname"
        value={form.careLastName || ""}
        onChange={handleChange}
        className={inputClass}
      />
    </div>
    <div className="mb-2">
      <label className="block font-medium mb-1">Telefonnummer</label>
      <input
        name="carePhone"
        placeholder="z. B. +41 79 000 00 00"
        value={form.carePhone || ""}
        onChange={handleChange}
        className={inputClass}
      />
    </div>
  </div>
</div>

<div className="mb-8">
  <h4 className="font-[600] text-[16px] mb-2">Anfragende Person</h4>
  <div className="mb-4">
    <label className="inline-flex items-center gap-2 text-sm text-gray-800">
      <input
        type="checkbox"
        checked={sameAsEinsatzort}
        onChange={() => setSameAsEinsatzort(!sameAsEinsatzort)}
        className="w-5 h-5 accent-[#B99B5F]"
      />
      <span>Angaben übernehmen</span>
    </label>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="mb-2">
      <label className="block font-medium mb-1">
        Vorname <span className="text-red-500">*</span>
      </label>
      <input
        name="requestFirstName"
        placeholder="Vorname"
        value={form.requestFirstName || ""}
        onChange={handleChange}
        readOnly={sameAsEinsatzort}
        required
        className={`${inputClass} ${
          sameAsEinsatzort ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      {errors.requestFirstName && (
  <p className="text-red-500 text-sm mt-1">{errors.requestFirstName}</p>
)}
    </div>

    <div className="mb-2">
      <label className="block font-medium mb-1">
        Nachname <span className="text-red-500">*</span>
      </label>
      <input
        name="requestLastName"
        placeholder="Nachname"
        value={form.requestLastName || ""}
        onChange={handleChange}
        readOnly={sameAsEinsatzort}
        required
        className={`${inputClass} ${
          sameAsEinsatzort ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      {errors.requestLastName && (
  <p className="text-red-500 text-sm mt-1">{errors.requestLastName}</p>
)}

    </div>
    <div className="mb-2">
      <label className="block font-medium mb-1">
        Telefonnummer <span className="text-red-500">*</span>
      </label>
      <input
        name="requestPhone"
        placeholder="Telefonnummer"
        value={form.requestPhone || ""}
        onChange={handleChange}
        readOnly={sameAsEinsatzort}
        required
        className={`${inputClass} ${
          sameAsEinsatzort ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      {errors.requestPhone && (
  <p className="text-red-500 text-sm mt-1">{errors.requestPhone}</p>
)}
    </div>
    <div className="mb-2">
      <label className="block font-medium mb-1">
        Email <span className="text-red-500">*</span>
      </label>
      <input
        name="requestEmail"
        placeholder="Email"
        type="email"
        value={form.requestEmail || ""}
        onChange={handleChange}
        readOnly={sameAsEinsatzort}
        required
        className={`${inputClass} ${
          sameAsEinsatzort ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      {errors.requestEmail && (
  <p className="text-red-500 text-sm mt-1">{errors.requestEmail}</p>
)}
    </div>
  </div>
</div>

                    <div className="mb-6">
                      <p className="font-[600] text-[16px] mb-1">
                        Ankunftsbedingungen
                      </p>

                      <div className="flex flex-wrap items-center gap-6">
                        {[
                          "Schlüssel ist hinterlegt",
                          "Es ist jemand zu Hause",
                        ].map((option) => (
                          <label
                            key={option}
                            className="inline-flex items-center gap-2 text-sm text-gray-800"
                          >
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-[#B99B5F]"
                              checked={form.arrivalConditions?.includes(option)}
                              onChange={() =>
                                toggleCheckbox("arrivalConditions", option)
                              }
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>

                      {form.arrivalConditions?.includes(
                        "Schlüssel ist hinterlegt"
                      ) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">
                            Wo ist der Schlüssel hinterlegt?
                          </label>
                          <input
                            name="keyLocation"
                            placeholder="z. B. unter der Fussmatte, beim Nachbarn..."
                            onChange={handleChange}
                            className={inputClass}
                          />
                        </div>
                      )}

                      {form.arrivalConditions?.length === 0 && (
                        <p className="text-red-600 text-sm mt-2">
                          Bitte wählen Sie mindestens eine Option aus: Schlüssel
                          oder jemand ist zu Hause.
                        </p>
                      )}
                    </div>
           <div className="mb-4">
  <label className="block font-[600] mb-1">
    Parkplatz vorhanden? <span className="text-red-500">*</span>
  </label>
  <select
    name="hasParking"
    value={form.hasParking || ""}
    onChange={handleChange}
    className={inputClass}
    required
  >
    {errors.hasParking && (
  <p className="text-red-500 text-sm mt-1">{errors.hasParking}</p>
)}
    <option value="">Bitte auswählen</option>
    <option value="Ja">Ja</option>
    <option value="Nein">Nein</option>
  </select>

  {form.hasParking === "Ja" && (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">
        Ort (Parkplatz) <span className="text-red-500">*</span>
      </label>
      <input
        name="parkingLocation"
        placeholder="z. B. vor dem Haus, Tiefgarage..."
        value={form.parkingLocation || ""}
        onChange={handleChange}
        className={inputClass}
        required={form.hasParking === "Ja"} // ✅ Obligative only if “Ja”
      />
          {errors.parkingLocation && (
      <p className="text-red-500 text-sm mt-1">{errors.parkingLocation}</p>
    )}
    </div>
  )}
</div>

                    <div>
                      <div className="mb-2">
                        <label className="block font-medium mb-1">
                          Wo befindet sich der Eingang?
                        </label>
                        <input
                          name="entranceDescription"
                          placeholder="Wo befindet sich der Eingang?"
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block font-medium mb-1">
                        Zusätzliche Informationen hinzufügen
                      </label>
                      <textarea
                        name="additionalNotes"
                        placeholder="Gibt es etwas, das wir wissen sollten? (z. B. besondere Wünsche, Hinweise etc.)"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
                        rows={4}
                      />
                    </div>

                </div>
<div className="mb-2">
  <h2 className="text-xl font-bold mb-2">Fragebogen</h2>
  <p className="text-gray-700">
    Mit Angabe folgender Informationen können wir unsere Dienstleistung noch 
    individueller für Sie gestalten. Wir freuen uns auf Ihre Bedürfnisse einzugehen.
  </p>
</div>
                {(form.services || []).some(s => s.includes("Alltagsbegleitung")) && (
                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                  <h2 className="font-bold text-[20px] mb-6">
                    {" "}
                    Alltagsbegleitung & Besorgungen
                  </h2>
                  <h3 className="font-medium mb-1">Begleitung zu Terminen</h3>
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-6">
                      {["Arzt", "Physiotherapie", "Behördengänge"].map(
                        (term) => (
                          <label
                            key={term}
                            className="inline-flex items-center gap-2 text-sm text-gray-800"
                          >
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                              checked={form.accompanimentAppointments?.includes(
                                term
                              )}
                              onChange={() => {
                                const updated = new Set(
                                  form.accompanimentAppointments || []
                                );
                                updated.has(term)
                                  ? updated.delete(term)
                                  : updated.add(term);
                                setForm((prev) => ({
                                  ...prev,
                                  accompanimentAppointments:
                                    Array.from(updated),
                                }));
                              }}
                            />
                            <span>{term}</span>
                          </label>
                        )
                      )}
                    </div>
                    <div className="mt-4">
                      <input
                        name="accompanimentOther"
                        placeholder="Sonstiges"
                        value={form.accompanimentOther || ""}
                        onChange={handleChange}
                        className="bg-white border border-gray-300 rounded-md p-3 w-full"
                      />
                    </div>
                  </div>
                  <h3 className="font-[600] text-[16px] mb-4">Einkäufe</h3>
                  <div className="mb-4">
                    <label className="block font-medium mb-1">
                      Begleitung durch die PHC?
                    </label>
                    <select
                      name="shoppingWithClient"
                      value={form.shoppingWithClient || ""}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 rounded-md p-3 w-full"
                    >
                      <option value="">Bitte auswählen</option>
                      <option value="Ja">Ja</option>
                      <option value="Nein">Nein</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <p className="font-medium mb-1">Art der Einkäufe</p>
                    <div className="flex flex-wrap gap-6">
                      {["Lebensmittel", "Apotheke", "Garten", "Kleidung"].map(
                        (item) => (
                          <label
                            key={item}
                            className="inline-flex items-center gap-2 text-sm text-gray-800"
                          >
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                              checked={form.shoppingItems?.includes(item)}
                              onChange={() => {
                                const updated = new Set(
                                  form.shoppingItems || []
                                );
                                updated.has(item)
                                  ? updated.delete(item)
                                  : updated.add(item);
                                setForm((prev) => ({
                                  ...prev,
                                  shoppingItems: Array.from(updated),
                                }));
                              }}
                            />
                            <span>{item}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">Postgänge</h3>

                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="mailboxKeyLocation"
                      placeholder="Wo ist der Briefkastenschlüssel?"
                      value={form.mailboxKeyLocation || ""}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 rounded-md p-3 w-full"
                    />
                    <input
                      name="mailboxDetails"
                      placeholder="Welches Postfach?"
                      value={form.mailboxDetails || ""}
                      onChange={handleChange}
                      className="bg-white border border-gray-300 rounded-md p-3 w-full"
                    />
                  </div>
                  <h3 className="font-medium mb-1">Weitere Begleitungen</h3>

                  <div>
                    <textarea
                      name="additionalAccompaniment"
                      value={form.additionalAccompaniment || ""}
                      onChange={handleChange}
                      placeholder="Details hier eintragen"
                      className="bg-white border border-gray-300 rounded-md p-3 w-full"
                    />
                  </div>
                </div>
)}
                {(form.services || []).some(s => s.includes("Freizeit")) && (
<div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">

  <h2 className="font-bold text-[20px] mb-6">
    Freizeit & soziale Aktivitäten
  </h2>

  <h3 className="font-[600] text-[16px] mb-4">Aktivitäten</h3>

  <div className="space-y-6">
    {[
      ["Gesellschaft leisten", "companionship"],
      ["Gemeinsames Kochen", "cookingTogether"],
      ["Biografiearbeit", "biographyWork"],
      ["Vorlesen", "reading"],
      ["Gesellschaftspiele", "cardGames"],
    ].map(([label, name]) => (
      <div key={name}>
        <label className="block font-medium mb-1">{label}</label>
        <select
          name={name}
          value={form[name] || ""}
          onChange={handleChange}
          className="bg-white border border-gray-300 rounded-md p-3 w-full focus:border-[#B99B5F] focus:ring-[#B99B5F]/30 transition"
        >
          <option value="">Bitte auswählen</option>
          <option value="Ja">Ja</option>
          <option value="Nein">Nein</option>
        </select>
      </div>
    ))}
  </div>

  <h3 className="font-[600] text-[16px] mb-2 mt-6">Ausflüge & Reisebegleitung</h3>

  <div className="flex flex-wrap items-center gap-6 mt-2">
    {[
      "Theaterbesuch",
      "Kinobesuch",
      "Konzertbesuch",
      "Fussballspiel",
      "Urlaubsbegleitung",
    ].map((trip) => (
      <label
        key={trip}
        className="inline-flex items-center gap-2 text-sm text-gray-800"
      >
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.trips?.includes(trip)}
          onChange={() => {
            const updated = new Set(form.trips || []);
            updated.has(trip) ? updated.delete(trip) : updated.add(trip);
            setForm((prev) => ({
              ...prev,
              trips: Array.from(updated),
            }));
          }}
        />
        <span>{trip}</span>
      </label>
    ))}
  </div>
</div>
                )}
                {(form.services || []).some(s => s.includes("Alltagsbegleitung") || s.includes("Freizeit") || s.includes("Gesundheit")) && (
                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">

                  <h2 className="font-bold text-[20px] mb-6">
                    {" "}
                   Gesundheitsinformationen
                  </h2>
                  <h3 className="font-[600] text-[16px] mb-4">
                    Körperliche Unterstützung
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block font-medium mb-1">
                        Grösse (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        placeholder="Grösse (cm)"
                        value={form.height || ""}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      {" "}
                      <label className="block font-medium mb-1">
                        Gewicht (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        placeholder="Gewicht (kg)"
                        value={form.weight || ""}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="block  font-medium mb-1">Zustand</p>
                    <div className="flex flex-wrap gap-6">
                      {[
                        "Vollständig mobil",
                        "Sturzgefährdet",
                        "Bettlägerig",
                        "Hilfe beim Aufstehen",
                        "Hilfe beim Toilettengang",
                        "Hilfe beim Umlagern, kann sich nicht selbständig bewegen",
                      ].map((cond) => (
                        <label
                          key={cond}
                          className="inline-flex items-center gap-2 text-sm text-gray-800"
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                            checked={form.physicalCondition?.includes(cond)}
                            onChange={() => {
                              const updated = new Set(
                                form.physicalCondition || []
                              );
                              updated.has(cond)
                                ? updated.delete(cond)
                                : updated.add(cond);
                              setForm((prev) => ({
                                ...prev,
                                physicalCondition: Array.from(updated),
                              }));
                            }}
                          />
                          <span>{cond}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <h3 className="block  font-medium mb-1">
                    Vorhandene Hilfsmittel
                  </h3>
                  <div className="mb-4 flex flex-wrap gap-6">
                    {[
                      "Gehstock",
                      "Rollator",
                      "Rollstuhl",
                      "Hebesitz",
                      "Pflegebett",
                      "Patientenlift",
                      "Badewannenlift",
                      "Toilettenstuhl",
                    ].map((tool) => (
                      <label
                        key={tool}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.careTools?.includes(tool)}
                          onChange={() => {
                            const updated = new Set(form.careTools || []);
                            updated.has(tool)
                              ? updated.delete(tool)
                              : updated.add(tool);
                            setForm((prev) => ({
                              ...prev,
                              careTools: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{tool}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    name="careToolsOther"
                    placeholder="Sonstige"
                    value={form.careToolsOther || ""}
                    onChange={handleChange}
                    className={inputClass + " mb-6"}
                  />
                  <h3 className="font-[600] text-[16px] mb-4">Mobilität</h3>
                  <div className="mb-4">
                    <p className="font-medium mb-2">Verfügbare Hilfsmittel</p>
                    <div className="flex flex-wrap gap-6">
                      {["Rollstuhl", "Rollator", "Gehstock"].map((aid) => (
                        <label
                          key={aid}
                          className="inline-flex items-center gap-2 text-sm text-gray-800"
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                            checked={form.mobilityAids?.includes(aid)}
                            onChange={() => toggleCheckbox("mobilityAids", aid)}
                          />
                          <span>{aid}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <h3 className="block  font-medium mb-1">Inkontinenz</h3>
                  <div className="mb-6 flex flex-wrap gap-6">
                    {["Urin", "Stuhl", "Dauerkatheter", "Stoma"].map((inc) => (
                      <label
                        key={inc}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.incontinence?.includes(inc)}
                          onChange={() => {
                            const updated = new Set(form.incontinence || []);
                            updated.has(inc)
                              ? updated.delete(inc)
                              : updated.add(inc);
                            setForm((prev) => ({
                              ...prev,
                              incontinence: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{inc}</span>
                      </label>
                    ))}
                  </div>
                  <h3 className="block  font-medium mb-1">Kommunikation</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div>
    <label className="block text-sm font-medium">Sehen</label>
    <select
      name="communicationSehen"
      value={form.communicationSehen || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte auswählen</option>
      <option value="Keine Probleme">Keine Probleme</option>
      <option value="Eingeschränkt">Eingeschränkt</option>
      <option value="Nahezu blind">Nahezu blind</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium">Hören</label>
    <select
      name="communicationHören"
      value={form.communicationHören || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte auswählen</option>
      <option value="Keine Probleme">Keine Probleme</option>
      <option value="Eingeschränkt">Eingeschränkt</option>
      <option value="Nahezu taub">Nahezu taub</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium">Sprechen</label>
    <select
      name="communicationSprechen"
      value={form.communicationSprechen || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte auswählen</option>
      <option value="Keine Probleme">Keine Probleme</option>
      <option value="Eingeschränkt">Eingeschränkt</option>
      <option value="Nicht möglich">Nicht möglich</option>
    </select>
  </div>

</div>


                  <h3 className="block  font-medium mb-1">Nahrungsaufnahme</h3>
                  <div className="mb-6 flex flex-wrap gap-6">
                    {[
                      "Unterstützung notwendig",
                      "Nahrung anreichen notwendig",
                      "Flüssigkeitsaufnahme kontrollieren oder unterstützen",
                      "Probleme beim Schlucken",
                      "Appetitlosigkeit",
                    ].map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.nutritionSupport?.includes(item)}
                          onChange={() => {
                            const updated = new Set(
                              form.nutritionSupport || []
                            );
                            updated.has(item)
                              ? updated.delete(item)
                              : updated.add(item);
                            setForm((prev) => ({
                              ...prev,
                              nutritionSupport: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>

                  <h3 className="block  font-medium mb-1">Grundpflege</h3>
                  <div className="mb-4 flex flex-wrap gap-6">
                    {["Körperhygiene", "An-/Auskleiden"].map((item) => (
                      <label
                        key={item}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.basicCare?.includes(item)}
                          onChange={() => {
                            const updated = new Set(form.basicCare || []);
                            updated.has(item)
                              ? updated.delete(item)
                              : updated.add(item);
                            setForm((prev) => ({
                              ...prev,
                              basicCare: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    name="basicCareOther"
                    placeholder="Sonstige"
                    value={form.basicCareOther || ""}
                    onChange={handleChange}
                    className={inputClass + " mb-6"}
                  />
                  <h3 className="font-[600] text-[16px] mb-4">
                    Geistiger Zustand
                  </h3>

                  {/* Diagnosen */}
                  <p className="block  font-medium mb-2">Diagnosen</p>
                  <div className="mb-6 flex flex-wrap gap-6">
                    {["Depression", "Demenz", "Alzheimer"].map((diag) => (
                      <label
                        key={diag}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.diagnoses?.includes(diag)}
                          onChange={() => {
                            const updated = new Set(form.diagnoses || []);
                            updated.has(diag)
                              ? updated.delete(diag)
                              : updated.add(diag);
                            setForm((prev) => ({
                              ...prev,
                              diagnoses: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{diag}</span>
                      </label>
                    ))}
                  </div>
                  <p className="block  font-medium mb-2">Verhaltensmerkmale</p>
                  <div className="mb-6 flex flex-wrap gap-6">
                    {[
                      "Gestörter Tag-/Nachtrhythmus",
                      "Weglauftendenz",
                      "Persönlichkeitsveränderungen",
                      "Aggressivität",
                      "Apathie",
                      "Starke Unruhe",
                    ].map((trait) => (
                      <label
                        key={trait}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.behaviorTraits?.includes(trait)}
                          onChange={() => {
                            const updated = new Set(form.behaviorTraits || []);
                            updated.has(trait)
                              ? updated.delete(trait)
                              : updated.add(trait);
                            setForm((prev) => ({
                              ...prev,
                              behaviorTraits: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{trait}</span>
                      </label>
                    ))}
                  </div>

                  <textarea
                    name="healthFindings"
                    value={form.healthFindings || ""}
                    onChange={handleChange}
                    placeholder="Gesundheitsbefunde"
                    className={inputClass}
                  />
                </div>

                )}
                {(form.services || []).some(s => s.includes("Haushalt")) && (
                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">
                  <h2 className="font-bold text-[20px] mb-6">
                    {" "}
                    Haushaltshilfe & Wohnpflege
                  </h2>
                  <h3 className="font-[600] text-[16px] mb-4">Allgemeines</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        className="block font-medium mb-1"
                        htmlFor="roomCount"
                      >
                        Anzahl Zimmer
                      </label>
                      <input
                        type="number"
                        id="roomCount"
                        name="roomCount"
                        placeholder="Anzahl Zimmer"
                        value={form.roomCount || ""}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label
                        className="block font-medium mb-1"
                        htmlFor="householdSize"
                      >
                        Wieviel-Personen-Haushalt?
                      </label>
                      <input
                        type="number"
                        id="householdSize"
                        name="householdSize"
                        placeholder="Wieviel-Personen-Haushalt?"
                        value={form.householdSize || ""}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <h3 className="font-[600] text-[16px] mb-4">Tätigkeiten</h3>
                  <label className="block font-medium mb-2">
                    Ihre Tätigkeiten aus
                  </label>

                  <div className="flex flex-wrap gap-6 mb-4">
                    {[
                      "Balkon- & Blumenpflege",
                      "Waschen / Bügeln / Verräumen",
                      "Kochen",
                      "Fenster putzen",
                      "Bettwäsche wechseln",
                      "Aufräumen",
                      "Abfall trennen / entsorgen",
                      "Abstauben",
                      "Staubsaugen",
                      "Boden wischen",
                      "Vorhänge reinigen",
                    ].map((task) => (
                      <label
                        key={task}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.householdTasks?.includes(task)}
                          onChange={() => {
                            const updated = new Set(form.householdTasks || []);
                            updated.has(task)
                              ? updated.delete(task)
                              : updated.add(task);
                            setForm((prev) => ({
                              ...prev,
                              householdTasks: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{task}</span>
                      </label>
                    ))}
                  </div>
                  {form.householdTasks?.includes("Kochen") && (
                    <div className="mb-4">
                      <label className="block font-medium text-gray-800 mb-1">
                        Für wie viele Personen wird gekocht?
                      </label>
                      <input
                        type="number"
                        name="cookingForPeople"
                        placeholder="Anzahl Personen"
                        value={form.cookingForPeople || ""}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
                )}

                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">
                  <h2 className="font-bold text-[20px] mb-6">
                    {" "}
          Sonstige Angaben          
                  </h2>
                  <h3 className="font-medium mb-2">
                 Wunschsprache der Betreuungsperson
                  </h3>
                  <div className="flex flex-wrap gap-6 mb-4">
                    {[
                      "CH-Deutsch",
                      "Deutsch",
                      "Englisch",
                      "Französisch",
                      "Italienisch",
                    ].map((lang) => (
                      <label
                        key={lang}
                        className="inline-flex items-center gap-2 text-sm text-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
                          checked={form.languages?.includes(lang)}
                          onChange={() => {
                            const updated = new Set(form.languages || []);
                            updated.has(lang)
                              ? updated.delete(lang)
                              : updated.add(lang);
                            setForm((prev) => ({
                              ...prev,
                              languages: Array.from(updated),
                            }));
                          }}
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mb-6">
                    <input
                      name="languageOther"
                      placeholder="Sonstige Sprache"
                      value={form.languageOther || ""}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                 <h3 className="font-medium mb-1">Haustiere im Haushalt?</h3>
<div className="mb-4">
<select
   name="hasPets"
    value={form.hasPets || ""}
    onChange={handleChange}
    className={inputClass}
    required
  >

    <option value="">Bitte auswählen</option>
    <option value="Ja">Ja</option>
    <option value="Nein">Nein</option>
  </select>

  {errors.hasPets && (
    <p className="text-red-500 text-sm mt-1">{errors.hasPets}</p>
  )}

  {form.hasPets === "Ja" && (
    <>
      <input
        name="petDetails"
        placeholder="Welche Haustiere?"
        value={form.petDetails || ""}
        onChange={handleChange}
        required={form.hasPets === "Ja"}
        className={inputClass + " mt-2"}
      />
      {errors.petDetails && (
        <p className="text-red-500 text-sm mt-1">{errors.petDetails}</p>
      )}
    </>
  )}
</div>

<div>
  <label className="block font-medium mb-1">Allergien</label>
  
  {/* Select për përgjigjen */}
  <select
    name="hasAllergies"
    value={form.hasAllergies || ""}
    onChange={handleChange}
    className={inputClass}
    required={requiresAllergyInfo}
  >
    <option value="">Bitte auswählen</option>
    <option value="Ja">Ja</option>
    <option value="Nein">Nein</option>
  </select>

  {/* ⛔️ Error message për dropdown */}
  {errors.hasAllergies && (
    <p className="text-red-500 text-sm mt-1">{errors.hasAllergies}</p>
  )}

  {/* Input për detajet kur zgjedh “Ja” */}
  {form.hasAllergies === "Ja" && (
    <>
      <input
        name="allergyDetails"
        placeholder="Welche?"
        value={form.allergyDetails || ""}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded-md p-3 w-full mt-2"
        required={requiresAllergyInfo}
      />

      {/* ⛔️ Error message për detajet */}
      {errors.allergyDetails && (
        <p className="text-red-500 text-sm mt-1">{errors.allergyDetails}</p>
      )}
    </>
  )}
</div>

                </div>
                              </div>
                          </>
          )}
{step === 5 && (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 animate-fadeIn">
    <div className="bg-white shadow-xl rounded-3xl p-10 max-w-lg w-full text-center relative overflow-hidden">
 
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#B99B5F]/20 to-transparent rounded-full blur-3xl"></div>

      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 shadow-inner shadow-green-200 relative">
          <div className="absolute inset-0 rounded-full bg-green-200 blur-2xl opacity-40 animate-pulse"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-10 h-10 text-green-600 relative z-10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        Vielen Dank!
      </h1>

      <p className="text-gray-600 leading-relaxed mb-2">
        Der Registrierungsprozess wurde erfolgreich abgeschlossen.
      </p>

      <p className="text-gray-600 leading-relaxed mb-8">
        Überprüfen Sie Ihre E-Mail für die Zugangsdaten zum PHC-Portal.
      </p>
      <a
        href="/"
        className="inline-block px-8 py-3 bg-[#B99B5F] text-white font-medium rounded-full shadow-md hover:bg-[#a88d55] hover:shadow-lg transition-all duration-300"
      >
        Zurück zur Website
      </a>
    </div>
  </div>
)}

          <div className="pt-6 flex justify-end gap-4">
            {step !== 5 && (
  <div className="pt-6 flex justify-end gap-4">
    {step > 1 && (
      <button
        type="button"
        onClick={() => setStep((s) => s - 1)}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg"
      >
        Zurück
      </button>
    )}
{step === 4 ? (
  <button
    type="button"
    onClick={async () => {
      if (!validateStep()) return;

      setFormError("");

      try {
        setLoadingStep4(true);
        await handleOptionalSubmit();   // 🔥 këtu ruhen të dhënat
        setStep(5);                    // 🔥 këtu shkon te Vielen Dank
      } catch (err) {
        setFormError(
          "Beim Speichern der zusätzlichen Angaben ist ein Fehler aufgetreten."
        );
      } finally {
        setLoadingStep4(false);
      }
    }}
    className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg disabled:opacity-50"
    disabled={loadingStep4}
  >
    {loadingStep4 ? "Bitte warten..." : "Weiter"}
  </button>
)


: step === 3 ? (
  <>
    <button
      type="button"
      onClick={() => {
        setLoading(true);
        handleNext().finally(() => setLoading(false));
      }}
      className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg font-semibold hover:bg-[#a88d55] transition"
      style={{
        position: "relative",
        zIndex: 50, 
        pointerEvents: "auto", 
      }}
    >
      Jetzt buchen & weiter
    </button>

    {loading && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
          <p className="text-lg font-medium text-gray-700 animate-pulse">
            ⏳ Wir verarbeiten Ihre Daten…
          </p>
        </div>
      </div>
    )}
  </>
) : (
  <button
    type="button"
    onClick={handleNextStep}
    className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg font-semibold hover:bg-[#a88d55] transition"
  >
    Weiter
  </button>
)
}
  </div>
)}
          </div>
        </form>
      </div>
{!(testMode ? step === 3 : step === 4) && step !== 5 && <div className="w-full md:w-96 space-y-3">
  <div
  ref={summaryRef}
  className="sticky top-20 bg-white border border-gray-200 rounded-xl p-8 shadow space-y-6"
>

  <h2 className="text-lg font-semibold text-[#B99B5F] mb-2">Sie haben es bald geschafft, wir benötigen nur noch wenige Angaben.</h2>
  <h3 className="text-xl font-bold text-gray-800 mb-2">Zusammenfassung</h3>

  <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
        {/* Show selected services */}
        {form.services && form.services.length > 0 && (
          <SummaryRow
            label="Dienstleistung(en)"
            value={form.services.join(", ")}
          />
        )}

        {/* Show selected subservices (unique, flat) */}
        {form.schedules && form.schedules.some(s => s.subServices && s.subServices.length > 0) && (
          <SummaryRow
            label="Zusatzleistungen"
            value={Array.from(new Set(form.schedules.flatMap(s => s.subServices || []))).join(", ")}
          />
        )}
    
    <SummaryRow label="Häufigkeit" value={form.frequency} />
    <SummaryRow
      label="Dauer"
      value={`${form.schedules.reduce(
        (sum, s) => sum + (s.hours || 0),
        0
      )} Stunden`}
    />
    <SummaryRow label="Beginndatum" value={form.firstDate} />

<div className="border-t pt-2">

  {form.schedules.map((s, i) => {
    const hours = parseFloat(s.hours) || 0;
    const date = buildDate(s, form.firstDate);
    const baseRate = form.frequency === "einmalig" ? 75 : 59;
    const entryCost = calculateHourlyCost(date, hours, baseRate);
    const hasSurcharge = entryCost > baseRate * hours;
    return (
      <p key={i} className="text-sm text-gray-600">
        {hours} Std = {entryCost.toFixed(2)} CHF
        {hasSurcharge && (
          <span className="text-xs text-gray-400 ml-2">(inkl. Zuschlag)</span>
        )}
      </p>
    );
  })}

  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
    <p className="text-xs font-semibold text-amber-800 mb-1">Kostenzuschläge</p>
    <ul className="text-xs text-gray-700 space-y-0.5">
      <li>• Sonntagszuschlag: <strong>+50%</strong> (Sonntage &amp; gesetzliche Feiertage)</li>
      <li>• Nachtzuschlag: <strong>+25%</strong> (23:00–06:00 Uhr)</li>
    </ul>
    <p className="mt-1 text-[10px] text-gray-500">Feiertage: Neujahrstag, Karfreitag, Ostermontag, Auffahrt, Pfingstmontag, Bundesfeiertag, Weihnachtstag, Stephanstag</p>
  </div>

  <p className="mt-2 font-semibold text-gray-900">
    Gesamtsumme: {totalPayment.toFixed(2)} CHF
  </p>

  {voucherSuccess && discountValue > 0 && (
    <p className="text-sm text-green-700">
      Rabatt (
      {discountType === "percent"
        ? `${discountValue}%`
        : `${discountValue.toFixed(2)} CHF`}
      ): –
      {discountType === "percent"
        ? ((totalPayment * discountValue) / 100).toFixed(2)
        : discountValue.toFixed(2)}{" "}
      CHF
    </p>
  )}

  {voucherSuccess && (
    <p className="mt-1 font-semibold text-gray-900">
      Endbetrag:{" "}
      {(
        totalPayment -
        (discountType === "percent"
          ? (totalPayment * discountValue) / 100
          : discountValue)
      ).toFixed(2)}{" "}
      CHF
    </p>
  )}
</div>

  </div>

  <div className="border-t border-gray-200 pt-3 text-xs text-gray-600 text-center italic">
    inkl. MwSt und Versicherungs- & Sozialabgaben<br />
    <span className="font-medium text-gray-800 not-italic">
      Belastung erfolgt 48h nach jeweiligen Einsatz
    </span>
  </div>
</div>

</div>}



    </div>
  );
}
