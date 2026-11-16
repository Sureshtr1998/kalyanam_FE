import { LegalDocPage } from "@/components/common/legalDoc";
import { termsText } from "./text";

const TermsConditions = () => <LegalDocPage docs={termsText} path="/terms" pageType="terms" />;

export default TermsConditions;
