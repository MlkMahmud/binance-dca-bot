import { Router } from 'express';
import controller from './controller';

const router = Router();

router.get('/api/timezones', (req, res) => {
  const timezones = controller.fetchTimezones(req.query.q);
  res.json(timezones);
});

router.get('/api/symbols', async (req, res, next) => {
  try {
    const symbols = await controller.fetchSymbols(req.query.q);
    res.json(symbols);
  } catch (err) {
    next(err);
  }
});

router.get('/api/balance', async (req, res, next) => {
  try {
    const balances = await controller.fetchAccountBalance();
    res.json(balances);
  } catch (err) {
    next(err);
  }
});

router
  .route('/api/settings/password')
  .post(async (req, res, next) => {
    try {
      const { status, message } = await controller.setPassword(req.body);
      res.status(status).json({ message });
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      const { status, message } = await controller.updatePassword(req.body);
      if (status < 400) {
        res.clearCookie('accessToken');
      }
      res.status(status).json({ message });
    } catch (err) {
      next(err);
    }
  });

router.put('/api/settings/general', async (req, res, next) => {
  try {
    const { status, user, message } = await controller.updateSettings(req.body);
    res.status(status).json({ user, message });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res) => {
  const { password } = req.body;
  const { accessToken, message, status } = await controller.loginUser(password);
  if (accessToken) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }
  res.status(status).json({ message });
});

export default router;
