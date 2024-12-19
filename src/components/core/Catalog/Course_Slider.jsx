// UTILITY COMPONENTS
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";




// CUSTOM COMPONENTS
// import { getAllCourses } from "../../services/operations/courseDetailsAPI";
import Course_Card from "./Course_Card";




function Course_Slider({ Courses }) {
    return (
        <>
            {
                Courses?.length ? (
                    <div>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={25}
                            loop={true}
                            pagination={true}
                            className="mySwiper"
                            //modules={[FreeMode, Pagination]}
                            breakpoints={ {
                                1024: {slidesPerView:3}
                            }}
                        >
                            {
                                Courses.map(( course,index) => (
                                    <SwiperSlide key={index} >
                                        <Course_Card course={course} Height={ "h-[250px]" } />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                ) : 
                (
                    <p className="text-xl text-richblack-5">No Course Found</p>
                )
            }
        </>
    )
}






export default Course_Slider;