import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <div className="p-4" style={{ background: "white", border: "2px dashed #d0d7df", borderRadius: 8, maxWidth: 500 }}>
        <h1 className="text-danger mb-3">404 - Page Not Found</h1>
        <p className="text-muted mb-4">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
