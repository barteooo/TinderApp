import { useEffect, useState } from "react";
import MessagesApi from "../../api/MessagesApi";

const MessagesStats = ({ matchedUserId, messages }) => {
  const [stats, setStats] = useState({
    numberOfMessagesLastDay: 0,
  });

  useEffect(() => {
    if (matchedUserId) {
      initMessagesStats();
    }
  }, [matchedUserId, messages]);

  const initMessagesStats = async () => {
    const statsResult = await MessagesApi.getStats(matchedUserId);
    if (!statsResult.success) {
      alert("Error getStats");
      return;
    }
    setStats({
      ...stats,
      numberOfMessagesLastDay: statsResult.stats.numberOfMessagesLastDay,
    });
  };

  return (
    <div className="messages-stats-container">
      Number of messages last 24h: {stats.numberOfMessagesLastDay}
    </div>
  );
};

export default MessagesStats;
