import { useState } from "react";
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [role, setRole] = useState("");  // To store the selected role
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // For displaying the success message

  const router = useRouter();

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole); // Set the selected role (client or employee)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, password, role }), // Include the selected role
    });

    setLoading(false);

    if (res.ok) {
      // Show confirmation message
      setMessage("Registration successful! An email has been sent with further instructions.");

      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 5000); // Adjust the delay as per your preference (3000ms = 3 seconds)
    } else {
      setMessage("Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-[1440px] w-full bg-[#FAFCFF] px-4 lg:px-[124px] py-[80px] lg:py-[130px] gap-10 lg:gap-[96px] justify-center items-center mx-auto">
      {/* Left Section */}
      <div className="flex flex-col w-full lg:w-[658px] h-auto max-w-[600px] p-6 lg:p-[0px] justify-center">
        <img
          src="/images/register-side-image.png"
          alt="Register Visual"
          className="w-full h-[250px] lg:h-[300px] object-cover rounded-[20px] mb-6"
        />
        <h2 className="text-[rgba(3,16,41,0.87)] font-light text-[26px] lg:text-[32px] leading-[36px] lg:leading-[40px] tracking-[0.18px] font-[Metropolis]">
          Um eine Verbindung herzustellen und nach Betreuern zu suchen, benötigen wir nur ein paar weitere Informationen …
        </h2>
        <p className="text-[rgba(3,16,41,0.87)] font-normal text-[14px] lg:text-[16px] leading-[20px] font-[Metropolis] mt-4 lg:mt-6">
          Sobald Sie ein Konto haben, können Sie Kontakt zu Pflegekräften aufnehmen und mit ihnen chatten, die Ihren Anforderungen entsprechen.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col w-full lg:w-[548px] max-w-[600px] h-auto p-6 lg:p-[33px] justify-start items-center rounded-[20px] border border-[rgba(3,16,41,0.12)] bg-white">
        {/* Role Selection */}
        {role === "" ? (
        <div className="flex flex-col items-center space-y-6">
        <h1 className="text-center text-[#031029] font-semibold text-[20px] lg:text-[24px] mb-8">
          What are you interested in?
        </h1>
        <div className="space-y-4 w-full max-w-[400px]">
          <button
            onClick={() => handleRoleSelection("client")}
            className="w-full py-4 bg-[#04436F] text-white font-semibold text-lg rounded-md shadow-lg hover:bg-[#04266f] transition duration-300 ease-in-out"
          >
            Register as Client
          </button>
          <button
            onClick={() => handleRoleSelection("employee")}
            className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md shadow-lg hover:bg-[#A6884A] transition duration-300 ease-in-out"
          >
            Register as Employee
          </button>
        </div>
      </div>
      
        ) : (
          // Form for Client or Employee Registration
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <h1 className="text-center w-full text-[#031029] font-bold text-[18px] lg:text-[20px] mb-[40px] lg:mb-[80px]">
              Register as {role === "client" ? "Client" : "Employee"}
            </h1>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-[150px] px-[32.42px] py-[12px] justify-center items-center rounded-[4px] 
                bg-[#B99B5F] text-white font-semibold text-[16px] lg:text-[18px] 
                mt-[40px] lg:mt-[80px] hover:bg-[#A6884A] self-end"
            >
              {loading ? "Registering..." : "Next"}
            </button>
          </form>
        )}
        
        {/* Confirmation Message */}
        {message && (
          <div className="mt-4 text-center text-[#04436F] font-[24px]">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
