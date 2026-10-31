import { env } from "@/config/env";
import type { BasicDetailsIn, FamilyDetailsIn, PartnerDetailsIn, PersonalDetailsIn } from "./interfaces";

export const maritalOptions = [
    { label: 'Unmarried', value: 'Unmarried' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Separated', value: 'Separated' },
];

export const parentStatus = [
    { label: 'Alive', value: 'Alive' },
    { label: 'Deceased', value: 'Deceased' },
]


export const familyStatus = [
    { label: 'Lower Middle Class', value: 'Lower Middle Class' },
    { label: 'Middle Class', value: 'Middle Class' },
    { label: 'Upper Middle Class', value: 'Upper Middle Class' },
    { label: 'Rich', value: 'Rich' },
]
export const countryOptions = [
    { label: 'India', value: 'India' },
    { label: 'Afghanistan', value: 'Afghanistan' },
    { label: 'Albania', value: 'Albania' },
    { label: 'Algeria', value: 'Algeria' },
    { label: 'Andorra', value: 'Andorra' },
    { label: 'Angola', value: 'Angola' },
    { label: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
    { label: 'Argentina', value: 'Argentina' },
    { label: 'Armenia', value: 'Armenia' },
    { label: 'Australia', value: 'Australia' },
    { label: 'Austria', value: 'Austria' },
    { label: 'Azerbaijan', value: 'Azerbaijan' },
    { label: 'Bahamas', value: 'Bahamas' },
    { label: 'Bahrain', value: 'Bahrain' },
    { label: 'Bangladesh', value: 'Bangladesh' },
    { label: 'Barbados', value: 'Barbados' },
    { label: 'Belarus', value: 'Belarus' },
    { label: 'Belgium', value: 'Belgium' },
    { label: 'Belize', value: 'Belize' },
    { label: 'Benin', value: 'Benin' },
    { label: 'Bhutan', value: 'Bhutan' },
    { label: 'Bolivia', value: 'Bolivia' },
    { label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
    { label: 'Botswana', value: 'Botswana' },
    { label: 'Brazil', value: 'Brazil' },
    { label: 'Brunei Darussalam', value: 'Brunei Darussalam' },
    { label: 'Bulgaria', value: 'Bulgaria' },
    { label: 'Burkina Faso', value: 'Burkina Faso' },
    { label: 'Burundi', value: 'Burundi' },
    { label: 'Cabo Verde', value: 'Cabo Verde' },
    { label: 'Cambodia', value: 'Cambodia' },
    { label: 'Cameroon', value: 'Cameroon' },
    { label: 'Canada', value: 'Canada' },
    { label: 'Central African Republic', value: 'Central African Republic' },
    { label: 'Chad', value: 'Chad' },
    { label: 'Chile', value: 'Chile' },
    { label: 'China', value: 'China' },
    { label: 'Colombia', value: 'Colombia' },
    { label: 'Comoros', value: 'Comoros' },
    { label: 'Congo (Congo-Brazzaville)', value: 'Congo (Congo-Brazzaville)' },
    { label: 'Congo (Democratic Republic of the)', value: 'Congo (Democratic Republic of the)' },
    { label: 'Costa Rica', value: 'Costa Rica' },
    { label: 'Croatia', value: 'Croatia' },
    { label: 'Cuba', value: 'Cuba' },
    { label: 'Cyprus', value: 'Cyprus' },
    { label: 'Czechia (Czech Republic)', value: 'Czechia (Czech Republic)' },
    { label: 'Denmark', value: 'Denmark' },
    { label: 'Djibouti', value: 'Djibouti' },
    { label: 'Dominica', value: 'Dominica' },
    { label: 'Dominican Republic', value: 'Dominican Republic' },
    { label: 'Ecuador', value: 'Ecuador' },
    { label: 'Egypt', value: 'Egypt' },
    { label: 'El Salvador', value: 'El Salvador' },
    { label: 'Equatorial Guinea', value: 'Equatorial Guinea' },
    { label: 'Eritrea', value: 'Eritrea' },
    { label: 'Estonia', value: 'Estonia' },
    { label: 'Eswatini (fmr. "Swaziland")', value: 'Eswatini (fmr. "Swaziland")' },
    { label: 'Ethiopia', value: 'Ethiopia' },
    { label: 'Fiji', value: 'Fiji' },
    { label: 'Finland', value: 'Finland' },
    { label: 'France', value: 'France' },
    { label: 'Gabon', value: 'Gabon' },
    { label: 'Gambia', value: 'Gambia' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Germany', value: 'Germany' },
    { label: 'Ghana', value: 'Ghana' },
    { label: 'Greece', value: 'Greece' },
    { label: 'Grenada', value: 'Grenada' },
    { label: 'Guatemala', value: 'Guatemala' },
    { label: 'Guinea', value: 'Guinea' },
    { label: 'Guinea-Bissau', value: 'Guinea-Bissau' },
    { label: 'Guyana', value: 'Guyana' },
    { label: 'Haiti', value: 'Haiti' },
    { label: 'Honduras', value: 'Honduras' },
    { label: 'Hungary', value: 'Hungary' },
    { label: 'Iceland', value: 'Iceland' },
    { label: 'Indonesia', value: 'Indonesia' },
    { label: 'Iran', value: 'Iran' },
    { label: 'Iraq', value: 'Iraq' },
    { label: 'Ireland', value: 'Ireland' },
    { label: 'Israel', value: 'Israel' },
    { label: 'Italy', value: 'Italy' },
    { label: 'Jamaica', value: 'Jamaica' },
    { label: 'Japan', value: 'Japan' },
    { label: 'Jordan', value: 'Jordan' },
    { label: 'Kazakhstan', value: 'Kazakhstan' },
    { label: 'Kenya', value: 'Kenya' },
    { label: 'Kiribati', value: 'Kiribati' },
    { label: 'Korea (North)', value: 'Korea (North)' },
    { label: 'Korea (South)', value: 'Korea (South)' },
    { label: 'Kuwait', value: 'Kuwait' },
    { label: 'Kyrgyzstan', value: 'Kyrgyzstan' },
    { label: 'Laos', value: 'Laos' },
    { label: 'Latvia', value: 'Latvia' },
    { label: 'Lebanon', value: 'Lebanon' },
    { label: 'Lesotho', value: 'Lesotho' },
    { label: 'Liberia', value: 'Liberia' },
    { label: 'Libya', value: 'Libya' },
    { label: 'Liechtenstein', value: 'Liechtenstein' },
    { label: 'Lithuania', value: 'Lithuania' },
    { label: 'Luxembourg', value: 'Luxembourg' },
    { label: 'Madagascar', value: 'Madagascar' },
    { label: 'Malawi', value: 'Malawi' },
    { label: 'Malaysia', value: 'Malaysia' },
    { label: 'Maldives', value: 'Maldives' },
    { label: 'Mali', value: 'Mali' },
    { label: 'Malta', value: 'Malta' },
    { label: 'Marshall Islands', value: 'Marshall Islands' },
    { label: 'Mauritania', value: 'Mauritania' },
    { label: 'Mauritius', value: 'Mauritius' },
    { label: 'Mexico', value: 'Mexico' },
    { label: 'Micronesia (Federated States of)', value: 'Micronesia (Federated States of)' },
    { label: 'Moldova', value: 'Moldova' },
    { label: 'Monaco', value: 'Monaco' },
    { label: 'Mongolia', value: 'Mongolia' },
    { label: 'Montenegro', value: 'Montenegro' },
    { label: 'Morocco', value: 'Morocco' },
    { label: 'Mozambique', value: 'Mozambique' },
    { label: 'Myanmar (fmr. Burma)', value: 'Myanmar (fmr. Burma)' },
    { label: 'Namibia', value: 'Namibia' },
    { label: 'Nauru', value: 'Nauru' },
    { label: 'Nepal', value: 'Nepal' },
    { label: 'Netherlands', value: 'Netherlands' },
    { label: 'New Zealand', value: 'New Zealand' },
    { label: 'Nicaragua', value: 'Nicaragua' },
    { label: 'Niger', value: 'Niger' },
    { label: 'Nigeria', value: 'Nigeria' },
    { label: 'North Macedonia', value: 'North Macedonia' },
    { label: 'Norway', value: 'Norway' },
    { label: 'Oman', value: 'Oman' },
    { label: 'Pakistan', value: 'Pakistan' },
    { label: 'Palau', value: 'Palau' },
    { label: 'Panama', value: 'Panama' },
    { label: 'Papua New Guinea', value: 'Papua New Guinea' },
    { label: 'Paraguay', value: 'Paraguay' },
    { label: 'Peru', value: 'Peru' },
    { label: 'Philippines', value: 'Philippines' },
    { label: 'Poland', value: 'Poland' },
    { label: 'Portugal', value: 'Portugal' },
    { label: 'Qatar', value: 'Qatar' },
    { label: 'Romania', value: 'Romania' },
    { label: 'Russia', value: 'Russia' },
    { label: 'Rwanda', value: 'Rwanda' },
    { label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
    { label: 'Saint Lucia', value: 'Saint Lucia' },
    { label: 'Saint Vincent and the Grenadines', value: 'Saint Vincent and the Grenadines' },
    { label: 'Samoa', value: 'Samoa' },
    { label: 'San Marino', value: 'San Marino' },
    { label: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
    { label: 'Saudi Arabia', value: 'Saudi Arabia' },
    { label: 'Senegal', value: 'Senegal' },
    { label: 'Serbia', value: 'Serbia' },
    { label: 'Seychelles', value: 'Seychelles' },
    { label: 'Sierra Leone', value: 'Sierra Leone' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'Slovakia', value: 'Slovakia' },
    { label: 'Slovenia', value: 'Slovenia' },
    { label: 'Solomon Islands', value: 'Solomon Islands' },
    { label: 'Somalia', value: 'Somalia' },
    { label: 'South Africa', value: 'South Africa' },
    { label: 'South Korea', value: 'South Korea' },
    { label: 'South Sudan', value: 'South Sudan' },
    { label: 'Spain', value: 'Spain' },
    { label: 'Sri Lanka', value: 'Sri Lanka' },
    { label: 'Sudan', value: 'Sudan' },
    { label: 'Suriname', value: 'Suriname' },
    { label: 'Sweden', value: 'Sweden' },
    { label: 'Switzerland', value: 'Switzerland' },
    { label: 'Syria', value: 'Syria' },
    { label: 'Taiwan', value: 'Taiwan' },
    { label: 'Tajikistan', value: 'Tajikistan' },
    { label: 'Tanzania', value: 'Tanzania' },
    { label: 'Thailand', value: 'Thailand' },
    { label: 'Timor-Leste', value: 'Timor-Leste' },
    { label: 'Togo', value: 'Togo' },
    { label: 'Tonga', value: 'Tonga' },
    { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
    { label: 'Tunisia', value: 'Tunisia' },
    { label: 'Turkey', value: 'Turkey' },
    { label: 'Turkmenistan', value: 'Turkmenistan' },
    { label: 'Tuvalu', value: 'Tuvalu' },
    { label: 'Uganda', value: 'Uganda' },
    { label: 'Ukraine', value: 'Ukraine' },
    { label: 'United Arab Emirates', value: 'United Arab Emirates' },
    { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'United States', value: 'United States' },
    { label: 'Uruguay', value: 'Uruguay' },
    { label: 'Uzbekistan', value: 'Uzbekistan' },
    { label: 'Vanuatu', value: 'Vanuatu' },
    { label: 'Vatican City', value: 'Vatican City' },
    { label: 'Venezuela', value: 'Venezuela' },
    { label: 'Vietnam', value: 'Vietnam' },
    { label: 'Yemen', value: 'Yemen' },
    { label: 'Zambia', value: 'Zambia' },
    { label: 'Zimbabwe', value: 'Zimbabwe' },
]

export const rashiOptions = [
    { label: 'Mesha (Aries)', value: 'Mesh' },
    { label: 'Vrishabha (Taurus)', value: 'Vrishabh' },
    { label: 'Mithuna (Gemini)', value: 'Mithun' },
    { label: 'Karkataka (Cancer)', value: 'Karka' },
    { label: 'Simha (Leo)', value: 'Simha' },
    { label: 'Kanya (Virgo)', value: 'Kanya' },
    { label: 'Tula (Libra)', value: 'Tula' },
    { label: 'Vrischika (Scorpio)', value: 'Vrischik' },
    { label: 'Dhanu (Sagittarius)', value: 'Dhanu' },
    { label: 'Makara (Capricorn)', value: 'Makar' },
    { label: 'Kumbha (Aquarius)', value: 'Kumbh' },
    { label: 'Meena (Pisces)', value: 'Meen' },
    { label: '---- Not Sure ----', value: 'Not Sure' },

];

export const nakshatraOptions = [
    { label: 'Ashwini', value: 'Ashwini' },
    { label: 'Bharani', value: 'Bharani' },
    { label: 'Krittika', value: 'Krittika' },
    { label: 'Rohini', value: 'Rohini' },
    { label: 'Mrigashira', value: 'Mrigashira' },
    { label: 'Ardra', value: 'Ardra' },
    { label: 'Punarvasu', value: 'Punarvasu' },
    { label: 'Pushya', value: 'Pushya' },
    { label: 'Ashlesha', value: 'Ashlesha' },
    { label: 'Magha', value: 'Magha' },
    { label: 'Purva Phalguni', value: 'Purva Phalguni' },
    { label: 'Uttara Phalguni', value: 'Uttara Phalguni' },
    { label: 'Hasta', value: 'Hasta' },
    { label: 'Chitra', value: 'Chitra' },
    { label: 'Swati', value: 'Swati' },
    { label: 'Vishakha', value: 'Vishakha' },
    { label: 'Anuradha', value: 'Anuradha' },
    { label: 'Jyeshtha', value: 'Jyeshtha' },
    { label: 'Mula', value: 'Mula' },
    { label: 'Purva Ashadha', value: 'Purva Ashadha' },
    { label: 'Uttara Ashadha', value: 'Uttara Ashadha' },
    { label: 'Shravana', value: 'Shravana' },
    { label: 'Dhanishta', value: 'Dhanishta' },
    { label: 'Shatabhisha', value: 'Shatabhisha' },
    { label: 'Purva Bhadrapada', value: 'Purva Bhadrapada' },
    { label: 'Uttara Bhadrapada', value: 'Uttara Bhadrapada' },
    { label: 'Revati', value: 'Revati' },
    { label: '---- Not Sure ----', value: 'Not Sure' },

];

export const ageOptions = Array.from({ length: 60 - 18 + 1 }, (_, i) => {
    const age = i + 18;
    return { label: age.toString(), value: age.toString() };
});

export const noSiblingOptions = Array.from({ length: 8 }, (_, i) => {
    const sib = i;
    return { label: sib.toString(), value: sib.toString() };
});


export const heightOptions = [
    { label: "4'0\" (122 cm)", value: "122" },
    { label: "4'1\" (125 cm)", value: "125" },
    { label: "4'2\" (127 cm)", value: "127" },
    { label: "4'3\" (130 cm)", value: "130" },
    { label: "4'4\" (132 cm)", value: "132" },
    { label: "4'5\" (135 cm)", value: "135" },
    { label: "4'6\" (137 cm)", value: "137" },
    { label: "4'7\" (140 cm)", value: "140" },
    { label: "4'8\" (142 cm)", value: "142" },
    { label: "4'9\" (145 cm)", value: "145" },
    { label: "4'10\" (147 cm)", value: "147" },
    { label: "4'11\" (150 cm)", value: "150" },
    { label: "5'0\" (152 cm)", value: "152" },
    { label: "5'1\" (155 cm)", value: "155" },
    { label: "5'2\" (157 cm)", value: "157" },
    { label: "5'3\" (160 cm)", value: "160" },
    { label: "5'4\" (163 cm)", value: "163" },
    { label: "5'5\" (165 cm)", value: "165" },
    { label: "5'6\" (168 cm)", value: "168" },
    { label: "5'7\" (170 cm)", value: "170" },
    { label: "5'8\" (173 cm)", value: "173" },
    { label: "5'9\" (175 cm)", value: "175" },
    { label: "5'10\" (178 cm)", value: "178" },
    { label: "5'11\" (180 cm)", value: "180" },
    { label: "6'0\" (183 cm)", value: "183" },
    { label: "6'1\" (185 cm)", value: "185" },
    { label: "6'2\" (188 cm)", value: "188" },
    { label: "6'3\" (191 cm)", value: "191" },
    { label: "6'4\" (193 cm)", value: "193" },
    { label: "6'5\" (196 cm)", value: "196" },
    { label: "6'6\" (198 cm)", value: "198" },
];



export const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
];

export const employedInOptions = [
    { label: "Private", value: "Private" },
    { label: "Government", value: "Government" },
    { label: "Public Sector (PSU)", value: "PSU" },
    { label: 'Defence', value: 'Defence' },
    { label: 'Business', value: 'Business' },
    { label: "Self Employed", value: "Self Employed" },
    { label: "Student", value: "Student" },
    { label: "Homemaker", value: "Homemaker" },
    { label: "Retired", value: "Retired" },
    { label: "Not Working", value: "Not Working" },
];

export const dietOptions = [
    { label: "Vegetarian", value: "Vegetarian" },
    { label: "Non-Vegetarian", value: "Non-Vegetarian" },
    { label: "Eggetarian", value: "Eggetarian" },
]



export const residingOptions = [
    { label: "Indian", value: "Indian" },
    { label: "NRI", value: "NRI" },
]

// Common gothras; members can also type one that is not listed.
export const gothraOptions = [
    ...[
        "Agastya",
        "Angirasa",
        "Atreya",
        "Aupamanyava",
        "Bharadwaja",
        "Bhargava",
        "Chandratreya",
        "Dhananjaya",
        "Garga",
        "Gautama",
        "Harita",
        "Jamadagni",
        "Kanva",
        "Kapi",
        "Kashyapa",
        "Katyayana",
        "Kaundinya",
        "Kaushika",
        "Kausalya",
        "Kutsa",
        "Lohita",
        "Maudgalya",
        "Naidhruva Kashyapa",
        "Parashara",
        "Sankhyayana",
        "Sankriti",
        "Shandilya",
        "Shatamarshana",
        "Shaunaka",
        "Shiva",
        "Shrivatsa",
        "Upamanyu",
        "Vadhula",
        "Vashishta",
        "Vatsa",
        "Vishnu",
        "Vishnuvardhana",
        "Vishwamitra",
    ].map((g) => ({ label: g, value: g })),
    { label: "Don't know", value: "Don't know" },
];

export const createdByOptions = [
    { label: 'Self', value: 'Self' },
    { label: 'Parent', value: 'Parent' },
    { label: 'Sibling', value: 'Sibling' },
    { label: 'Relative/Friend', value: 'Friend' },
];

// Values are stored on profiles: never change an existing value, only add new ones.
export const qualificationOptions = [
    { group: "School & diploma", label: "10th", value: "10th" },
    { group: "School & diploma", label: "12th / PUC", value: "12th" },
    { group: "School & diploma", label: "Diploma", value: "diploma" },
    { group: "School & diploma", label: "ITI", value: "iti" },

    { group: "Engineering & technology", label: "B.Tech / B.E", value: "btech" },
    { group: "Engineering & technology", label: "M.Tech / M.E", value: "mtech" },
    { group: "Engineering & technology", label: "B.Arch", value: "barch" },
    { group: "Engineering & technology", label: "M.Arch", value: "march" },

    { group: "Computers", label: "BCA", value: "bca" },
    { group: "Computers", label: "MCA", value: "mca" },

    { group: "Medicine & health", label: "MBBS", value: "mbbs" },
    { group: "Medicine & health", label: "MD / MS (Medicine)", value: "md" },
    { group: "Medicine & health", label: "BDS", value: "bds" },
    { group: "Medicine & health", label: "MDS", value: "mds" },
    { group: "Medicine & health", label: "BAMS / BHMS / BUMS", value: "ayush" },
    { group: "Medicine & health", label: "B.Pharm / Pharm.D", value: "bpharm" },
    { group: "Medicine & health", label: "M.Pharm", value: "mpharm" },
    { group: "Medicine & health", label: "B.Sc / M.Sc Nursing", value: "nursing" },
    { group: "Medicine & health", label: "BPT / MPT (Physiotherapy)", value: "physio" },
    { group: "Medicine & health", label: "BVSc (Veterinary)", value: "bvsc" },

    { group: "Commerce & management", label: "B.Com", value: "bcom" },
    { group: "Commerce & management", label: "M.Com", value: "mcom" },
    { group: "Commerce & management", label: "BBA / BBM", value: "bba" },
    { group: "Commerce & management", label: "MBA / PGDM", value: "mba" },
    { group: "Commerce & management", label: "CA", value: "ca" },
    { group: "Commerce & management", label: "CS (Company Secretary)", value: "cs" },
    { group: "Commerce & management", label: "CMA / ICWA", value: "cma" },

    { group: "Law", label: "LLB / BA LLB", value: "llb" },
    { group: "Law", label: "LLM", value: "llm" },

    { group: "Arts & science", label: "B.A", value: "ba" },
    { group: "Arts & science", label: "M.A", value: "ma" },
    { group: "Arts & science", label: "B.Sc", value: "bsc" },
    { group: "Arts & science", label: "M.Sc", value: "msc" },
    { group: "Arts & science", label: "B.Sc Agriculture", value: "bscagri" },
    { group: "Arts & science", label: "B.Ed / M.Ed", value: "bed" },
    { group: "Arts & science", label: "BFA / MFA", value: "bfa" },
    { group: "Arts & science", label: "Sanskrit / Vedic studies", value: "vedic" },

    { group: "Doctorate & other", label: "PhD", value: "phd" },
    { group: "Doctorate & other", label: "Other", value: "other" },
]

/** One-click selections over qualificationOptions, used in partner preferences and match filters. */
export const qualificationPresets = [
    {
        label: "Any Graduate",
        values: ["btech", "barch", "bca", "mbbs", "bds", "ayush", "bpharm", "nursing", "physio", "bvsc",
            "bcom", "bba", "llb", "ba", "bsc", "bscagri", "bed", "bfa"],
    },
    {
        label: "Any Post Graduate",
        values: ["mtech", "march", "mca", "md", "mds", "mpharm", "mcom", "mba", "ca", "cs", "cma", "llm", "ma", "msc"],
    },
    { label: "Any Doctorate", values: ["phd"] },
    { label: "Any School / Diploma", values: ["10th", "12th", "diploma", "iti"] },
]


export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Keep in sync with MIN_PASSWORD_LENGTH in kalyanam_BE/src/utils/constants.js.
export const MIN_PASSWORD_LENGTH = 8;

// The server accepts pre-sign-up photos for 3 days; re-upload well before that.
export const UPLOAD_REUSE_MS = 2 * 24 * 60 * 60 * 1000;

export const brokerFormDefaultVals = {
    name: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    caste: [],
    motherTongue: [],
    password: "",
    confirmPassword: "",
    idProof: [],
    note: "",
}

export const formDefaultVals = {
    basic: {
        fullName: '',
        martialStatus: '',
        password: '',
        confirmPassword: '',
        subCaste: '',
        caste: '',
        gothra: '',
        mobile: '',
        alternateMob: '',
        gender: '',
        motherTongue: '',
        dob: null,
        profileCreatedBy: '',
        email: '',
        images: [],
        qualification: ''
    }, personal: {}, family: {}, partner: {}
}

export const mandatoryBasicFields: (keyof BasicDetailsIn)[] = [
    'qualification', 'martialStatus', 'motherTongue', 'caste'
]

export const mandatoryPersonalFields: (keyof PersonalDetailsIn)[] = [
    "height",
    "country",
    'employedIn',
    "residingStatus",
    "diet",
]
export const mandatoryFamilyFields: (keyof FamilyDetailsIn)[] = [
    "motherName",
    "fatherName",
]

export const mandatoryPartnerFields: (keyof PartnerDetailsIn)[] = [
    "ageFrom",
    "ageTo",
    "caste",
    "employedIn",
]


export const MAX_IMAGES = 3;
export const MAX_FILE_SIZE_MB = 1;

export const updatedDate = "December 1, 2025"

export const SITE_NAME = "Seetha Rama Kalyana"
/** Brand primary (matches --primary and the PWA theme colour). */
export const BRAND_COLOR = "#c2410c"

export const SUPPORT_EMAIL = 'contactus@seetharamakalyana.in'
export const SUPPORT_PHONE = '+91 8105710930'
/** SUPPORT_PHONE as digits only, for wa.me / tel: links. */
export const SUPPORT_NUMBER = SUPPORT_PHONE.replace(/\D/g, "")

// Display prices only. The server (kalyanam_BE/src/utils/constants.js) decides
// what is charged; keep these in sync with it.

export const REGISTRATION_FEE = 351
/** Struck-through "was" price shown next to REGISTRATION_FEE. */
export const REGISTRATION_FEE_ORIGINAL = 751
export const INITIAL_NO_INTEREST = 36

// Credits: sending an interest uses 1, seeing a contact straight away uses 5.
export const INTEREST_COST = 1
export const CONTACT_COST = 5

/** When the 1-year membership clock starts for early members. */
export const MEMBERSHIP_START = "March 2027"

//Referrals
// Registering with a partner's referral ID (server: REFERRAL_REGISTRATION_FEE).
export const REFERRAL_REGISTRATION_FEE = 301


//Make sure it is exactly 7 characters
export const DISCOUNT_NAMES = ["BRAHMIN", "SITARAM"]

export const PERSONAL_DISCOUNT_PRICE = 351


export const PURCHASE_NO_INTEREST = 21
export const PURCHASE_INTEREST_FEE = 101
export const PURCHASE_NO_INTEREST_2 = 56
export const PURCHASE_INTEREST_FEE_2 = 251

//Astrology
export const OVERVIEW_ASTRO_FEE = 51
export const KUNDLI_MATCHING_ASTRO_FEE = 201
export const PERSONALIZED_ASTRO_FEE = 251

export const BROKERAGE_REGISTRATION_FEE = 501


/** Canonical site origin (VITE_SITE_URL). */
export const SEO_URL = env.siteUrl

/** Photon (OpenStreetMap) place search, used by PlaceField. */
export const PLACE_SEARCH_URL = "https://photon.komoot.io/api/"
export const INTEREST_PACKS = {
    basic: { amount: PURCHASE_INTEREST_FEE, interests: PURCHASE_NO_INTEREST, title: "Basic Pack" },
    premium: { amount: PURCHASE_INTEREST_FEE_2, interests: PURCHASE_NO_INTEREST_2, title: "Premium Pack" },
} as const

export const ASTRO_FEES = {
    "Overview": OVERVIEW_ASTRO_FEE,
    "Personalized": PERSONALIZED_ASTRO_FEE,
    "Kundli Matching": KUNDLI_MATCHING_ASTRO_FEE,
} as const

/** ImageKit transform for a profile photo at the given display size. */
export const imageUrl = (url: string | undefined, size: "thumb" | "card" | "full" = "card") => {
    if (!url) return "/logo.png"
    const tr = size === "thumb" ? "w-160,h-160,fo-face,q-80" : size === "card" ? "w-640,h-800,fo-face,q-80" : "w-1400,q-85"
    return `${url}?tr=${tr}`
}
