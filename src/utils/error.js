import { toast } from "react-toastify";

export function showError(e) {
  console.dir(e);
  switch (e.code) {
    case "auth/email-already-in-use":
      toast.error("Email is already registered.");
      break;
    case "auth/user-not-found":
      toast.error("Wrong user credentials.");
      break;
    case "auth/weak-password":
      toast.error("Weak password. Password should be at least 6 characters.");
      break;
    case "auth/popup-closed-by-user":
      toast.info("popup closed.", { autoClose: 2000 });
      break;
    default:
      toast.error("Something went wrong!");
      break;
  }
}
