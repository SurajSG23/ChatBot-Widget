import React, { useEffect, useRef, useState } from "react";
import "./ChatBot.scss";
import { BsRobot } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaMicrophone, FaPause } from "react-icons/fa";
import axios from "axios";
import TextGenerateEffect from "./components/ui/text-generation-effect";

const Chatbot: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean; newMsg: boolean }>
  >([
    { text: "Hello! How can I help you today?", isUser: false, newMsg: true },
  ]);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState("");
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    messages[messages.length - 1].newMsg = false;
  };
  const [model, setModel] = useState("qwen3-32b-genwai");
  const [project, setProject] = useState("Default");

  useEffect(() => {
    if (transcript) {
      console.log(transcript);
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    setIsSending(true);
    SpeechRecognition.stopListening();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/recievePrompt/",
        { inputValue, model, project },
        {
          headers: {
            "Content-Type": "text/plain",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      if (inputValue.trim()) {
        const updatedMessages = messages.map((msg) => ({
          ...msg,
          newMsg: false,
        }));

        const newMessages = [
          ...updatedMessages,
          { text: inputValue, isUser: true, newMsg: false },
          {
            text: response.data,
            isUser: false,
            newMsg: true,
          },
        ];
        setMessages(newMessages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
      setInputValue("");
      resetTranscript();
    }
  };
  const clearChat = () => {
    setMessages([]);
    const newMessages = [
      {
        text: "Hello! How can I help you today?",
        isUser: false,
        newMsg: true,
      },
    ];
    setMessages(newMessages);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const path = window.location.href;
    if (path.includes("local")) setProject("project-three");
  }, []);

  return (
    <div className="chatbot-container-main">
      <div onClick={toggleChatbot}>
        <ul className="wrapper">
          <li className="icon facebook">
            {!isOpen ? <span className="tooltip">NEED HELP?</span> : ""}

            {!isOpen ? (
              <BsRobot style={{ fontSize: "25px" }} />
            ) : (
              <RxCross2 style={{ fontSize: "30px" }} />
            )}
          </li>
        </ul>
      </div>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <select
              name="model"
              id="model-selection"
              onChange={(e) => {
                setModel(e.target.value);
              }}
            >
              <option value="qwen3-32b-genwai" hidden>
                Select Model &#11167;
              </option>

              <option value="qwen3-32b-genwai">Qwen3-32b-genwai</option>
              <option value="Qwen/Qwen2.5-Coder-32B-Instruct-AWQ">
                Qwen/Qwen2.5-Coder
              </option>
            </select>

            <button className="bin-button" onClick={clearChat}>
              <span className="tooltiptext">Clear Chat</span>
              <svg
                className="bin-top"
                viewBox="0 0 39 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  y1="5"
                  x2="39"
                  y2="5"
                  stroke="white"
                  strokeWidth="4"
                ></line>
                <line
                  x1="12"
                  y1="1.5"
                  x2="26.0357"
                  y2="1.5"
                  stroke="white"
                  strokeWidth="3"
                ></line>
              </svg>
              <svg
                className="bin-bottom"
                viewBox="0 0 33 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask id="path-1-inside-1_8_19" fill="white">
                  <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                </mask>
                <path
                  d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                  fill="white"
                  mask="url(#path-1-inside-1_8_19)"
                ></path>
                <path d="M12 6L12 29" stroke="white" strokeWidth="4"></path>
                <path d="M21 6V29" stroke="white" strokeWidth="4"></path>
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                style={{ display: "flex", alignItems: "center" }}
                key={index}
              >
                {index % 2 == 0 ? (
                  <BsRobot
                    style={{
                      fontSize: "16px",
                      color: "black",
                      padding: "2px",
                    }}
                  />
                ) : (
                  ""
                )}

                <div
                  className={`message ${
                    message.isUser ? "user-message" : "bot-message"
                  }`}
                >
                  {message.isUser ? (
                    message.text.charAt(0).toUpperCase() + message.text.slice(1)
                  ) : message.newMsg ? (
                    <TextGenerateEffect words={message.text} />
                  ) : (
                    message.text
                  )}
                </div>
                {index % 2 != 0 ? (
                  <FaRegUser
                    style={{
                      fontSize: "16px",
                      color: "black",
                      display: "flex",
                      marginLeft: "2px",
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            {!isSending && (
              <div
                style={{
                  backgroundColor: "#00a053",
                  borderRadius: "9999px",
                  padding: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.875rem",
                }}
                onClick={() =>
                  listening
                    ? SpeechRecognition.stopListening()
                    : SpeechRecognition.startListening({ continuous: true })
                }
              >
                {listening ? (
                  <FaPause style={{ fontSize: "16px", color: "white" }} />
                ) : (
                  <FaMicrophone style={{ fontSize: "16px", color: "white" }} />
                )}
              </div>
            )}

            <input
              type="text"
              value={inputValue}
              onChange={(e) =>
                setInputValue(
                  e.target.value.charAt(0).toUpperCase() +
                    e.target.value.slice(1)
                )
              }
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="chat-input"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              className="send-button"
              disabled={isSending || inputValue === ""}
            >
              {isSending ? (
                <div className="spinner center">
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                  <div className="spinner-blade"></div>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Chatbot;
