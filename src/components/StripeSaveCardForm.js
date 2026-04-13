import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function SaveCardForm({ userId, customerId, form }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSaveCard = async () => {
    setLoading(true);

    const res = await fetch('/api/create-setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
        },
      },
    });

    if (result.error) {
      alert("Karte konnte nicht gespeichert werden. " + result.error.message);
    } else {
      const paymentMethodId = result.setupIntent.payment_method;

      await fetch("/api/save-payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, paymentMethodId }),
      });

      alert("Karte wurde für zukünftige Zahlungen gespeichert.");
    }

    setLoading(false);
  };

  return (
    <div>
      <CardElement />
      <button onClick={handleSaveCard} disabled={!stripe || loading}>
        {loading ? "Wird gespeichert..." : "Karte speichern"}
      </button>
    </div>
  );
}
