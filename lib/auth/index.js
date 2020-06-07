/**
 * Module dependencies
 */

const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

/**
 * Module
 */

const JSON_WEB_KEYS = [
    {
        alg: 'RS256',
        e: 'AQAB',
        kid: 'JVPn30IMFqqKuuj+oZDoYrDWKkeNzEG/aADOcdNF/Jc=',
        kty: 'RSA',
        n: 'hAkm52qDfZUjrdfXlnJi85MpupLe-xnjLeu0rbJ0iVsQNAoatEOOUC_ODl5oh4xWj5jGO4HxLax3-2F3U8qH-Wurdndc5xzdIUHJf-5n0o80JwQzPSuD0QXlW7cK7ps-bAFU_NePKWHIK9J07Unfr5emFPShwRIykV9mrvPY6nfcSrLyR2uVKg2OTnDa4tkmu3jmcFZyC0li9kSO71zREvztN04f_nCHB6M1DshP8oP19Q5liy0zSvi1cbq633pcSxNsn9yZfreJRX51DwGB4vMpYtwbFln_jNRWPM1svN-HEH4fGS3yxvIUkunceKL8Tn-fbSpmTGVjwK2Xc0GS4Q',
        use: 'sig'
    },
    {
        alg: 'RS256',
        e: 'AQAB',
        kid: 'F+S+HzQU79OjJ/srlBpBEeKbNTsflE7yvkN/4KdKh9E=',
        kty: 'RSA',
        n: '3UHZEm7jt_h4pEzoOUeFuKtTPnBVk3EMNDt7YbSosP7_Vx9LBfye4cgVDNvNEYhdHnOAej1UnekztNp7KVTQa3Lc7ylYPudjPilx6KW0FT-WNR1EHEcNNTERk26PAsEgKk6lmd04VOMVpM6yw977tTQX0QdsUyIJ8u9kW41W7UedV_74OvUM7skbg-dx1s_Yst4BD2mmhLFT4GSZgiy8SrFZ2-eWGGEzFQ7F7YP1jrwRyWBnH1Dy_A3mQahGmThSWQOWH2PequAEwNdfOsCmaBEmiCcK5zZtZwAeUc7ZmDBHx_clJktpxKznbF3tRBgNRJhXHVHspevX4Sk6pDBQuw',
        use: 'sig'
    }
];


function validateAndParseToken(token) {
    const header = decodeTokenHeader(token);
    const jsonWebKey = getJsonWebKeyWithKID(header.kid);
    return verifyJsonWebTokenSignature(token, jsonWebKey);
}

function decodeTokenHeader(token) {
    const [headerEncoded] = token.split('.');
    const buff = new Buffer.from(headerEncoded, 'base64');
    const text = buff.toString('ascii');
    return JSON.parse(text);
}

function getJsonWebKeyWithKID(kid) {
    for (const jwk of JSON_WEB_KEYS) {
        if (jwk.kid === kid) {
            return jwk;
        }
    }
    return null;
}

function verifyJsonWebTokenSignature(token, jsonWebKey) {
    const pem = jwkToPem(jsonWebKey);
    return new Promise((resolve, reject) => {
        jwt.verify(token, pem, {algorithms: ['RS256']}, (err, decodedToken) => {
            if (err) {
                reject(err);
            } else {
                resolve(decodedToken);
            }
        });
    });
}

function setRefreshTokenCookie(res, refreshToken) {
    const cookieOptions = {
        SameSite: true,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 31 // ~ one month
    };

    if (process.env.ENV === 'PROD') {
        cookieOptions.secure = true;
        cookieOptions.domain = process.env.DOMAIN;
    }

    res.cookie('refreshToken', refreshToken, cookieOptions);
}

/**
 * Module exports
 */

module.exports = {
    setRefreshTokenCookie,
    validateAndParseToken,
};
