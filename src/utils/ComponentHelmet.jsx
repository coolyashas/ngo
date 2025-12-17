import { Helmet } from "react-helmet-async";

function ComponentHelmet({ type }) {
  return type == "Clubs" ? (
    <Helmet>
      <title>OpenGiv | {type}</title>
      <meta
        name="description"
        content="This is the clubs page of OpenGiv, where you can find all the clubs in the community."
      />
      <link rel="canonical" href="/" />
    </Helmet>
  ) : type == "Events" ? (
    <Helmet>
      <title>OpenGiv | Events </title>
      <meta
        name="description"
        content="This is the events page of OpenGiv, where you can find all the events happening in the community."
      />
      <link rel="canonical" href="/" />
    </Helmet>
  ) : null;
}

export default ComponentHelmet;
