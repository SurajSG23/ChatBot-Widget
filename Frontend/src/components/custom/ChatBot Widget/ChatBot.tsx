// npm install react-icons react-speech-recognition axios motion react-toastify
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
import { motion, stagger, useAnimate } from "motion/react";
import { toast } from "react-toastify";

const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.2,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              style={{
                color: "black",
                opacity: 0,
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div
      style={{ fontWeight: "semi-bold", ...(className ? { className } : {}) }}
    >
      <div>
        <div
          style={{
            color: "black",
            fontSize: "1rem",
            lineHeight: "1.375",
            letterSpacing: "0.05em",
          }}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

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
  const model = "qwen3-32b-genwai";
  const [project, setProject] = useState("Default");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [file, setFile] = useState<File[]>([]);
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    messages[messages.length - 1].newMsg = false;
  };

  // Sync speech recognition transcript with input
  useEffect(() => {
    if (transcript) setInputValue(transcript);
  }, [transcript]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset chat to initial state
  const clearChat = () => {
    setMessages([
      { text: "Hello! How can I help you today?", isUser: false, newMsg: true },
    ]);
    localStorage.clear();
  };

  // Initial load: fetch projects and saved messages
  useEffect(() => {
    fetchProjects();
    const msg = localStorage.getItem("chatMessages");
    setMessages(msg ? JSON.parse(msg) : []);
  }, []);

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // Save messages to localStorage
  const setNewMessages = (chatStr: string) => {
    localStorage.setItem("chatMessages", chatStr);
    const msg = localStorage.getItem("chatMessages");
    setMessages(msg ? JSON.parse(msg) : []);
  };

  // Send message to backend and update chat
  const handleSendMessage = async () => {
    setIsSending(true);
    SpeechRecognition.stopListening();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/recievePrompt/",
        { inputValue, model, project },
        { headers: { "Content-Type": "text/plain" }, withCredentials: true }
      );

      if (inputValue.trim()) {
        const newMessages = [
          ...messages.map((msg) => ({ ...msg, newMsg: false })),
          { text: inputValue, isUser: true, newMsg: false },
          { text: response.data.split("$$$")[0], isUser: false, newMsg: true },
        ];
        setNewMessages(JSON.stringify(newMessages));
        setSuggestion(response.data.split("$$$")[1]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
      setInputValue("");
      resetTranscript();
    }
  };

  // Fetch available projects from backend
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/fetchProjects/", {
        params: { url: window.location.href },
      });
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Handle file upload to backend
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file || !project.trim()) return;

    const formData = new FormData();
    file.forEach((file) => formData.append("files", file));
    formData.append("source", project);
    formData.append("url", window.location.href);

    try {
      await axios.post("http://127.0.0.1:8000/upload/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProject("");
      setFile([]);
      toast.success("Uploaded Successfully");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
      setIsFileUpload(false);
    }
  };

  // Use suggested question as input
  const sendSuggestedQuestion = () => {
    setInputValue(suggestion);
    setSuggestion("");
  };

  return (
    <div className="chatbot-container-main">
      <div className="chatbot-icon" onClick={toggleChatbot}>
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
            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h3>{project === "Default" ? "AI Assistant" : project}</h3>
              {isFileUpload ? (
                ""
              ) : (
                <div
                  className="plusButton"
                  title="Add Project Documents  "
                  onClick={() => setIsFileUpload(!isFileUpload)}
                >
                  <svg
                    className="plusIcon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 30"
                  >
                    <g mask="url(#mask0_21_345)">
                      <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                    </g>
                  </svg>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {!isFileUpload ? (
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
              ) : (
                <RxCross2
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    fontWeight: "bolder",
                  }}
                  onClick={() => setIsFileUpload(!isFileUpload)}
                />
              )}
            </div>
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
            {isFileUpload && (
              <div className="section">
                <div className="section-title">Upload Files</div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFile(Array.from(e.target.files || []))}
                  required
                />
              </div>
            )}
            {file.length !== 0 && isFileUpload && (
              <button
                type="submit"
                className="submit-btn"
                onClick={handleUpload}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            )}
          </div>
          {suggestion && !isFileUpload && (
            <div onClick={sendSuggestedQuestion} className="suggestion">
              {suggestion}
            </div>
          )}
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
