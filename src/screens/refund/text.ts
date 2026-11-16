import type { LegalDoc } from "@/components/common/legalDoc";
import type { Lang } from "@/lib/i18n";

/** Refund Policy in every site language. The English text is the binding one. */
export const refundText: Record<Lang, LegalDoc> = {
  en: {
    seoTitle: "Refund Policy | Seetha Rama Kalyana",
    seoDescription:
      "Seetha Rama Kalyana refund policy: Amount will be refunded only if user registration fails but payment is deducted. All other payments are non-refundable.",
    title: "Refund Policy",
    description: "Please read this policy carefully to understand when refunds are provided.",
    sections: [
      {
        id: "conditions",
        title: "Refund conditions",
        blocks: [
          "If your registration fails but the payment is deducted, the amount will be refunded in full.",
          "**Important:** in all other cases, including successful registrations, interest purchases and astrology readings, payments are **non-refundable**.",
        ],
      },
      {
        id: "misuse",
        title: "Accounts removed for misuse",
        blocks: [
          "If an account is blocked and removed because the member misused another member's phone number, email or photos, harassed a member, or broke our [member safety rules](/terms#safety), the membership fee and any unused credits are **not refunded**.",
        ],
      },
      {
        id: "how",
        title: "How to request a refund",
        blocks: [
          "Email {email} with your Razorpay payment ID and the email you registered with. This policy is subject to change without notice.",
        ],
      },
    ],
  },
  kn: {
    seoTitle: "ಮರುಪಾವತಿ ನೀತಿ | Seetha Rama Kalyana",
    seoDescription:
      "ಸೀತಾ ರಾಮ ಕಲ್ಯಾಣ ಮರುಪಾವತಿ ನೀತಿ: ನೋಂದಣಿ ವಿಫಲವಾಗಿ ಹಣ ಕಡಿತವಾದರೆ ಮಾತ್ರ ಮರುಪಾವತಿ. ಉಳಿದ ಎಲ್ಲ ಪಾವತಿಗಳಿಗೆ ಮರುಪಾವತಿ ಇಲ್ಲ.",
    title: "ಮರುಪಾವತಿ ನೀತಿ",
    description: "ಮರುಪಾವತಿ ಯಾವಾಗ ಸಿಗುತ್ತದೆ ಎಂದು ತಿಳಿಯಲು ಈ ನೀತಿಯನ್ನು ಗಮನವಿಟ್ಟು ಓದಿ.",
    sections: [
      {
        id: "conditions",
        title: "ಮರುಪಾವತಿಯ ಷರತ್ತುಗಳು",
        blocks: [
          "ನಿಮ್ಮ ನೋಂದಣಿ ವಿಫಲವಾಗಿ ಹಣ ಕಡಿತವಾಗಿದ್ದರೆ, ಪೂರ್ಣ ಮೊತ್ತ ಮರುಪಾವತಿಯಾಗುತ್ತದೆ.",
          "**ಮುಖ್ಯ:** ಯಶಸ್ವಿ ನೋಂದಣಿ, ಇಂಟರೆಸ್ಟ್ ಖರೀದಿ ಮತ್ತು ಜಾತಕ ಸೇವೆ ಸೇರಿದಂತೆ ಉಳಿದ ಎಲ್ಲ ಸಂದರ್ಭಗಳಲ್ಲಿ ಪಾವತಿಗಳಿಗೆ **ಮರುಪಾವತಿ ಇಲ್ಲ**.",
        ],
      },
      {
        id: "misuse",
        title: "ದುರುಪಯೋಗಕ್ಕಾಗಿ ತೆಗೆದುಹಾಕಿದ ಖಾತೆಗಳು",
        blocks: [
          "ಸದಸ್ಯರು ಇನ್ನೊಬ್ಬ ಸದಸ್ಯರ ಫೋನ್ ಸಂಖ್ಯೆ, ಇಮೇಲ್ ಅಥವಾ ಫೋಟೋಗಳನ್ನು ದುರುಪಯೋಗ ಮಾಡಿದ್ದಕ್ಕಾಗಿ, ಕಿರುಕುಳ ನೀಡಿದ್ದಕ್ಕಾಗಿ ಅಥವಾ ನಮ್ಮ [ಸದಸ್ಯರ ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು](/terms#safety) ಮುರಿದದ್ದಕ್ಕಾಗಿ ಖಾತೆಯನ್ನು ಬ್ಲಾಕ್ ಮಾಡಿ ತೆಗೆದುಹಾಕಿದರೆ, ಸದಸ್ಯತ್ವ ಶುಲ್ಕ ಮತ್ತು ಬಳಸದ ಕ್ರೆಡಿಟ್‌ಗಳಿಗೆ **ಮರುಪಾವತಿ ಇಲ್ಲ**.",
        ],
      },
      {
        id: "how",
        title: "ಮರುಪಾವತಿಗೆ ವಿನಂತಿಸುವುದು ಹೇಗೆ",
        blocks: [
          "ನಿಮ್ಮ Razorpay ಪಾವತಿ ID ಮತ್ತು ನೋಂದಾಯಿಸಿದ ಇಮೇಲ್‌ನೊಂದಿಗೆ {email} ಗೆ ಇಮೇಲ್ ಮಾಡಿ. ಈ ನೀತಿ ಮುನ್ಸೂಚನೆ ಇಲ್ಲದೆ ಬದಲಾಗಬಹುದು.",
        ],
      },
    ],
  },
  hi: {
    seoTitle: "रिफ़ंड नीति | Seetha Rama Kalyana",
    seoDescription:
      "सीता राम कल्याण रिफ़ंड नीति: पंजीकरण विफल होने पर पैसा कटने की स्थिति में ही रिफ़ंड। बाक़ी सभी भुगतान नॉन-रिफ़ंडेबल हैं।",
    title: "रिफ़ंड नीति",
    description: "रिफ़ंड कब मिलता है, यह समझने के लिए कृपया यह नीति ध्यान से पढ़ें।",
    sections: [
      {
        id: "conditions",
        title: "रिफ़ंड की शर्तें",
        blocks: [
          "अगर आपका पंजीकरण विफल हो जाए लेकिन पैसा कट जाए, तो पूरी राशि वापस की जाएगी।",
          "**ज़रूरी:** सफल पंजीकरण, इंटरेस्ट ख़रीद और कुंडली सेवा सहित बाक़ी सभी मामलों में भुगतान **नॉन-रिफ़ंडेबल** हैं।",
        ],
      },
      {
        id: "misuse",
        title: "दुरुपयोग के कारण हटाए गए खाते",
        blocks: [
          "अगर किसी सदस्य ने दूसरे सदस्य का फ़ोन नंबर, ईमेल या फ़ोटो का दुरुपयोग किया, किसी सदस्य को परेशान किया, या हमारे [सदस्य सुरक्षा नियम](/terms#safety) तोड़े, और इस कारण खाता ब्लॉक करके हटाया गया, तो सदस्यता फ़ीस और बचे क्रेडिट का **रिफ़ंड नहीं** होगा।",
        ],
      },
      {
        id: "how",
        title: "रिफ़ंड का अनुरोध कैसे करें",
        blocks: [
          "अपनी Razorpay पेमेंट ID और पंजीकृत ईमेल के साथ {email} पर ईमेल करें। यह नीति बिना सूचना के बदल सकती है।",
        ],
      },
    ],
  },
  te: {
    seoTitle: "రీఫండ్ విధానం | Seetha Rama Kalyana",
    seoDescription:
      "సీతా రామ కళ్యాణ రీఫండ్ విధానం: నమోదు విఫలమై డబ్బు కట్ అయితే మాత్రమే రీఫండ్. మిగతా అన్ని చెల్లింపులకు రీఫండ్ ఉండదు.",
    title: "రీఫండ్ విధానం",
    description: "రీఫండ్ ఎప్పుడు ఇస్తామో తెలుసుకోవడానికి ఈ విధానాన్ని జాగ్రత్తగా చదవండి.",
    sections: [
      {
        id: "conditions",
        title: "రీఫండ్ షరతులు",
        blocks: [
          "మీ నమోదు విఫలమై డబ్బు కట్ అయితే, పూర్తి మొత్తం తిరిగి ఇస్తాము.",
          "**ముఖ్యం:** విజయవంతమైన నమోదు, ఇంటరెస్ట్ కొనుగోళ్లు మరియు జాతక సేవలు సహా మిగతా అన్ని సందర్భాల్లో చెల్లింపులకు **రీఫండ్ ఉండదు**.",
        ],
      },
      {
        id: "misuse",
        title: "దుర్వినియోగం కారణంగా తొలగించిన ఖాతాలు",
        blocks: [
          "సభ్యులు మరొక సభ్యుల ఫోన్ నంబర్, ఈమెయిల్ లేదా ఫోటోలను దుర్వినియోగం చేసినందుకు, వేధించినందుకు లేదా మా [సభ్యుల భద్రతా నియమాలను](/terms#safety) ఉల్లంఘించినందుకు ఖాతాను బ్లాక్ చేసి తొలగిస్తే, సభ్యత్వ రుసుము మరియు వాడని క్రెడిట్‌లకు **రీఫండ్ ఉండదు**.",
        ],
      },
      {
        id: "how",
        title: "రీఫండ్ ఎలా అడగాలి",
        blocks: [
          "మీ Razorpay చెల్లింపు ID మరియు నమోదు చేసిన ఈమెయిల్‌తో {email} కి ఈమెయిల్ చేయండి. ఈ విధానం ముందస్తు సమాచారం లేకుండా మారవచ్చు.",
        ],
      },
    ],
  },
  ta: {
    seoTitle: "பணம் திருப்பும் கொள்கை | Seetha Rama Kalyana",
    seoDescription:
      "சீதா ராம கல்யாண பணம் திருப்பும் கொள்கை: பதிவு தோல்வியடைந்து பணம் கழிக்கப்பட்டால் மட்டுமே திருப்பித் தரப்படும். மற்ற எல்லாக் கட்டணங்களும் திருப்பித் தரப்படாது.",
    title: "பணம் திருப்பும் கொள்கை",
    description: "பணம் எப்போது திருப்பித் தரப்படும் என்று புரிந்துகொள்ள இந்தக் கொள்கையைக் கவனமாகப் படியுங்கள்.",
    sections: [
      {
        id: "conditions",
        title: "பணம் திருப்பும் நிபந்தனைகள்",
        blocks: [
          "உங்கள் பதிவு தோல்வியடைந்து பணம் கழிக்கப்பட்டிருந்தால், முழுத் தொகையும் திருப்பித் தரப்படும்.",
          "**முக்கியம்:** வெற்றிகரமான பதிவு, இன்ட்ரெஸ்ட் வாங்குதல் மற்றும் ஜாதகச் சேவை உட்பட மற்ற எல்லாச் சந்தர்ப்பங்களிலும் கட்டணங்கள் **திருப்பித் தரப்படாது**.",
        ],
      },
      {
        id: "misuse",
        title: "தவறான பயன்பாட்டுக்காக நீக்கப்பட்ட கணக்குகள்",
        blocks: [
          "ஒரு உறுப்பினர் மற்றொரு உறுப்பினரின் தொலைபேசி எண், மின்னஞ்சல் அல்லது புகைப்படங்களைத் தவறாகப் பயன்படுத்தியதற்காக, தொந்தரவு செய்ததற்காக அல்லது எங்கள் [உறுப்பினர் பாதுகாப்பு விதிகளை](/terms#safety) மீறியதற்காகக் கணக்கு பிளாக் செய்யப்பட்டு நீக்கப்பட்டால், உறுப்பினர் கட்டணமும் பயன்படுத்தாத கிரெடிட்களும் **திருப்பித் தரப்படாது**.",
        ],
      },
      {
        id: "how",
        title: "பணம் திரும்பப் பெறக் கோருவது எப்படி",
        blocks: [
          "உங்கள் Razorpay கட்டண ID மற்றும் பதிவு செய்த மின்னஞ்சலுடன் {email} க்கு மின்னஞ்சல் அனுப்புங்கள். இந்தக் கொள்கை முன்னறிவிப்பின்றி மாறலாம்.",
        ],
      },
    ],
  },
};
