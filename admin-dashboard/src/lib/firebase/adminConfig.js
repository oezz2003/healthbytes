/**
 * تكوين Firebase Admin SDK
 * 
 * تنبيه أمني: يجب نقل هذه المعلومات الحساسة إلى متغيرات بيئية
 * أو استخدام نظام إدارة أسرار آمن بدلاً من تخزينها في كود المصدر
 */
const adminConfig = {
  type: "service_account",
  project_id: "application-63412",
  private_key_id: "f7aa556964e6acab0898430f83b5edee7893289b",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSlGMbQv07yiNP\nuRm+s4y3hepgHm3DWKo6mJmONf+zM72gQnf7VpKmUD3Xjoyu8wvnV0Wf0Z24HXw9\ncrpp/dLV2f2AMvAwMih11/hUf0MHr+hZ6UXoqvUG0Px+G9tW4dQygCPVq66Y0C4t\nQstvR8ZLFwNPChLFyCVxTf54IMRqPv4O1rozvAskdsTJCRseW+goFdtEwknU38ig\nHAJwWqGAXJPgkENI+BmVdnLP3fzkMkgpS0OF4NJtUsZnxftjreV2+F9/30pWpOYr\niO2kxBftwN6iOLSUw3nYcqkjwczOdMr4Pdb/EzCyX9Psu15rCQPg0GukRh/o8u1W\nqlD8rvT7AgMBAAECggEADg0wyPKhHYqIEdJgvyBa53QlUCpcNT+rqf5zqdEYn35T\nzPnZVpuY2iFa46NhMP/4AamcBpxhCCi0GREGN2j21u9w5wI2AWXgkwESUsNkV15n\nTZ0vS1NGNUWpU5DwTM2WFQG9q4zy7+eCEeH2ABZilGgmbYPE2XyiGdcmf9fiMRuA\nduaq860fO/ONBc2H+FcJmnYkiz/Q592O7y8cCGtA3Rj46zHTRuBUbxFs9+T8EZdC\nXvYPRxxFVO+Ehu2msWlvfvYl+dZ2kCJS+OgMXttNFIcof/cmlvnda4mOVzVQPKKx\nRJ0WAuQR69n8MZm8IlwUeQILWxL1sZf0SWVkkSLsoQKBgQD6NDCiWlBkkL3CX83g\ndB9rZqn8x0mF5j0SxIwqjBXMwm+4Mon8kddmCLXuhy465pr4mC/l8bjrEX42Ma4f\nSVGnetUSZYwn51XdC5l9XQkQxXCHusmDRScUXTaujaqIDVPk0LfAJSu3+8Sl0MIn\n+yZ8KK3vsoJfLY2nvvMTg9DtnwKBgQDXdTWffUrVC2GC++50sXPvgT5vHgxxMXXK\nBMEP4fgWHjCcrpD8g3gVBxLWXLWuRWH1dC4Zzjg8QOLUAchAgrg+9xdFV9C4JJgl\nEV/kjYdIdrV3544edDaMb8DvzcYD6aq0sAh2Dcxt2Kop2hAGZV5mgXZbmUkCh/Oy\nOqhF4zRDJQKBgGv5PcuyYeMkO1+4bGYidrSol08IyYfJNi31N+/ciEPW3NOGq9md\nLnFP7QNEvwSYI+SH+JOo3v5CjE7i3ZuOzngSIAVSYUuPH5TGvrRFA/aC3e8VAoVt\nwFGfcEufwyn3Zm7mS4XWBKnfMpvEHSWX0qHeBEHerThZtjnfw5J2XiFNAoGBAIoV\nsoI++IDFxH8AG3lqaVUsTelFJtA81LLejSUyu57hRmKEdqN/VqyTVf1QeZfxG7EF\n/q3HPr9PDpC1e7Psk0y3a5CjkT8TJPdMxVpjYjqM6gyouKrH7FXhIZQPG0NStHcN\nAr82ZLhZzeT4vqB6wx+LBWH7QZF/tC2b7lCsJsiJAoGBAJMgsLpdaHC1JdxHg17j\n50msRqDZ5sYHli3Lka2yhoQWwKIyabV5P12nRn2CSmnFwZkHFeyzV+LGZJWXGhDR\nISFoB++ovD2JORPi47yq46itxQf0PdChl3CUH0W2EeAtqeWqZJqeG585hYLtHhuW\nrajE4OpkV8NtdKyMVMrDwmuh\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@application-63412.iam.gserviceaccount.com",
  client_id: "109284832433198895331",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40application-63412.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

module.exports = adminConfig; 