import './style.css';

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
        
      </StatContainer>

      <StatContainer type="info">
        
      </StatContainer>

      <StatContainer type="line">
        
      </StatContainer>

      <StatContainer type="bar">
        
      </StatContainer>

    </div>

  </div>
}


function StatContainer({type, children}){

  return <div className = {`stat-container ${type}`} >

    <div className='secondary-header'>
      <span className='secondary-heading'>{type}</span>
      <Manipulator type={type}/>
    </div>

    <div>
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

export default App;
