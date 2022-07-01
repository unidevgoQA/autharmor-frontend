



const verifyUserSession = async () => {
    try {

    const token = localStorage.getItem("token");

    if (token) {
        try{
        const me = await fetch(`http://localhost:8000/api/me`, {
            method: "GET",
            headers: {
            Authorization: `Token ${token}`
            }
        });
        res = await me.json().then(data => data);
        
        if (res) {
            console.log(res);
            document.querySelector("#userName").textContent = "Welcome! " + res.username;
            document.querySelector("#loginLink").textContent = "Logout";
            return true;
            
        }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    } catch (err) {
        console.log(err);
        return false;
    }
};

verifyUserSession();



function armor() {

    verifyUserSession().then(res => {
        if (res) {
            console.log(res)
            logout();
        } else {
            const apiUrl =
                location.host === "localhost:3000"
                ? "http://localhost:8000/api"
                : "";


            let selectedMethods = ["authenticator", "webauthn", "magiclink"];
            const AuthArmor = new window.AuthArmorSDK({
                endpointBasePath: `${apiUrl}/api/`, // (Optional) Your backend URL goes here
                publicKey:
                "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjhiNzhkYTFmLWU4NWEtNDg4Ny05MmQxLTcyNWZlNTg3MGFiZCJ9.eyJrZXkiOiJtdGk4Mk1aR3RmS2J6czlTVmVVUDc2UEoyZUwzR0Nzelo2NmhqaXJud1lHZWtrcXoiLCJpYXQiOjE2NTYwNzA3MTF9.WDn_wtS1MZ18GV-YrhCXzT5V0nHoKMJV3y8NF-UULFtdLBfaGtrPDw6DqMBfpNRRAHhNi9RfdXdLb3qhajNk6A",
                webauthnClientId: "78d58ed1-1a70-4543-ac55-15daf19ea1d3",
                registerRedirectUrl: `${location.origin}/magic-register`,
                authenticationRedirectUrl: `${location.origin}/magic-login`
            });


            const validateAuth = async data => {
                console.log('triggered')
                const response = await fetch(
                `${apiUrl}/auth/${data.auth_method}/validate`,
                {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                    requestId: data.id
                    })
                }
                );

                await response.json().then(data => {
                    if (data.token) {
                    localStorage.setItem("token", data.token);
                    location.reload();
                    }
                });
                
            };

            AuthArmor.form.mount(".form", {
                usernameless: true 
            });

            AuthArmor.form.mount(".form", {
                methods: selectedMethods
            });


            AuthArmor.on("authenticated", validateAuth);
            AuthArmor.on("registerSuccess", () => {
                location.reload();
            }
            );
        }
    });
}


function logout() {
    localStorage.removeItem("token");
    location.reload();
}


const url = new URL(location.href);
const aatoken = url.searchParams.get("token");

if (aatoken) {
    if (aatoken) {
        const response = fetch(
          `http://localhost:8000/api/auth/register/MagicLink/validate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              aatoken
            })
          }
        ).then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                location.reload();
            }
        });
        verifyUserSession();
      }
    
    
}
