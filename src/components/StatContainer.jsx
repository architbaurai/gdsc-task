import Manipulator from './Manipulator';

export default function StatContainer({type, children, setMan}){

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