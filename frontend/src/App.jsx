import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TodoList from "./pages/TodoList";
import TodoDetails from "./pages/TodoDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/todo" element={<TodoDetails />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;