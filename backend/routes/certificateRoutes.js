const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const { excelUpload, imageUpload, documentUpload } = require("../middleware/upload");
const controller = require("../controllers/certificateController");
router.get("/verify/:certificateid", controller.verifyById);
router.post(
  "/verify/verify-image",
  imageUpload.single("certificate"),
  controller.verifyImage,
);
router.post("/add", verifyToken, controller.addCertificate);
router.post(
  "/upload",
  verifyToken,
  excelUpload.single("excelFile"),
  controller.uploadExcel,
);

router.post(
  "/certificates/:certificateid/document",
  verifyToken,
  documentUpload.single("document"),
  controller.uploadCertificateDocument,
);

module.exports = router;
