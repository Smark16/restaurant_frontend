import React from 'react'
import './compo.css'
import card_image from '../Images/profile.jpg'
import pizza from '../Images/OIP.jpg'
import one from '../Images/1st.jpg'
import two from '../Images/2nd.jpg'
import three from '../Images/3rd.jpg'
import four from '../Images/4th.jpg'
import pone from '../Images/p1.jpg'
import ptwo from '../Images/p2.jpg'
import pthree from '../Images/p3.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function Home() {
  return (
    <div className='fill-page bg-alert alert-secondary'>
      {/* FIRST ROW */}
      <div className="row">
        <div className="col-md-6 col-sm-12 fist">
          <p>Its not just food its an experience</p>

          <div className="btns">
          <button className='bg-info text-white text-center p-2'>View Menu</button>
          <button className='bg-orange text-black text-center p-2'>Book Table</button>
          </div>
        </div>

        <div className="col-md-6 col-sm-12 first-image">
           <img src={pizza}></img>
           <p><span>5%</span><h6>Discount for 2 orders</h6></p>
        </div>
      </div>

      <h5>POPULAR DISHES</h5>
      {/* SECOND ROW */}
      <div className="flex-div">
          {/* cards */}
        <div className="dishes">
         <div className="card">
          <div className="img text-center">
          <img src={one} alt='wait'></img>
          </div>
          <div className="words text-center">
            <p>Tomato salad</p>
            <span>Vegetable</span>
            <h6>UGX 3000</h6>
          </div>
         </div>
        </div>

        <div className="dishes">
         <div className="card">
          <div className="img text-center">
          <img src={two} alt='wait'></img>
          </div>
          <div className="words text-center">
            <p>Tomato salad</p>
            <span>Vegetable</span>
            <h6>UGX 3000</h6>
          </div>
         </div>
        </div>

        <div className="dishes">
         <div className="card">
          <div className="img text-center">
          <img src={three} alt='wait'></img>
          </div>
          <div className="words text-center">
            <p>Tomato salad</p>
            <span>Vegetable</span>
            <h6>UGX 3000</h6>
          </div>
         </div>
        </div>

        <div className="dishes">
         <div className="card">
          <div className="img text-center">
          <img src={four} alt='wait'></img>
          </div>
          <div className="words text-center">
            <p>Tomato salad</p>
            <span>Vegetable</span>
            <h6>UGX 3000</h6>
          </div>
         </div>
        </div>
      </div>

      {/* row three */}
      <div className="row mt-3 p-2 rd-row">
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src={pone} alt="..." />
    </div>
    <div className="carousel-item">
      <img src={ptwo} alt="..." />
    </div>
    <div className="carousel-item">
      <img src={pthree} alt="..." />
    </div>
  </div>
  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#carouselExampleAutoplaying"
    data-bs-slide="prev"
  >
    <span className="carousel-control-prev-icon" aria-hidden="true" />
    <span className="visually-hidden">Previous</span>
  </button>
  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#carouselExampleAutoplaying"
    data-bs-slide="next"
  >
    <span className="carousel-control-next-icon" aria-hidden="true" />
    <span className="visually-hidden">Next</span>
  </button>
</div>

{/* text */}
        <div className="col-md-6 col-sm-12">
          <span>WE PROVIDE HEALTHY FOOD SERVICE WITH BEAUTIFUL ENVIRONMENT</span>
          <p className='mt-3'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam consectetur totam ratione corporis aut praesentium deserunt atque non culpa consequatur vero magnam tempore eaque cumque repudiandae molestiae, explicabo a autem sed corrupti et earum? Numquam accusantium magni aliquid delectus enim recusandae. Animi beatae, quasi aspernatur enim quaerat corporis accusamus non pariatur labore possimus reiciendis, voluptatum dolorum voluptas sapiente ipsum quos!</p>
        </div>
      </div>

      {/* footer */}
      <div className="footer-div">
        <footer>
          <div className="row footer">

            <div className="col-md-3 col-sm-12 company">
              <h4>COMPANY DETAILS</h4>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima debitis perspiciatis necessitatibus reiciendis cupiditate impedit consequuntur tempore, ipsam facilis totam.</p>
            </div>

            <div className="col-md-3 col-sm-12 Categories">
              <h4>CATEGORIES</h4>
            <ul>
              <li>
                <span>BreakFast</span>
              </li>

              <li>
                <span>Lunch</span>
              </li>

              <li>
                <span>Dinner</span>
              </li>

              <li>
                <span>Supper</span>
              </li>
            </ul>
            </div>

<div className="col-md-3 col-sm-12 useful">
  <h4>USEFUL LINS</h4>
  <ul>
    <li>
      Your Account
    </li>

    <li>
      Become an Affiliate
    </li>

    <li>
      Shipping Rates
    </li>

    <li>
      Help
    </li>
  </ul>
</div>
<div className="col-md-3 col-sm-12 contact">
  <h4>CONTACT</h4>
  <ul>
    <li>
 
    <i class="bi bi-telephone-fill"></i>
      <span>+256 759079867</span>
    </li>

    <li>
    <i class="bi bi-house-door-fill"></i>
      <span>UCU, Mukono</span>
    </li>

    <li>
    <i class="bi bi-envelope"></i>
      <span>sengendomark16@gmail.com</span>
    </li>
  </ul>
</div>
          </div>

          <hr></hr>

          <div className="row moreinfo">
            <div className="col-md-6 col-sm-12 right">
              <span> © 2024 copyright: smark Products</span>
            </div>

            <div className="col-md-6 col-sm-12 socials">
            <i class="bi bi-facebook"></i>
            <i class="bi bi-twitter-x"></i>
            <i class="bi bi-google"></i>
            <i class="bi bi-instagram"></i>
            </div>
          </div>
        </footer>

      </div>

    </div>
  )
}

export default Home
