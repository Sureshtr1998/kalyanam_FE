/**
 * City landing pages (/matrimony/<slug>). Each one carries its own local facts so it is
 * useful on its own, not a copy of the others with the city name swapped.
 * `communities` are slugs from ../communities/seoComm.ts.
 */
export interface City {
  slug: string;
  name: string;
  /** State, or "Outside India" for the NRI page. */
  region: string;
  languages: string[];
  communities: string[];
  intro: string;
  customs: string;
}

export const cities: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    languages: ["Marathi", "Hindi", "Gujarati", "Konkani"],
    communities: ["maratha-matrimony", "brahmin-matrimony", "patel-matrimony", "sindhi-matrimony", "agarwal-matrimony"],
    intro:
      "Mumbai brings together Marathi, Gujarati, Sindhi, Marwari and South Indian families, many of whom have lived in the city for generations. Families here often look for a partner who shares their roots but is comfortable with a fast, career-focused city life.",
    customs:
      "Marathi weddings include the Antarpat, a cloth held between the bride and groom until the mangalashtakas are sung, and the mundavalya strings of pearls tied on the forehead.",
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    region: "Delhi, Haryana and Uttar Pradesh",
    languages: ["Hindi", "Punjabi"],
    communities: ["khatri-matrimony", "arora-matrimony", "agarwal-matrimony", "jat-matrimony", "kayastha-matrimony", "brahmin-matrimony"],
    intro:
      "Delhi, Gurugram, Noida and Faridabad are home to Punjabi, Haryanvi, Uttar Pradesh and Bihar families as well as professionals from every state. Many families here balance traditional expectations with a partner's career and city of work.",
    customs:
      "North Indian weddings usually include the sehra worn by the groom, the baraat procession, the jaimala exchange of garlands and the pheras around the sacred fire.",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    region: "Karnataka",
    languages: ["Kannada", "Telugu", "Tamil", "Hindi"],
    communities: ["brahmin-matrimony", "reddy-matrimony", "vysya-matrimony", "naidu-matrimony", "mudaliar-matrimony"],
    intro:
      "Bengaluru is home to Kannada families and to professionals from across India who moved for work. Many families here want a partner from their own community who also understands a working, often dual-career, household.",
    customs:
      "Kannada weddings include Kashi Yatre, where the groom pretends to leave for a life of study, and Dhare Herdu, the giving away of the bride with water poured over joined hands.",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    region: "Telangana",
    languages: ["Telugu", "Hindi", "Urdu"],
    communities: ["reddy-matrimony", "kamma-matrimony", "brahmin-matrimony", "vysya-matrimony", "naidu-matrimony"],
    intro:
      "Hyderabad and Secunderabad have large Telugu-speaking Hindu communities alongside Marwari, Maharashtrian and North Indian families. Matches with partners working in the city's technology sector, or abroad, are common.",
    customs:
      "Telugu weddings include Jeelakarra Bellam, a paste of cumin and jaggery placed on each other's heads at the muhurtham, and Talambralu, where the couple shower each other with rice.",
  },
  {
    slug: "chennai",
    name: "Chennai",
    region: "Tamil Nadu",
    languages: ["Tamil", "Telugu"],
    communities: ["brahmin-matrimony", "mudaliar-matrimony", "chettiar-matrimony", "vanniyar-matrimony", "vellalar-matrimony", "naidu-matrimony"],
    intro:
      "Chennai families tend to keep strong ties to their community, sub-sect and native place, and horoscope matching is an important first step for many of them.",
    customs:
      "Tamil weddings include Kasi Yatrai, the Oonjal ceremony where the couple sit on a swing, and the tying of the thirumangalyam at the auspicious muhurtham.",
  },
  {
    slug: "pune",
    name: "Pune",
    region: "Maharashtra",
    languages: ["Marathi", "Hindi"],
    communities: ["maratha-matrimony", "brahmin-matrimony", "mali-matrimony", "maheshwari-matrimony", "sonar-matrimony"],
    intro:
      "Pune combines old Marathi families with students and professionals from across India. Many families look for a partner with a similar education and outlook who is also rooted in their traditions.",
    customs:
      "Marathi weddings begin with the Halad ceremony, followed by the Antarpat and mangalashtakas, and end with the Saptapadi.",
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    region: "West Bengal",
    languages: ["Bengali", "Hindi"],
    communities: ["kayastha-matrimony", "brahmin-matrimony", "agarwal-matrimony", "maheshwari-matrimony"],
    intro:
      "Kolkata is home to Bengali Hindu families as well as long-settled Marwari and Bihari communities. Language, food habits and family background are usually discussed early when matches are considered.",
    customs:
      "Bengali weddings include Shubho Drishti, when the bride reveals her face from behind betel leaves, Saat Paak, the seven circles around the groom, and Sindoor Daan.",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    region: "Gujarat",
    languages: ["Gujarati", "Hindi"],
    communities: ["patel-matrimony", "lohana-matrimony", "baniya-matrimony", "brahmin-matrimony", "koli-matrimony"],
    intro:
      "Ahmedabad's Gujarati families often have relatives across India and abroad, so matches with partners in other cities or countries are common. Community and food habits are usually the first things families check.",
    customs:
      "Gujarati weddings include Mameru, gifts from the bride's maternal uncle, Hasta Milap, the joining of hands, and the pheras around the sacred fire.",
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    region: "Rajasthan",
    languages: ["Hindi", "Rajasthani"],
    communities: ["rajput-matrimony", "agarwal-matrimony", "maheshwari-matrimony", "jat-matrimony", "brahmin-matrimony"],
    intro:
      "Jaipur families value lineage, gotra and family reputation, and the extended family usually takes part in choosing a match.",
    customs:
      "Rajasthani weddings include the Tilak ceremony and the Toran, where the groom touches a decorated arch at the bride's door before entering.",
  },
  {
    slug: "lucknow",
    name: "Lucknow",
    region: "Uttar Pradesh",
    languages: ["Hindi", "Awadhi"],
    communities: ["kayastha-matrimony", "brahmin-matrimony", "yadav-matrimony", "kurmi-matrimony", "agarwal-matrimony"],
    intro:
      "Lucknow families often look for matches within Uttar Pradesh but are increasingly open to partners working in Delhi NCR, Bengaluru or abroad.",
    customs:
      "Weddings in Uttar Pradesh usually include the Tilak, Haldi, the Dwar Puja welcoming the baraat, Jaimala, Kanyadaan and the pheras.",
  },
  {
    slug: "kochi",
    name: "Kochi",
    region: "Kerala",
    languages: ["Malayalam"],
    communities: ["nair-matrimony", "ezhava-matrimony", "brahmin-matrimony"],
    intro:
      "Kochi and the rest of Kerala have many families with members working in the Gulf and abroad, so matches across countries are common. Horoscope compatibility is checked by most Hindu families.",
    customs:
      "Kerala Hindu weddings are short and often held in temples. The groom ties the thali and, in many Nair weddings, gives the bride a pudava (cloth) as a sign of the union.",
  },
  {
    slug: "nri",
    name: "NRI",
    region: "Outside India",
    languages: ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Gujarati"],
    communities: ["brahmin-matrimony", "patel-matrimony", "reddy-matrimony", "kamma-matrimony", "agarwal-matrimony"],
    intro:
      "Hindu families in the USA, UK, Canada, Australia, the Gulf and Singapore often look for a partner who shares their community and values, whether they live abroad or in India. Time zones, visas and where the couple will settle are usually discussed early.",
    customs:
      "Many NRI families hold the main ceremonies in India so that grandparents and relatives can attend, and use video calls for the first family meetings.",
  },
];
