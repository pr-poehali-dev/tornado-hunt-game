import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ─── типы ────────────────────────────────────────────────────────────────────

export interface VehicleStats {
  armor: number;      // 0–100
  speed: number;      // 0–100
  handling: number;   // 0–100
  hasProbe: boolean;
  hasAnchor: boolean;
}

interface Choice {
  text: string;
  /** требования к машине — если не выполнено, вариант недоступен */
  requires?: { stat: keyof VehicleStats; min?: number; flag?: boolean };
  /** подсказка почему недоступно */
  requiresHint?: string;
  /** числовые дельты к таймеру (секунды), урон (0-100), опыт */
  timeDelta?: number;
  damageDelta?: number;
  xpDelta?: number;
  /** следующий beat */
  next: string;
}

interface Beat {
  id: string;
  /** текст от первого лица, атмосферный */
  text: string;
  /** опциональная мета-строка (время, место, статус датчиков) */
  hud?: string;
  /** подсвеченное слово опасности */
  danger?: string;
  choices?: Choice[];
  /** если нет choices — авто-переход через N секунд */
  autoNext?: string;
  autoDelay?: number;
  /** финальный beat: survived / dead / memorial */
  outcome?: "survived" | "dead" | "memorial";
  outcomeText?: string;
}

interface MissionDef {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  ef: string;
  image: string;
  isTragedy?: boolean;
  startBeat: string;
  beats: Record<string, Beat>;
}

// ─── изображения ──────────────────────────────────────────────────────────────

const HERO_IMG   = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/9d2c028e-bad3-4453-b5c1-646a85a311ae.jpg";
const TWISTEX_IMG= "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/4f98fa32-5f0a-470c-a072-6796768904a9.jpg";
const ELRENO_IMG = "https://cdn.poehali.dev/projects/1a2e690e-2c64-40c3-8b34-f39bce441128/files/47fbd523-0031-467d-ae0b-8e570dfc1eb7.jpg";

// ─── все 5 миссий ─────────────────────────────────────────────────────────────

