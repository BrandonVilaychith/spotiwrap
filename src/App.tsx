import './App.css'
import { useEffect, useState } from "react";
import axios from "axios";

// interface tokenRes {
//   access_token: string,
//   expires_in: number,
// }
function App() {
  /*
    This will get us an access token to make request
   */
  const [token, setToken] = useState({access_token: "", expires_in: 0})

  useEffect(() => {
    if (localStorage.getItem('code_verifier') && !(localStorage.getItem('access_token'))) {
      authorization()
    }
  }, [])

  const generateRandomString = (length: number): string => {
    let text: string = '';
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i:number = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  const generateCodeChallenge = async (codeVerifier) => {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
  }

  const login = async (event) => {
    event.preventDefault();
    const codeVerifier = generateRandomString(128);

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
      const state:string = generateRandomString(16);
      const scope: string = 'user-read-private user-read-email';

      localStorage.setItem('code_verifier', codeVerifier);

      const args = new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: 'http://localhost:5173',
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
      })

      window.location = 'https://accounts.spotify.com/authorize?' + args;
    })
  }

  const authorization = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const codeVerifier = localStorage.getItem('code_verifier');

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:5173',
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      code_verifier: codeVerifier
    })

    axios.post('https://accounts.spotify.com/api/token', {}, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      params: params
    })
      .then(res => {
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('expires_in', res.data.expires_in)
      })
      .catch(error => console.log('error: ', error))
  }

  const getProfile = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');

    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })

    console.log('My data: ', response)
  }

  const artistSearch = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {headers: {
        Authorization: `Bearer ${token.access_token}`
        }});
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <h1>Hello</h1>
      <p>{token.access_token}</p>
      <button onClick={artistSearch}>search</button>
      <button onClick={login}>Login</button>
      <button onClick={authorization}>Auth</button>
      <button onClick={getProfile}>Get Profile</button>
    </>
  )
}

export default App
