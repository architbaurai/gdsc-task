import './style.css';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { ReactBingmaps } from 'react-bingmaps';

function App() {

  const [symbol, setSymbol] = useState("Vellore");

  return <div className="main">

    <Header symbol = {symbol} setSymbol = {setSymbol}/>

    <Content symbol = {symbol}/>

    </div>
}


function Header({symbol, setSymbol}){

  const [temp, setTemp] = useState("");

  return <header>
    <form action="submit">
      <input type="text" onChange={(e)=>{setTemp((s)=>e.target.value)}}/>
      <button onClick={(e)=>{e.preventDefault(); setSymbol(temp)}}>Search</button>
    </form>

  </header>
}

function Content({symbol}){

  const[piMan, setPiMan] = useState("pie");
  const[lineMan, setLineMan] = useState("Hourly");
  const[barMan, setBarMan] = useState("Time-wise");

  return <div className="main-container">
    
    {/* <h1>{symbol}</h1> */}

    <div className="statistics">

      <StatContainer type="info">
          <Overview symbol = {symbol}/>
      </StatContainer>

      <StatContainer type = "pi" setMan={setPiMan}>
        <PiChart symbol = {symbol} piMan={piMan}/>
      </StatContainer>

      <StatContainer type="line" setMan={setLineMan}>
      <LineChart symbol = {symbol} lineMan = {lineMan}/>
      </StatContainer>

      <StatContainer type="bar" setMan={setBarMan}>
        <BarChart symbol = {symbol} barMan = {barMan}/>
      </StatContainer>

    </div>

  </div>
}


function StatContainer({type, children, setMan}){

  return <div className = {`stat-container ${type}`} >

    <div className='secondary-header'>
      <span className='secondary-heading'>{`Pie chart`}</span>
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

function PiChart({symbol, piMan}){

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

  return <Chart options={options} series = {series} type={piMan} height={'400px'} width = {'400px'}/>
}

function LineChart({symbol, lineMan}){

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


  return <Chart options={options} series = {series} type="line" height={'400px'} width = {'700px'}/>
}


function BarChart({symbol, barMan}){


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

  
  return <Chart options={options} series = {series} type="bar" height={'400px'} width={'400px'}/>
}


function Overview({symbol}){

  const [inf, setInf] = useState(["Vellore", "Tamil Nadu", "India", 12.93, 79.13, "", 22.3, ""]);

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
      })
    }

    getCurrent();
  },[symbol, inf])

  return <div className='info-card'>
    <div className="weather-info">

      <div>
      <p><strong>{inf[0]},</strong></p>
      <p><strong>{inf[1]}, {inf[2]}</strong></p>
      <div className="temperature">
      <img src={inf[5]} alt="" />
      <div>
        <p>{inf[6]}°C</p>
        <p>{inf[7]}</p>
      </div>
      </div>
      </div>

      <div className="date">
        
      </div>

      <div className="soc">

        <a href="none" className="facebook" target ="blank"><i className="fab fa-facebook"></i></a>
        <a href="none" className="twitter" target ="blank"><i className="fab fa-twitter"></i></a>
        <a href="none" className="reddit" target ="blank"><i className="fab fa-reddit"></i></a>
        <a href="none" className="whatsapp" target ="blank"><div className="fab fa-whatsapp"></div></a>
      </div>
    </div>

    <div className="map">
      <ReactBingmaps 
        bingmapKey = "AnNq5ZsNTOez4ZTeBDa-N3yrvAgAszEv8XTFP9dVvsm-hm7ykBgVffLZAxVjs1t5" 
        center = {[inf[3], inf[4]]}
        pushPins = {
          [
            {
              "location":[inf[3], inf[4]], "option":{ color: '#2F80ED' }
            }
          ]
        }
      > 
      </ReactBingmaps>
    </div>
  </div>
}



export default App;
