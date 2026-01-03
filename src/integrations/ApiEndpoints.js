const API = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); // Remove trailing slash if present

const userEndpoints = {
  details: (userName) => `${API}/user?userName=${userName}`,
  profile: `${API}/user/profile`,
  update: `${API}/user/update/profile`,
  report: `${API}/user/report`,
  completeProfile: `${API}/user/complete`,
  updateProfile: `${API}/user/update`,
};

const clubEndpoints = {
  all: `${API}/ngos`,
  details: (userName) => `${API}/ngos?userName=${userName}`,
  createEvent: `${API}/club/createevent`,
  dashboard: `${API}/ngos/dashboard`,
};

const eventEndpoints = {
  all: `${API}/events`,
  create: `${API}/events/create`,
};

const authEndpoints = {
  signin: `${API}/auth/signin`,
  signup: `${API}/auth/signup`,
  googleLogin: `${API}/auth/google`,
  googleLoginSuccess: `${API}/auth/login/success`,
  logout: `${API}/auth/logout`,
};

const trendingEndpoints = {
  all: `${API}/api/trending`,
};

const shopEndpoints = {
  all: `${API}/product/allproducts`,
};

const donationEndpoints = {
  all: `${API}/api/donations/public-ledger`,
  create: `${API}/api/donations`,
  chainStatus: `${API}/api/donations/chain-status`,
  fixIntegrity: `${API}/api/donations/fix-integrity`,
};

const chatbotEndpoints = {
  message: `${API}/api/chatbot/message`,
  history: (sessionId) => `${API}/api/chatbot/history/${sessionId}`,
};

const aiEndpoints = {
  generateDescription: `${API}/api/ai/generate-description`,
};

const campaignEndpoints = {
  create: `${API}/api/campaigns`,
};

export {
  authEndpoints,
  clubEndpoints,
  eventEndpoints,
  userEndpoints,
  trendingEndpoints,
  shopEndpoints,
  donationEndpoints,
  chatbotEndpoints,
  aiEndpoints,
  campaignEndpoints,
};
