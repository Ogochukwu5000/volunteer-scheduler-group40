import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({})
//the provider will apply to all the children and with this, you are sending state DOWN the application and NOT UP. 
//It allows us to access state anywhere within our application
export function UserContextProvider({children}) {
    const [user, setUser] = useState(null) //assuming no user is logged in
    useEffect(() =>{// you dont want to have an async func in useEffect
        if (!user){
            axios.get('/profile').then(({data}) => {
                setUser(data)
            })
        }
    }, []) //empty array dependency
    return(
        <UserContext.Provider value ={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}