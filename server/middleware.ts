import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './models';
import { cleanUserObject } from './utils';

const JWT_SECRET = process.env.JWT_SECRET || '';

function isApiRoute(path: string) {
  return path.startsWith('/api/');
}

export default async function authenticateRequest(req: Request, res: Response, next: NextFunction) {
  const {
    password, slack, telegram, timezone,
  } = await User.findOne().lean();
  const user = cleanUserObject({
    password, slack, telegram, timezone,
  });

  if (!password.enabled) {
    //@ts-ignore
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
      jwt.verify(accessToken, JWT_SECRET, (err: any) => {
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
          //@ts-ignore
          req.user = user;
          next();
        }
      });
    }
  }
}
