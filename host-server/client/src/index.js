import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import adapter from 'webrtc-adapter';

//Components
import MainPage from './components/main_page';

const App = () =>{
  if((adapter.browserDetails.browser==='chrome' && (adapter.browserDetails.version > 50 || adapter.browserDetails.version===null))
  || adapter.browserDetails.browser==='safari'){
      return (<React.Fragment>
        <MainPage/>
      </React.Fragment>)
    }else{
      return(<div>
        <p>Please use Chrome!</p>
      </div>)
    }
}

ReactDOM.render(
  <App/>,document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();