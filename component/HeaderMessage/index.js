import { _getHeaderMessages } from 'Query/Home.query';
import React, { useEffect, useState } from 'react'
import domToReact from 'html-react-parser';
import './HeaderMessage.css'
// import Carousel from 'react-bootstrap/Carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const index = () => {
    const [state, setState] = useState({
        headerMessage: [],
        messageBool: false,
        background_color: '',
        foreground_color: ''
    })

    const getMessagesHandler = async (city) => {
        let getMessages = JSON.parse(await _getHeaderMessages(city))
        // console.log("getting message: .........................", getMessages);
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
        for (let i = 0; i < Object.keys(document.getElementsByTagName('link')).length; i++) {
            // console.log(document.getElementsByTagName('link')[i])
            if (document.getElementsByTagName('link')[i].href === 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css') {
                // console.log("styles..........", document.getElementsByTagName('link')[i].href)
                // document.links[i].remove()
                console.log('script loop');
                checkLinkBool = false
            }
        }

        if (checkLinkBool) {
            // console.log('links if condition');
            // const link = document.createElement("link");
            // link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
            // link.rel = "stylesheet";
            // document.head.appendChild(link);
        }

        if (checkScriptBool) {
            // console.log('script if condition');
            // const script = document.createElement("script");
            // script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
            // script.defer = true;
            // document.body.appendChild(script);
        }





        let customer = JSON.parse(localStorage.getItem('customer'))


        // if (customer?.data?.addresses[customer?.data.addresses.length - 1].city) { getMessagesHandler(customer?.data?.addresses[customer?.data?.addresses?.length - 1]?.city) }
        if (customer?.data?.addresses?.length) {
            console.log('customer...........', customer);
            let data = customer?.data?.addresses.filter(item => item?.id == customer?.data?.default_shipping)
            console.log('city...........', data);
            if (data?.length) {
                getMessagesHandler(data[0].city)
            }
        } else if (customer?.data?.city) {
            getMessagesHandler(customer?.data?.city)
        }
        else {
            getMessagesHandler("")
        }


    }, [])

   
    // return (<>
    //     <Carousel>
    //         <Carousel.Item>
    //             <img
    //                 className="d-block w-100"
    //                 src="holder.js/800x400?text=First slide&bg=373940"
    //                 alt="First slide"
    //             />
    //             <Carousel.Caption>
    //                 <h3>First slide label</h3>
    //                 <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    //             </Carousel.Caption>
    //         </Carousel.Item>
    //         <Carousel.Item>
    //             <img
    //                 className="d-block w-100"
    //                 src="holder.js/800x400?text=Second slide&bg=282c34"
    //                 alt="Second slide"
    //             />

    //             <Carousel.Caption>
    //                 <h3>Second slide label</h3>
    //                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    //             </Carousel.Caption>
    //         </Carousel.Item>
    //     </Carousel>
    // </>)
    console.log('checking.....', state, ' and props...');
    return state?.messageBool ? (
        <Carousel
            autoPlay
            infiniteLoop
            interval={6000}
            showArrows={false}
            showIndicators={false}
            showStatus={false}
            stopOnHover={false}
            swipeable={false}
        // renderItem={(object) => {
        //     console.log('carousel item...............', object);
        //     return <>
        //         <h1>hello world</h1>content this.props...............
        //     </>
        // }}
        >
            {state?.headerMessage?.length && state?.headerMessage?.map((item, index) => {
                let TextMessage = (item?.text_message?.toLowerCase()).replace('closed - closed', 'closed today')
                TextMessage = (TextMessage.toLowerCase()).replace('same day', 'same-day')
                console.log('closed.......', TextMessage);
                // let classes = index === 0 ? 'carousel-item active' : "carousel-item"
                // let divData = document.createElement('p')
                // divData.textContent = item.text_message
                // console.log("divData..............", divData);
                // console.log("item..............", item);
                // console.log("divData.innerHTML..............", divData.innerHTML);
                return <div className="containerDivForHTML" style={{
                    backgroundColor: state.background_color,
                    color: state.foreground_color,
                    width: '100%',
                    // height: '50px',
                    display: 'flex',
                    //  flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textTransform: 'uppercase'

                }}>
                    {domToReact(TextMessage)}
                </div>
            })}
        </Carousel>
    ) : <div className="containerDivForHTML" style={{
        backgroundColor: '#eee',
        width: '100%',
        height: '50px',
        display: 'flex',
        //  flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
    </div>



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