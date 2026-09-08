import type { Localized } from "../../model/localized";
import type { GameEvent } from "../../model/types";

/**
 * Сезон 5 · «Своя дорога» — 27+. Итоги подводятся сами, важно не мешать.
 *
 * Контракт с бэкендом — по кодам и эффектам (см. season1.ts).
 */
export const SEASON_5_EVENTS: GameEvent<Localized>[] = [
  {
    code: "s5_pyramid",
    season: 5,
    kicker: {
      ru: "WhatsApp · «возможность»",
      en: "WhatsApp · “an opportunity”",
      ky: "WhatsApp · «мүмкүнчүлүк»",
    },
    key: true,
    text: {
      ru: "Одноклассник (тот, что в белом пиджаке на всех фото) зовёт в «инвест-клуб»: гарантированные 10% в месяц, «люди уже забирают прибыль». Для входа — всего 20 000. Половина знакомых уже там.",
      en: "A classmate (the one in a white blazer in every photo) invites you into an “investment club”: a guaranteed 10% a month, “people are already taking profits”. Entry is just 20,000. Half your acquaintances are already in.",
      ky: "Классташың (бардык сүрөттө ак пиджак кийген ошол) «инвест-клубга» чакырат: айына кепилденген 10%, «эл эбак пайда алып жатат». Кирүү үчүн болгону 20 000. Тааныштарыңдын жарымы ошол жакта.",
    },
    choices: [
      {
        id: "invest_pyramid",
        text: {
          ru: "Зайти на 20 000 — все же заходят",
          en: "Put in 20,000 — everyone else is",
          ky: "20 000 салуу — баары кирип жатпайбы",
        },
        requires: { minMoney: 20_000 },
        effects: {
          stats: { money: -20_000, mood: -10 },
          card: "scam_radar",
          diary: {
            ru: "«Инвест-клуб» испарился вместе с белым пиджаком. Минус двадцать тысяч, плюс прививка на всю жизнь.",
            en: "The “investment club” evaporated along with the white blazer. Minus twenty thousand, plus a lifelong vaccination.",
            ky: "«Инвест-клуб» ак пиджак менен кошо жок болду. Минус жыйырма миң, плюс өмүр бою эмдөө.",
          },
        },
      },
      {
        id: "decline_math",
        text: {
          ru: "Спросить, откуда берутся 10% в месяц",
          en: "Ask where the 10% a month comes from",
          ky: "Айына 10% кайдан келерин суроо",
        },
        primary: true,
        effects: {
          stats: { mood: 4 },
          card: "scam_radar",
          diary: {
            ru: "Спросил у «инвест-клуба», откуда доходность. Ответ был про «энергию денег». Вышел из чата.",
            en: "Asked the “investment club” where the returns come from. The answer involved “the energy of money”. I left the chat.",
            ky: "«Инвест-клубдан» киреше кайдан келерин сурадым. Жообу «акчанын энергиясы» жөнүндө болду. Чаттан чыгып кеттим.",
          },
        },
      },
      {
        id: "warn_others",
        text: {
          ru: "Отказаться и отговорить родню",
          en: "Refuse and talk the family out of it",
          ky: "Баш тартып, тууганларды тыюу",
        },
        effects: {
          stats: { relationships: 8, mood: 2 },
          flags: { communityPath: true },
          card: "scam_radar",
          diary: {
            ru: "Вытащил тётю из «инвест-клуба» за неделю до его исчезновения. Герой без плаща.",
            en: "Pulled my aunt out of the “investment club” a week before it vanished. A hero without a cape.",
            ky: "Жеңемди «инвест-клубдан» жок болордон бир жума мурун сууруп чыктым. Плащсыз баатыр.",
          },
        },
      },
    ],
  },
  {
    code: "s5_debt_reckoning",
    season: 5,
    kicker: {
      ru: "Стол · вечер с калькулятором",
      en: "The table · an evening with a calculator",
      ky: "Стол · калькулятор менен кечки убак",
    },
    text: {
      ru: "Сел разобрать бумаги: долги, которые «потом отдам», собрались в внушительную стопку. Проценты не спали ни одной ночи. Пора решать по-взрослому.",
      en: "Sat down to sort the papers: the debts you'd “pay back later” have grown into an impressive stack. The interest hasn't slept a single night. Time to deal with it like an adult.",
      ky: "Кагаздарды иреттегени отурдум: «кийин кайтарам» деген карыздар олуттуу үймөккө айланыптыр. Пайыз бир түн да уктаган эмес. Чоң кишидей чечкен убак.",
    },
    requires: { hasDebt: true },
    weight: 3,
    choices: [
      {
        id: "aggressive_payoff",
        text: {
          ru: "Гасить агрессивно: сначала самый дорогой",
          en: "Pay aggressively: the most expensive one first",
          ky: "Катуу төлөө: адегенде эң кымбаты",
        },
        primary: true,
        effects: {
          payDebt: 45_000,
          stats: { mood: 6 },
          card: "debt_first",
          diary: {
            ru: "Составил план: гашу сначала самый дорогой долг. Каждый закрытый — как перевал позади.",
            en: "Made a plan: pay off the most expensive debt first. Every one closed feels like a mountain pass behind me.",
            ky: "План түздүм: адегенде эң кымбат карызды жабам. Ар бир жабылганы — артта калган ашуудай.",
          },
        },
      },
      {
        id: "minimum_pay",
        text: {
          ru: "Платить минималки — жить тоже надо",
          en: "Pay the minimum — you have to live too",
          ky: "Минимум төлөө — жашаш да керек",
        },
        effects: {
          payDebt: 10_000,
          stats: { mood: -2 },
          diary: {
            ru: "Плачу по долгам минимум. Проценты хмыкают и продолжают расти.",
            en: "Paying the minimum on my debts. The interest smirks and keeps growing.",
            ky: "Карызга минимум төлөп жатам. Пайыз жылмайып, өсө берет.",
          },
        },
      },
      {
        id: "ignore_debts",
        text: {
          ru: "Отложить бумаги обратно в ящик",
          en: "Put the papers back in the drawer",
          ky: "Кагаздарды кайра тартмага салуу",
        },
        effects: {
          stats: { mood: -6 },
          diary: {
            ru: "Убрал долговые бумаги в ящик. Ящик тяжелеет даже на вид.",
            en: "Put the debt papers back in the drawer. The drawer looks heavier every time.",
            ky: "Карыз кагаздарын тартмага салып койдум. Тартма көзгө деле оордоп баратат.",
          },
        },
      },
    ],
  },
  {
    code: "s5_mentor_youth",
    season: 5,
    kicker: {
      ru: "Школа · просьба",
      en: "School · a request",
      ky: "Мектеп · өтүнүч",
    },
    text: {
      ru: "Директор родной школы просит выступить перед выпускниками: «Расскажи, как оно там, во взрослой жизни». Гонорара нет, есть чай с боорсоками и тридцать пар глаз, которые всё запомнят.",
      en: "The principal of your old school asks you to speak to the graduating class: “Tell them what it's like out there, in adult life.” No fee — just tea with boorsok and thirty pairs of eyes that will remember everything.",
      ky: "Мектебиңдин директору бүтүрүүчүлөрдүн алдында сүйлөөнү сурайт: «Чоң жашоо кандай экенин айтып бер». Гонорар жок, боорсок менен чай жана баарын эстеп кала турган отуз жуп көз бар.",
    },
    choices: [
      {
        id: "mentor",
        text: {
          ru: "Прийти и рассказать честно — с граблями",
          en: "Go and tell it honestly — rakes and all",
          ky: "Барып, чынын айтуу — жаңылыштыктары менен",
        },
        primary: true,
        effects: {
          stats: { mood: 10, relationships: 8, energy: -4 },
          flags: { communityPath: true },
          diary: {
            ru: "Выступил перед выпускниками. Рассказал про все свои грабли поимённо. Смеялись и записывали.",
            en: "Spoke to the graduating class. Named every rake I'd stepped on. They laughed and took notes.",
            ky: "Бүтүрүүчүлөрдүн алдында сүйлөдүм. Бардык жаңылыштыктарымды атап айтып бердим. Күлүп, жазып алышты.",
          },
        },
      },
      {
        id: "decline_busy",
        text: {
          ru: "Отказаться — дел по горло",
          en: "Say no — up to my neck in work",
          ky: "Баш тартуу — иш мойнума чейин",
        },
        effects: {
          stats: { mood: -3 },
          diary: {
            ru: "Не пошёл в школу выступать. Дела были важные. Уже не помню какие.",
            en: "Didn't go to speak at the school. The business was important. I no longer remember what it was.",
            ky: "Мектепке сүйлөгөнү барган жокмун. Иштер маанилүү эле. Кайсынысы экени эсимде жок.",
          },
        },
      },
    ],
  },
  {
    code: "s5_parents_house",
    season: 5,
    kicker: {
      ru: "Айыл · отцовский дом",
      en: "The village · my father's house",
      ky: "Айыл · атамдын үйү",
    },
    text: {
      ru: "Отцовскому дому нужен ремонт: фундамент повело, зимой холодно. Братья-сёстры готовы скинуться, но смотрят на тебя — кто сколько. Твоя доля по-хорошему — 15 000.",
      en: "Your father's house needs repairs: the foundation has shifted, it's cold in winter. Your siblings are ready to chip in, but they're looking at you to set the amount. Your fair share is 15,000.",
      ky: "Атамдын үйүнө оңдоо керек: пайдубалы кыйшайган, кышында суук. Бир туугандар акча кошконго даяр, бирок ким канча берерин сага карап турушат. Сенин үлүшүң — 15 000.",
    },
    choices: [
      {
        id: "pay_share_plus",
        text: {
          ru: "Дать больше своей доли — могу же",
          en: "Give more than my share — I can afford it",
          ky: "Үлүшүмдөн көбүрөөк берүү — чамам жетет",
        },
        requires: { minMoney: 25_000 },
        effects: {
          stats: { money: -25_000, relationships: 14, mood: 6 },
          flags: { familyFirst: true },
          diary: {
            ru: "Вложился в отцовский дом больше всех. Отец ничего не сказал, но руку пожал дольше обычного.",
            en: "Put more into my father's house than anyone. He said nothing, but held my hand a little longer than usual.",
            ky: "Атамдын үйүнө баарынан көп салдым. Атам эчтеке дебеди, бирок колумду адаттагыдан узагыраак кармап турду.",
          },
        },
      },
      {
        id: "pay_share",
        text: {
          ru: "Дать свою долю — по-честному",
          en: "Give my share — fair and square",
          ky: "Өз үлүшүмдү берүү — адилет",
        },
        primary: true,
        effects: {
          stats: { money: -15_000, relationships: 8 },
          flags: { familyFirst: true },
          diary: {
            ru: "Скинулся на ремонт отцовского дома наравне со всеми. Зимой там будет тепло.",
            en: "Chipped in for my father's house repairs like everyone else. It'll be warm there this winter.",
            ky: "Атамдын үйүн оңдоого баары менен тең кошулдум. Кышында ал жерде жылуу болот.",
          },
        },
      },
      {
        id: "pay_later",
        text: {
          ru: "Пообещать позже — сейчас никак",
          en: "Promise later — right now I can't",
          ky: "Кийин деп убада берүү — азыр мүмкүн эмес",
        },
        effects: {
          stats: { relationships: -8, mood: -5 },
          diary: {
            ru: "Сказал, что скинусь на дом позже. Братья кивнули. Слово «позже» повисло в воздухе.",
            en: "Said I'd chip in for the house later. My brothers nodded. The word “later” hung in the air.",
            ky: "Үйгө кийин кошулам дедим. Бир туугандар баш ийкешти. «Кийин» деген сөз абада илинип калды.",
          },
        },
      },
    ],
  },
  {
    code: "s5_final_bet",
    season: 5,
    kicker: {
      ru: "Развилка · на что ставишь",
      en: "Crossroads · what do you bet on",
      ky: "Айрылыш · эмнеге таянасың",
    },
    key: true,
    text: {
      ru: "Тридцать близко. Если честно спросить себя, на что поставить ближайшие годы — что ответишь? Не для родни, не для ленты. Для себя.",
      en: "Thirty is close. If you honestly ask yourself what to bet the coming years on — what's your answer? Not for the family, not for the feed. For yourself.",
      ky: "Отуз жакын калды. Өзүңдөн чын жүрөктөн сурасаң, алдыдагы жылдарды эмнеге сарптайсың — эмне дейсиң? Тууганлар үчүн эмес, лента үчүн эмес. Өзүң үчүн.",
    },
    choices: [
      {
        id: "bet_business",
        text: {
          ru: "На дело: хочу строить своё",
          en: "On business: I want to build my own",
          ky: "Ишке: өз ишимди курууну каалайм",
        },
        effects: {
          stats: { energy: -6, money: 30_000 },
          flags: { hasBusiness: true },
          diary: {
            ru: "Решил: ставлю на своё дело — и первые годы уже приносят. Пусть штормит, штурвал мой.",
            en: "Decided: I'm betting on my own business — and the first years are already paying off. Let it storm; the wheel is mine.",
            ky: "Чечтим: өз ишиме таянам — биринчи жылдары эле киреше берип жатат. Бороон болсо болсун, руль менин колумда.",
          },
        },
      },
      {
        id: "bet_family",
        text: {
          ru: "На семью и своих людей",
          en: "On family and my own people",
          ky: "Үй-бүлөгө жана өз адамдарыма",
        },
        effects: {
          stats: { relationships: 12, mood: 6 },
          flags: { familyFirst: true },
          diary: {
            ru: "Решил: главная инвестиция — свои люди. Дивиденды — по воскресеньям за общим столом.",
            en: "Decided: the main investment is my people. The dividends arrive on Sundays around a shared table.",
            ky: "Чечтим: башкы инвестиция — өз адамдарым. Дивиденд жекшемби күндөрү жалпы дасторкондо келет.",
          },
        },
      },
      {
        id: "bet_peace",
        text: {
          ru: "На спокойствие: хватит гнаться",
          en: "On peace: enough chasing",
          ky: "Тынчтыкка: кубалаган жетишет",
        },
        effects: {
          stats: { mood: 10, energy: 8 },
          diary: {
            ru: "Решил больше не гнаться. Оказалось, тишина — это не проигрыш, а приз.",
            en: "Decided to stop chasing. Turns out silence isn't a loss — it's the prize.",
            ky: "Кубалаганды токтотууну чечтим. Тынчтык — жеңилүү эмес, сыйлык экен.",
          },
        },
      },
      {
        id: "bet_road",
        text: {
          ru: "На дорогу: мир большой",
          en: "On the road: the world is big",
          ky: "Жолго: дүйнө чоң",
        },
        effects: {
          stats: { mood: 6, money: -5000 },
          flags: { wentAbroad: true },
          diary: {
            ru: "Решил, что мир больше одного города. Собираю рюкзак и планы.",
            en: "Decided the world is bigger than one city. Packing my backpack and my plans.",
            ky: "Дүйнө бир шаардан чоң экенин чечтим. Рюкзагымды жана пландарымды чогултуп жатам.",
          },
        },
      },
    ],
  },
  {
    code: "s5_issyk_kul_final",
    season: 5,
    kicker: {
      ru: "Иссык-Куль · берег",
      en: "Issyk-Kul · the shore",
      ky: "Ысык-Көл · жээк",
    },
    text: {
      ru: "Ты снова на том же берегу, что и в семнадцать. Вода такая же холодная, горы такие же спокойные. Только ты — другой. Телефон жужжит рабочими чатами.",
      en: "You're back on the same shore as at seventeen. The water is just as cold, the mountains just as calm. Only you are different. Your phone buzzes with work chats.",
      ky: "Он жетидеги ошол эле жээктесиң. Суу мурдагыдай эле муздак, тоолор мурдагыдай эле тынч. Бир гана сен башкасың. Телефон жумуш чаттары менен ызылдайт.",
    },
    choices: [
      {
        id: "phone_off",
        text: {
          ru: "Выключить телефон и просто сидеть",
          en: "Switch off the phone and just sit",
          ky: "Телефонду өчүрүп, жөн эле отуруу",
        },
        primary: true,
        effects: {
          stats: { mood: 12, energy: 10 },
          diary: {
            ru: "Выключил телефон на берегу Иссык-Куля. Час тишины — и все ответы нашлись сами.",
            en: "Switched off my phone on the shore of Issyk-Kul. An hour of silence and all the answers found themselves.",
            ky: "Ысык-Көлдүн жээгинде телефонду өчүрдүм. Бир саат тынчтык — бардык жооптор өзү табылды.",
          },
        },
      },
      {
        id: "call_family",
        text: {
          ru: "Позвонить родителям — просто так",
          en: "Call my parents — for no reason",
          ky: "Ата-энеге чалуу — жөн эле",
        },
        effects: {
          stats: { relationships: 10, mood: 8 },
          flags: { familyFirst: true },
          diary: {
            ru: "Позвонил родителям с берега — просто так, без повода. Мама сначала испугалась, потом мы час смеялись.",
            en: "Called my parents from the shore — for no reason at all. Mom got scared at first, then we laughed for an hour.",
            ky: "Жээктен ата-энеме чалдым — жөн эле, себепсиз. Апам адегенде коркуп кетти, анан бир саат күлүштүк.",
          },
        },
      },
      {
        id: "plan_next",
        text: {
          ru: "Достать блокнот и написать план на пять лет",
          en: "Take out a notebook and write a five-year plan",
          ky: "Дептер алып, беш жылдык план жазуу",
        },
        effects: {
          stats: { mood: 5, energy: -3 },
          flags: { selfInvest: true },
          diary: {
            ru: "Написал на берегу план на пять лет. Пункт первый: чаще сюда приезжать.",
            en: "Wrote a five-year plan on the shore. Item one: come here more often.",
            ky: "Жээкте беш жылдык план жаздым. Биринчи пункт: бул жерге көбүрөөк келүү.",
          },
        },
      },
    ],
  },
];
