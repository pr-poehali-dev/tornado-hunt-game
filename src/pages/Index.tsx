import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/9d2c028e-bad3-4453-b5c1-646a85a311ae.jpg";
const WORKSHOP_IMG = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/4254380a-8ce9-49d5-afb0-f4af12a5deac.jpg";
const ELRENO_IMG = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/47fbd523-0031-467d-ae0b-8e570dfc1eb7.jpg";
const TWISTEX_IMG = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/4f98fa32-5f0a-470c-a072-6796768904a9.jpg";

// ===================== REAL EVENTS CAMPAIGN =====================
interface Mission {
  id: number;
  title: string;
  subtitle: string;
  status: string;
  difficulty: string;
  reward: string;
  image: string;
  date: string;
  ef: string;
  realEvent: boolean;
  isTragedy?: boolean;
  description: string;
  briefing: string;
  objectives: { text: string; done: boolean }[];
  casualties: { count: number; note: string } | null;
  memorial: string | null;
  realPerson?: { name: string; role: string; note: string };
}

const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Балджер, Техас. Первый сезон",
    subtitle: "1995 — ПРОЛОГ",
    status: "completed",
    difficulty: "Лёгкая",
    reward: "800 XP",
    image: HERO_IMG,
    date: "15 мая 1995 / Балджер, Техас",
    ef: "EF-3",
    realEvent: false,
    description: "Твой первый выезд. Старенький Ford Ranger, самодельный анемометр на крыше и 40 литров бензина. Ты ещё не знаешь, что эта страсть поглотит тебя целиком.",
    briefing: "Учебная погоня за слабым торнадо в Панхандле. Задача — не погибнуть и вернуться с данными.",
    objectives: [
      { text: "Выйти на позицию перехвата", done: true },
      { text: "Развернуть портативный зонд", done: true },
      { text: "Уйти от debris flow", done: true },
    ],
    casualties: null,
    memorial: null,
  },
  {
    id: 2,
    title: "Проект TWISTEX. Кэнсас",
    subtitle: "2010 — МИССИЯ 1",
    status: "active",
    difficulty: "Средняя",
    reward: "2200 XP",
    image: TWISTEX_IMG,
    date: "10 мая 2010 / Кэнсас, USA",
    ef: "EF-2",
    realEvent: true,
    description: "Тим Самарас собрал лучшую команду учёных-охотников за торнадо. Проект TWISTEX — попытка поставить зонды прямо в пути движения воронки. Ты работаешь бок о бок с легендой.",
    briefing: "Работа в команде TWISTEX. Тим Самарас координирует операцию с фургона. Твоя задача — поставить зонд № 3 на пути F-зоны.",
    objectives: [
      { text: "Скоординироваться с машиной Тима", done: false },
      { text: "Разместить зонд-черепаху GUST на шоссе 56", done: false },
      { text: "Отступить до прохода воронки", done: false },
    ],
    casualties: null,
    memorial: null,
    realPerson: { name: "Тим Самарас", role: "Лидер TWISTEX", note: "Инженер и охотник за торнадо. Создал прибор-черепаху для измерений внутри воронки." },
  },
  {
    id: 3,
    title: "Мур, Оклахома",
    subtitle: "20 МАЯ 2013",
    status: "locked",
    difficulty: "Высокая",
    reward: "4000 XP",
    image: ELRENO_IMG,
    date: "20 мая 2013 / Мур, Оклахома",
    ef: "EF-5",
    realEvent: true,
    description: "Торнадо EF-5 прошёл через жилые кварталы Мура. 24 погибших. Две начальные школы уничтожены. Ты должен помочь эвакуации и поставить зонды для предупреждения.",
    briefing: "Торнадо шириной 1.9 км движется прямо через город. Скорость ветра — 340 км/ч. У тебя 12 минут до удара.",
    objectives: [
      { text: "Передать координаты воронки в экстренные службы", done: false },
      { text: "Поставить зонд в 500м от траектории", done: false },
      { text: "Вывести гражданских с шоссе 4", done: false },
    ],
    casualties: { count: 24, note: "погибших мирных жителей" },
    memorial: null,
  },
  {
    id: 4,
    title: "Эль-Рено. Самый широкий",
    subtitle: "31 МАЯ 2013 — TWISTEX ГИБНЕТ",
    status: "locked",
    difficulty: "ЛЕГЕНДАРНАЯ",
    reward: "8000 XP",
    image: ELRENO_IMG,
    date: "31 мая 2013 / Эль-Рено, Оклахома",
    ef: "EF-5",
    realEvent: true,
    isTragedy: true,
    description: "Самый широкий торнадо в истории — 4.2 км. Он резко повернул на север и поглотил команду TWISTEX. Тим Самарас, его сын Пол и Карл Янг погибли. Их машина была найдена в 800 метрах от места удара.",
    briefing: "Воронка непредсказуемо меняет направление. Ты видишь машины TWISTEX — они слишком близко. Связи нет. Ты рядом.",
    objectives: [
      { text: "Отследить внезапный поворот воронки", done: false },
      { text: "Выйти на связь с Тимом Самарасом", done: false },
      { text: "Выжить и вернуться с данными", done: false },
    ],
    casualties: { count: 3, note: "члена TWISTEX — Тим Самарас, Пол Самарас, Карл Янг" },
    memorial: "Тим Самарас (1957–2013) — охотник за торнадо, учёный, отец. Его данные спасли тысячи жизней.",
    realPerson: { name: "Тим Самарас", role: "TWISTEX / Погиб", note: "31 мая 2013, Эль-Рено. Вместе с сыном Полом и коллегой Карлом Янгом." },
  },
  {
    id: 5,
    title: "Додж Сити. Последний сезон",
    subtitle: "24 МАЯ 2016 — ФИНАЛ",
    status: "locked",
    difficulty: "Экстремальная",
    reward: "6000 XP",
    image: HERO_IMG,
    date: "24 мая 2016 / Додж-Сити, Кэнсас",
    ef: "EF-3",
    realEvent: true,
    description: "Фотографический торнадо, окружённый грозовыми облаками. Один из самых фотографируемых в истории. Твой последний выезд сезона — после Эль-Рено ты работаешь иначе.",
    briefing: "Воронка медленная, предсказуемая. Идеальные условия для науки. Но ты теперь знаешь — предсказуемых торнадо не бывает.",
    objectives: [
      { text: "Поставить три зонда в треугольник", done: false },
      { text: "Получить полный профиль ветра воронки", done: false },
      { text: "Выйти из зоны до темноты", done: false },
    ],
    casualties: null,
    memorial: null,
  },
];

