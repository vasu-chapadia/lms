import { useState } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import PdfViewerComponent from "./components/PdfViewer";
import Dashboard from "./pages/Dashboard";
import Login from './components/Login'
import NoMatch from "./pages/404";

function App() {
  const [document, setDocument] = useState("document.pdf");

  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<Login />}/>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="pdf"
            element={
              <PdfViewerComponent
                document={document}
              />
            }
          />
          <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
}

export default App;
