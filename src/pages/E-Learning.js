export default function HomeCarePage() {
    const videos = Array(4).fill({
        title: "Why every caregiver should be equiped with a stress level manager",
        author: "Name Surname",
        duration: "16 min",
        thumbnail: "/images/thumbphc.png" // Replace with your real image path
      });

      const video2 = Array(6).fill({
        title: "Why every caregiver should be equiped with a stress level manager",
        author: "Name Surname",
        duration: "16 min",
        thumbnail: "/images/thumbvideophccc.png" // Replace with your real image path
      });
    
    return (
      <div className="bg-[#FAFCFF] px-4 mx-auto max-w-[1430px]">
        
        {/* Hero Section */}
        <section className="bg-[#B99B5F] gap-10 lg:gap-[90px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-start">
        <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img src="/images/phc-elearning.png" alt="Home Care" className="rounded-lg lg:w-[545px] lg:h-[335px] w-full" />
          </div>
        <div className="lg:w-1/2 flex flex-col justify-start items-start">
  
        <h1 className="text-[40px] lg:text-[52px] font-semibold leading-[47px] mt-2 lg:mt-[38px] lg:leading-[60px] tracking-[-1.04px] font-['Metropolis']">
  <span className="text-[#FFFFFF]">E-Learning<br></br>
  Videos</span>
</h1>


<p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2">
Willkommen auf unserer Unterseite zu den E-Learning-Videos für die Altenpflege! Hier finden Sie wertvolle Ressourcen und Schulungen, die Ihnen helfen, die bestmögliche Betreuung für ältere Menschen zu gewährleisten. Entdecken Sie unsere informativen Videos, die wichtige Themen der Pflege abdecken und Ihnen praktische Tipps geben.</p>

          </div>
          
        </section>

        <section className="mt-[120px]">
        <h1 class="text-[#04436F] font-[Instrument Sans] text-[38px] lg:block hidden leading-[45px] lg:text-[55px] font-semibold lg:leading-[71.5px]">
  Prime Home Care E learning videos.
</h1>
<h1 class="text-[#04436F] font-[Instrument Sans] text-[38px] lg:hidden block leading-[47px] lg:text-[55px] font-semibold lg:leading-[71.5px]">
  Prime Home Care<br></br> E learning videos.
</h1>
<p class="text-[#222222] font-[Metropolis] text-[20px] font-light leading-[32px]">
Willkommen auf unserer Unterseite zu den E-Learning-Videos für die Altenpflege! Hier finden Sie wertvolle Ressourcen und Schulungen, die Ihnen helfen, die bestmögliche Betreuung für ältere Menschen zu gewährleisten. Entdecken Sie unsere informativen Videos, die wichtige Themen der Pflege abdecken und Ihnen praktische Tipps geben.</p>
<div
      style={{ backgroundImage: "url('/images/videothumbb.png')" }}
      className="relative flex flex-col justify-between h-[543px] p-6 rounded-xl overflow-hidden bg-cover bg-center mt-[30px]"
    >
      {/* Swipe Left */}
      <button className="absolute top-6 left-2 lg:left-10 rounded-full w-[40px] h-[40px] flex items-center justify-center text-[40px] text-white font-bold">
        &lt;
      </button>

      {/* Swipe Right */}
      <button className="absolute top-6 right-2 lg:right-10 text-white rounded-full w-[40px] h-[40px] flex items-center justify-center text-[40px]  font-bold">
        &gt;
      </button>

      {/* Bottom Content Overlay */}
      <div className="w-full px-6 pb-6  pt-20 from-black/80 to-transparent rounded-b-xl mt-[50px] lg:mt-[260px]">
        <h2 className="text-white font-[Instrument Sans] text-[55px] font-semibold leading-[71.5px]">
          How and when to get your pills?
        </h2>
        <p className="text-white font-[Metropolis] text-[16px] font-normal leading-[25.6px]">
          By Name Surname, Length: 20 min
        </p>

        <button className="mt-2 px-[40px] py-[8px] bg-[#04436F] text-white text-[24px] font-normal leading-[25.6px] font-[Metropolis] rounded-full self-end">
          Watch now
        </button>
      </div>
    </div>

    <section>
  <div className="flex flex-wrap justify-center gap-2 mt-[50px] mb-[50px] lg:mt-[85px] lg:mb-[100px] px-4 lg:px-[150px]">
    {[
      { label: "Medicare", id: "medicare" },
      { label: "Caregiving", id: "caregiving" },
      { label: "Health & Wellness", id: "health-wellness" },
      { label: "Food & Nutrition", id: "food-nutrition" },
      { label: "Technology", id: "technology" },
      { label: "Creativity for Wellness", id: "creativity-for-wellness" },
      { label: "Fitness", id: "fitness" },
    ].map(({ label, id }) => (
      <a href={`#${id}`} key={id}>
        <span className="px-[20px] py-[12px] rounded-full bg-[#B99B5F] text-[#FAFCFF] text-center font-[Metropolis] text-[16px] font-medium leading-[16px] whitespace-nowrap">
          {label}
        </span>
      </a>
    ))}
  </div>
</section>


    <section className="mt-[120px]">
      <h2 id="medicare" className="text-center text-[#04436F] text-3xl lg:text-[40px] lg:leading-[71px] font-[600] mb-2">
        Medicare
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[50px]  px-4 mx-auto">
        {videos.map((video, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Thumbnail with Play Icon Overlay */}
            <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden">
              <img
                src={video.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
             
            </div>

            {/* Text content */}
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              {video.title}
            </p>
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              By {video.author}
            </p>
            <p className="text-[#04436F] mt-2  text-[16px] font-[500] leading-[24px]">
              <span className="font-[700]">Watch:</span> {video.duration}
            </p>
          </div>
        ))}
      </div>
    </section>


    <section className="mt-[120px]">
      <h2 id="caregiving" className="text-center text-[#04436F] text-3xl lg:text-[40px] lg:leading-[71px] font-[600] mb-2">
      Caregiving
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[50px]  px-4 mx-auto">
        {video2.map((video2, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Thumbnail with Play Icon Overlay */}
            <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden">
              <img
                src={video2.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
             
            </div>

            {/* Text content */}
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              {video2.title}
            </p>
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              By {video2.author}
            </p>
            <p className="text-[#04436F] mt-2  text-[16px] font-[500] leading-[24px]">
              <span className="font-[700]">Watch:</span> {video2.duration}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-[120px]">
      <h2 id="health-wellness" className="text-center text-[#04436F] text-3xl lg:text-[40px] lg:leading-[71px] font-[600] mb-2">
      Health & Wellness
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[50px]  px-4 mx-auto">
        {video2.map((video2, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Thumbnail with Play Icon Overlay */}
            <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden">
              <img
                src={video2.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
             
            </div>

            {/* Text content */}
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              {video2.title}
            </p>
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              By {video2.author}
            </p>
            <p className="text-[#04436F] mt-2  text-[16px] font-[500] leading-[24px]">
              <span className="font-[700]">Watch:</span> {video2.duration}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-[120px]">
      <h2 id="food-nutrition" className="text-center text-[#04436F] text-3xl lg:text-[40px] lg:leading-[71px] font-[600] mb-2">
      Food & Nutrition
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[50px]  px-4 mx-auto">
        {videos.map((video, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Thumbnail with Play Icon Overlay */}
            <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden">
              <img
                src={video.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
             
            </div>

            {/* Text content */}
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              {video.title}
            </p>
            <p className="mt-[20px] text-[#04436F] text-[16px] font-[500] leading-[24px]">
              By {video.author}
            </p>
            <p className="text-[#04436F] mt-2  text-[16px] font-[500] leading-[24px]">
              <span className="font-[700]">Watch:</span> {video.duration}
            </p>
          </div>
        ))}
      </div>
    </section>

        </section>

        <section 
  className="bg-[#F1F1F1] lg:h-[300px] h-[400px] flex flex-col rounded-[20px] mb-[120px] justify-center items-center text-center mt-[120px] relative overflow-hidden" 
  style={{ backgroundImage: 'url(/images/phc-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px]">
    Join our community of care
  </h2>
  <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2 mb-10">
    At Prime Home Care, we're here to provide compassionate and personalized care to you<br></br> or your loved ones.
  </p>
  <button className="bg-[#04436F] w-[140px] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]">
    Get started
  </button>
</section>
  
      </div>
    );
  }
  