// ===================== GARAGE CONSTRUCTOR =====================

// Базовые машины (обычные, не перехватчики)
const BASE_CARS = [
  {
    id: "f250",
    name: "Ford F-250",
    year: 2008,
    type: "Пикап",
    baseArmor: 10,
    baseSpeed: 75,
    baseHandling: 60,
    baseWeight: 3200,
    price: "Базовая",
    image: WORKSHOP_IMG,
    desc: "Рабочая лошадка. Мощная рама, доступные запчасти. Стандарт охотников за торнадо.",
  },
  {
    id: "suburban",
    name: "Chevy Suburban",
    year: 2010,
    type: "Внедорожник",
    baseArmor: 12,
    baseSpeed: 68,
    baseHandling: 55,
    baseWeight: 2900,
    price: "Базовая",
    image: WORKSHOP_IMG,
    desc: "Просторный салон для оборудования. Устойчивее на трассе. Выбор команд с большим снаряжением.",
  },
  {
    id: "hummer",
    name: "Hummer H2",
    year: 2006,
    type: "Военный внедорожник",
    baseArmor: 25,
    baseSpeed: 58,
    baseHandling: 45,
    baseWeight: 4100,
    price: "Базовая",
    image: WORKSHOP_IMG,
    desc: "Тяжёлый. Медленный. Живёт где угодно. Если торнадо тебя достанет — ты хотя бы выживешь.",
  },
];

