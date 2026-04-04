import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const navLinks = [
  { name: 'Home', path: '/' },
  {
    name: 'Über uns',
    path: '/about', // <-- make parent clickable
    subLinks: [
      { name: 'Blog', path: '/BlogPage' },
    ],
  },
  {
    name: 'Dienstleistungen',
    path: '/services', // <-- make parent clickable
  },
  { name: 'Jobs', path: '/Registrierung-Jobs' },
   { name: 'FAQ', path: '/FAQ' },


];

useEffect(() => {
  if (isMobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, [isMobileMenuOpen]);

  return (
<header className="sticky top-0 z-[999] flex justify-between items-center mx-auto max-w-[1430px] p-4 bg-[#FAFCFF] ">
      {/* Desktop and Tablet View */}
      <div className="flex items-center gap-8 hidden lg:flex">
   <nav className="flex gap-6 items-center">
  {navLinks.map((link, index) => (
    <div key={index} className="relative group">
      {/* Top-level Link */}
      <a
        href={link.path || '#'}
        className="text-[#04436F] font-medium px-2 py-2 inline-block"
      >
        {link.name}
      </a>

      {/* Dropdown Menu */}
      {link.subLinks && (
        <div
          className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md z-10 min-w-[220px]"
        >
          <ul className="flex flex-col">
            {link.subLinks.map((sub, subIndex) => (
              <li key={subIndex}>
                <a
                  href={sub.path}
                  className="block px-4 py-2 text-sm text-[#04436F] hover:bg-[#EAF1F8] whitespace-nowrap"
                >
                  {sub.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ))}
</nav>



      </div>

      {/* Logo Section */}
    <div className="lg:block hidden flex items-center gap-4 xl:mr-[160px]">
  <Link href="/">
    <Image src="/Link - home.png" alt="PHC Logo" width={140} height={70} />
  </Link>
</div>

<div className="lg:hidden block flex items-center gap-4 lg:mr-[120px]">
  <Link href="/">
    <Image src="/Link - home.png" alt="PHC Logo" width={100} height={50} />
  </Link>
</div>
      {/* Register and Login Buttons */}
      <div className="flex gap-4 hidden lg:flex">
        <Link href="/register-client" className=" px-[34px] py-[12px] rounded-[6px] bg-[#B99B5F] text-white text-center text-[15px] font-[Metropolis] font-medium leading-normal tracking-[-0.225px]">
          Jetzt Buchen
        </Link>
        <Link href="/login" className="px-[34px] py-[12px] rounded-[6px] border border-[#B99B5F] bg-white text-[#B99B5F] font-[Metropolis] text-center  text-[15px] font-medium leading-normal tracking-[-0.225px]">
          Log in
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <button className="text-[#04436F] flex flex-col justify-between items-center w-8 h-8">
          {/* Hamburger Icon (Three Lines) */}
          <div className="w-full h-[3px] bg-[#04436F]"></div>
          <div className="w-full h-[3px] bg-[#04436F]"></div>
          <div className="w-full h-[3px] bg-[#04436F]"></div>
        </button>
      </div>

   {/* Mobile Fullscreen Menu */}
{isMobileMenuOpen && (
  <div className="lg:hidden fixed inset-0 z-[999] bg-white px-6 py-6 overflow-y-auto">
    {/* Close Button */}
    <button
      onClick={() => setIsMobileMenuOpen(false)}
      className="absolute top-4 right-6 text-3xl text-[#04436F]"
    >
      ×
    </button>

    {/* Logo */}
    <div className="flex justify-center mb-6 mt-2">
      <Link href="/">
        <Image src="/Link - home.png" alt="PHC Logo" width={120} height={60} />
      </Link>
    </div>

    {/* Navigation */}
    <nav className="flex flex-col items-center gap-4">
      {navLinks.map((link, index) => (
        <div key={index} className="w-full text-center">
          {link.subLinks ? (
            <>
              <Link
                href={link.path}
                className="text-[18px] font-medium text-[#222] hover:text-[#B99B5F]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
              <div className="flex flex-col gap-2 mt-2">
                {link.subLinks.map((sub, subIndex) => (
                  <Link
                    key={subIndex}
                    href={sub.path}
                    className="text-[16px] text-[#555] hover:text-[#B99B5F]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link
              href={link.path}
              className={`text-[18px] font-medium ${
                router.pathname === link.path ? 'text-[#04436F]' : 'text-[#222]'
              } hover:text-[#B99B5F]`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          )}
        </div>
      ))}

      {/* Mobile Buttons */}
      <div className="flex flex-col gap-4 mt-4 w-full items-center">
        <Link
          href="/register-client"
          className="px-[44px] py-[15px] rounded-[6px] bg-[#B99B5F] text-white text-[15px] font-medium tracking-[-0.225px] w-full text-center"
        >
          Jetzt Buchen
        </Link>
        <Link
          href="/login"
          className="px-[44px] py-[15px] rounded-[6px] border border-[#B99B5F] bg-white text-[#B99B5F] text-[15px] font-medium tracking-[-0.225px] w-full text-center"
        >
          Log in
        </Link>
      </div>
    </nav>
  </div>
)}

    </header>
  );
};

export default Header;
