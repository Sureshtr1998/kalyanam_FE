import type { Lang } from "@/lib/i18n";

type Meta = { title: string; description: string };

/** Search-result titles and descriptions for the translated pages (see TRANSLATED_PATHS). */
export const seoText: Record<"home" | "about" | "pricing" | "partner", Record<Lang, Meta>> = {
  home: {
    en: {
      title: "Seetha Rama Kalyana | Hindu Matrimony Across India",
      description:
        "Hindu matrimony for families across India and abroad. Find brides and grooms from your community with verified profiles, two-way privacy, horoscope matching and no sales calls.",
    },
    kn: {
      title: "ಭಾರತದಾದ್ಯಂತ ಹಿಂದೂ ಮ್ಯಾಟ್ರಿಮೊನಿ | Seetha Rama Kalyana",
      description:
        "ಭಾರತ ಮತ್ತು ವಿದೇಶದಲ್ಲಿರುವ ಹಿಂದೂ ಕುಟುಂಬಗಳಿಗಾಗಿ ಮ್ಯಾಟ್ರಿಮೊನಿ. ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್‌ಗಳು, ಎರಡು-ಕಡೆಯ ಗೌಪ್ಯತೆ ಮತ್ತು ಜಾತಕ ಹೊಂದಾಣಿಕೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಸಮುದಾಯದ ವಧು-ವರರನ್ನು ಹುಡುಕಿ. ಮಾರಾಟದ ಕರೆಗಳಿಲ್ಲ.",
    },
    hi: {
      title: "पूरे भारत के लिए हिंदू मैट्रिमोनी | Seetha Rama Kalyana",
      description:
        "भारत और विदेश में रहने वाले हिंदू परिवारों के लिए मैट्रिमोनी। सत्यापित प्रोफ़ाइल, दो-तरफ़ा गोपनीयता और कुंडली मिलान के साथ अपने समुदाय के वर-वधू खोजें। कोई सेल्स कॉल नहीं।",
    },
    te: {
      title: "భారతదేశమంతటా హిందూ మ్యాట్రిమోనీ | Seetha Rama Kalyana",
      description:
        "భారతదేశం మరియు విదేశాల్లోని హిందూ కుటుంబాల కోసం మ్యాట్రిమోనీ. ధృవీకరించిన ప్రొఫైల్‌లు, రెండు వైపుల గోప్యత, జాతక పొంతనతో మీ సామాజిక వర్గం వధూవరులను కనుగొనండి. సేల్స్ కాల్స్ ఉండవు.",
    },
    ta: {
      title: "இந்தியா முழுவதும் இந்து மேட்ரிமோனி | Seetha Rama Kalyana",
      description:
        "இந்தியா மற்றும் வெளிநாடுகளில் உள்ள இந்து குடும்பங்களுக்கான மேட்ரிமோனி. சரிபார்க்கப்பட்ட சுயவிவரங்கள், இருவழி தனியுரிமை, ஜாதகப் பொருத்தத்துடன் உங்கள் சமூகத்தின் மணமக்களைக் கண்டறியுங்கள். விற்பனை அழைப்புகள் இல்லை.",
    },
  },
  about: {
    en: {
      title: "About Us | Seetha Rama Kalyana",
      description:
        "Why we built Seetha Rama Kalyana: a new, privacy-first Hindu matrimony platform for families across India, with verified profiles, honest pricing and no sales calls.",
    },
    kn: {
      title: "ನಮ್ಮ ಬಗ್ಗೆ | Seetha Rama Kalyana",
      description:
        "ಸೀತಾ ರಾಮ ಕಲ್ಯಾಣವನ್ನು ಏಕೆ ಆರಂಭಿಸಿದೆವು: ಭಾರತದಾದ್ಯಂತದ ಕುಟುಂಬಗಳಿಗಾಗಿ ಗೌಪ್ಯತೆಗೆ ಆದ್ಯತೆ ನೀಡುವ, ಪ್ರಾಮಾಣಿಕ ಬೆಲೆಯ, ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್‌ಗಳ ಹೊಸ ಹಿಂದೂ ಮ್ಯಾಟ್ರಿಮೊನಿ ವೇದಿಕೆ.",
    },
    hi: {
      title: "हमारे बारे में | Seetha Rama Kalyana",
      description:
        "हमने सीता राम कल्याण क्यों बनाया: पूरे भारत के परिवारों के लिए गोपनीयता-प्रथम, ईमानदार कीमत और सत्यापित प्रोफ़ाइल वाला नया हिंदू मैट्रिमोनी मंच।",
    },
    te: {
      title: "మా గురించి | Seetha Rama Kalyana",
      description:
        "సీతా రామ కళ్యాణను ఎందుకు ప్రారంభించాం: భారతదేశమంతటా ఉన్న కుటుంబాల కోసం గోప్యతకు ప్రాధాన్యం, నిజాయితీ ధరలు, ధృవీకరించిన ప్రొఫైల్‌లతో కూడిన కొత్త హిందూ మ్యాట్రిమోనీ వేదిక.",
    },
    ta: {
      title: "எங்களைப் பற்றி | Seetha Rama Kalyana",
      description:
        "சீதா ராம கல்யாணத்தை ஏன் தொடங்கினோம்: இந்தியா முழுவதும் உள்ள குடும்பங்களுக்காக தனியுரிமைக்கு முன்னுரிமை, நேர்மையான விலை, சரிபார்க்கப்பட்ட சுயவிவரங்கள் கொண்ட புதிய இந்து மேட்ரிமோனி தளம்.",
    },
  },
  pricing: {
    en: {
      title: "Pricing | Hindu Matrimony Membership | Seetha Rama Kalyana",
      description:
        "One yearly membership with interest credits included, and optional credit top-ups. No sales calls and no hidden charges.",
    },
    kn: {
      title: "ಬೆಲೆ | Seetha Rama Kalyana",
      description:
        "ಇಂಟರೆಸ್ಟ್ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ಒಳಗೊಂಡ ಒಂದು ವಾರ್ಷಿಕ ಸದಸ್ಯತ್ವ, ಬೇಕಿದ್ದರೆ ಮಾತ್ರ ಹೆಚ್ಚುವರಿ ಕ್ರೆಡಿಟ್‌ಗಳು. ಮಾರಾಟದ ಕರೆಗಳಿಲ್ಲ, ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲ.",
    },
    hi: {
      title: "कीमतें | Seetha Rama Kalyana",
      description:
        "इंटरेस्ट क्रेडिट सहित एक सालाना सदस्यता, और ज़रूरत हो तभी अतिरिक्त क्रेडिट। कोई सेल्स कॉल नहीं, कोई छिपा शुल्क नहीं।",
    },
    te: {
      title: "ధరలు | Seetha Rama Kalyana",
      description:
        "ఇంటరెస్ట్ క్రెడిట్‌లతో కూడిన ఒకే వార్షిక సభ్యత్వం, అవసరమైతేనే అదనపు క్రెడిట్‌లు. సేల్స్ కాల్స్ లేవు, దాచిన ఛార్జీలు లేవు.",
    },
    ta: {
      title: "கட்டணங்கள் | Seetha Rama Kalyana",
      description:
        "இன்டரஸ்ட் கிரெடிட்கள் அடங்கிய ஒரே ஆண்டு உறுப்பினர் சேர்க்கை, தேவைப்பட்டால் மட்டும் கூடுதல் கிரெடிட்கள். விற்பனை அழைப்புகள் இல்லை, மறைமுகக் கட்டணங்கள் இல்லை.",
    },
  },
  partner: {
    en: {
      title: "Partner With Us | Matrimony Broker Partnership – Seetha Rama Kalyana",
      description:
        "Partner with Seetha Rama Kalyana as a trusted matrimony broker. Earn referral commissions, track registrations, and grow your business digitally.",
    },
    kn: {
      title: "ಮ್ಯಾಟ್ರಿಮೊನಿ ಬ್ರೋಕರ್ ಪಾಲುದಾರಿಕೆ | Seetha Rama Kalyana",
      description:
        "ಸೀತಾ ರಾಮ ಕಲ್ಯಾಣದೊಂದಿಗೆ ಮ್ಯಾಟ್ರಿಮೊನಿ ಬ್ರೋಕರ್ ಆಗಿ ಪಾಲುದಾರರಾಗಿ. ರೆಫರಲ್ ಕಮಿಷನ್ ಗಳಿಸಿ, ನೋಂದಣಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ವ್ಯವಹಾರವನ್ನು ಡಿಜಿಟಲ್ ಆಗಿ ಬೆಳೆಸಿ.",
    },
    hi: {
      title: "मैट्रिमोनी ब्रोकर पार्टनरशिप | Seetha Rama Kalyana",
      description:
        "सीता राम कल्याण के साथ मैट्रिमोनी ब्रोकर के रूप में जुड़ें। रेफ़रल कमीशन कमाएँ, पंजीकरण ट्रैक करें और अपना व्यवसाय डिजिटल रूप से बढ़ाएँ।",
    },
    te: {
      title: "మ్యాట్రిమోనీ బ్రోకర్ భాగస్వామ్యం | Seetha Rama Kalyana",
      description:
        "సీతా రామ కళ్యాణతో మ్యాట్రిమోనీ బ్రోకర్‌గా భాగస్వాములవ్వండి. రెఫరల్ కమీషన్ సంపాదించండి, రిజిస్ట్రేషన్‌లను ట్రాక్ చేయండి, మీ వ్యాపారాన్ని డిజిటల్‌గా పెంచుకోండి.",
    },
    ta: {
      title: "மேட்ரிமோனி தரகர் கூட்டாண்மை | Seetha Rama Kalyana",
      description:
        "சீதா ராம கல்யாணத்துடன் மேட்ரிமோனி தரகராக இணையுங்கள். பரிந்துரை கமிஷன் பெறுங்கள், பதிவுகளைக் கண்காணியுங்கள், உங்கள் தொழிலை டிஜிட்டல் முறையில் வளர்த்துக்கொள்ளுங்கள்.",
    },
  },
};
