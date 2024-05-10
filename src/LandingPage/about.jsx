import React, { useEffect } from 'react';
import './css/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './lib/animate/animate.min.css'; // Import animate.css
import './lib/owlcarousel/assets/owl.carousel.min.css'; // Import Owl Carousel CSS
import './lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css';
import WOW from 'wow.js';
import hero from './img/hero.png'
import about1 from './img/about-1.jpg'
import about2 from './img/about-2.jpg'
import about3 from './img/about-3.jpg'
import about4 from './img/about-4.jpg'
import menu1 from './img/menu-1.jpg'
import menu2 from './img/menu-2.jpg'
import menu3 from './img/menu-3.jpg'
import menu4 from './img/menu-4.jpg'
import menu5 from './img/menu-5.jpg'
import menu6 from './img/menu-6.jpg'
import menu7 from './img/menu-7.jpg'
import menu8 from './img/menu-8.jpg'
import team1 from './img/team-1.jpg'
import team2 from './img/team-2.jpg'
import team3 from './img/team-3.jpg'
import team4 from './img/team-4.jpg'
import testimonial1 from './img/testimonial-1.jpg'
import testimonial2 from './img/testimonial-2.jpg'
import testimonial3 from './img/testimonial-3.jpg'
import testimonial4 from './img/testimonial-4.jpg'
import { Link } from 'react-router-dom';

