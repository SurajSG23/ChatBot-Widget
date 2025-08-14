import React, { useState } from "react";
import "./RegistrationPage.scss";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const RegistrationPage: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [file, setFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const handleCopy = () => {
    const dependencies =
      "npm install react-icons react-speech-recognition axios framer-motion react-toastify";
    navigator.clipboard
      .writeText(dependencies)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy dependencies");
      });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!file.length || !projectName.trim()) {
      toast.error("Please select files and enter a project name");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      file.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("source", projectName);
      formData.append("url", websiteUrl);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload/",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form on success
      setProjectName("");
      setFile([]);
      setWebsiteUrl("");
      setIsUploaded(true);

      toast.success("Files uploaded successfully!");
      return response.data;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload files");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="registration-card" style={{ position: "relative" }}>
        <div className="header">
          <h1>Project Registration</h1>
          <p>Upload your files and get started with your chatbot</p>
        </div>
        <div className="form-container">
          <form onSubmit={handleUpload} className="registration-form">
            <div className="section">
              <div className="section-title">Create New Project</div>

              <div className="project-options">
                <div className="option-group active">
                  <div className="custom-inputs">
                    <div className="input-group">
                      <label htmlFor="projectName">Project Name</label>
                      <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => {
                          setProjectName(e.target.value);
                        }}
                        placeholder="Enter your project name"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="websiteUrl">Website URL</label>
                      <input
                        type="url"
                        id="websiteUrl"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            {projectName && websiteUrl && (
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

            {/* Submit Button */}
            {file.length === 0 ? (
              ""
            ) : (
              <button type="submit" className="submit-btn">
                {isLoading ? "Uploading..." : "Register Project"}
              </button>
            )}
          </form>
          {isUploaded && (
            <div
              style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                maxWidth: "600px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f9f9f9",
                margin: "20px auto",
                color: "#000",
              }}
            >
              <h2 style={{ marginBottom: "16px" }}>
                How to Use the Chatbot Component
              </h2>

              <ol style={{ lineHeight: "1.8", paddingLeft: "20px" }}>
                <li>
                  <strong>Download the chatbot zip file</strong> – Click below
                  to download and extract it:
                  <br />
                  <a
                    href="/path-to-your-chatbot.zip"
                    download
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      padding: "10px 15px",
                      backgroundColor: "green",
                      color: "#fff",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Download Chatbot ZIP
                  </a>
                </li>

                <li style={{ marginTop: "12px" }}>
                  <strong>Paste the chatbot folder</strong> – Place the
                  extracted <code>chatbot</code> folder into your React
                  project's <code>src</code> directory.
                </li>

                <li style={{ marginTop: "12px" }}>
                  <strong>Install dependencies</strong> - Run this command in
                  your terminal:
                  <div
                    style={{
                      backgroundColor: "#eee",
                      padding: "10px",
                      borderRadius: "4px",
                      marginTop: "6px",
                      fontFamily: "monospace",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ overflowWrap: "anywhere" }}>
                      npm install react-icons react-speech-recognition axios
                      framer-motion react-toastify
                    </span>
                    <button
                      onClick={handleCopy}
                      style={{
                        marginLeft: "10px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        backgroundColor: copied ? "#28a745" : "green",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </li>

                <li style={{ marginTop: "12px" }}>
                  <strong>Import the chatbot</strong> – In your{" "}
                  <code>App.tsx</code>, import and render it:
                  <pre
                    style={{
                      backgroundColor: "#eee",
                      padding: "10px",
                      borderRadius: "4px",
                      marginTop: "6px",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {`import ChatBot from './chatbot/ChatBot'; 
function App() {
  return <ChatBot />;
}`}
                  </pre>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
