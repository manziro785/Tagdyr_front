import type { Locale } from "@/i18n/routing";

import { tx, type Localized } from "../model/localized";
import type { KnowledgeCard } from "../model/types";

/**
 * Карточки знаний — копия packages/content/knowledge-cards бэкенда (контракт
 * по кодам). События открывают карточки по code; сервер фиксирует в complete.
 *
 * Тексты хранятся на трёх языках; наружу отдаём уже выбранный язык.
 */
const KNOWLEDGE_CARDS: readonly KnowledgeCard<Localized>[] = [
  {
    id: "card_effective_rate",
    code: "effective_rate",
    title: {
      ru: "Эффективная ставка",
      en: "Effective rate",
      ky: "Натыйжалуу ставка",
    },
    category: "finance",
    body: {
      ru: "«0,1% в день» звучит безобидно — а это 44% в год. Любую ставку переводи в годовую: умножь дневную на 365 и ужаснись заранее, а не потом.",
      en: "“0.1% a day” sounds harmless — but that's 44% a year. Convert any rate into an annual one: multiply the daily rate by 365 and get horrified in advance rather than afterwards.",
      ky: "«Күнүнө 0,1%» зыянсыз угулат — бирок бул жылына 44%. Кайсы ставканы болбосун жылдыкка которуп ал: күндүктү 365ке көбөйт да, кийин эмес, алдын ала коркуп кой.",
    },
    season: 1,
  },
  {
    id: "card_compound_interest",
    code: "compound_interest",
    title: {
      ru: "Сложный процент",
      en: "Compound interest",
      ky: "Татаал пайыз",
    },
    category: "finance",
    body: {
      ru: "Проценты начисляются на проценты. 20 000 под 14% через 4 года — уже 33 700. Работает в обе стороны: на долг — против тебя, на накопления — за тебя.",
      en: "Interest is charged on interest. 20,000 at 14% becomes 33,700 after four years. It works both ways: on debt it's against you, on savings it's for you.",
      ky: "Пайыздын үстүнө пайыз кошулат. 14% менен алынган 20 000 төрт жылда 33 700 болот. Эки жакка тең иштейт: карызда — сага каршы, топтоодо — сен үчүн.",
    },
    season: 2,
  },
  {
    id: "card_emergency_fund",
    code: "emergency_fund",
    title: {
      ru: "Подушка безопасности",
      en: "Emergency fund",
      ky: "Коопсуздук жаздыгы",
    },
    category: "finance",
    body: {
      ru: "Три месячных расхода на отдельном счёте. Это не «лишние деньги» — это право сказать «нет» плохой работе и не занимать при первой же беде.",
      en: "Three months of expenses in a separate account. It isn't “spare money” — it's the right to say no to a bad job and not to borrow at the first misfortune.",
      ky: "Өзүнчө эсепте үч айлык чыгым. Бул «ашыкча акча» эмес — бул жаман жумушка «жок» деп айтуу жана биринчи кыйынчылыкта эле карыз албоо укугу.",
    },
    season: 2,
  },
  {
    id: "card_budget_envelopes",
    code: "budget_envelopes",
    title: {
      ru: "Метод конвертов",
      en: "The envelope method",
      ky: "Конверт ыкмасы",
    },
    category: "finance",
    body: {
      ru: "Зарплата раскладывается по конвертам в день получения: аренда, еда, той, накопления. Что не разложено — то испарилось. Проверено дворами Бишкека.",
      en: "Split your pay into envelopes on payday: rent, food, toi, savings. Whatever isn't sorted evaporates. Tested by the courtyards of Bishkek.",
      ky: "Айлык алган күнү конверттерге бөлүнөт: ижара, тамак, той, топтоо. Бөлүнбөгөнү бууланып кетет. Бишкектин короолорунда сыналган.",
    },
    season: 2,
  },
  {
    id: "card_debt_first",
    code: "debt_first",
    title: {
      ru: "Сначала — дорогой долг",
      en: "Expensive debt first",
      ky: "Адегенде — кымбат карыз",
    },
    category: "finance",
    body: {
      ru: "Если долгов несколько, гаси сначала тот, где ставка выше — он растёт быстрее всех. Минималки по остальным. Это математика, а не мнение.",
      en: "If you have several debts, pay off the one with the highest rate first — it grows fastest. Minimums on the rest. That's mathematics, not an opinion.",
      ky: "Карызың бир нече болсо, адегенде ставкасы жогорусун жап — ал баарынан ыкчам өсөт. Калгандарына минимум. Бул математика, пикир эмес.",
    },
    season: 3,
  },
  {
    id: "card_income_streams",
    code: "income_streams",
    title: {
      ru: "Не один ручей",
      en: "More than one stream",
      ky: "Бир булак жетишсиз",
    },
    category: "career",
    body: {
      ru: "Одна зарплата — один рубильник, который могут выключить. Подработка, навык на продажу, аренда — второй ручей спасает, когда первый пересох.",
      en: "One salary is one switch someone else can flip. A side job, a skill you can sell, rent from something — the second stream saves you when the first dries up.",
      ky: "Бир айлык — бирөө өчүрө турган бир рубильник. Кошумча иш, сатууга жарай турган көндүм, ижара — биринчиси соолуганда экинчи булак сактап калат.",
    },
    season: 3,
  },
  {
    id: "card_invest_early",
    code: "invest_early",
    title: {
      ru: "Время дороже суммы",
      en: "Time beats the amount",
      ky: "Убакыт суммадан кымбат",
    },
    category: "finance",
    body: {
      ru: "Начать откладывать в 20 по чуть-чуть выгоднее, чем в 30 по-крупному: у сложного процента будет на 10 лет больше работы. Лучший день начать был вчера.",
      en: "Saving a little from twenty beats saving a lot from thirty: compound interest gets ten more years of work. The best day to start was yesterday.",
      ky: "20 жашта аз-аздан топтой баштоо 30да чоң сумма менен баштагандан пайдалуу: татаал пайызга 10 жыл көбүрөөк иштөө убактысы тиет. Баштоонун эң жакшы күнү кечээ эле.",
    },
    season: 4,
  },
  {
    id: "card_social_capital",
    code: "social_capital",
    title: {
      ru: "Социальный капитал",
      en: "Social capital",
      ky: "Социалдык капитал",
    },
    category: "relationships",
    body: {
      ru: "Той, где ты не пожадничал, вернётся помощью, когда прижмёт. Отношения — единственный актив, который не съедает инфляция.",
      en: "The toi where you didn't skimp comes back as help when things get tight. Relationships are the only asset inflation doesn't eat.",
      ky: "Сараңдык кылбаган тоюң кысталышта жардам болуп кайтат. Мамиле — инфляция жей албаган жалгыз актив.",
    },
    season: 1,
  },
  {
    id: "card_health_asset",
    code: "health_asset",
    title: {
      ru: "Здоровье — тоже актив",
      en: "Health is an asset too",
      ky: "Ден соолук да актив",
    },
    category: "health",
    body: {
      ru: "Энергия — валюта, в которой ты платишь за всё остальное. Работать на износ — это брать кредит у собственного тела. Ставка там огромная.",
      en: "Energy is the currency you pay for everything else with. Working yourself into the ground is taking a loan from your own body. The rate there is brutal.",
      ky: "Күч-кубат — калган бардыгын төлөй турган валюта. Өзүңдү аёосуз иштетүү — өз денеңден кредит алуу. Ал жердеги ставка укмуштуудай жогору.",
    },
    season: 4,
  },
  {
    id: "card_haggle",
    code: "haggle",
    title: {
      ru: "Торг уместен",
      en: "Haggling is fair game",
      ky: "Соодалашуу жарашат",
    },
    category: "life",
    body: {
      ru: "На базаре, на собеседовании, в аренде — первая цена не окончательная. Кто спокойно спрашивает «а если подумать?» — экономит годовую зарплату за жизнь.",
      en: "At the bazaar, at a job interview, in a rental — the first price is never final. Whoever calmly asks “and what if we think about it?” saves a year's salary over a lifetime.",
      ky: "Базарда, маекте, ижарада — биринчи баа акыркы эмес. Токтоо түрдө «ойлонуп көрсөкчү?» деп сураган адам өмүр бою бир жылдык айлыгын үнөмдөйт.",
    },
    season: 1,
  },
  {
    id: "card_written_deal",
    code: "written_deal",
    title: {
      ru: "Расписка — не обида",
      en: "An IOU isn't an insult",
      ky: "Кол кат таарынычка жатпайт",
    },
    category: "life",
    body: {
      ru: "Деньги в долг даже родне — с распиской. Это не недоверие, это уважение: обе стороны помнят одинаково. Дружба ломается о «я думал, ты подаришь».",
      en: "Lend money — even to relatives — with a written note. It isn't distrust, it's respect: both sides remember the same thing. Friendships break on “I thought it was a gift”.",
      ky: "Акчаны тууганга да карызга берсең — кол кат менен. Бул ишенбөө эмес, урматтоо: эки тарап тең бирдей эстейт. Достук «белекке бердиң го деп ойлогом» дегенден бузулат.",
    },
    season: 3,
  },
  {
    id: "card_scam_radar",
    code: "scam_radar",
    title: {
      ru: "Радар на чудо",
      en: "Miracle radar",
      ky: "Кереметке радар",
    },
    category: "finance",
    body: {
      ru: "«Гарантированные 10% в месяц» — это не инвестиция, это спектакль, где ты платишь за билет. Чем громче обещание, тем тише уходи.",
      en: "“A guaranteed 10% a month” isn't an investment, it's a show where you pay for the ticket. The louder the promise, the quieter you should walk away.",
      ky: "«Кепилденген айына 10%» — бул инвестиция эмес, билетине өзүң төлөгөн спектакль. Убада канчалык катуу айтылса, ошончолук тынч басып кет.",
    },
    season: 5,
  },
];

function localize(card: KnowledgeCard<Localized>, locale: Locale): KnowledgeCard {
  return { ...card, title: tx(card.title, locale), body: tx(card.body, locale) };
}

/** Вся галерея карточек на одном языке. */
export function getCards(locale: Locale): KnowledgeCard[] {
  return KNOWLEDGE_CARDS.map((c) => localize(c, locale));
}

export function getCard(code: string, locale: Locale): KnowledgeCard | undefined {
  const card = KNOWLEDGE_CARDS.find((c) => c.code === code);
  return card && localize(card, locale);
}
