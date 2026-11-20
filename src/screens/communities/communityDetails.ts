/**
 * Unique, per-community text for /communities/:slug, so each page is more than the shared template.
 * Keep it general and well documented: where families live, languages, common wedding customs, and
 * one matching tip. No member counts, success stories or claims about who is on the site.
 * Customs vary by family and region; the page says so. Have a member of the community review new text.
 */
export interface CommunityDetail {
  regions: string;
  languages: string;
  about: string;
  customs: string[];
  tip: string;
}

// Customs shared by many communities in the same region.
const NORTH = [
  "Roka or sagai (engagement), where the two families formally agree to the match",
  "Haldi and mehndi in the days before the wedding",
  "Phere around the sacred fire, kanyadaan and sindoor daan",
];
const PUNJABI = [
  "Roka and chunni chadana, when the groom's family covers the bride with a red chunni",
  "Chooda and kalire for the bride on the wedding morning",
  "Milni, where elders of both families greet and embrace, followed by the phere",
];
const GUJARATI = [
  "Gol dhana (engagement), with coriander seeds and jaggery shared between the families",
  "Mameru, gifts for the bride from her maternal uncle",
  "Hasta milap and the saat phera around the sacred fire",
];
const MARATHI = [
  "Sakharpuda (engagement), with sugar exchanged between the families",
  "Halad (haldi) for the bride and groom",
  "Antarpat and mangalashtaka, followed by the saptapadi",
];
const TELUGU = [
  "Pellichoopulu and nischitartham (meeting and engagement)",
  "Jeelakarra-bellam: cumin and jaggery placed on each other's heads at the muhurtham",
  "Mangalya dharana and talambralu, showering each other with turmeric rice",
];
const TAMIL = [
  "Nichayathartham (engagement) at the bride's home",
  "Muhurtham with thali tying (mangalya dharanam) to the sound of the nadaswaram",
  "Saptapadi and the exchange of garlands",
];
const KERALA = [
  "Short temple or auditorium weddings at the auspicious muhurtham",
  "Thali tying and the exchange of garlands",
  "Pudava koda, when the groom gives the bride a new pudava (cloth)",
];

