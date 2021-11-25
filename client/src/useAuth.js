import  { useEffect, useState } from 'react';
import axios from 'axios';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

  //Add your REDIRECT URI
    useEffect(() => {
        axios.post("REDIRECT_URI/login", {
           code, 
        })
        .then(res => {
            console.log("Early Use Auth", res.data.accessToken);
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
            setExpiresIn(res.data.expiresIn);
            window.history.pushState({}, null, '/');
        })
        .catch(() => {
            window.location = '/';
        })
    
    }, [code])

        useEffect(() => {
            if(!refreshToken || !expiresIn) return
            const interval = setInterval(() => {

            //Add your REDIRECT URI
            axios.post("REDIRECT URI/refresh", {
            refreshToken, 
            })
            .then(res => {
                // console.log(res.data);
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn);
            })
            .catch(() => {
                window.location = '/'
            })

        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
        }, [refreshToken, expiresIn])
        console.log("Late Use Auth", accessToken)
    return accessToken
}
