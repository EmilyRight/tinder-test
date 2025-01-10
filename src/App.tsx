import "./App.css";
import { DragProvider } from "./context/context";
import TinderCards from "./components/TinderCards";

function App() {
  return (
    <DragProvider>
      <>
        <TinderCards/>
      </>
    </DragProvider>
  );
}

export default App;
