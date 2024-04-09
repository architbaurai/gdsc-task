import './style.css';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'

const KEY = "633efb86edba4c3182c115344240904";

function App() {
  return <div className="main">

    <Header/>

    <Content/>

    </div>
}


function Header(){

  return <header>
    <form action="submit">
      <input type="text" />
      <button>🔍</button>
    </form>

  </header>
}

function Content(){

  const [symbol, setSymbol] = useState("vellore");

  return <div className="main-container">
    
    <h1>{symbol}</h1>

    <div className="statistics">

      <StatContainer type = "pi">
        <PiChart symbol = {symbol}/>
      </StatContainer>

      <StatContainer type="info">
        <Overview symbol = {symbol}/>
      </StatContainer>

      <StatContainer type="line">
      <LineChart symbol = {symbol}/>
      </StatContainer>

      <StatContainer type="bar">
        <BarChart symbol = {symbol}/>
      </StatContainer>

    </div>

  </div>
}


function StatContainer({type, children}){

  return <div className = {`stat-container ${type}`} >

    <div className='secondary-header'>
      <span className='secondary-heading'>{`Pie chart`}</span>
      <Manipulator type={type}/>
    </div>

    <div className={`chart`}>
      {children}
    </div>
  
  </div>

}


function Manipulator({type}){

  let op1 = type === "line"? "Yearly" : "Ascending"

  let op2 = type === "line"? "Monthly" : "Descending";
  
  return(type !== "info")? <select name="" id="">
          <option value={op1}>{op1}</option>
          <option value={op2}>{op2}</option>
        </select> : null;
}

function PiChart({symbol}){

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


  const [options, setOptions]= useState({
      
      chart: {
        width: '100%',
        type: 'pie',
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
        show: false
      }
    })

  return <Chart options={options} series = {series} type="pie"/>
}

function LineChart({symbol}){

  const [series, setSeries] = useState([{
    data: [{ x: '05/06/2014', y: 54 }, { x: '05/08/2014', y: 17 } , { x: '05/28/2014', y: 26 } , { x: '06/2/2014', y: 16 } , { x: '06/8/2014', y: 46 } , { x: '06/15/2014', y: 96 }]
  }]);

  useEffect(()=>{
    async function getForecast(){
      await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=yes&alerts=no`)
      .then((res)=>res.json())
      .then((res=>{
        const temp = res.forecast.forecastday[0].hour.map((val)=>{return {x:val.time, y:val.temp_c}});
        setSeries([{data: temp}]);
      }))
    }
    getForecast();
  },[symbol])


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
  })


  return <Chart options={options} series = {series} type="line"/>
}


function BarChart({symbol}){


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
    }]
  }]);


  useEffect(()=>{
    async function getForecast(){
      await fetch(`http://api.weatherapi.com/v1/forecast.json?key=633efb86edba4c3182c115344240904&q=${symbol}&days=1&aqi=yes&alerts=no`)
      .then((res)=>res.json())
      .then((res=>{

        const uv = res.forecast.forecastday[0].hour.map((val)=>{return {x:val.time, y:val.uv}});
        
        setSeries([{data: uv}]);
        
      }))
    }
    getForecast();
  },[symbol])

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
    }})

  
  return <Chart options={options} series = {series} type="bar"/>
}


function Overview({symbol}){

  const [companyData, setCompanyData] = useState({
    companyName:"International Buisness Machines",
    companyDescription:"American multinational technology company headquartered in Armonk, New York and present in over 175 countries.[7][8] IBM is the largest industrial research organization in the world, with 19 research facilities across a dozen countries, having held the record for most annual U.S. patents generated by a business for 29 consecutive years from 1993 to 2021."
  });


  return <div>
    <span><strong>{companyData.companyName}</strong></span>
    <br/>
    <p>{companyData.companyDescription}</p>
  </div>
}



export default App;