// Категории модификаций
const MOD_CATEGORIES = [
  {
    id: "armor",
    label: "Бронирование",
    icon: "Shield",
    description: "Защита кузова от debris — камней, металла, дерева летящего на 300+ км/ч",
    mods: [
      { id: "none", name: "Без брони", desc: "Заводской кузов", armorDelta: 0, speedDelta: 0, weightDelta: 0, level: 0 },
      { id: "steel_3mm", name: "Сталь 3мм", desc: "Листы стали на двери и крышу. Дёшево, тяжело.", armorDelta: 20, speedDelta: -8, weightDelta: 400, level: 1 },
      { id: "steel_8mm", name: "Сталь 8мм", desc: "Профессиональное бронирование. Выдерживает 2х4 на 200 км/ч.", armorDelta: 40, speedDelta: -15, weightDelta: 900, level: 2 },
      { id: "ar500", name: "AR500 + кевлар", desc: "Баллистическая броня. TIV-2 был обшит именно так.", armorDelta: 65, speedDelta: -22, weightDelta: 1400, level: 3 },
    ],
  },
  {
    id: "anchor",
    label: "Заземление / Якорь",
    icon: "Anchor",
    description: "Система удержания машины при ветре 400+ км/ч. Без неё тебя просто унесёт.",
    mods: [
      { id: "none", name: "Без якоря", desc: "Смерть при EF-4+", armorDelta: 0, speedDelta: 0, weightDelta: 0, level: 0 },
      { id: "sandbags", name: "Мешки с песком", desc: "+500 кг в кузов. Кустарный метод. Работает до EF-3.", armorDelta: 5, speedDelta: -12, weightDelta: 500, level: 1 },
      { id: "hydraulic_spikes", name: "Гидравлические шипы", desc: "4 стальных шипа в асфальт при активации. Как у TIV.", armorDelta: 15, speedDelta: -5, weightDelta: 250, level: 2 },
      { id: "dominator_system", name: "Система Dominator", desc: "Полная якорная плита + прижим кузова к земле. Максимум защиты.", armorDelta: 25, speedDelta: -3, weightDelta: 180, level: 3 },
    ],
  },
  {
    id: "engine",
    label: "Двигатель",
    icon: "Zap",
    description: "Скорость важна — торнадо движутся до 90 км/ч. Иногда нужно убегать.",
    mods: [
      { id: "stock", name: "Стоковый", desc: "Заводской мотор", armorDelta: 0, speedDelta: 0, weightDelta: 0, level: 0 },
      { id: "tuned", name: "Доработанный V8", desc: "+80 л.с. Тюнинг топлива и турбо. Достаточно для побега.", armorDelta: 0, speedDelta: 12, weightDelta: 30, level: 1 },
      { id: "supercharged", name: "Supercharged 6.7L", desc: "600 л.с. Догонишь и убежишь от любой воронки.", armorDelta: 0, speedDelta: 22, weightDelta: 60, level: 2 },
      { id: "racing", name: "Полный рейсинг", desc: "800+ л.с. Класс Reed Timmer. Быстрее торнадо на прямой.", armorDelta: 0, speedDelta: 35, weightDelta: -50, level: 3 },
    ],
  },
  {
    id: "sensors",
    label: "Научное оборудование",
    icon: "Radio",
    description: "Данные — цель экспедиции. Без приборов ты просто турист.",
    mods: [
      { id: "none", name: "Без оборудования", desc: "Просто едешь смотреть", armorDelta: 0, speedDelta: 0, weightDelta: 0, level: 0 },
      { id: "basic", name: "Базовый метеодатчик", desc: "Температура, давление, влажность. Минимум для науки.", armorDelta: 0, speedDelta: -2, weightDelta: 40, level: 1 },
      { id: "twistex_probe", name: "Зонд-черепаха TWISTEX", desc: "Прибор Тима Самараса. Ставится прямо на пути воронки.", armorDelta: 0, speedDelta: -3, weightDelta: 80, level: 2 },
      { id: "doppler", name: "Мобильный доплер", desc: "Радар на крыше. Полная карта воронки в реальном времени.", armorDelta: 0, speedDelta: -5, weightDelta: 150, level: 3 },
    ],
  },
  {
    id: "windows",
    label: "Остекление / Люк",
    icon: "Eye",
    description: "Обычное стекло разлетается от камня. Видимость vs безопасность.",
    mods: [
      { id: "stock", name: "Стоковое стекло", desc: "Разлетится от кирпича", armorDelta: 0, speedDelta: 0, weightDelta: 0, level: 0 },
      { id: "lexan", name: "Поликарбонат 10мм", desc: "Прозрачный, прочный. Не разлетается при ударе.", armorDelta: 10, speedDelta: 0, weightDelta: 60, level: 1 },
      { id: "armored_glass", name: "Бронестекло 25мм", desc: "Пуленепробиваемое. Выдержит 2х4 на 400 км/ч.", armorDelta: 20, speedDelta: -2, weightDelta: 120, level: 2 },
      { id: "steel_shutters", name: "Стальные ставни + смотровые щели", desc: "Как у Reed Timmer. Полное закрытие при входе в воронку.", armorDelta: 35, speedDelta: -4, weightDelta: 200, level: 3 },
    ],
  },
];

