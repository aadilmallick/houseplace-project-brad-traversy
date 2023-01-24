import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Explore } from "./pages/Explore";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Offers } from "./pages/Offers";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Navbar } from "./components/Navbar";
import { Profile } from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import { PrivateRoute } from "./components/PrivateRoute";
import { Category } from "./pages/Category";
import { CreateListing } from "./pages/CreateListing";
import { DummyRoute } from "./pages/DummyRoute";
import { Listing } from "./pages/Listing";
import { Contact } from "./pages/Contact";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="/dummy" element={<PrivateRoute />}>
            <Route index element={<DummyRoute />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<PrivateRoute />}
          >
            <Route index element={<Listing />} />
          </Route>
          <Route path="/contact/:listingId" element={<PrivateRoute />}>
            <Route index element={<Contact />} />
          </Route>
        </Routes>
        <Navbar />
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
