import jwt from 'jsonwebtoken';
import User from './models';

function isApiRoute(path) {
  return path.startsWith('/api/');
}

export default async function authenticateRequest(req, res, next) {
  const {
    password, slack, telegram, timezone,
  } = await User.findOne().lean();
  const user = {
    password: {
      enabled: password.enabled,
      isSet: password.hash.length > 0,
    },
    slack,
    telegram,
    timezone,
  };

  if (!password.enabled) {
    req.user = user;
    next();
  } else {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      if (isApiRoute(req.path)) {
        res
          .status(403)
          .json({ message: 'You are not authorized to perform this action' });
      } else {
        next();
      }
    } else {
      jwt.verify(accessToken, process.env.JWT_SECRET, (err) => {
        if (err) {
          if (isApiRoute(req.path)) {
            res
              .status(403)
              .json({
                message: 'You are not authorized to perform this action',
              });
          } else {
            next();
          }
        } else {
          req.user = user;
          next();
        }
      });
    }
  }
}
