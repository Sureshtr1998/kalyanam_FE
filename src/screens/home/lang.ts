import type { Lang } from "@/lib/i18n";

const en = {
  noMatches: "No one matches these filters yet",
  justStarted: "We're just getting started, thank you for joining early",
  filteredTip:
    "Try widening the age range or adding more communities. Matching works both ways, so you only see families whose own preferences include you.",
  newLead: "Seetha Rama Kalyana is new, and we're personally inviting families every day.",
  patience: "Please give us a little time",
  patienceRest: ", it can take a while before profiles that match you both ways appear here.",
  membershipBold: (start: string) => `Your 1-year membership starts in ${start}`,
  membershipRest: (now: string) =>
    `, not today (${now}). This is the same for every member, so the waiting time is on us. Until then you can use everything without limits.`,
  noCheckBold: "No need to keep checking.",
  noCheckRest: "As soon as someone sends you an interest, we'll email you.",
  completeTip: "A complete profile with photos gets noticed first when new families join.",
  adjustFilters: "Adjust filters",
  completeProfile: "Complete your profile",
  exploreAstro: "Explore Vedic astrology",
};

export const homeText: Record<Lang, typeof en> = {
  en,
  kn: {
    noMatches: "ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ಇನ್ನೂ ಯಾರೂ ಹೊಂದುತ್ತಿಲ್ಲ",
    justStarted: "ನಾವು ಈಗಷ್ಟೇ ಆರಂಭಿಸಿದ್ದೇವೆ, ಬೇಗನೆ ಸೇರಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು",
    filteredTip:
      "ವಯಸ್ಸಿನ ಶ್ರೇಣಿಯನ್ನು ವಿಸ್ತರಿಸಿ ಅಥವಾ ಹೆಚ್ಚಿನ ಸಮುದಾಯಗಳನ್ನು ಸೇರಿಸಿ ನೋಡಿ. ಹೊಂದಾಣಿಕೆ ಎರಡೂ ಕಡೆಯಿಂದ ಆಗುತ್ತದೆ, ಆದ್ದರಿಂದ ಯಾರ ಆದ್ಯತೆಗಳಲ್ಲಿ ನೀವು ಸೇರಿದ್ದೀರೋ ಆ ಕುಟುಂಬಗಳು ಮಾತ್ರ ಕಾಣುತ್ತವೆ.",
    newLead: "ಸೀತಾ ರಾಮ ಕಲ್ಯಾಣ ಹೊಸದು, ನಾವು ಪ್ರತಿದಿನ ಕುಟುಂಬಗಳನ್ನು ವೈಯಕ್ತಿಕವಾಗಿ ಆಹ್ವಾನಿಸುತ್ತಿದ್ದೇವೆ.",
    patience: "ದಯವಿಟ್ಟು ನಮಗೆ ಸ್ವಲ್ಪ ಸಮಯ ನೀಡಿ",
    patienceRest: ", ಎರಡೂ ಕಡೆಯಿಂದ ಹೊಂದುವ ಪ್ರೊಫೈಲ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಲು ಸ್ವಲ್ಪ ಸಮಯ ಹಿಡಿಯಬಹುದು.",
    membershipBold: (start) => `ನಿಮ್ಮ 1 ವರ್ಷದ ಸದಸ್ಯತ್ವ ${start} ರಿಂದ ಆರಂಭವಾಗುತ್ತದೆ`,
    membershipRest: (now) =>
      `, ಇಂದಿನಿಂದ (${now}) ಅಲ್ಲ. ಇದು ಎಲ್ಲ ಸದಸ್ಯರಿಗೂ ಒಂದೇ, ಆದ್ದರಿಂದ ಕಾಯುವ ಸಮಯದ ಹೊಣೆ ನಮ್ಮದು. ಅಲ್ಲಿಯವರೆಗೆ ಎಲ್ಲವನ್ನೂ ಮಿತಿಯಿಲ್ಲದೆ ಬಳಸಬಹುದು.`,
    noCheckBold: "ಪದೇ ಪದೇ ನೋಡುವ ಅಗತ್ಯವಿಲ್ಲ.",
    noCheckRest: "ಯಾರಾದರೂ ನಿಮಗೆ ಆಸಕ್ತಿ ಕಳುಹಿಸಿದ ತಕ್ಷಣ ನಾವು ಇಮೇಲ್ ಮಾಡುತ್ತೇವೆ.",
    completeTip: "ಹೊಸ ಕುಟುಂಬಗಳು ಸೇರಿದಾಗ, ಫೋಟೋಗಳಿರುವ ಸಂಪೂರ್ಣ ಪ್ರೊಫೈಲ್ ಮೊದಲು ಗಮನ ಸೆಳೆಯುತ್ತದೆ.",
    adjustFilters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಿಸಿ",
    completeProfile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    exploreAstro: "ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ನೋಡಿ",
  },
  hi: {
    noMatches: "इन फ़िल्टर से अभी कोई मेल नहीं खाता",
    justStarted: "हमने अभी शुरुआत की है, जल्दी जुड़ने के लिए धन्यवाद",
    filteredTip:
      "उम्र की सीमा बढ़ाकर या और समुदाय जोड़कर देखें। मिलान दोनों तरफ़ से होता है, इसलिए आपको केवल वे परिवार दिखते हैं जिनकी अपनी पसंद में आप शामिल हैं।",
    newLead: "सीता राम कल्याण नया है, और हम हर दिन परिवारों को व्यक्तिगत रूप से आमंत्रित कर रहे हैं।",
    patience: "कृपया हमें थोड़ा समय दें",
    patienceRest: ", दोनों तरफ़ से मेल खाने वाली प्रोफ़ाइल यहाँ दिखने में कुछ समय लग सकता है।",
    membershipBold: (start) => `आपकी 1 वर्ष की सदस्यता ${start} से शुरू होगी`,
    membershipRest: (now) =>
      `, आज (${now}) से नहीं। यह हर सदस्य के लिए एक समान है, इसलिए इंतज़ार का समय हमारी ओर से है। तब तक आप सब कुछ बिना किसी सीमा के उपयोग कर सकते हैं।`,
    noCheckBold: "बार-बार देखने की ज़रूरत नहीं।",
    noCheckRest: "जैसे ही कोई आपको रुचि भेजेगा, हम आपको ईमेल करेंगे।",
    completeTip: "नए परिवारों के जुड़ने पर फ़ोटो वाली पूरी प्रोफ़ाइल सबसे पहले नज़र में आती है।",
    adjustFilters: "फ़िल्टर बदलें",
    completeProfile: "अपनी प्रोफ़ाइल पूरी करें",
    exploreAstro: "वैदिक ज्योतिष देखें",
  },
  ta: {
    noMatches: "இந்த வடிகட்டிகளுக்கு இன்னும் யாரும் பொருந்தவில்லை",
    justStarted: "நாங்கள் இப்போதுதான் தொடங்கியுள்ளோம், முன்கூட்டியே இணைந்ததற்கு நன்றி",
    filteredTip:
      "வயது வரம்பை விரிவாக்கி அல்லது மேலும் சமூகங்களைச் சேர்த்துப் பாருங்கள். பொருத்தம் இரு பக்கமும் பார்க்கப்படுகிறது, எனவே யாருடைய விருப்பங்களில் நீங்கள் அடங்குகிறீர்களோ அந்தக் குடும்பங்கள் மட்டுமே தெரியும்.",
    newLead: "சீதா ராம கல்யாணம் புதியது, நாங்கள் தினமும் குடும்பங்களை நேரில் அழைத்து வருகிறோம்.",
    patience: "தயவுசெய்து எங்களுக்குச் சிறிது நேரம் கொடுங்கள்",
    patienceRest: ", இரு பக்கமும் பொருந்தும் சுயவிவரங்கள் இங்கு தோன்றச் சிறிது காலம் ஆகலாம்.",
    membershipBold: (start) => `உங்கள் 1 ஆண்டு உறுப்பினர் காலம் ${start} முதல் தொடங்கும்`,
    membershipRest: (now) =>
      `, இன்று (${now}) முதல் அல்ல. இது அனைத்து உறுப்பினர்களுக்கும் ஒன்றே, எனவே காத்திருப்பு நேரம் எங்கள் பொறுப்பு. அதுவரை அனைத்தையும் வரம்பின்றிப் பயன்படுத்தலாம்.`,
    noCheckBold: "அடிக்கடி பார்க்க வேண்டியதில்லை.",
    noCheckRest: "யாராவது உங்களுக்கு விருப்பம் அனுப்பியவுடன் நாங்கள் மின்னஞ்சல் அனுப்புவோம்.",
    completeTip: "புதிய குடும்பங்கள் இணையும்போது, புகைப்படங்களுடன் கூடிய முழுமையான சுயவிவரமே முதலில் கவனிக்கப்படும்.",
    adjustFilters: "வடிகட்டிகளை மாற்று",
    completeProfile: "உங்கள் சுயவிவரத்தை நிறைவு செய்யுங்கள்",
    exploreAstro: "வேத ஜோதிடத்தைப் பாருங்கள்",
  },
  te: {
    noMatches: "ఈ ఫిల్టర్‌లకు ఇంకా ఎవరూ సరిపోలడం లేదు",
    justStarted: "మేము ఇప్పుడే ప్రారంభించాము, ముందుగా చేరినందుకు ధన్యవాదాలు",
    filteredTip:
      "వయస్సు పరిధిని పెంచి లేదా మరిన్ని సమాజాలను జోడించి చూడండి. మ్యాచింగ్ ఇరువైపులా జరుగుతుంది, కాబట్టి ఎవరి ప్రాధాన్యతల్లో మీరు ఉన్నారో ఆ కుటుంబాలు మాత్రమే కనిపిస్తాయి.",
    newLead: "సీతా రామ కళ్యాణ కొత్తది, మేము ప్రతిరోజూ కుటుంబాలను వ్యక్తిగతంగా ఆహ్వానిస్తున్నాము.",
    patience: "దయచేసి మాకు కొంత సమయం ఇవ్వండి",
    patienceRest: ", ఇరువైపులా సరిపోయే ప్రొఫైల్‌లు ఇక్కడ కనిపించడానికి కొంత సమయం పట్టవచ్చు.",
    membershipBold: (start) => `మీ 1 సంవత్సర సభ్యత్వం ${start} నుండి ప్రారంభమవుతుంది`,
    membershipRest: (now) =>
      `, ఈ రోజు (${now}) నుండి కాదు. ఇది ప్రతి సభ్యునికీ ఒకటే, కాబట్టి వేచి ఉండే సమయం మా బాధ్యత. అప్పటివరకు అన్నింటినీ పరిమితి లేకుండా ఉపయోగించవచ్చు.`,
    noCheckBold: "పదే పదే చూడాల్సిన అవసరం లేదు.",
    noCheckRest: "ఎవరైనా మీకు ఆసక్తి పంపిన వెంటనే మేము ఈమెయిల్ చేస్తాము.",
    completeTip: "కొత్త కుటుంబాలు చేరినప్పుడు, ఫోటోలతో కూడిన పూర్తి ప్రొఫైల్ ముందుగా దృష్టిని ఆకర్షిస్తుంది.",
    adjustFilters: "ఫిల్టర్‌లు మార్చండి",
    completeProfile: "మీ ప్రొఫైల్ పూర్తి చేయండి",
    exploreAstro: "వైదిక జ్యోతిష్యం చూడండి",
  },
};