export const communityDetails: Record<string, CommunityDetail> = {
  "agarwal-matrimony": {
    regions: "Haryana, Rajasthan, Uttar Pradesh, Delhi and business centres across India",
    languages: "Hindi, Marwari, Haryanvi",
    about:
      "Agarwal families trace their origin to Maharaja Agrasen and the ancient town of Agroha in Haryana, and are traditionally organised into 18 gotras. Trade, business and the professions are strong in the community, with large Agarwal families in Delhi, Mumbai, Kolkata and abroad.",
    customs: NORTH,
    tip: "Most Agarwal families avoid a match within the same gotra, so add your gotra to your profile.",
  },
  "arora-matrimony": {
    regions: "Punjab, Delhi, Haryana and the Punjabi diaspora",
    languages: "Punjabi, Hindi",
    about:
      "Arora families have roots in West Punjab and settled widely in Delhi, Punjab and Haryana after Partition. The community is known for enterprise in trade, business and the professions.",
    customs: PUNJABI,
    tip: "Say on your profile whether you are open to other Punjabi Hindu communities such as Khatri families.",
  },
  "baniya-matrimony": {
    regions: "Rajasthan, Uttar Pradesh, Madhya Pradesh, Gujarat and trading centres across India",
    languages: "Hindi, Marwari, Gujarati",
    about:
      "Baniya (Vaishya) families, including Oswal, Khandelwal and Varshney families, are trading communities found across North and West India. Many have moved into business, finance and the professions in cities across India and abroad.",
    customs: NORTH,
    tip: "Mention your sub-community and gotra; families often check both before talks begin.",
  },
  "brahmin-matrimony": {
    regions: "Every state of India",
    languages: "Kannada, Tamil, Telugu, Hindi, Marathi and more",
    about:
      "Brahmin families span every region, from Smartha and Madhwa families in Karnataka to Iyer families in Tamil Nadu and Kanyakubja families in Uttar Pradesh. Customs differ by region and by sampradaya (tradition), so families usually look first within their own.",
    customs: [
      "Matching of gotra and nakshatra before talks begin",
      "Kashi Yatra, the groom's playful departure for Kashi, in many South Indian weddings",
      "Kanyadaan, mangalya dharana and the saptapadi",
    ],
    tip: "Add your sub-sect (for example Smartha, Madhwa or Iyer), gotra and nakshatra; many families filter on these first.",
  },
  "bhumihar-matrimony": {
    regions: "Bihar, eastern Uttar Pradesh, Jharkhand, and western Uttar Pradesh and Delhi NCR for Tyagi families",
    languages: "Hindi, Bhojpuri, Maithili, Magahi",
    about:
      "Bhumihar families are found mainly in Bihar and eastern Uttar Pradesh, while Tyagi families live largely in western Uttar Pradesh and around Delhi. Many have long links to land and farming as well as to education and the professions.",
    customs: [
      "Tilak ceremony, when the bride's family visits the groom's home",
      "Haldi and matkor in the days before the wedding",
      "Phere and sindoor daan",
    ],
    tip: "Mention your gotra and home district; families often prefer a match from a known region.",
  },
  "chettiar-matrimony": {
    regions: "Tamil Nadu, especially the Chettinad region around Karaikudi, and business centres abroad",
    languages: "Tamil",
    about:
      "Chettiar communities live mainly in Tamil Nadu. Nattukottai Chettiars from Chettinad are known for banking and trade and for their grand ancestral homes, while Devanga families have a long tradition of weaving.",
    customs: [
      "Matches guided by the family's temple (kovil) affiliation",
      "Weddings often held at the ancestral home",
      "Thali tying (mangalya dharanam) at the muhurtham",
    ],
    tip: "Mention your sub-community and kovil; families often check these first.",
  },
  "dhoba-matrimony": {
    regions: "Uttar Pradesh, Bihar, West Bengal, Odisha, Madhya Pradesh and beyond",
    languages: "Hindi, Bhojpuri, Bengali, Odia",
    about:
      "Dhoba (Rajak) families live across North and East India. The community's traditional work was laundering, and today its members work in every field, from government service to business and technology.",
    customs: NORTH,
    tip: "Add your state and the language spoken at home; families often look for a match from the same region.",
  },
  "ezhava-matrimony": {
    regions: "Kerala, and coastal Karnataka for Billava families",
    languages: "Malayalam, Tulu",
    about:
      "Ezhava and Thiyya families are among the largest communities in Kerala, and Billavas are the related community of coastal Karnataka. The social reformer Sree Narayana Guru came from the Ezhava community and encouraged simple, dignified weddings.",
    customs: KERALA,
    tip: "Mention whether your family is Ezhava, Thiyya or Billava, and your district.",
  },
  "gounder-matrimony": {
    regions: "The Kongu region of western Tamil Nadu: Coimbatore, Erode, Tiruppur, Salem and Namakkal",
    languages: "Tamil",
    about:
      "Kongu Vellala Gounder families come mainly from the Kongu region of western Tamil Nadu. Farming, textiles and industry are strong in the community.",
    customs: [
      "Families organised into kootams (clans); a match within the same kootam is avoided",
      "An arumaikkarar, a respected elder, guides the wedding rituals",
      "Thali tying at the muhurtham",
    ],
    tip: "Add your kootam to your profile; it is usually the first thing families ask.",
  },
  "gurmukh-matrimony": {
    regions: "Punjab, Delhi, Haryana and the Punjabi diaspora",
    languages: "Punjabi, Hindi",
    about:
      "Hindu Punjabi families from Punjab, Delhi and Haryana, and from Punjabi communities across India and abroad, who value close family ties and lively weddings.",
    customs: PUNJABI,
    tip: "Say which Punjabi communities you are open to, such as Khatri or Arora families.",
  },
  "jat-matrimony": {
    regions: "Haryana, Rajasthan, western Uttar Pradesh, Punjab and Delhi",
    languages: "Haryanvi, Hindi, Punjabi, Rajasthani",
    about:
      "Jat families come mainly from Haryana, Rajasthan, western Uttar Pradesh and Delhi. The community has deep roots in farming and is known for service in the armed forces and for sport.",
    customs: [
      "Sagai and lagan, when the wedding date is fixed",
      "Bhaat, when the maternal uncle brings gifts for the wedding",
      "Phere around the sacred fire",
    ],
    tip: "Many Jat families avoid the gotras of both parents' families, so mention your gotra and your mother's gotra.",
  },
  "kamma-matrimony": {
    regions: "Andhra Pradesh and Telangana, especially Krishna, Guntur and Prakasam districts, with large communities in Hyderabad, Bengaluru, Chennai and the US",
    languages: "Telugu",
    about:
      "Kamma families are spread across Andhra Pradesh and Telangana. Agriculture, business, cinema and technology are all strong in the community.",
    customs: TELUGU,
    tip: "Mention your gotra; Kamma families avoid a match within the same gotra.",
  },
  "kayastha-matrimony": {
    regions: "Uttar Pradesh, Bihar, Madhya Pradesh, Delhi and West Bengal",
    languages: "Hindi, Bhojpuri, Bengali",
    about:
      "Kayastha families, including Srivastava, Saxena, Mathur and Nigam families, have long traditions as scribes and administrators and are known for education and the professions. Many worship Chitragupta as the family deity.",
    customs: NORTH,
    tip: "Mention your sub-group and whether you are open to matches across Kayastha sub-groups.",
  },
  "khatri-matrimony": {
    regions: "Punjab, Delhi, Haryana and the Punjabi diaspora",
    languages: "Punjabi, Hindi",
    about:
      "Khatri families, with surnames such as Mehra, Khanna and Kapoor, have roots in Punjab and settled widely in Delhi and across India after Partition. Business and the professions are strong in the community.",
    customs: PUNJABI,
    tip: "Mention your gotra and whether you are open to other Punjabi Hindu communities.",
  },
  "koli-matrimony": {
    regions: "Gujarat and Maharashtra",
    languages: "Gujarati, Marathi",
    about:
      "Koli families live mainly in Gujarat and Maharashtra, with Mahadev Koli families in the hills of Maharashtra and many Koli Patel families in Gujarat. Fishing and farming are traditional occupations, and members now work in every field.",
    customs: GUJARATI,
    tip: "Add your state, district and the language spoken at home.",
  },
  "kumbhar-matrimony": {
    regions: "Uttar Pradesh, Rajasthan, Madhya Pradesh, Maharashtra, Gujarat and beyond",
    languages: "Hindi, Marathi, Gujarati",
    about:
      "Kumbhar families, many of whom use the name Prajapati, are the traditional potters of North, Central and West India. Today the community works across business, government service and the professions.",
    customs: NORTH,
    tip: "Mention your state and gotra; families often prefer a match from the same region.",
  },
  "kurmi-matrimony": {
    regions: "Bihar, Uttar Pradesh, Jharkhand, Madhya Pradesh, and Gujarat for related Patel families",
    languages: "Hindi, Bhojpuri, Magahi",
    about:
      "Kurmi families are a large farming community of Bihar, Uttar Pradesh, Jharkhand and Madhya Pradesh, with Mahato families in Jharkhand and West Bengal.",
    customs: NORTH,
    tip: "Add your state and home district; it helps families find a match close to home.",
  },
  "kshatriya-matrimony": {
    regions: "Across India, including the Raju families of coastal Andhra Pradesh",
    languages: "Telugu, Hindi and other regional languages",
    about:
      "Kshatriya families live in many parts of India and include the Raju families of coastal Andhra Pradesh, around Bhimavaram and Visakhapatnam. Customs follow each family's region.",
    customs: [
      "Engagement between the families at the bride's home",
      "Haldi or mangala snanam before the wedding",
      "The wedding at the muhurtham around the sacred fire",
    ],
    tip: "Mention your region and gotra so families from the same tradition can find you.",
  },
  "lohana-matrimony": {
    regions: "Gujarat, Kutch and Mumbai, with a large diaspora in East Africa, the UK and the Gulf",
    languages: "Gujarati, Kutchi, Sindhi",
    about:
      "Lohana families, including Thakkar and Bhatia families, are a trading community from Gujarat, Kutch and Sindh. Many are devotees of Jalaram Bapa of Virpur.",
    customs: GUJARATI,
    tip: "Mention whether your family is Gujarati, Kutchi or Sindhi Lohana, and your city.",
  },
  "mali-matrimony": {
    regions: "Maharashtra, Rajasthan, Madhya Pradesh and Uttar Pradesh",
    languages: "Marathi, Hindi, Rajasthani",
    about:
      "Mali families, traditionally gardeners and farmers, live across Maharashtra, Rajasthan, Madhya Pradesh and Uttar Pradesh. The social reformers Jyotirao and Savitribai Phule came from the Mali community.",
    customs: MARATHI,
    tip: "Add your state and the language spoken at home.",
  },
  "maratha-matrimony": {
    regions: "Maharashtra, Goa and parts of Karnataka",
    languages: "Marathi",
    about:
      "Maratha families, including 96 Kuli Maratha, Kunbi, Patil and Deshmukh families, are the largest community in Maharashtra and take great pride in the legacy of Chhatrapati Shivaji Maharaj.",
    customs: MARATHI,
    tip: "Mention your kul and devak; many families check these before talks begin.",
  },
  "maheshwari-matrimony": {
    regions: "Rajasthan, with large Marwari communities in Mumbai, Kolkata, Hyderabad and Bengaluru",
    languages: "Marwari, Hindi",
    about:
      "Maheshwari families are a Marwari trading community from Rajasthan who worship Lord Mahesh (Shiva). They are traditionally organised into 72 khaps, or gotras.",
    customs: [
      "Tilak and sagai between the families",
      "Mayra, gifts from the maternal family before the wedding",
      "Phere around the sacred fire",
    ],
    tip: "Add your khap (gotra); families avoid a match within the same one.",
  },
  "mudaliar-matrimony": {
    regions: "Northern Tamil Nadu, including Chennai, Vellore and the Arcot region",
    languages: "Tamil",
    about:
      "Mudaliar families come mainly from northern Tamil Nadu and include Thuluva Vellala, Agamudayar and other sub-communities. Education, business and government service are strong in the community.",
    customs: TAMIL,
    tip: "Mention your sub-community and native place; families often look for both.",
  },
  "nair-matrimony": {
    regions: "Kerala, with large communities in Bengaluru, Chennai, Mumbai and the Gulf",
    languages: "Malayalam",
    about:
      "Nair families come from Kerala and include titles such as Menon, Pillai, Panicker and Kurup. The community historically followed a matrilineal system called marumakkathayam.",
    customs: KERALA,
    tip: "Many families match by nakshatra, so add your star and birth time.",
  },
  "naidu-matrimony": {
    regions: "Andhra Pradesh, Telangana and Tamil Nadu",
    languages: "Telugu, Tamil",
    about:
      "Naidu families include Balija, Kapu, Gavara and Telaga communities across Andhra Pradesh, Telangana and Tamil Nadu. Farming, trade and the professions are all strong in the community.",
    customs: TELUGU,
    tip: "Mention your sub-community and gotra; families usually look within their own first.",
  },
  "patel-matrimony": {
    regions: "Central and north Gujarat, with a large diaspora in the US, UK and East Africa",
    languages: "Gujarati",
    about:
      "Patel (Patidar) families, including Leuva and Kadva Patidars and Anjana Chaudhary families, come mainly from Gujarat. Farming, business and enterprise abroad are strong in the community.",
    customs: GUJARATI,
    tip: "Mention whether you are Leuva or Kadva Patidar, and your native village or district.",
  },
  "rajput-matrimony": {
    regions: "Rajasthan, Gujarat, Madhya Pradesh, Uttar Pradesh, Uttarakhand and Himachal Pradesh",
    languages: "Hindi, Rajasthani",
    about:
      "Rajput families, with clans such as Chauhan, Rathore, Sisodia and Kushwaha, are found across North and West India and have proud traditions of service in the armed forces.",
    customs: [
      "Tilak, when the bride's family visits the groom's home",
      "Baraat with the groom on horseback, often in a safa",
      "Phere around the sacred fire",
    ],
    tip: "Families avoid a match within the same clan, so mention your clan and gotra.",
  },
  "reddy-matrimony": {
    regions: "Andhra Pradesh, Telangana and Karnataka",
    languages: "Telugu, Kannada",
    about:
      "Reddy families, including Motati, Gudati and Pokanati families, are a large community of Andhra Pradesh and Telangana with deep roots in farming, now strong in business, politics and technology.",
    customs: TELUGU,
    tip: "Mention your sub-community and gotra; families usually check both.",
  },
  "saini-matrimony": {
    regions: "Punjab, Haryana, Himachal Pradesh, Rajasthan and western Uttar Pradesh",
    languages: "Punjabi, Hindi",
    about:
      "Saini families live mainly in Punjab, Haryana, Himachal Pradesh, Rajasthan and western Uttar Pradesh, with roots in farming and a long record of service in the armed forces.",
    customs: NORTH,
    tip: "Add your gotra and home state.",
  },
  "sindhi-matrimony": {
    regions: "Mumbai, Ulhasnagar, Ahmedabad, Pune, Jaipur and Sindhi communities worldwide",
    languages: "Sindhi, Hindi",
    about:
      "Sindhi Hindu families, including Amil and Lohana (Bhaibund) families, came from Sindh and settled across India and the world after Partition. Many are devotees of Jhulelal.",
    customs: [
      "Kachchi misri and pakki misri, the informal and formal engagements",
      "Saanth, a pre-wedding ritual of blessing and oil",
      "Phere around the sacred fire",
    ],
    tip: "Mention whether your family is Amil, Bhaibund or another Sindhi group, and your city.",
  },
  "sonar-matrimony": {
    regions: "Across India, especially Uttar Pradesh, Bihar, Maharashtra, Rajasthan and West Bengal",
    languages: "Hindi, Marathi, Bengali",
    about:
      "Sonar (Sunar) families are the traditional goldsmiths of India. Many still run jewellery businesses, and the community now works in every field.",
    customs: NORTH,
    tip: "Add your state and the language spoken at home.",
  },
  "teli-matrimony": {
    regions: "Uttar Pradesh, Bihar, Chhattisgarh, Madhya Pradesh, Odisha and Maharashtra",
    languages: "Hindi, Chhattisgarhi, Odia, Marathi",
    about:
      "Teli families, including Sahu families, live across North, Central and East India. The community's traditional work was pressing oil, and today it is active in trade, farming and the professions.",
    customs: NORTH,
    tip: "Mention your state and sub-group; families often prefer a match from the same region.",
  },
  "vankar-matrimony": {
    regions: "Gujarat and Rajasthan",
    languages: "Gujarati, Rajasthani",
    about:
      "Vankar families, the traditional weavers of Gujarat and Rajasthan, are known for handloom craft. Today the community works in every field.",
    customs: GUJARATI,
    tip: "Add your district and the language spoken at home.",
  },
  "vanniyar-matrimony": {
    regions: "Northern Tamil Nadu, including Villupuram, Cuddalore, Salem and Dharmapuri",
    languages: "Tamil",
    about:
      "Vanniyar families, including Gounder and Padayachi families, are one of the largest communities in northern Tamil Nadu, with deep roots in farming.",
    customs: TAMIL,
    tip: "Mention your native district and sub-group.",
  },
  "vellalar-matrimony": {
    regions: "Across Tamil Nadu",
    languages: "Tamil",
    about:
      "Vellalar families, traditionally landowners and farmers, live across Tamil Nadu and include Pillai, Mudaliar and Gounder sub-communities. Customs differ from region to region.",
    customs: TAMIL,
    tip: "Mention your sub-community and native place.",
  },
  "vishwakarma-matrimony": {
    regions: "Across India",
    languages: "Hindi, Gujarati, Marathi, Telugu, Kannada, Tamil and more",
    about:
      "Vishwakarma families, including Lohar, Panchal, Sutar and Gajjar families, are the traditional artisans of India: smiths, carpenters and sculptors. They honour Lord Vishwakarma, the divine architect.",
    customs: NORTH,
    tip: "Add your sub-group, state and the language spoken at home.",
  },
  "vysya-matrimony": {
    regions: "Andhra Pradesh, Telangana, Karnataka and Tamil Nadu",
    languages: "Telugu, Kannada, Tamil",
    about:
      "Arya Vysya (Komati) families are a trading community of South India. Vasavi Kanyaka Parameswari is their family deity, with her main temple at Penugonda in Andhra Pradesh.",
    customs: TELUGU,
    tip: "Arya Vysya families are organised into gotras; add yours, as a match within the same gotra is avoided.",
  },
  "yadav-matrimony": {
    regions: "Uttar Pradesh, Bihar, Haryana, Madhya Pradesh and Rajasthan",
    languages: "Hindi, Bhojpuri, Haryanvi",
    about:
      "Yadav families, including Ahir and Gwala families, trace their lineage to the Yadu dynasty of Lord Krishna. Farming, dairy, politics and the armed forces are all strong in the community.",
    customs: NORTH,
    tip: "Mention your gotra and home state.",
  },
};
