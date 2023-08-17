import axios from "axios";
import {authResponse} from "../types/Auth";

const generateRandomString = (length: number): string => {
  let text: string = '';
  const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i:number = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
const generateCodeChallenge = async (codeVerifier)=> {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder: TextEncoder = new TextEncoder();
  const data: Uint8Array = encoder.encode(codeVerifier);
  const digest: ArrayBuffer = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}
const login = async (event) => {
  event.preventDefault();
  const codeVerifier: string = generateRandomString(128);

  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    const state:string = generateRandomString(16);
    const scope: string = 'user-read-private user-read-email user-top-read';

    localStorage.setItem('code_verifier', codeVerifier);

    const args = new URLSearchParams({
      response_type: 'code',
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    })

    window.location = 'https://accounts.spotify.com/authorize?' + args;
  })
}
const authorization = () => {
  const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
  const code: string = urlParams.get('code');
  const codeVerifier: string = localStorage.getItem('code_verifier');

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
    .then((response: authResponse) => {
      console.log('res2 ', response)
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('expires_in', response.data.expires_in)
      localStorage.setItem('refresh_token', response.data.refresh_token)
    })
    .catch(error => console.log('error: ', error))
}

export {
  login,
  authorization
}