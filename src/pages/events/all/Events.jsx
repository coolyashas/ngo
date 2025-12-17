import { Button, Footer, Loading, Navbar } from "@components/shared";
import EventCard from "@components/shared/cards/event/EventCard";
import EventSlider from "@components/shared/cards/event/EventSlider";
import CreateEvent from "@components/shared/createEvent";
import { GetAllEvents } from "@service/OpenGivApi";
import ComponentHelmet from "@utils/ComponentHelmet";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Events.scss";

const Events = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await GetAllEvents();
        if (response && response.data) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events?.filter((event) => {
    const term = searchTerm.toLowerCase();
    return (
      event?.name?.toLowerCase().includes(term) ||
      event?.hostName?.toLowerCase().includes(term) ||
      event?.description?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <ComponentHelmet type="Clubs" />
      <Navbar />

      <div className="events_header">
        <div className="events_search_parent">
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
          className="createevent"
          onClickfunction={() => {
            setShowCreateModal(true);
          }}
        >
          <FaPlus /> Create An Event
        </Button>
      </div>

      <EventSlider />

      <hr className="events_separator" />

      <div className="events_parent">
        {loading ? (
          <Loading />
        ) : !filteredEvents || filteredEvents.length === 0 ? (
          <div className="no_events_found">
            <h1>
              {searchTerm
                ? `No Events Found matching "${searchTerm}"`
                : "No Events Found"}
            </h1>
          </div>
        ) : (
          filteredEvents.map((event, id) => (
            <EventCard event={event} key={id} />
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateEvent setShowCreateModal={setShowCreateModal} />
      )}

      <Footer />
    </>
  );
};

export default Events;
