// src/config/footerLinksConfig.js

export const footerLinks = {
  quickStarts: [
    { name: "Trending Events", path: "/trending" },
    { name: "NGOs near you", path: "/clubs" },
    { name: "Login / Signup", path: "/auth/login" },
    { name: "Events ", path: "/events" },
  ],
  policies: [
    { name: "Terms of Use", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Cookies Policy", path: "/cookies" },
  ],
  social: [
    {
      name: "LinkedIn",
      path: "https://www.linkedin.com/company/opengiv",
      icon: "FaLinkedinIn",
    },
    {
      name: "X",
      path: "https://x.com/opengivdotorg",
      icon: "FaXTwitter",
    },
    {
      name: "GitHub",
      path: "https://github.com/opengivcommunity",
      icon: "FaGithub",
    },
  ],
};
