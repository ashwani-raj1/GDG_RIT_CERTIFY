import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    alert("Your session has expired. Please sign in again.");
    navigate("/signin");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/adminData`, {
      headers: { Authorization: token },
    })
      .then((response) => {
        if (response.status === 401) handleUnauthorized();
      })
      .catch(() => {
        // Keep the user signed in if there is only a temporary network error.
      });
  }, [handleUnauthorized, navigate]);

  /* FORM DATA */

  const [formData, setFormData] = useState({
    eventName: "",
    studentName: "",
    studentRoll: "",
    credential: "",
    date: "",
  });

  /* FILE STATE */

  const [file, setFile] = useState(null);
  const [certificateDocument, setCertificateDocument] = useState(null);
  const [documentCertificateId, setDocumentCertificateId] = useState("");

  /* HANDLE INPUT */

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  /* LOGOUT */

  const handleLogout = () => {
    localStorage.removeItem("token");

    alert("Logged Out Successfully");

    navigate("/");
  };

  /* MANUAL ENTRY */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      // Request failed
      if (!response.ok || !data.success) {
        return alert(data.message || data.error);
      }

      // Success
      setFormData({
        eventName: "",
        studentName: "",
        studentRoll: "",
        credential: "",
        date: "",
      });

      const openBlockchain = window.confirm(
        `${data.message}

Transaction Hash:
${data.transactionHash}

Do you want to view it on Blockchain?`,
      );

      if (openBlockchain) {
        window.open(
          `https://sepolia.etherscan.io/tx/${data.transactionHash}`,
          "_blank",
        );
      }
    } catch (err) {
      console.error(err);

      alert("Server Error");
    }
  };
  /* EXCEL UPLOAD */

  const handleFileUpload = async () => {
    if (!file) {
      return alert("Please select Excel file");
    }

    const uploadData = new FormData();

    uploadData.append("excelFile", file);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/signin");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: token },
      body: uploadData,
    })
      .then(async (res) => ({ status: res.status, data: await res.json() }))

      .then(({ status, data }) => {
        if (status === 401) {
          handleUnauthorized();
          return;
        }

        console.log(data);

        if (data.message) {
          alert(data.message);

          setFile(null);
        } else {
          alert(data.error);
        }
      })

      .catch((err) => console.log(err));
  };

  const handleCertificateDocumentUpload = async () => {
  if (!documentCertificateId.trim()) {
    return alert("Please enter the Certificate ID");
  }

  if (!certificateDocument) {
    return alert("Please select a certificate PDF or image");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    navigate("/signin");
    return;
  }

  const uploadData = new FormData();
  uploadData.append("document", certificateDocument);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/certificates/${documentCertificateId.trim().toUpperCase()}/document`,
      {
        method: "POST",
        headers: { Authorization: token },
        body: uploadData,
      },
    );

    const data = await response.json();

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!response.ok || !data.success) {
      return alert(data.message || "IPFS upload failed");
    }

    alert(`Certificate stored on IPFS.\nCID: ${data.ipfsCid}`);

    setDocumentCertificateId("");
    setCertificateDocument(null);
  } catch (error) {
    console.error(error);
    alert("Unable to upload the certificate document");
  }
};



  return (
    <div className="admin-container">
      {/* BACKGROUND BLOBS */}

      <div className="admin-blob admin-blob--blue" aria-hidden="true" />
      <div className="admin-blob admin-blob--red" aria-hidden="true" />
      <div className="admin-blob admin-blob--yellow" aria-hidden="true" />
      <div className="admin-blob admin-blob--green" aria-hidden="true" />

      {/* HEADER */}

      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>

          <p className="admin-subtitle">
            Manage certificate records, uploads, and IPFS documents
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* GRID */}

      <div className="admin-grid">
        {/* MANUAL ENTRY */}

        <div className="admin-card admin-card--form">
          <h2 className="card-title">Manual Entry</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <input
              className="admin-input"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Enter Event Name"
              required
            />

            <input
              className="admin-input"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter Student Name"
              required
            />

            <input
              className="admin-input"
              name="studentRoll"
              value={formData.studentRoll}
              onChange={handleChange}
              placeholder="Enter Roll Number"
              required
            />

            <input
              className="admin-input"
              name="credential"
              value={formData.credential}
              onChange={handleChange}
              placeholder="Enter Certificate ID"
              required
            />

            <input
              className="admin-input"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <button className="admin-btn" type="submit">
              Add Certificate
            </button>
          </form>
        </div>

        {/* EXCEL UPLOAD */}

        <div className="admin-card admin-card--upload">
          <h2 className="card-title">Upload Excel File</h2>

          <p className="upload-text">
            Upload multiple certificate records using Excel sheet.
          </p>

          <label className="file-upload-label">
            <span>Certificate spreadsheet</span>
            <input
              className="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button className="admin-btn" onClick={handleFileUpload}>
            Upload Excel
          </button>
        </div>
        <div className="admin-card admin-card--ipfs">
          <h2 className="card-title">Store Certificate on IPFS</h2>

          <p className="upload-text">
            Upload the original PDF or image through Pinata. The returned IPFS
            CID is saved with this certificate record.
          </p>

          <input
            className="admin-input"
            type="text"
            placeholder="Enter Certificate ID, e.g. CERT123"
            value={documentCertificateId}
            onChange={(e) => setDocumentCertificateId(e.target.value)}
          />

          <label className="file-upload-label">
            <span>Original certificate file</span>
            <input
              className="file-input"
              type="file"
              accept=".pdf,image/png,image/jpeg"
              onChange={(e) => setCertificateDocument(e.target.files[0])}
            />
          </label>

          <button
            className="admin-btn"
            type="button"
            onClick={handleCertificateDocumentUpload}
          >
            Upload to IPFS
          </button>
        </div>
      </div>
    </div>
  );
}