export const MISSION_DEFS: MissionDef[] = [

  // ══ МИССИЯ 1 ══════════════════════════════════════════════════════════════
  {
    id: 1,
    title: "Балджер, Техас",
    subtitle: "1995 — ПЕРВЫЙ СЕЗОН",
    date: "15 мая 1995",
    ef: "EF-3",
    image: HERO_IMG,
    startBeat: "m1_start",
    beats: {
      m1_start: {
        id: "m1_start",
        text: "Шесть утра. Ты стоишь у своего Ford Ranger у обочины Шоссе 60. Небо на западе — зелёное. Это не нормально. Рация трещит: NWS выпустил предупреждение о торнадо для округа Пармер. Твой анемометр на крыше болтается в порывах ветра. Первый выезд. Руки дрожат.",
        hud: "15 МАЯ 1995 / 06:14 / БАЛДЖЕР, ТЕХАС",
        choices: [
          { text: "Двигаться на запад — к шторму", timeDelta: 0, xpDelta: 10, next: "m1_west" },
          { text: "Сначала позвонить в NWS за данными", timeDelta: -5, xpDelta: 5, next: "m1_call" },
          { text: "Подождать — пусть воронка проявится", timeDelta: -15, xpDelta: 0, next: "m1_wait" },
        ],
      },
      m1_call: {
        id: "m1_call",
        text: "Диспетчер NWS говорит коротко: «EF-2 подтверждён, движется на NNE, 48 км/ч. Будьте осторожны». Ты записываешь координаты. Это даёт тебе преимущество.",
        hud: "06:19 / РАДИО — NWS АМАРИЛЛО",
        autoNext: "m1_west",
        autoDelay: 3,
      },
      m1_wait: {
        id: "m1_wait",
        text: "Через 20 минут воронка уже касается земли в 4 км от тебя. Слишком близко для начала. Ты теряешь позицию.",
        hud: "06:34 / ВОРОНКА В 4 КМ",
        danger: "СЛИШКОМ БЛИЗКО",
        autoNext: "m1_west",
        autoDelay: 3,
      },
      m1_west: {
        id: "m1_west",
        text: "Ты едешь по грунтовке параллельно шторму. В зеркале — тёмно-серая колонна, она касается земли. Сердце колотится. Радио молчит. Нужно поставить зонд — анемометр на треноге — прямо на пути воронки. У тебя есть время. Где ставить?",
        hud: "06:41 / ВОРОНКА В 2.1 КМ / ДВИЖЕНИЕ NNE",
        choices: [
          { text: "На грунтовке прямо перед воронкой — максимальные данные", timeDelta: 0, damageDelta: 20, xpDelta: 40, next: "m1_probe_risky" },
          { text: "В 600м от траектории — безопаснее, данные хуже", timeDelta: 0, damageDelta: 5, xpDelta: 20, next: "m1_probe_safe" },
          { text: "Не ставить зонд — сначала убедиться что выживешь", timeDelta: 0, damageDelta: 0, xpDelta: 5, next: "m1_no_probe" },
        ],
      },
      m1_probe_risky: {
        id: "m1_probe_risky",
        text: "Ты выскакиваешь из машины. 90 секунд. Руки не слушаются, тренога падает. Ветер уже воет — 80 км/ч. Зонд встал. Ты прыгаешь в кабину и давишь газ. В зеркале — воронка проходит точно по твоему зонду. Он унесён в небо. Но данные записались.",
        hud: "06:48 / ЗОНД РАЗВЁРНУТ / ВОРОНКА В 400М",
        danger: "DEBRIS FLOW",
        autoNext: "m1_escape",
        autoDelay: 4,
      },
      m1_probe_safe: {
        id: "m1_probe_safe",
        text: "Ты ставишь зонд чуть в стороне. Меньше риска, меньше данных. Анемометр фиксирует края воронки — 180 км/ч. Учёные будут довольны.",
        hud: "06:47 / ЗОНД В 600М ОТ ТРАЕКТОРИИ",
        autoNext: "m1_escape",
        autoDelay: 3,
      },
      m1_no_probe: {
        id: "m1_no_probe",
        text: "Ты решаешь не рисковать. Снимаешь на камеру. Данных нет, но ты жив. Для первого раза — нормально.",
        hud: "06:46 / ФОТОСЪЁМКА",
        autoNext: "m1_escape",
        autoDelay: 3,
      },
      m1_escape: {
        id: "m1_escape",
        text: "Воронка обходит тебя справа — в 300 метрах. Машину трясёт. Летит ветка, разбивает зеркало. Потом всё стихает так же резко, как началось. Тишина. Поле изрыто. Ты жив. Сердце колотится 180 ударов в минуту. Это. Было. Настоящим.",
        hud: "07:02 / ВОРОНКА УШЛА / БАЛДЖЕР ЦЕЛ",
        choices: [
          { text: "Выйти и осмотреть место прохода воронки", xpDelta: 15, next: "m1_finish" },
          { text: "Уехать и написать отчёт", xpDelta: 5, next: "m1_finish" },
        ],
      },
      m1_finish: {
        id: "m1_finish",
        text: "Ты возвращаешься домой с первыми данными. Руки ещё дрожат. Ты уже знаешь — это не последний выезд. Это только начало.",
        hud: "09:30 / БАЛДЖЕР / СЕЗОН ОТКРЫТ",
        outcome: "survived",
        outcomeText: "Первая охота завершена. Ты понял одно: торнадо не уважают смельчаков. Они убивают всех без разбора. Только данные, только наука.",
      },
    },
  },

  // ══ МИССИЯ 2 — TWISTEX 2010 ════════════════════════════════════════════════
  {
    id: 2,
    title: "Проект TWISTEX. Кэнсас",
    subtitle: "2010 — С САМАРАСОМ",
    date: "10 мая 2010",
    ef: "EF-2",
    image: TWISTEX_IMG,
    startBeat: "m2_start",
    beats: {
      m2_start: {
        id: "m2_start",
        text: "Тим Самарас смотрит на тебя через стекло своего белого пикапа. «Ты умеешь ставить зонды под давлением?» Ты киваешь. Он кивает в ответ. Вы в команде TWISTEX. Сегодня — операция на шоссе 56. Три зонда-черепахи нужно разложить треугольником перед воронкой. Ты отвечаешь за зонд №3.",
        hud: "10 МАЯ 2010 / 14:22 / HWY-56, КЭНСАС",
        choices: [
          { text: "Спросить Тима про план — куда именно ставить", xpDelta: 10, next: "m2_ask_tim" },
          { text: "Действовать самостоятельно по радару", timeDelta: 5, xpDelta: 5, next: "m2_solo" },
        ],
      },
      m2_ask_tim: {
        id: "m2_ask_tim",
        text: "Тим разворачивает планшет. «Воронка выйдет здесь — видишь изгиб дороги? Твой зонд идёт на 800 метров к северу. Когда поставишь — сразу уходи на восток, не на запад. Понял?» Ты запоминаешь. Это важно.",
        hud: "14:31 / ИНСТРУКТАЖ / ЗОНД №3 — 800М СЕВЕР",
        autoNext: "m2_drive",
        autoDelay: 3,
      },
      m2_solo: {
        id: "m2_solo",
        text: "Ты прокладываешь маршрут по своему радарному приложению. Кажется, что понял траекторию. Тим по радио: «Не забудь — уходить на восток!»",
        hud: "14:29 / САМОСТОЯТЕЛЬНЫЙ РАСЧЁТ",
        autoNext: "m2_drive",
        autoDelay: 3,
      },
      m2_drive: {
        id: "m2_drive",
        text: "Ты мчишься по просёлку. Ветер уже плотный — 60 км/ч постоянный, порывами до 100. Воронка видна — тонкая, изящная, почти красивая. EF-2. Но EF-2 убивают так же легко. Ты у точки. Время на зонд — 2 минуты.",
        hud: "14:44 / ТОЧКА №3 / ВОРОНКА В 1.8КМ",
        choices: [
          { text: "Поставить зонд быстро и уйти на ВОСТОК как сказал Тим", damageDelta: 5, xpDelta: 35, next: "m2_probe_east" },
          { text: "Поставить зонд и уйти на ЗАПАД — там дорога лучше",
            requires: { stat: "speed", min: 80 },
            requiresHint: "Слишком медленная машина — запад не вариант",
            damageDelta: 45, xpDelta: 20, next: "m2_probe_west" },
          { text: "Отступить — воронка идёт быстрее чем думал", damageDelta: 0, xpDelta: 5, next: "m2_retreat" },
        ],
      },
      m2_probe_east: {
        id: "m2_probe_east",
        text: "Зонд встал. Ты уходишь на восток — воронка проходит в 400м слева. Тим по радио: «Зонд №3 пишет. Отличная работа». Данные идут. Черепаха фиксирует 230 км/ч и давление 850 мбар. Это научный прорыв.",
        hud: "14:51 / ЗОНД ПИШЕТ / ДАВЛЕНИЕ 850 МБ",
        autoNext: "m2_rendezvous",
        autoDelay: 4,
      },
      m2_probe_west: {
        id: "m2_probe_west",
        text: "Ты едешь на запад. Воронка неожиданно ускоряется. Debris свистит над капотом — деревянная балка врезается в борт кузова. Машина цела, но страх настоящий. Тим по радио злобно: «Сказал же — восток!»",
        hud: "14:52 / DEBRIS УДАР / БОРТ ПОВРЕЖДЁН",
        danger: "DEBRIS",
        autoNext: "m2_rendezvous",
        autoDelay: 4,
      },
      m2_retreat: {
        id: "m2_retreat",
        text: "Ты не ставишь зонд и уходишь. Воронка проходит прямо по твоей точке. Тим молчит в радио. Ты потерял позицию, данных нет. Разочарование.",
        hud: "14:49 / ОТСТУПЛЕНИЕ / ЗОНД №3 НЕ ПОСТАВЛЕН",
        autoNext: "m2_rendezvous",
        autoDelay: 3,
      },
      m2_rendezvous: {
        id: "m2_rendezvous",
        text: "Команда собирается у разрушенного амбара. Тим разбирает данные на ноутбуке. Карл смотрит в небо. Пол — сын Тима, 24 года — машет тебе рукой. Они смеются. Они живые. Это 2010 год. Ещё три года впереди.",
        hud: "16:20 / БАЗА / КОМАНДА TWISTEX ЦЕЛА",
        choices: [
          { text: "Поговорить с Тимом о его методах", xpDelta: 15, next: "m2_finish" },
          { text: "Записать наблюдения в журнал", xpDelta: 10, next: "m2_finish" },
        ],
      },
      m2_finish: {
        id: "m2_finish",
        text: "Тим говорит: «Мы каждый раз подходим чуть ближе. Наука требует данных изнутри. Однажды мы это сделаем». Ты смотришь на него. На Пола. На Карла. Ты не знаешь, что 31 мая 2013 года этот разговор станет последним, который ты вспомнишь.",
        hud: "17:00 / КЭНСАС / МИССИЯ ЗАВЕРШЕНА",
        outcome: "survived",
        outcomeText: "TWISTEX. 2010. Вы были живы. Вы были счастливы. Тим, Пол, Карл.",
      },
    },
  },

  // ══ МИССИЯ 3 — МУР 20.05.2013 ══════════════════════════════════════════════
  {
    id: 3,
    title: "Мур, Оклахома",
    subtitle: "20 МАЯ 2013",
    date: "20 мая 2013",
    ef: "EF-5",
    image: ELRENO_IMG,
    startBeat: "m3_start",
    beats: {
      m3_start: {
        id: "m3_start",
        text: "NWS выпустил предупреждение в 14:56. Торнадо уже на земле. EF-5. Ширина — почти 2 километра. Он движется прямо через жилые кварталы Мура. Ты на шоссе I-35. В пробке — тысячи машин. Люди пытаются уехать и становятся преградой сами себе. Тебе нужно действовать.",
        hud: "20 МАЯ 2013 / 15:04 / I-35, МУР",
        danger: "EF-5 В ГОРОДЕ",
        choices: [
          { text: "Выйти на радио — передать точные координаты воронки службам", xpDelta: 30, next: "m3_radio" },
          { text: "Попытаться заблокировать съезд — остановить машины от движения навстречу", timeDelta: 5, xpDelta: 20, next: "m3_block" },
          { text: "Мчаться к торнадо — поставить зонд пока есть время", damageDelta: 30, xpDelta: 15, next: "m3_probe_attempt" },
        ],
      },
      m3_radio: {
        id: "m3_radio",
        text: "Ты в эфире. Координаты, скорость, направление. Диспетчер повторяет данные. Две школы — Plaza Towers и Briarwood — прямо на пути. Ты называешь их. «Принято. Передаём директорам.» Ты не знаешь, успеют ли они.",
        hud: "15:09 / РАДИО / ДАННЫЕ ПЕРЕДАНЫ",
        autoNext: "m3_tornado_hits",
        autoDelay: 4,
      },
      m3_block: {
        id: "m3_block",
        text: "Ты ставишь машину поперёк съезда. Машины сигналят. Кто-то кричит. Ты показываешь на небо — там темнеет. Несколько водителей разворачиваются. Большинство объезжают тебя. Ты сделал что мог.",
        hud: "15:11 / БЛОКИРОВКА СЪЕЗДА",
        autoNext: "m3_tornado_hits",
        autoDelay: 3,
      },
      m3_probe_attempt: {
        id: "m3_probe_attempt",
        text: "Ты едешь навстречу. Воронка — стена. Два километра чёрного вихря, в котором летят крыши, машины, деревья. Ты остановился в 800 метрах. Выйти невозможно — debris поток такой что стоячий человек мёртв за 10 секунд.",
        hud: "15:12 / ЗОНД НЕВОЗМОЖЕН / 800М ОТ СТЕНЫ",
        danger: "СТЕНА DEBRIS",
        autoNext: "m3_tornado_hits",
        autoDelay: 4,
      },
      m3_tornado_hits: {
        id: "m3_tornado_hits",
        text: "15:16. Торнадо проходит через Мур. Ты видишь это. Кварталы исчезают — буквально. Дома срезаны до фундамента. Plaza Towers Elementary. Ты смотришь. Молчишь. Потом — тишина и пыль. 24 человека погибнут сегодня.",
        hud: "15:16 / МУР / ТОРНАДО ПРОШЁЛ",
        danger: "24 ПОГИБШИХ",
        choices: [
          { text: "Ехать в Мур — помогать раскапывать", xpDelta: 25, next: "m3_rescue" },
          { text: "Остаться на позиции — документировать разрушения", xpDelta: 10, next: "m3_document" },
        ],
      },
      m3_rescue: {
        id: "m3_rescue",
        text: "Ты роешь руками. Рядом — соседи, пожарные, незнакомые люди. Находишь женщину живой под балкой. Она плачет. Её дочь плачет. Ты не охотник за торнадо — ты просто человек среди людей.",
        hud: "16:40 / МУР / СПАСАТЕЛЬНАЯ ОПЕРАЦИЯ",
        autoNext: "m3_finish",
        autoDelay: 4,
      },
      m3_document: {
        id: "m3_document",
        text: "Ты фотографируешь. Фундаменты без домов. Машины на крышах. Дерево пронзило бетонную стену. Эти данные помогут строить лучше. Может быть. Ты в это веришь.",
        hud: "16:00 / ДОКУМЕНТИРОВАНИЕ",
        autoNext: "m3_finish",
        autoDelay: 3,
      },
      m3_finish: {
        id: "m3_finish",
        text: "Вечером Тим Самарас пишет тебе в мессенджер: «Страшный день. Видел твои координаты в эфире — молодец. Через 11 дней едем в Эль-Рено. Будешь?» Ты смотришь на телефон долго.",
        hud: "21:00 / МУР / ЧЕРЕЗ 11 ДНЕЙ — ЭЛЬ-РЕНО",
        outcome: "survived",
        outcomeText: "Мур. 20 мая 2013. 24 погибших. Ты помог — но этого мало. Торнадо не оставляет достаточно времени никогда.",
      },
    },
  },

  // ══ МИССИЯ 4 — ЭЛЬ-РЕНО 31.05.2013 ════════════════════════════════════════
  {
    id: 4,
    title: "Эль-Рено. Самый широкий",
    subtitle: "31 МАЯ 2013 — TWISTEX ГИБНЕТ",
    date: "31 мая 2013",
    ef: "EF-5",
    image: ELRENO_IMG,
    isTragedy: true,
    startBeat: "m4_start",
    beats: {
      m4_start: {
        id: "m4_start",
        text: "Дорога на Эль-Рено. Ты едешь за Тимом — его белый пикап виден в 300 метрах. Пол за рулём, Карл рядом. Воронка выглядит управляемой — EF-3, ширина 600 метров, движение на восток. Все занимают позиции. Ты в 2 км к югу. Всё выглядит стандартно.",
        hud: "31 МАЯ 2013 / 18:11 / I-40, ЭЛЬ-РЕНО",
        choices: [
          { text: "Держаться за Тимом — работать в паре", xpDelta: 5, next: "m4_follow_tim" },
          { text: "Занять позицию к востоку — на пути отхода", xpDelta: 10, next: "m4_east_pos" },
          { text: "Подойти ближе — воронка выглядит небольшой", damageDelta: 20, next: "m4_closer" },
        ],
      },
      m4_follow_tim: {
        id: "m4_follow_tim",
        text: "Ты в 500м за Тимом. Радар пищит необычно. Воронка внезапно расширяется — за 4 минуты с 600 метров до 2.6 километров. Это не EF-3. Это что-то другое. Тим по радио: «Воронка расширяется. Сохраняем позиции.»",
        hud: "18:19 / ВОРОНКА РАСШИРЯЕТСЯ / 2.6КМ",
        danger: "НЕОЖИДАННОЕ РАСШИРЕНИЕ",
        autoNext: "m4_turn",
        autoDelay: 4,
      },
      m4_east_pos: {
        id: "m4_east_pos",
        text: "Ты уже на востоке. Хорошая позиция. Воронка за спиной. Радар показывает расширение — с 600м до 2.6км за несколько минут. Ты далеко. Тим — нет.",
        hud: "18:19 / ВОСТОЧНАЯ ПОЗИЦИЯ / ТЫ В БЕЗОПАСНОСТИ",
        autoNext: "m4_turn",
        autoDelay: 3,
      },
      m4_closer: {
        id: "m4_closer",
        text: "Ты подъехал ближе. Красиво. Воронка как игла — тонкая, идеальная. Потом радар пищит. Потом снова пищит. Воронка начинает раздуваться. Быстро.",
        hud: "18:18 / В 900М ОТ ВОРОНКИ",
        danger: "СЛИШКОМ БЛИЗКО",
        autoNext: "m4_turn",
        autoDelay: 3,
      },
      m4_turn: {
        id: "m4_turn",
        text: "18:21. Воронка поворачивает. Резко. На СЕВЕР. Это нарушает все законы — торнадо так не движутся. 4.2 километра ширины. Самый широкий в истории наблюдений. Он поворачивает прямо на машину Тима. По радио — молчание. Ты смотришь.",
        hud: "18:21 / ПОВОРОТ НА СЕВЕР / 4.2КМ",
        danger: "ПОВОРОТ",
        choices: [
          { text: "Кричать в радио — «Тим, уходи на юг!»", xpDelta: 10, next: "m4_radio_tim" },
          { text: "Мчаться к ним — попытаться догнать и вытащить", damageDelta: 60,
            requires: { stat: "speed", min: 85 },
            requiresHint: "Машина слишком медленная — не догонишь",
            xpDelta: 20, next: "m4_rush" },
          { text: "Уходить — ты ничего не можешь сделать", xpDelta: 0, next: "m4_escape" },
        ],
      },
      m4_radio_tim: {
        id: "m4_radio_tim",
        text: "«Тим! Воронка повернула! Уходи на юг немедленно!» Секунда. Две. Три. Тим отвечает — спокойно, как всегда: «Вижу. Пытаемся уйти». Потом — шум. Треск. Тишина. Навсегда.",
        hud: "18:22 / ПОСЛЕДНИЙ СЕАНС СВЯЗИ",
        danger: "СВЯЗЬ ПОТЕРЯНА",
        autoNext: "m4_aftermath",
        autoDelay: 5,
      },
      m4_rush: {
        id: "m4_rush",
        text: "Ты едешь к ним на максимуме. Debris летит — камень разбивает лобовое. Ты ничего не видишь. Останавливаешься в 600 метрах. Впереди — стена. 4 километра шириной. Войти в неё — смерть. Ты ничего не можешь.",
        hud: "18:23 / СТЕНА ВПЕРЕДИ / ЛОБОВОЕ РАЗБИТО",
        danger: "НЕВОЗМОЖНО ПРОБИТЬСЯ",
        autoNext: "m4_aftermath",
        autoDelay: 4,
      },
      m4_escape: {
        id: "m4_escape",
        text: "Ты уходишь. Это правильно. Умереть рядом не поможет им. Но ты будешь помнить этот выбор.",
        hud: "18:22 / ОТСТУПЛЕНИЕ",
        autoNext: "m4_aftermath",
        autoDelay: 3,
      },
      m4_aftermath: {
        id: "m4_aftermath",
        text: "Торнадо ушёл. Поле. Пустое поле. Ты едешь туда, где была их машина. Белый пикап найдут в 800 метрах от дороги. Смятый как бумага. Тим Самарас. Пол Самарас. Карл Янг. Их больше нет. Ты стоишь посреди поля. Дует тёплый ветер.",
        hud: "19:15 / ЭЛЬ-РЕНО / 8 ПОГИБШИХ ВСЕГО",
        danger: "ТИМ / ПОЛ / КАРЛ",
        choices: [
          { text: "Остаться до прихода спасателей", xpDelta: 10, next: "m4_memorial" },
          { text: "Уехать — ты не можешь здесь оставаться", xpDelta: 0, next: "m4_memorial" },
        ],
      },
      m4_memorial: {
        id: "m4_memorial",
        text: "Тим Самарас (1957–2013). Отец. Учёный. Охотник за торнадо. Его данные изменили метеорологию. Его зонды-черепахи стоят в музеях. Его методы теперь преподают в университетах. Он знал риск. Он принял его ради науки и ради жизней, которые предупреждения могут спасти.",
        hud: "✝ ТИМ САМАРАС / ПОЛ САМАРАС / КАРЛ ЯНГ",
        outcome: "memorial",
        outcomeText: "Эль-Рено. 31 мая 2013. Самый широкий торнадо в истории — 4.2 км. Он изменил всё.",
      },
    },
  },

  // ══ МИССИЯ 5 — ДОДЖ СИТИ 2016 ══════════════════════════════════════════════
  {
    id: 5,
    title: "Додж Сити. Последний сезон",
    subtitle: "24 МАЯ 2016 — ФИНАЛ",
    date: "24 мая 2016",
    ef: "EF-3",
    image: HERO_IMG,
    startBeat: "m5_start",
    beats: {
      m5_start: {
        id: "m5_start",
        text: "Три года прошло. Ты работаешь один теперь — команды нет. Додж Сити, Кэнсас. Красивый вечерний торнадо — медленный, фотографический, почти театральный. Другие чейзеры фотографируют с обочины. Ты смотришь на воронку и думаешь о Тиме. О том, как он бы расставил зонды.",
        hud: "24 МАЯ 2016 / 18:40 / ДОДЖ СИТИ, КС",
        choices: [
          { text: "Поставить зонды треугольником — как учил Тим", xpDelta: 30, next: "m5_triangle" },
          { text: "Поставить один зонд — по-старому, по-своему", xpDelta: 15, next: "m5_single" },
          { text: "Просто смотреть. Иногда этого достаточно.", xpDelta: 5, next: "m5_watch" },
        ],
      },
      m5_triangle: {
        id: "m5_triangle",
        text: "Три зонда. Треугольник 400 метров. Ты помнишь каждое слово Тима. Воронка идёт прямо через центр. Данные идут — все три зонда пишут. Полный профиль ветра. Это лучшие данные сезона.",
        hud: "18:52 / ТРИ ЗОНДА / ТРЕУГОЛЬНИК АКТИВЕН",
        autoNext: "m5_data",
        autoDelay: 3,
      },
      m5_single: {
        id: "m5_single",
        text: "Один зонд. Быстро и чисто. Воронка проходит в 200 метрах. Данные хорошие. Не идеальные, но хорошие.",
        hud: "18:51 / ОДИН ЗОНД / ВОРОНКА В 200М",
        autoNext: "m5_data",
        autoDelay: 3,
      },
      m5_watch: {
        id: "m5_watch",
        text: "Ты стоишь у машины. Смотришь. Торнадо движется медленно — будто специально для тебя. Огненный закат за воронкой. Красиво. Страшно. Ты думаешь о Тиме.",
        hud: "18:49 / НАБЛЮДЕНИЕ / ЗАКАТ",
        autoNext: "m5_data",
        autoDelay: 4,
      },
      m5_data: {
        id: "m5_data",
        text: "Воронка уходит на северо-восток. Ты собираешь зонды. Другие чейзеры машут тебе — никто не знает тебя, но все тут одинаковые. Ты достаёшь ноутбук. Данные красивые. Ты назовёшь их в отчёте именем Тима.",
        hud: "20:15 / ДАННЫЕ СОБРАНЫ / ЗАКАТ",
        choices: [
          { text: "Написать отчёт и опубликовать данные", xpDelta: 20, next: "m5_finish" },
          { text: "Позвонить Пат Самарас — жене Тима", xpDelta: 15, next: "m5_call_pat" },
        ],
      },
      m5_call_pat: {
        id: "m5_call_pat",
        text: "Пат берёт трубку. Долгая пауза. «Он бы радовался таким данным», — говорит она тихо. Ты молчишь. «Спасибо, что не бросил работу», — добавляет она. Ты кладёшь трубку и долго смотришь в темноту.",
        hud: "21:30 / ЗВОНОК / ПАТ САМАРАС",
        autoNext: "m5_finish",
        autoDelay: 4,
      },
      m5_finish: {
        id: "m5_finish",
        text: "Ночь. Кэнсас. Ты сидишь у капота машины. Звёзды. Никаких штормов. Ты думаешь: каждый сезон кто-то приходит в эту профессию впервые — с дрожащими руками и горящими глазами. Как ты в 1995-м. Некоторые вернутся домой. Некоторые — нет. Но данные останутся. И жизни, которые они спасут — тоже.",
        hud: "23:00 / КЭНСАС / КОНЕЦ СЕЗОНА",
        outcome: "survived",
        outcomeText: "Финал. Ты прошёл путь от любителя до профессионала. Ты был рядом с легендой. Ты видел самое страшное. Ты продолжаешь.",
      },
    },
  },
];

