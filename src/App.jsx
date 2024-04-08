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

      <StatContainer className="info">
        
      </StatContainer>

      <StatContainer className="line">
        
      </StatContainer>

      <StatContainer className="pi">
        
      </StatContainer>

      <StatContainer className="bar">
        
      </StatContainer>

    </div>

  </div>
}


function StatContainer({className, children}){

  return <div>

    <div>
      <span>{className}</span>
      <Manipulator className={className}/>
    </div>

    <div>
      {children}
    </div>
  
  </div>

}


function Manipulator({className}){

  let op1 = className === "line"? "Yearly" : "Ascending"

  let op2 = className === "line"? "Monthly" : "Descending";
  
  return(className !== "info")? <select name="" id="">
          <option value={op1}>{op1}</option>
          <option value={op2}>{op2}</option>
        </select> : null;
}

export default App;
