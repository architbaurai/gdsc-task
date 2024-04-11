import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import StatContainer from './StatContainer';
import Overview from './Overview';
import PiChart from './PiChart';
import LineChart from './LineChart';
import BarChart from './BarChart'
import Socials from './Socials';

export default function Content({symbol}){

    const[piMan, setPiMan] = useState("pie");
    const[lineMan, setLineMan] = useState("Hourly");
    const[barMan, setBarMan] = useState("Time-wise");
  
    const[overlayState, setOverlayState] = useSearchParams({overlay:""});
  
    const overlay = overlayState.get('overlay');
  
    const chartComp = new Map();
  
    const view = (overlay==="pi")? "air composition" : (overlay==="line")? "weather forecast" : "UV index analysis";
    const link = encodeURIComponent(window.location.href);
    const msg = `Hey ! Checkout the ${view} of ${symbol} at Weather Co\n`
  
    chartComp.set('pi', <><StatContainer type = "pi" setMan={setPiMan}>
                          <PiChart symbol = {symbol} piMan={piMan} overlay = {overlay} setOverlayState={setOverlayState}/>
                        </StatContainer>
                        <Socials link = {link} msg={msg}/>
                        </>);
  
    chartComp.set('line',<><StatContainer type="line" setMan={setLineMan}>
                            <LineChart symbol = {symbol} lineMan = {lineMan} overlay = {overlay} setOverlayState={setOverlayState}/>
                          </StatContainer>
                          <Socials link = {link} msg={msg}/>
                          </>)
  
    chartComp.set('bar',<><StatContainer type="bar" setMan={setBarMan}>
                          <BarChart symbol = {symbol} barMan = {barMan} overlay = {overlay} setOverlayState={setOverlayState}/>
                         </StatContainer>
                         <Socials link = {link} msg={msg}/>                     
                        </>)
  
  
    return <>
  
      <div className="main-container">
  
        <div className="overlay" id='overlay'>
          {overlay===""? null : chartComp.get(overlay)}
        </div>
    
        <div className="statistics" style={overlay===""? null : {zIndex:"0", filter:"blur(1.25em)", pointerEvents:"none"}}>
  
          <StatContainer type="info">
              <Overview symbol = {symbol}/>
          </StatContainer>
  
          <StatContainer type = "pi" setMan={setPiMan}>
            <PiChart symbol = {symbol} piMan={piMan} overlay = {overlay} setOverlayState={setOverlayState}/>
          </StatContainer>
  
          <StatContainer type="line" setMan={setLineMan}>
          <LineChart symbol = {symbol} lineMan = {lineMan} overlay = {overlay} setOverlayState={setOverlayState}/>
          </StatContainer>
  
          <StatContainer type="bar" setMan={setBarMan}>
            <BarChart symbol = {symbol} barMan = {barMan} overlay = {overlay} setOverlayState={setOverlayState}/>
          </StatContainer>
  
        </div>
      </div>
    </>
  }