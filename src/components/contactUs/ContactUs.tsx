import React from "react";
import "./ContactUs.scss";

const ContactUs = () => {
    return (
        <div className="contact-mail">
            <ul>
                <li style={{ "--i": "#efc06a", "--j": "#FF8C00" } as React.CSSProperties}>
                    <span className="icon">
                        <i className="pi pi-envelope"></i>
                    </span>
                    <span className="title">seetharamakalyana@gmail.com</span>
                </li>
            </ul>
        </div>
    );
};

export default ContactUs;
