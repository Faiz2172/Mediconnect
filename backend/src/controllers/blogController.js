import { db } from '../config/database.js';
import { blogPosts } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const createBlog = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    
    const newBlog = await db.insert(blogPosts).values({
      title,
      content,
      category,
      image,
    }).returning();

    res.status(201).json({
      success: true,
      data: newBlog[0],
      message: 'Blog created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

export const getallblog = async (req, res) => {
  try {
    const allBlogs = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    res.status(200).json({
      success: true,
      data: allBlogs,
      count: allBlogs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

export const getblogbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(id)))
      .limit(1);

    if (blog.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

export const deleteblogbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(id))).returning();
    if (deleted.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: deleted[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};

export const updateblogbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, parseInt(id))).returning();
    if (updated.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updated[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};