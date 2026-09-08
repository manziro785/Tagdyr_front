import type { Localized } from "../../model/localized";
import type { GameEvent } from "../../model/types";

/**
 * Сезон 3 · «Первая работа» — 19–21, Бишкек. Взрослые деньги, взрослые грабли.
 *
 * Контракт с бэкендом — по кодам и эффектам (см. season1.ts).
 */
export const SEASON_3_EVENTS: GameEvent<Localized>[] = [
  {
    code: "s3_job_fork",
    season: 3,
    kicker: {
      ru: "Развилка · кем быть",
      en: "Crossroads · who to become",
      ky: "Айрылыш · ким болуу",
    },
    key: true,
    text: {
      ru: "Три двери открылись одновременно: джуниором в офис за 18 000 (стабильно, кофе бесплатный), к дяде на Дордой — своя точка с рассрочкой (риск, но потолка нет), или билет в Москву — там брат обещает «встретить и устроить».",
      en: "Three doors opened at once: junior at an office for 18,000 (stable, free coffee), a stall of your own at Dordoi on instalments from your uncle (risky, but no ceiling), or a ticket to Moscow, where your brother promises to “meet you and sort you out”.",
      ky: "Үч эшик бир убакта ачылды: офиске джуниор болуп 18 000гө (туруктуу, кофе акысыз), Дордойдо байкеңден бөлүп төлөө менен өз соода түйүнүң (тобокел, бирок чеги жок) же Москвага билет — ал жакта агаң «тосуп алып, ишке орноштурам» дейт.",
    },
    choices: [
      {
        id: "office",
        text: {
          ru: "Офис: стабильность и трудовая книжка",
          en: "Office: stability and an employment record",
          ky: "Офис: туруктуулук жана эмгек китепчеси",
        },
        primary: true,
        effects: {
          stats: { money: 18_000, mood: 4 },
          flags: { hasJob: true, officePath: true },
          diary: {
            ru: "Вышел в офис джуниором. Первый бейджик, первый дедлайн, первый «созвон на пять минут» на два часа.",
            en: "Started at the office as a junior. First badge, first deadline, first “five-minute call” that ran two hours.",
            ky: "Офиске джуниор болуп чыктым. Биринчи бейдж, биринчи дедлайн, эки саатка созулган биринчи «беш мүнөттүк чалуу».",
          },
        },
      },
      {
        id: "dordoi",
        text: {
          ru: "Точка на Дордое — своё дело страшно, но своё",
          en: "A stall at Dordoi — your own business is scary, but it's yours",
          ky: "Дордойдо соода түйүн — өз ишиң коркунучтуу, бирок өзүңдүкү",
        },
        effects: {
          stats: { money: 6000, energy: -10, mood: 6 },
          flags: { bazaarPath: true, hasJob: true },
          diary: {
            ru: "Взял точку на Дордое в рассрочку у дяди. Первый месяц — в минус, потом раскрутился.",
            en: "Took a stall at Dordoi on instalments from my uncle. First month in the red, then it picked up.",
            ky: "Дордойдон байкемден бөлүп төлөө менен түйүн алдым. Биринчи ай минуска кетти, кийин жүрүп кетти.",
          },
        },
      },
      {
        id: "moscow",
        text: {
          ru: "Москва: заработаю и вернусь. Наверное",
          en: "Moscow: I'll earn and come back. Probably",
          ky: "Москва: акча табам да кайтам. Балким",
        },
        effects: {
          stats: { money: 15_000, relationships: -8, mood: -4 },
          flags: { wentAbroad: true, hasJob: true },
          diary: {
            ru: "Улетел в Москву. Брат встретил, устроил на стройку. Деньги пошли, дом теперь — это видеозвонки.",
            en: "Flew to Moscow. My brother met me and got me onto a construction site. The money started coming, and home became video calls.",
            ky: "Москвага учуп кеттим. Агам тосуп алып, курулушка орноштурду. Акча түшө баштады, үй эми — видеочалуулар.",
          },
        },
      },
    ],
  },
  {
    code: "s3_brother_loan",
    season: 3,
    kicker: {
      ru: "Звонок · родной брат",
      en: "A call · your brother",
      ky: "Чалуу · бир тууганың",
    },
    key: true,
    text: {
      ru: "Младший брат звонит: не хватает 5000 на взнос за курсы сварщика. «Верну с первой зарплаты, ты же знаешь». Знаешь. И как возвращает — тоже знаешь.",
      en: "Your younger brother calls: he's 5,000 short for welding courses. “I'll pay you back with my first paycheck, you know me.” You do know him. You also know how he pays back.",
      ky: "Иниң чалат: ширетүүчү курстарына 5000 жетпей жатат. «Биринчи айлыгымдан кайтарам, өзүң билесиң го». Билесиң. Кантип кайтарарын да билесиң.",
    },
    choices: [
      {
        id: "gave_full",
        text: {
          ru: "Дать все 5000 — брат же",
          en: "Give all 5,000 — he's your brother",
          ky: "5000ди толук берүү — иниң го",
        },
        primary: true,
        effects: {
          stats: { money: -5000, relationships: 10 },
          flags: { familyFirst: true },
          diary: {
            ru: "Дал брату пять тысяч на курсы. Расписку не взял — брат обиделся бы. Посмотрим.",
            en: "Gave my brother five thousand for the courses. Didn't ask for an IOU — he'd have been offended. We'll see.",
            ky: "Иниме курска беш миң бердим. Кол кат албадым — таарынмак. Көрөбүз.",
          },
        },
      },
      {
        id: "gave_receipt",
        text: {
          ru: "Дать, но с распиской — не в обиду",
          en: "Give it, but with an IOU — nothing personal",
          ky: "Берүү, бирок кол кат менен — таарынбасын",
        },
        effects: {
          stats: { money: -5000, relationships: 4 },
          flags: { familyFirst: true },
          card: "written_deal",
          diary: {
            ru: "Дал брату пять тысяч под расписку. Он поворчал, но подписал. Оба спим спокойно.",
            en: "Gave my brother five thousand against an IOU. He grumbled, but signed. Now we both sleep well.",
            ky: "Иниме беш миңди кол кат менен бердим. Күңкүлдөдү, бирок кол койду. Экөөбүз тең тынч уктайбыз.",
          },
        },
      },
      {
        id: "refuse",
        text: {
          ru: "Отказать: пусть сам, взрослый уже",
          en: "Say no: let him manage, he's grown",
          ky: "Жок деп айтуу: өзү тапсын, чоңойду го",
        },
        effects: {
          stats: { relationships: -12, mood: -4 },
          diary: {
            ru: "Брату отказал. Может, правильно. Но ужин в родительском доме был тихим.",
            en: "Turned my brother down. Maybe it was right. But dinner at my parents' was very quiet.",
            ky: "Иниме жок дедим. Балким туурадыр. Бирок ата-энемдин үйүндөгү кечки тамак үнсүз өттү.",
          },
        },
      },
    ],
  },
  {
    code: "s3_rent_deposit",
    season: 3,
    kicker: {
      ru: "Съём · депозит",
      en: "Renting · the deposit",
      ky: "Ижара · депозит",
    },
    text: {
      ru: "Хозяйка хорошей квартиры хочет аренду за месяц вперёд плюс депозит — разом 20 000. Таких денег нет. МФО за углом рисует «одобрено за 15 минут» под 14% годовых. Или ужаться и жить дальше где живёшь.",
      en: "The landlady of a good flat wants a month up front plus a deposit — 20,000 at once. You don't have it. The microloan office around the corner promises “approved in 15 minutes” at 14% a year. Or you tighten up and stay where you are.",
      ky: "Жакшы батирдин ээси бир айлык акыны алдын ала жана депозит сурайт — бир жолу 20 000. Мындай акча жок. Бурчтагы микрокредит «15 мүнөттө жактырылат» деп жылдык 14% сунуштайт. Же кыналып, азыркы жериңде жашай бересиң.",
    },
    choices: [
      {
        id: "mfo_loan",
        text: {
          ru: "Взять 15 000 в МФО — жильё того стоит",
          en: "Take 15,000 from the microloan office — the flat is worth it",
          ky: "Микрокредиттен 15 000 алуу — батир арзыйт",
        },
        effects: {
          debt: { amount: 15_000, rate: 0.14 },
          stats: { mood: 8 },
          card: "compound_interest",
          diary: {
            ru: "Взял 15 000 под 14% на квартиру. Калькулятор процентов пока не открывал. Боюсь.",
            en: "Borrowed 15,000 at 14% for the flat. Haven't opened the interest calculator yet. I'm scared to.",
            ky: "Батирге 14% менен 15 000 алдым. Пайыз эсептегичти азырынча ачкан жокмун. Коркуп жатам.",
          },
        },
      },
      {
        id: "save_first",
        text: {
          ru: "Копить три месяца, потом переехать",
          en: "Save for three months, then move",
          ky: "Үч ай топтоп, анан көчүү",
        },
        primary: true,
        effects: {
          stats: { mood: -4 },
          flags: { savedEmergencyFund: true },
          card: "emergency_fund",
          diary: {
            ru: "Решил сначала накопить, потом переезжать. Скучно. Зато мои деньги останутся моими.",
            en: "Decided to save first and move later. Boring. But my money stays mine.",
            ky: "Адегенде топтоп, анан көчөйүн дедим. Кызыксыз. Бирок акчам өзүмдө калат.",
          },
        },
      },
      {
        id: "stay_cheap",
        text: {
          ru: "Остаться где есть — и так нормально",
          en: "Stay put — it's fine as it is",
          ky: "Ордунда калуу — ушинтип деле болот",
        },
        effects: {
          stats: { mood: -2, money: 2000 },
          diary: {
            ru: "Никуда не переехал. Сосед всё ещё жарит картошку ночью, зато кошелёк цел.",
            en: "Didn't move anywhere. My roommate still fries potatoes at night, but my wallet is intact.",
            ky: "Эч жакка көчкөн жокмун. Кошуна дагы эле түнкүсүн картошка кууруйт, бирок капчыгым бүтүн.",
          },
        },
      },
    ],
  },
  {
    code: "s3_boss_conflict",
    season: 3,
    kicker: {
      ru: "Работа · трения",
      en: "Work · friction",
      ky: "Жумуш · сүрүлүү",
    },
    text: {
      ru: "Начальник (или старший по рядам — смотря где ты) третий раз вешает на тебя чужую работу «по-братски». Коллеги сочувственно молчат: все через это прошли.",
      en: "Your boss (or the head of the bazaar row — depends where you ended up) dumps someone else's work on you for the third time, “as a favour between brothers”. Your colleagues stay sympathetically silent: they've all been there.",
      ky: "Начальник (же катардын башчысы — кайда экениңе жараша) үчүнчү жолу бирөөнүн ишин «бир туугандай» мойнуңа илип жатат. Кесиптештер боор ооруп унчукпайт: баары ушундан өткөн.",
    },
    choices: [
      {
        id: "speak_up",
        text: {
          ru: "Спокойно поговорить: я не против помочь, но не бесплатно",
          en: "Talk it out calmly: happy to help, but not for free",
          ky: "Токтоо сүйлөшүү: жардам берем, бирок бекерге эмес",
        },
        primary: true,
        chance: 65,
        effects: {
          stats: { money: 3000, mood: 8, relationships: 2 },
          card: "haggle",
          diary: {
            ru: "Поговорил с начальником про чужую работу. Сработало: доплата и уважение.",
            en: "Talked to my boss about the extra work. It worked: a bonus and some respect.",
            ky: "Начальник менен ашыкча иш жөнүндө сүйлөштүм. Иштеди: кошумча акы жана урмат.",
          },
        },
        failEffects: {
          stats: { mood: -6, relationships: -4 },
          diary: {
            ru: "Поговорил с начальником. Он выслушал, покивал и повесил ещё один «братский» проект.",
            en: "Talked to my boss. He listened, nodded, and handed me one more “brotherly” project.",
            ky: "Начальник менен сүйлөштүм. Угуп, баш ийкеп, дагы бир «бир туугандык» долбоор берди.",
          },
        },
        failText: {
          ru: "«Молодой, амбициозный — вот и поработай» — сказал он.",
          en: "“Young and ambitious — so get to work,” he said.",
          ky: "«Жашсың, дилгирсиң — иштей бер» деди ал.",
        },
      },
      {
        id: "endure",
        text: {
          ru: "Потерпеть: тут все так начинали",
          en: "Put up with it: everyone started this way",
          ky: "Чыдоо: бул жерде баары ушинтип баштаган",
        },
        effects: {
          stats: { energy: -12, mood: -6 },
          diary: {
            ru: "Тащу чужую работу молча. Говорят, это называется «опыт». По ощущениям — «шея».",
            en: "Carrying someone else's work in silence. They call it “experience”. It feels more like “a neck to load”.",
            ky: "Бирөөнүн ишин үнсүз тартып жүрөм. Муну «тажрыйба» дешет. Сезилиши боюнча — «моюн».",
          },
        },
      },
      {
        id: "quit_loud",
        text: {
          ru: "Хлопнуть дверью — себя дороже",
          en: "Slam the door — self-respect costs more",
          ky: "Эшикти каңк эткизип чыгуу — өзүң кымбатсың",
        },
        effects: {
          stats: { money: -6000, mood: 6, energy: 8 },
          flags: { hasJob: false },
          diary: {
            ru: "Ушёл, хлопнув дверью. Свобода пахнет прекрасно, но не платит аренду.",
            en: "Left slamming the door. Freedom smells wonderful, but it doesn't pay rent.",
            ky: "Эшикти каңк эткизип кеттим. Эркиндиктин жыты сонун, бирок ижараны төлөбөйт.",
          },
        },
      },
    ],
  },
  {
    code: "s3_dordoi_expand",
    season: 3,
    kicker: {
      ru: "Дордой · шанс",
      en: "Dordoi · a chance",
      ky: "Дордой · мүмкүнчүлүк",
    },
    requires: { flag: "bazaarPath" },
    weight: 2,
    text: {
      ru: "Сосед по рядам уезжает и отдаёт свой контейнер за полцены — 30 000. Место проходное, товар ходовой. Таких предложений на Дордое ждут годами. Денег, как всегда, впритык.",
      en: "The neighbour in your row is leaving and selling his container for half price — 30,000. Good foot traffic, goods that move. At Dordoi people wait years for an offer like this. Money, as always, is tight.",
      ky: "Катардагы кошунаң кетип жатып, контейнерин жарым баада берет — 30 000. Орду өтмө, товары жүрүмдүү. Дордойдо мындай сунушту жылдап күтүшөт. Акча, дайымкыдай эле, тыгыз.",
    },
    choices: [
      {
        id: "expand",
        text: {
          ru: "Брать! Расширяемся",
          en: "Take it! Time to expand",
          ky: "Алабыз! Кеңейебиз",
        },
        primary: true,
        requires: { minMoney: 30_000 },
        effects: {
          stats: { money: -14_000, energy: -8 },
          flags: { hasBusiness: true },
          diary: {
            ru: "Выкупил второй контейнер — уже частично отбился. Теперь у меня «сеть точек», так и говорю всем.",
            en: "Bought the second container — it's already partly paid for itself. Now I have “a chain of outlets”, that's how I put it to everyone.",
            ky: "Экинчи контейнерди сатып алдым — бир бөлүгү эбак кайтты. Эми менде «түйүндөр тармагы» бар, баарына ошентип айтам.",
          },
        },
      },
      {
        id: "expand_debt",
        text: {
          ru: "Брать в долг — шанс дороже процентов",
          en: "Borrow for it — the chance is worth more than the interest",
          ky: "Карызга алуу — мүмкүнчүлүк пайыздан кымбат",
        },
        chance: 60,
        effects: {
          debt: { amount: 30_000, rate: 0.14 },
          flags: { hasBusiness: true },
          stats: { energy: -10, money: 18_000 },
          diary: {
            ru: "Занял на второй контейнер. Страшно до дрожи, но точка уже приносит больше процентов.",
            en: "Borrowed for the second container. Shaking with fear, but the stall already earns more than the interest.",
            ky: "Экинчи контейнерге карыз алдым. Калтырап коркуп жатам, бирок түйүн пайыздан көбүрөөк киреше берүүдө.",
          },
        },
        failEffects: {
          debt: { amount: 30_000, rate: 0.14 },
          stats: { energy: -12, mood: -8 },
          diary: {
            ru: "Занял на контейнер, а сезон просел. Товар стоит, проценты идут. Учусь спать тревожно.",
            en: "Borrowed for the container and then the season slumped. The goods sit, the interest runs. Learning to sleep uneasily.",
            ky: "Контейнерге карыз алдым, сезон солгундады. Товар турат, пайыз өсөт. Тынчсызданып уктаганды үйрөнүп жатам.",
          },
        },
        failText: {
          ru: "Сезон просел: товар стоит, проценты капают.",
          en: "The season slumped: the goods sit, the interest drips.",
          ky: "Сезон солгундады: товар турат, пайыз тамчылайт.",
        },
      },
      {
        id: "pass",
        text: {
          ru: "Пропустить: не тяну",
          en: "Pass: I can't carry it",
          ky: "Өткөрүп жиберүү: чамам жетпейт",
        },
        effects: {
          stats: { mood: -5 },
          diary: {
            ru: "Контейнер соседа забрал другой. Считаю, сколько бы он приносил. Зря считаю.",
            en: "Someone else took the neighbour's container. I keep calculating what it would have earned. Pointless calculating.",
            ky: "Кошунанын контейнерин башка бирөө алды. Канча киреше берерин эсептеп жүрөм. Бекер эсептейм.",
          },
        },
      },
    ],
  },
  {
    code: "s3_evening_course",
    season: 3,
    kicker: {
      ru: "Объявление · курсы",
      en: "An ad · evening courses",
      ky: "Жарнак · курстар",
    },
    text: {
      ru: "Вечерние курсы — на выбор: 1С-бухгалтерия, сварка пятого разряда или английский. 6000 за три месяца. Реклама обещает «+50% к зарплате», жизнь обычно скромнее.",
      en: "Evening courses, take your pick: accounting software, fifth-grade welding, or English. 6,000 for three months. The ad promises “+50% to your salary”; life is usually more modest.",
      ky: "Кечки курстар — тандоо боюнча: 1С-бухгалтерия, бешинчи разряддагы ширетүү же англис тили. Үч айга 6000. Жарнак «айлыкка +50%» дейт, жашоо адатта жөнөкөйүрөөк.",
    },
    choices: [
      {
        id: "invest_skill",
        text: {
          ru: "Пойти учиться — навык не отнимут",
          en: "Go and learn — nobody can take a skill away",
          ky: "Окууга баруу — көндүмдү эч ким тартып албайт",
        },
        primary: true,
        effects: {
          stats: { money: -6000, energy: -8 },
          flags: { craftsman: true, selfInvest: true },
          card: "income_streams",
          diary: {
            ru: "Отучился на вечерних курсах. Корочка — в рамке, навык — в руках.",
            en: "Finished the evening courses. The certificate is in a frame, the skill is in my hands.",
            ky: "Кечки курстарды бүтүрдүм. Күбөлүк рамкада, көндүм колумда.",
          },
        },
      },
      {
        id: "skip_course",
        text: {
          ru: "6000 жалко: ютуб бесплатный",
          en: "6,000 is a lot: YouTube is free",
          ky: "6000 кыйын: ютуб акысыз",
        },
        effects: {
          stats: { mood: 2 },
          diary: {
            ru: "Решил учиться по ютубу. Плейлист «Посмотреть позже» пополнился на 47 видео.",
            en: "Decided to learn from YouTube. My “Watch later” playlist grew by 47 videos.",
            ky: "Ютубдан үйрөнөйүн дедим. «Кийин көрөм» плейлистиме 47 видео кошулду.",
          },
        },
      },
    ],
  },
  {
    code: "s3_remittance",
    season: 3,
    kicker: {
      ru: "Москва · перевод домой",
      en: "Moscow · sending money home",
      ky: "Москва · үйгө которуу",
    },
    requires: { flag: "wentAbroad" },
    weight: 2,
    text: {
      ru: "Первая большая получка в Москве. Мама не просит, но ты знаешь: крыша в доме течёт. Пацаны зовут в выходной на Красную площадь и в торговый центр — тоже, между прочим, первый раз в жизни.",
      en: "Your first big paycheck in Moscow. Mom doesn't ask, but you know the roof at home leaks. The guys are calling you out on the weekend to Red Square and a shopping mall — also, by the way, a first in your life.",
      ky: "Москвадагы биринчи чоң айлык. Апам сурабайт, бирок билесиң: үйдүн чатыры агып жатат. Балдар дем алышта Кызыл аянтка жана соода борборуна чакырат — бул да, айтмакчы, өмүрдө биринчи жолу.",
    },
    choices: [
      {
        id: "send_home",
        text: {
          ru: "Отправить домой 15 000 — крыша важнее",
          en: "Send 15,000 home — the roof matters more",
          ky: "Үйгө 15 000 жөнөтүү — чатыр маанилүү",
        },
        primary: true,
        effects: {
          stats: { money: -5000, relationships: 12, mood: 4 },
          flags: { familyFirst: true },
          diary: {
            ru: "Большая получка: 10 000 себе, 15 000 — домой на крышу. Мама прислала фото: не течёт.",
            en: "Big paycheck: 10,000 for me, 15,000 home for the roof. Mom sent a photo: no more leaks.",
            ky: "Чоң айлык: 10 000 өзүмө, 15 000 — үйгө чатырга. Апам сүрөт жиберди: акпай калыптыр.",
          },
        },
      },
      {
        id: "half_half",
        text: {
          ru: "Половину домой, половину себе",
          en: "Half home, half for me",
          ky: "Жарымын үйгө, жарымын өзүмө",
        },
        effects: {
          stats: { money: 5000, relationships: 6, mood: 6 },
          diary: {
            ru: "Поделил получку: половину домой, половину — себе. Компромисс, как вся моя жизнь тут.",
            en: "Split the paycheck: half home, half for me. A compromise, like my whole life here.",
            ky: "Айлыкты бөлдүм: жарымы үйгө, жарымы өзүмө. Бул жердеги бүт жашоом сыяктуу компромисс.",
          },
        },
      },
      {
        id: "spend_self",
        text: {
          ru: "В этот раз — на себя. Заслужил",
          en: "This time it's for me. I've earned it",
          ky: "Бул жолу — өзүмө. Татыктымын",
        },
        effects: {
          stats: { money: 10_000, mood: 10, relationships: -6 },
          diary: {
            ru: "Получку оставил себе, красиво пожил выходные. Дома не спрашивали — и это хуже упрёков.",
            en: "Kept the paycheck and lived it up all weekend. Nobody at home asked — and that's worse than reproach.",
            ky: "Айлыкты өзүмө калтырып, дем алышты кооз өткөрдүм. Үйдөгүлөр сурашкан жок — бул сөгүштөн да жаман.",
          },
        },
      },
    ],
  },
];
