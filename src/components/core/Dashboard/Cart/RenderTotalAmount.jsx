// UTILITY COMPONENTS
import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"




// API CALLS
import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI";


// CUSTOM COMPONENTS
import IconBtn from "../../../common/IconBtn";




const RenderTotalAmount = () => { 

    // importing values form slices [ total ruppess, and cart items ]
    const { total } = useSelector((state) => state.cart);
    const { cart } = useSelector( (state) => state.cart );
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    function handleBuyCourse() {
        const courses = cart.map( (course) => course._id );
        console.log("Bought these course:", courses);
        // API CALL
        BuyCourse( token, courses, user, navigate, dispatch );
    }



    return (
        <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            
            {/* Total Heading  */}
            <p className="mb-1 text-sm font-medium text-richblack-300"> Total: </p>



            {/* Total Amount  */}
            <p className="mb-6 text-3xl font-medium text-yellow-100"> ₹ {total} </p>



            {/* Buy Button  */}
            <IconBtn text="Buy Now" onclick={ handleBuyCourse } customClasses="w-full justify-center" />
        </div>
    )
}


export default RenderTotalAmount;