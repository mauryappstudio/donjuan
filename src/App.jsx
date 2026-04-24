import { useState, useEffect } from "react";

const WA_NUMBER = "56973437888";
const ADMIN_PASS = "Anasol0305";
const STORAGE_KEY = "donjuan_productos_v1";

const PRODUCTOS_INICIALES = [
  { id: 1,  nombre: "Tomate",    precio: 850,  emoji: "🍅", categoria: "Verduras", unidad: "kg",     activo: true },
  { id: 2,  nombre: "Lechuga",   precio: 600,  emoji: "🥬", categoria: "Verduras", unidad: "unidad", activo: true },
  { id: 3,  nombre: "Zanahoria", precio: 500,  emoji: "🥕", categoria: "Verduras", unidad: "kg",     activo: true },
  { id: 4,  nombre: "Papa",      precio: 450,  emoji: "🥔", categoria: "Verduras", unidad: "kg",     activo: true },
  { id: 5,  nombre: "Cebolla",   precio: 520,  emoji: "🧅", categoria: "Verduras", unidad: "kg",     activo: true },
  { id: 6,  nombre: "Zapallo",   precio: 380,  emoji: "🎃", categoria: "Verduras", unidad: "kg",     activo: true },
  { id: 7,  nombre: "Brócoli",   precio: 700,  emoji: "🥦", categoria: "Verduras", unidad: "unidad", activo: true },
  { id: 8,  nombre: "Manzana",   precio: 950,  emoji: "🍎", categoria: "Frutas",   unidad: "kg",     activo: true },
  { id: 9,  nombre: "Plátano",   precio: 680,  emoji: "🍌", categoria: "Frutas",   unidad: "kg",     activo: true },
  { id: 10, nombre: "Naranja",   precio: 750,  emoji: "🍊", categoria: "Frutas",   unidad: "kg",     activo: true },
  { id: 11, nombre: "Limón",     precio: 900,  emoji: "🍋", categoria: "Frutas",   unidad: "kg",     activo: true },
  { id: 12, nombre: "Pera",      precio: 820,  emoji: "🍐", categoria: "Frutas",   unidad: "kg",     activo: true },
  { id: 13, nombre: "Uva",       precio: 1200, emoji: "🍇", categoria: "Frutas",   unidad: "kg",     activo: true },
  { id: 14, nombre: "Frutilla",  precio: 1500, emoji: "🍓", categoria: "Frutas",   unidad: "kg",     activo: true },
];

