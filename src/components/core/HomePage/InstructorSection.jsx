import React from "react";
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "../HomePage/CTAButton";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
    return (
        <div className="mt-16 mb-32">   

            {/* Main Div That Contains Left And Right Div */}
            <div className="flex flex-row gap-20 items-center">


                {/* Left Box*/}
                <div className="w-[50%]">
                    <img src={Instructor} alt="" className="shadow-white"/>
                </div>



                {/* Right Box*/}
                <div className="w-[50%] flex flex-col gap-10">


                    {/* Heading */}
                    <div className="text-4xl font-semibold w-[50%]">
                        Become an 
                        <HighlightText text={"Instructor"} />
                    </div>


                    {/* Sub Heading */}
                    <p className="font-medium text-[16px] w-[80%] text-richblack-300">
                        Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                    </p>


                    {/* Button */}
                    <div className="w-fit">
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="flex flex-row gap-2 items-center">
                                Start Learning Today
                                <FaArrowRight />
                            </div>
                        </CTAButton>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default InstructorSection;