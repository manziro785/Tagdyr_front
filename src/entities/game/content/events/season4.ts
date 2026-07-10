import type { GameEvent } from "../../model/types";

/** Сезон 4 · «Зрелость» — 22–26. Ставки растут: семья, жильё, своё дело. */
export const SEASON_4_EVENTS: GameEvent[] = [
  {
    code: "s4_marriage_fork",
    season: 4,
    kicker: "Семья · большой разговор",
    key: true,
    text: "Родня перешла от намёков к действиям: «Сколько можно ходить одному, вот дочка/сын знакомых…». А у тебя и правда есть человек, с которым хорошо. Той — это счастье, но ещё это калым, ресторан на двести человек и минус все накопления.",
    choices: [
      {
        id: "wedding_big",
        text: "Жениться с размахом — один раз живём",
        primary: true,
        effects: {
          stats: { money: -40_000, relationships: 15, mood: 10, energy: -8 },
          flags: { married: true, familyFirst: true },
          diary: "Сыграли той на двести человек. Денег нет, зато видео пересматривает вся долина.",
        },
      },
      {
        id: "wedding_small",
        text: "Скромно: загс, плов для своих",
        effects: {
          stats: { money: -10_000, relationships: 6, mood: 8 },
          flags: { married: true },
          diary: "Расписались тихо, плов был только для своих. Родня поворчала и съела добавку.",
        },
      },
      {
        id: "not_yet",
        text: "Пока рано — сначала на ноги встану",
        effects: {
          stats: { mood: -4, relationships: -6 },
          diary: "Сказал родне «пока рано». Тётушки сверили часы и пообещали вернуться к теме.",
        },
      },
    ],
  },
  {
    code: "s4_housing_fork",
    season: 4,
    kicker: "Жильё · вечный вопрос",
    key: true,
    text: "Аренда съедает четверть дохода, и это навсегда. Ипотека на окраине — 12% на 15 лет, зато своё. А отец говорит: «Приезжай, достроим дом у нас — за те же деньги дворец будет». Правда, работа там — вопрос.",
    choices: [
      {
        id: "mortgage",
        text: "Ипотека: своё, хоть и в бетоне на 15 лет",
        requires: { minMoney: 20_000 },
        effects: {
          stats: { money: -20_000, mood: 8 },
          debt: { amount: 30_000, rate: 0.12 },
          flags: { hasHome: true },
          card: "invest_early",
          diary: "Собрал первоначальный взнос и взял ипотеку. Свои 42 квадрата и свой 15-летний план.",
        },
      },
      {
        id: "keep_renting",
        text: "Снимать дальше, разницу — откладывать",
        primary: true,
        effects: {
          stats: { money: 5000 },
          flags: { savedEmergencyFund: true },
          card: "invest_early",
          diary: "Посчитал: аренда плюс накопления пока выгоднее ипотеки. Таблицу храню как оберег.",
        },
      },
      {
        id: "build_village",
        text: "Строиться в селе — там простор",
        effects: {
          stats: { money: -20_000, relationships: 10, mood: 5 },
          flags: { backToVillage: true, hasHome: true },
          diary: "Начали достраивать дом в селе. Каждые выходные — цемент, тосты и отцовские советы.",
        },
      },
    ],
  },
  {
    code: "s4_parents_health",
    season: 4,
    kicker: "Звонок · из дома",
    text: "Маме нужна операция на колене. Не срочно-страшная, но тянуть нельзя. В государственной — очередь до зимы, в частной — 25 000 и на следующей неделе.",
    choices: [
      {
        id: "pay_private",
        text: "Платить за частную — мама одна",
        primary: true,
        effects: {
          stats: { money: -25_000, relationships: 14, mood: 4 },
          flags: { familyFirst: true },
          diary: "Оплатил маме операцию в частной. Через месяц она уже гоняла кур по двору. Стоило каждого сома.",
        },
      },
      {
        id: "pay_debt",
        text: "Занять, но сделать сейчас",
        requires: { maxMoney: 25_000 },
        effects: {
          debt: { amount: 25_000, rate: 0.14 },
          stats: { relationships: 14, mood: 2 },
          flags: { familyFirst: true },
          diary: "Занял на операцию маме. Долг тяжёлый, но её шаги по двору — легче лёгкого.",
        },
      },
      {
        id: "wait_queue",
        text: "Ждать очередь в государственной",
        effects: {
          stats: { relationships: -8, mood: -8 },
          diary: "Встали в очередь на операцию. Мама говорит «нормально, потерплю». От этого только хуже.",
        },
      },
    ],
  },
  {
    code: "s4_burnout_check",
    season: 4,
    kicker: "Работа · предложение",
    text: "Предлагают второй проект «на вырост»: плюс 15 000 в месяц, минус выходные на полгода. Зеркало уже сейчас показывает человека, которому не помешал бы отпуск.",
    choices: [
      {
        id: "take_project",
        text: "Взять: деньги сейчас нужнее сна",
        effects: {
          stats: { money: 40_000, energy: -20, mood: -8 },
          card: "health_asset",
          diary: "Взял второй проект и тянул его годы. Кофе стал едой, выходные — легендой. Но счёт вырос всерьёз.",
        },
      },
      {
        id: "decline_rest",
        text: "Отказаться и беречь себя",
        primary: true,
        effects: {
          stats: { energy: 18, mood: 12, money: 15_000 },
          card: "health_asset",
          diary: "От второго проекта отказался: работал спокойно, копил понемногу и раз в год уезжал на Сон-Куль.",
        },
      },
      {
        id: "negotiate_terms",
        text: "Взять, но выторговать помощника",
        chance: 55,
        effects: {
          stats: { money: 32_000, energy: -10 },
          card: "haggle",
          diary: "Взял проект, но выбил помощника. Учусь делегировать — сложнее, чем работать самому.",
        },
        failEffects: {
          stats: { money: 40_000, energy: -20, mood: -6 },
          diary: "Помощника пообещали «после квартала». Кварталов прошло восемь.",
        },
        failText: "«Помощника дадим после квартала» — классика.",
      },
    ],
  },
  {
    code: "s4_business_leap",
    season: 4,
    kicker: "Накопления · развилка",
    requires: { minMoney: 30_000, notFlag: "hasBusiness" },
    text: "На счету — приличная сумма, и она жжёт карман. Друг зовёт в долю: кофейня у университета, «место золотое, студенты пьют как не в себя». Или спокойный депозит под 12% — скучно, зато спится хорошо.",
    choices: [
      {
        id: "open_business",
        text: "В долю! Кофейня — это красиво",
        chance: 55,
        effects: {
          stats: { money: -8000, mood: 10, energy: -10 },
          flags: { hasBusiness: true },
          card: "income_streams",
          diary: "Вложился в кофейню у универа. Через два года вложения почти отбились — и это уже моё дело.",
        },
        failEffects: {
          stats: { money: -30_000, mood: -12, energy: -10 },
          diary: "Кофейня не взлетела: рядом открылись ещё две. Урок за тридцать тысяч — дорогая школа.",
        },
        failText: "Через квартал рядом открылись ещё две кофейни…",
      },
      {
        id: "deposit",
        text: "Депозит: пусть деньги работают тихо",
        primary: true,
        effects: {
          stats: { money: 12_000, mood: 3 },
          flags: { savedEmergencyFund: true },
          card: "invest_early",
          diary: "Положил на депозит и не трогал. Проценты за годы накапали ощутимо — тихая магия.",
        },
      },
      {
        id: "spend_family",
        text: "Вложить в дом и родителей",
        effects: {
          stats: { money: -20_000, relationships: 12 },
          flags: { familyFirst: true },
          diary: "Обновил родителям дом: котёл, окна, крыша. Мама плакала. Я, кажется, тоже.",
        },
      },
    ],
  },
  {
    code: "s4_master_degree",
    season: 4,
    kicker: "Универ · письмо",
    requires: { flag: "academicPath" },
    weight: 2,
    text: "Научрук написал: есть грант на магистратуру, но стипендия — смешная, а совмещать с работой почти нереально. «У тебя голова, не потеряй её на базаре», — говорит он.",
    choices: [
      {
        id: "go_masters",
        text: "Идти в магистратуру — голова дороже",
        primary: true,
        effects: {
          stats: { money: -10_000, mood: 8, energy: -8 },
          flags: { masterDegree: true },
          diary: "Поступил в магистратуру. Денег меньше, смысла — больше. Научрук доволен.",
        },
      },
      {
        id: "stay_work",
        text: "Остаться работать: наука подождёт",
        effects: {
          stats: { money: 20_000, mood: -4 },
          diary: "Отказался от магистратуры и ушёл в работу. Научрук вздохнул так, что слышали на третьем этаже.",
        },
      },
    ],
  },
  {
    code: "s4_debt_payment",
    season: 4,
    kicker: "Банк · выписка",
    requires: { hasDebt: true },
    weight: 3,
    text: "Выписка по долгам похожа на счётчик такси: цифры растут, даже когда стоишь. Сейчас есть чем гасить — вопрос, сколько отдать.",
    choices: [
      {
        id: "pay_big",
        text: "Гасить по-крупному, начиная с дорогого",
        primary: true,
        requires: { minMoney: 18_000 },
        effects: {
          payDebt: 35_000,
          stats: { mood: 8 },
          card: "debt_first",
          diary: "Сел и закрыл самый дорогой долг почти целиком. Впервые за годы выписка не пугает.",
        },
      },
      {
        id: "pay_some",
        text: "Гасить сколько не жалко",
        requires: { minMoney: 10_000 },
        effects: {
          payDebt: 12_000,
          stats: { mood: 3 },
          diary: "Скинул долгам немного сверх минималки. Счётчик замедлился, но тикает.",
        },
      },
      {
        id: "pay_nothing",
        text: "Сейчас не до долгов",
        effects: {
          stats: { mood: -4 },
          diary: "Отложил выписку «на потом». Проценты «потом» не знают.",
        },
      },
    ],
  },
  {
    code: "s4_village_call",
    season: 4,
    kicker: "Село · зовут обратно",
    requires: { notFlag: "wentAbroad" },
    text: "Односельчане затеяли кооператив: мёд, курут и войлок — на экспорт, юрты — туристам. Ищут своего человека «с городской головой». Доход поначалу скромный, зато горы — вот они.",
    choices: [
      {
        id: "join_coop",
        text: "Вернуться и строить своё в селе",
        effects: {
          stats: { money: -5000, mood: 12, energy: 10, relationships: 10 },
          flags: { backToVillage: true },
          diary: "Вернулся в село строить кооператив. Интернет ловит на холме, зато воздух — везде.",
        },
      },
      {
        id: "help_remote",
        text: "Помогать из города: сайт, продажи, связи",
        primary: true,
        effects: {
          stats: { relationships: 8, energy: -6 },
          flags: { communityPath: true },
          diary: "Сделал односельчанам сайт и наладил продажи. Курут пошёл в Алматы, я — в люди.",
        },
      },
      {
        id: "decline_polite",
        text: "Вежливо отказаться — у меня своя дорога",
        effects: {
          stats: { mood: -2 },
          diary: "Кооперативу отказал. Пусть без обид: у каждого свой перевал.",
        },
      },
    ],
  },
];
