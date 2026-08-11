import { useState, useEffect } from 'react';
import './App.css';
import { usePaystackPayment } from 'react-paystack';

export default function App() {
  const [view, setView] = useState('landing'); // landing | login | dashboard
  const [mode, setMode] = useState('login');   // login | signup
  const [showModal, setShowModal] = useState(null);
  const [toast, setToast] = useState('');
  const [selectedCat, setSelectedCat] = useState('organic');
  const [paymentDone, setPaymentDone] = useState(false);
  const [heroWhen, setHeroWhen] = useState('Tue, Aug 4 · 8:00–10:00 AM');
  const [notifOpen, setNotifOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [userName, setUserName] = useState('Bisi Adewale');
  const [userEmail, setUserEmail] = useState('bisi@email.com');
  const [userAddress, setUserAddress] = useState('');
  const [userId, setUserId] = useState(null);
  const paystackConfig = {
  reference: new Date().getTime().toString(),
  email: userEmail || 'customer@email.com',
  amount: 150000,
  publicKey: 'pk_test_47d6eb06978f42d857756ed365ac9166c0019a54',
};
const onPaystackSuccess = (reference) => {
  console.log('Payment successful:', reference);

  fetch('http://localhost:5000/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userId,
      amount: 1500,
      method: 'Paystack'
    })
  });

  setPaymentDone(true);
  setShowModal(null);
  showToast('Payment of ₦1,500 successful!');
};

