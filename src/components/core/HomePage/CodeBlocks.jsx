import React from "react";

import CTAButton from "./CTAButton";
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({position, heading, subheading, ctabtn1, ctabtn2, codeColor,  codeblock, backgroundGradient}) => {
    return (
        <div className={`flex ${position} my-20 justify-between lg:gap-8`}>


            {/**********************Left Side Div*********************/}
            <div className="lg:w-[45%] w-[100%] flex flex-col gap-10">

                {/* Heading */}
                {heading} 

                {/* Sub Heading */}
                <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3"> 
                    {subheading} 
                </div>

                {/* Button Group */}
                <div className="flex flex-row gap-7 mt-7">
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className="flex flex-row gap-4">
                            {ctabtn1.btnText}
                            <FaArrowRight className="mt-1" size={15}/>
                        </div>
                    </CTAButton>
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        <div className="flex flex-row gap-2">
                            {ctabtn2.btnText}
                        </div>
                    </CTAButton>
                </div>
            </div>


            {/********************Rigth Side Div*********************/}
            <div className="flex flex-row code-border h-fit py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative lg:w-[520px] w-[100%]">
                {backgroundGradient}

                {/* Numbers column */}
                <div className=" text-center flex flex-col  w-[10%] select-none text-richblack-400 font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>

                {/* Code Text */}
                <div className= {`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}>
                    <TypeAnimation
                        sequence={[codeblock, 1000, ""]}
                        cursor={true}
                        repeat={Infinity}
                        style={ {whiteSpace: "pre-line", display: "block",}   }
                        omitDeletionAnimation={true}
                    />
                </div>
            </div>


        </div>
    )
}

export default CodeBlocks;