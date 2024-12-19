import React from "react";
import HighlightText from "./HighlightText";
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"

import CTAButton from "../HomePage/CTAButton"



const LearningLanguageSection = () => {
    return (
        <div className="mt-[130px] mb-[100px]">
            <div className="flex flex-col gap-5 items-center">
                {/* Main Heading */}
                <div className="text-4xl font-semibold text-center">Your Swiss Knife for
                    <HighlightText text={"learning any language"}></HighlightText>
                </div>
                {/* Description */}
                <div className="text-center text-richblack-600 mx-auto text-base mt-3 font-medium w-[60%]">
                    Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                </div>
                {/* 3 Images in Row*/}
                <div className="flex flex-row items-center justify-center mt-5 select-none">
                    <img 
                        src={know_your_progress} 
                        alt={know_your_progress} 
                        className="object-contain -mr-32" 
                    />
                    <img 
                        src={compare_with_others} 
                        alt={compare_with_others} 
                        className="object-contain" 
                    />
                    <img 
                        src={plan_your_lesson} 
                        alt={plan_your_lesson} 
                        className="object-contain -ml-36" 
                    />
                </div>
                {/*Button */}
                <div className="w-fit">
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn More
                        </div>
                    </CTAButton>
                </div>
            </div>
        </div>
    )
}

export default LearningLanguageSection