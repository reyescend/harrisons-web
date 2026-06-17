'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState('');
  const [requestType, setRequestType] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [brokenForBattleSuccess, setBrokenForBattleSuccess] = useState(false);
  const [brokenForBattleSubmitting, setBrokenForBattleSubmitting] = useState(false);
  const [heroOffset, setHeroOffset] = useState(0);
  const [missionGlow, setMissionGlow] = useState({ x: 50, y: 50 });
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = featuredRef;
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const touchStartX = useRef(0);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setHeroOffset(window.scrollY * 0.15);
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - galleryRef.current.offsetLeft;
    scrollLeft.current = galleryRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !galleryRef.current) return;

    e.preventDefault();

    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    galleryRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    touchStartX.current = e.touches[0].pageX;
    scrollLeft.current = galleryRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;

    const x = e.touches[0].pageX;
    const walk = (x - touchStartX.current) * 2;
    galleryRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    const atStart = container.scrollLeft <= 0;
    const atEnd =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 2;

    const scrollingLeft = e.deltaY < 0;
    const scrollingRight = e.deltaY > 0;

    const canScrollHorizontally =
      (scrollingLeft && !atStart) ||
      (scrollingRight && !atEnd);

    if (canScrollHorizontally) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  };

  const scrollGallery = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: 'left' | 'right'
  ) => {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: direction === 'left' ? -600 : 600,
      behavior: 'smooth',
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookingType) {
      setBookingError('Please select who you would like to book.');
      return;
    }

    setBookingError('');
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) throw new Error('Failed');
      setBookingError('');

      setBookingSuccess(true);

      setTimeout(() => {
        setBookingSuccess(false);
        setShowBookingModal(false);
      }, 2500);
    } catch (error) {
      console.error('Booking submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBrokenForBattleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setBrokenForBattleSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/broken-for-battle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          email: formData.get('email'),
        }),
      });

      if (!response.ok) throw new Error('Failed');

      setBrokenForBattleSuccess(true);
      form.reset();
    } catch (error) {
      alert('There was a problem joining Broken For Battle.');
    } finally {
      setBrokenForBattleSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-x-hidden scroll-smooth text-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-black/70 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 lg:px-16">
          <div className="text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/90">
            THE HARRISONS
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center text-2xl transition-all lg:hidden"
            aria-label="Toggle menu"
          >
            <span className="relative block h-5 w-6">
              <span className={`absolute left-0 top-0 h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-2 h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 top-4 h-0.5 w-6 bg-white transition-all ${mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-10 text-sm uppercase tracking-[0.18em] text-white/85">
              <li><a href="#about" className="transition hover:text-white">About</a></li>
              <li><a href="#book" className="transition hover:text-white">Book</a></li>
              <li><a href="#broken-for-battle" className="transition hover:text-white">Broken For Battle</a></li>
              <li><a href="#give" className="transition hover:text-white">Give</a></li>
            </ul>
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-[73px] z-40 bg-black/98 backdrop-blur-xl lg:hidden">
            <div className="flex h-full flex-col items-center justify-center gap-8 text-lg uppercase tracking-[0.25em] text-white">
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#book" onClick={() => setMobileMenuOpen(false)}>Book</a>
              <a href="#broken-for-battle" onClick={() => setMobileMenuOpen(false)}>Broken For Battle</a>
              <a href="#give" onClick={() => setMobileMenuOpen(false)}>Give</a>
            </div>
          </div>
        )}
      </header>
      <section
        className="relative flex min-h-[80svh] md:min-h-[100svh] items-center justify-center overflow-hidden text-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-300 md:hidden"
          style={{
            backgroundImage: "url('/verticalhero.png')",
            backgroundPosition: '60% center',
            transform: `scale(${1 + Math.min(heroOffset / 3000, 0.08)})`,
          }}
        />

        <div
          className="absolute inset-0 hidden bg-cover bg-no-repeat transition-transform duration-300 md:block"
          style={{
            backgroundImage: "url('/hero.jpg.png')",
            backgroundPosition: '68% center',
            transform: `scale(${1 + Math.min(heroOffset / 3000, 0.08)})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/65"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]"></div>
        <div className="relative z-10 px-6 pt-20 md:pt-32">

          <div className="mb-6 flex justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>
          <h1 className="text-5xl font-semibold tracking-[-0.06em] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.18)] sm:text-6xl md:text-7xl lg:text-[7.5rem]">
            Carter & Tori
          </h1>

          <p className="mx-auto mt-4 max-w-xs text-[10px] uppercase tracking-[0.28em] text-white/75 md:mt-6 md:max-w-md md:text-sm md:tracking-[0.45em]">
            Worship • Teaching • Ministry
          </p>

          <div className="mt-10 md:mt-16 flex justify-center">
            <a
              href="#about"
              aria-label="Scroll to About"
              className="group flex flex-col items-center gap-3 text-white/70 transition hover:text-white"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                Explore
              </span>

              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6 animate-bounce"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 md:h-56 overflow-hidden">
          <div className="absolute -bottom-24 md:-bottom-32 left-[-10%] right-[-10%] h-48 md:h-72 rounded-t-[100%] bg-black" />
        </div>
      </section>

      <section
        className="relative -mt-12 md:-mt-20 overflow-hidden bg-black px-6 py-24 md:py-32 text-center text-white"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMissionGlow({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(500px circle at ${missionGlow.x}% ${missionGlow.y}%, rgba(255,255,255,0.12), transparent 45%)`,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('/christup.jpg')",
            backgroundPosition: 'center 20%',
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-20 mx-auto max-w-5xl pt-12 md:pt-16 pb-36 md:pb-44">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-amber-300/90">
              His Burden. Our Mission.
            </p>

            <h2 className="mt-8 text-4xl md:text-6xl font-semibold tracking-[-0.06em] leading-tight">
              Carrying His presence,
              <br />
              proclaiming His gospel,
              <br />
              and strengthening His Church.
            </h2>

            <p className="mx-auto mt-10 max-w-2xl text-base md:text-lg leading-relaxed text-white/70">
              Every gathering is an opportunity for people to encounter the presence of God, be transformed by His voice, and respond to His call.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent via-black/5 to-[#f7f5f2]" />
      </section>

      <section
        id="about"
        className="relative -mt-20 bg-[#f7f5f2] px-6 py-24 md:py-32 lg:px-16 lg:py-40 text-black reveal-section"
        ref={el => { revealRefs.current[0] = el; }}
      >
        <div className="absolute -top-16 left-0 right-0 h-16 rounded-t-[100%] bg-[#f7f5f2]" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">

          <div>
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/about picture.JPG"
                alt="Carter and Tori Harrison"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div>
            <div className="mb-6 h-px w-20 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-black/40">
              About The Harrisons
            </p>

            <h2 className="text-4xl leading-tight font-semibold tracking-[-0.04em] md:text-6xl">
              Creating spaces where people encounter Jesus, hear His voice, and respond with faith.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/70">
              Carter and Tori Harrison travel to churches, conferences, and revival gatherings with a passion to see lives transformed by the presence of God. Through worship, biblical teaching, and Spirit-led ministry, they help create environments where people encounter Jesus, grow in faith, and step boldly into their calling.
            </p>
          </div>

        </div>
      </section>

      <section
        className="relative overflow-hidden bg-black px-6 pt-40 pb-24 md:pt-48 md:pb-32 lg:px-16 lg:pt-52 lg:pb-36 text-white reveal-section"
        ref={el => { revealRefs.current[1] = el; }}
      >
        <div className="absolute top-0 left-0 right-0 h-32 md:h-40 lg:h-48 overflow-hidden">
          <div className="absolute -top-24 md:-top-32 lg:-top-40 left-[-10%] right-[-10%] h-48 md:h-64 lg:h-80 rounded-b-[100%] bg-[#f7f5f2]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%)]"></div>
        <div className="relative z-10 mx-auto max-w-7xl overflow-hidden">
          <div className="mb-6 h-px w-24 bg-gradient-to-r from-white via-white/50 to-transparent" />
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/50">
            Featured Moments
          </p>

          <h2 className="max-w-5xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Messages, worship moments, and conversations impacting lives.
          </h2>

          <div className="mt-6 flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-white/50 md:hidden">
            <span>← Swipe to explore →</span>
          </div>

          <div className="mt-6 hidden items-center justify-between md:flex">
            <div className="text-sm uppercase tracking-[0.25em] text-white/40">
              Scroll horizontally to explore
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scrollGallery(featuredRef, 'left')}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => scrollGallery(featuredRef, 'right')}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={featuredRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onWheel={handleWheelScroll}
            className="mt-12 flex cursor-grab active:cursor-grabbing gap-8 overflow-x-auto pb-6 md:mt-20 snap-x snap-mandatory snap-always select-none scroll-smooth [scroll-behavior:smooth] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <a href="https://youtu.be/J3XLGXPld2g?is=b055TN4TR6kSWbIO" target="_blank" rel="noopener noreferrer" className="group block min-w-[85vw] md:min-w-[520px] snap-center overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]">
              <img src="https://img.youtube.com/vi/J3XLGXPld2g/maxresdefault.jpg" alt="How To Hear God's Voice" className="h-72 md:h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="p-10">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Worship Moment
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  Goodbye Yesterday
                </h3>
                <p className="mt-8 text-sm font-medium text-blue-400 transition group-hover:underline group-hover:translate-x-1">
                  Watch Worship →
                </p>
              </div>
            </a>
            <a href="https://youtu.be/m3QIGOv4dWE?is=kCKcCZgLrwqEzKvv" target="_blank" rel="noopener noreferrer" className="group block min-w-[85vw] md:min-w-[520px] snap-center overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]">
              <img src="https://img.youtube.com/vi/m3QIGOv4dWE/maxresdefault.jpg" alt="Holy Forever" className="h-72 md:h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="p-10">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Worship Moment
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  Facedown
                </h3>
                <p className="mt-8 text-sm font-medium text-fuchsia-400 transition group-hover:underline group-hover:translate-x-1">
                  Watch Worship →
                </p>
              </div>
            </a>
            <a href="https://www.youtube.com/live/ODSCqKyKsBE?si=hOXKkBpMMFErfqkx" target="_blank" rel="noopener noreferrer" className="group block min-w-[85vw] md:min-w-[520px] snap-center overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]">
              <img src="https://img.youtube.com/vi/ODSCqKyKsBE/maxresdefault.jpg" alt="Featured Sermon" className="h-72 md:h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="p-10">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Full Sermon
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  Featured Sermon
                </h3>
                <p className="mt-8 text-sm font-medium text-amber-300 transition group-hover:underline group-hover:translate-x-1">
                  Watch Sermon →
                </p>
              </div>
            </a>
            <a href="https://www.youtube.com/live/PDQ8lY-UADY?si=nGc3_a4w0H7iNDJ0" target="_blank" rel="noopener noreferrer" className="group block min-w-[85vw] md:min-w-[520px] snap-center overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]">
              <img src="https://img.youtube.com/vi/PDQ8lY-UADY/maxresdefault.jpg" alt="Featured Sermon" className="h-72 md:h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="p-10">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Full Sermon
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  Featured Sermon
                </h3>
                <p className="mt-8 text-sm font-medium text-emerald-300 transition group-hover:underline group-hover:translate-x-1">
                  Watch Sermon →
                </p>
              </div>
            </a>
          </div>
        </div>
        {/* Curved transition at the bottom of Featured Moments */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 lg:h-48 overflow-hidden">
          <div className="absolute -bottom-24 md:-bottom-32 lg:-bottom-40 left-[-10%] right-[-10%] h-48 md:h-64 lg:h-80 rounded-t-[100%] bg-[#050505]" />
        </div>
      </section>

      <section
        id="book"
        className="relative -mt-8 bg-[#050505] px-6 lg:px-16 py-40 text-white reveal-section"
        ref={el => { revealRefs.current[2] = el; }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/50">
            Booking
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-7xl">
            Bring Carter & Tori to Your Church or Event
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            Whether it's a Sunday service, conference, revival gathering, worship night, or special event, we'd love to connect with you.
          </p>

          <div className="mt-12">
            <button
              onClick={() => setShowBookingModal(true)}
              className="inline-flex items-center rounded-full border border-white/15 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
            >
              Request Booking
            </button>
          </div>
        </div>
      </section>

      <section
        id="broken-for-battle"
        className="bg-neutral-100 px-6 lg:px-16 py-32 text-black reveal-section"
        ref={el => { revealRefs.current[3] = el; }}
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div className="flex justify-center lg:justify-start">
            <img
              src="/poster.avif"
              alt="Broken For Battle"
              className="w-full max-w-sm rounded-3xl shadow-2xl object-cover"
            />
          </div>

          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-black/50">
              Online Gathering
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-7xl">
              Broken For Battle
            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/70">
              Broken for Battle is a space where Christ is glorified through honest conversations, teaching, and revelation from the Holy Spirit. We believe God equips us through our experiences and history with Him, preparing us for every season.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/70">
              Just as David faced Goliath with the tools God had given him, this space helps you step into your battles fully prepared, empowered, and ready. Join us as we gather online to be equipped, strengthened, and prepared for every season.
            </p>

            <div className="mt-10">
              <form className="max-w-xl space-y-4" onSubmit={handleBrokenForBattleSubmit}>
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  required
                  className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  required
                  className="w-full rounded-xl border border-black/10 bg-white px-5 py-4 text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                />

                <button
                  type="submit"
                  disabled={brokenForBattleSubmitting}
                  className="inline-flex items-center rounded-full bg-black px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {brokenForBattleSubmitting ? 'Joining...' : 'Join Broken For Battle'}
                </button>
                {brokenForBattleSuccess && (
                  <p className="text-sm text-green-600">
                    You're in! We'll keep you updated on future gatherings.
                  </p>
                )}
              </form>
              
              <p className="mt-4 text-sm text-black/60">
                Be the first to know about upcoming gatherings, livestreams, and ministry updates.
              </p>
            </div>
          </div>

        </div>
      </section>
      <section
        id="give"
        className="relative overflow-hidden bg-black px-6 lg:px-16 py-32 text-white reveal-section"
        ref={el => { revealRefs.current[4] = el; }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/50">
            Partner With Us
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-7xl">
            Partner With Us
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/70">
            Your generosity helps support ministry opportunities, revival gatherings, worship events, media content, and the mission of leading people into the presence of Jesus. Every gift helps us continue sharing the Gospel and serving churches around the nation.
          </p>

          <div className="mt-12">
            <a
              href="https://givebutter.com/JB09mh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-90"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </section>
      <section
        className="bg-white py-32 text-black overflow-hidden reveal-section"
        ref={el => { revealRefs.current[5] = el; }}
      >
        <div className="mb-16 px-6 lg:px-16">
          <p className="text-xs uppercase tracking-[0.45em] text-black/40">
            Photo Journal
          </p>
          <div className="mt-4 hidden items-center justify-between md:flex">
            <p className="text-sm uppercase tracking-[0.25em] text-black/40">
              Drag or scroll to explore
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scrollGallery(photoRef, 'left')}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-black/30 hover:text-black"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollGallery(photoRef, 'right')}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 text-black/60 transition hover:border-black/30 hover:text-black"
              >
                →
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-black/40 md:hidden">
            Swipe to explore →
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-7xl">
            Moments Along The Way
          </h2>
        </div>

        <div
          ref={photoRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onWheel={handleWheelScroll}
          className="flex cursor-grab active:cursor-grabbing gap-5 overflow-x-auto pl-8 lg:pl-16 pr-16 select-none scroll-smooth [scroll-behavior:smooth] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <img
            src="/worshipping.JPG"
            alt="Ministry Moment"
            className="h-[320px] md:h-[620px] w-[260px] md:w-[460px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/DSC02835.JPG"
            alt="Ministry Moment"
            className="mt-20 h-[340px] md:h-[460px] w-[220px] md:w-[320px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_1859.JPG"
            alt="Ministry Moment"
            className="h-[320px] md:h-[720px] w-[240px] md:w-[540px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_6078.jpeg"
            alt="Ministry Moment"
            className="mt-12 h-[220px] md:h-[520px] w-[140px] md:w-[380px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_6886.jpeg"
            alt="Ministry Moment"
            className="h-[320px] md:h-[620px] w-[260px] md:w-[460px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_1859.JPG"
            alt="Ministry Moment"
            className="mt-16 h-[320px] md:h-[500px] w-[240px] md:w-[360px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_1848.JPG"
            alt="Ministry Moment"
            className="h-[320px] md:h-[680px] w-[240px] md:w-[500px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_1858.JPG"
            alt="Ministry Moment"
            className="mt-20 h-[340px] md:h-[460px] w-[220px] md:w-[320px] flex-none rounded-[32px] object-cover"
          />
        </div>
      </section>
{showBookingModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 md:p-6 backdrop-blur-md animate-fadeIn">
    <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-5 pb-8 md:p-10 text-black animate-modalIn shadow-2xl">
      <div className="sticky top-0 z-10 -mx-5 -mt-5 mb-6 flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 md:-mx-10 md:-mt-10 md:px-10 md:py-6">
        <h3 className="text-2xl md:text-4xl font-semibold tracking-[-0.04em]">
          Booking Request
        </h3>

        <button
          onClick={() => setShowBookingModal(false)}
          className="text-3xl text-black/60 hover:text-black"
        >
          ×
        </button>
      </div>

      <p className="mt-6 text-lg leading-relaxed text-black/70">
        Thank you for considering us to come alongside you in worship and the Word. Please take a moment to fill out the form below. We look forward to connecting with you, hearing your vision, and discovering how we can partner together to see all that God has in store.
      </p>

      <div className="mt-8">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-black/50">
          Who would you like to book?
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setBookingType('Carter')}
            className={`rounded-2xl border p-4 text-sm font-medium transition-all ${bookingType === 'Carter' ? 'bg-black text-white border-black' : 'border-black/10'}`}
          >
            Carter
          </button>

          <button
            type="button"
            onClick={() => setBookingType('Tori')}
            className={`rounded-2xl border p-4 text-sm font-medium transition-all ${bookingType === 'Tori' ? 'bg-black text-white border-black' : 'border-black/10'}`}
          >
            Tori
          </button>

          <button
            type="button"
            onClick={() => setBookingType('Carter + Tori')}
            className={`rounded-2xl border p-4 text-sm font-medium transition-all ${bookingType === 'Carter + Tori' ? 'bg-black text-white border-black' : 'border-black/10'}`}
          >
            Carter + Tori
          </button>
        </div>

        {bookingType === 'Carter' && (
          <div className="mt-6 rounded-2xl bg-black/5 p-4 text-sm text-black/70">
            Carter — Preaching or Teaching, Worship, Panel Discussions, and Other Ministry Inquiries. A team member will always travel with Carter. Travel accommodations must be provided.
          </div>
        )}

        {bookingType === 'Tori' && (
          <div className="mt-6 rounded-2xl bg-black/5 p-4 text-sm text-black/70">
            Tori — Preaching or Teaching, Worship, Panel Discussions, and Other Ministry Inquiries. A team member will always travel with Tori. Travel accommodations must be provided.
          </div>
        )}

        {bookingType === 'Carter + Tori' && (
          <div className="mt-6 rounded-2xl bg-black/5 p-4 text-sm text-black/70">
            Carter + Tori — Preaching or Teaching, Worship, Panel Discussions, and Other Ministry Inquiries.
          </div>
        )}
      </div>

      {!bookingSuccess ? (
      <form onSubmit={handleBookingSubmit}>
        <div className="mb-6 rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm text-black/60">
          Complete the details below and our team will review your request and respond as soon as possible.
        </div>
        <input type="hidden" name="bookingType" value={bookingType} />

        {bookingType && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <select
              name="requestType"
              required
              className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="" disabled>
                Select Request Type
              </option>
              <option value="Preaching or Teaching">Preaching or Teaching</option>
              <option value="Worship">Worship</option>
              <option value="Panel">Panel Discussion</option>
              <option value="Other Inquiry">Other Inquiry</option>
            </select>

            {(bookingType === 'Carter' || bookingType === 'Tori') && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-black/70">
                A team member will always travel with {bookingType}. Travel accommodations must be provided.
              </div>
            )}
          </div>
        )}

        {/* Dynamic fields based on requestType */}
        {requestType === 'Worship' && (
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <input
              name="bandNeeded"
              required
              placeholder="Is a band needed?"
              className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            />

            <input
              name="localMusicians"
              required
              placeholder="Will local musicians be provided?"
              className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        )}

        {requestType === 'Preaching or Teaching' && (
          <input
            name="sessions"
            required
            placeholder="Number of speaking sessions requested"
            className="mb-6 w-full rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        )}

        {requestType === 'Panel' && (
          <input
            name="panelTopic"
            required
            placeholder="Panel topic or discussion focus"
            className="mb-6 w-full rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        )}

        {(requestType === 'Worship' || requestType === 'Other Inquiry') && (
          <div className="mb-6 rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/70">
            If this request includes worship ministry, please indicate whether a band is needed in the event details below. If a band is requested, travel expenses and accommodations for the team must be covered.
          </div>
        )}

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <input name="fullName" required placeholder="First & Last Name" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input
            name="pointOfContact"
            required
            placeholder="Point of Contact / Position"
            className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <input name="church" required placeholder="Name of Church" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input
            name="attendance"
            required
            placeholder="Expected Attendance"
            className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <input name="eventName" required placeholder="Name of Event" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input
            name="budget"
            required
            placeholder="Budget"
            className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <input name="phone" required placeholder="Phone" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="email" required type="email" placeholder="Email" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="website" required placeholder="Church / Event Website" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input
            name="venueAddress"
            required
            placeholder="Venue Address"
            className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-black/50">
              Start Date
            </label>
            <input name="startDate" required type="date" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-black/50">
              End Date
            </label>
            <input name="endDate" required type="date" className="rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
        </div>


        <textarea
          name="eventDetails"
          rows={8}
          required
          placeholder="Tell us about your event, audience, location, vision, schedule, budget, ministry goals, and any specific requests for this booking."
          className="mt-4 w-full rounded-2xl border border-black/10 bg-neutral-50 p-4 transition-all focus:bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />

        <div className="mt-4 text-sm text-black/60">
          Email: contact@harrisonministries.org
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-2xl bg-black py-5 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Sending...' : bookingSuccess ? 'Request Sent' : 'Send Request'}
        </button>
      </form>
      ) : (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="text-4xl">✓</div>
          <h4 className="mt-3 text-2xl font-semibold">Thank You</h4>
          <p className="mt-3 text-black/70">
            Your request has been received. We count it an honor to be considered for your gathering. Our team will prayerfully review the details and follow up soon.
          </p>
        </div>
      )}
    </div>
  </div>
)}
      {/* Partner floating button */}
      <a
        href="https://givebutter.com/JB09mh"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full border border-white/20 bg-white/90 backdrop-blur-xl px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-black shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white"
      >
        Partner
      </a>
<footer className="bg-black px-6 lg:px-16 py-20 text-white">
  <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.45em] text-white/40">
        Harrison Ministries
      </p>

      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
        Carter & Tori
      </h3>
      <div className="mt-6 space-y-2 text-sm text-white/60">
        <p>Bookings: contact@harrisonministries.org</p>
        <p>Broken For Battle • Monthly Online Gathering</p>
        <p>Based in Tennessee • Traveling Nationwide</p>
      </div>
    </div>

    <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.2em] text-white/70 md:text-right">
      <p className="mb-2 text-xs uppercase tracking-[0.35em] text-white/40">
        Connect
      </p>
      <a href="https://instagram.com/creative.harrisons" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Instagram</a>
      <a href="https://www.facebook.com/creative.harrisons" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Facebook</a>
      <p className="mt-3 text-xs normal-case tracking-normal text-white/50">
        contact@harrisonministries.org
      </p>
    </div>
  </div>

  <div className="mt-12 border-t border-white/10 pt-8 text-xs uppercase tracking-[0.2em] text-white/40">
    © 2026 Harrison Ministries
  </div>
</footer>
      <style jsx global>{`
        .reveal-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal-section.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-modalIn {
          animation: modalIn 0.3s ease forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }

        html {
          scroll-behavior: smooth;
        }

        * {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </main>
  );
}

