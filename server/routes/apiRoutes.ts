import { Router } from 'express';
import {
  handleGetFeaturedMenu,
  handleGetGallery,
  handleGetMenu,
  handleGetTestimonials,
  handlePostContact,
  handlePostNewsletter,
} from '../controllers/publicController.ts';

export const apiRouter = Router();

apiRouter.get('/menu', handleGetMenu);
apiRouter.get('/menu/featured', handleGetFeaturedMenu);
apiRouter.get('/gallery', handleGetGallery);
apiRouter.get('/testimonials', handleGetTestimonials);
apiRouter.post('/contact', handlePostContact);
apiRouter.post('/newsletter', handlePostNewsletter);