// ─── компонент движка ─────────────────────────────────────────────────────────

interface Props {
  missionId: number;
  vehicle: VehicleStats;
  onExit: (result: { survived: boolean; xp: number }) => void;
}

export default function MissionEngine({ missionId, vehicle, onExit }: Props) {
  const def = MISSION_DEFS.find(m => m.id === missionId)!;
  const [beatId, setBeatId] = useState(def.startBeat);
  const [xp, setXp] = useState(0);
  const [damage, setDamage] = useState(0);
  const [phase, setPhase] = useState<"playing" | "outcome">("playing");
  const [outcomeType, setOutcomeType] = useState<"survived" | "dead" | "memorial">("survived");
  const [outcomeText, setOutcomeText] = useState("");
  const [choiceAnim, setChoiceAnim] = useState(false);
  const [autoTimer, setAutoTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textKey = useRef(0);

  const beat = def.beats[beatId];

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setAutoTimer(0);
  }, []);

  // авто-переход
  useEffect(() => {
    clearTimer();
    if (!beat || beat.choices?.length || beat.outcome || phase === "outcome") return;
    if (!beat.autoNext) return;
    const delay = beat.autoDelay ?? 3;
    setAutoTimer(delay);
    timerRef.current = setInterval(() => {
      setAutoTimer(prev => {
        if (prev <= 1) {
          clearTimer();
          advanceTo(beat.autoNext!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatId, phase]);

  // переход к финалу если damage > 90
  useEffect(() => {
    if (damage >= 90 && phase === "playing") {
      setPhase("outcome");
      setOutcomeType("dead");
      setOutcomeText("Машина уничтожена debris потоком. Тебя не нашли сразу. Охота за торнадо не прощает ошибок.");
    }
  }, [damage, phase]);

  function advanceTo(nextId: string) {
    const next = def.beats[nextId];
    if (!next) return;
    textKey.current++;
    setBeatId(nextId);
    if (next.outcome) {
      setPhase("outcome");
      setOutcomeType(next.outcome);
      setOutcomeText(next.outcomeText ?? "");
    }
  }

  function handleChoice(choice: Choice) {
    if (isChoiceDisabled(choice)) return;
    setChoiceAnim(true);
    setTimeout(() => setChoiceAnim(false), 300);
    if (choice.xpDelta) setXp(p => p + choice.xpDelta!);
    if (choice.damageDelta) {
      const realDamage = Math.max(0, choice.damageDelta - Math.floor(vehicle.armor * 0.3));
      setDamage(p => Math.min(100, p + realDamage));
    }
    advanceTo(choice.next);
  }

  function isChoiceDisabled(choice: Choice): boolean {
    if (!choice.requires) return false;
    const { stat, min, flag } = choice.requires;
    if (min !== undefined) return (vehicle[stat] as number) < min;
    if (flag !== undefined) return (vehicle[stat] as boolean) !== flag;
    return false;
  }

  const damageColor = damage < 40 ? "text-green-400" : damage < 70 ? "text-yellow-400" : "text-red-400";

  if (phase === "outcome") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 py-12 max-w-2xl mx-auto text-center">
        {outcomeType === "memorial" ? (
          <>
            <div className="text-red-500 text-xs mb-6 animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.3em" }}>
              ✝ МЕМОРИАЛ
            </div>
            <h2 className="text-red-400 mb-6" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, letterSpacing: "0.05em", lineHeight: 1.1 }}>
              ТИМ САМАРАС<br />ПОЛ САМАРАС<br />КАРЛ ЯНГ
            </h2>
          </>
        ) : outcomeType === "dead" ? (
          <>
            <div className="text-red-500 text-xs mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.3em" }}>
              МИССИЯ ПРОВАЛЕНА
            </div>
            <h2 className="text-red-400 mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, letterSpacing: "0.05em" }}>
              ТЫ ПОГИБ
            </h2>
          </>
        ) : (
          <>
            <div className="text-orange-500 text-xs mb-4" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.3em" }}>
              МИССИЯ ЗАВЕРШЕНА
            </div>
            <h2 className="text-gradient-fire mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, letterSpacing: "0.05em" }}>
              ВЫЖИЛ
            </h2>
          </>
        )}

        <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontStyle: "italic" }}>
          {outcomeText}
        </p>

        <div className="flex items-center gap-6 mb-8 p-4 rounded-sm"
          style={{ background: "rgba(220,120,40,0.08)", border: "1px solid rgba(220,120,40,0.2)" }}>
          <div className="text-center">
            <div className="text-orange-400 text-3xl" style={{ fontFamily: "'Bebas Neue', cursive" }}>+{xp}</div>
            <div className="text-stone-600 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>XP ПОЛУЧЕНО</div>
          </div>
          <div className="w-px h-10 bg-stone-800" />
          <div className="text-center">
            <div className={`text-3xl ${damageColor}`} style={{ fontFamily: "'Bebas Neue', cursive" }}>{damage}%</div>
            <div className="text-stone-600 text-xs" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em" }}>УРОН МАШИНЫ</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-storm px-8 py-3 text-sm"
            onClick={() => { setBeatId(def.startBeat); setXp(0); setDamage(0); setPhase("playing"); }}>
            ↺ ЗАНОВО
          </button>
          <button className="btn-outline-storm px-8 py-3 text-sm"
            onClick={() => onExit({ survived: outcomeType !== "dead", xp })}>
            ← ВЕРНУТЬСЯ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="btn-outline-storm px-3 py-1.5 text-xs flex items-center gap-2"
          onClick={() => onExit({ survived: false, xp })}>
          <Icon name="ChevronLeft" size={12} /> ВЫЙТИ
        </button>
        <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "'Oswald', sans-serif" }}>
          <div className="flex items-center gap-2">
            <span className="text-stone-600">XP</span>
            <span className="text-orange-400">{xp}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-600">УРОН</span>
            <span className={damageColor}>{damage}%</span>
          </div>
          <div className="w-20 status-bar">
            <div className="status-bar-fill transition-all duration-500"
              style={{ width: `${100 - damage}%`, background: damage > 60 ? "linear-gradient(90deg,#991b1b,#ef4444)" : undefined }} />
          </div>
        </div>
      </div>

      {/* Mission title */}
      <div className="mb-4">
        <div className="text-orange-500 text-xs mb-1" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.2em" }}>
          {def.subtitle}
        </div>
        <div className="flex items-center gap-3">
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 34, letterSpacing: "0.05em", lineHeight: 1 }}>
            {def.title}
          </h2>
          <span className="text-xs px-2 py-1 rounded-sm" style={{ fontFamily: "'Oswald', sans-serif",
            background: "rgba(220,120,40,0.15)", border: "1px solid rgba(220,120,40,0.3)", color: "hsl(38,90%,60%)" }}>
            {def.ef}
          </span>
        </div>
      </div>

      {/* Scene image strip */}
      <div className="relative h-28 mb-5 rounded-sm overflow-hidden">
        <img src={def.image} alt="" className="w-full h-full object-cover"
          style={{ filter: `saturate(0.4) brightness(${def.isTragedy ? 0.3 : 0.4})`, objectPosition: "center 35%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,7,5,0.95) 0%, rgba(10,7,5,0.3) 50%, rgba(10,7,5,0.8) 100%)" }} />
        <div className="absolute inset-0 flex items-center px-5">
          {beat.hud && (
            <div className="text-xs animate-flicker" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em",
              color: def.isTragedy ? "#f87171" : "hsl(38,90%,60%)" }}>
              {beat.hud}
            </div>
          )}
        </div>
        {beat.danger && (
          <div className="absolute top-2 right-3 px-2 py-1 text-xs animate-flicker"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em",
              background: "rgba(220,38,38,0.3)", border: "1px solid rgba(220,38,38,0.5)", color: "#fca5a5" }}>
            ⚠ {beat.danger}
          </div>
        )}
      </div>

      {/* Beat text */}
      <div key={textKey.current} className="mb-6 animate-fade-in">
        <p className="text-stone-200 text-sm leading-relaxed"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, lineHeight: 1.85,
            borderLeft: `3px solid ${def.isTragedy ? "rgba(220,38,38,0.5)" : "rgba(220,120,40,0.4)"}`,
            paddingLeft: 16 }}>
          {beat.text}
        </p>
      </div>

      {/* Auto-timer */}
      {autoTimer > 0 && (
        <div className="flex items-center gap-2 mb-4 text-xs text-stone-600" style={{ fontFamily: "'Oswald', sans-serif" }}>
          <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          ПРОДОЛЖЕНИЕ ЧЕРЕЗ {autoTimer}с...
        </div>
      )}

      {/* Choices */}
      {beat.choices && beat.choices.length > 0 && phase === "playing" && (
        <div className={`space-y-2 transition-opacity duration-200 ${choiceAnim ? "opacity-0" : "opacity-100"}`}>
          <div className="text-xs text-stone-600 mb-3" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.15em" }}>
            — ТВОЁ РЕШЕНИЕ —
          </div>
          {beat.choices.map((choice, i) => {
            const disabled = isChoiceDisabled(choice);
            return (
              <button key={i}
                disabled={disabled}
                onClick={() => handleChoice(choice)}
                className={`w-full text-left p-4 rounded-sm transition-all duration-200 ${
                  disabled
                    ? "opacity-30 cursor-not-allowed border border-stone-800"
                    : "border border-stone-700 hover:border-orange-500/60 cursor-pointer"
                }`}
                style={{ background: disabled ? "rgba(10,7,5,0.5)" : "rgba(20,14,9,0.8)",
                  ...(disabled ? {} : { ":hover": { background: "rgba(30,20,12,0.9)" } }) }}>
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-xs mt-0.5 flex-shrink-0" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <div className="flex-1">
                    <div className="text-sm" style={{ fontFamily: "'IBM Plex Sans', sans-serif",
                      color: disabled ? "#4b5563" : "#d1cec9" }}>
                      {choice.text}
                    </div>
                    {disabled && choice.requiresHint && (
                      <div className="text-xs text-red-700 mt-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        ✕ {choice.requiresHint}
                      </div>
                    )}
                    {!disabled && (choice.damageDelta || choice.xpDelta) ? (
                      <div className="flex gap-3 mt-1">
                        {choice.xpDelta ? <span className="text-xs text-green-600" style={{ fontFamily: "'Oswald', sans-serif" }}>+{choice.xpDelta} XP</span> : null}
                        {choice.damageDelta ? <span className="text-xs text-red-700" style={{ fontFamily: "'Oswald', sans-serif" }}>РИСК УРОНА</span> : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
