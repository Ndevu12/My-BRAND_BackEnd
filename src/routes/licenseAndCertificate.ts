// const necessary modules
import { Router } from 'express';
import licenseAndCertificateController from '../controllers/licenseAndCertificateController.js';
import { isAdmin } from '../middlewares/auth.ts';

// Create a router instance
const router = Router();

// Define routes
router.patch('/create', isAdmin, licenseAndCertificateController.createLicenseCertificate);
router.patch('/update/:id', isAdmin, licenseAndCertificateController.updateLicenseCertificate);
router.get('/:id', licenseAndCertificateController.findLicenseAndCertificateById);
router.get('/All', licenseAndCertificateController.getAllLicenseCertificates);
router.delete('/delete/:id', isAdmin, licenseAndCertificateController.deleteLicenseCertificate);

// hijokl
// Export the router
export default router;
