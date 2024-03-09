import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const statusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsData: {},
    similarProductsList: [],
    quantity: 1,
    status: statusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemData()
  }

  getProductItemData = async () => {
    this.setState({status: statusConstants.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const similarProductsData = data.similar_products
      const similarProducts = similarProductsData.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        title: eachItem.title,
        style: eachItem.style,
        price: eachItem.price,
        description: eachItem.description,
        brand: eachItem.brand,
        totalReviews: eachItem.total_reviews,
        rating: eachItem.rating,
        availability: eachItem.availability,
      }))

      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      this.setState({
        productsData: updatedData,
        similarProductsList: similarProducts,
        status: statusConstants.success,
      })
    } else {
      this.setState({status: statusConstants.failure})
    }
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderAllProductItems = () => {
    const {status} = this.state
    switch (status) {
      case statusConstants.success:
        return this.renderProductsItems()
      case statusConstants.failure:
        return this.renderFailureView()
      case statusConstants.in_progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderProductsItems = () => {
    const {productsData, similarProductsList, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productsData
    return (
      <>
        <div className="product-item-container">
          <img src={imageUrl} className="product-item-img" alt="product" />
          <div>
            <h1 className="product-item-title">{title}</h1>
            <p className="product-item-price">Rs {price}/-</p>
            <div className="product-item-product-details">
              <div className="product-item-rating-container">
                <p className="product-item-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="product-item-star"
                />
              </div>
              <p className="product-item-total-reviews">
                {totalReviews} Reviews
              </p>
            </div>
            <p className="product-item-description">{description}</p>
            <div className="label-value-container">
              <p className="product-item-heading">Available:</p>
              <p className="product-item-text">{availability}</p>
            </div>
            <div className="label-value-container">
              <p className="product-item-heading">Brand:</p>
              <p className="product-item-text">{brand}</p>
            </div>
            <hr />
            <div className="product-quantity-container">
              <button
                type="button"
                className="product-item-btn"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="product-item-quantity">{quantity}</p>
              <button
                type="button"
                className="product-item-btn"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button type="button" className="add-to-card-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list-container">
            {similarProductsList.map(eachItem => (
              <SimilarProductItem productItem={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="products-item-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="product-item-error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="product-item-error-title">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        {this.renderAllProductItems()}
      </>
    )
  }
}
export default ProductItemDetails
