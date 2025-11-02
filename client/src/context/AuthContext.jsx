import React, { createContext, useState, useEffect, useContext } from "react";
import { use } from "react";

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(()=>{
        const savedUser=localStorage.getItem('user')
        return savedUser?JSON.parse(savedUser):null
    })
    const [token,setToken]=useState(()=>localStorage.getItem('token')||null);



    useEffect(()=>{
    if(user) localStorage.setItem('user',JSON.stringify(user))
    else localStorage.removeItem('user')
if(token) localStorage.setItem('token',token)
        else localStorage.removeItem('token')
    }  ,[user,token])

  const login=(userData,jwtToken)=>{
    setUser(userData);
    setToken(jwtToken);
  } 

    const logout=()=>{

   setUser(null);
   setToken(null);
    }

    return(
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext);



