import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <article>
      <h1>Unauthorized!</h1>
      <p>You dont have permission in this page!</p>
      <div className="flexGrow">
        <Link style={{ color: "#000" }} to="/home">Visit Our Homepage</Link>
      </div>
    </article>
  );
};

export default Unauthorized;