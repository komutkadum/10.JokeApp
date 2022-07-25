import { useId, useState } from "react";
import './index.css';
import Loader from "./Loader";
import joke from './joke.jpg';

function App() {
  const id = useId();
  // safemode
  const [safeMode, setSafeMode] = useState(true);
  // data
  const [categoryData,setCategoryData] = useState([]);
  const [typeData,setTypeData] = useState("");
  const [blacklistData,setBlacklistData] = useState([]);
  const [amountData,setAmountData] = useState(10);
  const [jokeData,setJokeData] = useState([]);
  // loading state
  const [loading,setLoading] = useState(0);
  // search options
  const category = ["Any","Misc","Programming","Dark","Pun","Spooky","Christmas"];
  const type = ["single","twopart"];
  const flagList = ["nsfw","religious","political","racist","sexist","explicit"];

  const filterJokesInput = (e,optionType) => {
    const {value,checked} = e.target;
    if(checked){
      switch(optionType){
        case "c":
          setCategoryData([...categoryData,value]);
          break;
        case "t":
          setTypeData(value);
          break;
        case "b":
          setBlacklistData([...blacklistData,value]);
          break;
        default:
      }
    }else {
      let temp = [];
      switch(optionType){
        case "c":
          temp = [...categoryData];
          temp = temp.filter((item)=>item!==value);
          setCategoryData([...temp])
          break;
        case "b":
          temp = [...blacklistData];
          temp = temp.filter((item)=>item!==value);
          setBlacklistData([...temp])
          break;
        default:
      }
    }
  }
  
  const handleSearchOption = () => {
    const finalUrl = `https://v2.jokeapi.dev/joke/${categoryData.length>0?categoryData.join(','):'Any'}?${typeData!==""?`type=${typeData}&`:''}${blacklistData.length>0?`blacklistFlags=${blacklistData.join(',')}&`:''}${safeMode?'safe-mode&':''}amount=${amountData}`;
    searchJokes(finalUrl)
  }
  const searchJokes = async(finalUrl) => {
    try{ 
      setLoading(1);
      const response = await fetch(finalUrl);
      const result = await response.json();
      if(result.jokes.length===undefined){
        console.log(result)
        setJokeData([result]);
        return;
      }
      setJokeData(result.jokes)
      setLoading(2);
    }catch(e){
      setLoading(0);
      console.log(e);
    }
  }

  const clearJokesArea = () => {
    setJokeData([]);
    setLoading(0)
  }

  return (
    <div className="overflow-hidden mb-4">

      <Header searchJokes={searchJokes}/>

      <div className="row">
          <div className="col-md-12 bg-dark pb-4 text-center">
            <button type="button" className="btn btn-secondary " data-toggle="modal" data-target="#exampleModalCenter">
              Launch Search Options &#x2771;
            </button>
            {/* modal */}
            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalCenterTitle">Search Options</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className={`p-2 bg-light w3-animate-zoom`}>
                      <div className="p-1">
                        <span className=" font-weight-bold mr-2">Joke Category : </span>
                        {
                          category.map((item,index)=>(
                            <div className="form-check form-check-inline" key={`${id}-${item}-${index}`}>
                              <input className="form-check-input" type="checkbox" id={`${id}-${item}-${index}`} onChange={(e)=>filterJokesInput(e,'c')} value={item} />
                              <label className="form-check-label" htmlFor={`${id}-${item}-${index}`}>{item}</label>
                            </div>
                          ))
                        }
                      </div>
                      <div className="p-1">
                        <span className=" font-weight-bold mr-2">Joke Type :  </span>
                        {
                          type.map((item,index)=>(
                            <div className="form-check form-check-inline" key={`${id}-${item}-${index}`}>
                              <input  className="form-check-input" type="radio" name="helloType" id={`${id}-${item}-${index}`} onChange={(e)=>filterJokesInput(e,'t')} value={item}/>
                              <label className="form-check-label" htmlFor={`${id}-${item}-${index}`}>{item}</label>
                            </div>
                          ))
                        }
                      </div>
                      <div className="p-1">
                        <span className=" font-weight-bold mr-2">BlackList :  </span>
                        {
                          flagList.map((item,index)=>(
                            <div className="form-check form-check-inline" key={`${id}-${item}-${index}`}>
                              <input  className="form-check-input" type="checkbox" id={`${id}-${item}-${index}`} onChange={(e)=>filterJokesInput(e,'b')} value={item}/>
                              <label className="form-check-label" htmlFor={`${id}-${item}-${index}`}>{item}</label>
                            </div>
                          ))
                        }
                      </div>
                      <div className="p-1 d-flex align-items-center">
                        <span className=" font-weight-bold mr-2">Amount : <span className="font-weight-normal">(max=10, min=1)</span> </span>
                        <div className="form-inline m-0">
                          <input type="number" min="1" max="10" value={amountData} onChange={(e)=>setAmountData(e.target.value)} className="form-control form-control-sm"/>
                        </div>
                      </div>
                      <div className="p-1 d-flex align-items-center">
                        <div className="font-weight-bold mr-2">Safemode : </div>
                        <div className="custom-control custom-switch ">
                          <input type="checkbox" className="custom-control-input" id="customSwitch1"  onChange={()=>setSafeMode(prev=>!prev)} checked={safeMode} value="safe-mode"/>
                          <label className="custom-control-label" htmlFor="customSwitch1">{safeMode?'On':'Off'}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={handleSearchOption}>Search &#x2771;</button>
                  </div>
                </div>
              </div>
            </div>
            {/* end of modal */}
            <button className="btn btn-danger ml-2" onClick={clearJokesArea}>Clear Jokes &#x2613;</button>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="container">
              <div className="row mt-2">
              {
                loading===1?
                <>
                <div className="col-md-12">
                  <Loader />
                </div>
                </>:loading===2?
                jokeData.map((item,index)=>(
                  item.type==='single'?
                  <SingleJokeWrapper key={`${id}-${item.type}-${index}`} joke={item.joke} category={item.category}/>:
                  <TwoPartJokeWrapper key={`${id}-${item.type}-${index}`} setup={item.setup} delivery={item.delivery} category={item.category}/>
                )):<><div className="col-md-3"></div>
                <div className="col-md-6 p-3 text-center">
                    <h4 className="font-weight-bold m-0 mb-2">Empty Jokes Area But</h4>
                    <img src={joke} className="img-fluid rounded" alt="joke"/>
                </div>
                </>
              }
              </div>
            </div>
          </div>
      </div>{/* end of row */}
    
    </div>
  );
}

