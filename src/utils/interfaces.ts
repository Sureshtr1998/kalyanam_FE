export interface RegisterForm {
    fullName: string;
    maritalStatus: string;
    email: string;
    qualification: string;
    password: string;
    subCaste: string;
    pincode: string;
    confirmPassword: string;
    mobile: string;
    alternateMob: string;
    gender: string;
    motherTongue: string;
    dob: Date | null;
    profileCreatedBy: string;
    images: string[]
}
