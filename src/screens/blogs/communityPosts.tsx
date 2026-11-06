import type { LongPost } from "./longPosts";
import A from "./BlogLink";

// Long-form rewrites of the community and tradition posts. Customs vary by region and family;
// the text says so rather than presenting one practice as universal. Same rules as
// longPosts.tsx: no invented stories or counts; bump `updatedAt` in blogsContents.tsx on change.

const searchOn = (community: string, to: string) => (
  <>
    Browse <A to={to}>{community} profiles on Seetha Rama Kalyana</A>. Members are OTP-verified, profiles show
    community, sub-community and gotra, and phone numbers are shared only after both families agree.
  </>
);

export const COMMUNITY_POSTS: Record<string, LongPost> = {
  "top-10-brahmin-wedding-traditions": {
    title: "Top 10 Brahmin Wedding Traditions and What They Mean",
    summary:
      "From Kashi Yatra to Saptapadi and Arundhati darshan: the Vedic rituals at the heart of a Brahmin wedding, explained simply.",
    keywords:
      "brahmin wedding traditions, vedic wedding rituals, hindu wedding rituals meaning, kanyadaan, saptapadi, kashi yatra, brahmin marriage rituals",
    readTime: "8 min read",
    answer:
      "Ten core Brahmin wedding traditions are Kashi Yatra, Var Puja, Kanyadaan, Panigrahana, Mangalya Dharana, Laja Homa, Agni Pradakshina, Saptapadi, Ashmarohana and Arundhati darshan. They come from the Vedic vivaha samskara and are followed, with regional variations, by Brahmin families across India.",
    keyFacts: [
      "Vivaha is one of the sixteen samskaras (sacraments) in Hindu tradition.",
      "Agni, the sacred fire, is the witness to the marriage.",
      "Kanyadaan is the giving of the bride by her parents.",
      "Saptapadi, the seven steps, completes the marriage.",
      "Arundhati and Vasishtha stars are shown as the ideal of devotion.",
    ],
    fullContent: [
      "A Brahmin wedding is built around the Vedic vivaha samskara, one of the sixteen sacraments that mark a Hindu life. The language, music and clothes change from Kashmir to Kerala, but the core rituals are remarkably similar.",
      "Here are ten traditions you will see at most Brahmin weddings, and what each one means.",
    ],
    sections: [
      {
        heading: "The ten traditions",
        blocks: [
          {
            list: [
              <><strong>1. Kashi Yatra:</strong> the groom playfully sets off for Kashi to lead a life of study, and the bride’s family persuades him to choose married life instead. Common in South Indian weddings.</>,
              <><strong>2. Var Puja / Vara Pooje:</strong> the bride’s family welcomes the groom and honours him as a guest.</>,
              <><strong>3. Kanyadaan:</strong> the bride’s parents give her hand to the groom, often with water poured over their joined hands; regarded as one of the most sacred acts a parent can perform.</>,
              <><strong>4. Panigrahana:</strong> the groom takes the bride’s hand, promising to protect and support her.</>,
              <><strong>5. Mangalya Dharana:</strong> the groom ties the mangalsutra (thali) at the auspicious muhurtha; in many South Indian traditions with three knots.</>,
              <><strong>6. Laja Homa:</strong> the bride offers puffed rice into the fire, often poured by her brother, praying for her husband’s long life and the families’ prosperity.</>,
              <><strong>7. Agni Pradakshina:</strong> the couple walk around the sacred fire, which is the witness to their marriage.</>,
              <><strong>8. Saptapadi:</strong> seven steps with seven vows; the marriage is complete with the seventh. See <A to="/blog/meaning-of-saptapadi-seven-vows">the meaning of the seven vows</A>.</>,
              <><strong>9. Ashmarohana:</strong> the bride steps on a stone (Ammi Midhithal in Tamil weddings), a promise to stay steadfast like a rock.</>,
              <><strong>10. Arundhati and Dhruva darshan:</strong> the couple are shown the Pole Star and the stars Arundhati and Vasishtha, symbols of constancy and devotion.</>,
            ],
          },
        ],
      },
      {
        heading: "How the traditions vary by region",
        blocks: [
          <>The same rituals appear under different names and in different orders. See our detailed posts on <A to="/blog/kannada-matrimony-traditions-modern-world">Kannada</A>, <A to="/blog/telugu-brahmin-matrimony-traditions">Telugu Brahmin</A>, <A to="/blog/tamil-matrimony-iyer-iyengar-weddings">Tamil Iyer and Iyengar</A>, <A to="/blog/marathi-brahmin-matrimony-peshwa-legacy">Marathi Brahmin</A>, <A to="/blog/kerala-brahmin-matrimony-namboothiri-traditions">Kerala Namboothiri</A> and <A to="/blog/north-indian-pandit-matrimony-rituals">North Indian Pandit</A> weddings.</>,
        ],
      },
      {
        heading: "Before the wedding: matching families",
        blocks: [
          <>For Brahmin families the wedding usually follows careful matching of gotra and horoscope. Our guides to <A to="/blog/understanding-gothras-brahmin-matrimony">gotra</A> and <A to="/blog/understanding-kundali-matching-significance">Kundli matching</A> explain both.</>,
        ],
      },
      {
        heading: "Find a Brahmin match",
        blocks: [searchOn("Brahmin", "/communities/brahmin-matrimony")],
      },
    ],
  },

  "brahmin-matrimony-guide-perfect-match": {
    title: "Brahmin Matrimony: A Complete Guide to Finding the Right Match",
    readTime: "8 min read",
    keywords:
      "brahmin matrimony, brahmin bride groom, brahmin marriage, iyer iyengar matrimony, saraswat matrimony, deshastha matrimony, brahmin gotra matching",
    answer:
      "Brahmin families usually look for a match within the Brahmin community, often within the same regional group and tradition (such as Smartha, Vaishnava or Madhwa), with a different gotra and compatible horoscopes. Education, values, diet and language are also central. Being clear about which of these are essential widens or narrows the search.",
    keyFacts: [
      "Brahmin communities are organised by region, language, Veda and tradition.",
      "Sagotra matches are traditionally avoided.",
      "Horoscope matching is common: 36 gunas in the North, Poruthams in the South.",
      "Vegetarian diet and religious practice are frequent preferences.",
      "Many families now accept matches across Brahmin sub-communities.",
    ],
    fullContent: [
      "Brahmin matrimony has its own set of considerations: sub-community, gotra, horoscope, tradition and often diet. Understanding them helps families decide what is essential and what can be flexible.",
    ],
    sections: [
      {
        heading: "Brahmin communities across India",
        blocks: [
          {
            list: [
              <><strong>South India:</strong> Tamil Iyers and Iyengars, Kannada Smartha, Madhwa and Havyaka Brahmins, Telugu Vaidiki and Niyogi Brahmins, Kerala Namboothiris and Kerala Iyers.</>,
              <><strong>West India:</strong> Chitpavan (Konkanastha), Deshastha and Karhade Brahmins in Maharashtra; Saraswat and Gaud Saraswat Brahmins along the Konkan coast; Gujarati Brahmin communities such as Nagar and Audichya.</>,
              <><strong>North and East India:</strong> Saraswat, Gaur, Kanyakubja, Saryupareen, Maithil and Kashmiri Pandits, and Bengali and Odia Brahmin communities.</>,
            ],
          },
        ],
      },
      {
        heading: "What Brahmin families usually consider",
        blocks: [
          {
            list: [
              <><strong>Gotra:</strong> matches within the same gotra are traditionally avoided; see our <A to="/blog/understanding-gothras-brahmin-matrimony">gotra guide</A>.</>,
              <><strong>Horoscope:</strong> see our <A to="/blog/understanding-kundali-matching-significance">Kundli matching guide</A>.</>,
              <><strong>Sub-community and tradition:</strong> Smartha, Vaishnava, Madhwa and so on, which affect rituals and festivals.</>,
              <><strong>Language:</strong> often a strong preference for the same mother tongue.</>,
              <><strong>Education and profession:</strong> usually given significant weight.</>,
              <><strong>Diet and religious practice:</strong> vegetarianism and daily rituals.</>,
            ],
          },
        ],
      },
      {
        heading: "Deciding what is essential",
        blocks: [
          "The more conditions a family sets, the smaller the pool. Many families now keep gotra and horoscope as essentials and are flexible about sub-community or region, which widens the search considerably while respecting the traditions that matter most to them.",
        ],
      },
      {
        heading: "What actually helps families find a match",
        blocks: [
          {
            list: [
              <>A complete profile that states gotra, tradition and birth details; see our <A to="/blog/create-perfect-matrimony-profile">profile guide</A>.</>,
              "Realistic preferences, with essentials marked clearly.",
              "Prompt, courteous replies to interests.",
              "Matching horoscopes only for serious matches, to save time.",
              <>Careful verification before trust; see our <A to="/blog/online-matrimony-safety-guide">safety guide</A>.</>,
            ],
          },
        ],
      },
      {
        heading: "Brahmin weddings",
        blocks: [
          <>Once the families agree, the wedding follows the Vedic samskara. Our post on the <A to="/blog/top-10-brahmin-wedding-traditions">top 10 Brahmin wedding traditions</A> explains each ritual.</>,
        ],
      },
      {
        heading: "Find a Brahmin match",
        blocks: [searchOn("Brahmin", "/communities/brahmin-matrimony")],
      },
    ],
  },

  "north-indian-pandit-matrimony-rituals": {
    title: "North Indian Brahmin (Pandit) Weddings: Rituals and Matchmaking",
    readTime: "7 min read",
    keywords:
      "north indian brahmin matrimony, pandit matrimony, kashmiri pandit wedding, saraswat brahmin, kanyakubja brahmin, maithil brahmin wedding, hindi brahmin matrimony",
    answer:
      "North Indian Brahmin weddings typically include Roka, Sagai, Tilak, Haldi and Mehndi, followed on the wedding day by the Baraat, Jaimala, Kanyadaan, the seven Phere around the fire, Sindoor Daan and Vidaai. Kashmiri Pandits add their own rituals such as Livun, Maenziraat, Devgon and Posh Puza.",
    keyFacts: [
      "Major groups include Saraswat, Gaur, Kanyakubja, Saryupareen, Maithil and Kashmiri Pandits.",
      "The seven Phere around the fire carry the meaning of the Saptapadi.",
      "Sindoor Daan and the mangalsutra mark the bride as married.",
      "Kashmiri Pandit weddings include Devgon and Posh Puza.",
      "Gotra and 36-guna Kundli matching are central to matchmaking.",
    ],
    fullContent: [
      "“Pandit” is often used for Brahmin families across North India, from Kashmir to Bihar. Their communities differ in language and custom, but share a Vedic wedding at the core and a strong tradition of gotra and horoscope matching.",
    ],
    sections: [
      {
        heading: "North Indian Brahmin communities",
        blocks: [
          {
            list: [
              "Saraswat and Gaur Brahmins of Punjab, Haryana, Delhi and Rajasthan.",
              "Kanyakubja and Saryupareen Brahmins of Uttar Pradesh.",
              "Maithil Brahmins of Bihar and Nepal’s Mithila region.",
              "Kashmiri Pandits, many now living across India and abroad.",
            ],
          },
        ],
      },
      {
        heading: "Before the wedding",
        blocks: [
          {
            list: [
              <><strong>Roka and Sagai:</strong> the families confirm the alliance and exchange rings and gifts.</>,
              <><strong>Tilak:</strong> the bride’s family visits the groom’s home and applies tilak, formally accepting him.</>,
              <><strong>Haldi and Mehndi:</strong> turmeric and henna ceremonies in both homes.</>,
            ],
          },
        ],
      },
      {
        heading: "The wedding day",
        blocks: [
          {
            list: [
              <><strong>Baraat:</strong> the groom arrives with family and friends, often on a horse, to music.</>,
              <><strong>Jaimala:</strong> the couple exchange garlands.</>,
              <><strong>Kanyadaan:</strong> the bride’s parents give her hand to the groom.</>,
              <><strong>Phere:</strong> the couple circle the sacred fire seven times; see the <A to="/blog/meaning-of-saptapadi-seven-vows">meaning of the seven vows</A>.</>,
              <><strong>Sindoor Daan and Mangalsutra:</strong> the groom applies sindoor and ties the mangalsutra.</>,
              <><strong>Vidaai:</strong> the emotional farewell as the bride leaves for her new home.</>,
            ],
          },
        ],
      },
      {
        heading: "Kashmiri Pandit traditions",
        blocks: [
          "Kashmiri Pandit weddings include Livun (ritual cleaning of the home), Maenziraat (the henna ceremony, with traditional songs), Devgon (a ritual for the bride and groom in their homes before the wedding) and Posh Puza, when family members shower the couple with flowers while they are seated together under a red cloth.",
        ],
      },
      {
        heading: "Matchmaking priorities",
        blocks: [
          <>Gotra (with sagotra avoided) and 36-guna <A to="/blog/understanding-kundali-matching-significance">Kundli matching</A> are central for most families, along with education, profession and family background. Many families abroad look for matches who share their language and customs.</>,
        ],
      },
      {
        heading: "Find a match",
        blocks: [searchOn("Brahmin", "/communities/brahmin-matrimony")],
      },
    ],
  },

  "kerala-brahmin-matrimony-namboothiri-traditions": {
    readTime: "6 min read",
    keywords:
      "namboothiri matrimony, kerala brahmin matrimony, namboothiri wedding, kerala iyer matrimony, malayali brahmin marriage",
    answer:
      "Namboothiris are the Malayali Brahmin community of Kerala, known for preserving Vedic traditions. Their weddings follow Vedic rites such as Kanyadanam, Panigrahanam, Laaja Homam, Saptapadi and Ashmarohanam. Kerala’s Brahmin families also include Kerala Iyers, Embranthiris and Pottis, each with its own customs.",
    keyFacts: [
      "Namboothiris are known for preserving Vedic chanting traditions.",
      "Historically, often only the eldest son married within the community.",
      "Twentieth-century reform movements changed this and many other customs.",
      "Weddings follow Vedic rites, typically at the bride’s home or a hall.",
      "Kerala Brahmin families also include Kerala Iyers, Embranthiris and Pottis.",
    ],
    fullContent: [
      "Kerala’s Namboothiri Brahmins are renowned for their scholarship and for preserving some of the oldest forms of Vedic recitation. Their marriage customs have changed greatly over the last century, while the Vedic core of the wedding remains.",
    ],
    sections: [
      {
        heading: "Who are the Namboothiris?",
        blocks: [
          "Namboothiris are the Malayali-speaking Brahmin community of Kerala. They have long been associated with temple traditions and Vedic learning, and with distinctive customs in dress, food and family life.",
        ],
      },
      {
        heading: "Marriage customs: then and now",
        blocks: [
          "Historically, the eldest son in a Namboothiri family usually married within the community, while younger sons often did not. In the early twentieth century, reformers within the community, through organisations such as the Namboothiri Yogakshema Sabha and writers such as V. T. Bhattathiripad, campaigned for change. Today all sons and daughters marry within the community or beyond, and education and careers carry as much weight as in any other community.",
        ],
      },
      {
        heading: "The wedding rituals",
        blocks: [
          {
            list: [
              <><strong>Kanyadanam:</strong> the bride’s father gives her hand to the groom.</>,
              <><strong>Panigrahanam:</strong> the groom takes the bride’s hand.</>,
              <><strong>Laaja Homam:</strong> offerings of puffed rice into the sacred fire.</>,
              <><strong>Saptapadi:</strong> seven steps with seven vows; see the <A to="/blog/meaning-of-saptapadi-seven-vows">meaning of the seven vows</A>.</>,
              <><strong>Ashmarohanam:</strong> the bride steps on a stone as a sign of steadfastness.</>,
            ],
          },
          "Details vary between families, so it is best to discuss them with your family priest.",
        ],
      },
      {
        heading: "Other Kerala Brahmin communities",
        blocks: [
          <>Kerala is also home to Kerala Iyers (Tamil Brahmins settled in Kerala, especially Palakkad), Embranthiris and Pottis, each with its own traditions. Kerala Iyer weddings follow many of the customs described in our post on <A to="/blog/tamil-matrimony-iyer-iyengar-weddings">Iyer and Iyengar weddings</A>.</>,
        ],
      },
      {
        heading: "Matchmaking today",
        blocks: [
          <>Families typically consider sub-community, gotra, horoscope (often using the Porutham system), education and profession, and the Malayalam language. Our <A to="/blog/brahmin-matrimony-guide-perfect-match">Brahmin matrimony guide</A> covers these in detail.</>,
        ],
      },
      {
        heading: "Find a match",
        blocks: [searchOn("Brahmin", "/communities/brahmin-matrimony")],
      },
    ],
  },

  "marathi-brahmin-matrimony-peshwa-legacy": {
    title: "Marathi Brahmin Matrimony: Chitpavan, Deshastha and Karhade Traditions",
    readTime: "7 min read",
    keywords:
      "marathi brahmin matrimony, chitpavan matrimony, deshastha brahmin matrimony, karhade brahmin, maharashtrian brahmin wedding",
    answer:
      "Marathi Brahmin communities include Chitpavan (Konkanastha), Deshastha and Karhade Brahmins. Their weddings typically include Sakharpuda, Kelvan, Halad, Seemant Pujan, Gauri-Har puja, Antarpat with Mangalashtak, Kanyadaan, Saptapadi and Grihapravesh, often with the bride receiving a new name.",
    keyFacts: [
      "Chitpavan Brahmins originate from the Konkan coast; the Peshwas were Chitpavans.",
      "Deshastha Brahmins are from the Deccan plateau, with Rigvedi and Yajurvedi branches.",
      "Antarpat: a cloth held between the couple is lowered after the Mangalashtak verses.",
      "The bride worships Gauri-Har (Parvati and Shiva) before the wedding.",
      "Many brides receive a new first name from the groom’s family.",
    ],
    fullContent: [
      "Maharashtra’s Brahmin communities have a long history of scholarship, administration and social reform. Their weddings blend Vedic rites with distinctly Marathi customs.",
    ],
    sections: [
      {
        heading: "The communities",
        blocks: [
          {
            list: [
              <><strong>Chitpavan (Konkanastha) Brahmins:</strong> from the Konkan coast; the Peshwas of the Maratha empire were Chitpavans.</>,
              <><strong>Deshastha Brahmins:</strong> from the Deccan (“desh”), with Rigvedi and Yajurvedi branches.</>,
              <><strong>Karhade Brahmins:</strong> traditionally associated with the region around Karad.</>,
            ],
          },
        ],
      },
      {
        heading: "Before the wedding",
        blocks: [
          {
            list: [
              <><strong>Sakharpuda:</strong> the engagement, marked by an exchange of sugar and gifts.</>,
              <><strong>Kelvan:</strong> family feasts hosted for the bride and groom.</>,
              <><strong>Halad:</strong> the turmeric ceremony.</>,
            ],
          },
        ],
      },
      {
        heading: "The wedding",
        blocks: [
          {
            list: [
              <><strong>Seemant Pujan:</strong> the bride’s family welcomes the groom.</>,
              <><strong>Gauri-Har puja:</strong> the bride worships Parvati and Shiva for a happy married life.</>,
              <><strong>Antarpat and Mangalashtak:</strong> the couple stand on either side of a cloth while auspicious verses are sung; the cloth is lowered and they garland each other.</>,
              <><strong>Kanyadaan and Saptapadi:</strong> the giving of the bride and the seven steps; see the <A to="/blog/meaning-of-saptapadi-seven-vows">seven vows</A>.</>,
              <><strong>Grihapravesh:</strong> the bride enters her new home, kicking a measure of rice at the threshold, and is often given a new first name.</>,
            ],
          },
        ],
      },
      {
        heading: "Matchmaking priorities",
        blocks: [
          <>Families commonly consider sub-community, <A to="/blog/understanding-gothras-brahmin-matrimony">gotra</A>, <A to="/blog/understanding-kundali-matching-significance">horoscope</A>, education and Marathi as the language at home, with many now open to matches across Brahmin sub-communities.</>,
        ],
      },
      {
        heading: "Find a match",
        blocks: [searchOn("Brahmin", "/communities/brahmin-matrimony")],
      },
    ],
  },

  "rajput-matrimony-traditions-legacy": {
    title: "Rajput Matrimony: Wedding Traditions and Finding a Match",
    readTime: "6 min read",
    keywords:
      "rajput matrimony, rajput wedding traditions, thakur matrimony, kshatriya matrimony, rajput bride groom, toran ceremony",
    answer:
      "Rajput weddings typically include Tilak, Ganesh puja, Pithi (haldi), the Baraat with the groom on horseback, the Toran ceremony at the bride’s door, Jaimala, Kanyadaan, the seven Phere and Vidaai. In matchmaking, Rajput families usually consider clan (vansh) and gotra, avoiding the same gotra, along with family background and values.",
    keyFacts: [
      "Rajput clans trace descent from Suryavanshi, Chandravanshi and Agnivanshi lines.",
      "Same-gotra marriages are traditionally avoided.",
      "Toran: the groom touches a decorated arch at the bride’s home before entering.",
      "Pithi is the Rajasthani turmeric ceremony.",
      "Rajput families live across Rajasthan, Gujarat, Madhya Pradesh, Uttar Pradesh, Himachal and beyond.",
    ],
    fullContent: [
      "Rajput families are known for their strong sense of heritage and for weddings full of colour and ceremony, especially in Rajasthan.",
    ],
    sections: [
      {
        heading: "Clans and gotra",
        blocks: [
          "Rajput clans traditionally trace descent from three lines: Suryavanshi (solar), Chandravanshi (lunar) and Agnivanshi (fire-born). Within these are many clans such as Rathore, Chauhan, Sisodia, Kachhwaha and Parmar. Families usually avoid matches within the same gotra and pay attention to clan and family background.",
        ],
      },
      {
        heading: "Before the wedding",
        blocks: [
          {
            list: [
              <><strong>Tilak:</strong> the bride’s family visits the groom’s home and applies tilak, confirming the alliance.</>,
              <><strong>Ganesh puja:</strong> prayers for an obstacle-free wedding.</>,
              <><strong>Pithi:</strong> turmeric is applied to the bride and groom.</>,
              <><strong>Mehndi:</strong> henna for the bride and women of the family.</>,
            ],
          },
        ],
      },
      {
        heading: "The wedding day",
        blocks: [
          {
            list: [
              <><strong>Baraat:</strong> the groom, often in a sherwani and safa (turban) with a sword, arrives on horseback with his family.</>,
              <><strong>Toran:</strong> at the bride’s home the groom touches a decorated arch (toran), a ritual symbolising his arrival and acceptance.</>,
              <><strong>Jaimala and Kanyadaan:</strong> the exchange of garlands and the giving of the bride.</>,
              <><strong>Phere:</strong> seven rounds of the sacred fire; see the <A to="/blog/meaning-of-saptapadi-seven-vows">seven vows</A>.</>,
              <><strong>Vidaai:</strong> the bride’s farewell to her family.</>,
            ],
          },
        ],
      },
      {
        heading: "Matchmaking today",
        blocks: [
          <>Alongside clan and gotra, families look at education, career and values, and many Rajput families now live in cities across India and abroad. Clear preferences and a complete profile help; see our <A to="/blog/top-tips-find-match-indian-matrimony">tips to find a match</A>.</>,
        ],
      },
      {
        heading: "Find a Rajput match",
        blocks: [searchOn("Rajput", "/communities/rajput-matrimony")],
      },
    ],
  },

  "aggarwal-baniya-matrimony-success": {
    title: "Agarwal and Baniya Matrimony: Gotras, Traditions and Finding a Match",
    readTime: "6 min read",
    keywords:
      "agarwal matrimony, aggarwal matrimony, baniya matrimony, vaishya matrimony, agarwal gotra list, marwari matrimony",
    answer:
      "Agarwals trace their origin to Maharaja Agrasen of Agroha and are traditionally divided into 18 gotras, such as Garg, Goyal, Mittal, Bansal, Singhal, Jindal and Kansal; marriage within the same gotra is avoided. Baniya (Vaishya) communities across India share a strong business heritage and a focus on family values in matchmaking.",
    keyFacts: [
      "Agarwals trace descent from Maharaja Agrasen of Agroha (in present-day Haryana).",
      "There are traditionally 18 Agarwal gotras (often described as 17½).",
      "Same-gotra marriages are avoided.",
      "Baniya communities include Agarwal, Maheshwari, Oswal, Khandelwal and many regional groups.",
      "Many families are vegetarian, and Jain–Agarwal ties are common in some regions.",
    ],
    fullContent: [
      "Agarwal and other Baniya communities are spread across India and the world, from Rajasthan and Haryana to Kolkata, Mumbai and beyond. Their matchmaking combines respect for gotra and tradition with practical attention to education, careers and family values.",
    ],
    sections: [
      {
        heading: "Agarwal origins and gotras",
        blocks: [
          "Agarwals trace their origin to Maharaja Agrasen, a legendary king of Agroha. Tradition holds that his eighteen sons founded the eighteen Agarwal gotras, which include Garg, Goyal, Goyan, Mittal, Bansal, Singhal, Jindal, Kansal, Kuchhal, Mangal, Airan, Dharan, Madhukul, Bindal, Tingal, Tayal, Bhandal and Nangal. Marriage within the same gotra is avoided.",
        ],
      },
      {
        heading: "Baniya communities",
        blocks: [
          "Baniya is a broad term for traditional trading communities in the Vaishya varna. It includes Agarwals, Maheshwaris, Oswals, Khandelwals and many regional groups, with Hindu and Jain families among them.",
        ],
      },
      {
        heading: "Wedding customs",
        blocks: [
          {
            list: [
              "Sagai (engagement) and Tilak.",
              "Haldi, Mehndi and sangeet celebrations.",
              "Baraat, Jaimala and Kanyadaan.",
              <>The seven Phere; see the <A to="/blog/meaning-of-saptapadi-seven-vows">seven vows</A>.</>,
              "Vidaai, followed by Griha Pravesh at the groom’s home.",
            ],
          },
          "Marwari Agarwal families often add customs such as the Bhaat, where the bride’s or groom’s maternal uncle brings gifts.",
        ],
      },
      {
        heading: "What families consider",
        blocks: [
          {
            list: [
              "Gotra, with the same gotra avoided.",
              "Family business or professional background.",
              "Diet: many families are vegetarian.",
              "Education and the couple’s plans for career and location.",
            ],
          },
        ],
      },
      {
        heading: "Find a match",
        blocks: [
          <>Browse <A to="/communities/agarwal-matrimony">Agarwal</A> and <A to="/communities/baniya-matrimony">Baniya</A> profiles on Seetha Rama Kalyana. Members are OTP-verified, profiles show community, sub-community and gotra, and phone numbers are shared only after both families agree.</>,
        ],
      },
    ],
  },

  "lingayat-matrimony-traditions-karnataka": {
    readTime: "6 min read",
    keywords:
      "lingayat matrimony, veerashaiva matrimony, lingayat wedding, karnataka matrimony, panchamasali, banajiga lingayat",
    answer:
      "Lingayats (Veerashaivas) follow the teachings of the 12th-century reformer Basavanna and wear the ishtalinga. Their weddings are usually simple and are conducted by a Jangama, with vachanas (Basavanna’s verses) recited. Families commonly look for matches within the community and sub-community, such as Panchamasali or Banajiga.",
    keyFacts: [
      "Basavanna, a 12th-century reformer, is central to Lingayat tradition.",
      "Members wear the ishtalinga, a personal linga.",
      "Weddings are typically led by a Jangama and include vachana recitation.",
      "Mathas often organise simple mass weddings (samuhika vivaha).",
      "Lingayats are concentrated in north and central Karnataka and neighbouring states.",
    ],
    fullContent: [
      "The Lingayat (Veerashaiva) community, concentrated in Karnataka and neighbouring parts of Maharashtra and Telangana, has its own distinctive marriage traditions shaped by the teachings of Basavanna.",
    ],
    sections: [
      {
        heading: "Who are the Lingayats?",
        blocks: [
          "Lingayats follow the teachings of Basavanna, the 12th-century philosopher and reformer who rejected caste hierarchy and ritualism and emphasised devotion and work (kayaka). Members wear the ishtalinga, a small personal linga, and the vachanas, short devotional verses in Kannada, are central to their faith.",
        ],
      },
      {
        heading: "Wedding traditions",
        blocks: [
          {
            list: [
              "Weddings are typically conducted by a Jangama (Lingayat priest) rather than a Vedic Brahmin priest.",
              "Vachanas are recited, and the ceremony emphasises simplicity.",
              "Families exchange garlands and the mangalasutra is tied, as in other Kannada weddings.",
              "Many mathas organise simple mass weddings (samuhika vivaha), which keep costs low for families.",
            ],
          },
          "Customs vary between families and regions, so it is best to discuss them with your family and the officiating Jangama.",
        ],
      },
      {
        heading: "Sub-communities",
        blocks: [
          "The community includes many sub-groups such as Panchamasali, Banajiga, Sadar, Jangama and others. Some families prefer matches within the same sub-group; others are flexible within the wider Lingayat community.",
        ],
      },
      {
        heading: "Matchmaking today",
        blocks: [
          <>Families usually consider sub-community, education, profession and Kannada as the home language. Many Lingayat families now live in Bengaluru, Pune, Hyderabad and abroad. Our post on <A to="/blog/kannada-matrimony-traditions-modern-world">Kannada wedding traditions</A> covers the wider Karnataka context.</>,
        ],
      },
      {
        heading: "Find a match",
        blocks: [
          <>Seetha Rama Kalyana is available fully in <A to="/kn">Kannada</A>. Browse the <A to="/communities">communities we serve</A>; members are OTP-verified and phone numbers are shared only after both families agree.</>,
        ],
      },
    ],
  },

  "jat-matrimony-search-traditions": {
    title: "Jat Matrimony: Gotra Rules, Wedding Customs and Finding a Match",
    readTime: "6 min read",
    keywords:
      "jat matrimony, jat gotra rules, jat wedding customs, haryana matrimony, jat bride groom, bhaat ceremony",
    answer:
      "Jat families, mainly from Haryana, Punjab, western Uttar Pradesh and Rajasthan, follow strict gotra rules: many avoid marrying into their own gotra, the mother’s gotra and the grandmothers’ gotras. Weddings include Rokka, Sagai, Lagan, Bhaat (gifts from the maternal uncle), the Baraat, Phere and Vidaai.",
    keyFacts: [
      "Many Jat families avoid four gotras: their own, the mother’s, and both grandmothers’.",
      "Some families also avoid marriage within the same village.",
      "Bhaat: the bride’s or groom’s maternal uncle brings gifts and support.",
      "Jats are concentrated in Haryana, Punjab, western UP and Rajasthan.",
    ],
    fullContent: [
      "The Jat community has a strong agricultural heritage and close-knit village and clan networks, which shape both matchmaking rules and wedding traditions.",
    ],
    sections: [
      {
        heading: "Gotra rules in Jat matchmaking",
        blocks: [
          "Jat families are known for careful gotra rules. Many avoid matches in four gotras: their own, the mother’s, the father’s mother’s and the mother’s mother’s. Some families also avoid marriage within the same village or neighbouring villages, which are seen as related. Because rules differ between families, it is best to state them clearly on the profile.",
          <>Read more about gotra in our <A to="/blog/understanding-gothras-brahmin-matrimony">gotra guide</A>.</>,
        ],
      },
      {
        heading: "Wedding customs",
        blocks: [
          {
            list: [
              <><strong>Rokka and Sagai:</strong> the families confirm the alliance.</>,
              <><strong>Lagan:</strong> the formal letter fixing the wedding date is sent to the groom’s family.</>,
              <><strong>Bhaat:</strong> the maternal uncle brings gifts and support, an important family ritual.</>,
              <><strong>Baraat and Phere:</strong> the groom’s procession and the seven rounds of the fire; see the <A to="/blog/meaning-of-saptapadi-seven-vows">seven vows</A>.</>,
              <><strong>Vidaai:</strong> the bride’s farewell.</>,
            ],
          },
        ],
      },
      {
        heading: "Matchmaking today",
        blocks: [
          "Jat families increasingly live in cities and abroad, and look at education, careers and family values alongside gotra. Clear profiles that list gotras to avoid save time for both families.",
        ],
      },
      {
        heading: "Find a Jat match",
        blocks: [searchOn("Jat", "/communities/jat-matrimony")],
      },
    ],
  },

  "yadav-matrimony-heritage-lineage": {
    title: "Yadav Matrimony: Heritage, Wedding Customs and Finding a Match",
    readTime: "6 min read",
    keywords:
      "yadav matrimony, yaduvanshi matrimony, ahir matrimony, yadav wedding customs, golla matrimony, konar matrimony",
    answer:
      "Yadav families trace their lineage to King Yadu and to Lord Krishna’s Yaduvanshi line. The community spans many regional groups, including Ahir, Gwala, Golla and Konar. North Indian Yadav weddings typically include Tilak, Haldi, Matkor, the Baraat, Dwar Puja, Kanyadaan, Phere, Sindoor Daan and Vidaai.",
    keyFacts: [
      "Yadavs trace descent from King Yadu and the Yaduvanshi line of Lord Krishna.",
      "Regional groups include Ahir, Gwala, Golla (Telugu states) and Konar (Tamil Nadu).",
      "Same-gotra marriages are generally avoided.",
      "Matkor is a pre-wedding ritual common in Uttar Pradesh and Bihar.",
    ],
    fullContent: [
      "The Yadav community is one of the largest in India, with families across Uttar Pradesh, Bihar, Haryana, Madhya Pradesh, the Telugu states, Tamil Nadu and beyond. Pride in the Yaduvanshi heritage of Lord Krishna runs through its traditions.",
    ],
    sections: [
      {
        heading: "Heritage and regional groups",
        blocks: [
          "Yadavs trace their lineage to King Yadu, ancestor of Lord Krishna. The community includes many regional groups with different names and customs, such as Ahir and Gwala in North India, Golla in Andhra Pradesh and Telangana, and Konar in Tamil Nadu. Traditionally associated with cattle-rearing and agriculture, Yadav families today work in every profession.",
        ],
      },
      {
        heading: "North Indian Yadav wedding customs",
        blocks: [
          {
            list: [
              <><strong>Tilak:</strong> the bride’s family formally accepts the groom.</>,
              <><strong>Haldi and Matkor:</strong> turmeric ceremonies and the Matkor ritual, where women of the family worship mother earth and bring soil home with songs.</>,
              <><strong>Baraat and Dwar Puja:</strong> the groom’s procession is welcomed at the bride’s door.</>,
              <><strong>Kanyadaan and Phere:</strong> the giving of the bride and the seven rounds of the fire; see the <A to="/blog/meaning-of-saptapadi-seven-vows">seven vows</A>.</>,
              <><strong>Sindoor Daan and Vidaai:</strong> the groom applies sindoor, followed by the bride’s farewell.</>,
            ],
          },
          "South Indian Golla and Konar families follow customs closer to other Telugu and Tamil weddings.",
        ],
      },
      {
        heading: "Matchmaking priorities",
        blocks: [
          "Families usually look within the Yadav community and regional group, avoid the same gotra, and consider education, profession, location and family values. Many families now accept matches across regional Yadav groups when language and customs fit.",
        ],
      },
      {
        heading: "Find a Yadav match",
        blocks: [searchOn("Yadav", "/communities/yadav-matrimony")],
      },
    ],
  },

  "maratha-matrimony-maharashtra-traditions": {
    title: "Maratha Matrimony: 96 Kuli Heritage and Wedding Traditions",
    readTime: "6 min read",
    keywords:
      "maratha matrimony, 96 kuli maratha, maratha wedding rituals, marathi matrimony, maharashtrian wedding traditions, kunbi maratha",
    answer:
      "Maratha families trace their heritage to the 96 clans (Shahannav Kuli), with surnames such as Bhosale, Jadhav, Pawar, Shinde and More. Maratha weddings typically include Sakharpuda, Halad, Devdevak, Seemant Pujan, Antarpat with Mangalashtak, Kanyadaan, Saptapadi, Varat and Grihapravesh, often with a new name for the bride.",
    keyFacts: [
      "The 96 Kuli refers to the traditional Maratha clans.",
      "Families usually avoid matches within the same clan (kul).",
      "Devdevak: worship of the family deity before the wedding.",
      "Antarpat: a cloth between the couple is lowered after the Mangalashtak.",
      "The bride often receives a new first name at Grihapravesh.",
    ],
    fullContent: [
      "The Maratha community, central to Maharashtra’s history from Chhatrapati Shivaji Maharaj onwards, has wedding traditions that are joyful, devotional and distinctly Marathi.",
    ],
    sections: [
      {
        heading: "The 96 Kuli",
        blocks: [
          "Maratha families traditionally identify with the 96 clans (Shahannav Kuli), including well-known surnames such as Bhosale, Jadhav, Pawar, Shinde, More, Gaikwad and Chavan. Families usually avoid matches within the same clan and pay attention to family background and the family deity (kuldaivat).",
        ],
      },
      {
        heading: "Before the wedding",
        blocks: [
          {
            list: [
              <><strong>Sakharpuda:</strong> the engagement, with sugar and gifts exchanged.</>,
              <><strong>Halad:</strong> the turmeric ceremony, with songs and celebration.</>,
              <><strong>Devdevak:</strong> worship of the family deity, such as Khandoba or Tulja Bhavani, to invite blessings.</>,
            ],
          },
        ],
      },
      {
        heading: "The wedding day",
        blocks: [
          {
            list: [
              <><strong>Seemant Pujan:</strong> the bride’s family welcomes the groom.</>,
              <><strong>Antarpat and Mangalashtak:</strong> auspicious verses are sung with a cloth between the couple; it is lowered and they garland each other while guests shower akshata.</>,
              <><strong>Kanyadaan and Saptapadi:</strong> see the <A to="/blog/meaning-of-saptapadi-seven-vows">seven vows</A>.</>,
              <><strong>Varat:</strong> the procession to the groom’s home.</>,
              <><strong>Grihapravesh:</strong> the bride enters her new home and is often given a new first name.</>,
            ],
          },
        ],
      },
      {
        heading: "Matchmaking today",
        blocks: [
          <>Alongside clan and family background, Maratha families look at education, profession and location; many live in Pune, Mumbai and abroad. Our <A to="/blog/marathi-brahmin-matrimony-peshwa-legacy">Marathi Brahmin post</A> covers other Maharashtrian wedding customs.</>,
        ],
      },
      {
        heading: "Find a Maratha match",
        blocks: [searchOn("Maratha", "/communities/maratha-matrimony")],
      },
    ],
  },

  "rama-seetha-marriage-blueprint": {
    title: "The Marriage of Rama and Seetha: Lessons for Couples Today",
    readTime: "7 min read",
    keywords:
      "rama seetha marriage, sita ram vivah, sita swayamvar, ramayana marriage lessons, ideal hindu marriage, loyalty in marriage",
    answer:
      "In the Ramayana, Rama wins Seetha’s hand at her swayamvar in Mithila by breaking Lord Shiva’s bow, and their wedding is celebrated on Vivah Panchami. Their marriage is held up as an ideal of mutual respect, loyalty through hardship, shared dharma and family harmony, values many couples still look for today.",
    keyFacts: [
      "Seetha was the daughter of King Janaka of Mithila.",
      "Rama broke Shiva’s bow (Pinaka) at her swayamvar.",
      "Their wedding is celebrated as Vivah Panchami.",
      "Seetha chose to share Rama’s fourteen-year exile.",
      "“A match like Seetha and Rama” remains a common blessing for couples.",
    ],
    fullContent: [
      "Few marriages are as often invoked in Indian families as that of Rama and Seetha. Elders bless couples with it, and wedding songs across India retell it. What does the story actually say about marriage?",
    ],
    sections: [
      {
        heading: "The story of the wedding",
        blocks: [
          "Seetha, daughter of King Janaka of Mithila, was to marry the prince who could string the great bow of Lord Shiva. Many kings tried and failed to even lift it. Rama, accompanied by his brother Lakshmana and the sage Vishwamitra, lifted the bow and broke it while stringing it. The wedding of Rama and Seetha followed in Mithila, along with the marriages of his three brothers.",
          <>The day is celebrated every year as <A to="/blog/vivaha-panchami-significance-marriage">Vivah Panchami</A>.</>,
        ],
      },
      {
        heading: "Lessons in loyalty",
        blocks: [
          "When Rama was sent into exile for fourteen years, Seetha chose to go with him rather than stay in the comfort of the palace. Her choice is remembered as the model of loyalty: sharing hardship as willingly as happiness.",
        ],
      },
      {
        heading: "What modern couples take from the Ramayana",
        blocks: [
          {
            list: [
              <><strong>Mutual respect:</strong> honouring each other’s dignity and duties.</>,
              <><strong>Standing together in difficulty:</strong> commitment shows most in hard times.</>,
              <><strong>Shared dharma:</strong> a marriage grounded in common values rather than convenience.</>,
              <><strong>Respect for both families:</strong> the wedding united two royal households.</>,
              <><strong>Friendship:</strong> echoed in the seventh vow of the <A to="/blog/meaning-of-saptapadi-seven-vows">Saptapadi</A>.</>,
            ],
          },
        ],
      },
      {
        heading: "Reading the story thoughtfully",
        blocks: [
          "The Ramayana also contains episodes, such as Seetha’s trials after her return, that many families discuss and interpret in different ways. Most draw from the story the enduring values of devotion, respect and partnership, and apply them as equals in a modern marriage.",
        ],
      },
      {
        heading: "Why our platform carries their name",
        blocks: [
          "Seetha Rama Kalyana is named after this divine wedding. It is a Hindu matrimony platform for families across India and abroad, available in English, Kannada, Telugu, Tamil and Hindi, with verified profiles and phone numbers shared only after both families agree.",
        ],
      },
    ],
  },
};
