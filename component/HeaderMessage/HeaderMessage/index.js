import { _getHeaderMessages } from 'Query/Home.query';
import React, { useEffect, useState } from 'react'
import domToReact from 'html-react-parser';
import './HeaderMessage.style'


const index = () => {
    const [state, setState] = useState({
        headerMessage: [],
        messageBool: false,
        background_color: '',
        foreground_color: ''
    })



    const getMessagesHandler = async (city) => {
        let getMessages = JSON.parse(await _getHeaderMessages(city))
        console.log("getting message: .........................", getMessages);
        if (getMessages?.data?.topBar?.background_color !== null) {
            setState({
                headerMessage: [...getMessages.data.topBar.text_messages],
                messageBool: true,
                background_color: getMessages.data.topBar.background_color,
                foreground_color: getMessages.data.topBar.foreground_color
            })
        }
    }

    useEffect(() => {


        console.log('useEffect..............ok');
        let checkScriptBool = true
        let checkLinkBool = true

        for (let i = 0; i < document.scripts.length; i++) {
            if (document.scripts[i].src == 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js') {
                console.log('script loop');
                checkScriptBool = false
            }
        }
        for (let i = 0; i < document.links.length; i++) {
            if (document.scripts[i].href == 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css') {
                console.log('links loop');
                checkLinkBool = false
            }
        }
        if (checkLinkBool) {
            console.log('links if condition');
            const link = document.createElement("link");
            link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
        if (checkScriptBool) {
            console.log('script if condition');
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
            script.async = true;
            document.head.appendChild(script);
        }

        let customer = JSON.parse(localStorage.getItem('customer'))
        if (customer?.data?.addresses[customer?.data.addresses.length - 1].city) { getMessagesHandler(customer?.data?.addresses[customer?.data?.addresses?.length - 1]?.city) }
        else if (customer?.data?.addresses[1]?.city) { getMessagesHandler(customer?.data?.addresses[1]?.city) }
        else { getMessagesHandler("") }


    }, [])

    useEffect(() => {
        return () => {

            for(let i = 0; i < Object.keys(document.links).length; i++){
                if(document.links[i].href === 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'){
                    console.log("styles..........", document.links[i].href)
                    document.links[i].remove()
                }
            }

            for(let i = 0; i < Object.keys(document.scripts).length; i++){
                if(document.scripts[i].src === 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'){
                    console.log("styles..........", document.scripts[i].src)
                    document.scripts[i].remove()
                }
            }

            console.log("unmount........................unmount");
        }
    }, [])



    return (
        <>
            {
                state?.messageBool && (
                    <div id="demo" className="carousel slide" data-bs-ride="carousel" style={{ backgroundColor: state.background_color, color: state.foreground_color }}>
                        <div className="container">
                            <div className="carousel-inner">
                                {state?.headerMessage?.length && state?.headerMessage?.map((item, index) => {
                                    let classes = index === 0 ? 'carousel-item active' : "carousel-item"

                                    let divData = document.createElement('p')
                                    divData.textContent = item.text_message
                                    console.log("divData..............", divData);
                                    console.log("item..............", item);
                                    console.log("divData.innerHTML..............", divData.innerHTML);
                                    return <div className={classes} >
                                        <p>{domToReact(item.text_message)}</p>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default React.memo(index)