const Header = ({searchJokes}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    let inputValue = e.target[0].value;
    const finalUrl = `https://v2.jokeapi.dev/joke/Any?contains=${inputValue}&amount=10`;
    searchJokes(finalUrl);
    e.target[0].value = "";
  }
  return (
    <header className="bg-dark p-4 text-white text-center font-weight-bold">
    <div className="row">
      <div className="col-md-3"></div>
      <div className="col-md-6">
        <h1>JOKE API</h1>
        <form className="d-flex" onSubmit={handleSubmit}>
          <input type="text" name="searchInput" placeholder="search jokes" autoFocus="true" className="form-control rounded-0" required/>
          <button type="submit" className="btn btn-secondary rounded-0">Search</button>
        </form>
      </div>
    </div>
  </header>
  );
}

const TwoPartJokeWrapper = ({setup,delivery}) => {
  return (<div className="col-md-4">
            <div className="card my-2 rounded-lg text-center">
              <div className="card-header bg-dark text-white">
                <h6>{setup}</h6>
              </div>
              <div className="card-footer">
                {delivery}
              </div>
            </div>
          </div>);
}

const SingleJokeWrapper = ({joke}) => {
  return (<div className="col-md-4">
  <div className="card my-2 rounded-lg text-center">
    <div className="card-header bg-dark text-white">
      <h6>{joke}</h6>
    </div>
    </div>
  </div>);
}

export default App;
