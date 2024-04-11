// const necessary modules
import { Router } from 'express';
import licenseAndCertificateController from '../controllers/licenseAndCertificateController.js';

// Create a router instance
const router = Router();

// Define routes
router.post('/licenseAndCertificate/:id/createLicenseCertificate', licenseAndCertificateController.createLicenseCertificate);
router.put('/licenseAndCertificate/:id/updateLicenseCertificate', licenseAndCertificateController.updateLicenseCertificate);
router.get('/licenseAndCertificate/:id/findLicenseAndCertificateById', licenseAndCertificateController.findLicenseAndCertificateById);
router.get('/licenseAndCertificate/getAllLicenseCertificates', licenseAndCertificateController.getAllLicenseCertificates);
router.delete('/licenseAndCertificate/:id/deleteLicenseCertificate', licenseAndCertificateController.deleteLicenseCertificate);

// hijokl
// Export the router
export default router;