const onPaystackClose = () => {
  showToast('Payment cancelled');
};
const initializePayment = usePaystackPayment(paystackConfig);
  const [selectedDate, setSelectedDate] = useState('Tue, Aug 4');
 const [selectedTime, setSelectedTime] = useState('8:00–10:00 AM');
 const [userMessages, setUserMessages] = useState([]);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  // Greeting based on time
  const [greeting, setGreeting] = useState('Good morning');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  useEffect(() => {
  if (view === 'dashboard' && userId && userId !== 'admin') {
    fetch(`http://localhost:5000/messages/${userId}`)
      .then(res => res.json())
      .then(data => setUserMessages(data))
      .catch(err => console.log(err));
  }
}, [view, userId]);

  // Category data
  const catData = {
    organic: [
      ['Sabo Compost Hub', '0.8 km · Open until 6:00 PM'],
      ['Mayfair Green Point', '1.4 km · Open until 7:00 PM'],
      ['Odo-Ogbe Market Bin Station', '2.1 km · Open 24 hours'],
    ],
    plastic: [
      ['Lagere Recyclers', '1.1 km · Open until 5:00 PM'],
      ['Sabo Compost Hub', '0.8 km · Also accepts plastics'],
      ['Enuwa Collection Point', '2.6 km · Open until 8:00 PM'],
    ],
    paper: [
      ['Moore Paper Bank', '1.9 km · Open until 6:00 PM'],
      ['Odo-Ogbe Market Bin Station', '2.1 km · Open 24 hours'],
    ],
    glass: [
      ['GRA Glass Bank', '1.6 km · Open until 7:00 PM'],
      ['Enuwa Collection Point', '2.6 km · Open until 8:00 PM'],
    ],
    metal: [
      ['Lagere Scrap Point', '1.2 km · Open until 5:00 PM'],
      ['Odo-Ogbe Market Bin Station', '2.1 km · Open 24 hours'],
    ],
    hazard: [['OSEPA Drop-off Centre', '3.4 km · Open weekdays only']],
  };

  const catColor = {
    organic: 'var(--organic)',
    plastic: 'var(--plastic)',
    paper: 'var(--paper)',
    glass: 'var(--glass)',
    metal: 'var(--metal)',
    hazard: 'var(--hazard)',
  };

  const catLabel = {
    organic: 'Organic',
    plastic: 'Plastic',
    paper: 'Paper',
    glass: 'Glass',
    metal: 'Metal',
    hazard: 'Hazardous',
  };

  // ===== LANDING PAGE =====
  const Landing = () => (
    <div id="landingView">
      <nav className="land-nav">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" stroke="#0B1F1A" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" stroke="#0B1F1A" strokeWidth="1.8"/>
              <path d="M4 8h16" stroke="#0B1F1A" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="brand-name">WasteWise</span>
        </div>
        <div className="land-nav-links">
          <button className="land-nav-link" onClick={() => document.getElementById('land-how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            How it works
          </button>
          <button className="land-nav-link" onClick={() => document.getElementById('land-recycling')?.scrollIntoView({ behavior: 'smooth' })}>
            Recycling
          </button>
        </div>
        <div className="land-nav-actions">
  <button className="btn-ghost" onClick={() => { setMode('login'); setView('login'); }}>
    Log in
  </button>
  <button className="btn-solid" onClick={() => { setMode('signup'); setView('login'); }}>
    Get started
  </button>
  <button 
    className="btn-ghost" 
    style={{ borderColor: '#D65B4A', color: '#D65B4A' }}
    onClick={() => { setMode('admin'); setView('login'); }}
  >
    Admin Login
  </button>
</div>
      </nav>

      <header className="land-hero">
      {/* Soft decorative circle */}
<div style={{
  position: 'absolute',
  top: '20px',
  left: '30px',
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  background: 'rgba(63, 166, 107, 0.12)',
  zIndex: 0
}}></div>
        <div className="land-hero-inner">
          <span className="land-eyebrow"><span className="pulse"></span>Built for Ile-Ife neighborhoods</span>
          <h1>Waste pickup that <em>actually shows up.</em></h1>
          <p>Schedule collection, sort your waste correctly, and track your pickup live — so you're never left wondering if the truck is coming.</p>
          <div className="land-hero-actions">
            <button className="btn-solid amber" onClick={() => { setMode('signup'); setView('login'); }}>
              Create your account
              <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="btn-ghost" onClick={() => { setMode('login'); setView('login'); }}>I already have an account</button>
          </div>
          <div className="land-hero-note">No card required to get started · Free to schedule your first pickup</div>
        </div>

        <div className="land-visual">
          <div className="land-visual-top">
            <span className="hero-eyebrow"><span className="pulse"></span>Live · Pickup #WW-4821</span>
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>8:00–10:00 AM</span>
          </div>
          <div className="mini-stepper">
            <div className="mini-track">
              <div className="mini-fill"></div>
              <div className="mini-dot"></div>
            </div>
            <div className="mini-labels">
              <span className="on">Scheduled</span>
              <span className="on">En route</span>
              <span>Arrived</span>
              <span>Collected</span>
            </div>
          </div>
        </div>
      </header>

      <section className="steps-section" id="land-how-it-works">
        <div className="land-section-head">
          <h2>How it works</h2>
          <p>Three steps, and you never have to wonder where your waste went.</p>
        </div>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-connector"></div>
            <div className="step-num n1">1</div>
            <h3>Schedule your pickup</h3>
            <p>Pick a day and time window that works for you. We match you with the nearest available collector automatically.</p>
          </div>
          <div className="step-card">
            <div className="step-connector"></div>
            <div className="step-num n2">2</div>
            <h3>Sort as you go</h3>
            <p>Tell us what you're disposing of — organic, plastic, glass, and more — so it's handled correctly from the start.</p>
          </div>
          <div className="step-card">
            <div className="step-num n3">3</div>
            <h3>Track it live</h3>
            <p>Watch your collector move from scheduled to en route to collected — no more guessing if today's the day.</p>
          </div>
        </div>
      </section>

      <section className="land-section">
        <div className="land-section-head">
          <h2>Everything you need, nothing you don't</h2>
          <p>Built around what people told us matters most: reliability first, then the tools to make waste disposal effortless.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--leaf-tint)' }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ color: 'var(--leaf-dark)' }}>
                <path d="M4 12a8 8 0 1 1 3 6.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M4 18v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Live pickup tracking</h3>
            <p>Watch your collector move from scheduled to en route to collected, in real time — no more guessing if today's the day.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--amber-tint)' }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ color: '#8A5A0C' }}>
                <rect x="4" y="5.5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Flexible scheduling</h3>
            <p>Pick a pickup window that works for you, and we'll assign the nearest available collector automatically.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#E4F0FA' }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ color: 'var(--plastic)' }}>
                <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="12" cy="9.3" r="2.4" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </div>
            <h3>Recycling locator</h3>
            <p>Find the nearest drop-off point for plastic, glass, paper, metal, or e-waste, sorted by category and distance.</p>
          </div>
        </div>
      </section>

      <div className="cat-strip-wrap" id="land-recycling">
        <div className="cat-strip-label">Sort by category, every time</div>
        <div className="cat-strip">
          {['organic', 'plastic', 'paper', 'glass', 'metal', 'hazard'].map((cat) => (
            <button
              key={cat}
              className={`chip ${selectedCat === cat ? 'active' : ''}`}
              data-cat={cat}
              onClick={() => {
                setSelectedCat(cat);
                showToast(`Create an account to start sorting ${catLabel[cat]} waste`);
              }}
            >
              <span className="swatch" style={{ background: catColor[cat] }}></span>
              {catLabel[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="land-cta">
        <h2>Ready to stop wondering when pickup is coming?</h2>
        <p>Join the neighborhoods already scheduling smarter, more reliable waste collection.</p>
        <button className="btn-solid amber" onClick={() => { setMode('signup'); setView('login'); }}>
          Create your free account
        </button>
      </div>

      <footer className="land-footer">
        <div className="brand" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="brand-mark" style={{ width: 26, height: 26 }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" stroke="#0B1F1A" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" stroke="#0B1F1A" strokeWidth="1.8"/>
              <path d="M4 8h16" stroke="#0B1F1A" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="brand-name" style={{ fontSize: '1rem' }}>WasteWise</span>
        </div>
        © 2026 WasteWise. Cleaner streets, one pickup at a time.
      </footer>
    </div>
  );

  // ===== LOGIN / SIGNUP =====
 // ===== LOGIN / SIGNUP =====
  // ===== LOGIN / SIGNUP / ADMIN =====
const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: false, pass: false, address: false });

  const validate = () => {
    const emailOk = email.includes('@') || /^[0-9+][0-9+\-\s]{6,}$/.test(email);
    const passOk = pass.length >= 6;
    const addressOk = mode === 'login' || mode === 'admin' || address.trim().length > 4;
    setErrors({ email: !emailOk, pass: !passOk, address: !addressOk });
    return emailOk && passOk && addressOk;
  };

  const attemptLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      // ==================== ADMIN LOGIN ====================
      if (mode === 'admin') {
        if (email === 'admin@wastewise.com' && pass === 'admin123') {
          setUserName('Admin');
          setUserEmail('admin@wastewise.com');
          setUserAddress('WasteWise Headquarters');
          setUserId('admin');
          showToast('Welcome Admin!');
          setView('admin');
        } else {
          showToast('Invalid admin credentials');
        }
        setLoading(false);
        return;
      }

      // ==================== USER SIGNUP ====================
      if (mode === 'signup') {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            password: pass,
            address: address.trim()
          })
        });

        const data = await response.json();

        if (!response.ok) {
          showToast(data.message || 'Registration failed');
          setLoading(false);
          return;
        }

        setUserId(data.userId);
        setUserName(data.fullName);
        setUserEmail(data.email);
        setUserAddress(data.address);
        showToast('Account created successfully!');
        setView('dashboard');
      } 
      
      // ==================== USER LOGIN ====================
      else {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password: pass
          })
        });

        const data = await response.json();

        if (!response.ok) {
          showToast(data.message || 'Login failed');
          setLoading(false);
          return;
        }

        setUserId(data.user.id);
        setUserName(data.user.fullName);
        setUserEmail(data.user.email);
        setUserAddress(data.user.address);
        showToast('Login successful!');
        setView('dashboard');
      }
    } catch (error) {
      console.error(error);
      showToast('Cannot connect to server. Is the backend running?');
    }

    setLoading(false);
  };

  return (
    <div className="login-view" style={{ display: 'flex' }}>
      <div className={`login-card ${mode === 'signup' ? 'mode-signup' : ''}`}>
        <div className="login-brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" stroke="#0B1F1A" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" stroke="#0B1F1A" strokeWidth="1.8"/>
              <path d="M4 8h16" stroke="#0B1F1A" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="login-brand-name">WasteWise</span>
        </div>

        <div className="login-head">
          <h2>
            {mode === 'signup' && 'Create your account'}
            {mode === 'login' && 'Welcome back'}
            {mode === 'admin' && 'Admin Login'}
          </h2>
          <p>
            {mode === 'signup' && 'Sign up to schedule pickups and track collection in real time.'}
            {mode === 'login' && 'Log in to schedule pickups and track your collection in real time.'}
            {mode === 'admin' && 'Enter admin credentials to manage the system.'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="field">
            <label>Full name</label>
            <div className="field-input">
              <input
                type="text"
                placeholder="Bisi Adewale"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div className={`field ${errors.address ? 'has-error' : ''}`}>
            <label>Pickup address</label>
            <div className={`field-input ${errors.address ? 'invalid' : ''}`}>
              <input
                type="text"
                placeholder="e.g. 12 Fajuyi Road, Mayfair, Ile-Ife"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className={`field ${errors.email ? 'has-error' : ''}`}>
          <label>Email</label>
          <div className={`field-input ${errors.email ? 'invalid' : ''}`}>
            <input
              type="text"
              placeholder={mode === 'admin' ? 'admin@wastewise.com' : 'you@email.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className={`field ${errors.pass ? 'has-error' : ''}`}>
          <label>Password</label>
          <div className={`field-input ${errors.pass ? 'invalid' : ''}`}>
            <input
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
        </div>

        <button 
          className={`login-btn ${loading ? 'loading' : ''}`} 
          onClick={attemptLogin} 
          disabled={loading}
          style={mode === 'admin' ? { background: '#D65B4A' } : {}}
        >
          {loading ? 'Please wait...' : (
            mode === 'signup' ? 'Create account' : 
            mode === 'admin' ? 'Admin Login' : 'Log in'
          )}
        </button>

        <div className="login-foot">
          {mode === 'login' && (
            <>New to WasteWise? <button onClick={() => setMode('signup')}>Create an account</button></>
          )}
          {mode === 'signup' && (
            <>Already have an account? <button onClick={() => setMode('login')}>Log in</button></>
          )}
          {mode === 'admin' && (
            <button onClick={() => setMode('login')}>Back to User Login</button>
          )}
        </div>
      </div>
    </div>
  );
};
// ===== ADMIN DASHBOARD =====
// ===== ADMIN DASHBOARD =====
// ===== ADMIN DASHBOARD =====
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // For individual messaging
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch('http://localhost:5000/admin/users');
        const usersData = await usersRes.json();
        setUsers(usersData);

        const pickupsRes = await fetch('http://localhost:5000/admin/pickups');
        const pickupsData = await pickupsRes.json();
        setPickups(pickupsData);
      } catch (error) {
        showToast('Failed to load admin data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const openMessageBox = (user) => {
    setSelectedUser(user);
    setMessageText('');
  };

  const sendMessageToUser = async () => {
  if (!messageText.trim()) {
    showToast('Please type a message');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedUser.id,
        message: messageText.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showToast(data.message || 'Failed to send message');
      return;
    }

    showToast(`Message sent to ${selectedUser.full_name}!`);
    setSelectedUser(null);
    setMessageText('');
  } catch (error) {
    showToast('Cannot connect to server');
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #EAF3EE 0%, #F7F9F4 100%)',
      padding: '24px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2B26, #1A4A3F)',
        color: 'white',
        padding: '20px 28px',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(15, 43, 38, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: '#3FA66B',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}>
            🗑️
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>WasteWise Admin</h2>
            <p style={{ margin: '2px 0 0', opacity: 0.85, fontSize: '0.9rem' }}>
              Manage users, schedules & messages
            </p>
          </div>
        </div>
        <button
          onClick={() => setView('landing')}
          style={{
            background: '#D65B4A',
            color: 'white',
            border: 'none',
            padding: '11px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #E1E4D8' }}>
          <div style={{ fontSize: '0.85rem', color: '#6B7C75' }}>Total Users</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0F2B26' }}>{users.length}</div>
        </div>
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #E1E4D8' }}>
          <div style={{ fontSize: '0.85rem', color: '#6B7C75' }}>Total Schedules</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0F2B26' }}>{pickups.length}</div>
        </div>
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #E1E4D8' }}>
          <div style={{ fontSize: '0.85rem', color: '#6B7C75' }}>Pending Pickups</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#F2A93B' }}>
            {pickups.filter(p => p.status === 'Scheduled').length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'users', label: `👥 Users (${users.length})` },
          { id: 'pickups', label: `📅 Schedules (${pickups.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '11px 20px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? '#3FA66B' : 'white',
              color: activeTab === tab.id ? 'white' : '#14231F',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(63,166,107,0.3)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        border: '1px solid #E1E4D8'
      }}>
        {loading && <p style={{ textAlign: 'center', color: '#6B7C75' }}>Loading data...</p>}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && !loading && (
          <div>
            <h3 style={{ marginTop: 0, color: '#0F2B26' }}>Registered Users</h3>

            {users.length === 0 ? (
              <p style={{ color: '#6B7C75' }}>No users have registered yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F3F5EC', textAlign: 'left' }}>
                      <th style={{ padding: '14px 12px' }}>Name</th>
                      <th style={{ padding: '14px 12px' }}>Email</th>
                      <th style={{ padding: '14px 12px' }}>Address</th>
                      <th style={{ padding: '14px 12px' }}>Joined</th>
                      <th style={{ padding: '14px 12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #E8EBE3' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 600 }}>{user.full_name}</td>
                        <td style={{ padding: '14px 12px' }}>{user.email}</td>
                        <td style={{ padding: '14px 12px' }}>{user.address}</td>
                        <td style={{ padding: '14px 12px', color: '#6B7C75' }}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <button
                            onClick={() => openMessageBox(user)}
                            style={{
                              background: '#3FA66B',
                              color: 'white',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.85rem'
                            }}
                          >
                            💬 Message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Message Box (appears when you click Message) */}
            {selectedUser && (
              <div style={{
                marginTop: '28px',
                padding: '20px',
                background: '#F3F5EC',
                borderRadius: '14px',
                border: '1px solid #D4E5D9'
              }}>
                <h4 style={{ margin: '0 0 8px', color: '#0F2B26' }}>
                  Send message to: {selectedUser.full_name}
                </h4>
                <p style={{ margin: '0 0 12px', color: '#6B7C75', fontSize: '0.9rem' }}>
                  {selectedUser.email} • {selectedUser.address}
                </p>

                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your personal message here..."
                  style={{
                    width: '100%',
                    height: '110px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1.5px solid #C5D5C9',
                    fontSize: '1rem',
                    marginBottom: '12px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={sendMessageToUser}
                    style={{
                      background: '#3FA66B',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    style={{
                      background: 'white',
                      color: '#4B5B54',
                      border: '1px solid #C5D5C9',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PICKUPS TAB ==================== */}
        {activeTab === 'pickups' && !loading && (
          <div>
            <h3 style={{ marginTop: 0, color: '#0F2B26' }}>Scheduled Pickups</h3>
            {pickups.length === 0 ? (
              <p style={{ color: '#6B7C75' }}>No pickups have been scheduled yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F3F5EC', textAlign: 'left' }}>
                      <th style={{ padding: '14px 12px' }}>Request ID</th>
                      <th style={{ padding: '14px 12px' }}>Customer</th>
                      <th style={{ padding: '14px 12px' }}>Address</th>
                      <th style={{ padding: '14px 12px' }}>Date</th>
                      <th style={{ padding: '14px 12px' }}>Time</th>
                      <th style={{ padding: '14px 12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickups.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #E8EBE3' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 600 }}>{p.request_id}</td>
                        <td style={{ padding: '14px 12px' }}>{p.full_name || 'Unknown'}</td>
                        <td style={{ padding: '14px 12px' }}>{p.address || '-'}</td>
                        <td style={{ padding: '14px 12px' }}>{p.pickup_date}</td>
                        <td style={{ padding: '14px 12px' }}>{p.time_window}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{
                            background: p.status === 'Scheduled' ? '#FFF4E0' : '#E4F3E9',
                            color: p.status === 'Scheduled' ? '#B7791F' : '#2C8556',
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '0.82rem',
                            fontWeight: 600
                          }}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
  // ===== DASHBOARD =====
  const Dashboard = () => (
    <div id="dashboardRoot" className="visible">
      <div className="app-shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" stroke="#0B1F1A" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" stroke="#0B1F1A" strokeWidth="1.8"/>
                <path d="M4 8h16" stroke="#0B1F1A" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="brand-name">WasteWise</span>
          </div>
          <nav className="side-nav">
            <button className="side-link active" onClick={() => showToast('Home')}>
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/></svg>
              Home
            </button>
            <button className="side-link" onClick={() => setShowModal('schedule')}>
              <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.9"/><path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
              Schedule
            </button>
            <button className="side-link" onClick={() => setShowModal('track')}>
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 1 1 3 6.24" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><path d="M4 18v-4h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
              Track
            </button>
            <button className="side-link" onClick={() => setShowModal('profile')}>
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.2" r="3.2" stroke="currentColor" strokeWidth="1.9"/><path d="M4.8 19.5c1.2-3.4 4-5.2 7.2-5.2s6 1.8 7.2 5.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
              Profile
            </button>
          </nav>
          <div className="side-foot" onClick={() => setShowModal('profile')}>
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="side-foot-text">
              <div className="side-foot-name">{userName}</div>
              <div className="side-foot-sub">{userAddress || 'Mayfair, Ile-Ife'}</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main-col">
          <div className="topbar">
            <div className="topbar-loc">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                <circle cx="12" cy="9.3" r="2.4" stroke="currentColor" strokeWidth="1.7"/>
              </svg>
              <span>{userAddress || '12 Fajuyi Road, Mayfair, Ile-Ife'}</span>
            </div>
            <div className="topbar-actions" style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6 9a6 6 0 1 1 12 0c0 4.2 1.2 5.6 1.8 6.4a.8.8 0 0 1-.6 1.3H4.8a.8.8 0 0 1-.6-1.3C4.8 14.6 6 13.2 6 9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
                  <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                <span className="dot"></span>
              </button>
              {notifOpen && (
                <div className="notif-panel open">
                  <div className="notif-panel-head">Notifications</div>
                  <div className="notif-item">
                    <div className="notif-icon" style={{ background: 'var(--leaf-tint)', color: 'var(--leaf-dark)' }}>
                      <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <div className="notif-text">Your collector is en route — arriving around 9:40 AM.</div>
                      <div className="notif-time">12 minutes ago</div>
                    </div>
                  </div>
                  <div className="notif-item">
                    <div className="notif-icon" style={{ background: 'var(--amber-tint)', color: '#8A5A0C' }}>
                      <svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="6" width="17" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
                    </div>
                    <div>
                      <div className="pay-amt mono">NGN 1,500</div>
                      <div className="notif-text">Payment of NGN 1,500 is due Aug 5.</div>
                      <div className="modal-sub">NGN 1,500 was paid for this month.</div>
                      <div className="notif-time">3 hours ago</div>
                    </div>
                  </div>
                </div>
              )}
              <button className="icon-btn" onClick={() => setView('landing')}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M15 8V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12h11m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="content">
            <div className="greeting">
              <h1>{greeting}, {userName.split(' ')[0]}</h1>
              <p>Here's what's happening with your waste pickups today.</p>
            </div>

            {/* Illustration */}
           {/* ===== FULL ILLUSTRATION ===== */}
<div className="dash-illustration" role="img" aria-label="WasteWise collection truck">
  <svg viewBox="0 0 900 260" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dashSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EAF3EE"/>
        <stop offset="100%" stopColor="#FCEACB"/>
      </linearGradient>
    </defs>

    {/* Background sky */}
    <rect width="900" height="260" fill="url(#dashSky)"/>

    {/* Sun */}
    <circle cx="800" cy="60" r="46" fill="#F2A93B" opacity="0.18"/>
    <circle cx="800" cy="60" r="30" fill="#F2A93B"/>

    {/* Clouds */}
    <g fill="#FFFFFF" opacity="0.75">
      <ellipse cx="140" cy="55" rx="34" ry="15"/>
      <ellipse cx="168" cy="48" rx="26" ry="13"/>
      <ellipse cx="112" cy="50" rx="22" ry="12"/>
      <ellipse cx="470" cy="35" rx="28" ry="12"/>
      <ellipse cx="495" cy="30" rx="20" ry="10"/>
    </g>

    {/* Ground / hills */}
    <path d="M0 165 Q150 130 320 160 T650 150 T900 165 V260 H0 Z" fill="#DCEEE2"/>
    <path d="M0 210 Q250 190 450 205 T900 200 V260 H0 Z" fill="#DEDCD1"/>
    <path d="M0 214 Q250 194 450 209 T900 204" fill="none" stroke="#F3F5EC" strokeWidth="4" strokeDasharray="16 14"/>

    {/* Houses */}
    <g>
      <rect x="60" y="120" width="90" height="60" rx="4" fill="#FFFFFF"/>
      <path d="M52 122 L105 88 L158 122 Z" fill="#3FA66B"/>
      <rect x="88" y="150" width="24" height="30" rx="2" fill="#0F2B26"/>
      <rect x="70" y="135" width="16" height="16" rx="2" fill="#CEE7D8"/>
      <rect x="120" y="135" width="16" height="16" rx="2" fill="#CEE7D8"/>

      <rect x="190" y="132" width="76" height="48" rx="4" fill="#FFFFFF"/>
      <path d="M183 134 L228 104 L273 134 Z" fill="#F2A93B"/>
      <rect x="212" y="156" width="20" height="24" rx="2" fill="#0F2B26"/>
    </g>

    {/* Trees */}
    <g>
      <rect x="172" y="150" width="6" height="28" rx="2" fill="#8A6A45"/>
      <circle cx="175" cy="142" r="20" fill="#3FA66B"/>
      <circle cx="162" cy="150" r="14" fill="#57B67F"/>
      <circle cx="188" cy="150" r="14" fill="#57B67F"/>
    </g>
    <g>
      <rect x="805" y="185" width="7" height="30" rx="2" fill="#8A6A45"/>
      <circle cx="808" cy="175" r="22" fill="#2C8556"/>
      <circle cx="793" cy="184" r="15" fill="#3FA66B"/>
      <circle cx="825" cy="184" r="15" fill="#3FA66B"/>
    </g>

    {/* Sorted bins */}
    <g>
      <rect x="290" y="158" width="20" height="24" rx="4" fill="#6FAE4F"/>
      <rect x="290" y="154" width="20" height="6" rx="2" fill="#4E8A37"/>
      <rect x="315" y="158" width="20" height="24" rx="4" fill="#2E8FD1"/>
      <rect x="315" y="154" width="20" height="6" rx="2" fill="#256F9F"/>
      <rect x="340" y="158" width="20" height="24" rx="4" fill="#C9A227"/>
      <rect x="340" y="154" width="20" height="6" rx="2" fill="#9C7E1D"/>
    </g>

    {/* Full WasteWise Truck */}
    <g transform="translate(430,178)">
      <ellipse cx="70" cy="70" rx="90" ry="10" fill="#0F2B26" opacity="0.08"/>
      {/* Truck body */}
      <rect x="0" y="0" width="120" height="58" rx="8" fill="#0F2B26"/>
      <rect x="8" y="8" width="104" height="18" rx="3" fill="#3FA66B"/>
      {/* Cabin */}
      <path d="M120 20 h34 a10 10 0 0 1 10 10 v28 h-44 Z" fill="#173A33"/>
      <rect x="132" y="30" width="22" height="16" rx="3" fill="#CEE7D8"/>
      {/* Wheels */}
      <circle cx="30" cy="62" r="14" fill="#22201C"/>
      <circle cx="30" cy="62" r="6" fill="#8A9690"/>
      <circle cx="150" cy="62" r="14" fill="#22201C"/>
      <circle cx="150" cy="62" r="6" fill="#8A9690"/>
    </g>
  </svg>
</div>

            <div className="grid">
              {/* Hero tracking card */}
              <div className="hero-card">
                <div className="hero-top">
                  <div>
                    <span className="hero-eyebrow"><span className="pulse"></span>Live · Pickup #WW-4821</span>
                    <div className="hero-when">{heroWhen}</div>
                    <div className="hero-sub">General waste + Recyclables · Collector: Femi A.</div>
                  </div>
                  <button className="hero-track-btn" onClick={() => setShowModal('track')}>
                    Track live
                    <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <div className="stepper">
                  <div className="stepper-track">
                    <div className="stepper-fill" style={{ width: '38%' }}></div>
                    <div className="truck-marker" style={{ left: '38%' }}>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3 7h11v8H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                        <path d="M14 10h4l3 3v2h-7v-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                        <circle cx="7" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6"/>
                        <circle cx="17.5" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6"/>
                      </svg>
                    </div>
                  </div>
                  <div className="stepper-labels">
                    <span className="done">Scheduled</span>
                    <span className="current">En route</span>
                    <span>Arrived</span>
                    <span>Collected</span>
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="quick-actions">
                <button className="qa-btn" onClick={() => setShowModal('schedule')}>
                  <div className="qa-icon" style={{ background: 'var(--leaf-tint)' }}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ color: 'var(--leaf-dark)' }}>
                      <rect x="4" y="5.5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Schedule pickup</span>
                </button>
                <button className="qa-btn" onClick={() => showToast('Scroll to sort section')}>
                  <div className="qa-icon" style={{ background: 'var(--amber-tint)' }}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ color: '#8A5A0C' }}>
                      <path d="M12 3 4 6.5V11c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Sort waste</span>
                </button>
                <button className="qa-btn" onClick={() => showToast('Recycling locator')}>
                  <div className="qa-icon" style={{ background: '#E4F0FA' }}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ color: 'var(--plastic)' }}>
                      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="12" cy="9.3" r="2.4" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <span>Recycling locator</span>
                </button>
                <button className="qa-btn" onClick={() => setShowModal('pay')}>
                  <div className="qa-icon" style={{ background: '#F0E9FB' }}>
                    <svg viewBox="0 0 24 24" fill="none" style={{ color: '#7A4FC4' }}>
                      <rect x="3.5" y="6" width="17" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M3.5 10.5h17" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M7 14.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Pay & billing</span>
                </button>
              </div>

              {/* Categories */}
              <div className="categories-wrap">
                <div className="section-label">What are you disposing of?</div>
                <div className="chip-row">
                  {['organic', 'plastic', 'paper', 'glass', 'metal', 'hazard'].map((cat) => (
                    <button
                      key={cat}
                      className={`chip ${selectedCat === cat ? 'active' : ''}`}
                      data-cat={cat}
                      onClick={() => {
                        setSelectedCat(cat);
                        showToast(`${catLabel[cat]} selected for your next pickup`);
                      }}
                    >
                      <span className="swatch" style={{ background: catColor[cat] }}></span>
                      {catLabel[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Left column */}
              <div className="col-left">
                {/* Messages from Admin */}
{userMessages.length > 0 && (
  <div className="card" style={{ marginBottom: '20px' }}>
    <div className="card-head">
      <h3>Messages from Admin</h3>
    </div>
    {userMessages.map((msg) => (
      <div key={msg.id} style={{
        padding: '12px 0',
        borderBottom: '1px solid #E8EBE3'
      }}>
        <div style={{ fontSize: '0.95rem', color: '#14231F' }}>
          {msg.message}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#6B7C75', marginTop: '4px' }}>
          {new Date(msg.created_at).toLocaleString()}
        </div>
      </div>
    ))}
  </div>
)}
                <div className="card">
                  <div className="card-head">
                    <h3>Recent activity</h3>
                    <button className="link" onClick={() => setActivityExpanded(!activityExpanded)}>
                      {activityExpanded ? 'Show less' : 'View all'}
                    </button>
                  </div>
                  <div className="activity-row">
                    <div className="act-icon" style={{ background: 'var(--leaf)' }}>
                      <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="act-body">
                      <div className="act-title">General waste collected</div>
                      <div className="act-date">Fri, Jul 24 · 9:12 AM</div>
                    </div>
                    <span className="badge ok">On time</span>
                  </div>
                  <div className="activity-row">
                    <div className="act-icon" style={{ background: 'var(--plastic)' }}>
                      <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M6 7l1 12.5A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.5L18 7M9.5 11v6M14.5 11v6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </div>
                    <div className="act-body">
                      <div className="act-title">Recyclables dropped at Sabo Hub</div>
                      <div className="act-date">Wed, Jul 22 · 4:40 PM</div>
                    </div>
                    <span className="badge ok">Completed</span>
                  </div>
                  {activityExpanded && (
                    <>
                      <div className="activity-row">
                        <div className="act-icon" style={{ background: 'var(--metal)' }}>
                          <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="act-body">
                          <div className="act-title">Metal scraps dropped at Lagere</div>
                          <div className="act-date">Fri, Jul 17 · 3:20 PM</div>
                        </div>
                        <span className="badge ok">Completed</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="card">
                  <div className="card-head"><h3>Next payment</h3></div>
                  <div className="pay-row">
                    <div>
                      <div className="pay-amt mono" style={{ fontSize: '2rem' }}>NGN 1,500</div>
                      <div className="pay-due">{paymentDone ? 'Paid · Next due Sep 5' : 'Due Aug 5 · Monthly plan'}</div>
                    </div>
                    {!paymentDone && (
                      <button className="pay-btn" onClick={() => setShowModal('pay')}>Pay now</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="col-right">
                <div className="section-label">Your impact this month</div>
                <div className="stat-grid">
                  <div className="stat">
                    <div className="num mono">14</div>
                    <div className="lbl">On-time pickups</div>
                  </div>
                  <div className="stat">
                    <div className="num mono">6.4kg</div>
                    <div className="lbl">Recycled waste</div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-head">
                    <h3>Nearby drop-off points</h3>
                    <button className="link" onClick={() => setMapOpen(!mapOpen)}>
                      {mapOpen ? 'Hide map' : 'Map'}
                    </button>
                  </div>
                  {mapOpen && (
                    <div style={{ height: 150, borderRadius: 14, marginBottom: 12, background: 'linear-gradient(135deg,#DCEEE2,#EAF3EE)' }}></div>
                  )}
                  {(catData[selectedCat] || []).map(([name, dist], i) => (
                    <div className="drop-item" key={i}>
                      <div className="drop-swatch" style={{ background: catColor[selectedCat] }}></div>
                      <div>
                        <div className="drop-name">{name}</div>
                        <div className="drop-dist">{dist}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tab bar */}
      <nav className="tab-bar">
        <button className="tab-item active" onClick={() => showToast('Home')}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/></svg>
          <span>Home</span>
        </button>
        <button className="tab-item" onClick={() => setShowModal('schedule')}>
          <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.9"/><path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
          <span>Schedule</span>
        </button>
        <button className="tab-item" onClick={() => setShowModal('track')}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 1 1 3 6.24" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><path d="M4 18v-4h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
          <span>Track</span>
        </button>
        <button className="tab-item" onClick={() => setShowModal('profile')}>
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.2" r="3.2" stroke="currentColor" strokeWidth="1.9"/><path d="M4.8 19.5c1.2-3.4 4-5.2 7.2-5.2s6 1.8 7.2 5.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );

  // ===== MODALS =====
  const Modal = () => {
    if (!showModal) return null;

    if (showModal === 'schedule') {
  return (
    <div className="modal-overlay open" onClick={() => setShowModal(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowModal(null)}>×</button>
        
        <div className="modal-title">Schedule pickup</div>
        <div className="modal-sub">Pick a date and time window that works for you.</div>

        {/* Date Selection */}
        <div className="modal-section-label">Date</div>
        <div className="pill-row">
          {['Tue, Aug 4', 'Wed, Aug 5', 'Fri, Aug 7', 'Mon, Aug 10'].map((d) => (
            <button
              key={d}
              className={`pill-opt ${selectedDate === d ? 'selected' : ''}`}
              onClick={() => setSelectedDate(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Time Selection */}
        <div className="modal-section-label">Time window</div>
        <div className="pill-row">
          {['8:00–10:00 AM', '10:00 AM–12:00 PM', '2:00–4:00 PM'].map((t) => (
            <button
              key={t}
              className={`pill-opt ${selectedTime === t ? 'selected' : ''}`}
              onClick={() => setSelectedTime(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <button
  className="modal-confirm-btn"
  onClick={async () => {
    if (!userId) {
      showToast('Please login first');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          wasteType: selectedCat || 'General',
          pickupDate: selectedDate,
          timeWindow: selectedTime
        })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || 'Failed to schedule pickup');
        return;
      }

      setHeroWhen(`${selectedDate} · ${selectedTime}`);
      setShowModal(null);
      showToast(`Pickup scheduled! Request ID: ${data.requestId}`);
    } catch (error) {
      showToast('Cannot connect to server');
    }
  }}
>
  Confirm pickup
</button>
      </div>
    </div>
  );
}

    if (showModal === 'track') {
      return (
        <div className="modal-overlay open" onClick={() => setShowModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(null)}>×</button>
            <div className="modal-title">Live tracking</div>
            <div className="modal-sub">Pickup #WW-4821 · Collector: Femi A.</div>
            <div className="modal-track-stage done"><div className="modal-track-dot"></div><span>Scheduled — Tue, Aug 4, 7:50 AM</span></div>
            <div className="modal-track-stage current"><div className="modal-track-dot"></div><span>En route — ETA 9:40 AM</span></div>
            <div className="modal-track-stage"><div className="modal-track-dot"></div><span>Arrived</span></div>
            <div className="modal-track-stage"><div className="modal-track-dot"></div><span>Collected</span></div>
            <button className="modal-confirm-btn" onClick={() => { setShowModal(null); showToast('Calling Femi A. …'); }}>
              Call collector
            </button>
          </div>
        </div>
      );
    }

    if (showModal === 'pay') {
      return (
        <div className="modal-overlay open" onClick={() => setShowModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(null)}>×</button>
            {paymentDone ? (
              <div className="modal-success">
                <div className="check-circle">✓</div>
                <div className="modal-title">You're all paid up</div>
                <div className="modal-sub">NGN 1,500 was paid for this month.</div>
                <button className="modal-confirm-btn" onClick={() => setShowModal(null)}>Close</button>
              </div>
            ) : (
              <>
                <div className="modal-title">Pay now</div>
                <div className="modal-sub">Monthly plan · Due Aug 5</div>
                <div style={{ textAlign: 'center', padding: '14px 0' }}>
                  <div className="pay-amt mono" style={{ fontSize: '2rem' }}>NGN 1,500</div>
                </div>
                <div className="modal-section-label">Payment method</div>
                <div className="pill-row">
                  <button className="pill-opt selected">Card</button>
                  <button className="pill-opt">Bank transfer</button>
                  <button className="pill-opt">Wallet</button>
                </div>
                <button
                className="modal-confirm-btn"
                onClick={() => {
               if (!userId) {
               showToast('Please login first');
               return;
              }
           initializePayment(onPaystackSuccess, onPaystackClose);
             }}
             >
             Pay ₦1,500 with Paystack
            </button>
              </>
            )}
          </div>
        </div>
      );
    }

    if (showModal === 'profile') {
      return (
        <div className="modal-overlay open" onClick={() => setShowModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(null)}>×</button>
            <div style={{ textAlign: 'center' }}>
              <div className="avatar" style={{ width: 56, height: 56, fontSize: '1.2rem', margin: '0 auto 12px' }}>{userName.charAt(0).toUpperCase()}</div>
              <div className="modal-title">{userName}</div>
              <div className="modal-sub">{userEmail} · {userAddress || '12 Fajuyi Road, Mayfair, Ile-Ife'}</div>
            </div>
            <button className="modal-confirm-btn" style={{ background: 'var(--hazard)' }} onClick={() => { setShowModal(null); setView('landing'); }}>
              Log out
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
  <>
    {view === 'landing' && <Landing />}
    {view === 'login' && <Login />}
    {view === 'dashboard' && <Dashboard />}
    {view === 'admin' && <AdminDashboard />}
    <Modal />
    {toast && <div className="toast show">{toast}</div>}
  </>
);
}