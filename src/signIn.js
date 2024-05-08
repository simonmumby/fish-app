import React, { useEffect, useState } from "react";
import {auth,provider} from "./firebase";
import {signInWithPopup} from "firebase/auth";
import Home from "./Home";

function SignIn(){
    const [user,setUser] = useState('')

    const handleClick =()=> {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                setUser(user);
                // Optionally, you can also store user information in localStorage
                localStorage.setItem("user", JSON.stringify(user));
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