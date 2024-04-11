
import { useState } from "react";

export default function Header({setSymbol}){

    const [temp, setTemp] = useState("");
    const [errMsg, setErrMsg] = useState(null);
  
  
    function getLoc(){
      if (navigator.geolocation && sessionStorage.getItem("coordinates") === null) {
  
        let options = {
          enableHighAccuracy: false
        }
  
        let onErr = ()=>console.log('error fetching coordinates');
  
        navigator.geolocation.getCurrentPosition(setLoc, onErr, options);
      }
    }
  
    async function setLoc(position){
  
        await sessionStorage.setItem("coordinates",JSON.stringify({lat:position.coords.latitude, lon:position.coords.longitude}));
  
        let crd = JSON.parse(sessionStorage.getItem("coordinates"));
        let lati = crd.lat;
        let longi = crd.lon;
  
        await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lati}&lon=${longi}&limit=${1}&appid=${`1cf6d90ea9facabbb0daec28a9880704`}`)
        .then((res)=>{
          if(res.ok){
            return res.json()
          } else {
            throw new Error("Failed to fetch")
          }
        })
        .then((res)=>{
  
          let city = res[0].name;
  
          console.log(city);
          setSymbol(prev=>{prev.set("symbol",city); return prev;})
        })
        .catch((error)=>{
          console.log("Failed to fetch")
        })
    }
  
    getLoc();
  
  
    async function handleSearch(e, temp){
  
      e.preventDefault();
  
      await fetch(`https://api.weatherapi.com/v1/current.json?key=633efb86edba4c3182c115344240904&q=${temp}&aqi=no`)
      .then(res=>{
  
        if(res.ok){
          return res.json()
        } else {
          throw new Error()
        }
      })
      .then(res=>{
          setSymbol(prev=>{prev.set("symbol",temp); return prev;})
          setErrMsg(null);
      })
      .catch((error)=>{
        setErrMsg(<div className='err-msg'>No such location found</div>)
      })
      
  
      setTemp((s)=>"");
    }
  
    return <><header>
  
        <div className="search-container">
  
        <p className="logo">Weather Co.</p>
  
        <form action="submit">
          <input value = {temp} type="text" onChange={(e)=>{setTemp((s)=>e.target.value)}}/>
          <button onClick={(e)=>{handleSearch(e, temp)}}><strong>Search</strong></button>
        </form>
  
        </div>
  
      </header>
      {errMsg}
    </>
  }