import { createRoot } from "react-dom/client";
import "./index.scss";

const MovieFetchApp = () => {
  return (
    <div className="movie-fetch">
      <div>Good morning</div>
    </div>
  );
};

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(<MovieFetchApp />);
