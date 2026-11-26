/**
 * Language landing pages (/languages/<slug>), e.g. /languages/kannada-matrimony.
 * Each one has its own text so it's useful alone, not the template with the name swapped.
 * `communities` are slugs from ../communities/seoComm.ts; `cities` are slugs from ../cities/seoCities.ts.
 * `site` is the full translated site for that language, when there is one (/kn, /te, /ta, /hi).
 * Keep it general and well documented: no member counts, success stories or claims about who has joined.
 * `native` is the heading in the language's own script; have a native speaker check new ones.
 */
export interface LanguagePage {
  slug: string;
  name: string;
  native: string;
  nativeLang: string;
  site?: "kn" | "te" | "ta" | "hi";
  regions: string;
  about: string;
  customs: string[];
  tip: string;
  communities: string[];
  cities: string[];
}

export const languages: LanguagePage[] = [
  {
    slug: "kannada-matrimony",
    name: "Kannada",
    native: "ಕನ್ನಡ ಮ್ಯಾಟ್ರಿಮೊನಿ",
    nativeLang: "kn",
    site: "kn",
    regions: "Karnataka, with large Kannadiga families in Bengaluru, Mumbai, Pune, Hyderabad, Chennai and abroad",
    about:
      "Kannada-speaking families come from every part of Karnataka, from Mysuru and Old Mysore to North Karnataka, Malnad and the coast. Many now live in Bengaluru and in cities across India and abroad, and look for a partner who shares their language, food and festivals.",
    customs: [
      "Nischitartha (engagement), when the elders of both families fix the wedding",
      "Kashi Yatre, the groom's playful departure for Kashi, in many Brahmin weddings",
      "Dhare, mangalya dharane and the saptapadi at the muhurtha",
    ],
    tip: "Add your native district (for example Mysuru, Dharwad or Udupi) and your community; many Kannada families look for a match from the same region.",
    communities: ["vokkaliga-matrimony", "lingayat-matrimony", "brahmin-matrimony", "vysya-matrimony", "ezhava-matrimony", "vishwakarma-matrimony"],
    cities: ["bengaluru", "mumbai", "pune", "nri"],
  },
  {
    slug: "telugu-matrimony",
    name: "Telugu",
    native: "తెలుగు మ్యాట్రిమోనీ",
    nativeLang: "te",
    site: "te",
    regions: "Andhra Pradesh and Telangana, with large Telugu communities in Bengaluru, Chennai, Mumbai and the US",
    about:
      "Telugu families come from coastal Andhra, Rayalaseema and Telangana. Hyderabad, Visakhapatnam and Vijayawada are home to many, and a large Telugu community lives in Bengaluru, Chennai and the US.",
    customs: [
      "Pellichoopulu and nischitartham (meeting and engagement)",
      "Jeelakarra-bellam: cumin and jaggery placed on each other's heads at the muhurtham",
      "Talambralu, showering each other with turmeric rice, and seeing the Arundhati star",
    ],
    tip: "Mention your community and gotra; Telugu families usually check both before talks begin.",
    communities: ["kamma-matrimony", "reddy-matrimony", "naidu-matrimony", "vysya-matrimony", "kshatriya-matrimony", "brahmin-matrimony"],
    cities: ["hyderabad", "bengaluru", "chennai", "nri"],
  },
  {
    slug: "tamil-matrimony",
    name: "Tamil",
    native: "தமிழ் மேட்ரிமோனி",
    nativeLang: "ta",
    site: "ta",
    regions: "Tamil Nadu and Puducherry, with Tamil families in Bengaluru, Mumbai, Singapore, the Gulf and beyond",
    about:
      "Tamil-speaking families come from every part of Tamil Nadu, from Chennai and the Kongu region to Madurai and the Cauvery delta. Customs vary from community to community, so most families look first within their own.",
    customs: [
      "Nichayathartham (engagement) at the bride's home",
      "Oonjal, the couple on a swing while elders sing, in many weddings",
      "Thali tying (mangalya dharanam) to the sound of the nadaswaram, then the saptapadi",
    ],
    tip: "Add your community, native place and nakshatra; many Tamil families match horoscopes before talks begin.",
    communities: ["brahmin-matrimony", "gounder-matrimony", "vanniyar-matrimony", "mudaliar-matrimony", "chettiar-matrimony", "vellalar-matrimony"],
    cities: ["chennai", "bengaluru", "nri"],
  },
  {
    slug: "hindi-matrimony",
    name: "Hindi",
    native: "हिंदी मैट्रिमोनी",
    nativeLang: "hi",
    site: "hi",
    regions: "Uttar Pradesh, Bihar, Madhya Pradesh, Rajasthan, Delhi, Haryana and Hindi-speaking families across India",
    about:
      "Hindi-speaking Hindu families live across North and Central India, from Delhi and Lucknow to Jaipur, Patna and Bhopal, and in every big city in India and abroad.",
    customs: [
      "Roka or tilak, when the two families formally agree to the match",
      "Haldi and mehndi in the days before the wedding",
      "Phere around the sacred fire, kanyadaan and sindoor daan",
    ],
    tip: "Add your community, gotra and home state; many families avoid a match within the same gotra.",
    communities: ["agarwal-matrimony", "kayastha-matrimony", "rajput-matrimony", "yadav-matrimony", "jat-matrimony", "bhumihar-matrimony", "kurmi-matrimony", "maheshwari-matrimony", "baniya-matrimony", "teli-matrimony", "sonar-matrimony"],
    cities: ["delhi-ncr", "lucknow", "jaipur", "mumbai"],
  },
  {
    slug: "marathi-matrimony",
    name: "Marathi",
    native: "मराठी वधू-वर",
    nativeLang: "mr",
    regions: "Maharashtra and Goa, with Marathi families in Bengaluru, Hyderabad, Indore and abroad",
    about:
      "Marathi-speaking families come from Mumbai, Pune, Kolhapur, Nashik, Nagpur and every part of Maharashtra. Many keep close ties to their native village and kuldevata even after moving to the city.",
    customs: [
      "Sakharpuda (engagement), with sugar exchanged between the families",
      "Halad (haldi) for the bride and groom",
      "Antarpat and mangalashtaka, followed by the saptapadi",
    ],
    tip: "Mention your community, kul and native place; many Marathi families check these first.",
    communities: ["maratha-matrimony", "brahmin-matrimony", "mali-matrimony", "koli-matrimony", "kumbhar-matrimony", "sonar-matrimony"],
    cities: ["mumbai", "pune"],
  },
  {
    slug: "malayalam-matrimony",
    name: "Malayalam",
    native: "മലയാളി മാട്രിമോണി",
    nativeLang: "ml",
    regions: "Kerala, with large Malayali families in Bengaluru, Chennai, Mumbai and the Gulf",
    about:
      "Malayali Hindu families come from every district of Kerala, and many work in Bengaluru, Chennai and the Gulf. Weddings are often short and simple, held at a temple at the auspicious muhurtham.",
    customs: [
      "Temple weddings, often at Guruvayur, at the auspicious muhurtham",
      "Thali tying and the exchange of garlands",
      "Pudava koda, when the groom gives the bride a new pudava (cloth)",
    ],
    tip: "Many Malayali families match by nakshatra, so add your star and birth time to your profile.",
    communities: ["nair-matrimony", "ezhava-matrimony", "brahmin-matrimony"],
    cities: ["kochi", "bengaluru", "nri"],
  },
  {
    slug: "gujarati-matrimony",
    name: "Gujarati",
    native: "ગુજરાતી મેટ્રિમોની",
    nativeLang: "gu",
    regions: "Gujarat and Mumbai, with a large Gujarati diaspora in the US, UK and East Africa",
    about:
      "Gujarati families come from Ahmedabad, Surat, Vadodara, Rajkot, Kutch and Saurashtra, and many have settled in Mumbai and abroad. Trade, business and close family networks are strong in the community.",
    customs: [
      "Gol dhana (engagement), with coriander seeds and jaggery shared between the families",
      "Mameru, gifts for the bride from her maternal uncle, and pithi (haldi)",
      "Hasta milap and the saat phera around the sacred fire",
    ],
    tip: "Mention your community and native place in Gujarat; families often look for both.",
    communities: ["patel-matrimony", "lohana-matrimony", "baniya-matrimony", "koli-matrimony", "vankar-matrimony", "brahmin-matrimony"],
    cities: ["ahmedabad", "mumbai", "nri"],
  },
  {
    slug: "punjabi-matrimony",
    name: "Punjabi",
    native: "ਪੰਜਾਬੀ ਮੈਟ੍ਰਿਮੋਨੀ",
    nativeLang: "pa",
    regions: "Punjab, Delhi, Haryana and the Punjabi diaspora in Canada, the UK and the US",
    about:
      "Hindu Punjabi families live in Punjab, Delhi and Haryana, and many settled across North India after Partition. Large Punjabi communities also live in Canada, the UK and the US.",
    customs: [
      "Roka and chunni chadana, when the groom's family covers the bride with a red chunni",
      "Chooda and kalire for the bride on the wedding morning",
      "Milni, where elders of both families greet and embrace, followed by the phere",
    ],
    tip: "Say which Punjabi Hindu communities you're open to, such as Khatri, Arora or Saini families.",
    communities: ["khatri-matrimony", "arora-matrimony", "gurmukh-matrimony", "saini-matrimony", "jat-matrimony"],
    cities: ["delhi-ncr", "nri"],
  },
  {
    slug: "bengali-matrimony",
    name: "Bengali",
    native: "বাঙালি পাত্র-পাত্রী",
    nativeLang: "bn",
    regions: "West Bengal, Tripura and Assam, with Bengali families in Delhi, Mumbai, Bengaluru and abroad",
    about:
      "Bengali Hindu families come from Kolkata and every part of West Bengal, as well as Tripura and Assam. Many now live in Delhi, Mumbai and Bengaluru, and keep Durga Puja and their wedding customs close.",
    customs: [
      "Aashirbaad, when the elders of each family bless the bride and groom",
      "Gaye holud, the turmeric ceremony on the wedding morning",
      "Shubho drishti and saat paak, then sindoor daan",
    ],
    tip: "Add your community and your family's home district; Bengali families often ask for both.",
    communities: ["kayastha-matrimony", "brahmin-matrimony", "dhoba-matrimony"],
    cities: ["kolkata", "delhi-ncr", "bengaluru"],
  },
  {
    slug: "odia-matrimony",
    name: "Odia",
    native: "ଓଡ଼ିଆ ବିବାହ",
    nativeLang: "or",
    regions: "Odisha, with Odia families in Kolkata, Hyderabad, Bengaluru and abroad",
    about:
      "Odia Hindu families come from Bhubaneswar, Cuttack, Puri, Berhampur and every part of Odisha. Lord Jagannath of Puri is at the heart of many families' faith.",
    customs: [
      "Nirbandha, the formal engagement between the two families",
      "Mangana, the turmeric ceremony before the wedding",
      "Hatha ganthi, when the couple's hands are tied together, and the saptapadi",
    ],
    tip: "Add your community and home district in Odisha; it helps families find a match close to home.",
    communities: ["brahmin-matrimony", "teli-matrimony", "dhoba-matrimony"],
    cities: ["kolkata", "hyderabad", "bengaluru"],
  },
  {
    slug: "sindhi-matrimony",
    name: "Sindhi",
    native: "सिंधी रिश्ते",
    nativeLang: "sd",
    regions: "Mumbai, Ulhasnagar, Ahmedabad, Pune, Jaipur and Sindhi communities worldwide",
    about:
      "Sindhi Hindu families came from Sindh and settled across India and the world after Partition. Many are devotees of Jhulelal, and close community ties remain strong.",
    customs: [
      "Kachchi misri and pakki misri, the informal and formal engagements",
      "Saanth, a pre-wedding ritual of blessing and oil",
      "Phere around the sacred fire",
    ],
    tip: "Mention whether your family is Amil, Bhaibund or another Sindhi group, and your city.",
    communities: ["sindhi-matrimony", "lohana-matrimony"],
    cities: ["mumbai", "ahmedabad", "pune"],
  },
];
