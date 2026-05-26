import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Shield, Database, FileWarning, Scale, Lock, AlertTriangle,
  Globe, Gavel, Fingerprint, ServerCrash, ChevronRight, Clock,
  Users, Building, BookOpen, FileText, TrendingUp, Menu, X,
  Activity, Eye, ShieldAlert,
} from "lucide-react";

// ↓ Ajusta los nombres de archivo a los que tengas en docs_paejea/
import resumen           from "../docs_paejea/01_resumen_paejea.md?raw";
import marco             from "../docs_paejea/02_marco_paejea.md?raw";
import delitos           from "../docs_paejea/03_delitos_paejea.md?raw";
import comparacion       from "../docs_paejea/04_comparacion_paejea.md?raw";
import responsabilidades from "../docs_paejea/05_responsabilidades_paejea.md?raw";
import datos             from "../docs_paejea/06_datos_paejea.md?raw";
import conclusiones      from "../docs_paejea/07_conclusiones_paejea.md?raw";
import prompts           from "../docs_paejea/08_prompts_paejea.md?raw";

const sections = [
  { id: "hero",             label: "Inicio",              icon: Shield },
  { id: "overview",         label: "Resumen Ejecutivo",   icon: FileText },
  { id: "timeline",         label: "Línea de Tiempo",     icon: Clock },
  { id: "laws",             label: "Marco Normativo",     icon: Scale },
  { id: "crimes",           label: "Delitos Informáticos",icon: ServerCrash },
  { id: "comparison",       label: "Comparación",         icon: Globe },
  { id: "responsibilities", label: "Responsabilidades",   icon: Gavel },
  { id: "data",             label: "Datos Personales",    icon: Database },
  { id: "conclusions",      label: "Conclusiones",        icon: TrendingUp },
  { id: "prompts",          label: "Bitácora IA",         icon: BookOpen },
];

