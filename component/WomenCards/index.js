import React, { useEffect, useState } from 'react'
import {  _womenCards } from "Query/CatehoryDetail.query";
import domToReact from 'html-react-parser';
import './womencards.css'

export default function index() {

    const [state, setState]= useState({
        items: [],
    })

    const getWomenCards = async (customerID) => {

        let getWomencards = JSON.parse(await _womenCards(customerID))


        if(getWomencards){

            setState({
                items: getWomencards.data.WomenCards.items,
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
            getWomenCards(customerID)
            
        }else{
            
            getWomenCards(0)
        }
        

    },[])

    console.log(state.items, "<----- items out")

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