function About() {
    useEffect(() => {
        // Spinner
        const spinner = () => {
          setTimeout(() => {
            const spinnerElement = document.getElementById('spinner');
            if (spinnerElement) {
              spinnerElement.classList.remove('show');
            }
          }, 1);
        };
        spinner();
    
        // Initiate the wowjs
        new WOW().init(); // Initialize wow.js
    
        // Sticky Navbar
        const handleScroll = () => {
          const navbar = document.querySelector('.navbar');
          if (navbar && window.scrollY > 45) {
            navbar.classList.add('sticky-top', 'shadow-sm');
          } else {
            navbar.classList.remove('sticky-top', 'shadow-sm');
          }
        };
        window.addEventListener('scroll', handleScroll);
    
        // Dropdown on mouse hover
        const handleDropdownHover = () => {
          const dropdowns = document.querySelectorAll('.dropdown');
          dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
              dropdown.classList.add('show');
              dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'true');
              dropdown.querySelector('.dropdown-menu').classList.add('show');
            });
            dropdown.addEventListener('mouseleave', () => {
              dropdown.classList.remove('show');
              dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
              dropdown.querySelector('.dropdown-menu').classList.remove('show');
            });
          });
        };
        window.addEventListener('load', handleDropdownHover);
        window.addEventListener('resize', handleDropdownHover);
    
        // Back to top button
        const handleBackToTop = () => {
          const backToTop = document.querySelector('.back-to-top');
          if (backToTop && window.scrollY > 300) {
            backToTop.style.display = 'block';
          } else {
            backToTop.style.display = 'none';
          }
        };
        window.addEventListener('scroll', handleBackToTop);
    
        // Clean up event listeners
        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('load', handleDropdownHover);
          window.removeEventListener('resize', handleDropdownHover);
          window.removeEventListener('scroll', handleBackToTop);
        };
      }, [])
  return (
   <>
   <div className="container-xxl bg-white p-0">
  {/* Spinner Start */}
  <div
    id="spinner"
    className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
  >
    <div
      className="spinner-border text-primary"
      style={{ width: "3rem", height: "3rem" }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
  {/* Spinner End */}
  {/* Navbar & Hero Start */}
  <div className="container-xxl position-relative p-0">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
      <a href="" className="navbar-brand p-0">
        <h1 className="text-primary m-0">
          <i className="fa fa-utensils me-3" />
          Restoran
        </h1>
        {/* <img src="img/logo.png" alt="Logo"> */}
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="fa fa-bars" />
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto py-0 pe-4">
          <Link to='/index' className="nav-item nav-link">
            Home
          </Link>
          <Link to='/about' className="nav-item nav-link active">
            About
          </Link>
          <Link to='/service' className="nav-item nav-link">
            Service
          </Link>
          <Link to='/menus' className="nav-item nav-link">
            Menu
          </Link>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              Pages
            </a>
            <div className="dropdown-menu m-0">
              <Link to='/booking' className="dropdown-item">
                Booking
              </Link>
              <Link to='/team' className="dropdown-item">
                Our Team
              </Link>
              <Link to='/testimonial' className="dropdown-item">
                Testimonial
              </Link>
            </div>
          </div>
          <Link to='/contact' className="nav-item nav-link">
            Contact
          </Link>
        </div>
        <Link to='/login' className="btn btn-primary py-2 px-4">
          Book A Table
        </Link>
      </div>
    </nav>
    <div className="container-xxl py-5 bg-dark hero-header mb-5">
      <div className="container text-center my-5 pt-5 pb-4">
        <h1 className="display-3 text-white mb-3 animated slideInDown">
          About Us
        </h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb justify-content-center text-uppercase">
            <li className="breadcrumb-item">
              <Link to='/index'>Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to='#'>Pages</Link>
            </li>
            <li
              className="breadcrumb-item text-white active"
              aria-current="page"
            >
              About
            </li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
  {/* Navbar & Hero End */}
  {/* About Start */}
  <div className="container-xxl py-5">
    <div className="container">
      <div className="row g-5 align-items-center">
        <div className="col-lg-6">
          <div className="row g-3">
            <div className="col-6 text-start">
              <img
                className="img-fluid rounded w-100 wow zoomIn"
                data-wow-delay="0.1s"
                src={about1}
              />
            </div>
            <div className="col-6 text-start">
              <img
                className="img-fluid rounded w-75 wow zoomIn"
                data-wow-delay="0.3s"
                src={about2}
                style={{ marginTop: "25%" }}
              />
            </div>
            <div className="col-6 text-end">
              <img
                className="img-fluid rounded w-75 wow zoomIn"
                data-wow-delay="0.5s"
                src={about3}
              />
            </div>
            <div className="col-6 text-end">
              <img
                className="img-fluid rounded w-100 wow zoomIn"
                data-wow-delay="0.7s"
                src={about4}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <h5 className="section-title ff-secondary text-start text-primary fw-normal">
            About Us
          </h5>
          <h1 className="mb-4">
            Welcome to <i className="fa fa-utensils text-primary me-2" />
            Restoran
          </h1>
          <p className="mb-4">
            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu
            diam amet diam et eos erat ipsum et lorem et sit, sed stet lorem
            sit.
          </p>
          <p className="mb-4">
            Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu
            diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet
            lorem sit clita duo justo magna dolore erat amet
          </p>
          <div className="row g-4 mb-4">
            <div className="col-sm-6">
              <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                <h1
                  className="flex-shrink-0 display-5 text-primary mb-0"
                  data-toggle="counter-up"
                >
                  15
                </h1>
                <div className="ps-4">
                  <p className="mb-0">Years of</p>
                  <h6 className="text-uppercase mb-0">Experience</h6>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                <h1
                  className="flex-shrink-0 display-5 text-primary mb-0"
                  data-toggle="counter-up"
                >
                  50
                </h1>
                <div className="ps-4">
                  <p className="mb-0">Popular</p>
                  <h6 className="text-uppercase mb-0">Master Chefs</h6>
                </div>
              </div>
            </div>
          </div>
          <a className="btn btn-primary py-3 px-5 mt-2" href="">
            Read More
          </a>
        </div>
      </div>
    </div>
  </div>
  {/* About End */}
  {/* Team Start */}
  <div className="container-xxl pt-5 pb-3">
    <div className="container">
      <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
        <h5 className="section-title ff-secondary text-center text-primary fw-normal">
          Team Members
        </h5>
        <h1 className="mb-5">Our Master Chefs</h1>
      </div>
      <div className="row g-4">
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
          <div className="team-item text-center rounded overflow-hidden">
            <div className="rounded-circle overflow-hidden m-4">
              <img className="img-fluid" src={team1} alt="" />
            </div>
            <h5 className="mb-0">Full Name</h5>
            <small>Designation</small>
            <div className="d-flex justify-content-center mt-3">
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-facebook-f" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-twitter" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
          <div className="team-item text-center rounded overflow-hidden">
            <div className="rounded-circle overflow-hidden m-4">
              <img className="img-fluid" src={team2} alt="" />
            </div>
            <h5 className="mb-0">Full Name</h5>
            <small>Designation</small>
            <div className="d-flex justify-content-center mt-3">
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-facebook-f" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-twitter" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
          <div className="team-item text-center rounded overflow-hidden">
            <div className="rounded-circle overflow-hidden m-4">
              <img className="img-fluid" src={team3} alt="" />
            </div>
            <h5 className="mb-0">Full Name</h5>
            <small>Designation</small>
            <div className="d-flex justify-content-center mt-3">
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-facebook-f" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-twitter" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
          <div className="team-item text-center rounded overflow-hidden">
            <div className="rounded-circle overflow-hidden m-4">
              <img className="img-fluid" src={team4} alt="" />
            </div>
            <h5 className="mb-0">Full Name</h5>
            <small>Designation</small>
            <div className="d-flex justify-content-center mt-3">
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-facebook-f" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-twitter" />
              </a>
              <a className="btn btn-square btn-primary mx-1" href="">
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Team End */}
  {/* Footer Start */}
  <div
    className="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn"
    data-wow-delay="0.1s"
  >
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-3 col-md-6">
          <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
            Company
          </h4>
          <a className="btn btn-link" href="">
            About Us
          </a>
          <a className="btn btn-link" href="">
            Contact Us
          </a>
          <a className="btn btn-link" href="">
            Reservation
          </a>
          <a className="btn btn-link" href="">
            Privacy Policy
          </a>
          <a className="btn btn-link" href="">
            Terms &amp; Condition
          </a>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
            Contact
          </h4>
          <p className="mb-2">
            <i className="fa fa-map-marker-alt me-3" />
            Mukono, UCU 
          </p>
          <p className="mb-2">
            <i className="fa fa-phone-alt me-3" />
            +256 759079867
          </p>
          <p className="mb-2">
            <i className="fa fa-envelope me-3" />
            sengendomark16@gmail.com
          </p>
          <div className="d-flex pt-2">
            <a className="btn btn-outline-light btn-social" href="">
              <i className="fab fa-twitter" />
            </a>
            <a className="btn btn-outline-light btn-social" href="">
              <i className="fab fa-facebook-f" />
            </a>
            <a className="btn btn-outline-light btn-social" href="">
              <i className="fab fa-youtube" />
            </a>
            <a className="btn btn-outline-light btn-social" href="">
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
            Opening
          </h4>
          <h5 className="text-light fw-normal">Monday - Saturday</h5>
          <p>09AM - 09PM</p>
          <h5 className="text-light fw-normal">Sunday</h5>
          <p>10AM - 08PM</p>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">
            Newsletter
          </h4>
          <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
          <div className="position-relative mx-auto" style={{ maxWidth: 400 }}>
            <input
              className="form-control border-primary w-100 py-3 ps-4 pe-5"
              type="text"
              placeholder="Your email"
            />
            <button
              type="button"
              className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
            >
              SignUp
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="copyright">
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            ©{" "}
            <a className="border-bottom" href="#">
              Your Site Name
            </a>
            , All Right Reserved.
            {/*/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. *** /*/}
            Designed By{" "}
            <a className="border-bottom" href="#">
              Smark Products
            </a>
            <br />
            <br />
            Distributed By{" "}
            <a
              className="border-bottom"
              href="https://themewagon.com"
              target="_blank"
            >
              Smark Products
            </a>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="footer-menu">
              <a href="">Home</a>
              <a href="">Cookies</a>
              <a href="">Help</a>
              <a href="">FQAs</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Footer End */}
  {/* Back to Top */}
  <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
    <i className="bi bi-arrow-up" />
  </a>
</div>

   </>
  )
}

export default About
