import type { Localized } from "../../model/localized";
import type { GameEvent } from "../../model/types";

/**
 * Сезон 1 · «Выпускник» — 17 лет, родной айыл. Первые взрослые выборы.
 *
 * Контракт с бэкендом (packages/content/src/events/season1.ts) — по кодам и
 * эффектам: реплей сверяет только их. Тексты живут ТОЛЬКО здесь, на трёх
 * языках; серверная копия хранит русские строки и их никому не показывает.
 */
export const SEASON_1_EVENTS: GameEvent<Localized>[] = [
  {
    code: "s1_graduation",
    season: 1,
    kicker: {
      ru: "Школа · выпускной",
      en: "School · graduation night",
      ky: "Мектеп · бүтүрүү кечеси",
    },
    text: {
      ru: "Аттестат в руках, класс скидывается на выпускной в кафе у трассы. Классуха плачет, пацаны зовут гулять до утра, а отец многозначительно смотрит на часы: завтра сенокос.",
      en: "Diploma in hand, the class is chipping in for a graduation party at the café by the highway. Your homeroom teacher is crying, the guys want to party till dawn, and your father keeps glancing at the clock: haymaking starts tomorrow.",
      ky: "Аттестат колдо, класс трассанын жанындагы кафеде бүтүрүү кечесин өткөргөнү акча чогултуп жатат. Класс жетекчи ыйлайт, балдар таңга чейин сейилдейли дейт, атам болсо саатты маанилүү карап коёт: эртең чөп чабуу.",
    },
    choices: [
      {
        id: "party",
        text: {
          ru: "Гулять до утра — один раз живём",
          en: "Party till dawn — you only live once",
          ky: "Таңга чейин сейилдөө — өмүр бир жолу берилет",
        },
        effects: {
          stats: { money: -800, mood: 12, energy: -10, relationships: 6 },
          diary: {
            ru: "Выпускной отгуляли до рассвета — половина айыла слышала наши песни.",
            en: "We partied till sunrise — half the village heard us singing.",
            ky: "Бүтүрүү кечесин таң атканча өткөрдүк — ырыбызды айылдын жарымы укту.",
          },
        },
      },
      {
        id: "home_early",
        text: {
          ru: "Посидеть часок и домой — завтра дела",
          en: "Stay an hour and head home — work tomorrow",
          ky: "Бир саат отуруп үйгө — эртең жумуш бар",
        },
        effects: {
          stats: { money: -300, mood: 3, relationships: -4, energy: 5 },
          flags: { earlyBird: true },
          diary: {
            ru: "Ушёл с выпускного раньше всех. Обидно, но утром я один был живой.",
            en: "Left the party before everyone else. Stung a bit, but in the morning I was the only one alive.",
            ky: "Бүтүрүү кечесинен баарынан эрте кеттим. Ыңгайсыз, бирок эртең менен жалгыз мен тың элем.",
          },
        },
      },
    ],
  },
  {
    code: "s1_university_fork",
    season: 1,
    kicker: {
      ru: "Кухня · семейный совет",
      en: "Kitchen · family council",
      ky: "Ашкана · үй-бүлөлүк кеңеш",
    },
    key: true,
    text: {
      ru: "Большой семейный совет: поступать в Бишкек или нет. Грант не дали — контракт стоит 40 000 в год. Дядя предлагает встать с ним на точку на рынке: «Пока твои будут учиться, ты заработаешь». Мама молчит и смотрит на тебя.",
      en: "A big family council: go study in Bishkek or not. No grant — the contract costs 40,000 a year. Your uncle offers you a spot at his stall in the bazaar: “While your classmates study, you'll be earning.” Mom says nothing and looks at you.",
      ky: "Чоң үй-бүлөлүк кеңеш: Бишкекке окууга барасыңбы, жокпу. Грант тийген жок — контракт жылына 40 000 сом. Байкең базардагы соода түйүнүнө чакырат: «Курсташтарың окуганча, сен акча табасың». Апам унчукпай, сага карап турат.",
    },
    choices: [
      {
        id: "university_debt",
        text: {
          ru: "Поступать. Займём на контракт у родни",
          en: "Enroll. We'll borrow for the contract from relatives",
          ky: "Окууга кирүү. Контрактка тууганлардан карыз алабыз",
        },
        primary: true,
        effects: {
          flags: { higherEd: true, studentPath: true },
          debt: { amount: 20_000, rate: 0.06 },
          stats: { mood: 8 },
          diary: {
            ru: "Поступил! Контракт — в долг у родни под честное слово и щадящие 6%.",
            en: "I got in! The contract paid with money borrowed from relatives — on a handshake and a merciful 6%.",
            ky: "Окууга кирдим! Контрактты тууганлардан карызга алдым — ант-убада менен, жумшак 6% менен.",
          },
        },
      },
      {
        id: "work_bazaar",
        text: {
          ru: "На точку с дядей — деньги сейчас важнее",
          en: "Take the stall with my uncle — money now matters more",
          ky: "Байкем менен базарга — акча азыр маанилүү",
        },
        effects: {
          flags: { bazaarPath: true },
          stats: { money: 6000, energy: -8 },
          diary: {
            ru: "Встал на точку с дядей. Пахнет пылью, деньгами и мандаринами.",
            en: "Started working the stall with my uncle. Smells of dust, money and tangerines.",
            ky: "Байкем менен базарга турдум. Чаң, акча жана мандарин жыттанат.",
          },
        },
      },
      {
        id: "stay_village",
        text: {
          ru: "Остаться дома: хозяйство само себя не поднимет",
          en: "Stay home: the farm won't run itself",
          ky: "Үйдө калуу: чарба өзү өзүн көтөрбөйт",
        },
        effects: {
          flags: { villagePath: true, familyFirst: true },
          stats: { relationships: 10, mood: -5 },
          diary: {
            ru: "Остался помогать дома. Бишкек никуда не убежит. Наверное.",
            en: "Stayed to help at home. Bishkek isn't going anywhere. Probably.",
            ky: "Үйдө калып жардам бердим. Бишкек эч жакка качпайт. Балким.",
          },
        },
      },
    ],
  },
  {
    code: "s1_phone_credit",
    season: 1,
    kicker: {
      ru: "Салон связи · «акция»",
      en: "Phone shop · “special offer”",
      ky: "Байланыш дүкөнү · «акция»",
    },
    key: true,
    text: {
      ru: "В салоне связи новый смартфон «в рассрочку без переплат — всего 0,1% в день». Продавец уже тянет договор. Твой старый телефон держит заряд полдня и фоткает как картошка.",
      en: "The phone shop has a new smartphone “in instalments with no overpayment — only 0.1% a day”. The salesman is already pulling out the contract. Your old phone holds a charge for half a day and takes photos like a potato.",
      ky: "Байланыш дүкөнүндө жаңы смартфон «үстөк төлөмсүз бөлүп төлөө — күнүнө болгону 0,1%». Сатуучу келишимди даярдап калды. Эски телефонуң жарым күн заряд кармайт, сүрөттү картошкадай тартат.",
    },
    choices: [
      {
        id: "take_credit",
        text: {
          ru: "Взять! 0,1% же копейки",
          en: "Take it! 0.1% is pennies",
          ky: "Алуу! 0,1% деген тыйын го",
        },
        effects: {
          // выплатил за год: цена телефона + злая переплата — урок кошельком, не вечным долгом
          stats: { money: -8000, mood: 8 },
          card: "effective_rate",
          diary: {
            ru: "Взял телефон «под 0,1% в день». За год переплатил почти половину цены. Больше — никогда.",
            en: "Took the phone at “0.1% a day”. Over a year I overpaid almost half its price. Never again.",
            ky: "Телефонду «күнүнө 0,1%» менен алдым. Бир жылда баасынын жарымындай үстөк төлөдүм. Мындан ары — эч качан.",
          },
        },
      },
      {
        id: "read_contract",
        text: {
          ru: "Пересчитать ставку на год прямо при продавце",
          en: "Recalculate the rate for a year right in front of the salesman",
          ky: "Ставканы сатуучунун көзүнчө жылдык кылып эсептөө",
        },
        primary: true,
        effects: {
          stats: { mood: 3 },
          card: "effective_rate",
          diary: {
            ru: "Пересчитал «0,1% в день» на год — 44% годовых. Продавец сделал вид, что занят.",
            en: "Did the math on “0.1% a day” — 44% a year. The salesman suddenly got very busy.",
            ky: "«Күнүнө 0,1%» дегенди жылдык кылып эсептедим — 44% болду. Сатуучу иши көп болуп калды.",
          },
        },
      },
      {
        id: "old_phone",
        text: {
          ru: "Старый ещё поживёт — фоткает душой",
          en: "The old one will do — it shoots with soul",
          ky: "Эскиси дагы иштейт — жан менен сүрөткө тартат",
        },
        effects: {
          stats: { mood: -2 },
          flags: { frugal: true },
          diary: {
            ru: "Оставил старый телефон. Фотки мутные, зато без долгов.",
            en: "Kept the old phone. Blurry photos, but no debt.",
            ky: "Эски телефонду калтырдым. Сүрөттөр бүдөмүк, бирок карызсызмын.",
          },
        },
      },
    ],
  },
  {
    code: "s1_hay_help",
    season: 1,
    kicker: {
      ru: "Поле · сенокос",
      en: "Field · haymaking",
      ky: "Талаа · чөп чабуу",
    },
    text: {
      ru: "Сенокос. Дядя Эркин просит помочь два дня — спина у него уже не та. Платить не предлагает, но все всё понимают: осенью его КамАЗ понадобится вам.",
      en: "Haymaking season. Uncle Erkin asks for two days of help — his back isn't what it used to be. He doesn't offer to pay, but everyone understands: come autumn, you'll need his KamAZ.",
      ky: "Чөп чабуу маалы. Эркин байке эки күн жардам сурайт — бели мурункудай эмес. Акча төлөйм дебейт, бирок баары түшүнөт: күзүндө анын КамАЗы силерге керек болот.",
    },
    choices: [
      {
        id: "help_free",
        text: {
          ru: "Помочь по-родственному",
          en: "Help out — family is family",
          ky: "Тууганчылык менен жардам берүү",
        },
        primary: true,
        effects: {
          stats: { energy: -15, relationships: 12 },
          card: "social_capital",
          diary: {
            ru: "Два дня на сенокосе у дяди Эркина. Спина гудит, зато теперь мы в расчёте вперёд.",
            en: "Two days haymaking at Uncle Erkin's. My back is humming, but now we're square in advance.",
            ky: "Эркин байкеникинде эки күн чөп чаптым. Бел сыздайт, бирок эми алдын ала эсептешип койдук.",
          },
        },
      },
      {
        id: "ask_pay",
        text: {
          ru: "Помочь, но намекнуть на оплату",
          en: "Help, but hint at payment",
          ky: "Жардам берип, акча жөнүндө кыйытуу",
        },
        effects: {
          stats: { money: 1500, energy: -15, relationships: -6 },
          diary: {
            ru: "Взял с дяди Эркина полторы тысячи за сенокос. Деньги есть, осадок тоже.",
            en: "Took fifteen hundred from Uncle Erkin for the haymaking. Got the money, and a bad aftertaste.",
            ky: "Эркин байкеден чөп үчүн бир жарым миң алдым. Акча бар, көңүлдө чөгүндү да бар.",
          },
        },
      },
      {
        id: "refuse",
        text: {
          ru: "Отказаться — своих дел полно",
          en: "Say no — I've got my own work",
          ky: "Баш тартуу — өз жумушум көп",
        },
        effects: {
          stats: { relationships: -10, energy: 5 },
          diary: {
            ru: "Отказал дяде Эркину. В айыле такое помнят долго.",
            en: "Turned Uncle Erkin down. In the village they remember things like that for a long time.",
            ky: "Эркин байкеге жок дедим. Айылда мындайды көпкө эстеп жүрүшөт.",
          },
        },
      },
    ],
  },
  {
    code: "s1_bazaar_jacket",
    season: 1,
    kicker: {
      ru: "Базар · ряды с одеждой",
      en: "Bazaar · clothing rows",
      ky: "Базар · кийим катарлары",
    },
    text: {
      ru: "На базаре присмотрел куртку к осени. Продавщица говорит «две тысячи, только для тебя». Рядом мнётся такой же пацан — ему она пять минут назад говорила «тысяча восемьсот».",
      en: "You've spotted an autumn jacket at the bazaar. The seller says “two thousand, just for you”. Another kid is hovering nearby — five minutes ago she told him “eighteen hundred”.",
      ky: "Базардан күзгө куртка карадым. Сатуучу «эки миң, сага гана» дейт. Жанында дал ошондой бир бала турат — беш мүнөт мурун ага «бир миң сегиз жүз» деген.",
    },
    choices: [
      {
        id: "haggle",
        text: {
          ru: "Торговаться до последнего",
          en: "Haggle to the last som",
          ky: "Акыркы сомго чейин соодалашуу",
        },
        primary: true,
        chance: 70,
        effects: {
          stats: { money: -1400, mood: 6 },
          card: "haggle",
          diary: {
            ru: "Сторговал куртку с 2000 до 1400. Торг — это спорт, и я сегодня чемпион.",
            en: "Talked the jacket down from 2000 to 1400. Haggling is a sport, and today I'm the champion.",
            ky: "Курткинин баасын 2000ден 1400гө түшүрдүм. Соодалашуу — спорт, бүгүн мен чемпионмун.",
          },
        },
        failEffects: {
          stats: { money: -1900, mood: -3 },
          card: "haggle",
          diary: {
            ru: "Торговался как лев, скинула сотню. Ну хоть попробовал.",
            en: "Haggled like a lion, she knocked off a hundred. At least I tried.",
            ky: "Арстандай соодалаштым, жүз сом гана түшүрдү. Аракет кылдым да.",
          },
        },
        failText: {
          ru: "Продавщица оказалась крепче: скинула всего сотню.",
          en: "The seller was tougher: she knocked off just a hundred.",
          ky: "Сатуучу бекем чыкты: болгону жүз сом түшүрдү.",
        },
      },
      {
        id: "pay_full",
        text: {
          ru: "Заплатить сколько сказали",
          en: "Pay the asking price",
          ky: "Айткан бааны төлөө",
        },
        effects: {
          stats: { money: -2000, mood: 2 },
          diary: {
            ru: "Купил куртку не торгуясь. Продавщица явно расстроилась — испортил ей игру.",
            en: "Bought the jacket without haggling. The seller looked disappointed — I ruined her game.",
            ky: "Курткины соодалашпай алдым. Сатуучу капа болду окшойт — оюнун бузуп койдум.",
          },
        },
      },
      {
        id: "walk_away",
        text: {
          ru: "Уйти — старая куртка ещё дышит",
          en: "Walk away — the old jacket still breathes",
          ky: "Кетүү — эски куртка дагы чыдайт",
        },
        effects: {
          stats: { mood: -3 },
          flags: { frugal: true },
          diary: {
            ru: "Куртку не купил. Зима покажет, кто был прав.",
            en: "Didn't buy the jacket. Winter will show who was right.",
            ky: "Курткины албадым. Ким туура болгонун кыш көрсөтөт.",
          },
        },
      },
    ],
  },
  {
    code: "s1_issyk_kul_trip",
    season: 1,
    kicker: {
      ru: "Двор · планы на лето",
      en: "The yard · summer plans",
      ky: "Короо · жайкы пландар",
    },
    text: {
      ru: "Пацаны собираются на Иссык-Куль дикарями: скинуться на бензин, палатки у Жаныбека, три дня свободы. Выходит по тысяче с носа. У тебя как раз отложено на осень.",
      en: "The guys are heading to Issyk-Kul rough-camping: chip in for petrol, Zhanybek's tents, three days of freedom. Works out to a thousand each. You have exactly that put aside for autumn.",
      ky: "Балдар Ысык-Көлгө жапайы эс алганы чогулуп жатышат: бензинге акча кошуп, Жаныбектин чатырлары менен, үч күн эркиндик. Бир кишиден миң сом чыгат. Сенде күзгө деп чогулткан дал ошончо акча бар.",
    },
    choices: [
      {
        id: "go",
        text: {
          ru: "Ехать! Такое лето одно",
          en: "Go! There's only one summer like this",
          ky: "Баруу! Мындай жай бир жолу болот",
        },
        primary: true,
        effects: {
          stats: { money: -1000, mood: 15, energy: 8, relationships: 8 },
          diary: {
            ru: "Три дня на Иссык-Куле: холодная вода, горячие камни и разговоры до звёзд.",
            en: "Three days at Issyk-Kul: cold water, hot stones and talking until the stars came out.",
            ky: "Ысык-Көлдө үч күн: муздак суу, ысык таштар жана жылдыз чыкканча созулган аңгеме.",
          },
        },
      },
      {
        id: "stay",
        text: {
          ru: "Остаться — деньги нужнее осенью",
          en: "Stay — the money is needed more in autumn",
          ky: "Калуу — акча күздө көбүрөөк керек",
        },
        effects: {
          stats: { mood: -6 },
          flags: { frugal: true },
          diary: {
            ru: "На Иссык-Куль не поехал. Фотки друзей смотрел неделю. Деньги целы, сердце — не очень.",
            en: "Didn't go to Issyk-Kul. Spent a week looking at my friends' photos. The money is intact, my heart less so.",
            ky: "Ысык-Көлгө барган жокмун. Досторумдун сүрөттөрүн бир жума карадым. Акча бүтүн, жүрөк анча эмес.",
          },
        },
      },
      {
        id: "work_there",
        text: {
          ru: "Поехать и подработать у Жаныбека на базе",
          en: "Go and pick up work at Zhanybek's guesthouse",
          ky: "Барып, Жаныбектин базасында иштеп акча табуу",
        },
        chance: 60,
        effects: {
          stats: { money: 2000, mood: 8, energy: -10 },
          diary: {
            ru: "Совместил: днём таскал лежаки на базе, вечером — свои. Привёз денег с курорта!",
            en: "Did both: hauled sun loungers at the guesthouse by day, hung out with my own crowd at night. Came back from the resort with money!",
            ky: "Экөөнү айкаштырдым: күндүз базада шезлонг ташыдым, кечинде өз балдар менен. Курорттон акча алып келдим!",
          },
        },
        failEffects: {
          stats: { money: -500, mood: 4, energy: -12 },
          diary: {
            ru: "Работы у Жаныбека почти не было. Отдохнул наполовину, заработал на четверть.",
            en: "There was almost no work at Zhanybek's. Rested halfway, earned a quarter.",
            ky: "Жаныбекте иш дээрлик болгон жок. Жарым эс алдым, чейрек акча таптым.",
          },
        },
        failText: {
          ru: "Сезон не задался — туристов мало, работы тоже.",
          en: "The season flopped — few tourists, little work.",
          ky: "Сезон оңунан чыккан жок — туристтер аз, иш да аз.",
        },
      },
    ],
  },
];
