/* @refresh reload */
import { render } from 'solid-js/web';

import { Route, Router, Routes } from '@solidjs/router';
import './index.scss';
import Basic from './routes/BasicForm';
import Home from './routes/Home';
import Hidden from './routes/hidden';

const root = document.getElementById('root');

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/basic" component={Basic} />
        <Route path="/hidden" component={Hidden} />
      </Routes>
    </Router>
  ),
  root!
);
