/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BasicDetailsIn {
    fullName: string;
    martialStatus: string;
    email: string;
    password: string;
    confirmPassword: string;
    subCaste: string;
    gothra: string;
    mobile: string;
    alternateMob: string;
    gender: string;
    motherTongue: string;
    dob: Date | null;
    age?: number;
    profileCreatedBy: string;
    images: ImageFile[];
    qualification: string;
    note?: string;
    uniqueId?: string

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
    subCaste?: string[]
    motherTongue?: string[]
    employedIn?: string[]
    note?: string
    qualification?: string[]
    country?: string[]
}

export interface InterestsIn {
    viewed?: string[]
    sent?: string[]
    totalNoOfInterest?: number
    received?: string[]
    accepted?: string[]
    declined?: string[]
    invitationStatus?: 'accept' | 'decline' | 'sent' | 'received' | 'pending',
}

export interface TransactionsIn {
    orderId?: string,
    paymentId?: string,
    dateOfTrans?: string,
    note?: string,
    amountPaid?: number,
    noOfInterest?: number,
}

export interface UserDetails {
    basic: BasicDetailsIn

    personal: PersonalDetailsIn

    family: FamilyDetailsIn

    partner: PartnerDetailsIn

    interests?: InterestsIn

    transactions?: TransactionsIn[]

    _id?: string
    hasCompleteProfile?: boolean
    isHidden?: boolean
    hideProfiles?: string[]
}

export type UserDataType = "basic" | "personal" | "partner" | "family"

export type FormType = 'login' | 1 | 2 | 3 | 'success' | 'forgotPassword';

export type SelectType = { label: string; value: string; }

export type StepsType = {
    handleChange: (e: any) => void
    setCurrentForm?: (val: FormType) => void
    handleNext?: () => void
    handleBack?: () => void
    setImages?: (val: File[]) => void
    formData: BasicDetailsIn
}

export interface ImageFile {
    fileId: string
    url: string
}