import { useState, useEffect } from "react";
import Chart from 'react-apexcharts';

export default function LineChart({symbol, lineMan, overlay, setOverlayState}){

    const [series, setSeries] = useState([{
      data: [{ x: '05/06/2014', y: 54 }, { x: '05/08/2014', y: 17 } , { x: '05/28/2014', y: 26 } , { x: '06/2/2014', y: 16 } , { x: '06/8/2014', y: 46 } , { x: '06/15/2014', y: 96 }]
    }]);
  
    useEffect(()=>{
      async function getForecast(){
  
        let timeData; 
  
        if(lineMan === "Hourly"){
  
          await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=no&alerts=no`)
          .then((res)=>{
            if(res.ok){
              return res.json()
            } else {
              throw new Error("Failed to fetch")
            }
          })
          .then((res=>{
            timeData = res.forecast.forecastday[0].hour.map((val)=>{return {x:val.time, y:val.temp_c}});
          }))
          .catch((error)=>{
            console.log("Failed to fetch")
          })
        } else {
  
          await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=7&aqi=no&alerts=no`)
          .then((res)=>{
            if(res.ok){
              return res.json()
            } else {
              throw new Error("Failed to fetch")
            }
          })
          .then((res=>{
            timeData= res.forecast.forecastday.map((val)=>{return {x:val.date, y:val.day.avgtemp_c}});
          }))
          .catch((error)=>{
            console.log('Failed to fetch')
          })
        }
  
        setSeries([{data: timeData}]);
      }
  
      getForecast();
  
    },[symbol, lineMan])
  
  
    const options = {
  
    chart: {
      type: 'area',
      stacked: false,
      
      toolbar:{
        show:false
      },
    
      zoom:{
        enabled:false
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    fill: {
      type: 'solid',
    },
    yaxis: {
      title: {
        text: 'Temperature',
          style:{
            fontSize:"13px",
          }
      },
      labels:{
        style:{
          fontSize:"13px",
          fontFamily:"Montserrat"
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels:{
        style:{
          fontSize:"13px",
          fontFamily:"Montserrat"
        }
      }
    },
    responsive: [{
      breakpoint: 1350,
      options: {
        chart:{
          width:'600px'
        },
        legend:{
          position: 'right'
        }
      }
    },{
      breakpoint: 1250,
      options: {
        chart:{
          width:'500px'
        },
        legend:{
          position: 'right'
        }
      }
    },{
      breakpoint: 1100,
      options: {
        chart:{
          width:'400px'
        },
        legend:{
          position: 'right'
        }
      }
    },{
      breakpoint: 420,
      options: {
        chart:{
          width:'300px'
        },
        legend:{
          position:'bottom'
        }
      }
    },{
      breakpoint: 300,
      options: {
        chart:{
          width:'220px'
        }
      }
    }]
  }
  
  
    return <div>
      <Chart options={options} series = {series} type="line" height={'400px'} width = {'700px'}/>
      <div className="exp-container">
        <span className='exp-button' onClick={()=>{
          if(overlay===""){setOverlayState(prev=>{prev.set("overlay","line"); return prev;})}
          else{setOverlayState(prev=>{prev.set("overlay",""); return prev;})}
          }}><a href='#overlay'>{overlay!==""? "close" : "share"}</a></span>
      </div>
    </div>
  }