const timelineEvents = [
  {
    date: "Marzo 2017",
    title: "Vulnerabilidad publicada",
    desc: "Se publica el CVE-2017-5638 para Apache Struts. Los parches de seguridad están disponibles públicamente.",
    dot: "bg-amber-500",
    icon: AlertTriangle,
    tag: "ALERTA",
    tagColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  {
    date: "Mayo 2017",
    title: "Inicio del ataque",
    desc: "Atacantes explotan la vulnerabilidad no parcheada y obtienen acceso inicial a los sistemas internos de Equifax.",
    dot: "bg-red-500",
    icon: Lock,
    tag: "INTRUSIÓN",
    tagColor: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  {
    date: "Mayo — Julio 2017",
    title: "Exfiltración masiva",
    desc: "Durante 76 días los atacantes permanecen en la red extrayendo datos de ~147 millones de personas sin ser detectados.",
    dot: "bg-violet-500",
    icon: Database,
    tag: "EXFILTRACIÓN",
    tagColor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  },
  {
    date: "29 Julio 2017",
    title: "Detección interna",
    desc: "Equifax detecta finalmente la brecha de seguridad. Se inicia investigación forense.",
    dot: "bg-blue-500",
    icon: Eye,
    tag: "DETECCIÓN",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  {
    date: "7 Septiembre 2017",
    title: "Revelación pública",
    desc: "Equifax anuncia públicamente la brecha. El retraso de 40 días en notificar genera fuertes críticas.",
    dot: "bg-emerald-500",
    icon: Activity,
    tag: "DIVULGACIÓN",
    tagColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    date: "2019 — Presente",
    title: "Consecuencias legales",
    desc: "Equifax acuerda $575M+ en compensaciones. EE.UU. imputa a 4 miembros del Ejército chino.",
    dot: "bg-slate-400",
    icon: Gavel,
    tag: "SANCIÓN",
    tagColor: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  },
];

const laws = [
  {
    title: "Ley N.º 21.459",
    subtitle: "Delitos Informáticos — Chile",
    desc: "Moderniza la legislación chilena en materia de ciberdelincuencia, adaptándola al Convenio de Budapest. Tipifica acceso ilícito, fraude informático y ataques a sistemas.",
    color: "border-blue-500/30",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    glow: "glow-blue",
    icon: Shield,
    articles: ["Art. 2 — Acceso ilícito", "Art. 3 — Integridad de sistemas", "Art. 4 — Integridad de datos", "Art. 5 — Interceptación ilícita", "Art. 7 — Fraude informático"],
    badge: "Derecho Penal",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    year: "2022",
  },
  {
    title: "Ley N.º 19.628",
    subtitle: "Protección de Datos — Chile",
    desc: "Regula el tratamiento de datos personales en Chile. Establece derechos ARCO y obligaciones para responsables de bases de datos personales.",
    color: "border-violet-500/30",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    glow: "glow-violet",
    icon: Fingerprint,
    articles: ["Derechos ARCO", "Deber de seguridad", "Confidencialidad", "Responsabilidad del registro"],
    badge: "Protección de Datos",
    badgeColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    year: "1999",
  },
  {
    title: "GDPR",
    subtitle: "Reglamento Europeo de Datos",
    desc: "Uno de los marcos regulatorios más estrictos del mundo. Exige notificación de brechas en 72 horas y aplica el principio de responsabilidad proactiva.",
    color: "border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    glow: "glow-emerald",
    icon: Globe,
    articles: ["72h notificación de brecha", "Responsabilidad proactiva", "Minimización de datos", "Derecho al olvido", "Multas hasta 4% de facturación"],
    badge: "Normativa UE",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    year: "2018",
  },
  {
    title: "Convenio de Budapest",
    subtitle: "Tratado Internacional",
    desc: "Principal tratado internacional sobre ciberdelincuencia. Chile adhirió oficialmente, influyendo directamente en la creación de la Ley 21.459.",
    color: "border-amber-500/30",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    glow: "",
    icon: Scale,
    articles: ["Armonización legislativa", "Cooperación internacional", "Técnicas investigativas", "Extradición", "Asistencia jurídica mutua"],
    badge: "Derecho Internacional",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    year: "2001",
  },
];

const responsibilities = [
  {
    title: "Atacantes",
    subtitle: "Ejército Popular de Liberación de China",
    icon: ShieldAlert,
    color: "border-red-500/30",
    bg: "bg-red-500/5",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    dot: "bg-red-500",
    items: [
      "Acceso ilícito a sistemas — Art. 2 Ley 21.459",
      "Interceptación ilícita de datos — Art. 5",
      "Ataque a integridad de sistemas — Art. 3",
      "Ataque a integridad de datos — Art. 4",
      "Fraude informático — Art. 7",
      "Responsabilidad penal internacional vía Convenio de Budapest",
    ],
    type: "Responsabilidad Penal",
    typeColor: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  {
    title: "Equifax",
    subtitle: "Responsable del Tratamiento de Datos",
    icon: Building,
    color: "border-orange-500/30",
    bg: "bg-orange-500/5",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    dot: "bg-orange-500",
    items: [
      "Incumplimiento del deber de seguridad — Ley 19.628",
      "Gestión deficiente de vulnerabilidades conocidas",
      "Negligencia en la protección de datos personales",
      "Demora de 40 días en notificar la brecha pública",
      "Daños civiles a millones de titulares de datos",
      "Responsabilidad administrativa y regulatoria",
    ],
    type: "Responsabilidad Civil / Adm.",
    typeColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  {
    title: "Ejecutivos",
    subtitle: "Directivos y CISO de Equifax",
    icon: Users,
    color: "border-amber-500/30",
    bg: "bg-amber-500/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    dot: "bg-amber-500",
    items: [
      "Deber de supervisión de vulnerabilidades críticas",
      "Incumplimiento de deberes de diligencia debida",
      "Posible responsabilidad civil por negligencia grave",
      "Gestión deficiente de riesgos tecnológicos",
      "3 ejecutivos renunciaron tras el incidente",
      "Cuestionamientos por insider trading previo al anuncio",
    ],
    type: "Responsabilidad Adm. / Laboral",
    typeColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  {
    title: "Usuarios Afectados",
    subtitle: "147 Millones de Personas",
    icon: Fingerprint,
    color: "border-blue-500/30",
    bg: "bg-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    dot: "bg-blue-500",
    items: [
      "Derecho de acceso a información comprometida",
      "Derecho de rectificación de datos incorrectos",
      "Derecho de cancelación de registros",
      "Derecho de oposición al tratamiento",
      "Acción civil por daños y perjuicios",
      "Protección constitucional — Art. 19 N.º 4 CPR",
    ],
    type: "Derechos y Acciones",
    typeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
];

const stats = [
  { value: "147M",   label: "Personas afectadas",               color: "text-red-400",     icon: Users },
  { value: "76 días",label: "Duración del ataque sin detección",color: "text-amber-400",   icon: Clock },
  { value: "$575M+", label: "En compensaciones pagadas",        color: "text-emerald-400", icon: TrendingUp },
  { value: "4 leyes",label: "Marcos regulatorios aplicables",   color: "text-blue-400",    icon: Scale },
];

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, color = "text-blue-400" }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
      </div>
      {subtitle && <p className="text-slate-400 text-sm ml-[52px]">{subtitle}</p>}
      <div className="h-px bg-gradient-to-r from-blue-500/30 via-violet-500/20 to-transparent mt-4" />
    </div>
  );
}

function SummaryCard({ title, items, color = "blue" }) {
  const colors = {
    blue:    "border-blue-500/20 bg-blue-500/5",
    violet:  "border-violet-500/20 bg-violet-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    red:     "border-red-500/20 bg-red-500/5",
    amber:   "border-amber-500/20 bg-amber-500/5",
  };
  const dots = {
    blue: "bg-blue-400", violet: "bg-violet-400",
    emerald: "bg-emerald-400", red: "bg-red-400", amber: "bg-amber-400",
  };
  return (
    <div className={`rounded-xl border p-4 mb-6 ${colors[color] || colors.blue}`}>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${dots[color] || dots.blue} flex-shrink-0 mt-1.5`} />
            <span className="text-sm text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef({});

  const registerRef = useCallback((id) => (el) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-300">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#080d18] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">CiberJurídico</div>
                <div className="text-[10px] text-slate-500 leading-tight">Caso Equifax 2017</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
            <span className="text-[11px] text-emerald-400 font-medium">Informe Académico Activo</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="mb-2 px-3">
            <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Secciones</span>
          </div>
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => scrollTo(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all duration-150 text-left group ${activeSection === id ? "nav-active font-medium" : "text-slate-500 hover:text-slate-300 hover:bg-white/3"}`}>
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${activeSection === id ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"}`} />
              <span className="truncate">{label}</span>
              {activeSection === id && <ChevronRight className="w-3 h-3 ml-auto text-blue-400" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="text-[11px] text-slate-600 text-center">Análisis Jurídico · Ley 21.459 & 19.628</div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 lg:hidden bg-[#060b14]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">CiberJurídico</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white">
            <Menu className="w-4 h-4" />
          </button>
        </header>

        {/* HERO */}
        <section id="hero" ref={registerRef("hero")} className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden grid-pattern">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
            <div className="flex flex-wrap items-center gap-2 mb-8 fade-in-up">
              <Badge className="text-red-400 bg-red-400/8 border-red-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 pulse-glow" />
                BRECHA CRÍTICA — 2017
              </Badge>
              <Badge className="text-blue-400 bg-blue-400/8 border-blue-400/20">
                <Shield className="w-3 h-3" /> Análisis Legislación Chilena
              </Badge>
              <Badge className="text-violet-400 bg-violet-400/8 border-violet-400/20">
                <BookOpen className="w-3 h-3" /> Informe Académico
              </Badge>
              <Badge className="text-emerald-400 bg-emerald-400/8 border-emerald-400/20">
                <Globe className="w-3 h-3" /> Derecho Internacional
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 fade-in-up">
              <span className="gradient-text">Caso Equifax</span><br />
              <span className="text-slate-100">2017</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-4 max-w-2xl leading-relaxed fade-in-up">
              Análisis jurídico integral de la mayor brecha de datos financieros de la historia, examinada bajo el marco normativo chileno.
            </p>
            <p className="text-slate-500 text-sm mb-10 max-w-xl fade-in-up">
              ¿Qué habría ocurrido si este incidente se hubiese producido bajo jurisdicción chilena? Aplicación de la Ley 21.459, Ley 19.628 y normativas internacionales.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 fade-in-up">
              {stats.map(({ value, label, color, icon: Icon }) => (
                <div key={label} className="gradient-border p-4">
                  <Icon className={`w-4 h-4 ${color} mb-2`} />
                  <div className={`text-2xl font-black ${color} mb-1`}>{value}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 fade-in-up">
              {["Ley 21.459 — Delitos Informáticos", "Ley 19.628 — Datos Personales", "GDPR", "Convenio de Budapest", "Art. 19 N.º 4 CPR"].map((law) => (
                <div key={law} className="px-3 py-1.5 rounded-full bg-white/4 border border-white/8 text-xs text-slate-400 hover:border-blue-500/30 hover:text-slate-300 transition-colors">
                  {law}
                </div>
              ))}
            </div>

            <button onClick={() => scrollTo("overview")} className="mt-12 flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors group">
              <span>Explorar análisis</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* RESUMEN */}
        <section id="overview" ref={registerRef("overview")} className="max-w-4xl mx-auto px-6 py-16">
          <SectionTitle icon={FileText} title="Resumen Ejecutivo" subtitle="Resumen del incidente, actores e impacto global del caso Equifax" />
          <SummaryCard title="Puntos clave del incidente" color="red" items={[
            "Vulnerabilidad CVE-2017-5638 en Apache Struts",
            "147 millones de personas afectadas globalmente",
            "76 días sin detección dentro de la red",
            "Datos financieros, SSN, fechas de nacimiento expuestos",
            "Atribuido al Ejército Popular de Liberación de China",
            "Sanción de $575M+ en compensaciones",
          ]} />
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{resumen}</ReactMarkdown>
          </div>
        </section>

        {/* TIMELINE */}
        <section id="timeline" ref={registerRef("timeline")} className="py-16 bg-[#060c17]">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={Clock} title="Línea de Tiempo del Incidente" subtitle="Cronología detallada del ataque a Equifax" />
            <div className="relative">
              <div className="absolute left-6 sm:left-[7.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-violet-500/20 to-transparent" />
              <div className="space-y-6">
                {timelineEvents.map((event, i) => (
                  <div key={i} className="relative flex gap-4 sm:gap-8">
                    <div className="hidden sm:flex flex-col items-end w-28 flex-shrink-0 pt-3">
                      <span className="text-[11px] font-semibold text-slate-500 text-right leading-tight">{event.date}</span>
                    </div>
                    <div className="relative flex-shrink-0 mt-3.5">
                      <div className={`w-3 h-3 rounded-full ${event.dot} ring-4 ring-[#060b14] z-10 relative`} />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="bg-[#0a1120] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-semibold text-slate-100">{event.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${event.tagColor}`}>{event.tag}</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{event.desc}</p>
                        <div className="sm:hidden text-[11px] text-slate-600 mt-2">{event.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LEYES */}
        <section id="laws" ref={registerRef("laws")} className="max-w-4xl mx-auto px-6 py-16">
          <SectionTitle icon={Scale} title="Marco Normativo Aplicable" subtitle="Leyes y tratados internacionales relevantes para el análisis del caso" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {laws.map((law) => (
              <div key={law.title} className={`rounded-xl border ${law.color} bg-[#080e1a] p-5 hover:border-opacity-60 transition-all ${law.glow}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${law.iconBg}`}>
                    <law.icon className={`w-5 h-5 ${law.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${law.badgeColor}`}>{law.year}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-0.5">{law.title}</h3>
                <p className={`text-xs font-medium mb-3 ${law.iconColor}`}>{law.subtitle}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{law.desc}</p>
                <div className="space-y-1.5">
                  {law.articles.map((art) => (
                    <div key={art} className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${law.iconColor}`} style={{ background: "currentColor" }} />
                      <span className="text-xs text-slate-500">{art}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/5">
                  <Badge className={law.badgeColor}>{law.badge}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{marco}</ReactMarkdown>
          </div>
        </section>

        {/* DELITOS */}
        <section id="crimes" ref={registerRef("crimes")} className="py-16 bg-[#060c17]">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={ServerCrash} title="Tipificación de Delitos Informáticos" subtitle="Conductas del caso Equifax bajo la Ley N.º 21.459" />
            <SummaryCard title="Delitos identificados — Ley 21.459" color="violet" items={[
              "Art. 2 — Acceso ilícito a sistemas informáticos",
              "Art. 3 — Ataque a integridad del sistema",
              "Art. 4 — Ataque a integridad de datos",
              "Art. 5 — Interceptación ilícita de datos",
              "Art. 7 — Fraude informático (uso posterior de datos)",
              "Cooperación vía Convenio de Budapest",
            ]} />
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{delitos}</ReactMarkdown>
            </div>
          </div>
        </section>

        {/* COMPARACIÓN */}
        <section id="comparison" ref={registerRef("comparison")} className="max-w-4xl mx-auto px-6 py-16">
          <SectionTitle icon={Globe} title="Comparación de Marcos Regulatorios" subtitle="Chile vs. Unión Europea (GDPR) vs. Estados Unidos" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { label: "Chile", detail: "Ley 19.628 + 21.459", status: "En desarrollo", color: "border-blue-500/30 bg-blue-500/5", statusColor: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
              { label: "Unión Europea", detail: "GDPR — Notificación 72h", status: "Estándar más alto", color: "border-emerald-500/30 bg-emerald-500/5", statusColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
              { label: "EE.UU.", detail: "Sistema sectorial fragmentado", status: "Regulación variable", color: "border-amber-500/30 bg-amber-500/5", statusColor: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
                <h3 className="text-sm font-bold text-slate-200 mb-1">{item.label}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.detail}</p>
                <Badge className={item.statusColor}>{item.status}</Badge>
              </div>
            ))}
          </div>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{comparacion}</ReactMarkdown>
          </div>
        </section>

        {/* RESPONSABILIDADES */}
        <section id="responsibilities" ref={registerRef("responsibilities")} className="py-16 bg-[#060c17]">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={Gavel} title="Responsabilidades Jurídicas" subtitle="Análisis de actores y sus responsabilidades bajo legislación chilena" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {responsibilities.map((resp) => (
                <div key={resp.title} className={`rounded-xl border ${resp.color} ${resp.bg} p-5`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg ${resp.iconBg} flex-shrink-0`}>
                      <resp.icon className={`w-5 h-5 ${resp.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 leading-tight">{resp.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{resp.subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {resp.items.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${resp.dot} flex-shrink-0 mt-1.5`} />
                        <span className="text-xs text-slate-400 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Badge className={resp.typeColor}>{resp.type}</Badge>
                </div>
              ))}
            </div>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{responsabilidades}</ReactMarkdown>
            </div>
          </div>
        </section>

        {/* DATOS PERSONALES */}
        <section id="data" ref={registerRef("data")} className="max-w-4xl mx-auto px-6 py-16">
          <SectionTitle icon={Database} title="Tratamiento de Datos Personales" subtitle="Análisis bajo la Ley N.º 19.628 — Derechos ARCO" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { letter: "A", name: "Acceso",       desc: "Conocer qué datos posee la organización",  color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
              { letter: "R", name: "Rectificación",desc: "Corregir datos erróneos o incompletos",     color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
              { letter: "C", name: "Cancelación",  desc: "Eliminar datos sin fundamento legal",       color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { letter: "O", name: "Oposición",    desc: "Oponerse al tratamiento de datos",          color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            ].map((right) => (
              <div key={right.letter} className={`rounded-xl border p-4 text-center ${right.color}`}>
                <div className={`text-3xl font-black mb-1 ${right.color.split(" ")[0]}`}>{right.letter}</div>
                <div className="text-sm font-bold text-slate-200 mb-2">{right.name}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{right.desc}</div>
              </div>
            ))}
          </div>
          <SummaryCard title="Datos comprometidos en el caso Equifax" color="amber" items={[
            "Números de seguridad social (SSN) — 143M+",
            "Nombres completos y fechas de nacimiento",
            "Domicilios y correos electrónicos",
            "Licencias de conducir — 17.6M",
            "Números de tarjetas de crédito — 209K",
            "Historiales crediticios y financieros",
          ]} />
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{datos}</ReactMarkdown>
          </div>
        </section>

        {/* CONCLUSIONES */}
        <section id="conclusions" ref={registerRef("conclusions")} className="py-16 bg-[#060c17]">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={TrendingUp} title="Conclusiones y Recomendaciones" subtitle="Síntesis del análisis jurídico y medidas de mejora" color="text-emerald-400" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
              {[
                { icon: FileWarning, title: "Gestión de Vulnerabilidades", desc: "Una vulnerabilidad conocida y sin parchar permitió el ataque. La actualización de sistemas es esencial.", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                { icon: Lock, title: "Responsabilidad Corporativa", desc: "Las organizaciones deben integrar ciberseguridad y protección de datos como prioridad estratégica.", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { icon: Globe, title: "Cooperación Internacional", desc: "Los delitos informáticos son transnacionales. El Convenio de Budapest es fundamental para su persecución.", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              ].map((item) => (
                <div key={item.title} className={`rounded-xl border ${item.color} p-5`}>
                  <div className={`p-2 rounded-lg w-fit mb-3 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{conclusiones}</ReactMarkdown>
            </div>
          </div>
        </section>

        {/* BITÁCORA IA */}
        <section id="prompts" ref={registerRef("prompts")} className="max-w-4xl mx-auto px-6 py-16">
          <SectionTitle icon={BookOpen} title="Bitácora de Uso de IA" subtitle="Transparencia en el uso de inteligencia artificial — Prompts utilizados" />
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 flex-shrink-0">
                <Activity className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">Uso Transparente de IA</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Esta sección cumple con el criterio de transparencia en el uso de IA. Se documentan todos los prompts utilizados durante la elaboración del informe.
                </p>
              </div>
            </div>
          </div>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{prompts}</ReactMarkdown>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-10 px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Análisis Jurídico — Caso Equifax 2017</div>
                <div className="text-xs text-slate-600">Ley 21.459 · Ley 19.628 · GDPR · Convenio de Budapest</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="text-slate-500 border-slate-700 bg-transparent">Informe Académico</Badge>
              <Badge className="text-slate-500 border-slate-700 bg-transparent">Derecho Informático</Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}