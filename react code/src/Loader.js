import './index.css';
const Loader = () => {
    return (<div style={{display:'grid',placeItems:'center'}}><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>);
}
export default Loader;