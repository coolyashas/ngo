import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { PiCaretLeftBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ClubCard,
  Footer,
  Loading,
  Navbar,
} from "../../components/shared";
import { GetAllClubs } from "../../service/OpenGivApi";
import ComponentHelmet from "../../utils/ComponentHelmet";
import "./Clubs.scss";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      const response = await GetAllClubs();
      setClubs(response.data);
    };
    fetchClubs();
  }, []);

  const filteredClubs = clubs?.filter((club) => {
    const term = searchTerm.toLowerCase();
    return (
      club?.name?.toLowerCase().includes(term) ||
      club?.description?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <ComponentHelmet type="Clubs" />
      <Navbar />

      <div className="clubs_header">
        <div className="clubs_search_parent">
          <input
            type="text"
            name=""
            id=""
            placeholder="Type to begin search, or use the filters"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            Filters <CiFilter />
          </button>
        </div>

        <Button
          className="viewdashboard"
          onClickfunction={() => {
            navigate("/dashboard");
          }}
        >
          Your Dashboard <PiCaretLeftBold />
        </Button>
      </div>

      <div className="clubs_parent">
        {!filteredClubs || filteredClubs?.length === 0 ? (
          searchTerm ? (
            <div className="no_results">No clubs found matching "{searchTerm}"</div>
          ) : (
            <Loading />
          )
        ) : (
          filteredClubs?.map((club, id) => <ClubCard club={club} key={id} />)
        )}
      </div>

      <Footer />
    </>
  );
};

export default Clubs;
