import React, { useState, useCallback, useRef } from "react";
import "./RegistrationPage.scss";

interface PredefinedProject {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FormData {
  projectType: "predefined" | "custom";
  predefinedProject?: string;
  projectName?: string;
  websiteUrl?: string;
  files: File[];
}

const RegistrationPage: React.FC = () => {
  const [selectedProjectType, setSelectedProjectType] = useState<
    "predefined" | "custom" | null
  >(null);
  const [selectedPredefinedProject, setSelectedPredefinedProject] = useState<
    string | null
  >(null);
  const [projectName, setProjectName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedProjects: PredefinedProject[] = [
    {
      id: "ecommerce",
      name: "E-Commerce",
      icon: "🛍️",
      description: "Online store solution",
    },
    {
      id: "portfolio",
      name: "Portfolio",
      icon: "💼",
      description: "Personal showcase",
    },
    {
      id: "blog",
      name: "Blog",
      icon: "📝",
      description: "Content management",
    },
  ];

  const handleProjectTypeSelect = (type: "predefined" | "custom") => {
    setSelectedProjectType(type);
    if (type === "predefined") {
      setProjectName("");
      setWebsiteUrl("");
    } else {
      setSelectedPredefinedProject(null);
    }
  };

  const handlePredefinedProjectSelect = (projectId: string) => {
    if (selectedProjectType === "predefined") {
      setSelectedPredefinedProject(projectId);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const newFiles = files.filter(
      (file) =>
        !selectedFiles.find((f) => f.name === file.name && f.size === file.size)
    );
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    },
    [selectedFiles]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isFormValid = (): boolean => {
    let projectValid = false;

    if (selectedProjectType === "predefined") {
      projectValid = selectedPredefinedProject !== null;
    } else if (selectedProjectType === "custom") {
      projectValid = projectName.trim() !== "" && websiteUrl.trim() !== "";
    }

    return projectValid && selectedFiles.length > 0;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const formData: FormData = {
      projectType: selectedProjectType!,
      files: selectedFiles,
    };

    if (selectedProjectType === "predefined") {
      formData.predefinedProject = selectedPredefinedProject!;
    } else {
      formData.projectName = projectName;
      formData.websiteUrl = websiteUrl;
    }

    console.log("Form data ready for submission:", formData);
    alert("Registration submitted successfully! (Check console for form data)");
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="header">
          <h1>🚀 Project Registration</h1>
          <p>Upload your files and get started with your project</p>
        </div>

        <div className="form-container">
          <div onSubmit={handleSubmit} className="registration-form">
            {/* Project Selection Section */}
            <div className="section">
              <div className="section-title">
                <span className="section-icon"></span>
                📋 Choose Project Type
              </div>

              <div className="project-options">
                {/* Predefined Projects Option */}
                <div
                  className={`option-group ${
                    selectedProjectType === "predefined" ? "active" : ""
                  }`}
                  onClick={() => handleProjectTypeSelect("predefined")}
                >
                  <div className="radio-container">
                    <div
                      className={`custom-radio ${
                        selectedProjectType === "predefined" ? "checked" : ""
                      }`}
                    ></div>
                    <div className="option-label">
                      Select from Predefined Projects
                    </div>
                  </div>

                  {selectedProjectType === "predefined" && (
                    <div className="predefined-projects">
                      {predefinedProjects.map((project) => (
                        <div
                          key={project.id}
                          className={`project-card ${
                            selectedPredefinedProject === project.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePredefinedProjectSelect(project.id);
                          }}
                        >
                          <div className="project-icon">{project.icon}</div>
                          <div className="project-name">{project.name}</div>
                          <div className="project-desc">
                            {project.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Project Option */}
                <div
                  className={`option-group ${
                    selectedProjectType === "custom" ? "active" : ""
                  }`}
                  onClick={() => handleProjectTypeSelect("custom")}
                >
                  <div className="radio-container">
                    <div
                      className={`custom-radio ${
                        selectedProjectType === "custom" ? "checked" : ""
                      }`}
                    ></div>
                    <div className="option-label">Create Custom Project</div>
                  </div>

                  {selectedProjectType === "custom" && (
                    <div className="custom-inputs">
                      <div className="input-group">
                        <label htmlFor="projectName">Project Name</label>
                        <input
                          type="text"
                          id="projectName"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
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
                  )}
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="section">
              <div className="section-title">
                <span className="section-icon"></span>
                📁 Upload Files
              </div>

              <div
                className={`file-upload-section ${
                  isDragOver ? "dragover" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">☁️</div>
                <div className="upload-text">Drag & Drop Files Here</div>
                <div className="upload-subtext">or click to browse files</div>
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h3>Selected Files:</h3>
                  <div className="file-list">
                    {selectedFiles.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="file-item">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">
                          {formatFileSize(file.size)}
                        </div>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => removeFile(index)}
                          aria-label="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid()}
            >
              Register Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
