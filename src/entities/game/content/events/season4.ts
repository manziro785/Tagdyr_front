import type { Localized } from "../../model/localized";
import type { GameEvent } from "../../model/types";

/**
 * Сезон 4 · «Зрелость» — 22–26. Ставки растут: семья, жильё, своё дело.
 *
 * Контракт с бэкендом — по кодам и эффектам (см. season1.ts).
 */
export const SEASON_4_EVENTS: GameEvent<Localized>[] = [
  {
    code: "s4_marriage_fork",
    season: 4,
    kicker: {
      ru: "Семья · большой разговор",
      en: "Family · the big talk",
      ky: "Үй-бүлө · чоң сүйлөшүү",
    },
    key: true,
    text: {
      ru: "Родня перешла от намёков к действиям: «Сколько можно ходить одному, вот дочка/сын знакомых…». А у тебя и правда есть человек, с которым хорошо. Той — это счастье, но ещё это калым, ресторан на двести человек и минус все накопления.",
      en: "The family has moved from hints to action: “How long will you stay alone? Look, our friends have a daughter/son…” And you really do have someone you're happy with. A toi is joy — but it's also the bride price, a restaurant for two hundred and all your savings gone.",
      ky: "Тууганлар кыйытуудан ишке өттү: «Качанга чейин жалгыз жүрөсүң, тааныштардын кызы/уулу бар…». Чынында сага жагымдуу адам бар да. Той — бул бакыт, бирок ошол эле учурда калың, эки жүз кишилик ресторан жана бүт топтогон акчаң минуска.",
    },
    choices: [
      {
        id: "wedding_big",
        text: {
          ru: "Жениться с размахом — один раз живём",
          en: "A big wedding — you only live once",
          ky: "Чоң той жасоо — өмүр бир жолу",
        },
        primary: true,
        effects: {
          stats: { money: -40_000, relationships: 15, mood: 10, energy: -8 },
          flags: { married: true, familyFirst: true },
          diary: {
            ru: "Сыграли той на двести человек. Денег нет, зато видео пересматривает вся долина.",
            en: "Threw a toi for two hundred people. No money left, but the whole valley keeps rewatching the video.",
            ky: "Эки жүз кишилик той бердик. Акча жок, бирок видеону бүт өрөөн кайра-кайра көрөт.",
          },
        },
      },
      {
        id: "wedding_small",
        text: {
          ru: "Скромно: загс, плов для своих",
          en: "Modestly: registry office, plov for our own",
          ky: "Жөнөкөй: ЗАГС, өзүбүздүкүлөргө палоо",
        },
        effects: {
          stats: { money: -10_000, relationships: 6, mood: 8 },
          flags: { married: true },
          diary: {
            ru: "Расписались тихо, плов был только для своих. Родня поворчала и съела добавку.",
            en: "Signed the papers quietly, plov only for the close ones. The relatives grumbled — and went back for seconds.",
            ky: "Тынч эле кол коюп койдук, палоо жакындарга гана болду. Тууганлар күңкүлдөп, кошумча алып жешти.",
          },
        },
      },
      {
        id: "not_yet",
        text: {
          ru: "Пока рано — сначала на ноги встану",
          en: "Not yet — first I get on my feet",
          ky: "Азырынча эрте — адегенде бутума турайын",
        },
        effects: {
          stats: { mood: -4, relationships: -6 },
          diary: {
            ru: "Сказал родне «пока рано». Тётушки сверили часы и пообещали вернуться к теме.",
            en: "Told the family “not yet”. The aunts synchronised their watches and promised to return to the subject.",
            ky: "Тууганлара «азырынча эрте» дедим. Жеңелер саатын салыштырып, темага кайра кайрылабыз деп кетишти.",
          },
        },
      },
    ],
  },
  {
    code: "s4_housing_fork",
    season: 4,
    kicker: {
      ru: "Жильё · вечный вопрос",
      en: "Housing · the eternal question",
      ky: "Турак жай · түбөлүк суроо",
    },
    key: true,
    text: {
      ru: "Аренда съедает четверть дохода, и это навсегда. Ипотека на окраине — 12% на 15 лет, зато своё. А отец говорит: «Приезжай, достроим дом у нас — за те же деньги дворец будет». Правда, работа там — вопрос.",
      en: "Rent eats a quarter of your income, and that's forever. A mortgage on the edge of town is 12% for 15 years — but it's yours. And your father says: “Come home, we'll finish the house here — for the same money you'll have a palace.” Work there, though, is a question.",
      ky: "Ижара кирешенин чейрегин жеп жатат, бул түбөлүккө. Шаардын четиндеги ипотека — 15 жылга 12%, бирок өзүңдүкү. Атам болсо: «Кел, үйдү бүтүрөбүз — ушул акчага сарай болот» дейт. Бирок ал жактагы жумуш — суроо бойдон.",
    },
    choices: [
      {
        id: "mortgage",
        text: {
          ru: "Ипотека: своё, хоть и в бетоне на 15 лет",
          en: "Mortgage: mine, even if it's concrete for 15 years",
          ky: "Ипотека: 15 жылдык бетон болсо да — өзүмдүкү",
        },
        requires: { minMoney: 20_000 },
        effects: {
          stats: { money: -20_000, mood: 8 },
          debt: { amount: 30_000, rate: 0.12 },
          flags: { hasHome: true },
          card: "invest_early",
          diary: {
            ru: "Собрал первоначальный взнос и взял ипотеку. Свои 42 квадрата и свой 15-летний план.",
            en: "Scraped together the down payment and took the mortgage. My own 42 square metres and my own 15-year plan.",
            ky: "Баштапкы төгүмдү чогултуп, ипотека алдым. Өз 42 чарчы метрим жана өз 15 жылдык планым.",
          },
        },
      },
      {
        id: "keep_renting",
        text: {
          ru: "Снимать дальше, разницу — откладывать",
          en: "Keep renting, save the difference",
          ky: "Ижарада кала берүү, айырманы топтоо",
        },
        primary: true,
        effects: {
          stats: { money: 5000 },
          flags: { savedEmergencyFund: true },
          card: "invest_early",
          diary: {
            ru: "Посчитал: аренда плюс накопления пока выгоднее ипотеки. Таблицу храню как оберег.",
            en: "Did the math: renting plus saving still beats the mortgage. I keep the spreadsheet like a talisman.",
            ky: "Эсептеп көрдүм: ижара плюс топтоо азырынча ипотекадан пайдалуу. Таблицаны тумардай сактайм.",
          },
        },
      },
      {
        id: "build_village",
        text: {
          ru: "Строиться в селе — там простор",
          en: "Build in the village — there's room to breathe",
          ky: "Айылда куруу — ал жакта кеңдик бар",
        },
        effects: {
          stats: { money: -20_000, relationships: 10, mood: 5 },
          flags: { backToVillage: true, hasHome: true },
          diary: {
            ru: "Начали достраивать дом в селе. Каждые выходные — цемент, тосты и отцовские советы.",
            en: "We started finishing the house in the village. Every weekend: cement, toasts and my father's advice.",
            ky: "Айылдагы үйдү бүтүрө баштадык. Ар дем алыш — цемент, тосттор жана атамдын кеңештери.",
          },
        },
      },
    ],
  },
  {
    code: "s4_parents_health",
    season: 4,
    kicker: {
      ru: "Звонок · из дома",
      en: "A call · from home",
      ky: "Чалуу · үйдөн",
    },
    text: {
      ru: "Маме нужна операция на колене. Не срочно-страшная, но тянуть нельзя. В государственной — очередь до зимы, в частной — 25 000 и на следующей неделе.",
      en: "Mom needs a knee operation. Not an emergency, but it can't wait long. At the state hospital the queue runs until winter; at a private one it's 25,000 and next week.",
      ky: "Апама тизесине операция керек. Шашылыш эмес, бирок создуктурууга болбойт. Мамлекеттикинде — кезек кышка чейин, жеке клиникада — 25 000 жана кийинки жумада.",
    },
    choices: [
      {
        id: "pay_private",
        text: {
          ru: "Платить за частную — мама одна",
          en: "Pay for the private clinic — you only have one mother",
          ky: "Жеке клиникага төлөө — апам бирөө",
        },
        primary: true,
        effects: {
          stats: { money: -25_000, relationships: 14, mood: 4 },
          flags: { familyFirst: true },
          diary: {
            ru: "Оплатил маме операцию в частной. Через месяц она уже гоняла кур по двору. Стоило каждого сома.",
            en: "Paid for Mom's operation at the private clinic. A month later she was chasing chickens around the yard. Worth every som.",
            ky: "Апама жеке клиникада операцияны төлөдүм. Бир айдан кийин короодо тоок кубалап жүрдү. Ар бир сомго арзыды.",
          },
        },
      },
      {
        id: "pay_debt",
        text: {
          ru: "Занять, но сделать сейчас",
          en: "Borrow, but do it now",
          ky: "Карыз алып, азыр жасатуу",
        },
        requires: { maxMoney: 25_000 },
        effects: {
          debt: { amount: 25_000, rate: 0.14 },
          stats: { relationships: 14, mood: 2 },
          flags: { familyFirst: true },
          diary: {
            ru: "Занял на операцию маме. Долг тяжёлый, но её шаги по двору — легче лёгкого.",
            en: "Borrowed for Mom's operation. The debt is heavy, but her steps across the yard are lighter than air.",
            ky: "Апамдын операциясына карыз алдым. Карыз оор, бирок анын короодогу кадамдары жеңилден жеңил.",
          },
        },
      },
      {
        id: "wait_queue",
        text: {
          ru: "Ждать очередь в государственной",
          en: "Wait for the state hospital queue",
          ky: "Мамлекеттик клиникада кезек күтүү",
        },
        effects: {
          stats: { relationships: -8, mood: -8 },
          diary: {
            ru: "Встали в очередь на операцию. Мама говорит «нормально, потерплю». От этого только хуже.",
            en: "Got in the queue for the operation. Mom says “it's fine, I'll manage”. That only makes it worse.",
            ky: "Операцияга кезекке турдук. Апам «эчтеке эмес, чыдайм» дейт. Ушундан улам ого бетер оор.",
          },
        },
      },
    ],
  },
  {
    code: "s4_burnout_check",
    season: 4,
    kicker: {
      ru: "Работа · предложение",
      en: "Work · an offer",
      ky: "Жумуш · сунуш",
    },
    text: {
      ru: "Предлагают второй проект «на вырост»: плюс 15 000 в месяц, минус выходные на полгода. Зеркало уже сейчас показывает человека, которому не помешал бы отпуск.",
      en: "They offer you a second project “to grow into”: plus 15,000 a month, minus your weekends for half a year. The mirror already shows someone who could use a holiday.",
      ky: "Экинчи долбоорду «өсүү үчүн» сунушташат: айына плюс 15 000, жарым жылга дем алыш күндөрүң минуска. Күзгү азыртан эле эс алуу керек болгон адамды көрсөтүп турат.",
    },
    choices: [
      {
        id: "take_project",
        text: {
          ru: "Взять: деньги сейчас нужнее сна",
          en: "Take it: right now money beats sleep",
          ky: "Алуу: азыр акча уйкудан керектүү",
        },
        effects: {
          stats: { money: 40_000, energy: -20, mood: -8 },
          card: "health_asset",
          diary: {
            ru: "Взял второй проект и тянул его годы. Кофе стал едой, выходные — легендой. Но счёт вырос всерьёз.",
            en: "Took the second project and dragged it for years. Coffee became food, weekends became a legend. But the balance grew for real.",
            ky: "Экинчи долбоорду алып, жылдап тарттым. Кофе тамакка айланды, дем алыш — уламышка. Бирок эсеп чын эле өстү.",
          },
        },
      },
      {
        id: "decline_rest",
        text: {
          ru: "Отказаться и беречь себя",
          en: "Turn it down and look after myself",
          ky: "Баш тартып, өзүмдү аяо",
        },
        primary: true,
        effects: {
          stats: { energy: 18, mood: 12, money: 15_000 },
          card: "health_asset",
          diary: {
            ru: "От второго проекта отказался: работал спокойно, копил понемногу и раз в год уезжал на Сон-Куль.",
            en: "Turned down the second project: worked calmly, saved little by little and went to Son-Kul once a year.",
            ky: "Экинчи долбоордон баш тарттым: тынч иштедим, аз-аздан топтодум, жылына бир жолу Соң-Көлгө бардым.",
          },
        },
      },
      {
        id: "negotiate_terms",
        text: {
          ru: "Взять, но выторговать помощника",
          en: "Take it, but negotiate an assistant",
          ky: "Алуу, бирок жардамчыны соодалашып алуу",
        },
        chance: 55,
        effects: {
          stats: { money: 32_000, energy: -10 },
          card: "haggle",
          diary: {
            ru: "Взял проект, но выбил помощника. Учусь делегировать — сложнее, чем работать самому.",
            en: "Took the project but got an assistant out of it. Learning to delegate — harder than doing it myself.",
            ky: "Долбоорду алдым, бирок жардамчыны жеңип алдым. Тапшырганды үйрөнүп жатам — өзүң иштегенден кыйын.",
          },
        },
        failEffects: {
          stats: { money: 40_000, energy: -20, mood: -6 },
          diary: {
            ru: "Помощника пообещали «после квартала». Кварталов прошло восемь.",
            en: "The assistant was promised “after this quarter”. Eight quarters have passed.",
            ky: "Жардамчыны «кварталдан кийин» деп убада кылышты. Сегиз квартал өттү.",
          },
        },
        failText: {
          ru: "«Помощника дадим после квартала» — классика.",
          en: "“We'll give you an assistant after the quarter” — a classic.",
          ky: "«Жардамчыны кварталдан кийин беребиз» — эски эле ыр.",
        },
      },
    ],
  },
  {
    code: "s4_business_leap",
    season: 4,
    kicker: {
      ru: "Накопления · развилка",
      en: "Savings · a fork in the road",
      ky: "Топтогон акча · айрылыш",
    },
    requires: { minMoney: 30_000, notFlag: "hasBusiness" },
    text: {
      ru: "На счету — приличная сумма, и она жжёт карман. Друг зовёт в долю: кофейня у университета, «место золотое, студенты пьют как не в себя». Или спокойный депозит под 12% — скучно, зато спится хорошо.",
      en: "There's a decent sum in your account and it's burning a hole in your pocket. A friend offers you a share: a coffee shop by the university, “golden spot, students drink like there's no tomorrow”. Or a quiet deposit at 12% — boring, but you sleep well.",
      ky: "Эсепте чоңураак сумма бар жана ал чөнтөктү өрттөп жатат. Досуң үлүшкө чакырат: университеттин жанындагы кофейня, «орду алтын, студенттер аябай ичет». Же тынч депозит 12% менен — кызыксыз, бирок уйкуң тынч.",
    },
    choices: [
      {
        id: "open_business",
        text: {
          ru: "В долю! Кофейня — это красиво",
          en: "Go in on it! A coffee shop sounds beautiful",
          ky: "Үлүшкө! Кофейня — бул кооз",
        },
        chance: 55,
        effects: {
          stats: { money: -8000, mood: 10, energy: -10 },
          flags: { hasBusiness: true },
          card: "income_streams",
          diary: {
            ru: "Вложился в кофейню у универа. Через два года вложения почти отбились — и это уже моё дело.",
            en: "Invested in the coffee shop by the university. Two years later it had almost paid back — and it's my own business now.",
            ky: "Университеттин жанындагы кофейняга акча салдым. Эки жылда салган акча дээрлик кайтты — эми бул өз ишим.",
          },
        },
        failEffects: {
          stats: { money: -30_000, mood: -12, energy: -10 },
          diary: {
            ru: "Кофейня не взлетела: рядом открылись ещё две. Урок за тридцать тысяч — дорогая школа.",
            en: "The coffee shop never took off: two more opened next door. A thirty-thousand lesson — expensive school.",
            ky: "Кофейня көтөрүлгөн жок: жанынан дагы экөө ачылды. Отуз миңдик сабак — кымбат мектеп.",
          },
        },
        failText: {
          ru: "Через квартал рядом открылись ещё две кофейни…",
          en: "A quarter later, two more coffee shops opened next door…",
          ky: "Бир кварталдан кийин жанынан дагы эки кофейня ачылды…",
        },
      },
      {
        id: "deposit",
        text: {
          ru: "Депозит: пусть деньги работают тихо",
          en: "Deposit: let the money work quietly",
          ky: "Депозит: акча тынч иштей берсин",
        },
        primary: true,
        effects: {
          stats: { money: 12_000, mood: 3 },
          flags: { savedEmergencyFund: true },
          card: "invest_early",
          diary: {
            ru: "Положил на депозит и не трогал. Проценты за годы накапали ощутимо — тихая магия.",
            en: "Put it on deposit and didn't touch it. The interest added up noticeably over the years — quiet magic.",
            ky: "Депозитке салып, тийбедим. Жылдар бою пайыз байкаларлык топтолду — тынч сыйкыр.",
          },
        },
      },
      {
        id: "spend_family",
        text: {
          ru: "Вложить в дом и родителей",
          en: "Put it into the house and my parents",
          ky: "Үйгө жана ата-энеге жумшоо",
        },
        effects: {
          stats: { money: -20_000, relationships: 12 },
          flags: { familyFirst: true },
          diary: {
            ru: "Обновил родителям дом: котёл, окна, крыша. Мама плакала. Я, кажется, тоже.",
            en: "Renovated my parents' house: boiler, windows, roof. Mom cried. I think I did too.",
            ky: "Ата-энемдин үйүн жаңырттым: казан, терезе, чатыр. Апам ыйлады. Мен да ыйладым окшойт.",
          },
        },
      },
    ],
  },
  {
    code: "s4_master_degree",
    season: 4,
    kicker: {
      ru: "Универ · письмо",
      en: "University · a letter",
      ky: "Университет · кат",
    },
    requires: { flag: "academicPath" },
    weight: 2,
    text: {
      ru: "Научрук написал: есть грант на магистратуру, но стипендия — смешная, а совмещать с работой почти нереально. «У тебя голова, не потеряй её на базаре», — говорит он.",
      en: "Your supervisor wrote: there's a grant for a master's, but the stipend is laughable and combining it with a job is nearly impossible. “You've got a head on you — don't lose it at the bazaar,” he says.",
      ky: "Илимий жетекчим кат жазды: магистратурага грант бар, бирок стипендия күлкүлүү, жумуш менен айкаштыруу дээрлик мүмкүн эмес. «Башың бар, аны базарда жоготпо» дейт.",
    },
    choices: [
      {
        id: "go_masters",
        text: {
          ru: "Идти в магистратуру — голова дороже",
          en: "Go for the master's — the mind is worth more",
          ky: "Магистратурага баруу — баш кымбат",
        },
        primary: true,
        effects: {
          stats: { money: -10_000, mood: 8, energy: -8 },
          flags: { masterDegree: true },
          diary: {
            ru: "Поступил в магистратуру. Денег меньше, смысла — больше. Научрук доволен.",
            en: "Got into the master's programme. Less money, more meaning. My supervisor is pleased.",
            ky: "Магистратурага кирдим. Акча азыраак, маани көбүрөөк. Илимий жетекчим ыраазы.",
          },
        },
      },
      {
        id: "stay_work",
        text: {
          ru: "Остаться работать: наука подождёт",
          en: "Keep working: science can wait",
          ky: "Иштей берүү: илим күтө турат",
        },
        effects: {
          stats: { money: 20_000, mood: -4 },
          diary: {
            ru: "Отказался от магистратуры и ушёл в работу. Научрук вздохнул так, что слышали на третьем этаже.",
            en: "Turned down the master's and went into work. My supervisor sighed so loudly they heard it on the third floor.",
            ky: "Магистратурадан баш тартып, жумушка кеттим. Илимий жетекчим үшкүргөндө үчүнчү кабат укту.",
          },
        },
      },
    ],
  },
  {
    code: "s4_debt_payment",
    season: 4,
    kicker: {
      ru: "Банк · выписка",
      en: "Bank · the statement",
      ky: "Банк · көчүрмө",
    },
    requires: { hasDebt: true },
    weight: 3,
    text: {
      ru: "Выписка по долгам похожа на счётчик такси: цифры растут, даже когда стоишь. Сейчас есть чем гасить — вопрос, сколько отдать.",
      en: "The debt statement looks like a taxi meter: the numbers grow even when you're standing still. Right now you have something to pay with — the question is how much.",
      ky: "Карыз боюнча көчүрмө таксинин эсептегичине окшош: турганда да сан өсө берет. Азыр төлөгөнгө акча бар — маселе канча берүүдө.",
    },
    choices: [
      {
        id: "pay_big",
        text: {
          ru: "Гасить по-крупному, начиная с дорогого",
          en: "Pay big, starting with the most expensive",
          ky: "Чоң суммада, эң кымбатынан баштап төлөө",
        },
        primary: true,
        requires: { minMoney: 18_000 },
        effects: {
          payDebt: 35_000,
          stats: { mood: 8 },
          card: "debt_first",
          diary: {
            ru: "Сел и закрыл самый дорогой долг почти целиком. Впервые за годы выписка не пугает.",
            en: "Sat down and closed the most expensive debt almost entirely. For the first time in years the statement doesn't scare me.",
            ky: "Отуруп, эң кымбат карызды дээрлик толук жаптым. Жылдар ичинде биринчи жолу көчүрмө коркутпайт.",
          },
        },
      },
      {
        id: "pay_some",
        text: {
          ru: "Гасить сколько не жалко",
          en: "Pay whatever I won't miss",
          ky: "Кыйбаган өлчөмдө төлөө",
        },
        requires: { minMoney: 10_000 },
        effects: {
          payDebt: 12_000,
          stats: { mood: 3 },
          diary: {
            ru: "Скинул долгам немного сверх минималки. Счётчик замедлился, но тикает.",
            en: "Threw a bit more than the minimum at the debt. The meter slowed down, but it's still ticking.",
            ky: "Карызга минимумдан бир аз көбүрөөк төлөдүм. Эсептегич жайлады, бирок дагы эле тыкылдайт.",
          },
        },
      },
      {
        id: "pay_nothing",
        text: {
          ru: "Сейчас не до долгов",
          en: "No time for debts right now",
          ky: "Азыр карыздын убагы эмес",
        },
        effects: {
          stats: { mood: -4 },
          diary: {
            ru: "Отложил выписку «на потом». Проценты «потом» не знают.",
            en: "Put the statement aside “for later”. Interest doesn't know the word “later”.",
            ky: "Көчүрмөнү «кийин» деп жылдырдым. Пайыз «кийин» дегенди билбейт.",
          },
        },
      },
    ],
  },
  {
    code: "s4_village_call",
    season: 4,
    kicker: {
      ru: "Село · зовут обратно",
      en: "The village · they're calling you back",
      ky: "Айыл · кайра чакырышат",
    },
    requires: { notFlag: "wentAbroad" },
    text: {
      ru: "Односельчане затеяли кооператив: мёд, курут и войлок — на экспорт, юрты — туристам. Ищут своего человека «с городской головой». Доход поначалу скромный, зато горы — вот они.",
      en: "Your fellow villagers have started a cooperative: honey, kurut and felt for export, yurts for tourists. They're looking for one of their own “with a city head”. The income is modest at first, but the mountains are right there.",
      ky: "Айылдаштар кооператив түзүштү: бал, курут жана кийиз — экспортко, боз үй — туристтерге. «Шаардык башы бар» өз кишисин издешет. Киреше башында аз, бирок тоолор — мына ушул жерде.",
    },
    choices: [
      {
        id: "join_coop",
        text: {
          ru: "Вернуться и строить своё в селе",
          en: "Go back and build something of my own in the village",
          ky: "Кайтып барып, айылда өз ишимди куруу",
        },
        effects: {
          stats: { money: -5000, mood: 12, energy: 10, relationships: 10 },
          flags: { backToVillage: true },
          diary: {
            ru: "Вернулся в село строить кооператив. Интернет ловит на холме, зато воздух — везде.",
            en: "Went back to the village to build the cooperative. The internet only works on the hill, but the air is everywhere.",
            ky: "Кооператив курганы айылга кайттым. Интернет дөбөдө гана кармайт, бирок аба — бардык жерде.",
          },
        },
      },
      {
        id: "help_remote",
        text: {
          ru: "Помогать из города: сайт, продажи, связи",
          en: "Help from the city: website, sales, contacts",
          ky: "Шаардан жардам берүү: сайт, сатуу, байланыш",
        },
        primary: true,
        effects: {
          stats: { relationships: 8, energy: -6 },
          flags: { communityPath: true },
          diary: {
            ru: "Сделал односельчанам сайт и наладил продажи. Курут пошёл в Алматы, я — в люди.",
            en: "Built the villagers a website and set up sales. Kurut went to Almaty, and I went up in the world.",
            ky: "Айылдаштарга сайт жасап, сатууну жолго койдум. Курут Алматыга кетти, мен эл катарына кошулдум.",
          },
        },
      },
      {
        id: "decline_polite",
        text: {
          ru: "Вежливо отказаться — у меня своя дорога",
          en: "Politely decline — I have my own road",
          ky: "Сылык баш тартуу — менин өз жолум бар",
        },
        effects: {
          stats: { mood: -2 },
          diary: {
            ru: "Кооперативу отказал. Пусть без обид: у каждого свой перевал.",
            en: "Turned the cooperative down. No hard feelings: everyone has their own mountain pass.",
            ky: "Кооперативге жок дедим. Таарынышпасын: ар кимдин өз ашуусу бар.",
          },
        },
      },
    ],
  },
];
