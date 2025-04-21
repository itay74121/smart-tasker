import {expressjwt} from 'express-jwt'

export const silence = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.sendStatus(401); // no stack or HTML
    }
    next(err);
  }

export const express_jwt_middlewear = expressjwt({
      algorithms:["HS256"],
      secret:process.env.SECRET
  }).unless({
      path:["/api/health","/api/register","/api/login"]
  })
