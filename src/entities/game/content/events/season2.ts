import type { Localized } from "../../model/localized";
import type { GameEvent } from "../../model/types";

/**
 * Сезон 2 · «Студенчество» — 18 лет, Бишкек. Город учит быстро.
 *
 * Контракт с бэкендом — по кодам и эффектам (см. season1.ts).
 */
export const SEASON_2_EVENTS: GameEvent<Localized>[] = [
  {
    code: "s2_housing_fork",
    season: 2,
    kicker: {
      ru: "Бишкек · первые дни",
      en: "Bishkek · first days",
      ky: "Бишкек · алгачкы күндөр",
    },
    key: true,
    text: {
      ru: "Город встретил маршрутками и ценами. Жить есть где: у тёти Гульмиры бесплатно (с отчётом «куда ходил, с кем дружил») или в общаге с тремя соседями и свободой до полуночи. Комната отдельно — 8000 в месяц, но это уже роскошь.",
      en: "The city greets you with minibuses and prices. There's a place to live: at Aunt Gulmira's for free (with a report on “where you went and who you were with”) or in the dorm with three roommates and freedom until midnight. A room of your own is 8,000 a month — that's already a luxury.",
      ky: "Шаар маршрутка менен баалардан баштап тосуп алды. Жашаганга жер бар: Гүлмира эженикинде акысыз (бирок «кайда бардың, ким менен жүрдүң» деген отчёт менен) же үч кошуна менен жатаканада, түн ортосуна чейин эркиндик. Өзүнчө бөлмө — айына 8000, бул эми кооздук.",
    },
    choices: [
      {
        id: "aunt",
        text: {
          ru: "К тёте Гульмире — бесплатно же",
          en: "Move in with Aunt Gulmira — it's free",
          ky: "Гүлмира эженикине — акысыз го",
        },
        effects: {
          stats: { relationships: 6, mood: -8 },
          flags: { livesWithFamily: true },
          diary: {
            ru: "Заселился к тёте Гульмире. Борщ отличный, комендантский час — строгий.",
            en: "Moved in with Aunt Gulmira. The soup is excellent, the curfew is strict.",
            ky: "Гүлмира эженикине жайгаштым. Тамагы сонун, бирок кечки чек катуу.",
          },
        },
      },
      {
        id: "dorm",
        text: {
          ru: "Общага: шумно, тесно, зато своя жизнь",
          en: "Dorm: loud, cramped, but your own life",
          ky: "Жатакана: ызы-чуу, тар, бирок өз жашооң",
        },
        primary: true,
        effects: {
          stats: { money: -2000, mood: 10, energy: -5, relationships: 8 },
          diary: {
            ru: "Общага! Сосед храпит, второй жарит картошку в час ночи. Лучшее время жизни.",
            en: "The dorm! One roommate snores, the other fries potatoes at 1 a.m. Best time of my life.",
            ky: "Жатакана! Бир кошуна коңурук тартат, экинчиси түн бирде картошка кууруйт. Өмүрдүн эң сонун учуру.",
          },
        },
      },
      {
        id: "rent_room",
        text: {
          ru: "Снять комнату — я взрослый",
          en: "Rent a room — I'm an adult now",
          ky: "Бөлмө ижарага алуу — мен чоң кишимин",
        },
        requires: { minMoney: 8000 },
        effects: {
          stats: { money: -8000, mood: 8 },
          flags: { rentsAlone: true },
          diary: {
            ru: "Снял комнату. Тишина стоит восемь тысяч в месяц — и, кажется, того стоит.",
            en: "Rented a room. Silence costs eight thousand a month — and it seems worth it.",
            ky: "Бөлмө ижарага алдым. Тынчтык айына сегиз миң турат — арзыйт окшойт.",
          },
        },
      },
    ],
  },
  {
    code: "s2_budget_game",
    season: 2,
    kicker: {
      ru: "Первая зарплата · конверты",
      en: "First paycheck · envelopes",
      ky: "Биринчи айлык · конверттер",
    },
    key: true,
    special: "budget",
    text: {
      ru: "Первая настоящая зарплата с подработки — 12 000 сомов! Мама учила: разложи по конвертам в день получки. Аренда, еда, той у родни (куда без него), накопления и… хотелки. Спойлер: на всё не хватит.",
      en: "Your first real paycheck from the side job — 12,000 som! Mom taught you: split it into envelopes on payday. Rent, food, a relative's toi (there's always one), savings and… wants. Spoiler: it won't cover everything.",
      ky: "Кошумча иштен түшкөн биринчи чыныгы айлык — 12 000 сом! Апам үйрөткөн: айлык алган күнү конверттерге бөлүп сал. Ижара, тамак, тууганлардын тою (ансыз болбойт), топтоо жана… каалоолор. Спойлер: баарына жетпейт.",
    },
    choices: [
      // Выборы генерирует мини-игра; этот массив — фоллбэк, если спец-экран недоступен.
      {
        id: "balanced",
        text: {
          ru: "Разложить по конвертам поровну",
          en: "Split it evenly across the envelopes",
          ky: "Конверттерге тең бөлүштүрүү",
        },
        effects: {
          stats: { money: 2000, mood: 3 },
          card: "budget_envelopes",
          diary: {
            ru: "Разложил зарплату по конвертам. Хотелки обиделись, зато аренда заплачена.",
            en: "Split the paycheck into envelopes. My wants took offence, but the rent is paid.",
            ky: "Айлыкты конверттерге бөлүштүрдүм. Каалоолор таарынды, бирок ижара төлөндү.",
          },
        },
      },
    ],
  },
  {
    code: "s2_toi_cousin",
    season: 2,
    kicker: {
      ru: "Двор · той у родни",
      en: "The yard · a family toi",
      ky: "Короо · тууганлардын тою",
    },
    text: {
      ru: "Старший двоюродный женится — вся родня скидывается на подарок. Мама шепчет: «С пустыми руками неудобно, минимум 2000…». А стипендия только-только пришла. Кудай буюрса, и тебе так сыграют.",
      en: "Your older cousin is getting married — the whole family is chipping in for the gift. Mom whispers: “You can't show up empty-handed, two thousand at least…” And the stipend has only just landed. God willing, one day they'll throw one like this for you.",
      ky: "Улуу бир тууганың үйлөнөт — бүт тууганлар белекке акча кошуп жатышат. Апам шыбырайт: «Куру кол баруу ыңгайсыз, эң аз дегенде 2000…». Стипендия жаңы эле түшкөн. Кудай буюрса, сага да ушундай той берилет.",
    },
    choices: [
      {
        id: "give_full",
        text: {
          ru: "Скинуться на подарок — 2000 сом",
          en: "Chip in for the gift — 2,000 som",
          ky: "Белекке кошулуу — 2000 сом",
        },
        primary: true,
        effects: {
          stats: { money: -2000, relationships: 12, mood: 4 },
          card: "social_capital",
          diary: {
            ru: "На тое двоюродного не пожадничал. Танцевал так, что видео разошлось по родне.",
            en: "Didn't skimp at my cousin's toi. Danced so hard the video went around the whole family.",
            ky: "Бир тууганымдын тоюнда сараңдык кылган жокмун. Ушунчалык бийледим, видео бүт тууганга тарады.",
          },
        },
      },
      {
        id: "give_half_help",
        text: {
          ru: "Дать 500 и помочь с тоем руками",
          en: "Give 500 and help with your hands",
          ky: "500 берип, той даярдоого жардам берүү",
        },
        chance: 65,
        effects: {
          stats: { money: -500, energy: -10, relationships: 10 },
          card: "social_capital",
          diary: {
            ru: "Дал пятьсот и два дня таскал казаны. Родня оценила: «вот это по-нашему».",
            en: "Gave five hundred and hauled cauldrons for two days. The family approved: “now that's one of ours”.",
            ky: "Беш жүз бердим да, эки күн казан ташыдым. Тууганлар баалады: «мына, өзүбүздүн бала».",
          },
        },
        failEffects: {
          stats: { money: -500, energy: -12, relationships: -4 },
          diary: {
            ru: "Помогал с тоем, но опрокинул поднос с боорсоками. Запомнили, увы, только это.",
            en: "Helped with the toi, but tipped over a tray of boorsok. Sadly, that's the only thing anyone remembers.",
            ky: "Тойго жардам бердим, бирок боорсок салынган табакты төгүп алдым. Тилекке каршы, ушул гана эстеп калды.",
          },
        },
        failText: {
          ru: "Поднос с боорсоками — в самый неподходящий момент…",
          en: "A tray of boorsok — at the worst possible moment…",
          ky: "Боорсок салынган табак — эң ыңгайсыз учурда…",
        },
      },
      {
        id: "skip",
        text: {
          ru: "Не пойти, сберечь деньги",
          en: "Skip it and keep the money",
          ky: "Барбай коюп, акчаны сактоо",
        },
        effects: {
          stats: { relationships: -10, mood: -3 },
          diary: {
            ru: "Пропустил той двоюродного. Мама неделю здоровалась со мной официально.",
            en: "Missed my cousin's toi. For a week Mom greeted me formally.",
            ky: "Бир тууганымдын тоюна барбадым. Апам бир жума мени менен расмий саламдашты.",
          },
        },
      },
    ],
  },
  {
    code: "s2_session",
    season: 2,
    kicker: {
      ru: "Универ · сессия",
      en: "University · exam session",
      ky: "Университет · сессия",
    },
    requires: { flag: "higherEd" },
    text: {
      ru: "Сессия. Матанализ принимает препод, которого боятся три поколения. Вариантов, как всегда, три: неделя зубрёжки, шпоры или «решала» с потока предлагает билет за 1500.",
      en: "Exam session. Calculus is taken by the professor three generations have feared. As always there are three options: a week of cramming, cheat sheets, or the guy from your year who sells the exam card for 1,500.",
      ky: "Сессия. Математикалык анализди үч муун корккон окутуучу алат. Дайыма болгондой үч жол бар: бир жума жаттоо, шпаргалка же курстагы «чечкич» билетти 1500гө сунуштайт.",
    },
    choices: [
      {
        id: "study",
        text: {
          ru: "Зубрить неделю честно",
          en: "Cram honestly for a week",
          ky: "Бир жума чын жүрөктөн жаттоо",
        },
        primary: true,
        effects: {
          stats: { energy: -15, mood: -3 },
          flags: { academicPath: true },
          diary: {
            ru: "Сдал матан своей головой. Препод поднял бровь — это у него высшая похвала.",
            en: "Passed calculus with my own head. The professor raised an eyebrow — from him that's the highest praise.",
            ky: "Матанализди өз башым менен тапшырдым. Окутуучу кашын көтөрдү — бул анын эң жогорку мактоосу.",
          },
        },
      },
      {
        id: "cheat",
        text: {
          ru: "Шпоры — классика жанра",
          en: "Cheat sheets — a classic of the genre",
          ky: "Шпаргалка — эски эле ыкма",
        },
        chance: 55,
        effects: {
          stats: { mood: 6 },
          diary: {
            ru: "Проскочил сессию на шпорах. Стыдно? Немного. Эффективно? Очень.",
            en: "Slipped through the session on cheat sheets. Ashamed? A little. Effective? Very.",
            ky: "Сессияны шпаргалка менен өткөрдүм. Уятпы? Бир аз. Натыйжалуубу? Абдан.",
          },
        },
        failEffects: {
          stats: { mood: -10, money: -2000 },
          diary: {
            ru: "Спалился со шпорой. Пересдача стоила нервов, денег и лекции о совести.",
            en: "Got caught with a cheat sheet. The retake cost me nerves, money and a lecture on conscience.",
            ky: "Шпаргалка менен кармалдым. Кайра тапшыруу жүйкөмө, акчама жана абийир жөнүндө лекцияга турду.",
          },
        },
        failText: {
          ru: "Препод видел шпоры у трёх поколений. Твою — тоже.",
          en: "The professor has seen three generations of cheat sheets. Yours too.",
          ky: "Окутуучу үч муундун шпаргалкасын көргөн. Сеникин да көрдү.",
        },
      },
      {
        id: "buy_ticket",
        text: {
          ru: "Купить билет у «решалы»",
          en: "Buy the exam card from the fixer",
          ky: "«Чечкичтен» билет сатып алуу",
        },
        requires: { minMoney: 1500 },
        effects: {
          stats: { money: -1500, mood: -4 },
          diary: {
            ru: "Купил билет у решалы. Сдал, но кому — себе или ему?",
            en: "Bought the exam card from the fixer. Passed — but to whom, myself or him?",
            ky: "Чечкичтен билет сатып алдым. Тапшырдым, бирок кимге — өзүмөбү же агабы?",
          },
        },
      },
    ],
  },
  {
    code: "s2_side_hustle",
    season: 2,
    kicker: {
      ru: "Город · вечера свободны",
      en: "The city · evenings are free",
      ky: "Шаар · кечтер бош",
    },
    text: {
      ru: "Знакомый зовёт по вечерам развозить заказы — «Яндекс по-бишкекски»: тысяч восемь в месяц, но вечера и часть сна — в топку. Учёба/дела, вообще-то, тоже никуда не делись.",
      en: "A friend offers evening delivery work — Bishkek-style gig driving: about eight thousand a month, but your evenings and part of your sleep go up in smoke. Studies and other business haven't gone anywhere either.",
      ky: "Тааныш кечкисин заказ ташууга чакырат — «бишкекче Яндекс»: айына сегиз миңдей, бирок кечтериң жана уйкуңдун бир бөлүгү отко кетет. Окуу да, башка иштер да эч жакка жоголгон жок.",
    },
    choices: [
      {
        id: "courier",
        text: {
          ru: "Взять подработку — деньги лишними не бывают",
          en: "Take the side job — money is never extra",
          ky: "Кошумча ишти алуу — акча ашыкча болбойт",
        },
        primary: true,
        effects: {
          stats: { money: 8000, energy: -18, mood: -4 },
          flags: { hasJob: true },
          card: "income_streams",
          diary: {
            ru: "Вечерами развожу заказы. Город выучил наизусть, сон — по расписанию маршруток.",
            en: "I deliver orders in the evenings. Learned the city by heart, sleep runs on the minibus timetable.",
            ky: "Кечкисин заказ ташыйм. Шаарды жатка билип алдым, уйку маршруткалардын графиги менен.",
          },
        },
      },
      {
        id: "focus",
        text: {
          ru: "Отказаться: сейчас время вкладывать в себя",
          en: "Say no: now is the time to invest in myself",
          ky: "Баш тартуу: азыр өзүңө салым кошкон убак",
        },
        effects: {
          stats: { mood: 4, energy: 6 },
          flags: { selfInvest: true },
          diary: {
            ru: "Отказался от подработки ради учёбы. Бедный, но выспавшийся и с планом.",
            en: "Turned down the side job for my studies. Poor, but well-rested and with a plan.",
            ky: "Окуу үчүн кошумча иштен баш тарттым. Жарды, бирок уйкум канган жана планым бар.",
          },
        },
      },
      {
        id: "weekend_only",
        text: {
          ru: "Только по выходным — и деньги, и сон",
          en: "Weekends only — money and sleep",
          ky: "Дем алыш күндөрү гана — акча да, уйку да",
        },
        effects: {
          stats: { money: 4000, energy: -8 },
          flags: { hasJob: true },
          diary: {
            ru: "Развожу заказы по выходным. Золотая середина: устаю наполовину, зарабатываю тоже.",
            en: "Deliver orders on weekends. The golden middle: half the exhaustion, half the money.",
            ky: "Дем алышта заказ ташыйм. Алтын ортолук: жарым чарчайм, жарым табам.",
          },
        },
      },
    ],
  },
  {
    code: "s2_laptop_crisis",
    season: 2,
    kicker: {
      ru: "Общий чат · паника",
      en: "Group chat · panic",
      ky: "Жалпы чат · дүрбөлөң",
    },
    text: {
      ru: "Ноутбук умер за месяц до дипломной/отчётного проекта. Ремонт — 4000 и неделя ожидания. Новый б/у на Дордое — 15 000. Одногруппник готов одолжить свой по ночам «за спасибо и плов».",
      en: "Your laptop died a month before the big project. Repair costs 4,000 and a week of waiting. A used one at Dordoi is 15,000. A classmate will lend you his at night “for a thank-you and a plov”.",
      ky: "Ноутбук чоң долбоорго бир ай калганда өлдү. Оңдоо — 4000 жана бир жума күтүү. Дордойдон колдонулганы — 15 000. Курсташ өзүнүкүн түнкүсүн «ыракмат менен палоого» бергенге даяр.",
    },
    choices: [
      {
        id: "repair",
        text: {
          ru: "Чинить старичка — он ещё повоюет",
          en: "Repair the old guy — he's still got fight in him",
          ky: "Эскисин оңдоо — ал дагы кызмат кылат",
        },
        primary: true,
        effects: {
          stats: { money: -4000, mood: -2 },
          diary: {
            ru: "Починил ноутбук. Мастер сказал «жить будет, но не бегать». Как мы все.",
            en: "Fixed the laptop. The repairman said “it'll live, but it won't run”. Same as all of us.",
            ky: "Ноутбукту оңдодум. Уста «жашайт, бирок чуркабайт» деди. Баарыбыз сыяктуу.",
          },
        },
      },
      {
        id: "buy_used",
        text: {
          ru: "Взять б/у с Дордоя",
          en: "Buy a used one at Dordoi",
          ky: "Дордойдон колдонулганын алуу",
        },
        requires: { minMoney: 15000 },
        effects: {
          stats: { money: -15000, mood: 6 },
          diary: {
            ru: "Купил б/у ноутбук на Дордое. Продавец поклялся мамой — пока держит слово.",
            en: "Bought a used laptop at Dordoi. The seller swore on his mother — so far he's keeping his word.",
            ky: "Дордойдон колдонулган ноутбук алдым. Сатуучу апасы менен ант берди — азырынча сөзүндө турат.",
          },
        },
      },
      {
        id: "borrow_friend",
        text: {
          ru: "Ночной ноутбук одногруппника за плов",
          en: "Borrow a classmate's laptop at night, pay in plov",
          ky: "Курсташтын ноутбугун түнкүсүн палоого алуу",
        },
        effects: {
          stats: { money: -400, energy: -12, relationships: 8 },
          diary: {
            ru: "Месяц работал по ночам на чужом ноутбуке. Проект сдан, плов приготовлен, дружба укреплена.",
            en: "Worked a month of nights on someone else's laptop. Project submitted, plov cooked, friendship strengthened.",
            ky: "Бир ай бөлөк ноутбукта түн бою иштедим. Долбоор тапшырылды, палоо бышырылды, достук бекемделди.",
          },
        },
      },
    ],
  },
];
