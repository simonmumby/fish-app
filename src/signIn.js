import React, { useEffect, useState } from "react";
import {auth,provider} from "./firebase";
import {signInWithPopup} from "firebase/auth";
import { createUser } from "./db";
import Home from "./Home";
import { addDoc } from "firebase/firestore";

function SignIn(){
    const [user, setUser] = useState(null);

    const formatUser = (user) => {
        return {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          provider: user.providerData[0].providerId,
          photoUrl: user.photoURL,
        }
      }

    const handleUser = (rawUser) => {
        if (rawUser) {
            const user = formatUser(rawUser)
            console.info(user);
            
            //Create user data specific for the app
            //createUser(user.uid, user)
            setUser(user)
            return user
        } else {
            setUser(false)
            return false
        }
    }

    const handleClick =()=> {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setUser(user);

                //handleUser(user);

                // Optionally, you can also store user information in localStorage
                localStorage.setItem("user", JSON.stringify(user));

                //handleUser(user);
            })
            .catch((error) => {
                console.error("Error signing in:", error.message);
            });
    }

    useEffect(() => {
        // Check if user is already signed in (from localStorage)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

return (
    <div>
        {user?<Home user={user}/>:
        <button onClick={handleClick}>Sign in With Google</button>
        }
    </div>
);
}
export default SignIn;