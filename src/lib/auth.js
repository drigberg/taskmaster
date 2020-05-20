const AUTH_DOMAIN = 'auth.taskmove.info';
const APP_CLIENT_ID = '2dk1d5ui82qphjilrne82e3vuu';
const SCOPE = 'aws.cognito.signin.user.admin+email+openid+profile';

let callback_url = 'https://taskmove.info/';
if (process.env.NODE_ENV !== 'production') {
    callback_url = 'http://localhost:3000/';
} 

export function redirectToHostedSigninPage() {
    // TODO: add challenge and challenge method
    window.location = `https://${AUTH_DOMAIN}/login?response_type=code&client_id=${APP_CLIENT_ID}&redirect_uri=${callback_url}&scope=${SCOPE}`;
}

