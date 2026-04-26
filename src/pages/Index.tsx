import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/9d2c028e-bad3-4453-b5c1-646a85a311ae.jpg";
const TRUCK_IMG = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/b077cdc5-b852-4155-9391-0c5f99f3a34d.jpg";

const MISSIONS = [
  { id: 1, title: "Техас. Горизонт горит", subtitle: "Пролог", status: "completed", difficulty: "Лёгкая", reward: "1200 XP", description: "Первый контакт. Ты замечаешь воронку вдали — и гонишься за ней через пшеничные поля.", time: "12:47 ◾ РАННИЕ СУМЕРКИ" },
  { id: 2, title: "Аллея Торнадо", subtitle: "Миссия 1", status: "active", difficulty: "Средняя", reward: "2400 XP", description: "Три одновременных торнадо. Перехватчик повреждён. Один шанс на развёртывание зонда.", time: "18:03 ◾ ЗАКАТ" },
  { id: 3, title: "Категория EF5", subtitle: "Миссия 2", status: "locked", difficulty: "Экстремальная", reward: "5000 XP", description: "Самый мощный торнадо в истории. Диаметр — 2.7 км. Скорость ветра — 482 км/ч.", time: "22:15 ◾ НОЧЬ" },
  { id: 4, title: "Буря над городом", subtitle: "Миссия 3", status: "locked", difficulty: "Высокая", reward: "3600 XP", description: "Эвакуация населённого пункта. Время до удара — 8 минут. Каждая секунда на счету.", time: "09:30 ◾ УТРО" },
  { id: 5, title: "Конец сезона", subtitle: "Финал", status: "locked", difficulty: "Легендарная", reward: "10000 XP", description: "Суперъячейка. Пять торнадо одновременно. Последний шанс завершить исследование.", time: "15:22 ◾ ДЕНЬ" },
];

const BASE_VEHICLES = [
  { id: 1, name: "TIV-2", type: "Перехватчик", armor: 85, speed: 72, handling: 68, image: TRUCK_IMG },
  { id: 2, name: "Dominator 3", type: "Штурмовой", armor: 70, speed: 88, handling: 75, image: TRUCK_IMG },
  { id: 3, name: "GUST-R", type: "Разведчик", armor: 55, speed: 95, handling: 90, image: TRUCK_IMG },
];

const PARTS = [
  { slot: "Броня", options: ["Стандартная обшивка", "Сталь 12мм", "Титановая броня"], icon: "Shield" },
  { slot: "Двигатель", options: ["V8 Diesel 450HP", "Bi-Turbo 600HP", "Supercharged 780HP"], icon: "Zap" },
  { slot: "Зонды", options: ["Метеозонд MK-1", "GUST-зонд Pro", "Квантовый сенсор"], icon: "Radio" },
  { slot: "Подвеска", options: ["Off-road Standard", "Heavy Duty Plus", "Combat Suspension"], icon: "Settings" },
];

