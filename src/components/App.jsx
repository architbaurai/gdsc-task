import '../style.css';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Content from './Content';


export default function App() {

  const [urlsymbol, setSymbol] = useSearchParams({symbol:"San Francisco"});

  const checkS = urlsymbol.get("symbol");

  const symbol = (checkS === null || checkS === "")? "San Francisco" : checkS;

  return <div className="main">

    <Header setSymbol = {setSymbol}/>
    <Content symbol = {symbol}/>

    </div>
}

