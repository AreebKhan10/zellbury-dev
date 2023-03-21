import React, { useEffect, useState }from 'react'
import {  _MenSlider } from "Query/CatehoryDetail.query";
import domToReact from 'html-react-parser';
import './menSlider.css'


export default function index() {

    console.log("MENSLIDER")

    const [state, setState]= useState({
        slides: [],
    })

    const sliderImage = state?.slides.map(slide => slide.desktop_image)
    const slideLink = state?.slides.map(slide => slide.slide_link)
    const sliderMobileImage = state?.slides.map(slide => slide.mobile_image)


    const getMenSlider = async (customerID) => {
        
        let getMenSlider = JSON.parse(await _MenSlider(customerID))
        console.log(getMenSlider, "<----getMenSlider")
        if(getMenSlider?.data?.MenSlider?.slides?.length){
            console.log(getMenSlider, "<----getMenSlider in")
            
            setState({
                slides: getMenSlider.data.MenSlider.slides
                
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
            getMenSlider(customerID)

    }else{
            
        getMenSlider(0)
    }
    
        
    },[])
    
    if(state.slides.length){
        
        console.log(state,"<------Slicdesosama")
    }


  return (
      <>
        {state.slides.length ?
            <div class="row">
                <div class="column banner-wrapper">
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
