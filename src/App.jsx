
import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import { AuthProvider} from './Context/AuthContext';

import Show from './show';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Show/>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;

