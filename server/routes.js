import { Router } from 'express';
import controller from './controller';

const router = Router();

router.get('/symbols', async (req, res, next) => {
  try {
    const { q } = req.query;
    const symbols = await controller.fetchSymbols(q);
    res.json(symbols);
  } catch (err) {
    next(err);
  }
});

router.get('/balance', async (req, res, next) => {
  try {
    const balances = await controller.fetchAccountBalance();
    res.json(balances);
  } catch (err) {
    next(err);
  }
});

export default router;
