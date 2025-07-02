import express from 'express';
import { createBlog, getallblog, getblogbyid, deleteblogbyid, updateblogbyid } from '../controllers/blogController.js';

const router = express.Router();

router.post('/', createBlog);
router.get('/', getallblog);
router.get('/:id', getblogbyid);
router.delete('/:id', deleteblogbyid);
router.put('/:id', updateblogbyid);

export default router;