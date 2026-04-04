import "../styles/globals.css";
import ChatbotWidget from "../components/chatbot/ChatbotWidget";
 
import { FormProvider } from "../context/FormContext";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
 
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
 
function MyApp({ Component, pageProps }) {
  const router = useRouter();
 
  const excludedPages = [
    '/old-index', '/Registrierung', '/Registrierung-Form1',
    '/Registrierung-Form2', '/Registrierung-Jobs-Form1', '/Registrierung-Jobs-Form2',
    '/login', '/register', '/confirmation-page', '/forgot-password', '/404',
    '/500', '/reset-password', '/dashboard', '/admin-dashboard', '/client-dashboard','/admin/mitarbeiter', '/admin/kunden' ,'/admin/einsaetze', '/admin/finanzen' ,'/admin/newEmployee',
  "/dashboard/kundigung", // 👈 SHTO KËTË
    "/dashboard/finanzen",

    '/employee-dashboard', '/employee-info','/employee-bank','/admin/employees', '/admin/clients', '/admin/settings', '/set-password' , '/dashboard/personal-info' ,'/dashboard/personal-info/edit', '/dashboard/pets', '/admin/system-email','/admin/feedback-email' ,"/dashboard/formular" ,"/dashboard/nachrichten" ,"/admin/clients/[id]","/admin/employees/[id]", "/appointments/[id].js", "/admin/email-templates",  "/admin/create" ,"/appointments/[id]", "/admin/blogs", "/admin/bewerber"
  ];
 
  const shouldExcludeLayout = excludedPages.includes(router.pathname);
 
  return (
    <>
      <Head>
        <link rel="icon" href="/PHCIcon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/PHCIcon.svg" type="image/svg+xml" />
        <title>PHC</title>
      </Head>

     
      <FormProvider>
  <Elements stripe={stripePromise}>
    {!shouldExcludeLayout && <Header />}
    <Component {...pageProps} />
    {!shouldExcludeLayout && <Footer />}
    {!shouldExcludeLayout && <ChatbotWidget />}  {/* 👈 Chatbot bubble */}
  </Elements>
</FormProvider>
 
    </>
  );
}
 
export default MyApp;
 