const EMOJIS_VERDURAS = ["🥬","🥕","🥔","🧅","🥦","🌽","🥒","🍆","🌶️","🧄","🥑","🫛","🫑","🥗"];
const EMOJIS_FRUTAS   = ["🍎","🍌","🍊","🍋","🍐","🍇","🍓","🍑","🍒","🥭","🍍","🥝","🫐","🍈"];
const CATEGORIAS = ["Todos", "Verduras", "Frutas"];
const fmt = (n) => `$${Number(n).toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;
const FORM_VACIO = { nombre: "", precio: "", emoji: "", categoria: "Verduras", unidad: "kg" };

const Logo = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#0e2610" stroke="#3a7d44" strokeWidth="2"/>
    <ellipse cx="30" cy="42" rx="14" ry="8" fill="#2d6a30" transform="rotate(-30 30 42)"/>
    <ellipse cx="70" cy="42" rx="14" ry="8" fill="#2d6a30" transform="rotate(30 70 42)"/>
    <rect x="48" y="28" width="4" height="22" rx="2" fill="#3a7d44"/>
    <circle cx="50" cy="60" r="18" fill="#1e4d22"/>
    <ellipse cx="50" cy="60" rx="13" ry="11" fill="#2d6a30"/>
    <ellipse cx="50" cy="60" rx="8" ry="7" fill="#3a7d44"/>
    <ellipse cx="50" cy="60" rx="4" ry="3.5" fill="#5aab5a"/>
    <ellipse cx="44" cy="54" rx="3" ry="2" fill="#7ec87e" opacity="0.4"/>
  </svg>
);

const LogoSmall = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#0e2610" stroke="#3a7d44" strokeWidth="2"/>
    <ellipse cx="30" cy="42" rx="14" ry="8" fill="#2d6a30" transform="rotate(-30 30 42)"/>
    <ellipse cx="70" cy="42" rx="14" ry="8" fill="#2d6a30" transform="rotate(30 70 42)"/>
    <rect x="48" y="28" width="4" height="22" rx="2" fill="#3a7d44"/>
    <circle cx="50" cy="60" r="18" fill="#1e4d22"/>
    <ellipse cx="50" cy="60" rx="13" ry="11" fill="#2d6a30"/>
    <ellipse cx="50" cy="60" rx="8" ry="7" fill="#3a7d44"/>
    <ellipse cx="50" cy="60" rx="4" ry="3.5" fill="#5aab5a"/>
    <ellipse cx="44" cy="54" rx="3" ry="2" fill="#7ec87e" opacity="0.4"/>
  </svg>
);

function calcularItem(p, item) {
  if (!item) return { kilos: 0, subtotal: 0, label: "" };
  if (p.unidad === "unidad") return { kilos: item.cantidad, subtotal: p.precio * item.cantidad, label: `${item.cantidad} unidad${item.cantidad !== 1 ? "es" : ""}` };
  if (item.modo === "kg") return { kilos: item.cantidad, subtotal: p.precio * item.cantidad, label: `${item.cantidad} kg` };
  const kilos = item.cantidad / p.precio;
  return { kilos, subtotal: item.cantidad, label: `${kilos.toFixed(2).replace(".", ",")} kg (≈${fmt(item.cantidad)})` };
}

export default function App() {
  const [pantalla, setPantalla]           = useState("inicio");
  const [productos, setProductos]         = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : PRODUCTOS_INICIALES;
    } catch { return PRODUCTOS_INICIALES; }
  });
  const [nextId, setNextId]               = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { const p = JSON.parse(saved); return Math.max(...p.map(x => x.id)) + 1; }
    } catch {}
    return 15;
  });
  const [carrito, setCarrito]             = useState({});
  const [categoriaActiva, setCat]         = useState("Todos");
  const [busqueda, setBusqueda]           = useState("");
  const [tipoEntrega, setTipoEntrega]     = useState(null);
  const [form, setForm]                   = useState({ nombre: "", telefono: "", direccion: "", horario: "", notas: "" });
  const [animCarrito, setAnimCarrito]     = useState(false);
  const [modalProducto, setModalProducto] = useState(null);
  const [modoInput, setModoInput]         = useState("kg");
  const [valorInput, setValorInput]       = useState("");
  const [modalNuevo, setModalNuevo]       = useState(false);
  const [formNuevo, setFormNuevo]         = useState(FORM_VACIO);
  const [errorNuevo, setErrorNuevo]       = useState("");

  // ADMIN
  const [adminAutenticado, setAdminAutenticado] = useState(false);
  const [adminPass, setAdminPass]               = useState("");
  const [adminError, setAdminError]             = useState("");
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [clicksLogo, setClicksLogo]             = useState(0);

  // Guardar en localStorage cada vez que cambian productos
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(productos)); } catch {}
  }, [productos]);

  // Easter egg: 5 clicks en el logo → panel admin
  const handleLogoClick = () => {
    const nuevos = clicksLogo + 1;
    setClicksLogo(nuevos);
    if (nuevos >= 5) { setClicksLogo(0); setPantalla("admin_login"); }
  };

  const emojisDisp = formNuevo.categoria === "Verduras" ? EMOJIS_VERDURAS : EMOJIS_FRUTAS;
  const productosActivos = productos.filter(p => p.activo);

  const totalItems = Object.keys(carrito).length;
  const totalPrecio = Object.entries(carrito).reduce((acc, [id, item]) => {
    const p = productos.find(pr => pr.id === Number(id));
    return acc + (p ? calcularItem(p, item).subtotal : 0);
  }, 0);

  const productosFiltrados = productosActivos.filter(p =>
    (categoriaActiva === "Todos" || p.categoria === categoriaActiva) &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalCantidad = (producto) => {
    setModalProducto(producto);
    const ex = carrito[producto.id];
    setModoInput(ex ? (ex.modo === "monto" ? "monto" : "kg") : "kg");
    setValorInput(ex ? String(ex.cantidad) : "");
  };

  const confirmarCantidad = () => {
    const val = parseFloat(valorInput.replace(",", "."));
    if (!val || val <= 0) { setModalProducto(null); return; }
    const modo = modalProducto.unidad === "unidad" ? "unidad" : modoInput;
    setCarrito(prev => ({ ...prev, [modalProducto.id]: { modo, cantidad: val } }));
    setAnimCarrito(true);
    setTimeout(() => setAnimCarrito(false), 400);
    setModalProducto(null);
  };

  const eliminarDelCarrito = (id) => setCarrito(prev => { const n = { ...prev }; delete n[id]; return n; });

  const preview = (() => {
    if (!modalProducto || !valorInput) return null;
    const val = parseFloat(valorInput.replace(",", "."));
    if (!val || val <= 0) return null;
    if (modalProducto.unidad === "unidad") return { label: `${val} unidad${val !== 1 ? "es" : ""}`, subtotal: modalProducto.precio * val };
    if (modoInput === "kg") return { label: `${val} kg → ${fmt(modalProducto.precio * val)}`, subtotal: modalProducto.precio * val };
    const kg = val / modalProducto.precio;
    return { label: `${fmt(val)} → ${kg.toFixed(2).replace(".", ",")} kg`, subtotal: val };
  })();

  const guardarProducto = () => {
    if (!formNuevo.nombre.trim()) { setErrorNuevo("El nombre es obligatorio."); return; }
    if (!formNuevo.precio || isNaN(+formNuevo.precio) || +formNuevo.precio <= 0) { setErrorNuevo("Ingresa un precio válido."); return; }
    if (!formNuevo.emoji) { setErrorNuevo("Elige un emoji."); return; }
    setProductos(p => [...p, { id: nextId, nombre: formNuevo.nombre.trim(), precio: +formNuevo.precio, emoji: formNuevo.emoji, categoria: formNuevo.categoria, unidad: formNuevo.unidad, activo: true }]);
    setNextId(n => n + 1);
    setModalNuevo(false); setFormNuevo(FORM_VACIO);
  };

  const esFormValido = () => form.nombre && form.telefono && (tipoEntrega !== "domicilio" || form.direccion);

  const enviarWhatsApp = () => {
    const lineas = Object.entries(carrito).map(([id, item]) => {
      const p = productos.find(pr => pr.id === Number(id));
      if (!p) return "";
      const { label, subtotal } = calcularItem(p, item);
      return `  • ${p.emoji} ${p.nombre}: ${label} = ${fmt(subtotal)}`;
    }).filter(Boolean).join("\n");

    const entrega = tipoEntrega === "retiro"
      ? "🏪 Retiro en local"
      : `🛵 Despacho a domicilio\n  📍 ${form.direccion}${form.horario ? `\n  🕐 Horario: ${form.horario}` : ""}`;

    const msg = `🛒 *Nuevo pedido - Don Juan*\n\n👤 *Cliente:* ${form.nombre}\n📱 *Teléfono:* ${form.telefono}\n\n*Entrega:* ${entrega}\n\n*Productos:*\n${lineas}\n\n💰 *TOTAL ESTIMADO: ${fmt(totalPrecio)}*${form.notas ? `\n\n📝 *Notas:* ${form.notas}` : ""}`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setCarrito({}); setForm({ nombre: "", telefono: "", direccion: "", horario: "", notas: "" }); setTipoEntrega(null);
    setPantalla("confirmado");
  };

  // ── Admin: login ──
  const loginAdmin = () => {
    if (adminPass === ADMIN_PASS) { setAdminAutenticado(true); setAdminError(""); setPantalla("admin"); }
    else { setAdminError("Contraseña incorrecta"); }
  };

  // ── Admin: guardar edición de precio ──
  const guardarEdicion = () => {
    if (!editandoProducto) return;
    const precio = parseFloat(editandoProducto.precio);
    if (!precio || precio <= 0) return;
    setProductos(prev => prev.map(p => p.id === editandoProducto.id ? { ...p, precio, nombre: editandoProducto.nombre } : p));
    setEditandoProducto(null);
  };

  const toggleActivo = (id) => setProductos(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p));
  const eliminarProducto = (id) => setProductos(prev => prev.filter(p => p.id !== id));

  const S = {
    app:   { minHeight: "100vh", background: "#0a1a0b", fontFamily: "'Georgia', serif", color: "#f0ebe0", position: "relative" },
    grain: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`, opacity: 0.5 },
    c:     { position: "relative", zIndex: 1 },
  };

  const ModalCantidad = () => !modalProducto ? null : (
    <div style={OVL} onClick={() => setModalProducto(null)}>
      <div onClick={e => e.stopPropagation()} style={SHT}>
        <div style={HANDLE} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
          <span style={{ fontSize: "2.2rem" }}>{modalProducto.emoji}</span>
          <div>
            <div style={{ fontWeight: 400, fontSize: "1.1rem" }}>{modalProducto.nombre}</div>
            <div style={{ color: "#7ec87e", fontSize: "0.85rem" }}>{fmt(modalProducto.precio)} / {modalProducto.unidad}</div>
          </div>
        </div>
        {modalProducto.unidad === "kg" && (
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {[{ v: "kg", label: "⚖️ Por kilos" }, { v: "monto", label: "💰 Por monto ($)" }].map(op => (
              <button key={op.v} onClick={() => { setModoInput(op.v); setValorInput(""); }}
                style={{ flex: 1, background: modoInput === op.v ? "#1e4d24" : "#162816", border: `1px solid ${modoInput === op.v ? "#3a7d44" : "#243a24"}`, borderRadius: 10, padding: "0.6rem", color: modoInput === op.v ? "#fff" : "#7a9a7a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}>
                {op.label}
              </button>
            ))}
          </div>
        )}
        <input autoFocus type="number"
          placeholder={modalProducto.unidad === "unidad" ? "Cantidad de unidades" : modoInput === "kg" ? "Ej: 0.5  →  medio kilo" : "Ej: 3000  →  cuánto quieres gastar"}
          value={valorInput} onChange={e => setValorInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && confirmarCantidad()}
          style={{ ...INP, fontSize: "1.2rem", textAlign: "center", marginBottom: "0.8rem" }} />
        {preview && (
          <div style={{ background: "#0e2610", border: "1px solid #2d5a30", borderRadius: 10, padding: "0.6rem 1rem", marginBottom: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#a8e6a8", fontSize: "0.9rem" }}>{preview.label}</span>
            <span style={{ color: "#7ec87e", fontWeight: 700 }}>{fmt(preview.subtotal)}</span>
          </div>
        )}
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {carrito[modalProducto.id] && (
            <button onClick={() => { eliminarDelCarrito(modalProducto.id); setModalProducto(null); }}
              style={{ flex: 1, background: "#2a1212", border: "1px solid #5a2020", borderRadius: 12, padding: "0.8rem", color: "#e07070", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem" }}>
              🗑 Quitar
            </button>
          )}
          <button onClick={confirmarCantidad}
            style={{ flex: 2, background: preview ? "linear-gradient(135deg,#2d6a30,#3a7d44)" : "#162816", border: "none", borderRadius: 12, padding: "0.8rem", color: preview ? "#fff" : "#5a7a5a", cursor: preview ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 600 }}>
            {carrito[modalProducto.id] ? "Actualizar ✓" : "Agregar al pedido ✓"}
          </button>
        </div>
      </div>
    </div>
  );

  // ════ ADMIN LOGIN ════
  if (pantalla === "admin_login") return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={S.grain} />
      <div style={{ ...S.c, width: "100%", maxWidth: 360, padding: "1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Logo size={60} />
          <h2 style={{ fontWeight: 400, margin: "0.8rem 0 0.2rem" }}>Panel Admin</h2>
          <p style={{ color: "#5a7a5a", fontSize: "0.85rem", margin: 0 }}>Solo para Don Juan 🥦</p>
        </div>
        <div style={{ background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="password" placeholder="Contraseña" value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && loginAdmin()}
            style={{ ...INP, fontSize: "1.1rem", textAlign: "center", letterSpacing: "0.2em" }} />
          {adminError && <div style={{ color: "#e07070", fontSize: "0.85rem", textAlign: "center" }}>{adminError}</div>}
          <button onClick={loginAdmin} style={{ background: "linear-gradient(135deg,#2d6a30,#3a7d44)", border: "none", borderRadius: 12, padding: "0.9rem", color: "#fff", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            Entrar al panel
          </button>
          <button onClick={() => setPantalla("inicio")} style={{ background: "none", border: "none", color: "#5a7a5a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}>
            ← Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );

  // ════ ADMIN PANEL ════
  if (pantalla === "admin" && adminAutenticado) return (
    <div style={S.app}>
      <div style={S.grain} />
      <div style={S.c}>
        <header style={{ padding: "0.85rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a321a", position: "sticky", top: 0, background: "#0a1a0bdd", backdropFilter: "blur(16px)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LogoSmall />
            <span style={{ fontWeight: 400, fontSize: "1rem" }}>Panel Admin</span>
          </div>
          <button onClick={() => { setAdminAutenticado(false); setAdminPass(""); setPantalla("inicio"); }}
            style={{ background: "#2a1212", border: "1px solid #5a2020", borderRadius: 10, padding: "0.35rem 0.8rem", color: "#e07070", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem" }}>
            Salir
          </button>
        </header>

        {/* Resumen */}
        <div style={{ padding: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
          <div style={{ background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 14, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#7ec87e" }}>{productos.filter(p => p.activo).length}</div>
            <div style={{ color: "#5a7a5a", fontSize: "0.78rem" }}>Productos activos</div>
          </div>
          <div style={{ background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 14, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#e07070" }}>{productos.filter(p => !p.activo).length}</div>
            <div style={{ color: "#5a7a5a", fontSize: "0.78rem" }}>Desactivados</div>
          </div>
        </div>

        {/* Info */}
        <div style={{ margin: "0 1rem 0.5rem", background: "#0d2010", border: "1px solid #1e5a25", borderRadius: 12, padding: "0.7rem 1rem", fontSize: "0.8rem", color: "#7ec87e" }}>
          💡 Toca un producto para editar su precio. Desactívalo si no lo tienes hoy.
        </div>

        {/* Lista de productos */}
        <div style={{ padding: "0 1rem 7rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {productos.map(p => (
            <div key={p.id} style={{ background: p.activo ? "#0f1f10" : "#0f0f0f", border: `1px solid ${p.activo ? "#1a321a" : "#2a1a1a"}`, borderRadius: 14, padding: "0.8rem 1rem", opacity: p.activo ? 1 : 0.6 }}>
              {editandoProducto?.id === p.id ? (
                // Modo edición
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{p.emoji}</span>
                    <input value={editandoProducto.nombre} onChange={e => setEditandoProducto(prev => ({ ...prev, nombre: e.target.value }))}
                      style={{ ...INP, flex: 1, fontSize: "0.95rem" }} placeholder="Nombre" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "#7ec87e", fontSize: "1rem" }}>$</span>
                    <input type="number" value={editandoProducto.precio} onChange={e => setEditandoProducto(prev => ({ ...prev, precio: e.target.value }))}
                      style={{ ...INP, flex: 1, fontSize: "1.1rem", fontWeight: 700 }} placeholder="Nuevo precio" />
                    <span style={{ color: "#5a7a5a", fontSize: "0.8rem" }}>/{p.unidad}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => setEditandoProducto(null)} style={{ flex: 1, background: "#162816", border: "1px solid #243a24", borderRadius: 10, padding: "0.6rem", color: "#7a9a7a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}>Cancelar</button>
                    <button onClick={guardarEdicion} style={{ flex: 2, background: "linear-gradient(135deg,#2d6a30,#3a7d44)", border: "none", borderRadius: 10, padding: "0.6rem", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 600 }}>Guardar ✓</button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span style={{ fontSize: "1.6rem" }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem" }}>{p.nombre}</div>
                    <div style={{ color: "#7ec87e", fontSize: "0.85rem", fontWeight: 700 }}>{fmt(p.precio)} <span style={{ color: "#5a7a5a", fontWeight: 400, fontSize: "0.75rem" }}>/{p.unidad}</span></div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    {/* Toggle activo */}
                    <button onClick={() => toggleActivo(p.id)}
                      style={{ background: p.activo ? "#1e4d22" : "#2a1a1a", border: `1px solid ${p.activo ? "#3a7d44" : "#5a2020"}`, borderRadius: 20, padding: "0.3rem 0.7rem", color: p.activo ? "#7ec87e" : "#e07070", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>
                      {p.activo ? "✓ Activo" : "✗ Inactivo"}
                    </button>
                    {/* Editar */}
                    <button onClick={() => setEditandoProducto({ ...p })}
                      style={{ background: "#162816", border: "1px solid #243a24", borderRadius: 8, width: 32, height: 32, color: "#7ec87e", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      ✏️
                    </button>
                    {/* Eliminar */}
                    <button onClick={() => eliminarProducto(p.id)}
                      style={{ background: "#2a1212", border: "1px solid #5a2020", borderRadius: 8, width: 32, height: 32, color: "#e07070", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      🗑
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botón agregar producto */}
        <div style={{ position: "fixed", bottom: "1.2rem", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 1.8rem)", maxWidth: 440, zIndex: 20 }}>
          <button onClick={() => { setFormNuevo(FORM_VACIO); setErrorNuevo(""); setModalNuevo(true); }}
            style={{ width: "100%", background: "linear-gradient(135deg,#2d6a30,#3a7d44)", border: "none", borderRadius: 16, padding: "1rem", color: "#fff", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, boxShadow: "0 8px 32px #3a7d4466" }}>
            + Agregar nuevo producto
          </button>
        </div>
      </div>

      {/* Modal nuevo producto */}
      {modalNuevo && (
        <div style={OVL} onClick={() => setModalNuevo(false)}>
          <div onClick={e => e.stopPropagation()} style={{ ...SHT, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={HANDLE} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <span style={{ fontWeight: 400, fontSize: "1.05rem" }}>Nuevo producto</span>
              <button onClick={() => setModalNuevo(false)} style={GHO}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <div style={LBL}>Categoría</div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                  {["Verduras","Frutas"].map(cat => (
                    <button key={cat} onClick={() => setFormNuevo(f => ({ ...f, categoria: cat, emoji: "" }))}
                      style={{ flex: 1, background: formNuevo.categoria === cat ? "#1e4d24" : "#162816", border: `1px solid ${formNuevo.categoria === cat ? "#3a7d44" : "#243a24"}`, borderRadius: 10, padding: "0.5rem", color: formNuevo.categoria === cat ? "#fff" : "#7a9a7a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem" }}>
                      {cat === "Verduras" ? "🥦" : "🍎"} {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div><div style={LBL}>Nombre</div><input placeholder="Ej: Berenjena" value={formNuevo.nombre} onChange={e => setFormNuevo(f => ({ ...f, nombre: e.target.value }))} style={{ ...INP, marginTop: "0.4rem" }} /></div>
              <div><div style={LBL}>Precio</div><input placeholder="Ej: 750" type="number" value={formNuevo.precio} onChange={e => setFormNuevo(f => ({ ...f, precio: e.target.value }))} style={{ ...INP, marginTop: "0.4rem" }} /></div>
              <div>
                <div style={LBL}>Unidad de venta</div>
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
                  {["kg","unidad","atado","cajón"].map(u => (
                    <button key={u} onClick={() => setFormNuevo(f => ({ ...f, unidad: u }))}
                      style={{ flex: 1, background: formNuevo.unidad === u ? "#1e4d24" : "#162816", border: `1px solid ${formNuevo.unidad === u ? "#3a7d44" : "#243a24"}`, borderRadius: 10, padding: "0.4rem", color: formNuevo.unidad === u ? "#fff" : "#7a9a7a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem" }}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={LBL}>Ícono</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.4rem" }}>
                  {emojisDisp.map(em => (
                    <button key={em} onClick={() => setFormNuevo(f => ({ ...f, emoji: em }))}
                      style={{ width: 38, height: 38, background: formNuevo.emoji === em ? "#1e4d24" : "#162816", border: `1px solid ${formNuevo.emoji === em ? "#3a7d44" : "#243a24"}`, borderRadius: 8, fontSize: "1.2rem", cursor: "pointer" }}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>
              {errorNuevo && <div style={{ color: "#e07070", fontSize: "0.82rem", background: "#2a1212", border: "1px solid #5a2020", borderRadius: 8, padding: "0.5rem 0.8rem" }}>{errorNuevo}</div>}
              <button onClick={guardarProducto} style={{ background: "linear-gradient(135deg,#2d6a30,#3a7d44)", border: "none", borderRadius: 12, padding: "0.9rem", color: "#fff", fontSize: "0.95rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                Guardar producto ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ════ INICIO ════
  if (pantalla === "inicio") return (
    <div style={S.app}>
      <div style={S.grain} />
      <div style={{ ...S.c, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem", textAlign: "center" }}>
        <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #1a4d2055 0%, transparent 70%)", top: -150, right: -150, pointerEvents: "none" }} />
        <div style={{ position: "fixed", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, #2d6a1d44 0%, transparent 70%)", bottom: -80, left: -100, pointerEvents: "none" }} />
        <div style={{ marginBottom: "1.2rem", filter: "drop-shadow(0 0 40px #3a7d4466)", cursor: "pointer" }} onClick={handleLogoClick}>
          <Logo size={90} />
        </div>
        <p style={{ letterSpacing: "0.4em", fontSize: "0.7rem", color: "#6ec870", textTransform: "uppercase", margin: "0 0 0.3rem" }}>Verdulería</p>
        <h1 style={{ fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 400, margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>Don Juan</h1>
        <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #3a7d44, transparent)", margin: "1rem auto" }} />
        <p style={{ color: "#7a9a7a", fontSize: "0.95rem", maxWidth: 280, lineHeight: 1.7, margin: 0 }}>
          Frutas y verduras frescas del día.<br />Pide por kilos o por monto, como quieras.
        </p>
        <button onClick={() => setPantalla("tienda")} style={{ marginTop: "2.5rem", background: "linear-gradient(135deg, #2d6a30, #3a7d44)", border: "none", borderRadius: 14, padding: "0.9rem 2.5rem", color: "#fff", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, boxShadow: "0 8px 32px #3a7d4455" }}>
          Ver productos →
        </button>
        <div style={{ display: "flex", gap: "1.2rem", marginTop: "2.5rem", color: "#4a6a4a", fontSize: "0.78rem", flexWrap: "wrap", justifyContent: "center" }}>
          {["🏪 Retira en local", "🛵 Despacho a domicilio", "⚖️ Kilos o monto", "📲 Por WhatsApp"].map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );

  // ════ TIENDA ════
  if (pantalla === "tienda") return (
    <div style={S.app}>
      <div style={S.grain} />
      <div style={S.c}>
        <header style={{ padding: "0.85rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a321a", position: "sticky", top: 0, background: "#0a1a0bdd", backdropFilter: "blur(16px)", zIndex: 10 }}>
          <button onClick={() => setPantalla("inicio")} style={GHO}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LogoSmall />
            <span style={{ fontWeight: 400, fontSize: "1rem", letterSpacing: "0.04em" }}>Don Juan</span>
          </div>
          <button onClick={() => setPantalla("carrito")} style={{ background: animCarrito ? "#3a7d44" : "#162816", border: "1px solid #3a7d44", borderRadius: 50, padding: "0.35rem 0.85rem", color: "#f0ebe0", cursor: "pointer", fontSize: "0.85rem", transition: "background 0.3s", display: "flex", alignItems: "center", gap: 4 }}>
            🛒{totalItems > 0 && <span style={{ background: "#7ec87e", color: "#0a1a0b", borderRadius: "50%", fontSize: "0.65rem", padding: "1px 5px", fontWeight: 700 }}>{totalItems}</span>}
          </button>
        </header>
        <div style={{ padding: "0.9rem 1rem 0" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#5a7a5a" }}>🔍</span>
            <input placeholder="Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ ...INP, paddingLeft: "2.2rem" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", padding: "0.7rem 1rem", overflowX: "auto" }}>
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCat(cat)} style={{ background: categoriaActiva === cat ? "#3a7d44" : "#162816", border: `1px solid ${categoriaActiva === cat ? "#3a7d44" : "#243a24"}`, borderRadius: 50, padding: "0.35rem 1rem", color: categoriaActiva === cat ? "#fff" : "#7a9a7a", cursor: "pointer", whiteSpace: "nowrap", fontSize: "0.82rem", fontFamily: "inherit" }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem", padding: "0 0.9rem 7rem" }}>
          {productosFiltrados.map(p => {
            const item = carrito[p.id];
            const { label, subtotal } = calcularItem(p, item);
            const enCarrito = !!item;
            return (
              <div key={p.id} onClick={() => abrirModalCantidad(p)}
                style={{ background: enCarrito ? "#0e2610" : "#0f1f10", border: `1px solid ${enCarrito ? "#3a7d44" : "#1a321a"}`, borderRadius: 16, padding: "1rem 0.9rem", display: "flex", flexDirection: "column", gap: "0.4rem", cursor: "pointer", position: "relative" }}>
                {enCarrito && <div style={{ position: "absolute", top: 8, right: 8, background: "#3a7d44", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem" }}>✓</div>}
                <div style={{ fontSize: "2rem", textAlign: "center" }}>{p.emoji}</div>
                <div style={{ fontSize: "0.95rem", textAlign: "center" }}>{p.nombre}</div>
                <div style={{ color: "#7ec87e", fontSize: "0.75rem", textAlign: "center" }}>{fmt(p.precio)} / {p.unidad}</div>
                {enCarrito ? (
                  <div style={{ background: "#1e4d22", borderRadius: 8, padding: "0.3rem 0.5rem", textAlign: "center", fontSize: "0.75rem", color: "#a8e6a8" }}>{label} · {fmt(subtotal)}</div>
                ) : (
                  <div style={{ border: "1px solid #243a24", borderRadius: 8, padding: "0.3rem", textAlign: "center", fontSize: "0.75rem", color: "#5a7a5a" }}>Toca para agregar</div>
                )}
              </div>
            );
          })}
        </div>
        {totalItems > 0 && (
          <div style={{ position: "fixed", bottom: "1.2rem", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 1.8rem)", maxWidth: 440, zIndex: 20 }}>
            <button onClick={() => setPantalla("carrito")} style={{ width: "100%", background: "linear-gradient(135deg,#2d6a30,#3a7d44)", border: "none", borderRadius: 16, padding: "1rem 1.5rem", color: "#fff", fontSize: "1rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", fontWeight: 600, boxShadow: "0 8px 32px #3a7d4466" }}>
              <span>🛒 Ver pedido ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
              <span>{fmt(totalPrecio)}</span>
            </button>
          </div>
        )}
      </div>
      <ModalCantidad />
    </div>
  );

  // ════ CARRITO ════
  if (pantalla === "carrito") return (
    <div style={S.app}>
      <div style={S.grain} />
      <div style={S.c}>
        <header style={{ padding: "0.85rem 1.2rem", display: "flex", alignItems: "center", gap: "0.8rem", borderBottom: "1px solid #1a321a", position: "sticky", top: 0, background: "#0a1a0bdd", backdropFilter: "blur(16px)", zIndex: 10 }}>
          <button onClick={() => setPantalla("tienda")} style={GHO}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><LogoSmall /><span style={{ fontWeight: 400, fontSize: "1rem" }}>Tu pedido</span></div>
        </header>
        <div style={{ padding: "1rem", paddingBottom: "8rem" }}>
          {totalItems === 0 ? (
            <div style={{ textAlign: "center", color: "#4a6a4a", padding: "4rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
              <p>Tu carrito está vacío</p>
              <button onClick={() => setPantalla("tienda")} style={{ background: "#3a7d44", border: "none", borderRadius: 12, padding: "0.7rem 1.5rem", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Ver productos</button>
            </div>
          ) : (
            <>
              {Object.entries(carrito).map(([id, item]) => {
                const p = productos.find(pr => pr.id === Number(id));
                if (!p) return null;
                const { label, subtotal } = calcularItem(p, item);
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: "0.8rem", background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 14, padding: "0.8rem 1rem", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>{p.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.95rem" }}>{p.nombre}</div>
                      <div style={{ color: "#7ec87e", fontSize: "0.8rem" }}>{label}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>{fmt(subtotal)}</div>
                      <button onClick={() => abrirModalCantidad(p)} style={{ background: "none", border: "none", color: "#5a9a6a", cursor: "pointer", fontSize: "0.72rem", padding: 0 }}>✏️ editar</button>
                    </div>
                    <button onClick={() => eliminarDelCarrito(+id)} style={{ background: "#2a1212", border: "1px solid #5a2020", borderRadius: 8, width: 28, height: 28, color: "#e07070", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                );
              })}
              <div style={{ background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 14, padding: "1rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
                  <span>Total estimado</span><span style={{ color: "#7ec87e" }}>{fmt(totalPrecio)}</span>
                </div>
                <div style={{ color: "#4a6a4a", fontSize: "0.75rem", marginTop: "0.4rem" }}>* Puede variar según el peso exacto</div>
              </div>
              <button onClick={() => setPantalla("tienda")} style={{ background: "none", border: "none", color: "#5a9a6a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", marginTop: "1rem", textDecoration: "underline" }}>+ Agregar más productos</button>
            </>
          )}
        </div>
        {totalItems > 0 && (
          <div style={{ position: "fixed", bottom: "1.2rem", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 1.8rem)", maxWidth: 440, zIndex: 20 }}>
            <button onClick={() => setPantalla("checkout")} style={{ width: "100%", background: "linear-gradient(135deg,#2d6a30,#3a7d44)", border: "none", borderRadius: 16, padding: "1rem", color: "#fff", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, boxShadow: "0 8px 32px #3a7d4466" }}>Continuar →</button>
          </div>
        )}
      </div>
      <ModalCantidad />
    </div>
  );

  // ════ CHECKOUT ════
  if (pantalla === "checkout") return (
    <div style={S.app}>
      <div style={S.grain} />
      <div style={S.c}>
        <header style={{ padding: "0.85rem 1.2rem", display: "flex", alignItems: "center", gap: "0.8rem", borderBottom: "1px solid #1a321a", position: "sticky", top: 0, background: "#0a1a0bdd", backdropFilter: "blur(16px)", zIndex: 10 }}>
          <button onClick={() => setPantalla("carrito")} style={GHO}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><LogoSmall /><span style={{ fontWeight: 400, fontSize: "1rem" }}>Finalizar pedido</span></div>
        </header>
        <div style={{ padding: "1.2rem 1rem", paddingBottom: "8rem", display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          <div>
            <div style={LBL}>¿Cómo quieres recibir tu pedido?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.5rem" }}>
              {[{ tipo: "retiro", emoji: "🏪", texto: "Retiro en local" }, { tipo: "domicilio", emoji: "🛵", texto: "Despacho a domicilio" }].map(op => (
                <button key={op.tipo} onClick={() => setTipoEntrega(op.tipo)}
                  style={{ background: tipoEntrega === op.tipo ? "#0e2610" : "#0f1f10", border: `2px solid ${tipoEntrega === op.tipo ? "#3a7d44" : "#1a321a"}`, borderRadius: 14, padding: "1.1rem 0.5rem", cursor: "pointer", color: "#f0ebe0", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "center" }}>
                  <span style={{ fontSize: "1.6rem" }}>{op.emoji}</span>
                  <span style={{ fontSize: "0.82rem" }}>{op.texto}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            <div style={LBL}>Tus datos</div>
            <input placeholder="Nombre completo *" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={INP} />
            <input placeholder="Teléfono / WhatsApp *" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} style={INP} type="tel" />
            {tipoEntrega === "domicilio" && <>
              <input placeholder="Dirección de entrega *" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} style={INP} />
              <input placeholder="Horario preferido (ej: 10-12 hrs)" value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))} style={INP} />
            </>}
            <textarea placeholder="Notas adicionales (opcional)" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} style={{ ...INP, resize: "vertical", minHeight: 65 }} rows={3} />
          </div>
          <div style={{ background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 14, padding: "1rem" }}>
            <div style={{ color: "#5a7a5a", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.7rem" }}>Resumen</div>
            {Object.entries(carrito).map(([id, item]) => {
              const p = productos.find(pr => pr.id === Number(id));
              if (!p) return null;
              const { label, subtotal } = calcularItem(p, item);
              return (
                <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: "0.4rem", color: "#b0c8b0" }}>
                  <span>{p.emoji} {p.nombre} — {label}</span>
                  <span style={{ whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{fmt(subtotal)}</span>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: "0.7rem", paddingTop: "0.7rem", borderTop: "1px solid #1a321a", color: "#7ec87e" }}>
              <span>Total estimado</span><span>{fmt(totalPrecio)}</span>
            </div>
          </div>
          {tipoEntrega && esFormValido() && (
            <div style={{ background: "#0d2010", border: "1px solid #1e5a25", borderRadius: 12, padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span style={{ fontSize: "1.4rem" }}>📲</span>
              <div style={{ fontSize: "0.82rem", color: "#7ec87e", lineHeight: 1.5 }}>Se va a abrir <strong>WhatsApp</strong> con tu pedido listo. Un toque y lo recibimos al tiro.</div>
            </div>
          )}
        </div>
        <div style={{ position: "fixed", bottom: "1.2rem", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 1.8rem)", maxWidth: 440, zIndex: 20 }}>
          <button onClick={enviarWhatsApp} disabled={!tipoEntrega || !esFormValido()}
            style={{ width: "100%", background: tipoEntrega && esFormValido() ? "linear-gradient(135deg, #128C7E, #25D366)" : "#162816", border: "none", borderRadius: 16, padding: "1rem", color: tipoEntrega && esFormValido() ? "#fff" : "#4a6a4a", fontSize: "1rem", cursor: tipoEntrega && esFormValido() ? "pointer" : "not-allowed", fontFamily: "inherit", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: tipoEntrega && esFormValido() ? "0 8px 32px #25D36655" : "none" }}>
            <span style={{ fontSize: "1.2rem" }}>💬</span> Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );

  // ════ CONFIRMADO ════
  if (pantalla === "confirmado") return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem", textAlign: "center" }}>
      <div style={S.grain} />
      <div style={{ ...S.c, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginBottom: "1.5rem", filter: "drop-shadow(0 0 30px #25D36655)" }}><Logo size={80} /></div>
        <p style={{ letterSpacing: "0.3em", fontSize: "0.7rem", color: "#6ec870", textTransform: "uppercase", margin: "0 0 0.4rem" }}>¡Listo po!</p>
        <h2 style={{ fontWeight: 400, fontSize: "2rem", margin: "0 0 0.8rem" }}>Pedido enviado</h2>
        <p style={{ color: "#7a9a7a", maxWidth: 280, lineHeight: 1.7, fontSize: "0.95rem", margin: 0 }}>
          WhatsApp ya tiene tu pedido listo.<br />Toca <strong style={{ color: "#25D366" }}>Enviar</strong> y te respondemos al tiro 🥦
        </p>
        <div style={{ background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 14, padding: "1rem 1.5rem", margin: "1.5rem 0", fontSize: "0.85rem", color: "#7a9a7a" }}>
          También puedes escribirnos directo al<br />
          <strong style={{ color: "#25D366", fontSize: "1rem" }}>+56 9 7343 7888</strong>
        </div>
        <button onClick={() => setPantalla("tienda")} style={{ background: "linear-gradient(135deg,#2d6a30,#3a7d44)", border: "none", borderRadius: 14, padding: "0.85rem 2rem", color: "#fff", fontSize: "0.95rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Hacer otro pedido
        </button>
      </div>
    </div>
  );
}

const INP = { background: "#0f1f10", border: "1px solid #1a321a", borderRadius: 12, padding: "0.75rem 1rem", color: "#f0ebe0", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
const LBL = { fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#6ec870" };
const GHO = { background: "none", border: "none", color: "#6ec870", cursor: "pointer", fontSize: "1.3rem", padding: "0.2rem 0.5rem" };
const OVL = { position: "fixed", inset: 0, background: "#000000bb", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" };
const SHT = { background: "#0f1f10", border: "1px solid #243a24", borderRadius: "20px 20px 0 0", padding: "1rem 1.2rem 2rem", width: "100%", maxWidth: 480 };
const HANDLE = { width: 36, height: 4, background: "#2d4d2d", borderRadius: 4, margin: "0 auto 1.2rem" };
