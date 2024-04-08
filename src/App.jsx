import './style.css';
import { useState } from 'react';
import Chart from 'react-apexcharts'

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

  return <div className="main-container">
    
    <h1>Corp. Name</h1>

    <div className="statistics">

      <StatContainer type = "pi">
        <PiChart/>
      </StatContainer>

      <StatContainer type="info">

      </StatContainer>

      <StatContainer type="line">
      <LineChart/>
      </StatContainer>

      <StatContainer type="bar">
        <BarChart/>
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

    <div className='chart'>
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

function PiChart(){

  const [options, setOptions] = useState({
      
      chart: {
        width: '100%',
        type: 'pie',
        fontFamily:'Open Sans',
      },
      
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      
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
    }
  )

  const [series, setSeries] = useState([25, 15, 44, 55, 41, 17])

  return <Chart options={options} series={series} type="pie"/>
}

function LineChart(){

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
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    },
  },
  yaxis: {
    title: {
      text: 'Price'
    }
  },
  xaxis: {
    type: 'datetime',
  },
  })

  const [series, setSeries] = useState([{
    data: [{ x: '05/06/2014', y: 54 }, { x: '05/08/2014', y: 17 } , { x: '05/28/2014', y: 26 } , { x: '06/2/2014', y: 16 } , { x: '06/8/2014', y: 46 } , { x: '06/15/2014', y: 96 }]
  }]);

  return <Chart options={options} series = {series} type="line"/>
}


function BarChart(){

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

  return <Chart options={options} series = {series} type="bar"/>
}



export default App;
