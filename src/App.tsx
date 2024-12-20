import "./App.css";
import { ReactTinderCards } from "./components/first-section/ReactTinderCards";
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
