const { useState, useEffect, useRef } = React;

const PIECES = [
  { name: "Hearth Bowl", glaze: "Ash White", temp: "1280°C", img: "https://images.unsplash.com/photo-1551807944-e8ff53798d5e?fm=jpg&q=80&w=800&fit=crop" },
  { name: "Still Vase", glaze: "Deep Glaze", temp: "1250°C", img: "https://images.unsplash.com/photo-1596084699150-19c8fd813d71?fm=jpg&q=80&w=800&fit=crop" },
  { name: "Ember Cup", glaze: "Iron Clay", temp: "1300°C", img: "https://images.unsplash.com/photo-1520617875197-7434166bcf86?fm=jpg&q=80&w=800&fit=crop" },
  { name: "Low Plate", glaze: "Slip White", temp: "1220°C", img: "https://images.unsplash.com/photo-1745828186668-d1131baac067?fm=jpg&q=80&w=800&fit=crop" },
];

const WORKSHOPS = [
  { name: "Wheel Throwing — Basics", meta: "Saturdays · 3hr session", seats: "4 seats left" },
  { name: "Glaze Chemistry Lab", meta: "Sun evenings · 2hr session", seats: "2 seats left" },
  { name: "Hand-Building Forms", meta: "Weekdays · 2.5hr session", seats: "7 seats left" },
];

function useReveal(){
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){ el.classList.add('in'); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Nav(){
  const [open, setOpen] = useState(false);
  const links = ["Work", "Workshops", "Studio", "Contact"];
  return (
    <>
      <nav>
        <div className="brand">Kiln<span>&amp;</span>Ash</div>
        <ul className="nav-links">
          {links.map(l => <li key={l}><a href={"#" + l.toLowerCase()}>{l}</a></li>)}
        </ul>
        <button className={"burger" + (open ? " open" : "")} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div className={"mobile-menu" + (open ? " open" : "")}>
        {links.map(l => <a key={l} href={"#" + l.toLowerCase()} onClick={() => setOpen(false)}>{l}</a>)}
      </div>
    </>
  );
}

function Hero(){
  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div>
          <div className="label eyebrow">Studio Pottery · Est. workshop, not factory</div>
          <h1>Shaped by hand,<br/><em>fired</em> by fire.</h1>
          <p>Small-batch stoneware and functional ceramics, thrown and glazed one piece at a time in a single kiln room.</p>
          <a className="cta" href="#contact">Book a class</a>
        </div>
        <div className="wheel-wrap"><div className="wheel"></div></div>
      </div>
    </section>
  );
}

function Gallery(){
  const ref = useReveal();
  return (
    <section id="work" ref={ref} className="reveal">
      <div className="section-head">
        <div>
          <div className="label">Recent work</div>
          <h2>From the shelf</h2>
        </div>
        <p>Each piece fired once, glazed once — no two come out quite the same.</p>
      </div>
      <div className="gallery">
        {PIECES.map(p => (
          <div className="piece" key={p.name} style={{backgroundImage: `linear-gradient(180deg, rgba(23,20,15,0) 40%, rgba(23,20,15,0.85) 100%), url(${p.img})`}}>
            <div className="piece-info">
              <div className="label">{p.glaze} · {p.temp}</div>
              <h3>{p.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Workshops(){
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const ref = useReveal();

  useEffect(() => {
    const t = setTimeout(() => { setItems(WORKSHOPS); setLoading(false); }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="workshops" ref={ref} className="reveal">
      <div className="section-head">
        <div>
          <div className="label">This month</div>
          <h2>Open workshops</h2>
        </div>
        <p>Small groups, real clay under your nails. Booked out fast.</p>
      </div>
      <div className="workshop-list">
        {loading
          ? [0,1,2].map(i => <div key={i} className="skeleton skeleton-row"></div>)
          : items.map(w => (
              <div className="workshop-row" key={w.name}>
                <h3>{w.name}</h3>
                <span className="meta">{w.meta}</span>
                <span className="seats">{w.seats}</span>
              </div>
            ))
        }
      </div>
    </section>
  );
}

function ContactForm(){
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const validate = (field, val) => {
    if(field === "name") return val.trim().length < 2 ? "Enter your name" : "";
    if(field === "email") return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "Enter a valid email" : "";
    if(field === "message") return val.trim().length < 10 ? "Say a little more (10+ chars)" : "";
    return "";
  };

  const handleChange = (field, val) => {
    setValues(v => ({ ...v, [field]: val }));
    if(touched[field]) setErrors(er => ({ ...er, [field]: validate(field, val) }));
  };
  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(er => ({ ...er, [field]: validate(field, values[field]) }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: validate("name", values.name),
      email: validate("email", values.email),
      message: validate("message", values.message),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    if(!newErrors.name && !newErrors.email && !newErrors.message){
      setSent(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={"field" + (errors.name ? " error" : "")}>
        <label>Name</label>
        <input value={values.name} onChange={e => handleChange("name", e.target.value)} onBlur={() => handleBlur("name")} />
        <span className="error-msg">{touched.name && errors.name}</span>
      </div>
      <div className={"field" + (errors.email ? " error" : "")}>
        <label>Email</label>
        <input value={values.email} onChange={e => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")} />
        <span className="error-msg">{touched.email && errors.email}</span>
      </div>
      <div className={"field" + (errors.message ? " error" : "")}>
        <label>What are you hoping to make?</label>
        <textarea value={values.message} onChange={e => handleChange("message", e.target.value)} onBlur={() => handleBlur("message")} />
        <span className="error-msg">{touched.message && errors.message}</span>
      </div>
      {sent
        ? <div className="success">Message sent — we'll reply within a day or two.</div>
        : <button className="cta submit-btn" type="submit">Send message</button>
      }
    </form>
  );
}

function Studio(){
  const ref = useReveal();
  return (
    <section id="studio" ref={ref} className="reveal">
      <div className="section-head">
        <div>
          <div className="label">About the studio</div>
          <h2>One room, one kiln</h2>
        </div>
      </div>
      <div className="studio-wrap">
        <img className="studio-photo" src="https://images.unsplash.com/photo-1699643759997-773552695320?fm=jpg&q=80&w=1000&fit=crop" alt="Pottery wheel in the studio" />
        <div className="studio-copy">
          <p>Kiln &amp; Ash started as a single wheel in a garage — it's grown into a proper studio, but the pace hasn't changed. Every piece still passes through one pair of hands, from raw clay to final glaze.</p>
          <div className="studio-stats">
            <div><strong>7</strong><span>years running</span></div>
            <div><strong>1</strong><span>kiln, always full</span></div>
            <div><strong>1300°C</strong><span>top firing temp</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact(){
  const ref = useReveal();
  return (
    <section id="contact" ref={ref} className="reveal">
      <div className="section-head">
        <div>
          <div className="label">Get in touch</div>
          <h2>Come throw with us</h2>
        </div>
      </div>
      <div className="contact-wrap">
        <div>
          <p style={{color:"var(--ash)", lineHeight:1.7, maxWidth:"36ch"}}>
            Studio visits by appointment. Beginners welcome — most people leave their first class with a wobbly bowl and a plan to come back.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function App(){
  return (
    <>
      <Nav />
      <Hero />
      <Gallery />
      <Workshops />
      <Studio />
      <Contact />
      <footer>
        <span>Kiln &amp; Ash Studio</span>
        <span>Open Tue–Sun, by appointment</span>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);