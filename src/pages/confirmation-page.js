export default function ConfirmationPage() {
    return (
      <div className="flex flex-col lg:flex-row max-w-[1440px] w-full bg-[#FAFCFF] px-4 lg:px-[124px] py-[80px] lg:py-[130px] gap-10 lg:gap-[96px] justify-center items-center mx-auto">
  
        {/* Left Section */}
        <div className="flex flex-col w-full lg:w-[658px] max-w-[600px] h-auto p-6 lg:p-0 justify-center">
  
          {/* Image */}
          <img
            src="/images/confirmation-side-image.png"
            alt="Confirmation Visual"
            className="w-full h-[250px] lg:h-[300px] object-cover rounded-[20px] mb-6"
          />
  
          {/* Heading */}
          <h2 className="text-[rgba(3,16,41,0.87)] font-light text-[26px] lg:text-[32px] leading-[36px] lg:leading-[40px] tracking-[0.18px] font-[Metropolis] text-left">
            Um eine Verbindung herzustellen und nach Betreuern zu suchen, benötigen wir nur ein paar weitere Informationen …
          </h2>
  
          {/* Paragraph */}
          <p className="text-[rgba(3,16,41,0.87)] font-normal text-[14px] lg:text-[16px] leading-[20px] font-[Metropolis] mt-4 lg:mt-6 text-left">
            Sobald Sie ein Konto haben, können Sie Kontakt zu Pflegekräften aufnehmen und mit ihnen chatten, die Ihren Anforderungen entsprechen.
          </p>
  
          {/* Footer Info */}
          <div className="flex items-center gap-2 text-[rgba(3,16,41,0.87)] text-[14px] lg:text-[16px] font-normal mt-4 lg:mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M13 3.5C8.03 3.5 4 7.53 4 12.5H1L4.89 16.39L4.96 16.53L9 12.5H6C6 8.63 9.13 5.5 13 5.5C16.87 5.5 20 8.63 20 12.5C20 16.37 16.87 19.5 13 19.5C11.07 19.5 9.32 18.71 8.06 17.44L6.64 18.86C8.27 20.49 10.51 21.5 13 21.5C17.97 21.5 22 17.47 22 12.5C22 7.53 17.97 3.5 13 3.5ZM12 8.5V13.5L16.25 16.02L17.02 14.74L13.5 12.65V8.5H12Z" fill="#598DFD" />
            </svg>
            <span><strong>Dauer der Fertigstellung:</strong> 2 Minuten</span>
          </div>
  
        </div>
  
        {/* Right Section */}
        <div className="flex flex-col w-full lg:w-[548px] max-w-[600px] h-auto p-6 lg:p-[33px] justify-start items-start rounded-[20px] border border-[rgba(3,16,41,0.12)] bg-white">
  
          {/* Small Title */}
          <p className="text-center w-full text-[#7B7B7B] text-[12px] lg:text-[14px] font-medium tracking-[2px] mb-2">
            LOREM IPSUM
          </p>
  
          {/* Main Title */}
          <h1 className="text-center w-full text-[#1A1E26] font-bold text-[18px] lg:text-[20px] mb-[40px] lg:mb-[80px]">
            Lorem Ipsum lorem ipsum
          </h1>
  
          {/* Input */}
          <input
            type="text"
            placeholder="Lorem Ipsum"
            className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] bg-[#FAFCFF] px-4 text-[16px] mb-[40px] lg:mb-[60px]"
          />
  
          {/* Button */}
          <button
            type="submit"
            className="flex w-[100px] px-[32.42px] py-[12px] justify-center items-center rounded-[4px] bg-[#B99B5F] hover:bg-[#A6884A] text-white font-semibold text-[16px] lg:text-[18px] self-end"
          >
            Next
          </button>
  
        </div>
  
      </div>
    );
  }
  