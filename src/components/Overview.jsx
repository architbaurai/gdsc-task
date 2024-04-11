import { useState,useEffect } from "react";
import { ReactBingmaps } from 'react-bingmaps';
import Socials from './Socials'


export default function Overview({symbol}){

    const [inf, setInf] = useState(["San Francisco", "California", "United States of America", 37.77, 122.41, "", 22.3, ""]);
    const [map, setMap] = useState(null);
  
    useEffect(()=>{
      async function getCurrent(){
  
        await fetch(`https://api.weatherapi.com/v1/current.json?key=633efb86edba4c3182c115344240904&q=${symbol}&aqi=no`)
        .then((res)=>{
          if(res.ok){
            return res.json()
          } else {
            throw new Error("Failed to fetch")
          }
        })
        .then((res)=>{
  
          let city = res.location.name;
          let region = res.location.region;
          let country = res.location.country;
  
          let lat = res.location.lat;
          let lon = res.location.lon;
  
          let ico = res.current.condition.icon;
          let temp = res.current.temp_c;
          let cond = res.current.condition.text;
  
          setInf([city, region, country, lat, lon, ico, temp, cond]);
  
          return res;
        }).then((res=>{
          setMap(
            <ReactBingmaps 
              bingmapKey = "AnNq5ZsNTOez4ZTeBDa-N3yrvAgAszEv8XTFP9dVvsm-hm7ykBgVffLZAxVjs1t5" 
              center = {[res.location.lat, res.location.lon]}
              pushPins = {
                [
                  {
                    "location":[res.location.lat, res.location.lon], "option":{ color: '#2F80ED' }
                  }
                ]
              }
              > 
            </ReactBingmaps>
          )
        })).catch((error)=>{
          console.log("Failed to fetch");
        })
      }
  
      getCurrent();
    },[symbol])
  
    const link = encodeURIComponent(window.location.href);
    const msg = encodeURIComponent(`Hey ! Checkout the climate analysis of ${symbol} at Weather Co\n`)
  
    return <div className='info-card'>
      <div className="weather-info">
  
        <div>
        <p><strong>{inf[0]},</strong></p>
        <p><strong>{inf[1]}, {inf[2]}</strong></p>
        <div className="temperature">
        <img src={inf[5]} alt="" />
        <div className='temp-text'>
          <p>{inf[6]}°C</p>
          <p>{inf[7]}</p>
        </div>
        </div>
        </div>
  
        <Socials link={link} msg = {msg}/>
  
      </div>
  
      <div className="map">
        {map}
      </div>
    </div>
  }