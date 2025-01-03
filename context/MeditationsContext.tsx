import React, { createContext, useContext, useState, useEffect } from "react";
import { getMeditations, removeMeditation } from "@/storage";
import { EventEmitter } from "eventemitter3";

// Create the event emitter
const eventEmitter = new EventEmitter();

// Create the context
const MeditationsContext = createContext();



// Provider component
export const MeditationsProvider = ({ children }) => {
  const [meditations, setMeditations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch meditations from storage
  const fetchMeditations = async () => {
    setLoading(true);
    try {
      const data = await getMeditations();
      setMeditations(data);
    } catch (error) {
      console.error("Error fetching meditations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a meditation
  const deleteMeditation = async (id) => {
    try {
      await removeMeditation(id);
      await fetchMeditations(); // Refresh the meditations list
      eventEmitter.emit("meditationDeleted"); // Emit event after deletion
    } catch (error) {
      console.error("Error deleting meditation:", error);
    }
  };

  // Load meditations initially
  useEffect(() => {
    fetchMeditations();
  }, []);

  return (
    <MeditationsContext.Provider
      value={{
        meditations,
        loading,
        fetchMeditations,
        deleteMeditation,
        eventEmitter, // Expose the event emitter
      }}
    >
      {children}
    </MeditationsContext.Provider>
  );
};

// Custom hook to use the context
export const useMeditations = () => useContext(MeditationsContext);
