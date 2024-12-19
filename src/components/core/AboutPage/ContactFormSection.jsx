import React from "react";
import ContactUsForm from "../ContactUsPage/ContactUsForm";

const ContactFormSection = () => {
    return (
        <div className="mx-auto">
            {/* Heading */}
            <h1 className="text-center text-4xl font-semibold"> Get in Touch </h1>
            
            
            
            {/* sub Heading */}
            <p className="text-center text-richblack-300 mt-3">
                We&apos;d love to here for you, Please fill out this form.
            </p>



            {/* Contact Form Component */}
            < div className="mt-12 mx-auto" >
                <ContactUsForm />
            </div>

        </div>
    )
}


export default ContactFormSection;