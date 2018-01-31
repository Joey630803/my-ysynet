import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers';
import PRoutes from './routes';
import thunk from 'redux-thunk';

const store = createStore(
  reducers,
  applyMiddleware(thunk)
); 



import './styles/App.css';
ReactDOM.render(
  <Provider store={store}>
    <PRoutes/>
  </Provider>  
  ,
  document.getElementById('root')
);