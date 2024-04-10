import './style.css';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { ReactBingmaps } from 'react-bingmaps';
import { useSearchParams } from 'react-router-dom';

function App() {

  const [urlsymbol, setSymbol] = useSearchParams({symbol:"Vellore"});

  const checkS = urlsymbol.get("symbol");

  const symbol = (checkS === null || checkS === "")? "Vellore" : checkS;

  return <div className="main">

    <Header setSymbol = {setSymbol}/>
    <Content symbol = {symbol}/>

    </div>
}


function Header({setSymbol}){

  const [temp, setTemp] = useState("");

  return <header>

    <div className="search-container">

    <p className="logo">Weather Co.</p>

    <form action="submit">
      <input value = {temp} type="text" onChange={(e)=>{setTemp((s)=>e.target.value)}}/>
      <button onClick={(e)=>{e.preventDefault(); if(temp !== "") {setSymbol(prev=>{prev.set("symbol",temp); return prev;})} setTemp((s)=>"");}}><strong>Search</strong></button>
    </form>

    </div>

  </header>
}

function Content({symbol}){

  const[piMan, setPiMan] = useState("pie");
  const[lineMan, setLineMan] = useState("Hourly");
  const[barMan, setBarMan] = useState("Time-wise");

  const[overlayState, setOverlayState] = useSearchParams({overlay:""});

  const overlay = overlayState.get('overlay');

  const chartComp = new Map();

  chartComp.set('pi', <><StatContainer type = "pi" setMan={setPiMan}>
                        <PiChart symbol = {symbol} piMan={piMan} overlay = {overlay} setOverlayState={setOverlayState}/>
                      </StatContainer>
                      <Socials fb = {null} tw = {null} rd = {null} wa = {null}/>
                      </>);

  chartComp.set('line',<><StatContainer type="line" setMan={setLineMan}>
                          <LineChart symbol = {symbol} lineMan = {lineMan} overlay = {overlay} setOverlayState={setOverlayState}/>
                        </StatContainer>
                        <Socials fb = {null} tw = {null} rd = {null} wa = {null}/>
                        </>)

  chartComp.set('bar',<><StatContainer type="bar" setMan={setBarMan}>
                        <BarChart symbol = {symbol} barMan = {barMan} overlay = {overlay} setOverlayState={setOverlayState}/>
                       </StatContainer>
                       <Socials fb = {null} tw = {null} rd = {null} wa = {null}/>                     
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


function StatContainer({type, children, setMan}){

  const secHead = new Map();

  secHead.set('info', "Current Weather");
  secHead.set('pi', "Air Composition");
  secHead.set('bar', "Ultra Violet Index");
  secHead.set('line', "Forecast");

  return <div className = {`stat-container ${type}`} >

    <div className='secondary-header'>
      <span className='secondary-heading'>{`${secHead.get(type)}`}</span>
      <Manipulator type={type} setMan={setMan}/>
    </div>

    <div className={`chart`}>
      {children}
    </div>
  
  </div>

}


function Manipulator({type, setMan}){

  let op1;
  let op2;
  let op3 = false;

  if(type === "pi"){
    op1 = "pie";
    op2 = "donut"
  } else if (type === "line"){
    op1 = "Hourly";
    op2 = "Daily";
  } else if (type === "bar"){
    op1 = "Time-wise";
    op2 = "Ascending";
    op3 = "Descending";
  }

  return(type !== "info" && type !== "map")? <select name="" id="" onChange={(e)=>{setMan((s)=>e.target.value)}}>
          <option value={op1}>{op1}</option>
          <option value={op2}>{op2}</option>
          {op3!==false? <option value={op3}>{op3}</option> : null}
        </select> : null;
}

function PiChart({symbol, piMan, overlay, setOverlayState}){

  const [series, setSeries] = useState([1, 1, 1, 1, 1, 1]);


  useEffect(()=>{

    async function getForecast(){
      await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=yes&alerts=no`)
      .then((res)=>res.json())
      .then((res=>{
        const piData = res.forecast.forecastday[0].day.air_quality;
        setSeries([piData.co, piData.no2, piData.o3, piData.so2, piData.pm2_5, piData.pm10])
      }))
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
          fontSize: '10px'
        }
      },
      
      legend: {
        
        show: true,
        
        onItemClick: {
          toggleDataSeries: true
        },

        horizontalALign: 'right',

        position: 'right'
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
        }}><a href='#overlay'>{overlay!==""? "close" : <img src="exp.png" alt="exp" />}</a></span>
    </div>
  </div>
}

function LineChart({symbol, lineMan, overlay, setOverlayState}){

  const [series, setSeries] = useState([{
    data: [{ x: '05/06/2014', y: 54 }, { x: '05/08/2014', y: 17 } , { x: '05/28/2014', y: 26 } , { x: '06/2/2014', y: 16 } , { x: '06/8/2014', y: 46 } , { x: '06/15/2014', y: 96 }]
  }]);

  useEffect(()=>{
    async function getForecast(){

      let timeData; 

      if(lineMan === "Hourly"){

        await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=no&alerts=no`)
        .then((res)=>res.json())
        .then((res=>{
          timeData = res.forecast.forecastday[0].hour.map((val)=>{return {x:val.time, y:val.temp_c}});
        }))
      } else {

        await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=7&aqi=no&alerts=no`)
        .then((res)=>res.json())
        .then((res=>{
          timeData= res.forecast.forecastday.map((val)=>{return {x:val.date, y:val.day.avgtemp_c}});
        }))
      }

      setSeries([{data: timeData}]);
    }

    getForecast();

  },[symbol, lineMan])


  const [options, setOptions] = useState({

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
      text: 'Temperature'
    }
  },
  xaxis: {
    type: 'datetime',
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
})


  return <div>
    <Chart options={options} series = {series} type="line" height={'400px'} width = {'700px'}/>
    <div className="exp-container">
      <span className='exp-button' onClick={()=>{
        if(overlay===""){setOverlayState(prev=>{prev.set("overlay","line"); return prev;})}
        else{setOverlayState(prev=>{prev.set("overlay",""); return prev;})}
        }}><a href='#overlay'>{overlay!==""? "close" : <img src="exp.png" alt="exp" />}</a></span>
    </div>
  </div>
}


function BarChart({symbol, barMan, overlay, setOverlayState}){


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

      await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=yes&alerts=no`)
      .then((res)=>res.json())
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
    }
    getForecast();
  },[symbol, barMan])

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',

      toolbar:{
        show:false
      },
    },

    plotOptions: {
      bar: {
        horizontal: true
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
  })
  
  return <div>
    <Chart options={options} series = {series} type="bar" height={'400px'} width={'400px'}/>
    <div className="exp-container">
      <span className='exp-button' onClick={()=>{
        if(overlay===""){setOverlayState(prev=>{prev.set("overlay","bar"); return prev;})}
        else{setOverlayState(prev=>{prev.set("overlay",""); return prev;})}
        }}><a href='#overlay'>{overlay!==""? "close" : <img src="exp.png" alt="exp" />}</a></span>
    </div>
  </div>
}


