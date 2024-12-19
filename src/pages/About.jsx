import React from "react";

import HighlightText from "../components/core/HomePage/HighlightText";


import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";


import Quote from "../components/core/AboutPage/Quote";
import StatsComponent from "../components/core/AboutPage/StatsComponent";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import Footer from "../components/common/Footer";






const About = () => {
    return (
        <div>



            { /************************************* Section - 1 **********************************************/ }
            <section section className="bg-richblack-700">
                <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">


                    { /* heading */ }
                    <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
                        Driving Innovation in Online Education for a 
                        < HighlightText text = { "Brighter Future" } />
                        { /* Paragraph */}
                        <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                            Scholar Sync is at the forefront of driving innovation in online
                            education. We're passionate about creating a brighter future by
                            offering cutting-edge courses, leveraging emerging technologies,
                            and nurturing a vibrant learning community.
                        </p>
                    </header>


                    <div className="sm:h-[70px] lg:h-[150px]"></div>


                    {/* 3 Images */}
                    {/* <div  className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5" >
                        <img src= { BannerImage1 }  />
                        <img src= { BannerImage2 }  />
                        <img src= { BannerImage3 }  />
                    </div> */}
                </div>
            </section>



            { /*********************************** Section - 2 **********************************************/ }
            {/* <section className="border-b border-richblack-700" >
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500"> 
                <div className="h-[100px] "></div>
                <Quote />
            </div>
            </section> */}



            { /**************************** Section - 3 ---> Skipped **********************************************/ }



            { /************************************ Section - 4 **********************************************************/}
            {/* <StatsComponent /> */}



            { /************************************ Section - 5 **********************************************************/}
            < section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
                {/* <LearningGrid /> */}
                <ContactFormSection />
            </section>



            {/************************************ Section - 6 **********************************************************/}
            <section  className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
                {/* <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1> */}
            </section>


            <Footer></Footer>
        </div>
    )
}

export default About;