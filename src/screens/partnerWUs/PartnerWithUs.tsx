import React, { useState, useCallback } from "react";
import { languageNamesOptions, translations, type LanguageCode } from "./lang";
import FormInput from "../../components/fields/FormInput";
import type { BrokerRegistrationForm } from "../../utils/brokerInterface";
import ImageUpload from "../../components/imageMedia/ImageUpload";
import "./PartnerWithUs.scss";
import SelectInput from "../../components/fields/SelectInput";
import { Button } from "primereact/button";
import { casteOptions, motherTongueOptions } from "../../utils/utils";
import { useToast } from "../../components/toastProvider/ToastProvider";
import api from "../../utils/api";
import Spinner from "../../components/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import {
  BROKERAGE_REGISTRATION_FEE,
  brokerFormDefaultVals,
  SEO_URL,
} from "../../utils/constants";
import SEO from "../../components/misc/SEO";
import PaymentModal from "../../components/paymentModal/PaymentModal";

const PartnerWithUs = () => {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPayment, setPayment] = useState<boolean>(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [brokerData, setBrokerData] = useState<BrokerRegistrationForm>(
    brokerFormDefaultVals
  );

  const isSubmit = () => {
    const { name, email, password, phone, companyName, address, caste } =
      brokerData;

    if (
      !name.length ||
      !email.length ||
      !password.length ||
      !phone.length ||
      !companyName.length ||
      !address.length ||
      !caste.length ||
      !images.length
    ) {
      return true;
    }

    return false;
  };

  const submitData = async (orderId: string, paymentId: string) => {
    if (brokerData.password !== brokerData.confirmPassword) {
      showToast(
        "error",
        "Password mismatch",
        "The passwords you entered do not match."
      );
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      images.forEach((file) => {
        formData.append("images", file);
      });
      const uploadRes = await api.post(
        "/broker-register/upload-idproof",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const idProofs = uploadRes.data.media; // [{ url, fileId }]
      const payload = {
        ...brokerData,
        idProofs,
        orderId,
        amount: BROKERAGE_REGISTRATION_FEE,
        paymentId,
      };
      await api.post("/broker-register", payload);
      showToast(
        "success",
        "Registration successful",
        "Broker registered successfully."
      );

      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.message || "Unable to save broker data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setBrokerData({
      ...brokerData,
      [name]: value,
    });
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      await api.get("/broker-validation", {
        params: { email: brokerData.email, mobile: brokerData.phone },
      });
      setIsLoading(false);
      setPayment(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Validation Failed",
        err.response?.data?.msg || "Server error"
      );
      setIsLoading(false);
    }
  };
  const t = useCallback(
    (key: string): string => {
      const lang_specific = translations[language]?.[key];
      if (lang_specific) return lang_specific;

      const english_default = translations.en[key];
      if (english_default) return english_default;

      return key;
    },
    [language]
  );

  return (
    <div className="onboarding-page py-32">
      <SEO
        title="Partner With Us | Matrimony Broker Partnership – Seetha Rama Kalyana"
        description="Partner with Seetha Rama Kalyana as a trusted matrimony broker. Earn referral commissions, track registrations, and grow your business digitally."
        keywords="matrimony broker partnership, matrimony referral program, marriage broker platform, seetha rama kalyana partner, matrimony agent registration"
        url={SEO_URL + "/partner-with-us"}
        pageType="default"
      />
      {isPayment && (
        <PaymentModal
          role="BROKER"
          onSuccess={submitData}
          onHide={() => setPayment(false)}
          payload={{
            ...brokerData,
            amount: BROKERAGE_REGISTRATION_FEE,
            note: "Broker Registration",
            endpoint: "broker-register",
          }}
          userName={brokerData.name}
          userEmail={brokerData.email}
          userPhone={brokerData.phone}
          amount={BROKERAGE_REGISTRATION_FEE}
        />
      )}
      <Spinner isLoading={isLoading} />
      <header className="page-header">
        <div className="lang-container">
          <SelectInput
            name="language"
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            options={languageNamesOptions}
            icon="pi pi-language"
          />
        </div>

        <h1 className="title">
          <span>{t("title")}</span>
        </h1>
        <p className="subtitle">{t("subtitle")}</p>
      </header>

      <main className="page-content">
        {/* Benefits Section */}
        <section className="section-card benefits">
          <h2>{t("benefits_title")}</h2>
          <div className="benefit-list">
            <div className="benefit-item">
              <p>
                <strong>{t("benefit_1_strong")}</strong> {t("benefit_1_text")}
              </p>
            </div>
            <div className="benefit-item">
              <p>
                <strong>{t("benefit_2_strong")}</strong>{" "}
                {t("benefit_2_text")
                  .split("advertising your company...")
                  .map((part, index) => (
                    <React.Fragment key={index}>
                      {part}
                      {index === 0 && (
                        <span style={{ color: "#b45309", fontWeight: 600 }}>
                          {" "}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
              </p>
            </div>
            <div className="benefit-item">
              <p>
                <strong>{t("benefit_3_strong")}</strong> {t("benefit_3_text")}
              </p>
            </div>
          </div>

          <div className="support-bar">
            <p>{t("contact_support")}</p>
            <a href="tel:YOUR_CONTACT_NUMBER" className="call-button">
              <i className="m-1 mr-2 pi pi-whatsapp" />
              {t("contact_button")}
            </a>
          </div>
        </section>

        {/* Onboarding Steps */}
        <section className="section-card">
          <h2>{t("onboarding_title")}</h2>
          <div className="steps-grid">
            {[1, 2, 3].map((num) => (
              <div key={num} className="step-box">
                <div className="step-num">{num}</div>
                <h3>{t(`step_${num}_title`)}</h3>
                <p>{t(`step_${num}_desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Form */}
        <section className="section-card registration">
          <h2>{t("form_title")}</h2>

          <div className="form-group-title">{t("section_1_title")}</div>
          <div className="form-row">
            <FormInput
              required
              name="name"
              label={t("label_name")}
              onChange={handleChange}
              value={brokerData.name}
              icon="pi pi-whatsapp"
              placeholder={t("placeholder_name")}
            />

            <FormInput
              required
              name="email"
              type="email"
              label={t("label_email")}
              onChange={handleChange}
              value={brokerData.email}
              icon="pi pi-whatsapp"
              placeholder={t("placeholder_email")}
            />
          </div>
          <div className="form-row">
            <FormInput
              required
              name="phone"
              label={t("label_phone")}
              onChange={handleChange}
              value={brokerData.phone}
              icon="pi pi-whatsapp"
              placeholder={t("placeholder_phone")}
              maxLength={10}
            />
          </div>
          <div className="hidden md:block"></div>

          <div className="form-group-title">{t("section_2_title")}</div>
          <div className="form-row">
            <FormInput
              required
              name="password"
              label={t("label_password")}
              type="password"
              onChange={handleChange}
              value={brokerData.password}
              icon="pi pi-whatsapp"
              placeholder={t("placeholder_password")}
            />

            <FormInput
              required
              name="confirmPassword"
              label={t("label_confirm_password")}
              type="password"
              onChange={handleChange}
              value={brokerData.confirmPassword}
              icon="pi pi-whatsapp"
              placeholder={t("placeholder_confirm_password")}
            />
          </div>
          <div className="form-group-title">{t("section_3_title")}</div>
          <div className="form-row">
            <FormInput
              required
              name="companyName"
              label={t("label_company_name")}
              onChange={handleChange}
              value={brokerData.companyName}
              icon="pi pi-whatsapp"
              placeholder={t("placeholder_company_name")}
            />

            <FormInput
              required
              name="address"
              label={t("label_address")}
              onChange={handleChange}
              value={brokerData.address}
              icon="pi pi-whatsapp"
              placeholder={t("placeholder_address")}
            />
          </div>

          <div className="form-row">
            <SelectInput
              name="caste"
              label={t("label_community_serve")}
              value={brokerData.caste}
              onChange={handleChange}
              options={casteOptions}
              icon="pi pi-briefcase"
              isMultiselect
              filter
              required
            />
            <SelectInput
              name="motherTongue"
              label={t("mother_tongues_serve")}
              value={brokerData.motherTongue}
              onChange={handleChange}
              options={motherTongueOptions}
              icon="pi pi-language"
              isMultiselect
              filter
              required
            />
          </div>
          <div className="form-row">
            <FormInput
              isTextArea
              name="note"
              label={t("label_note")}
              onChange={handleChange}
              value={brokerData.note}
              icon="pi pi-whatsapp"
              placeholder={t("label_note_placeholder")}
              required
            />
          </div>

          <div className="form-group-title">{t("section_4_title")}</div>
          <div className="full-width">
            <p> {t("label_id_proof")} *</p>
            <ImageUpload onChange={setImages} />
          </div>

          <div className="full-width" style={{ paddingTop: "1rem" }}>
            <Button
              onClick={handlePayment}
              disabled={isSubmit()}
              className="update-btn">
              {t("submit_button")}
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PartnerWithUs;
