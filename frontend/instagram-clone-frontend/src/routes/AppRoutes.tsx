import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";
import CreatePost from "../pages/CreatePost/CreatePost";
import Profile from "../pages/Profile/Profile";
import MainLayout from "../components/templates/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Notifications from "../pages/Notifications/Notifications";
import Messages from "../pages/Messages/Messages";
import Search from "../pages/Search/Search";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
            {/* Profile — own profile has no param, visiting another user uses :userId */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            {/* Both /notification and /notifications work */}
            <Route path="/notification" element={<Notifications />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* Messages */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<Messages />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
