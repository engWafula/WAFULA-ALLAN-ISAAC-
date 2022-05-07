import React, { Component } from "react";
import { connect } from "react-redux";
import { ProductsContainer, Title } from "./list-style";
import ProductCard from "./ProductCard";
import client from "../../Services/apolloClient";
import { sendProducts } from "../../Redux/actions";
import { getItemsByCategory,  getAllProducts } from "../../Services/queries";

class ProductList extends Component {
  constructor() {
    super();
    this.state = { hover: false, products: [] };
    this.mouseOn = this.mouseOn.bind(this);
    this.fetchProducts = this.fetchProducts.bind(this);
    this.mouseOff = this.mouseOff.bind(this);
  }

  componentDidMount() {
    this.fetchProducts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.fetchProducts();
    }
  }

  mouseOn() {
    this.setState({ hover: true });
  }
  async fetchAllProducts(){
    const cu = await client.query({
      query: getAllProducts,
    });
    this.setState({ products: cu.data.category.products });
  }

  async fetchProducts() {
    const { sendProducts } = this.props;
    const result = await client.query({
      query: getItemsByCategory,
      variables: {
        title: this.props.category === "All" ? "" : this.props.category,
      },
    });
    this.setState({ products: result.data.category.products });
    sendProducts(result.data.category.products);
  }

  mouseOff() {
    this.setState({ hover: false });
  }

  render() {
    const { currentCurr } = this.props;
    return (
      <>
        <Title>{this.props.category.toUpperCase()}</Title>
        <ProductsContainer>
          {this.state.products &&
            this.state.products.map((item, id) => (
              <>
                <ProductCard
                  key={item.name}
                  item={item}
                  id={item.id}
                  prices={item.prices[currentCurr].currency.symbol}
                  amount={item.prices[currentCurr].amount}
                />
              </>
            ))}
        </ProductsContainer>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  produc: state.cart.products,
  currentCurr: state.cart.currency,
  category: state.cart.category,
});

const mapDispatchToProps = (dispatch) => ({
  sendProducts: (state) => dispatch(sendProducts(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
