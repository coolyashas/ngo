import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        // Fetch only campaigns since this is now the Campaigns page
        const response = await apiConnector("GET", `${trendingEndpoints.all}?type=campaign`);
        if (response.data.success && Array.isArray(response.data.trending)) {
          setTrendingItems(response.data.trending);
        } else if (Array.isArray(response.data)) {
          setTrendingItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
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
        <h1>Campaigns</h1>
        
        {loading ? (
          <div className="loading">Loading campaigns...</div>
        ) : (
          <div className="trending-grid">
            {trendingItems.map((item) => {
              const imageUrl = item.imageUrl;

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
                    
                    <div className="card-actions" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <Link
                        to={`/campaigns/${item.itemId || item._id}`}
                        className="clubcard_cta_link"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--primary-color)',
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="21"
                          viewBox="0 0 29 29"
                          fill="none"
                          className="clubcard_cta_arrow"
                          role="img"
                          style={{ transform: 'rotate(-90deg)' }}
                        >
                          <path
                            d="M22.6379 1.68188C23.2552 1.68226 23.8472 1.92766 24.2837 2.36418C24.7202 2.80069 24.9656 3.39262 24.966 4.00994L24.966 22.6784C24.9656 23.2957 24.7202 23.8877 24.2837 24.3242C23.8472 24.7607 23.2552 25.0061 22.6379 25.0065L3.96944 25.0065C3.36618 24.9848 2.7948 24.7302 2.3754 24.296C1.956 23.8619 1.72123 23.2821 1.72043 22.6784C1.72123 22.0748 1.956 21.4949 2.3754 21.0608C2.79481 20.6266 3.36618 20.372 3.96943 20.3503L17.0154 20.3503L0.675002 4.00994C0.238132 3.57307 -0.00729571 2.98055 -0.00729703 2.36273C-0.00729566 1.7449 0.238133 1.15238 0.675002 0.715508C1.11187 0.278639 1.7044 0.0332108 2.32222 0.0332088C2.94005 0.0332095 3.53257 0.278639 3.96944 0.715508L20.3098 17.0559L20.3098 4.00994C20.3102 3.39262 20.5556 2.80069 20.9921 2.36418C21.4286 1.92766 22.0206 1.68226 22.6379 1.68188Z"
                            fill="white"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
            {trendingItems.length === 0 && (
              <div className="no-data">No campaigns found.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Trending;
