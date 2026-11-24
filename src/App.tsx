import { useEffect, useState } from 'react'

type Screen = 'boot' | 'wifi' | 'password' | 'offline' | 'profile' | 'details' | 'companion' | 'ready'
type Audience = 'Niño' | 'Adulto mayor' | 'Familia'

const networks = [
  { name: 'INV3RSE_HOME', strength: 3, secure: true },
  { name: 'Casa_García', strength: 3, secure: true },
  { name: 'Flappy_Guest', strength: 2, secure: false },
  { name: 'NET_5G', strength: 1, secure: true },
]
const keyboard = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['⇧', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ['123', 'ESPACIO', 'OK'],
]

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<string, React.ReactNode> = {
    wifi: <><path d="M3.5 9a13.5 13.5 0 0 1 17 0"/><path d="M6.8 12.3a8.5 8.5 0 0 1 10.4 0"/><path d="M10 15.7a3.4 3.4 0 0 1 4 0"/><circle cx="12" cy="19" r=".7" fill="currentColor" stroke="none"/></>,
    lock: <><rect x="5.5" y="10" width="13" height="10" rx="3"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    child: <><circle cx="12" cy="6.5" r="3.2"/><path d="M7.5 21v-3.2a4.5 4.5 0 0 1 9 0V21M5 12.5l3.4 1.7M19 12.5l-3.4 1.7"/></>,
    elder: <><circle cx="12" cy="5.5" r="2.8"/><path d="M9 10.5h5l1.5 5.2M10.3 21l.8-5.5-3.1-2M15.5 15.7l2.5 4.8M17.8 12v9"/></>,
    family: <><circle cx="8" cy="7" r="2.5"/><circle cx="16.5" cy="8" r="2.1"/><path d="M3.8 19v-3a4.2 4.2 0 0 1 8.4 0v3M13 19v-3a3.5 3.5 0 0 1 7 0v3"/></>,
    phone: <><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 5h3M11 18.5h2"/></>,
    check: <path d="m5 12.5 4 4L19 7"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sparkle: <><path d="M12 2l1.2 4.2L17 8l-3.8 1.8L12 14l-1.2-4.2L7 8l3.8-1.8L12 2Z"/><path d="m18.5 14 .6 2.1L21 17l-1.9.9-.6 2.1-.6-2.1L16 17l1.9-.9.6-2.1Z"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function StatusBar({ dark = false }: { dark?: boolean }) {
  return <div className={`status-bar ${dark ? 'status-dark' : ''}`}><span>09:41</span><div className="status-icons"><Icon name="wifi" size={13}/><div className="battery"><i/></div></div></div>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('boot')
  const [network, setNetwork] = useState(networks[0].name)
  const [password, setPassword] = useState('')
  const [audience, setAudience] = useState<Audience>('Adulto mayor')
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('Ciudad de México · GMT−6')
  const [installApp, setInstallApp] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (screen !== 'boot') return
    const timer = window.setTimeout(() => setScreen('wifi'), 1900)
    return () => window.clearTimeout(timer)
  }, [screen])

  const chooseNetwork = (name: string, secure: boolean) => {
    setNetwork(name)
    if (name === 'NET_5G') setScreen('offline')
    else if (secure) setScreen('password')
    else setScreen('profile')
  }
  const connect = () => {
    if (!password) return
    setConnecting(true)
    window.setTimeout(() => { setConnecting(false); setScreen('profile') }, 850)
  }
  const keyPress = (key: string) => {
    if (key === '⌫') setPassword(v => v.slice(0, -1))
    else if (key === 'ESPACIO') setPassword(v => v + ' ')
    else if (key === 'OK') connect()
    else if (key !== '⇧' && key !== '123') setPassword(v => v + key)
  }

  return <main className="app-shell"><section className={`device ${screen === 'boot' ? 'boot-device' : ''}`}>
    {screen === 'boot' ? <div className="boot-screen"><StatusBar dark/><div className="boot-orbit orbit-one"/><div className="boot-orbit orbit-two"/><div className="brand-lockup"><div className="brand-mark"><span>3</span></div><div className="brand-name">inv<span>3</span>rse</div><p>INTELLIGENT SYSTEMS</p></div><div className="connecting"><div className="loading-dots"><i/><i/><i/></div><span>Conectando</span></div></div> : <>
      <StatusBar/>
      {screen === 'wifi' && <div className="page"><Header step="01 / 03" title="Conecta tu Flappy" subtitle="Elige una red Wi‑Fi para comenzar."/><div className="network-list">{networks.map(item => <button className="network-row" key={item.name} onClick={() => chooseNetwork(item.name,item.secure)}><span className={`signal strength-${item.strength}`}><i/><i/><i/></span><span className="network-copy"><b>{item.name}</b><small>{item.secure?'Red protegida':'Red abierta'}</small></span>{item.secure&&<Icon name="lock" size={14}/>}<Icon name="chevron" size={15}/></button>)}</div><button className="text-button">Buscar de nuevo</button><FooterDots active={0}/></div>}
      {screen === 'password' && <div className="page password-page"><button className="back" onClick={()=>setScreen('wifi')}>‹</button><div className="eyebrow">CONECTAR A</div><h1>{network}</h1><label className="password-field"><span>Contraseña</span><input autoFocus readOnly value={'•'.repeat(password.length)} placeholder="Ingresa la contraseña"/><button onClick={()=>setPassword('')}>×</button></label><div className="keyboard">{keyboard.map((row,i)=><div className="key-row" key={i}>{row.map(key=><button className={key.length>2?'wide-key':''} key={key} onClick={()=>keyPress(key)}>{key}</button>)}</div>)}</div>{connecting&&<div className="connection-overlay"><div className="mini-spinner"/>Conectando…</div>}</div>}
      {screen === 'offline' && <div className="page centered-page"><div className="error-visual"><div className="wifi-ring"><Icon name="wifi" size={34}/></div><span>×</span></div><div className="eyebrow">SIN CONEXIÓN</div><h1>No pudimos conectar</h1><p>Revisa que la red esté disponible o acércate un poco más al router.</p><button className="primary" onClick={()=>setScreen('wifi')}>Reintentar</button><button className="secondary" onClick={()=>setScreen('wifi')}>Elegir otra red</button></div>}
      {screen === 'profile' && <div className="page"><Header step="02 / 03" title="¿Para quién es?" subtitle="Adaptaremos la experiencia a sus necesidades."/><div className="audience-list">{(['Niño','Adulto mayor','Familia'] as Audience[]).map(item=><button key={item} className={`audience-card ${audience===item?'selected':''}`} onClick={()=>setAudience(item)}><span className="audience-icon"><Icon name={item==='Niño'?'child':item==='Familia'?'family':'elder'} size={22}/></span><span><b>{item}</b><small>{item==='Niño'?'Acompañamiento y límites':item==='Familia'?'Conexión para todos':'Cuidado y asistencia'}</small></span><i className="radio">{audience===item&&<span/>}</i></button>)}</div><button className="primary bottom-action" onClick={()=>setScreen('details')}>Continuar <span>→</span></button><FooterDots active={1}/></div>}
      {screen === 'details' && <div className="page"><Header step="03 / 03" title={`Hola, ${audience==='Familia'?'familia':audience.toLowerCase()}`} subtitle="Solo faltan un par de detalles."/><div className="form-stack"><label className="form-field"><span>{audience==='Familia'?'Nombre de la familia':'Nombre'}</span><input value={name} onChange={e=>setName(e.target.value)} placeholder={audience==='Niño'?'Ej. Mateo':audience==='Familia'?'Ej. Familia Soto':'Ej. Elena'}/></label><label className="form-field"><span>Zona horaria</span><select value={timezone} onChange={e=>setTimezone(e.target.value)}><option>Ciudad de México · GMT−6</option><option>Bogotá · GMT−5</option><option>Buenos Aires · GMT−3</option><option>Madrid · GMT+1</option></select><Icon name="clock" size={17}/></label><div className="time-card"><div><small>HORA LOCAL</small><strong>09:41</strong></div><div className="sun">☼</div><span>Martes<br/>18 de junio</span></div></div><button className="primary bottom-action" onClick={()=>setScreen('companion')} disabled={!name.trim()}>Continuar <span>→</span></button><FooterDots active={2}/></div>}
      {screen === 'companion' && <div className="page"><div className="companion-art"><div className="phone-card"><Icon name="phone" size={30}/><i/><i/><i/></div><div className="link-wave one"/><div className="link-wave two"/><div className="flappy-dot"><Icon name="sparkle" size={21}/></div></div><div className="eyebrow">APP COMPAÑERA</div><h1>Siempre cerca,<br/>incluso a distancia.</h1><p className="companion-copy">{audience==='Adulto mayor'?'Recibe alertas urgentes y confirma que todo está bien.':audience==='Niño'?'Configura límites, rutinas y contenido apropiado desde tu celular.':'Gestiona perfiles y mantén a toda la familia conectada.'}</p><button className={`install-option ${installApp?'checked':''}`} onClick={()=>setInstallApp(!installApp)}><i>{installApp&&<Icon name="check" size={14}/>}</i><span><b>Instalar en mi celular</b><small>Te mostraremos un código QR</small></span></button><button className="primary bottom-action" onClick={()=>setScreen('ready')}>Finalizar configuración</button></div>}
      {screen === 'ready' && <div className="page ready-page"><div className="ready-glow"/><div className="ready-mark"><Icon name="check" size={31}/></div><div className="eyebrow">TODO LISTO</div><h1>Hola, {name}.</h1><p>Flappy ya está preparado para acompañarte.</p>{installApp&&<div className="qr-card"><div className="fake-qr"/><span><b>Continúa en tu celular</b><small>Escanea para instalar la app</small></span></div>}<button className="primary bottom-action" onClick={()=>setScreen('boot')}>Comenzar</button></div>}
    </>}
  </section></main>
}

function Header({step,title,subtitle}:{step:string;title:string;subtitle:string}) { return <header className="page-header"><div className="eyebrow">{step}</div><h1>{title}</h1><p>{subtitle}</p></header> }
function FooterDots({active}:{active:number}) { return <div className="footer-dots">{[0,1,2].map(item=><i className={item===active?'active':''} key={item}/>)}</div> }
