export interface BasicDetailsIn {
    fullName: string;
    martialStatus: string;
    email: string;
    password: string;
    confirmPassword: string;
    subCaste: string;
    caste: string;
    gothra: string;
    mobile: string;
    alternateMob: string;
    gender: string;
    motherTongue: string;
    dob: string | null;
    profileCreatedBy: string;
    images: ImageFile[];
    qualification: string;
    note?: string;
    uniqueId?: string
    referralId?: string;

}

export interface PersonalDetailsIn {
    height?: string
    country?: string
    residingStatus?: string
    weight?: number
    diet?: string
    workCity?: string
    address?: string
    salary?: number
    employedIn?: string
    rashi?: string
    nakshatra?: string
    note?: string

}

export interface FamilyDetailsIn {
    familyStatus?: string
    elderBro?: string
    youngerBro?: string
    elderSis?: string
    youngerSis?: string
    elderBroMar?: string
    youngerBroMar?: string
    elderSisMar?: string
    youngerSisMar?: string
    fatherName?: string
    fatherStatus?: string
    fatherOccup?: string
    motherName?: string
    motherStatus?: string
    motherOccup?: string
    note?: string
}

export interface PartnerDetailsIn {
    ageFrom?: string
    ageTo?: string
    martialStatus?: string[];
    heightFrom?: string
    heightTo?: string
    caste?: string[]
    subCaste?: string[]
    motherTongue?: string[]
    employedIn?: string[]
    note?: string
    qualification?: string[]
    country?: string[]
    /** Must-have preferences; unset means every preference is one. */
    strict?: string[]
    genderBrokerFilter?: string[]
}

export interface InterestsIn {
    viewed?: string[]
    sent?: string[]
    totalNoOfInterest?: number
    received?: string[]
    accepted?: string[]
    declined?: string[]
    invitationStatus?: 'accept' | 'decline' | 'sent' | 'received' | 'pending',
    actedAt?: string | null,
}

export interface TransactionsIn {
    orderId?: string,
    paymentId?: string,
    dateOfTrans?: string,
    note?: string,
    amountPaid?: number,
    noOfInterest?: number,
    refundId?: string,
    amountRefunded?: number,
    refundedAt?: string,
}

export type ConsultationMode = "Overview" | "Personalized" | "Kundli Matching";


export interface AstrologyIn {
    name?: string;
    mName?: string;
    uId: string;
    dob?: Date;
    mDob?: Date;
    place?: string;
    mPlace?: string;
    gender?: string;
    mGender?: string;
    consultationMode?: ConsultationMode;
    query?: string;
    generatedAt?: Date;
    status?: string;
    aiResponse?: string;
}


export interface UserDetails {
    basic: BasicDetailsIn

    personal: PersonalDetailsIn

    family: FamilyDetailsIn

    partner: PartnerDetailsIn

    interests?: InterestsIn

    transactions?: TransactionsIn[]

    astrology?: AstrologyIn[]

    _id?: string
    hasCompleteProfile?: boolean
    isVerified?: boolean
    isHidden?: boolean
    isAdmin?: boolean
    brokerUnlinked?: boolean
    /** The partner behind `basic.referralId`; null for discount codes. */
    referredBy?: { name: string; companyName?: string; referralId: string } | null
    commissionPaidAt?: string
    staffNote?: string
    hideProfiles?: string[]
    shortlisted?: string[]
    lastActiveAt?: string
    createdAt?: string
    /** Only on "viewed you" lists. */
    viewedAt?: string
}

/** What the Matches page sends to /fetch-profiles. */
export interface MatchFilters {
    partner: PartnerDetailsIn
    diet?: string[]
    sort?: "best" | "newest" | "active"
}

export type UserDataType = "basic" | "personal" | "partner" | "family"

export type FormType = 'login' | 1 | 2 | 3 | 'success' | 'forgotPassword';

/** `group` puts the option under a heading in dropdowns (options of a group must be adjacent). */
export type SelectType = { label: string; value: string; group?: string; }


export interface ImageFile {
    fileId: string
    url: string
}