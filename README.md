# Authentication

## Signing Up

```js
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
```

```js
async function signIn() {
  const auth = getAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  updateProfile(auth.currentUser, { displayName: name });
}
```

## Sign in

```js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
```

```js
async function login(email, password) {
  const auth = getAuth();
  const { user } = await signInWithEmailAndPassword(auth, email, password);
}
```

## Sign out

```js
import { getAuth, signOut } from "firebase/auth";
```

```js
const onLogout = async () => {
  const auth = getAuth();
  await signOut(auth);
};
```

## React Toastify

### Basic usage

```js
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
```

1. Setup a `<ToastContainer>` **once** in your react app. A common place is the `<App>` component.
2. Use the `toast` object to use its methods like `toast.error()` or `toast.success()` to toast messages.

```js
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const notify = () => toast("Wow so easy !");

  return (
    <div>
      <button onClick={notify}>Notify !</button>
      <ToastContainer />
    </div>
  );
}
```

### Toast API

- `toast.success(message, ?options)` : toasts a specified success message
- `toast.error(message, ?options)` : toasts a specified error message
- `toast.info(message, ?options)` : toasts a specified info message
- `toast.warn(message, ?options)` : toasts a specified warning message
- `toast.dismiss()` : clears all toasts.

#### Toasting in different positions

```js
const notify = () => {
  toast("Default Notification !");

  toast.success("Success Notification !", {
    position: toast.POSITION.TOP_CENTER,
  });

  toast.error("Error Notification !", {
    position: toast.POSITION.TOP_LEFT,
  });

  toast.warn("Warning Notification !", {
    position: toast.POSITION.BOTTOM_LEFT,
  });

  toast.info("Info Notification !", {
    position: toast.POSITION.BOTTOM_CENTER,
  });

  toast("Custom Style Notification with css class!", {
    position: toast.POSITION.BOTTOM_RIGHT,
    className: "foo-bar",
  });
};
```

#### Toasting with promises

```js
const resolveAfter3Sec = new Promise((resolve) => setTimeout(resolve, 3000));
toast.promise(resolveAfter3Sec, {
  pending: "Promise is pending",
  success: "Promise resolved 👌",
  error: "Promise rejected 🤯",
});

const functionThatReturnPromise = () =>
  new Promise((resolve) => setTimeout(resolve, 3000));
toast.promise(functionThatReturnPromise, {
  pending: "Promise is pending",
  success: "Promise resolved 👌",
  error: "Promise rejected 🤯",
});
```

## Private Route

1. Create a `<PrivateRoute>` component, which we will build as a nesting route that nests other routes that we want to protect and check authentication for.
2. Create a `useAuthStatus()` hook, for loading and authentication state.

```js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

export const PrivateRoute = () => {
  const { loggedIn, loading } = useAuthStatus();

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};
```

```js
import { PrivateRoute } from "./components/PrivateRoute";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
        </Routes>
        <Navbar />
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}
```

```js
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setLoading(false);
    });
  }, []);

  return { loggedIn, loading };
};
```

## Forgot Password

To send a forgot password link, simply use the `sendPasswordResetEmail()` method from firebase, passing in `auth` and `email`.

```js
const onSubmit = async (e) => {
  e.preventDefault();
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    toast.success("Email was sent");
  } catch (e) {
    showError(e);
  }
};
```

## Google OAuth

The basic steps are as follows:

1. Instantiate a provider with the `GoogleAuthProvider()` function, which returns an authentication provider
2. Use that provider in the `signInWithPopup(auth, provider)` function, which will then sign in the user with a popup.

### Code

1. Import the `GoogleAuthProvider` and `signInWithPopup` from firebase/auth

```js
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
```

2. Create a provider using the `GoogleAuthProvider()` function, and then pass that in to the `signInWithPopup(auth, provider)` function, which takes in the firebase auth and the authentication provider as arguments.

```js
async function signInWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(auth, provider);
}
```

> example code

```js
const onGoogleClick = async () => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    toast.success("Thanks for signing in!");
    navigate("/");
  } catch (e) {
    console.error(e);
    showError(e);
  }
};
```

# Working with firebase

## Querying

## Creating a form the smart way

## Vite environment variables

## File upload

File upload with Firebase involves using the firebase storage API, and following these steps:

1. Creating a reference to where you want to upload the image inside your firebase storage
2. Upload the data to firebase

> File Input

The value of the file input in your JSX, if attached to state, should set its value to `e.target.files` in the `onChange`. This returns a `FileList` iterable, which is like a list.

