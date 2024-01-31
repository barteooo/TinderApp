import { useCallback, useState } from "react";
import MessagesApi from "../../api/MessagesApi";

const MessagesContainer = ({ chatId, userData, messages, refreshData }) => {
  const [editMessageData, setEditMessageData] = useState({
    text: "",
    messageId: "",
  });

  const handleClickEditMessage = useCallback((messageId, text) => {
    setEditMessageData({
      messageId,
      text,
    });
  }, []);

  const handleClickSaveMessage = useCallback(async () => {
    const result = await MessagesApi.updateMessage(
      chatId,
      editMessageData.messageId,
      editMessageData.text
    );
    if (!result.success) {
      alert("Błąd edycji wiadomości");
    }

    await refreshData();

    setEditMessageData({
      messageId: "",
      text: "",
    });
  }, [chatId, editMessageData, refreshData]);

  const handleClickDiscardEditMessage = useCallback(() => {
    setEditMessageData({
      messageId: "",
      text: "",
    });
  }, []);

  const handleClickDeleteMessage = useCallback(
    async (messageId) => {
      const result = await MessagesApi.deleteMessage(chatId, messageId);
      if (!result.success) {
        alert("Błąd usuwania wiadomości");
      }

      await refreshData();
    },
    [chatId, refreshData]
  );

  return (
    <div>
      <div style={{ width: 300 }}>
        {messages.map((message, index) => {
          if (message.userId === userData._id) {
            return (
              <div
                key={index}
                style={{ textAlign: "left", backgroundColor: "silver" }}
              >
                <h6>{message.date}</h6>
                <p>{message.text}</p>
              </div>
            );
          } else if (editMessageData.messageId === message._id) {
            return (
              <div key={index} style={{ textAlign: "right" }}>
                <h6>{message.date}</h6>
                <textarea
                  value={editMessageData.text}
                  onChange={(e) =>
                    setEditMessageData((s) => ({
                      ...s,
                      text: e.target.value,
                    }))
                  }
                ></textarea>
                <div>
                  <button onClick={handleClickSaveMessage}>Save</button>
                  <button onClick={handleClickDiscardEditMessage}>
                    Discard
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={index} style={{ textAlign: "right" }}>
              <h6>{message.date}</h6>
              <p>{message.text}</p>
              <div>
                <button
                  onClick={() =>
                    handleClickEditMessage(message._id, message.text)
                  }
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleClickDeleteMessage(message._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesContainer;
