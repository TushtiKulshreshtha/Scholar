import React from "react";
import ContactDetails from "../components/core/ContactUsPage/ContactDetails";
import ContactForm from "../components/core/ContactUsPage/ContactForm";

import ReviewSlider from "../components/common/ReviewSlider";



const Contact = () => {
    return (
        <div>
            {/* Div for Contact Details and Contact Form */}
            <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
                
                
                {/* Contact Details */}
                <div className="lg:w-[40%]">
                    <ContactDetails />
                </div>


                {/* Contact Form */}
                <div className="lg:w-[60%]">
                    <ContactForm />
                </div>


            </div>


        {/* Review From Other learner div */}
            <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* Reviws from Other Learner */}
                <h1 className="text-center text-4xl  mt-8">
                    Reviews from other learners
                </h1>
                <ReviewSlider />
            </div>


        </div>
    )
}




export default Contact;