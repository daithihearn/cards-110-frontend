import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Nav from './Nav';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <div>
        <Nav />
      </div>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
