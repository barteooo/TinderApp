import { useCallback, useEffect, useRef, useState } from "react";
import MessagesApi from "../../api/MessagesApi";

const MessagesContainer = ({ chatId, userData, messages, refreshData }) => {
  const messagesContainerRef = useRef();

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

  useEffect(() => {
    messagesContainerRef.current.scrollTo(
      0,
      messagesContainerRef.current.scrollHeight
    );
  }, [messages]);

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
    <div ref={messagesContainerRef} className="messages-container">
      {messages.map((message, index) => {
        if (message.userId === userData._id) {
          return (
            <div
              className="message-container message-alien"
              key={index}
              style={{ textAlign: "left" }}
            >
              <h6 className="merssage-date">
                {new Date(message.date).toLocaleString()}
              </h6>
              <p>{message.text}</p>
            </div>
          );
        } else if (editMessageData.messageId === message._id) {
          return (
            <div className="message-container message-me" key={index}>
              <h6 className="merssage-date">
                {new Date(message.date).toLocaleString()}
              </h6>
              <textarea
                className="input"
                value={editMessageData.text}
                onChange={(e) =>
                  setEditMessageData((s) => ({
                    ...s,
                    text: e.target.value,
                  }))
                }
              ></textarea>
              <div>
                <button
                  style={{ margin: 20 }}
                  className="success-button"
                  onClick={handleClickSaveMessage}
                >
                  Save
                </button>
                <button
                  className="danger-button"
                  onClick={handleClickDiscardEditMessage}
                >
                  Discard
                </button>
              </div>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="message-container message-me"
            style={{ textAlign: "right" }}
          >
            <h6 className="merssage-date">
              {new Date(message.date).toLocaleString()}
            </h6>
            <p>{message.text}</p>
            <div>
              <button
                style={{ marginRight: 20 }}
                className="warning-button"
                onClick={() =>
                  handleClickEditMessage(message._id, message.text)
                }
              >
                Edit
              </button>
              <button
                className="danger-button"
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
  );
};

export default MessagesContainer;
