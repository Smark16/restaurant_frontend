import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import './cust.css';

const rates = 'http://127.0.0.1:8000/restaurant/rates';
const postReview = 'http://127.0.0.1:8000/restaurant/post_review';

function SingleMenu() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [userReview, setUserReview] = useState('');
  const singleUrl = `http://127.0.0.1:8000/restaurant/food_items/${id}`;
  const productReview = `http://127.0.0.1:8000/restaurant/product_review/${id}`;
  const url = `http://127.0.0.1:8000/restaurant/profile/${user.user_id}`;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { handleCart } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [myreview, setMyReview] = useState({ review: '' });
  const [ProductReview, setProductReview] = useState([]);
  const [category, setCategory] = useState(false);
  const [reduce, setReduce] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios(singleUrl);
      const data = response.data;
      setItem(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const profileData = async () => {
    try {
      const response = await axios(url);
      const data = response.data;
      setUserReview(data);
    } catch (err) {
      console.log(err);
    }
  };

  const popForm = () => {
    setVisible(true);
  };

  const removeForm = () => {
    setVisible(false);
    // setReduce(true);
  };

  useEffect(() => {
    fetchData();
    profileData();
  }, []);

  useEffect(() => {
    const handleStarClick = (star) => {
      let children = star.parentElement.children;
      for (let child of children) {
        if (child.getAttribute('data-clicked')) {
          return false;
        }
      }
      star.setAttribute('data-clicked', true);
      let rating = parseInt(star.dataset.star);
      let product = parseInt(star.parentElement.dataset.key);
      let data = {
        product: product,
        value: rating,
      };
      console.log(data);
      axios
        .post(rates, data)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => console.log(err.response));
      let ratings = JSON.parse(localStorage.getItem('rating')) || [];
      ratings.push(data);
      localStorage.setItem('rating', JSON.stringify(ratings));
    };

    let stars = document.querySelectorAll('.stars i');

    for (let star of stars) {
      star.addEventListener('click', () => {
        handleStarClick(star);
      });
    }
  }, [item]);

  const fetchReview = async () => {
    try {
      const response = await axios(productReview);
      const data = response.data;
      console.log(data);
      setProductReview(data);
    } catch (err) {
      console.log('Not found');
    }
  };

  const toggleReviews = () => {
    setCategory(!category);
    setReduce(true);
  };

  const Remove = () => {
    setReduce(false);
    setCategory(!category);
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyReview({ ...myreview, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user', user.user_id);
    formData.append('review', myreview.review);
    formData.append('product', item.id);
    if (userReview.image && typeof userReview.image === 'string') {
      try {
        const imageResponse = await axios.get(userReview.image, { responseType: 'blob' });
        const imageBlob = new Blob([imageResponse.data], { type: imageResponse.headers['content-type'] });
        const imageFile = new File([imageBlob], 'image.jpg');
        formData.append('image', imageFile);
        setVisible(false);

        axios
          .post(postReview, formData)
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log('There is a server error', err);
          });
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  return (
    <>
      {loading && (
        <div>
          <span className="loader"></span>
        </div>
      )}
      {item && (
        <div className="row" key={id}>
          <div className="col-md-6 col-sm-12">
            <div className="card image">
              <img src={item.image} alt={item.name} />
            </div>
          </div>

          <div className="col-md-6 col-sm-12 single-info">
            <h4 className="alert alert-secondary text-center">{item.name}</h4>
            <h4>Average Rating: {item.avg_rating}</h4>

            <h6>Description</h6>
            <p>{item.descriptions}</p>

            <h5>shs. {item.price}</h5>

            <h4 className="bg-primary text-white text-center p-2">Rate Product</h4>
            <div className="ratting d-flexs">
              <div className="stars d-flex text-center" data-key={`${item.id}`}>
                <i data-star="5" className="bi bi-star-fill"></i>
                <i data-star="4" className="bi bi-star-fill"></i>
                <i data-star="3" className="bi bi-star-fill"></i>
                <i data-star="2" className="bi bi-star-fill"></i>
                <i data-star="1" className="bi bi-star-fill"></i>
              </div>
            </div>

            <h4 className="text-primary">Reviews</h4>
            <div className="reviews">
              {ProductReview.slice(0, 3).map((view) => {
                const { id, review, image } = view;
                return (
                  <div key={id} className="review d-flex">
                    <img src={image} alt="" className="imageReview" />
                    <p className="textReview alert alert-secondary">{review}</p>
                  </div>
                );
              })}

              {visible && (
                <form onSubmit={handleSubmit} className="reviewForm">
                  <div className="mb-3">
                    <div className="d-flex ot">
                      <label htmlFor="formGroupExampleInput" className="form-label">
                        User Review
                      </label>

                      <button className="bg-danger text-white text-center" onClick={removeForm}>
                        x
                      </button>
                    </div>

                    <textarea
                      className="form-control"
                      id="formGroupExampleInput"
                      placeholder="Add Review"
                      name="review"
                      value={myreview.review}
                      onChange={handleChange}
                    />
                  </div>

                  <button className="bg-primary text-center text-white">submit</button>
                </form>
              )}
            </div>

            {!category && (
              <div className="reviewbtn">
                <Link>
                  <span onClick={toggleReviews}>View all reviews({ProductReview.length - 5})</span>
                </Link>
                <button className="bg-primary text-white text-center" onClick={popForm}>
                  Add Review
                </button>
              </div>
            )}

            {reduce && (
              <>
                {ProductReview.slice(4, ProductReview.length).map((cat) => {
                  const { id, image, review } = cat;
                  return (
                    <div key={id} className="review d-flex">
                      <img src={image} alt="" className="imageReview" />
                      <p className="textReview alert alert-secondary">{review}</p>
                    </div>
                  );
                })}
              </>
            )}
            {reduce && (
              <>
                <div className="mt-3">
                  <span className="bg-primary text-white p-2 mini" onClick={Remove}>
                    minimize
                  </span>
                </div>
              </>
            )}

            <div className="d-flex">
              <Link to="/customer/dashboard/customermenuDisplay">
                <button className="text-center p-2 mt-4">Back To Menu</button>
              </Link>
              <button className="bg-danger text-white text-center single-cart" onClick={() => handleCart(item)}>
                Add Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleMenu;
