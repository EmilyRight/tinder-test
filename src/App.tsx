import "./App.css";
import { DragProvider } from "./context/context";
import { ReactTinderCards } from "./components/NativeDnD/ReactTinderCards";

function App() {
  return (
    <DragProvider>
      <>
        <ReactTinderCards/>
      </>
    </DragProvider>
  );
}

export default App;
