import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const UploadProject = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".zip",
    onDrop: (acceptedFiles) => handleUpload(acceptedFiles[0]),
  });

  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      onUploadSuccess(res.data);
    } catch (err) {
      setError("Upload failed!"+err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20, cursor: "pointer" }}>
      <input {...getInputProps()} />
      <p>Drag & drop a ZIP file, or click to select one</p>
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
UploadProject.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default UploadProject;
