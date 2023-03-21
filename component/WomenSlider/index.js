import React, { useEffect, useState }from 'react'
import {  _womenSlider } from "Query/CatehoryDetail.query";
import domToReact from 'html-react-parser';
import './womenSlider.css'


export default function index() {

    console.log("WOMENSLIDER")

    const [state, setState]= useState({
        slides: [],
    })

    const sliderImage = state?.slides.map(slide => slide.desktop_image)
    const slideLink = state?.slides.map(slide => slide.slide_link)
    const sliderMobileImage = state?.slides.map(slide => slide.mobile_image)

    const getWomenSlider = async (customerID) => {
        
        let getWomenSlider = JSON.parse(await _womenSlider(customerID))
        console.log(getWomenSlider, "<----getWomenSlider")
        if(getWomenSlider?.data?.WomenSlider?.slides?.length){
            console.log(getWomenSlider, "<----getWomenSlider in")
            
            setState({
                slides: getWomenSlider.data.WomenSlider.slides
                
            })
        }
        
    }
    
    useEffect(()=>{
        console.log("<----->")
        let customer = JSON.parse(localStorage.getItem('customer'))
        console.log(customer, "<---customer")
        // && customer?.data?.group_id !== 1
        if(customer?.data?.customer_id.length){
            console.log(customer?.data?.customer_id, "<---customer")
            let customerID = parseInt(customer?.data?.customer_id)
        getWomenSlider(customerID)

    }else{
            
        getWomenSlider(0)
    }
    
        
    },[])
    
    if(state.slides.length){
        
        console.log(state,"<------Slicdesosama")
    }


  return (
      <>
        {state.slides.length ?
            <div className="row">
                <div className="column banner-wrapper">
                        <div class="card">
                            <a href={domToReact(slideLink[0])}>
                            <img class="desktop" src= {domToReact(sliderImage[0])}  />
                            {sliderMobileImage && <img class="mobile" src= {domToReact(sliderMobileImage[0])}  />}
                            </a>
                            
                        </div>
                        
                    </div>
            </div>
            : <p></p>
            }
    
    </>


  )
}
