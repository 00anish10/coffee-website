import { Router } from 'express';
import {
  handleAdminCreateGalleryImage,
  handleAdminCreateMenuItem,
  handleAdminCreateTestimonial,
  handleAdminDeleteGalleryImage,
  handleAdminDeleteMenuItem,
  handleAdminDeleteMessage,
  handleAdminDeleteTestimonial,
  handleAdminGetDashboard,
  handleAdminLogin,
  handleAdminMarkMessageRead,
  handleAdminUpdateMenuItem,
  handleAdminUploadGalleryImage,
} from '../controllers/adminController.ts';
import { requireAdminAuth } from '../middleware/auth.ts';

export const adminRouter = Router();

adminRouter.post('/login', handleAdminLogin);

adminRouter.use(requireAdminAuth);
adminRouter.get('/dashboard', handleAdminGetDashboard);
adminRouter.post('/menu', handleAdminCreateMenuItem);
adminRouter.patch('/menu/:id', handleAdminUpdateMenuItem);
adminRouter.delete('/menu/:id', handleAdminDeleteMenuItem);
adminRouter.post('/gallery/upload', handleAdminUploadGalleryImage);
adminRouter.post('/gallery', handleAdminCreateGalleryImage);
adminRouter.delete('/gallery/:id', handleAdminDeleteGalleryImage);
adminRouter.post('/testimonials', handleAdminCreateTestimonial);
adminRouter.delete('/testimonials/:id', handleAdminDeleteTestimonial);
adminRouter.patch('/messages/:id/read', handleAdminMarkMessageRead);
adminRouter.delete('/messages/:id', handleAdminDeleteMessage);
