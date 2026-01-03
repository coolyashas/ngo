import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar, Footer, Loading, Button } from "../../components/shared";
import { apiConnector } from "../../integrations/ApiConnector";
import { campaignEndpoints } from "../../integrations/ApiEndpoints";
import { PiCaretLeftBold } from "react-icons/pi";
import "./CampaignDetails.scss";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        // Assuming campaignEndpoints.create is base URL, we append ID
        // We might need to update ApiEndpoints.js to include a 'details' endpoint or just construct it here
        const response = await apiConnector("GET", `${campaignEndpoints.create}/${id}`);
        if (response.data.success) {
          setCampaign(response.data.campaign);
        } else {
          setError("Campaign not found");
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Failed to load campaign details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="error-container">{error}</div>;
  if (!campaign) return <div className="error-container">Campaign not found</div>;

  const progressPercentage = Math.min(
    (campaign.raised?.amount / campaign.goal?.amount) * 100,
    100
  ).toFixed(1);

  return (
    <>
      <Navbar />
      <div className="campaign-details-container">
        <div className="back-button-container">
             <Button
                className="viewdashboard"
                onClickfunction={() => {
                    navigate("/campaigns");
                }}
                >
                Back to Campaigns <PiCaretLeftBold />
            </Button>
        </div>

        <div className="campaign-header">
          <h1>{campaign.title}</h1>
          <div className="campaign-meta">
            <span className="category">{campaign.category}</span>
            <span className="organizer">By {campaign.clubId?.name || campaign.clubName}</span>
          </div>
        </div>

        <div className="campaign-content">
          <div className="campaign-main">
            <div className="campaign-image">
              <img 
                src={campaign.images?.[0]?.url || "https://via.placeholder.com/800x400"} 
                alt={campaign.title} 
              />
            </div>
            
            <div className="campaign-description">
              <h2>About this campaign</h2>
              <p>{campaign.description}</p>
            </div>
          </div>

          <div className="campaign-sidebar">
            <div className="donation-card">
              <div className="progress-section">
                <div className="amount-raised">
                  <span className="current">₹{campaign.raised?.amount || 0}</span>
                  <span className="goal">raised of ₹{campaign.goal?.amount} goal</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="stats">
                  <span>{campaign.backersCount || 0} donations</span>
                  <span>{progressPercentage}% funded</span>
                </div>
              </div>
              
              <Button className="donate-button">
                Donate Now
              </Button>
            </div>
            
            <div className="organizer-card">
                <h3>Organizer</h3>
                <p>{campaign.clubId?.name}</p>
                <p>{campaign.clubId?.email}</p>
                <p>{campaign.clubId?.city}, {campaign.clubId?.country}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CampaignDetails;
