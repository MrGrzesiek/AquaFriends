
const handleResponse = async (response) => {
  try {
    const token = await response.json();
    localStorage.setItem("authToken", JSON.stringify(token));
    renewToken(1000*60*44);
    console.log("odnowiono")
    await checkIdentity(token)
  } catch (error) {
    console.error("Error processing response:", error);
  }
};

const renewToken = (delay) => {
    setTimeout(async () => {
      const tokenString = localStorage.getItem("authToken");
      const tokenObj = JSON.parse(tokenString);

      const response = await fetch(`http://localhost:8000/auth/refresh_token?token=${tokenObj.access_token}`, {
        method: "GET",
      });
      await handleResponse(response);
    }, delay);
  };

const checkTokenInLocalStorage = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Token found in localStorage:", JSON.parse(token));
    } else {
      console.log("No token found in localStorage");//
    }
  };
const checkIdentity = async (tokenObj) =>{
  const meResponse = await fetch('http://localhost:8000/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenObj.access_token}`
        }
      });
  const meData = await meResponse.json();
    if (meData.scopes.includes('admin')) {
        localStorage.setItem("admin", true);
    }
  return meResponse;
}
const checkBackend = async () =>{
  try {
    const testRes = await fetch('http://localhost:8000/', {
      method: 'GET'
    });
    if (!testRes.ok) {
      throw new Error('Network response was not ok');
    }
    return true;
  } catch (error) {
    console.error('Fetch error:', error);
    return false;
  };
}
export { checkBackend, handleResponse, checkTokenInLocalStorage, checkIdentity };
