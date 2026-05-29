import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'healthy',
    data: {
      service: 'devgear-store-server'
    }
  });
});

export default router;