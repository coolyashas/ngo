import React, { useEffect, useState } from "react";
import { Navbar } from "../components/shared";
import { apiConnector } from "../integrations/ApiConnector";
import { trendingEndpoints } from "../integrations/ApiEndpoints";
import "./Trending.scss";

const clubImages = {
  "Harit Bharat Foundation":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  "Asha Bal Vikas":
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  "Swasthya Seva Sangh":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
};

const Trending = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await apiConnector("GET", trendingEndpoints.all);
        if (response.data.success && Array.isArray(response.data.trending)) {
          setTrendingItems(response.data.trending);
        } else if (Array.isArray(response.data)) {
          setTrendingItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching trending items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <>
      <Navbar />
      <div className="trending-container">
        <h1>Trending Now</h1>
        
        {loading ? (
          <div className="loading">Loading trending items...</div>
        ) : (
          <div className="trending-grid">
            {trendingItems.map((item) => {
              const imageUrl =
                (item.itemType === "Clubs" && clubImages[item.title]) ||
                item.imageUrl;

              return (
                <div key={item._id} className="trending-card">
                  <div className="card-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} />
                    ) : (
                      <div className="placeholder">★</div>
                    )}
                  </div>
                  <div className="card-content">
                    <span className={`tag ${item.itemType}`}>
                      {item.itemType}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="metrics">
                      <span>
                        🔥 {item.metrics?.engagementScore || 0} Score
                      </span>
                      <span>👁️ {item.metrics?.views || 0} Views</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {trendingItems.length === 0 && (
              <div className="no-data">No trending items found.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Trending;
