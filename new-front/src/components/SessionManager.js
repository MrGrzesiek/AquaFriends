
const handleResponse = async (response) => {
  try {
    const token = await response.json();
    localStorage.setItem("authToken", JSON.stringify(token));
    renewToken(44 * 60 * 1000);
    await checkIdentity(token)
  } catch (error) {
    console.error("Error processing response:", error);
  }
};

const renewToken = (delay) => {
    setTimeout(async () => {
      const tokenString = localStorage.getItem("authToken");
      const tokenObj = JSON.parse(tokenString);
      const responseIdentity = await checkIdentity(tokenObj);
      const meData = await responseIdentity.json();

      const formData = new FormData();
      formData.append("username", meData.username);
      formData.append("password", meData.password_hash);

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: formData,
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
    const testData = await testRes.json();
    return true;
  } catch (error) {
    console.error('Fetch error:', error);
    return false;
  };
}
export { checkBackend, handleResponse, checkTokenInLocalStorage, checkIdentity };