function Overview({symbol}){

  const [inf, setInf] = useState(["Vellore", "Tamil Nadu", "India", 12.93, 79.13, "", 22.3, ""]);
  const [map, setMap] = useState(null);

  useEffect(()=>{
    async function getCurrent(){

      await fetch(`http://api.weatherapi.com/v1/current.json?key=633efb86edba4c3182c115344240904&q=${symbol}&aqi=no`)
      .then((res)=>res.json())
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
      }))
    }

    getCurrent();
  },[symbol])

  const link = encodeURI(window.location.href);
  const msg = encodeURI(`Hey ! Checkout the climate analysis of ${symbol} at Weather Co. \n`)

  const fb_link = `https://www.facebook.com/share.php?u=${link}&text=${msg}`;
  const tw_link = `http://twitter.com/share?&url=${link}&text=${msg}`;
  const rd_link = `http://www.reddit.com/submit?url=${link}&title=${msg}`;
  const wa_link = `https://wa.me/?text=${msg}${link}`;



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

      <Socials fb = {fb_link} tw = {tw_link} rd = {rd_link} wa = {wa_link}/>

    </div>

    <div className="map">
      {map}
    </div>
  </div>
}

function Socials({fb, tw, rd, wa}){

  return <div className="soc">

    <a href={fb} className="facebook" target ="blank"><i className="fab fa-facebook"></i></a>
    <a href={tw} className="twitter" target ="blank"><i className="fab fa-twitter"></i></a>
    <a href={rd} className="reddit" target ="blank"><i className="fab fa-reddit"></i></a>
    <a href={wa} className="whatsapp" target ="blank"><div className="fab fa-whatsapp"></div></a>
  </div>
}



export default App;
