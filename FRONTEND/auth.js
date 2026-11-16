const registerForm = document.getElementById("registerForm");
if(registerForm) {
    registerForm.addEventListener("submit", async(event) => {
        event.preventDefault();
        const userName = document.getElementById("name").value;
        const userEmail = document.getElementById("email").value;
        const userPassword = document.getElementById("password").value;
       
        try {
            const respose = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    password: userPassword
                })
            });
            const data = await respose.json();

            if(!respose.ok) {
                throw new Error(data.message || "Registration failed");
            }
            alert("Registration successfully");
            window.location.href = "login.html";

        } catch(error) {
            console.log("Registration Error:", error.message);
            alert(error.message);
        }
    });
}


const loginForm = document.getElementById("loginForm");
if(loginForm) {
    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();
        const userEmail = document.getElementById("email").value;
        const userPassword = document.getElementById("password").value;

        try {
            const respose = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword
                })
            });
            const data = await respose.json();

            if(!respose.ok){
                throw new Error(data.message || "Login failed");
            }
            localStorage.setItem("token", data.token);

            alert("Login successfully!");

            window.location.href = "index.html";

        } catch(error) {
            console.log("Login Error:", error.message);
            alert(error.message);
        }

    });
}