import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getRepoIcon } from "../utils/getRepoIcon";

const RepoDetailPage = () => {
  const { username, reponame } = useParams();
  const [repo, setRepo] = useState<any>(null);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axios.get(
          `https://api.github.com/repos/${username}/${reponame}`
        );
        setRepo(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRepo();
  }, [username, reponame]);

  if (!repo) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px',
        fontWeight: 'bold'
      }}>
        Loading...
      </div>
    );
  }
  
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        padding: "2rem",
        alignItems: "flex-start",
      }}
    >
      {/* Left Sidebar */}
      <div style={{ minWidth: "200px"}}>
        <img
          src={getRepoIcon(repo)}
          alt="Repo Icon"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        />
        <p style={{ fontSize: "14px", marginTop: "0.5rem" }}>
          <p style={{ fontSize: "14px", marginTop: "0.5rem" }}>
            <img
              src="/assets/verified_symbol.png"
              alt="Verified"
              style={{
                width: "16px",
                height: "16px",
                verticalAlign: "middle",
                marginRight: "4px",
              }}
            />
            <strong>Verified by GitHub</strong>
          </p>
          GitHub confirms that this app meets
          <br />
          the <a href="#" style={{textDecoration: "none"}}>requirements for verification.</a>
        </p>

       {repo?.topics && (
        <div style={{ marginTop: "1rem" }}>
           <p style={{ fontWeight: "bold", fontSize: "14px" }}>Categories</p>
          {repo?.topics.map((topic: string) => (
            <span style={tagStyle}>{topic}</span>
          ))}
        </div>
       )}
      </div>

      {/* Right Main Section */}
      <div>
        <p style={{ color: "#555", fontSize: "14px" }}>Application</p>
        <h1 style={{ fontSize: "28px" }}>{repo.name}</h1>

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            margin: "1rem 0",
            padding: "10px 20px",
            background: "linear-gradient(90deg, #28a745, #218838)",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #20c997, #17a2b8)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #28a745, #218838)")
          }
        >
          Set up a plan
        </a>

        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
          {repo.description || "No description available."}
        </p>
        <p style={{ fontSize: "16px", marginTop: "1rem", color: "#333" }}>
          Install this app and get your project prebuild, so you don't have to
          wait for your build downloading the internet when starting a {repo?.name}{" "}
          workspace 🚀
        </p>
      </div>
    </div>
  );
};

const tagStyle = {
  display: "inline-block",
  backgroundColor: "#eee",
  padding: "4px 8px",
  margin: "4px 4px 0 0",
  borderRadius: "4px",
  fontSize: "12px",
  color:"#318CE7",
  fontWeight:"bold"
};

export default RepoDetailPage;
