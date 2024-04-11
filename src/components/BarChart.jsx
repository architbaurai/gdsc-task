import { useState, useEffect } from "react";
import Chart from 'react-apexcharts';

export default function BarChart({symbol, barMan, overlay, setOverlayState}){


    const [series, setSeries] = useState([{
      data: [{
        x: 'A',
        y: 10
      }, {
        x: 'B',
        y: 18
      }, {
        x: 'C',
        y: 13
      }
    ]
    }]);
  
  
    useEffect(()=>{
      async function getForecast(){
  
        let uv;
  
        let asc = (a, b) => a.y - b.y;
        let dsc = (a, b) => b.y - a.y;
  
        await fetch(`https://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=yes&alerts=no`)
        .then((res)=>{
          if(res.ok){
            return res.json()
          } else {
            throw new Error("Failed to fetch")
          }
        })
        .then((res=>{
          
          uv = res.forecast.forecastday[0].hour.map((val)=>{return {x:val.time, y:val.uv}});
  
          if(barMan === "Ascending"){
            uv.sort(asc);
          } else if(barMan === "Descending"){
            uv.sort(dsc);
          } else{
            uv.sort();
          }
    
          setSeries([{data: uv}]);
          
        }))
        .catch((error)=>{
          console.log("Failed to fetch")
        })
      }
      getForecast();
    },[symbol, barMan])
  
    const options = {
      chart: {
        type: 'bar',
  
        toolbar:{
          show:false
        },
      },
  
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 3
        }
      },
      yaxis: {
        labels:{
          style:{
            fontSize:"13px",
          }
        }
      },
      xaxis: {
        labels:{
          style:{
            fontSize:"13px",
            fontFamily:"Montserrat"
          }
        }
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
      <Chart options={options} series = {series} type="bar" height={'413px'} width={'400px'}/>
      <div className="exp-container">
        <span className='exp-button' onClick={()=>{
          if(overlay===""){setOverlayState(prev=>{prev.set("overlay","bar"); return prev;})}
          else{setOverlayState(prev=>{prev.set("overlay",""); return prev;})}
          }}><a href='#overlay'>{overlay!==""? "close" : "share"}</a></span>
      </div>
    </div>
  }