import React from "react";

import SignupImg from "../assets/Images/signup.webp";
import Template from "../components/core/Auth/Template";

const Signup = () => {
    return (
        <div>
            <Template 
                title="Join With Scholar Sync for free"
                description1="Build skills for today, tomorrow, and beyond."
                description2="Education to future-proof your career."
                //image = {SignupImg}
                formType="signup"
            />
        </div>
    )
}

export default Signup;