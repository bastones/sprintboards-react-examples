import React from 'react';
import Echo from 'laravel-echo';
import '../css/App.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { library as FontAwesomeLibrary } from '@fortawesome/fontawesome-svg-core';
import { fas as FontAwesomeSolid } from '@fortawesome/free-solid-svg-icons';
import { far as FontAwesomeRegular } from '@fortawesome/free-regular-svg-icons';
import { fab as FontAwesomeBrands } from '@fortawesome/free-brands-svg-icons';

import Pages from './Pages';

window.io = require('socket.io-client');

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: process.env.REACT_APP_SOCKET_IO_URL,
});

require('popper.js');
require('bootstrap');

FontAwesomeLibrary.add(FontAwesomeSolid);
FontAwesomeLibrary.add(FontAwesomeRegular);
FontAwesomeLibrary.add(FontAwesomeBrands);

window.toastr = require('toastr');
window.toastr.options.timeOut = 3000;
window.toastr.options.escapeHtml = true;
window.toastr.options.positionClass = 'toast-bottom-right';

window.Enums = {
  CARD_SORT_ORDER_TYPE: {
    CHRONOLOGICAL: 'Chronological',
    MOST_VOTES: 'Most Votes',
  },
};

export default () => (
  <Router>
    <Pages />
  </Router>
);
