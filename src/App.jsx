import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import Upload_api from "./Components/Upload_api";
import DownloadVideo from "./Components/DownloadVideo";

const App = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Upload_api />,
      },
      {
        path: "download",
        element: <DownloadVideo />,
      },
    ],
  },
]);

export default App;
