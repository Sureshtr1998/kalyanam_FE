export interface UserDetails {
    //Registration mandatory fields
    fullName: string;
    martialStatus: string;
    email: string;
    qualification: string;
    password: string;
    subCaste: string;
    gotra: string;
    confirmPassword: string;
    mobile: string;
    alternateMob: string;
    gender: string;
    motherTongue: string;
    dob: Date | null;
    profileCreatedBy: string;
    images: string[]
    bNote?: string

    //Personal Details
    height?: string
    country?: string
    residingStatus?: string
    weight?: number
    diet?: string
    address?: string
    salary?: number
    employedIn?: string
    rashi?: string
    nakshatra?: string
    mNote?: string


    //Family details
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
    fNote?: string


    //Partner preference
    ageFrom?: string
    ageTo?: string
    pMartialStatus?: string[];
    heightFrom?: string
    heightTo?: string
    pSubCaste?: string[]
    pEmployedIn?: string[]
    pNote?: string
    pQualification?: string[]
    pCountry?: string[]

    //Backend Data and Flags
    _id?: string
    age?: number
    hasCompleteProfile?: boolean

}


export interface ProfileInfo {
    userData: UserDetails
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (event: any) => void
}