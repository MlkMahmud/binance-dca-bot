import { Router } from 'express';
import controller from './controller';

const router = Router();

router.get('/api/timezones', (req, res) => {
  const timezones = controller.fetchTimezones(req.query.q as string);
  res.json({ data: timezones });
});

router.get('/api/symbols', async (req, res, next) => {
  try {
    const symbols = await controller.fetchSymbols(req.query.q as string);
    res.json({ data: symbols });
  } catch (err) {
    next(err);
  }
});

router.get('/api/balance', async (_, res, next) => {
  try {
    const balances = await controller.fetchAccountBalance();
    res.json({ data: balances });
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
  .patch(async (req, res, next) => {
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

router.patch('/api/settings/general', async (req, res, next) => {
  try {
    const { status, ...rest } = await controller.updateSettings(req.body);
    res.status(status).json(rest);
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

router.post('/logout', (_req, res) => {
  res.clearCookie('accessToken');
  res.status(200).end();
});

router
  .route('/api/jobs')
  .get(async (_, res, next) => {
    try {
      const jobs = await controller.fetchAllJobs();
      res.json({ data: jobs });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { status, ...payload } = await controller.createJob(req.body);
      res.status(status).json(payload);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/api/jobs/:jobId')
  .delete(async (req, res, next) => {
    try {
      const { status, message } = await controller.deleteJob(req.params.jobId);
      res.status(status).json({ message });
    } catch (err) {
      next(err);
    }
  })
  .get(async (req, res, next) => {
    try {
      const { status, ...payload } = await controller.fetchJob(
        req.params.jobId
      );
      res.status(status).json(payload);
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const { status, ...rest } = await controller.updateJob(
        req.params.jobId,
        req.body
      );
      res.status(status).json(rest);
    } catch (err) {
      next(err);
    }
  });

router.get('/api/jobs/:jobId/orders', async (req, res, next) => {
  try {
    const payload = await controller.getOrders(req.params.jobId);
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

router.patch('/api/orders/:orderId', async (req, res, next) => {
  try {
    const { orderId, symbol } = req.body;
    const { status, ...payload } = await controller.updateOrderStatus({
      orderId,
      symbol,
    });
    res.status(status).json(payload);
  } catch (err) {
    next(err);
  }
});

export default router;
