const {USER_CREDENTIALS} = process.env

const userCredentials = {}
USER_CREDENTIALS?.split(';')?.forEach((creds) => {
  const [user, pass] = creds.split(':')
  if (user && pass) {
    userCredentials[user] = pass
  }
})
 
export const config = {
  // Only run the middleware on the home route
  matcher: '/',
}

const toUserPass = (basicAuth) => {
  try {
    const authValue = basicAuth.split(' ')[1]
    return atob(authValue).split(':')
  } catch {
    return [null, null]
  }
}

const checkIsAuthorized = (user, pass) => {
  return user && pass && userCredentials[user] === pass
}

export default function middleware(req) {
  const [user, pass] = toUserPass(req.headers.get('authorization'))
  const isAuthorized = checkIsAuthorized(user, pass)
  
  if (!isAuthorized) {
    return new Response('Please log in', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'WWW-Authenticate': 'Basic realm=\'CMS Documentaion\''
      },
    })
  }
}
