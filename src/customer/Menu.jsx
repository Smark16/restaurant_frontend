import React, { useState, useEffect, useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cust.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const foodUrl = 'http://127.0.0.1:8000/restaurant/food_items';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function MenuDisplay() {
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredFood, setFilteredFood] = useState([]);
  const { handleCart } = useContext(AuthContext);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const response = await axios(foodUrl);
      const data = response.data;
      setFood(data);
      setFilteredFood(data); // Initialize filteredFood with the full food list
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filteredItems = food.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredFood(filteredItems); // Update filteredFood instead of food
  };

  useEffect(() => {
    fetchFood();
  }, []);

  const renderStars = (avg_rating) => {
    const stars = [];
    const roundedRating = Math.round(avg_rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star-fill ${i <= roundedRating ? 'rankedstar' : ''}`}
        ></i>
      );
    }
    return stars;
  };

  return (
    <>
      {loading ? (
        <span className="menuloader"></span>
      ) : (
        <>
          <div className="menubar bg-success mt-0 p-3 d-flex text-white">
            <h2>Menu</h2>
            <Search className="ms-auto">
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearch}
              />
            </Search>
          </div>

          <h4 className="mt-3">Total Items ({filteredFood.length})</h4>
          <div className="row">
            {filteredFood.map((items) => {
              const { id, descriptions, price, image, name, avg_rating } = items;
              return (
                <div className="col-md-3 col-sm-6 mt-3 menu" key={id}>
                  <div className="card" style={{ width: '16rem', height: '25rem' }}>
                    <img src={image} className="img" alt={name} />
                    <div className="card-body">
                      <div className="price d-flex">
                        <h4>{name}</h4>
                        <span className="ms-auto">UGX.{price}</span>
                      </div>
                      <p className="card-text">{descriptions}</p>

                      <div className="star d-flex">
                        <div className="i">{renderStars(avg_rating)}</div>
                        <span>{avg_rating.toFixed(1)}/5</span>
                      </div>
                      <div className="btns d-flex">
                        <Link to={`/customer/dashboard/item/${id}`}>
                          <button className="text-center text-primary">View More</button>
                        </Link>
                        <button
                          className="text-center text-white bg-danger"
                          onClick={() => handleCart(items)}
                        >
                          Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default MenuDisplay;