```jsx
<input
  type="file"
  id="images"
  className="border border-primary p-2 rounded mt-4"
  onChange={(e) => setFiles(e.target.files)}
  max="6"
  accept=".jpg,.png,.jpeg"
  multiple
/>
```

> Setting up upload

1. Instantiate firebase storage

```js
const storage = getStorage();
```

2. create a ref to where you want to upload your file to in the storage.

Each file you upload to firebase must have a unique name. So using uui4 is common here.

```js
const filename = `${theUser.uid}-${image.name}-${uuidv4()}`;
const storageRef = ref(storage, `images/${filename}`);
```

> Uploading by bytes: straightforward

The `uploadBytes(reference, blob)` asynchronous function takes in two arguments: a reference, and blob file data.

- `reference` : the `ref` object of where to upload the file to.
- `blob` : a binary representation of a file. You can get this from `e.target.files[n]`, where a single element in the `e.target.files` array is the BLOB of a file uploaded.

Then you can get the online url where firebase is hosting this data using the async `getDownloadURL(reference)` function, which takes in a ref as an argument:

- `reference` : the `ref` object of which file in your storage you want to get the url for.

```js
await uploadBytes(storageRef, imageData);
const url = await getDownloadURL(storageRef);
```

> Uploading with progress

```js
async function uploadImage(image) {
  const storage = getStorage();
  const filename = `${theUser.uid}-${image.name}-${uuidv4()}`;
  const storageRef = ref(storage, `images/${filename}`);
  const uploadTask = uploadBytesResumable(storageRef, image);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}
```

> Getting uploaded files

```js
const [images, setImages] = useState([]);

useEffect(() => {
  listAll(ref(storage, "images/"))
    .then(async (images) => {
      console.log(await getDownloadURL(images.items[0]));
      setImages(
        await Promise.all(
          images.items.map(async (reference) => await getDownloadURL(reference))
        )
      );
    })
    .catch((e) => console.log(e));
}, []);
```

```js
useEffect(() => {
  async function fetchPhotos() {
    setLoading(true);
    const response = await listAll(ref(storage, "images/"));
    const urls = await Promise.all(
      response.items.map(async (reference) => {
        return await getDownloadURL(reference);
      })
    );
    setImages(urls);
  }

  fetchPhotos().then(() => setLoading(false));
}, []);
```

The async `listAll()` function takes in a storage reference, and lists all the items belonging to that ref. To get all files from a folder, just type in the folder name as the id.

- Returns a `response`, and `response.items` is the array of files represented as references from your folder.

In the `useEffect` above, I follow these steps:

1. Fetch all desired refs from the image folder with `listAll(ref(storage, "images/"))`
2. For each reference, get their respective online url using `getDownloadURL()`.

## Janky promises and array iteration

When using async functionality in array iteration methods, async await actually doesn't work as expected. The array iteration will not wait for async functionality to be completed. So instead, you have to use the `Promise.all()` in conjunction.

```js
const urls = await Promise.all(
  response.items.map(async (reference) => {
    return await getDownloadURL(reference);
  })
);
```

In the code above, the `map()` method will actually return an array of promises, **even if you specify the passed in function as `async`**. Then we resolve that array of promises with `Promise.all()`

So, the code below would actually be perfectly fine and more readable:

```js
const urls = await Promise.all(
  response.items.map((reference) => getDownloadURL(reference))
);
```

# Finish project

## Leaflet map

1. Install dependencies

```bash
npm i leaflet react-leaflet
```

2. Copy leaflet css and put in in the `<head>` of your `index.html`

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
  integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
  crossorigin=""
/>
```

3. Setup a basic map

```js
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

export const Map = () => {
  <div className="h-96">
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  </div>;
};
```

Gotchas to look out for:

- The containing element of the `<MapContainer>` needs to have a defined height.
- The `<MapContainer>` must explicitly be styled in width and height.

## Swiper image slider

## More firebase

> Deleting

Use the async `delecteDoc(doc)` method to delete a specified document, which takes in a specified document reference and then deletes it.

```js
await deleteDoc(doc(db, "collection-name", docId));
```

## Pagination

Pagination for a data resource involves keeping track of state, say like a `lastFetchedItem`, and then using the `startAfter()` query function in your firebase queries.

1. Set `lastFetchItem` to whatever was your last fetched item
2. Whne you click on a show more button, fetch more data, starting after the `lastFetchItem`, and set the `lastFetchItem` to the newly last fetched item.
