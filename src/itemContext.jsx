import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuDisplay from './path-to-your-components/MenuDisplay';
import Bar from './path-to-your-components/Bar';

function App() {
  const [addItem, setAddItem] = useState([]);

  const handleCart = (id) => {
    // Implement your logic to handle the cart items here
    // This function will be passed down to MenuDisplay and Bar
    const selected = food.filter((selectedItem) => selectedItem.id === id);
    setAddItem([...addItem, selected]);
  };

  return (
    <Router>
      <Switch>
        <Route path="/customer/dashboard">
          {/* Pass handleCart and addItem as props to MenuDisplay */}
          <MenuDisplay handleCart={handleCart} addItem={addItem} />
        </Route>
        <Route path="/">
          {/* Pass addItem as a prop to Bar */}
          <Bar addItem={addItem} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;