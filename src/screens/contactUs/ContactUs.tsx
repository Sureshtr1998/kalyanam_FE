import { Link } from "react-router-dom";
import { Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { Lotus } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { localePath, usePublicLang, type Lang } from "@/lib/i18n";
import { SEO_URL, SUPPORT_EMAIL } from "@/utils/constants";

const text: Record<
  Lang,
  {
    seoTitle: string;
    seoDescription: string;
    title: string;
    lead: string;
    emailUs: string;
    reply: string;
    misuseTitle: string;
    misuse: string;
    safetyRules: string;
    include: string;
  }
> = {
  en: {
    seoTitle: "Contact Us | Seetha Rama Kalyana",
    seoDescription:
      "Get in touch with Seetha Rama Kalyana, the trusted Hindu matrimony platform. Reach us via email and we will get back to you promptly.",
    title: "Get in touch",
    lead: "Questions about your profile, payments or anything else? We're happy to help.",
    emailUs: "Email us",
    reply: "We reply within 24 hours. For payment issues, please include your payment ID.",
    misuseTitle: "Someone misusing your number or photos?",
    misuse:
      "Email us any time, day or night. We review every misuse report within 24 hours, keep it confidential, and permanently remove members who break our",
    safetyRules: "safety rules",
    include: "Include your registered email and WhatsApp number so we can find your account.",
  },
  kn: {
    seoTitle: "ಸಂಪರ್ಕಿಸಿ | Seetha Rama Kalyana",
    seoDescription: "ಸೀತಾ ರಾಮ ಕಲ್ಯಾಣವನ್ನು ಇಮೇಲ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ. ನಾವು ಬೇಗ ಉತ್ತರಿಸುತ್ತೇವೆ.",
    title: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
    lead: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್, ಪಾವತಿ ಅಥವಾ ಬೇರೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಯಿದೆಯೇ? ಸಹಾಯ ಮಾಡಲು ನಾವು ಸಿದ್ಧ.",
    emailUs: "ಇಮೇಲ್ ಮಾಡಿ",
    reply: "24 ಗಂಟೆಗಳೊಳಗೆ ಉತ್ತರಿಸುತ್ತೇವೆ. ಪಾವತಿ ಸಮಸ್ಯೆಗಳಿಗೆ ನಿಮ್ಮ ಪಾವತಿ ID ಸೇರಿಸಿ.",
    misuseTitle: "ಯಾರಾದರೂ ನಿಮ್ಮ ಸಂಖ್ಯೆ ಅಥವಾ ಫೋಟೋಗಳನ್ನು ದುರುಪಯೋಗ ಮಾಡುತ್ತಿದ್ದಾರೆಯೇ?",
    misuse:
      "ಹಗಲು ರಾತ್ರಿ ಯಾವಾಗ ಬೇಕಾದರೂ ಇಮೇಲ್ ಮಾಡಿ. ಪ್ರತಿ ದುರುಪಯೋಗದ ವರದಿಯನ್ನು 24 ಗಂಟೆಗಳೊಳಗೆ ಪರಿಶೀಲಿಸುತ್ತೇವೆ, ಗೌಪ್ಯವಾಗಿಡುತ್ತೇವೆ, ಮತ್ತು ನಿಯಮ ಮುರಿಯುವ ಸದಸ್ಯರನ್ನು ಶಾಶ್ವತವಾಗಿ ತೆಗೆದುಹಾಕುತ್ತೇವೆ. ನೋಡಿ:",
    safetyRules: "ಸುರಕ್ಷತಾ ನಿಯಮಗಳು",
    include: "ನಿಮ್ಮ ಖಾತೆ ಹುಡುಕಲು ನೋಂದಾಯಿಸಿದ ಇಮೇಲ್ ಮತ್ತು WhatsApp ಸಂಖ್ಯೆ ಸೇರಿಸಿ.",
  },
  hi: {
    seoTitle: "संपर्क करें | Seetha Rama Kalyana",
    seoDescription: "सीता राम कल्याण से ईमेल पर संपर्क करें। हम जल्दी जवाब देते हैं।",
    title: "हमसे संपर्क करें",
    lead: "प्रोफ़ाइल, भुगतान या किसी और बारे में सवाल है? हम मदद के लिए तैयार हैं।",
    emailUs: "ईमेल करें",
    reply: "हम 24 घंटे में जवाब देते हैं। भुगतान की समस्या हो तो अपनी पेमेंट ID ज़रूर लिखें।",
    misuseTitle: "कोई आपका नंबर या फ़ोटो का दुरुपयोग कर रहा है?",
    misuse:
      "दिन हो या रात, कभी भी ईमेल करें। हम दुरुपयोग की हर शिकायत की 24 घंटे में समीक्षा करते हैं, उसे गोपनीय रखते हैं, और नियम तोड़ने वाले सदस्यों को हमेशा के लिए हटा देते हैं। देखें:",
    safetyRules: "सुरक्षा नियम",
    include: "अपना खाता ढूँढने के लिए पंजीकृत ईमेल और WhatsApp नंबर लिखें।",
  },
  te: {
    seoTitle: "సంప్రదించండి | Seetha Rama Kalyana",
    seoDescription: "సీతా రామ కళ్యాణను ఈమెయిల్ ద్వారా సంప్రదించండి. మేము త్వరగా స్పందిస్తాము.",
    title: "మమ్మల్ని సంప్రదించండి",
    lead: "మీ ప్రొఫైల్, చెల్లింపులు లేదా ఇంకేదైనా ప్రశ్న ఉందా? సహాయం చేయడానికి మేము సిద్ధం.",
    emailUs: "ఈమెయిల్ చేయండి",
    reply: "24 గంటల్లో స్పందిస్తాము. చెల్లింపు సమస్యలకు మీ చెల్లింపు ID జత చేయండి.",
    misuseTitle: "ఎవరైనా మీ నంబర్ లేదా ఫోటోలను దుర్వినియోగం చేస్తున్నారా?",
    misuse:
      "పగలు రాత్రి ఎప్పుడైనా ఈమెయిల్ చేయండి. ప్రతి దుర్వినియోగ ఫిర్యాదును 24 గంటల్లో పరిశీలిస్తాము, గోప్యంగా ఉంచుతాము, నియమాలు ఉల్లంఘించిన సభ్యులను శాశ్వతంగా తొలగిస్తాము. చూడండి:",
    safetyRules: "భద్రతా నియమాలు",
    include: "మీ ఖాతాను కనుగొనడానికి నమోదు చేసిన ఈమెయిల్ మరియు WhatsApp నంబర్ జత చేయండి.",
  },
  ta: {
    seoTitle: "தொடர்புகொள்ள | Seetha Rama Kalyana",
    seoDescription: "சீதா ராம கல்யாணத்தை மின்னஞ்சல் மூலம் தொடர்புகொள்ளுங்கள். விரைவில் பதில் அளிக்கிறோம்.",
    title: "எங்களைத் தொடர்புகொள்ளுங்கள்",
    lead: "உங்கள் சுயவிவரம், கட்டணம் அல்லது வேறு ஏதாவது கேள்வியா? உதவத் தயாராக இருக்கிறோம்.",
    emailUs: "மின்னஞ்சல் அனுப்புங்கள்",
    reply: "24 மணி நேரத்துக்குள் பதில் அளிக்கிறோம். கட்டணப் பிரச்சினைகளுக்கு உங்கள் கட்டண ID-ஐச் சேர்க்கவும்.",
    misuseTitle: "யாராவது உங்கள் எண் அல்லது புகைப்படங்களைத் தவறாகப் பயன்படுத்துகிறார்களா?",
    misuse:
      "பகலோ இரவோ எப்போது வேண்டுமானாலும் மின்னஞ்சல் அனுப்புங்கள். ஒவ்வொரு புகாரையும் 24 மணி நேரத்துக்குள் பரிசீலித்து, ரகசியமாக வைத்து, விதிகளை மீறும் உறுப்பினர்களை நிரந்தரமாக நீக்குகிறோம். பாருங்கள்:",
    safetyRules: "பாதுகாப்பு விதிகள்",
    include: "உங்கள் கணக்கைக் கண்டறிய பதிவு செய்த மின்னஞ்சல் மற்றும் WhatsApp எண்ணைச் சேர்க்கவும்.",
  },
};

const ContactUs = () => {
  const [lang] = usePublicLang();
  const t = text[lang];
  return (
    <>
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        keywords="contact, support, hindu matrimony, seetha rama kalyana"
        url={SEO_URL + "/contact-us"}
      />
      <section className="bg-sunrise">
        <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
          <Lotus className="h-6 w-10 text-gold" />
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t.title}</h1>
          <p className="mt-3 text-muted-foreground">{t.lead}</p>
          <div className="mt-8 w-full space-y-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-4 rounded-2xl border border-gold/40 bg-card p-5 text-left shadow-sm transition hover:shadow-md">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Mail className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-muted-foreground">{t.emailUs}</span>
                <span className="block break-all font-semibold text-primary">{SUPPORT_EMAIL}</span>
              </span>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Clock className="size-5" />
              </span>
              <span className="text-sm text-muted-foreground">{t.reply}</span>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-sm text-muted-foreground">
                <span className="block font-semibold text-foreground">{t.misuseTitle}</span>
                {t.misuse}{" "}
                <Link className="font-semibold text-primary" to={localePath("/terms", lang) + "#safety"}>
                  {t.safetyRules}
                </Link>
                .
              </span>
            </div>
            <p className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
              <MessageCircle className="size-3.5" /> {t.include}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
