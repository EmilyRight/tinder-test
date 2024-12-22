import "./App.css";
import { ReactTinderCards } from "./components/ReactTinderCards/ReactTinderCards";
import { MotionTest } from "./components/MotionTest/MotionTest";
import { NativeDnD } from "./components/NativeDnD/NativeDnD";

function App() {
  return (
    <>
      <ReactTinderCards />
      <NativeDnD />
      <MotionTest />
    </>
  );
}

export default App;
