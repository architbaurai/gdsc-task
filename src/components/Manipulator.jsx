export default function Manipulator({type, setMan}){

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