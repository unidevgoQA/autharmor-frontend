



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

    const formConfig = {
        preferences: {
            login: {
                authenticator: {
                    action_name: "Authenticator Login",
                    short_msg:
                        "Demo site login pending, please respond using the authenticator app",
                    timeout_in_seconds: 90
                },
                magicLink: {
                    action_name: "Magic Link Login",
                    short_msg:
                        "Demo site login pending, please respond by pressing the button below",
                    timeout_in_seconds: 800
                },
                webauthn: {
                    action_name: "WebAuthn Login",
                    short_msg:
                        "Demo site login pending, please respond by using the appropriate method",
                    timeout_in_seconds: 120
                }
            },
            register: {
                authenticator: {
                    action_name: "Authenticator Register",
                    short_msg:
                        "Demo site registration pending, please respond using the authenticator app",
                    timeout_in_seconds: 90
                },
                magicLink: {
                    action_name: "Magic Link Register",
                    short_msg:
                        "Demo site registration pending, please respond by pressing the button below",
                    timeout_in_seconds: 300
                },
                webauthn: {
                    action_name: "WebAuthn Register",
                    short_msg:
                        "Demo site registration pending, please respond by using the appropriate method",
                    timeout_in_seconds: 120
                }
            }
        }
    };

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
                clientSdkApiKey:
                "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjhiNzhkYTFmLWU4NWEtNDg4Ny05MmQxLTcyNWZlNTg3MGFiZCJ9.eyJrZXkiOiJtdGk4Mk1aR3RmS2J6czlTVmVVUDc2UEoyZUwzR0Nzelo2NmhqaXJud1lHZWtrcXoiLCJpYXQiOjE2NTYwNzA3MTF9.WDn_wtS1MZ18GV-YrhCXzT5V0nHoKMJV3y8NF-UULFtdLBfaGtrPDw6DqMBfpNRRAHhNi9RfdXdLb3qhajNk6A",
                webauthnClientId: "78d58ed1-1a70-4543-ac55-15daf19ea1d3",
                registerRedirectUrl: `${location.origin}/magic-register`,
                authenticationRedirectUrl: `${location.origin}/profile`
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
                methods: selectedMethods, ...formConfig
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
const auth_id = url.searchParams.get("auth_id") || undefined;

const magicLoginRequestId = url.searchParams.get("magicLoginRequestId") || undefined;

const magicLoginToken = url.searchParams.get("magicLoginToken");

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
            console.log("Account created")
           
        });
        // verifyUserSession();
      }
}

if (magicLoginToken) {
    fetch(
      `http://localhost:8000/api/auth/login/MagicLink/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          magicLoginToken,
            magicLoginRequestId
        })
      }
    ).then(r => {
        console.log(r.body);
        // if (data.token) {
        //     localStorage.setItem("token", data.token);
        //     location.reload();
        // }
    });
    verifyUserSession();
}


