import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' })); // clear error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name ist erforderlich';
    if (!formData.email.trim()) newErrors.email = 'Email ist erforderlich';
    if (!formData.message.trim()) newErrors.message = 'Nachricht ist erforderlich';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('phone', formData.phone);
      form.append('email', formData.email);
      form.append('message', formData.message);

      const response = await fetch('/api/send-support-mail', {
        method: 'POST',
        body: form
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        alert('Fehler beim Senden. Bitte erneut versuchen.');
      }
    } catch (error) {
      alert('Serverfehler. Bitte später erneut versuchen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#FAFCFF] px-4 mx-auto py-16 max-w-[1430px]">
      {/* Header */}
      <div className="bg-[rgba(4,67,111,0.10)] p-8 rounded-[20px] flex flex-col gap-8 lg:gap-[140px] lg:flex-row justify-between items-center">
        <div className="lg:w-1/2 text-left">
          <h1 className="text-[50px] leading-[62px] lg:text-[60px] font-semibold lg:leading-[80px] font-['Instrument Sans']">
            <span className="text-[#04436F]">Wir sind für Sie da –<br />kontaktieren Sie uns</span>
          </h1>
        </div>
        <div className="lg:w-1/2 flex flex-col lg:items-start text-left">
          <p className="text-[#04436F] text-[20px] font-normal leading-[25.6px] font-['Inter'] mt-2 mb-4">
            Unser motiviertes Team ist hier um Sie bei Fragen, Anliegen oder einfach für ein Feedback zu unterstützen
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="flex flex-wrap justify-center gap-[40px] mt-[120px]">
        {[
          { icon: "location", title: "Birkenstrasse 49, 6343 Rotkreuz" },
          { icon: "clock", title: "8:30 - 11:00 und 13:30 - 16:00 Uhr" }
        ].map((item, index) => (
          <div key={index} className="lg:w-[675px] w-[350px] py-[20px] px-[10px] lg:py-[20px] lg:px-[60px] bg-[#EAF1F8] gap-[20px] lg:gap-[24px] rounded-[20px] flex flex-row items-left">
            <div className="w-[60px] h-[60px] bg-[#04436F] rounded-full justify-center flex items-center lg:mb-2">
              <img src={`/images/${item.icon}.svg`} alt={item.title} className="w-[40px] h-[40px]" />
            </div>
            <h3 className="text-[#04436F] w-[160px] lg:w-auto text-[17px] lg:text-[24px] font-semibold leading-[25.6px] justify-center flex items-center">
              {item.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Image & Form */}
      <div className="flex flex-col lg:flex-row gap-[60px] items-center justify-between mt-[120px]">
        <div className="relative w-full lg:w-1/2">
          <img
            src="/images/phc-contact-image-1.png"
            alt="Support Team"
            className="w-full lg:max-h-[750px] h-auto rounded-lg"
          />
        </div>

        <div className="w-full px-4 py-4 lg:px-[45px] lg:py-[55px] lg:w-1/2 bg-[rgba(4,67,111,0.10)] p-8 rounded-[20px] mt-10 lg:mt-0">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 lg:space-y-[30px]">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-[#04436F] font-bold text-[15px]">Vor- und Nachname *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-3 rounded-md border border-gray-300 w-full"
              />
              {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-[#04436F] font-bold text-[15px]">Telefonnummer</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 rounded-md border border-gray-300 w-full"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[#04436F] font-bold text-[15px]">E-Mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 rounded-md border border-gray-300 w-full"
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label className="text-[#04436F] font-bold text-[15px]">Ihre Nachricht *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="p-3 rounded-md border border-gray-300 w-full lg:h-[212px] h-[100px]"
              />
              {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message}</span>}
            </div>

            {/* Button or Success */}
            {isSubmitted ? (
              <p className="text-[#04436F] text-[18px] font-medium text-center">
                Vielen Dank für Ihre Anfrage. Wir werden uns so schnell wie möglich mit Ihnen in Verbindung setzen.
              </p>
            ) : (
              <button
                type="submit"
                className="bg-[#04436F] text-white p-3 rounded-[20px] text-[18px] font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Senden...' : 'Senden'}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
