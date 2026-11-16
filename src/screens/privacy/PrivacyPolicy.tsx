import { LegalDocPage } from "@/components/common/legalDoc";
import { privacyText } from "./text";

const PrivacyPolicy = () => <LegalDocPage docs={privacyText} path="/privacy" pageType="privacy" />;

export default PrivacyPolicy;
