import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const ProductCard = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  const {productData} = props
  const {id, title, brand, imageUrl, rating, price} = productData

  return (
    <Link to={`/products/${id}`} className="products-card-link">
      <li className="product-item">
        <img src={imageUrl} alt="product" className="thumbnail" />
        <h1 className="title">{title}</h1>
        <p className="brand">by {brand}</p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </li>
    </Link>
  )
}
export default ProductCard
