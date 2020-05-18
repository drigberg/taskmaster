const AUTH_DOMAIN = 'auth.taskmove.info';
const APP_CLIENT_ID = '2dk1d5ui82qphjilrne82e3vuu';
const CALLBACK_URL = 'https://taskmove.info/';
const SCOPE = 'aws.cognito.signin.user.admin+email+openid+profile';

export function redirectToHostedSigninPage() {
    // TODO: add challenge and challenge method
    window.location = `https://${AUTH_DOMAIN}/login?response_type=code&client_id=${APP_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=${SCOPE}`;
}

