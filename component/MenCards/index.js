import React, { useEffect, useState } from 'react'
import {  _manCards } from "Query/CatehoryDetail.query";
import domToReact from 'html-react-parser';

import './mencards.css'
export default function index() {

    const [state, setState]= useState({
        items: [],
    })
    
    const getMenCards = async (customerID) => {
        
        let getMencards = JSON.parse(await _manCards(customerID))
       
        
        
        if(getMencards){
            console.log("<---HERE")
            setState({
                items: getMencards.data.MenCards.items,
                title:""
            })
        }
        
    }
    
    useEffect(()=>{
        
        let customer = JSON.parse(localStorage.getItem('customer'))
        console.log(customer, "<---customer")
        // && customer?.data?.group_id !== 1
        if(customer?.data?.customer_id.length){
            console.log(customer?.data?.customer_id, "<---customer")
            let customerID = parseInt(customer?.data?.customer_id)
            getMenCards(customerID)
        }
        else{
            
            getMenCards(0)
        }


    },[])



  return (
    <div class="cardsWrapper">
                <div class="row">
                    { state?.items?.map((item)=>{
                          return <div class="column">
                            <div class="card">
                            <a href={domToReact(item?.url)}><img src={domToReact(item?.icon)} alt="" />
                            <h3>{domToReact(item?.title)}</h3>
                            </a>
                            </div>
                        </div>
                       
                    })
                    }
                </div>
    </div>
  )
}
