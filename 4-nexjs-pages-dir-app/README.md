NextJS Sample app

Built with Next JS & next-auth

```
    npm install
    npm run dev
```

Auth provider configurations

Callback url - https://next-auth.js.org/configuration/providers/oauth#how-to
`[origin]/api/auth/callback/[provider]`

ENV Configurations

```.env
# https://next-auth.js.org/configuration/options#nextauth_url
NEXTAUTH_URL=http://localhost:3000

# https://next-auth.js.org/configuration/options#secret
SECRET=

# clientId & secret for your asgardeo application
ASGARDEO_CLIENT_ID=XrbLjcNgTdDZi0fqK9YMOAOyF3Qa
ASGARDEO_CLIENT_SECRET=RgBuAJpDeMCLdwgyqWMufkZvg3zVqD9vB3K9Kf4iTpca
ASGARDEO_SCOPES=openid email profile

# https://api.asgardeo.io/t/[organziation]
ASGARDEO_SERVER_ORIGIN=https://api.asgardeo.io/t/webappsdemo

TODO_API_BASE_URL=http://localhost:8080
```
