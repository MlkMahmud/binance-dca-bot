import { Router } from 'express';
import baseController from '../controllers/baseController';

const router = Router();

router.get('/api/symbols', async (req, res) => {
  const { q } = req.query;
  const symbols = await baseController.fetchSymbols(q);
  res.json(symbols);
});

export default router;
