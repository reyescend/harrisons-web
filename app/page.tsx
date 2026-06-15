'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [heroOffset, setHeroOffset] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);
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

    window.addEventListener('scroll', handleScroll);
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

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
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
    const walk = (x - startX.current) * 2.5;
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

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookingType) {
      alert('Please select who you would like to book.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) throw new Error('Failed');

      setBookingSuccess(true);
      e.currentTarget.reset();
      setTimeout(() => {
        setBookingSuccess(false);
        setShowBookingModal(false);
      }, 2500);
    } catch (error) {
      alert('There was a problem sending your request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative scroll-smooth text-white">
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
            {mobileMenuOpen ? '×' : '☰'}
          </button>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-10 text-sm uppercase tracking-[0.18em] text-white/85">
              <li><a href="#about">About</a></li>
              <li><a href="#book">Book</a></li>
              <li><a href="#broken-for-battle">Broken For Battle</a></li>
              <li><a href="#give">Give</a></li>
            </ul>
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black/95 lg:hidden">
            <div className="flex flex-col px-6 py-6 text-sm uppercase tracking-[0.2em]">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-3">About</a>
              <a href="#book" onClick={() => setMobileMenuOpen(false)} className="py-3">Book</a>
              <a href="#broken-for-battle" onClick={() => setMobileMenuOpen(false)} className="py-3">Broken For Battle</a>
              <a href="#give" onClick={() => setMobileMenuOpen(false)} className="py-3">Give</a>
            </div>
          </div>
        )}
      </header>
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-8 pt-28 text-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100"
          style={{
            backgroundImage: "url('/hero.jpg.png')",
            backgroundPosition:
              typeof window !== 'undefined' && window.innerWidth < 768
                ? 'center 35%'
                : `center ${heroOffset}px`,
            transform: `scale(${
              typeof window !== 'undefined' && window.innerWidth < 768
                ? 1
                : 1 + Math.min(heroOffset / 3000, 0.08)
            })`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/65"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45)_100%)]"></div>
        <div className="relative z-10 px-4 pt-24 md:pt-32">

          <h1 className="text-4xl font-semibold tracking-[-0.08em] text-white sm:text-5xl md:text-7xl lg:text-[7.5rem]">
            Carter & Tori
          </h1>

          <p className="mx-auto mt-6 max-w-md text-xs uppercase tracking-[0.45em] text-white/75 md:text-sm">
            Worship • Teaching • Ministry
          </p>

          <div className="mt-16 flex justify-center">
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
      </section>

      <section
        id="about"
        className="bg-white px-6 py-24 md:py-32 lg:px-16 lg:py-40 text-black reveal-section"
        ref={el => { revealRefs.current[0] = el; }}
      >
        <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-2 lg:items-center">

          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-200 shadow-2xl">
              <img
                src="/about picture.JPG"
                alt="Carter and Tori Harrison"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-black/40">
              About The Harrisons
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Creating spaces where people encounter Jesus, hear His voice, and respond with faith.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/70">
              Carter and Tori Harrison travel churches, conferences, and revival gatherings with a passion to see lives transformed by the presence of God. Through worship, biblical teaching, and Spirit-led ministry, they help create environments where people encounter Jesus, grow in faith, and step boldly into their calling.
            </p>
          </div>

        </div>
      </section>

      <section
        className="relative overflow-hidden bg-black px-6 py-24 md:py-32 lg:px-16 lg:py-36 text-white reveal-section"
        ref={el => { revealRefs.current[1] = el; }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%)]"></div>
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/50">
            Featured Moments
          </p>

          <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Messages, worship moments, and conversations impacting lives.
          </h2>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            <a href="#" className="group block overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]">
              <div className="h-56 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900"></div>
              <div className="p-10">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Latest Message
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  How To Hear God's Voice
                </h3>
                <p className="mt-4 leading-relaxed text-white/70">
                  Creating environments where people can encounter the presence of God through authentic worship.
                </p>
                <p className="mt-8 text-sm font-medium text-blue-400 transition group-hover:underline group-hover:translate-x-1">
                  Watch Message →
                </p>
              </div>
            </a>

            <a href="#" className="group block overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]">
              <div className="h-56 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-950"></div>
              <div className="p-10">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Worship Moment
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  Holy Forever
                </h3>
                <p className="mt-4 leading-relaxed text-white/70">
                  Practical, Spirit-filled messages that inspire faith, growth, and transformation.
                </p>
                <p className="mt-8 text-sm font-medium text-fuchsia-400 transition group-hover:underline group-hover:translate-x-1">
                  Watch Worship →
                </p>
              </div>
            </a>

            <a href="#" className="group block overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.05]">
              <div className="h-56 bg-gradient-to-br from-amber-400 via-orange-500 to-red-700"></div>
              <div className="p-10">
                <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Podcast Episode
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold">
                  Discernment vs Anxiety
                </h3>
                <p className="mt-4 leading-relaxed text-white/70">
                  Partnering with churches to create moments where people respond to the voice of Jesus.
                </p>
                <p className="mt-8 text-sm font-medium text-amber-300 transition group-hover:underline group-hover:translate-x-1">
                  Listen Now →
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section
        id="book"
        className="bg-[#050505] px-6 lg:px-16 py-40 text-white reveal-section"
        ref={el => { revealRefs.current[2] = el; }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/50">
            Booking
          </p>

          <h2 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
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
        <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-2 lg:items-center">

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

            <h2 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
              Broken For Battle
            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/70">
              Broken for Battle is a space where Christ is glorified through honest conversations, teaching, and revelation from the Holy Spirit. We believe God equips us through our experiences and history with Him, preparing us for every season.
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/70">
              Just as David faced Goliath with the tools God had given him, this space helps you step into your battles fully prepared, empowered, and ready. Join us as we gather online to be equipped, strengthened, and prepared for every season.
            </p>

            <div className="mt-10">
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-black px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:opacity-90"
              >
                Join The Next Gathering
              </a>
            </div>
          </div>

        </div>
      </section>
      <section
        id="give"
        className="bg-black px-6 lg:px-16 py-32 text-white reveal-section"
        ref={el => { revealRefs.current[4] = el; }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-white/50">
            Partner With Us
          </p>

          <h2 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
            Partner With The Mission
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/70">
            Your generosity helps support ministry opportunities, revival gatherings, worship events, media content, and the mission of leading people into the presence of Jesus. Every gift helps us continue sharing the Gospel and serving churches around the nation.
          </p>

          <div className="mt-12">
            <a
              href="#"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-black transition hover:opacity-90"
            >
              Give Now
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
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-black/40">
            Drag to explore →
          </p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
            Moments Along The Way
          </h2>
        </div>

        <div
          ref={galleryRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="flex cursor-grab active:cursor-grabbing gap-8 overflow-x-auto pl-8 lg:pl-16 pr-16 select-none scroll-smooth [scroll-behavior:smooth] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <img
            src="/worshipping.JPG"
            alt="Ministry Moment"
            className="h-[420px] md:h-[620px] w-[460px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/DSC02835.JPG"
            alt="Ministry Moment"
            className="mt-20 h-[460px] w-[320px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_1859.JPG"
            alt="Ministry Moment"
            className="h-[500px] md:h-[720px] w-[540px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_6078.jpeg"
            alt="Ministry Moment"
            className="mt-12 h-[360px] md:h-[520px] w-[380px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_6886.jpeg"
            alt="Ministry Moment"
            className="h-[420px] md:h-[620px] w-[460px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_5161.JPG"
            alt="Ministry Moment"
            className="mt-16 h-[500px] w-[360px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_1848.JPG"
            alt="Ministry Moment"
            className="h-[460px] md:h-[680px] w-[500px] flex-none rounded-[32px] object-cover"
          />
          <img
            src="/IMG_1858.JPG"
            alt="Ministry Moment"
            className="mt-20 h-[460px] w-[320px] flex-none rounded-[32px] object-cover"
          />
        </div>
      </section>
{showBookingModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md animate-fadeIn">
    <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 pb-10 md:p-10 text-black animate-modalIn">
      <div className="flex items-center justify-between">
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

        <div className="grid gap-4 md:grid-cols-3">
          <button type="button" onClick={() => setBookingType('Carter')} className={`rounded-2xl border p-5 ${bookingType === 'Carter' ? 'bg-black text-white border-black' : 'border-black/10'}`}>
            Carter
          </button>

          <button type="button" onClick={() => setBookingType('Tori')} className={`rounded-2xl border p-5 ${bookingType === 'Tori' ? 'bg-black text-white border-black' : 'border-black/10'}`}>
            Tori
          </button>

          <button type="button" onClick={() => setBookingType('Carter + Tori')} className={`rounded-2xl border p-5 ${bookingType === 'Carter + Tori' ? 'bg-black text-white border-black' : 'border-black/10'}`}>
            Carter + Tori
          </button>
        </div>
      </div>

      {!bookingSuccess ? (
      <form onSubmit={handleBookingSubmit}>
        <input type="hidden" name="bookingType" value={bookingType} />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input name="fullName" required placeholder="First & Last Name" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="church" required placeholder="Name of Church" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="eventName" required placeholder="Name of Event" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="phone" placeholder="Phone" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="email" required type="email" placeholder="Email" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="website" placeholder="Event Website" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="startDate" required type="date" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
          <input name="endDate" required type="date" className="rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10" />
        </div>

        <textarea
          name="eventDetails"
          rows={8}
          required
          placeholder="Please describe your event in detail, including the type and purpose, event time(s), location, expected audience size, budget range, worship team details, spiritual themes, special requests, and anything else we should know."
          className="mt-4 w-full rounded-xl border border-black/10 p-4 transition focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />

        <div className="mt-4 text-sm text-black/60">
          Email: harrisonworship@gmail.com
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full rounded-xl bg-black py-4 text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Sending...' : bookingSuccess ? 'Request Sent' : 'Send Request'}
        </button>
      </form>
      ) : (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="text-4xl">✓</div>
          <h4 className="mt-3 text-2xl font-semibold">We'll Be In Touch Soon</h4>
          <p className="mt-3 text-black/70">
            Your request has been received. Our team will review the details and follow up shortly.
          </p>
        </div>
      )}
    </div>
  </div>
)}
<footer className="bg-black px-6 lg:px-16 py-20 text-white">
  <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">
        The Harrisons
      </p>

      <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
        Carter & Tori
      </h3>
    </div>

    <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.2em] text-white/70 md:text-right">
      <p className="mb-2 text-xs uppercase tracking-[0.35em] text-white/40">
        Connect
      </p>
      <a href="https://instagram.com/creativeharrisons" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="https://youtube.com/@creativeharrisons" target="_blank" rel="noopener noreferrer">YouTube</a>
      <a href="https://www.facebook.com/creativeharrisons" target="_blank" rel="noopener noreferrer">Facebook</a>
      <a href="https://tiktok.com/@creativeharrisons" target="_blank" rel="noopener noreferrer">TikTok</a>
      <p className="mt-3 text-xs normal-case tracking-normal text-white/50">
        harrisonworship@gmail.com
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
      `}</style>
    </main>
  );
}


