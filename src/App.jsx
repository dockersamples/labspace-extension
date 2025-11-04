import "./App.scss";
import { CatalogContextProvider } from "./CatalogContext";
import { DockerContextProvider } from "./DockerContext";
import { Home } from "./Home";

function App() {
  return (
    <CatalogContextProvider>
      <DockerContextProvider>
        <Home />
      </DockerContextProvider>
    </CatalogContextProvider>
  );
}

export default App;
