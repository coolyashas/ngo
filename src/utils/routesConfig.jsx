import Home from "@pages/Home";
import {
  Clubs,
  Dashboard,
  Error404,
  Events,
  DetailedEvent,
  Profile,
  Shop,
  BlockchainViewer,
  CreateCampaign,
  CampaignDetails,
} from "@pages/route";
import Trending from "@pages/Trending";
import { lazy } from "react";
import { default as DonotRenderWhenLoggedIn } from "./Auth/DonotRenderWhenLoggedIn";

const SignIn = lazy(() => import("@pages/auth/SignIn"));
const SignUp = lazy(() => import("@pages/auth/SignUp"));

const ProtectedSignIn = DonotRenderWhenLoggedIn(SignIn);
const ProtectedSignUp = DonotRenderWhenLoggedIn(SignUp);

const routesConfig = [
  { path: "/", element: <Home /> },
  {
    path: "/auth/signup",
    element: <ProtectedSignUp />,
  },
  {
    path: "/auth/signin",
    element: <ProtectedSignIn />,
  },
  { path: "/user/:userName", element: <Profile /> },
  { path: "/ngos", element: <Clubs /> },
  { path: "/club/:userName", element: <Profile /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/events", element: <Events /> },
  { path: "/event/:id", element: <DetailedEvent /> },
  { path: "/shop", element: <Shop /> },
  { path: "/donations", element: <BlockchainViewer /> },
  { path: "/campaigns/create", element: <CreateCampaign /> },
  { path: "/campaigns/:id", element: <CampaignDetails /> },
  { path: "/campaigns", element: <Trending /> },
  { path: "*", element: <Error404 /> },
];

export default routesConfig;
