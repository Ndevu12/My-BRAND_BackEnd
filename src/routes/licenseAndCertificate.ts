// const necessary modules
import { Router } from 'express';
import licenseAndCertificateController from '../controllers/licenseAndCertificateController.ts';
import { isAdmin } from '../middlewares/auth.ts';

const licenseAndCertificateRoutes: Router = Router();

licenseAndCertificateRoutes.patch('/create', isAdmin, licenseAndCertificateController.createLicenseCertificate);
licenseAndCertificateRoutes.patch('/update/:id', isAdmin, licenseAndCertificateController.updateLicenseCertificate);
licenseAndCertificateRoutes.get('/:id', licenseAndCertificateController.findLicenseAndCertificateById);
licenseAndCertificateRoutes.get('/All', licenseAndCertificateController.getAllLicenseCertificates);
licenseAndCertificateRoutes.delete('/delete/:id', isAdmin, licenseAndCertificateController.deleteLicenseCertificate);

export { licenseAndCertificateRoutes };
