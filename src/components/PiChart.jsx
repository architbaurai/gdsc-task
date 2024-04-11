import { useState, useEffect } from "react";
import Chart from 'react-apexcharts';

export default function PiChart({symbol, piMan, overlay, setOverlayState}){

    const [series, setSeries] = useState([1, 1, 1, 1, 1, 1]);
  
  
    useEffect(()=>{
  
      async function getForecast(){
        await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=yes&alerts=no`)
        .then((res)=>{
          if(res.ok){
            return res.json()
          } else {
            throw new Error("Failed to fetch")
          }
        })
        .then((res=>{
          const piData = res.forecast.forecastday[0].day.air_quality;
          setSeries([piData.co, piData.no2, piData.o3, piData.so2, piData.pm2_5, piData.pm10])
        }))
        .catch((error)=>{
          console.log("Failed to fetch")
        })
      }
  
      getForecast();
    },[symbol])
  
  
    const options = {
        
        chart: {
          type: `${piMan}`,
          fontFamily:'Open Sans',
        },
        
        labels: ["co", "no2", "o3", "so2", "pm2.5", "pm10"],
        
        theme: {
          monochrome: {
            enabled: true
          }
        },
        
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -5
            }
          }
        },
  
        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name, val.toFixed(1) + '%']
          },
  
          style:{
            fontSize: '13px'
          }
        },
        
        legend: {
          
          show: true,
          
          onItemClick: {
            toggleDataSeries: true
          },
  
          horizontalALign: 'right',
  
          position: 'right',
  
          fontSize:"16px"
        },
  
        responsive: [{
          breakpoint: 1000,
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
              position:'bottom',
            }
          }
        },{
          breakpoint: 300,
          options: {
            chart:{
              width:'240px'
            }
          }
        }]
      }
  
    return <div>
      <Chart options={options} series = {series} type={piMan} height={'400px'} width = {'400px'}/>
      <div className="exp-container">
        <span className='exp-button' onClick={()=>{
          if(overlay===""){setOverlayState(prev=>{prev.set("overlay","pi"); return prev;})}
          else{setOverlayState(prev=>{prev.set("overlay",""); return prev;})}
          }}><a href='#overlay'>{overlay!==""? "close" : "share"}</a></span>
      </div>
    </div>
  }