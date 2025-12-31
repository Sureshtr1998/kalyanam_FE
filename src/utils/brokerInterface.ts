export interface BrokerRegistrationForm {
    name: string;
    email: string;
    referralId?: string;
    phone: string;
    companyName: string;
    address: string;
    note: string;
    caste: string[];
    password: string;
    confirmPassword: string;
    motherTongue: string[];
    idProof: File[];
    usersReferred?: number
}