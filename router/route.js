import { Router } from "express";
const router = Router();

/** import controllers */
import * as controller from '../controllers/controller.js';
import { getResultsByBranchYearAndOptionalSection } from '../controllers/controller.js';

/** Questions Routes API */

router.route('/questions')
        .get(controller.getQuestions) /** GET Request */
        .post(controller.insertQuestions) /** POST Request */
        .delete(controller.dropQuestions) /** DELETE Request */

router.route('/result')
        .get(controller.getResult)
        .post(controller.storeResult)
        .delete(controller.dropResult)

// Route to fetch results by Branch, Year and Section
// http://localhost:5000/api/result/branch/cse/year/2/section/a
router.get('/result/branch/:branch/year/:year/section/:section?', getResultsByBranchYearAndOptionalSection);

export default router;