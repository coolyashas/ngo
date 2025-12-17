import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/shared";
import { apiConnector } from "../../integrations/ApiConnector";
import { shopEndpoints } from "../../integrations/ApiEndpoints";
import "./Shop.scss";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiConnector("GET", shopEndpoints.all);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="shop-container">
        <h1>NGO Shop</h1>
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.productImage ? (
                    <img src={product.productImage} alt={product.productName} />
                  ) : (
                    <div className="placeholder">🛍️</div>
                  )}
                </div>
                <div className="product-content">
                  <h3>{product.productName}</h3>
                  <div className="price">₹{product.productPrice || "0.00"}</div>
                  <p>{product.productDescription}</p>
                  <button>Add to Cart</button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="no-data">No products found.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
