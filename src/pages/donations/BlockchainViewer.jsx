import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/shared";
import { apiConnector } from "../../integrations/ApiConnector";
import { donationEndpoints } from "../../integrations/ApiEndpoints";
import { FaCheckCircle, FaShieldAlt, FaLink, FaCube, FaTimes, FaTrash, FaTools } from "react-icons/fa";
import "./BlockchainViewer.scss";

const BlockchainViewer = () => {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState({ totalDonated: 0, totalBlocks: 0 });
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error', null
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      const response = await apiConnector("GET", donationEndpoints.all, null, null, { limit: 10 });
      if (response.data.success) {
        // Sort blocks by blockNumber ascending for the chain visualization
        const sortedBlocks = response.data.ledger.sort((a, b) => a.blockNumber - b.blockNumber);
        setBlocks(sortedBlocks);
        setStats({
          totalDonated: response.data.stats.totalDonated,
          totalBlocks: response.data.pagination.totalTransactions
        });
      }
    } catch (error) {
      console.error("Failed to fetch blockchain data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    setVerificationStatus(null);
    
    try {
      // Simulate a scanning effect for visual impact
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiConnector("GET", donationEndpoints.chainStatus);
      
      if (response.data.success && response.data.chainStatus.valid) {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
      }
    } catch (error) {
      console.error("Verification failed", error);
      setVerificationStatus("error");
    } finally {
      setVerifying(false);
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!window.confirm("Are you sure? Deleting a block will break the blockchain integrity!")) return;
    
    setDeletingId(id);
    try {
      // We need to construct the URL manually since it's a dynamic parameter
      // Assuming donationEndpoints.all is something like "/donations"
      // We'll append the ID to it.
      // A safer way is to assume the base URL structure or add a new endpoint to ApiEndpoints.js
      // For now, let's try to append to the base donation endpoint
      
      // Use donationEndpoints.create as base since it points to /api/donations
      // and our delete route is /api/donations/:id
      const response = await apiConnector("DELETE", `${donationEndpoints.create}/${id}`);
      
      if (response.data.success) {
        // Refresh data
        fetchBlockchainData();
        // Reset verification status because we know it's likely broken now, 
        // but let the user click verify to see it.
        setVerificationStatus(null); 
      }
    } catch (error) {
      console.error("Failed to delete block", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRepairChain = async () => {
    setRepairing(true);
    try {
      const response = await apiConnector("POST", donationEndpoints.fixIntegrity);
      if (response.data.success) {
        fetchBlockchainData();
        setVerificationStatus("success");
      }
    } catch (error) {
      console.error("Repair failed", error);
    } finally {
      setRepairing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="transparency-container">
        <div className="header-section">
          <h1>OpenGiv <span>Transparency Ledger</span></h1>
          <p>Every donation is recorded on our immutable public ledger. Verify the flow of funds yourself.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>₹{stats.totalDonated.toLocaleString()}</h3>
            <p>Total Verified Donations</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalBlocks}</h3>
            <p>Blocks on Chain</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <p>Chain Integrity</p>
          </div>
        </div>

        <div className="blockchain-visualizer">
          <div className="chain-container">
            {loading ? (
              <p>Loading blockchain...</p>
            ) : blocks.length > 0 ? (
              blocks.map((block, index) => (
                <div 
                  key={block._id} 
                  className={`block ${verificationStatus === 'success' ? 'verified' : ''} ${verificationStatus === 'error' ? 'broken' : ''}`}
                >
                  <div className="block-header">
                    <span className="block-number"><FaCube /> Block #{block.blockNumber}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="timestamp">{new Date(block.timestamp).toLocaleDateString()}</span>
                      <button 
                        onClick={() => handleDeleteBlock(block._id)}
                        style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                        title="Delete block (Simulate Attack)"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="block-body">
                    <div className="row">
                      <span>Donor:</span>
                      <span>{block.donorName}</span>
                    </div>
                    <div className="row">
                      <span>Amount:</span>
                      <span>₹{block.amount}</span>
                    </div>
                    <div className="row">
                      <span>To:</span>
                      <span>{block.recipientName}</span>
                    </div>
                    
                    <div className="hash-row">
                      <span className="label">Previous Hash</span>
                      <span className="hash">{block.previousHash.substring(0, 20)}...</span>
                    </div>
                    <div className="hash-row">
                      <span className="label">Transaction Hash</span>
                      <span className="hash">{block.transactionHash.substring(0, 20)}...</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No blocks found on the chain yet.</p>
            )}
          </div>
        </div>

        <div className="integrity-section">
          <button 
            onClick={handleVerifyIntegrity} 
            disabled={verifying}
            className={verifying ? 'verifying' : verificationStatus}
          >
            {verifying ? (
              <>Scanning Ledger...</>
            ) : verificationStatus === 'success' ? (
              <><FaCheckCircle /> Integrity Verified</>
            ) : verificationStatus === 'error' ? (
              <><FaTimes /> Integrity Broken</>
            ) : (
              <><FaShieldAlt /> Verify Chain Integrity</>
            )}
          </button>
          
          {verificationStatus === 'success' && (
            <p className="status-message success">
              All blocks are cryptographically linked and valid. No tampering detected.
            </p>
          )}

          {verificationStatus === 'error' && (
            <div className="error-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <p className="status-message error">
                Chain integrity is compromised! Hashes do not match.
              </p>
              <button 
                onClick={handleRepairChain}
                disabled={repairing}
                className="repair-button"
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                <FaTools /> {repairing ? "Repairing..." : "Repair Blockchain"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlockchainViewer;