type Section = "hero" | "campaign" | "garage";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [selectedMission, setSelectedMission] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [selectedParts, setSelectedParts] = useState<Record<string, number>>({
    "Броня": 0, "Двигатель": 0, "Зонды": 0, "Подвеска": 0
  });
  const [heroVisible, setHeroVisible] = useState(false);
  const [windSpeed, setWindSpeed] = useState(247);
  const [dustCount] = useState(() => Array.from({ length: 12 }, (_, i) => i));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setWindSpeed(prev => Math.max(180, Math.min(380, prev + Math.floor((Math.random() - 0.4) * 15))));
    }, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const mission = MISSIONS.find(m => m.id === selectedMission)!;
  const vehicle = BASE_VEHICLES[selectedVehicle];

  const nav = [
    { id: "hero" as Section, label: "ГЛАВНАЯ", icon: "Home" },
    { id: "campaign" as Section, label: "КАМПАНИЯ", icon: "Map" },
    { id: "garage" as Section, label: "ГАРАЖ", icon: "Wrench" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "linear-gradient(to bottom, rgba(10,7,5,0.95) 0%, transparent 100%)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm flex items-center justify-center animate-pulse-glow"
            style={{ background: "linear-gradient(135deg, hsl(28,85%,52%), hsl(5,75%,45%))" }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", color: "#0a0705", fontSize: 14 }}>TC</span>
          </div>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, letterSpacing: "0.15em", color: "hsl(38,90%,65%)" }}>
            TORNADO CHASER
          </span>
        </div>

        <div className="flex items-center gap-1">
          {nav.map(item => (
            <button key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 ${
                activeSection === item.id
                  ? "text-orange-400"
                  : "text-stone-500 hover:text-stone-300"
              }`}
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", fontWeight: 500 }}>
              <Icon name={item.icon} size={14} />
              {item.label}
              {activeSection === item.id && (
                <span className="ml-1 w-1 h-1 rounded-full bg-orange-500 inline-block" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
          <div className="text-stone-500">ВЕТЕР</div>
          <div className="text-orange-400">{windSpeed} КМ/Ч</div>
          <div className="w-px h-4 bg-stone-700" />
          <div className="text-stone-500">СЕЗОН 1</div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      {activeSection === "hero" && (
        <section className="relative min-h-screen flex flex-col">
          <div className="absolute inset-0 overflow-hidden">
            <img src={HERO_IMG} alt="Tornado" className="w-full h-full object-cover animate-tornado-spin"
              style={{ transformOrigin: "60% 40%", filter: "saturate(0.8) brightness(0.55)" }} />
            <div className="bg-storm-overlay absolute inset-0" />
            <div className="absolute inset-0 animate-lightning"
              style={{ background: "rgba(180, 160, 100, 0.08)" }} />
            {dustCount.map(i => (
              <div key={i} className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${15 + (i * 7) % 70}%`,
                  bottom: `${10 + (i * 11) % 30}%`,
                  background: "rgba(220, 120, 40, 0.5)",
                  animation: `dust-particle ${2 + (i * 0.3)}s linear infinite`,
                  animationDelay: `${i * 0.4}s`,
                }} />
            ))}
          </div>

          <div className={`absolute top-24 left-8 transition-all duration-1000 ${heroVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="hud-border p-3 mb-2" style={{ width: 200 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>КООРДИНАТЫ</div>
              <div className="text-sm text-orange-300 animate-flicker" style={{ fontFamily: "monospace" }}>
                36.1540°N / 95.9928°W
              </div>
            </div>
            <div className="hud-border p-3" style={{ width: 200 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>КАТЕГОРИЯ</div>
              <div className="text-gradient-fire text-2xl" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.1em" }}>EF-4 ▲</div>
            </div>
          </div>

          <div className={`absolute top-24 right-8 text-right transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="hud-border p-3 mb-2" style={{ width: 180 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>СКОРОСТЬ ВЕТРА</div>
              <div className="text-orange-400 text-xl animate-flicker" style={{ fontFamily: "'Bebas Neue', cursive" }}>
                {windSpeed} КМ/Ч
              </div>
            </div>
            <div className="hud-border p-3" style={{ width: 180 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>ДИСТАНЦИЯ</div>
              <div className="text-stone-200 text-xl" style={{ fontFamily: "'Bebas Neue', cursive" }}>
                1.2 КМ ◈
              </div>
            </div>
          </div>

          <div className={`relative z-10 flex flex-col items-start justify-end min-h-screen px-12 pb-20 
            transition-all duration-1200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

            <div className="mb-3 flex items-center gap-3">
              <div className="w-12 h-px" style={{ background: "hsl(28,85%,52%)" }} />
              <span className="text-orange-400 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.25em" }}>
                STORM PURSUIT DIVISION / 2024
              </span>
            </div>

            <h1 className="text-gradient-fire mb-4 leading-none"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(72px, 10vw, 140px)", letterSpacing: "0.04em" }}>
              TORNADO<br />CHASER
            </h1>

            <p className="text-stone-300 max-w-xl text-base mb-8 leading-relaxed"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 }}>
              Вы — последний барьер между разрушительной стихией и сотнями тысяч жизней.
              Охотьтесь за торнадо. Разворачивайте зонды. Выживайте.
            </p>

            <div className="flex items-center gap-4">
              <button className="btn-storm px-8 py-3 text-sm" onClick={() => setActiveSection("campaign")}>
                ▶ НАЧАТЬ КАМПАНИЮ
              </button>
              <button className="btn-outline-storm px-8 py-3 text-sm" onClick={() => setActiveSection("garage")}>
                ⚙ ГАРАЖ
              </button>
            </div>

            <div className="flex items-center gap-8 mt-12 pt-6 border-t border-stone-800">
              {[
                { label: "МИССИЙ", value: "12" },
                { label: "ТОРНАДО", value: "47+" },
                { label: "ПЕРЕХВАТЧИКОВ", value: "6" },
                { label: "КМ² КАРТА", value: "3200" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-gradient-fire text-3xl" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
                    {stat.value}
                  </div>
                  <div className="text-stone-600 text-xs mt-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CAMPAIGN SECTION ===== */}
      {activeSection === "campaign" && (
        <section className="min-h-screen pt-20 px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10 pt-8">
              <div>
                <div className="text-orange-500 text-xs mb-2" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.25em" }}>
                  ОДИНОЧНАЯ КАМПАНИЯ
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 56, letterSpacing: "0.05em", lineHeight: 1 }}>
                  СЕЗОН ТОРНАДО
                </h2>
              </div>
              <div className="flex items-center gap-6 pb-2">
                <div className="text-center">
                  <div className="text-orange-400 text-2xl" style={{ fontFamily: "'Bebas Neue', cursive" }}>2 / 5</div>
                  <div className="text-stone-500 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>ПРОЙДЕНО</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 text-2xl" style={{ fontFamily: "'Bebas Neue', cursive" }}>3600 XP</div>
                  <div className="text-stone-500 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>ЗАРАБОТАНО</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4 space-y-2">
                {MISSIONS.map(m => (
                  <div key={m.id}
                    className={`mission-card p-4 ${selectedMission === m.id ? "active" : ""} ${m.status === "locked" ? "opacity-50" : ""}`}
                    onClick={() => m.status !== "locked" && setSelectedMission(m.id)}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-xs text-orange-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>
                          {m.subtitle.toUpperCase()}
                        </div>
                        <div className="text-stone-200 font-medium text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
                          {m.title}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {m.status === "completed" && <Icon name="CheckCircle" size={16} className="text-green-500" />}
                        {m.status === "active" && <Icon name="Play" size={16} className="text-orange-400" />}
                        {m.status === "locked" && <Icon name="Lock" size={16} className="text-stone-600" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-stone-500" style={{ fontFamily: "'Oswald', sans-serif" }}>{m.difficulty}</span>
                      <span className="w-1 h-1 rounded-full bg-stone-700" />
                      <span className="text-xs text-orange-600" style={{ fontFamily: "'Oswald', sans-serif" }}>{m.reward}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-span-8">
                <div className="card-storm rounded-sm overflow-hidden h-full" style={{ minHeight: 500 }}>
                  <div className="relative h-56 overflow-hidden scan-effect">
                    <img src={HERO_IMG} alt="Mission" className="w-full h-full object-cover"
                      style={{ filter: "saturate(0.6) brightness(0.5)", objectPosition: "center 30%" }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(15,10,7,0.95) 100%)" }} />
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="text-stone-400 text-xs mb-1 animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em" }}>
                        {mission.time}
                      </div>
                      <h3 className="text-gradient-fire" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, letterSpacing: "0.05em", lineHeight: 1 }}>
                        {mission.title}
                      </h3>
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 text-xs"
                      style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em",
                        background: "rgba(220,120,40,0.2)", border: "1px solid rgba(220,120,40,0.4)", color: "hsl(38,90%,65%)" }}>
                      {mission.difficulty.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-stone-400 text-sm mb-6 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 }}>
                      {mission.description}
                    </p>

                    <div className="mb-6">
                      <div className="text-xs text-orange-500 mb-3" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>
                        ЗАДАЧИ МИССИИ
                      </div>
                      <div className="space-y-2">
                        {[
                          { text: "Перехватить торнадо", done: mission.status === "completed" },
                          { text: "Развернуть сенсорный зонд в зоне воронки", done: false },
                          { text: "Выбраться из зоны поражения живым", done: false },
                        ].map((obj, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${obj.done ? "bg-green-800 border-green-600" : "border border-stone-700"}`}>
                              {obj.done && <Icon name="Check" size={10} className="text-green-400" />}
                            </div>
                            <span className={`text-sm ${obj.done ? "text-stone-500 line-through" : "text-stone-300"}`}
                              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                              {obj.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 mb-6 rounded-sm"
                      style={{ background: "rgba(220,120,40,0.08)", border: "1px solid rgba(220,120,40,0.2)" }}>
                      <div className="text-xs text-stone-500" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>НАГРАДА</div>
                      <div className="text-orange-400" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, letterSpacing: "0.05em" }}>
                        {mission.reward}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {mission.status !== "locked" ? (
                        <button className="btn-storm flex-1 py-3 text-sm">
                          {mission.status === "completed" ? "▶ ИГРАТЬ СНОВА" : "▶ НАЧАТЬ МИССИЮ"}
                        </button>
                      ) : (
                        <button className="btn-outline-storm flex-1 py-3 text-sm cursor-not-allowed opacity-50" disabled>
                          🔒 ЗАБЛОКИРОВАНО
                        </button>
                      )}
                      <button className="btn-outline-storm px-4 py-3 text-sm">
                        <Icon name="Map" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== GARAGE SECTION ===== */}
      {activeSection === "garage" && (
        <section className="min-h-screen pt-20 px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10 pt-8">
              <div>
                <div className="text-orange-500 text-xs mb-2" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.25em" }}>
                  ПЕРСОНАЛИЗАЦИЯ
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 56, letterSpacing: "0.05em", lineHeight: 1 }}>
                  ГАРАЖ
                </h2>
              </div>
              <div className="pb-2">
                <button className="btn-storm px-6 py-2 text-sm">СОХРАНИТЬ СБОРКУ</button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-5">
                <div className="card-storm rounded-sm overflow-hidden mb-4 scan-effect">
                  <div className="relative h-64 overflow-hidden">
                    <img src={vehicle.image} alt={vehicle.name}
                      className="w-full h-full object-cover transition-all duration-500"
                      style={{ filter: "saturate(0.75) brightness(0.6)", objectPosition: "center" }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(15,10,7,0.98) 100%)" }} />
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-orange-400 text-xs mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em" }}>
                            {vehicle.type.toUpperCase()}
                          </div>
                          <div className="text-white" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, letterSpacing: "0.05em" }}>
                            {vehicle.name}
                          </div>
                        </div>
                        <div className="text-xs text-stone-500" style={{ fontFamily: "'Oswald', sans-serif" }}>3D МОДЕЛЬ</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {BASE_VEHICLES.map((v, i) => (
                    <button key={v.id}
                      onClick={() => setSelectedVehicle(i)}
                      className={`flex-1 py-2 px-3 text-xs transition-all duration-200 rounded-sm ${
                        selectedVehicle === i
                          ? "border border-orange-500/60 text-orange-300"
                          : "border border-stone-800 text-stone-500 hover:border-stone-600"
                      }`}
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: "0.08em",
                        background: selectedVehicle === i ? "rgba(194,65,12,0.2)" : "transparent"
                      }}>
                      {v.name}
                    </button>
                  ))}
                </div>

                <div className="card-storm rounded-sm p-5 space-y-4">
                  <div className="text-xs text-orange-500 mb-3" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>
                    ХАРАКТЕРИСТИКИ
                  </div>
                  {[
                    { label: "БРОНЯ", value: vehicle.armor, icon: "Shield" },
                    { label: "СКОРОСТЬ", value: vehicle.speed, icon: "Gauge" },
                    { label: "УПРАВЛЕНИЕ", value: vehicle.handling, icon: "Navigation" },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon name={stat.icon} size={12} className="text-orange-600" />
                          <span className="text-xs text-stone-400" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-sm text-orange-400" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
                          {stat.value}/100
                        </span>
                      </div>
                      <div className="status-bar">
                        <div className="status-bar-fill" style={{ width: `${stat.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-7">
                <div className="text-xs text-orange-500 mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>
                  УСТАНОВКА ДЕТАЛЕЙ
                </div>
                <div className="space-y-3">
                  {PARTS.map(part => (
                    <div key={part.slot} className="card-storm rounded-sm p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-sm flex items-center justify-center"
                          style={{ background: "rgba(220,120,40,0.15)", border: "1px solid rgba(220,120,40,0.3)" }}>
                          <Icon name={part.icon} size={14} className="text-orange-500" />
                        </div>
                        <div>
                          <div className="text-sm text-stone-200" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em" }}>
                            {part.slot.toUpperCase()}
                          </div>
                          <div className="text-xs text-orange-400" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            {part.options[selectedParts[part.slot]]}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {part.options.map((opt, i) => (
                          <button key={i}
                            onClick={() => setSelectedParts(prev => ({ ...prev, [part.slot]: i }))}
                            className={`flex-1 py-2 text-xs transition-all duration-200 rounded-sm ${
                              selectedParts[part.slot] === i
                                ? "border border-orange-500/50 text-orange-300"
                                : "garage-slot text-stone-500 hover:text-stone-300"
                            }`}
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                              letterSpacing: "0.05em",
                              background: selectedParts[part.slot] === i ? "rgba(194,65,12,0.25)" : undefined
                            }}>
                            <div className="text-center">
                              <div className={`text-xs font-semibold mb-0.5 ${selectedParts[part.slot] === i ? "text-orange-400" : "text-stone-600"}`}>
                                {["БАЗОВЫЙ", "ПРОДВИНУТЫЙ", "ЭКСТРЕМАЛЬНЫЙ"][i]}
                              </div>
                              <div className="text-xs leading-tight">{opt}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-sm"
                  style={{ background: "rgba(220,120,40,0.06)", border: "1px solid rgba(220,120,40,0.2)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>
                        АКТИВНАЯ СБОРКА
                      </div>
                      <div className="text-stone-200 text-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {vehicle.name} — {Object.values(selectedParts).filter(v => v > 0).length} улучшений установлено
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-stone-500" style={{ fontFamily: "'Oswald', sans-serif" }}>УРОВЕНЬ ОПАСНОСТИ</div>
                      <div className="text-gradient-fire" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22 }}>
                        {["I", "II", "III", "IV", "V"][Math.min(Object.values(selectedParts).reduce((a, b) => a + b, 0), 4)]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer strip */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-2 border-t border-stone-900"
        style={{ background: "rgba(10,7,5,0.9)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-6">
          {[
            { label: "XP", value: "3,600", color: "text-orange-400" },
            { label: "РАНГ", value: "ОХОТНИК", color: "text-stone-300" },
            { label: "СЕЗОН", value: "01/12", color: "text-stone-400" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-xs text-stone-600" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>{item.label}</span>
              <span className={`text-xs font-semibold ${item.color}`} style={{ fontFamily: "'Oswald', sans-serif" }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-stone-700 animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em" }}>
          ● ШТОРМ АКТИВЕН — ОСТОРОЖНОСТЬ ПРЕВЫШЕ ВСЕГО
        </div>
      </div>
    </div>
  );
}