type Section = "hero" | "campaign" | "garage";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [selectedMission, setSelectedMission] = useState(1);
  const [heroVisible, setHeroVisible] = useState(false);
  const [windSpeed, setWindSpeed] = useState(247);
  const [dustCount] = useState(() => Array.from({ length: 12 }, (_, i) => i));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Garage state
  const [selectedCar, setSelectedCar] = useState(0);
  const [selectedMods, setSelectedMods] = useState<Record<string, string>>({
    armor: "none",
    anchor: "none",
    engine: "stock",
    sensors: "none",
    windows: "stock",
  });
  const [activeBuildTab, setActiveBuildTab] = useState("armor");
  const [buildSaved, setBuildSaved] = useState(false);

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

  // Compute final vehicle stats
  const car = BASE_CARS[selectedCar];
  const computedStats = MOD_CATEGORIES.reduce(
    (acc, cat) => {
      const modId = selectedMods[cat.id];
      const mod = cat.mods.find(m => m.id === modId);
      if (mod) {
        acc.armor += mod.armorDelta;
        acc.speed += mod.speedDelta;
        acc.weight += mod.weightDelta;
      }
      return acc;
    },
    { armor: car.baseArmor, speed: car.baseSpeed, weight: car.baseWeight }
  );
  const handling = Math.max(5, car.baseHandling - Math.floor((computedStats.weight - car.baseWeight) / 100));

  // Survival rating
  const survivalScore = Math.min(100, Math.round(
    computedStats.armor * 0.45 +
    Math.max(0, computedStats.speed - 50) * 0.3 +
    handling * 0.15 +
    (selectedMods.sensors !== "none" ? 10 : 0)
  ));

  const getSurvivalLabel = () => {
    if (survivalScore >= 80) return { label: "ПЕРЕХВАТЧИК ГОТОВ", color: "text-green-400" };
    if (survivalScore >= 60) return { label: "РИСКОВАННО", color: "text-yellow-400" };
    if (survivalScore >= 40) return { label: "ОПАСНО", color: "text-orange-400" };
    return { label: "ВЕРНАЯ СМЕРТЬ", color: "text-red-500" };
  };

  const mission = MISSIONS.find(m => m.id === selectedMission)!;
  const activeCatData = MOD_CATEGORIES.find(c => c.id === activeBuildTab)!;

  const nav = [
    { id: "hero" as Section, label: "ГЛАВНАЯ", icon: "Home" },
    { id: "campaign" as Section, label: "КАМПАНИЯ", icon: "Map" },
    { id: "garage" as Section, label: "ГАРАЖ", icon: "Wrench" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "linear-gradient(to bottom, rgba(10,7,5,0.97) 0%, transparent 100%)", backdropFilter: "blur(8px)" }}>
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
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 ${activeSection === item.id ? "text-orange-400" : "text-stone-500 hover:text-stone-300"}`}
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", fontWeight: 500 }}>
              <Icon name={item.icon} size={14} />
              {item.label}
              {activeSection === item.id && <span className="ml-1 w-1 h-1 rounded-full bg-orange-500 inline-block" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
          <div className="text-stone-500">ВЕТЕР</div>
          <div className="text-orange-400">{windSpeed} КМ/Ч</div>
          <div className="w-px h-4 bg-stone-700" />
          <div className="text-stone-500">СЕЗОН 1995–2016</div>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      {activeSection === "hero" && (
        <section className="relative min-h-screen flex flex-col">
          <div className="absolute inset-0 overflow-hidden">
            <img src={HERO_IMG} alt="Tornado" className="w-full h-full object-cover animate-tornado-spin"
              style={{ transformOrigin: "60% 40%", filter: "saturate(0.8) brightness(0.55)" }} />
            <div className="bg-storm-overlay absolute inset-0" />
            <div className="absolute inset-0 animate-lightning" style={{ background: "rgba(180,160,100,0.08)" }} />
            {dustCount.map(i => (
              <div key={i} className="absolute w-1 h-1 rounded-full"
                style={{ left: `${15 + (i * 7) % 70}%`, bottom: `${10 + (i * 11) % 30}%`, background: "rgba(220,120,40,0.5)",
                  animation: `dust-particle ${2 + i * 0.3}s linear infinite`, animationDelay: `${i * 0.4}s` }} />
            ))}
          </div>

          <div className={`absolute top-24 left-8 transition-all duration-1000 ${heroVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="hud-border p-3 mb-2" style={{ width: 200 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>КООРДИНАТЫ</div>
              <div className="text-sm text-orange-300 animate-flicker" style={{ fontFamily: "monospace" }}>35.5514°N / 98.0150°W</div>
            </div>
            <div className="hud-border p-3" style={{ width: 200 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>ЭЛЬ-РЕНО, ОКЛАХОМА</div>
              <div className="text-gradient-fire text-2xl" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.1em" }}>EF-5 ▲ 4.2КМ</div>
            </div>
          </div>

          <div className={`absolute top-24 right-8 text-right transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="hud-border p-3 mb-2" style={{ width: 200 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>31 МАЯ 2013 / 18:34</div>
              <div className="text-red-400 text-sm animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em" }}>
                ТИМ САМАРАС ПОГИБ
              </div>
            </div>
            <div className="hud-border p-3" style={{ width: 200 }}>
              <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>СКОРОСТЬ ВЕТРА</div>
              <div className="text-orange-400 text-xl animate-flicker" style={{ fontFamily: "'Bebas Neue', cursive" }}>{windSpeed} КМ/Ч</div>
            </div>
          </div>

          <div className={`relative z-10 flex flex-col items-start justify-end min-h-screen px-12 pb-20 transition-all duration-1200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="mb-3 flex items-center gap-3">
              <div className="w-12 h-px" style={{ background: "hsl(28,85%,52%)" }} />
              <span className="text-orange-400 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.25em" }}>
                ОСНОВАНО НА РЕАЛЬНЫХ СОБЫТИЯХ 1995–2016
              </span>
            </div>
            <h1 className="text-gradient-fire mb-4 leading-none"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(72px,10vw,140px)", letterSpacing: "0.04em" }}>
              TORNADO<br />CHASER
            </h1>
            <p className="text-stone-300 max-w-xl text-base mb-2 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 }}>
              Пройди путь от любителя до профессионала рядом с Тимом Самарасом и командой TWISTEX.
              Будь рядом в тот день, когда Эль-Рено убил лучших из нас.
            </p>
            <p className="text-stone-600 text-xs mb-8 italic" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Посвящается Тиму Самарасу, Полу Самарасу и Карлу Янгу. 31 мая 2013.
            </p>
            <div className="flex items-center gap-4">
              <button className="btn-storm px-8 py-3 text-sm" onClick={() => setActiveSection("campaign")}>
                ▶ НАЧАТЬ КАМПАНИЮ
              </button>
              <button className="btn-outline-storm px-8 py-3 text-sm" onClick={() => setActiveSection("garage")}>
                🔧 СОБРАТЬ ПЕРЕХВАТЧИК
              </button>
            </div>
            <div className="flex items-center gap-8 mt-12 pt-6 border-t border-stone-800">
              {[
                { label: "РЕАЛЬНЫХ СОБЫТИЙ", value: "5" },
                { label: "ЛЕТ ИСТОРИИ", value: "21" },
                { label: "ПОГИБШИХ ОХОТНИКОВ", value: "3" },
                { label: "РЕКОРД ШИРИНЫ", value: "4.2КМ" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-gradient-fire text-3xl" style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>{stat.value}</div>
                  <div className="text-stone-600 text-xs mt-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== CAMPAIGN ===================== */}
      {activeSection === "campaign" && (
        <section className="min-h-screen pt-20 px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8 pt-8">
              <div>
                <div className="text-orange-500 text-xs mb-2" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.25em" }}>ОСНОВАНО НА РЕАЛЬНЫХ СОБЫТИЯХ</div>
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, letterSpacing: "0.05em", lineHeight: 1 }}>ХРОНИКА ОХОТНИКОВ</h2>
              </div>
              <div className="flex items-center gap-6 pb-2">
                <div className="text-center">
                  <div className="text-orange-400 text-2xl" style={{ fontFamily: "'Bebas Neue', cursive" }}>1995–2016</div>
                  <div className="text-stone-500 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>ПЕРИОД СОБЫТИЙ</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Mission list */}
              <div className="col-span-4 space-y-2">
                {MISSIONS.map(m => (
                  <div key={m.id}
                    className={`mission-card p-4 ${selectedMission === m.id ? "active" : ""} ${m.status === "locked" ? "opacity-50" : ""}`}
                    onClick={() => m.status !== "locked" && setSelectedMission(m.id)}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 pr-2">
                        <div className="text-xs mb-1 flex items-center gap-2" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em" }}>
                          <span className="text-orange-500">{m.subtitle}</span>
                          {m.realEvent && (
                            <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)", color: "#fca5a5", fontSize: 9 }}>
                              РЕАЛ
                            </span>
                          )}
                          {m.isTragedy && (
                            <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(220,38,38,0.35)", border: "1px solid rgba(220,38,38,0.6)", color: "#f87171", fontSize: 9 }}>
                              ✝ ТРАГЕДИЯ
                            </span>
                          )}
                        </div>
                        <div className="text-stone-200 text-sm font-medium" style={{ fontFamily: "'Oswald', sans-serif" }}>{m.title}</div>
                      </div>
                      <div>
                        {m.status === "completed" && <Icon name="CheckCircle" size={15} className="text-green-500" />}
                        {m.status === "active" && <Icon name="Play" size={15} className="text-orange-400" />}
                        {m.status === "locked" && <Icon name="Lock" size={15} className="text-stone-600" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-sm" style={{ fontFamily: "'Oswald', sans-serif", background: "rgba(220,120,40,0.12)", color: "hsl(38,90%,60%)", fontSize: 10 }}>
                        {m.ef}
                      </span>
                      <span className="text-xs text-stone-600" style={{ fontFamily: "'Oswald', sans-serif" }}>{m.date.split(" / ")[1]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mission detail */}
              <div className="col-span-8">
                <div className="card-storm rounded-sm overflow-hidden" style={{ minHeight: 540 }}>
                  {/* Image header */}
                  <div className="relative h-52 overflow-hidden scan-effect">
                    <img src={mission.image} alt={mission.title} className="w-full h-full object-cover"
                      style={{ filter: `saturate(0.5) brightness(${mission.isTragedy ? 0.35 : 0.45})`, objectPosition: "center 30%" }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(15,10,7,0.97) 100%)" }} />

                    {/* Tragedy overlay */}
                    {mission.isTragedy && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-red-500 text-xs mb-1 animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.3em" }}>
                            ✝ ПОГИБЛИ 31 МАЯ 2013
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="text-stone-500 text-xs mb-1 animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em" }}>
                        {mission.date}
                      </div>
                      <h3 className={mission.isTragedy ? "text-red-400" : "text-gradient-fire"}
                        style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 38, letterSpacing: "0.04em", lineHeight: 1 }}>
                        {mission.title}
                      </h3>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <div className="px-2 py-1 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em",
                        background: "rgba(220,120,40,0.2)", border: "1px solid rgba(220,120,40,0.4)", color: "hsl(38,90%,65%)" }}>
                        {mission.ef}
                      </div>
                      {mission.realEvent && (
                        <div className="px-2 py-1 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em",
                          background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)", color: "#fca5a5" }}>
                          РЕАЛЬНОЕ СОБЫТИЕ
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Real person */}
                    {mission.realPerson && (
                      <div className="flex items-start gap-3 p-3 mb-4 rounded-sm"
                        style={{ background: "rgba(220,120,40,0.06)", border: "1px solid rgba(220,120,40,0.2)" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(220,120,40,0.2)", border: "1px solid rgba(220,120,40,0.4)" }}>
                          <Icon name="User" size={14} className="text-orange-400" />
                        </div>
                        <div>
                          <div className="text-orange-400 text-xs font-semibold" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>
                            {mission.realPerson.name} — {mission.realPerson.role}
                          </div>
                          <div className="text-stone-400 text-xs mt-0.5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            {mission.realPerson.note}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Briefing */}
                    <div className="mb-3">
                      <div className="text-xs text-orange-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>БРИФИНГ</div>
                      <p className="text-stone-300 text-sm leading-relaxed italic" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, borderLeft: "2px solid rgba(220,120,40,0.4)", paddingLeft: 12 }}>
                        {mission.briefing}
                      </p>
                    </div>

                    <p className="text-stone-500 text-xs mb-4 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      {mission.description}
                    </p>

                    {/* Objectives */}
                    <div className="mb-4">
                      <div className="text-xs text-orange-500 mb-2" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>ЗАДАЧИ</div>
                      <div className="space-y-1.5">
                        {mission.objectives.map((obj, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 ${obj.done ? "bg-green-800 border-green-600" : "border border-stone-700"}`}>
                              {obj.done && <Icon name="Check" size={10} className="text-green-400" />}
                            </div>
                            <span className={`text-xs ${obj.done ? "text-stone-600 line-through" : "text-stone-300"}`}
                              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{obj.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Casualties */}
                    {mission.casualties && (
                      <div className="p-3 mb-4 rounded-sm"
                        style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)" }}>
                        <div className="flex items-center gap-2">
                          <Icon name="AlertTriangle" size={14} className="text-red-400 flex-shrink-0" />
                          <div>
                            <div className="text-red-400 text-xs font-semibold" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>
                              {mission.casualties.count} {mission.casualties.note}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Memorial */}
                    {mission.memorial && (
                      <div className="p-3 mb-4 rounded-sm"
                        style={{ background: "rgba(100,100,120,0.1)", border: "1px solid rgba(150,150,180,0.2)" }}>
                        <div className="text-stone-400 text-xs italic" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                          ✝ {mission.memorial}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-stone-500" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>НАГРАДА</div>
                      <div className="text-orange-400" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22 }}>{mission.reward}</div>
                    </div>

                    <div className="flex gap-3">
                      {mission.status !== "locked" ? (
                        <button className={mission.isTragedy
                          ? "flex-1 py-3 text-sm border border-red-800/50 text-red-400 hover:border-red-600 transition-all duration-200"
                          : "btn-storm flex-1 py-3 text-sm"}
                          style={!mission.isTragedy ? {} : { fontFamily: "'Oswald', sans-serif", letterSpacing: "0.12em", background: "rgba(220,38,38,0.1)" }}>
                          {mission.status === "completed" ? "▶ ПРОЙТИ СНОВА" : mission.isTragedy ? "▶ ВОЙТИ В СОБЫТИЕ" : "▶ НАЧАТЬ МИССИЮ"}
                        </button>
                      ) : (
                        <button className="btn-outline-storm flex-1 py-3 text-sm opacity-50 cursor-not-allowed" disabled>🔒 ЗАБЛОКИРОВАНО</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== GARAGE — CONSTRUCTOR ===================== */}
      {activeSection === "garage" && (
        <section className="min-h-screen pt-20 px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6 pt-8">
              <div>
                <div className="text-orange-500 text-xs mb-2" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.25em" }}>
                  КОНСТРУКТОР ПЕРЕХВАТЧИКА
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, letterSpacing: "0.05em", lineHeight: 1 }}>ГАРАЖ</h2>
                <p className="text-stone-500 text-xs mt-1" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Начни с обычной машины. Собери перехватчик.
                </p>
              </div>
              <div className="flex items-center gap-3 pb-2">
                <div className={`text-2xl ${getSurvivalLabel().color}`} style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
                  {getSurvivalLabel().label}
                </div>
                <button
                  className={`btn-storm px-5 py-2 text-sm ${buildSaved ? "opacity-60" : ""}`}
                  onClick={() => { setBuildSaved(true); setTimeout(() => setBuildSaved(false), 2000); }}>
                  {buildSaved ? "✓ СОХРАНЕНО" : "СОХРАНИТЬ СБОРКУ"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-5">

              {/* === LEFT: Базовая машина + итоговые характеристики === */}
              <div className="col-span-4 space-y-4">

                {/* Выбор базовой машины */}
                <div className="card-storm rounded-sm p-4">
                  <div className="text-xs text-orange-500 mb-3" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>
                    ШАГ 1 — БАЗОВАЯ МАШИНА
                  </div>
                  <div className="space-y-2">
                    {BASE_CARS.map((c, i) => (
                      <div key={c.id}
                        onClick={() => setSelectedCar(i)}
                        className={`p-3 rounded-sm cursor-pointer transition-all duration-200 ${selectedCar === i
                          ? "border border-orange-500/60"
                          : "border border-stone-800 hover:border-stone-600"
                        }`}
                        style={{ background: selectedCar === i ? "rgba(194,65,12,0.15)" : "rgba(15,10,7,0.5)" }}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-stone-200" style={{ fontFamily: "'Oswald', sans-serif" }}>{c.name} '{String(c.year).slice(2)}</div>
                          <div className="text-xs px-2 py-0.5 rounded-sm" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em",
                            background: "rgba(220,120,40,0.12)", color: "hsl(38,90%,60%)" }}>
                            {c.type}
                          </div>
                        </div>
                        <div className="text-xs text-stone-500 leading-tight" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{c.desc}</div>
                        <div className="flex gap-3 mt-2">
                          {[
                            { l: "БРН", v: c.baseArmor },
                            { l: "СКР", v: c.baseSpeed },
                            { l: "УПР", v: c.baseHandling },
                          ].map(s => (
                            <div key={s.l} className="text-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
                              <span className="text-stone-600">{s.l} </span>
                              <span className="text-stone-400">{s.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Итоговые характеристики */}
                <div className="card-storm rounded-sm p-4">
                  <div className="text-xs text-orange-500 mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>
                    ИТОГОВЫЕ ХАРАКТЕРИСТИКИ
                  </div>

                  {/* Survival rating */}
                  <div className="mb-4 p-3 rounded-sm text-center" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(220,120,40,0.2)" }}>
                    <div className="text-xs text-stone-500 mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>ШАНС ВЫЖИТЬ В EF-5</div>
                    <div className={`text-4xl ${getSurvivalLabel().color}`} style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>
                      {survivalScore}%
                    </div>
                    <div className="mt-2">
                      <div className="status-bar">
                        <div className="status-bar-fill transition-all duration-500" style={{ width: `${survivalScore}%`,
                          background: survivalScore >= 70 ? "linear-gradient(90deg,#16a34a,#4ade80)" :
                            survivalScore >= 45 ? "linear-gradient(90deg,hsl(28,85%,42%),hsl(38,90%,55%))" :
                              "linear-gradient(90deg,#991b1b,#ef4444)" }} />
                      </div>
                    </div>
                  </div>

                  {[
                    { label: "БРОНЯ", value: Math.min(100, computedStats.armor), icon: "Shield", base: car.baseArmor, color: "hsl(38,90%,55%)" },
                    { label: "СКОРОСТЬ", value: Math.min(100, computedStats.speed), icon: "Gauge", base: car.baseSpeed, color: "hsl(38,90%,55%)" },
                    { label: "УПРАВЛЕНИЕ", value: Math.min(100, handling), icon: "Navigation", base: car.baseHandling, color: "hsl(38,90%,55%)" },
                  ].map(stat => (
                    <div key={stat.label} className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon name={stat.icon} size={11} className="text-orange-600" />
                          <span className="text-xs text-stone-400" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>{stat.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-600" style={{ fontFamily: "'Oswald', sans-serif" }}>{stat.base}</span>
                          <Icon name="ArrowRight" size={10} className="text-stone-700" />
                          <span className={`text-sm ${stat.value > stat.base ? "text-orange-400" : stat.value < stat.base ? "text-red-400" : "text-stone-400"}`}
                            style={{ fontFamily: "'Bebas Neue', cursive" }}>{stat.value}</span>
                        </div>
                      </div>
                      <div className="status-bar">
                        <div className="status-bar-fill" style={{ width: `${stat.value}%` }} />
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-800">
                    <div className="text-xs text-stone-500" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em" }}>
                      МАССА
                    </div>
                    <div className="text-orange-300 text-sm" style={{ fontFamily: "'Bebas Neue', cursive" }}>
                      {(computedStats.weight + car.baseWeight - car.baseWeight).toLocaleString()} КГ
                    </div>
                  </div>
                </div>

                {/* Preview image */}
                <div className="card-storm rounded-sm overflow-hidden">
                  <div className="relative h-32">
                    <img src={WORKSHOP_IMG} alt="Workshop" className="w-full h-full object-cover"
                      style={{ filter: "saturate(0.5) brightness(0.4)" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-stone-400 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>{car.name}</div>
                        <div className="text-orange-500 text-xs mt-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                          {Object.values(selectedMods).filter(v => v !== "none" && v !== "stock").length} МОДИФИКАЦИЙ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* === RIGHT: Категории модификаций === */}
              <div className="col-span-8">
                <div className="text-xs text-orange-500 mb-3" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>
                  ШАГ 2 — ВЫБЕРИ МОДИФИКАЦИИ
                </div>

                {/* Category tabs */}
                <div className="flex gap-1 mb-4 flex-wrap">
                  {MOD_CATEGORIES.map(cat => {
                    const currentMod = cat.mods.find(m => m.id === selectedMods[cat.id]);
                    const isModified = currentMod && currentMod.level > 0;
                    return (
                      <button key={cat.id}
                        onClick={() => setActiveBuildTab(cat.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs transition-all duration-200 rounded-sm ${
                          activeBuildTab === cat.id
                            ? "border border-orange-500/60 text-orange-300"
                            : "border border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-300"
                        }`}
                        style={{
                          fontFamily: "'Oswald', sans-serif",
                          letterSpacing: "0.05em",
                          background: activeBuildTab === cat.id ? "rgba(194,65,12,0.2)" : "transparent"
                        }}>
                        <Icon name={cat.icon} size={12} />
                        {cat.label}
                        {isModified && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active category */}
                <div className="card-storm rounded-sm p-5">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(220,120,40,0.15)", border: "1px solid rgba(220,120,40,0.3)" }}>
                      <Icon name={activeCatData.icon} size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="text-stone-200 font-medium" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em" }}>
                        {activeCatData.label.toUpperCase()}
                      </div>
                      <div className="text-stone-500 text-xs mt-0.5 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        {activeCatData.description}
                      </div>
                    </div>
                  </div>

                  {/* Mod options */}
                  <div className="grid grid-cols-2 gap-3">
                    {activeCatData.mods.map(mod => {
                      const isSelected = selectedMods[activeBuildTab] === mod.id;
                      const levelColors = ["text-stone-500", "text-yellow-500", "text-orange-400", "text-red-400"];
                      const levelLabels = ["БАЗОВЫЙ", "УРОВЕНЬ I", "УРОВЕНЬ II", "УРОВЕНЬ III"];
                      return (
                        <div key={mod.id}
                          onClick={() => setSelectedMods(prev => ({ ...prev, [activeBuildTab]: mod.id }))}
                          className={`p-4 rounded-sm cursor-pointer transition-all duration-200 ${isSelected
                            ? "border border-orange-500/70"
                            : "border border-stone-800 hover:border-stone-600"
                          }`}
                          style={{ background: isSelected ? "rgba(194,65,12,0.18)" : "rgba(15,10,7,0.6)" }}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm font-medium" style={{ fontFamily: "'Oswald', sans-serif", color: isSelected ? "hsl(38,90%,70%)" : "hsl(0,0%,75%)" }}>
                              {mod.name}
                            </div>
                            {isSelected && <Icon name="CheckCircle" size={14} className="text-orange-400 flex-shrink-0" />}
                          </div>
                          <div className={`text-xs mb-3 ${levelColors[mod.level]}`} style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>
                            {levelLabels[mod.level]}
                          </div>
                          <div className="text-xs text-stone-500 mb-3 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            {mod.desc}
                          </div>

                          {/* Deltas */}
                          <div className="flex gap-3 pt-2 border-t border-stone-800">
                            {mod.armorDelta !== 0 && (
                              <div className="text-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                <span className="text-stone-600">БРН </span>
                                <span className={mod.armorDelta > 0 ? "text-green-400" : "text-red-400"}>
                                  {mod.armorDelta > 0 ? "+" : ""}{mod.armorDelta}
                                </span>
                              </div>
                            )}
                            {mod.speedDelta !== 0 && (
                              <div className="text-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                <span className="text-stone-600">СКР </span>
                                <span className={mod.speedDelta > 0 ? "text-green-400" : "text-red-400"}>
                                  {mod.speedDelta > 0 ? "+" : ""}{mod.speedDelta}
                                </span>
                              </div>
                            )}
                            {mod.weightDelta !== 0 && (
                              <div className="text-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                <span className="text-stone-600">МАС </span>
                                <span className={mod.weightDelta > 0 ? "text-orange-400" : "text-green-400"}>
                                  {mod.weightDelta > 0 ? "+" : ""}{mod.weightDelta}кг
                                </span>
                              </div>
                            )}
                            {mod.armorDelta === 0 && mod.speedDelta === 0 && mod.weightDelta === 0 && (
                              <span className="text-xs text-stone-700" style={{ fontFamily: "'Oswald', sans-serif" }}>— без изменений</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Build summary */}
                <div className="mt-4 p-4 rounded-sm" style={{ background: "rgba(220,120,40,0.05)", border: "1px solid rgba(220,120,40,0.15)" }}>
                  <div className="text-xs text-stone-500 mb-3" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em" }}>СБОРКА</div>
                  <div className="flex flex-wrap gap-2">
                    {MOD_CATEGORIES.map(cat => {
                      const modId = selectedMods[cat.id];
                      const mod = cat.mods.find(m => m.id === modId);
                      const isBase = mod && mod.level === 0;
                      return (
                        <div key={cat.id} className="flex items-center gap-2 px-2 py-1 rounded-sm"
                          style={{ background: isBase ? "rgba(50,50,50,0.3)" : "rgba(220,120,40,0.12)", border: `1px solid ${isBase ? "rgba(80,80,80,0.3)" : "rgba(220,120,40,0.3)"}` }}>
                          <Icon name={cat.icon} size={10} className={isBase ? "text-stone-600" : "text-orange-500"} />
                          <span className={`text-xs ${isBase ? "text-stone-600" : "text-orange-300"}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                            {mod?.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tip about Samara's build */}
                  {survivalScore < 60 && (
                    <div className="mt-3 flex items-start gap-2 p-2 rounded-sm" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
                      <Icon name="AlertTriangle" size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-stone-500" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        На Эль-Рено даже у TWISTEX не хватило защиты. Добавь бронирование и якорную систему — это не игра в шансы.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-2 border-t border-stone-900"
        style={{ background: "rgba(10,7,5,0.92)", backdropFilter: "blur(8px)" }}>
        <div className="flex items-center gap-6">
          {[
            { label: "XP", value: "3,600", color: "text-orange-400" },
            { label: "РАНГ", value: "ОХОТНИК", color: "text-stone-300" },
            { label: "ПЕРЕХВАТЧИК", value: `${car.name} / ${getSurvivalLabel().label}`, color: getSurvivalLabel().color },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-xs text-stone-600" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>{item.label}</span>
              <span className={`text-xs font-semibold ${item.color}`} style={{ fontFamily: "'Oswald', sans-serif" }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-stone-700 animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em" }}>
          ✝ В ПАМЯТЬ ТИМ САМАРАС / ПОЛ САМАРАС / КАРЛ ЯНГ — 31.05.2013
        </div>
      </div>
    </div>
  );
}