import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Heart, MessageCircle, Search, X, Share2, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

// Modal Component for Full Blog Post
const BlogModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{post.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {post.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {post.author?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{post.author}</p>
                <p className="text-sm text-gray-400">
                  {(() => {
                    if (!post.createdAt) return 'Just now';
                    if (typeof post.createdAt === 'string' || post.createdAt instanceof Date) {
                      const date = new Date(post.createdAt);
                      if (!isNaN(date)) return date.toLocaleDateString();
                    }
                    if (typeof post.createdAt === 'object' && typeof post.createdAt.toDate === 'function') {
                      return post.createdAt.toDate().toLocaleDateString();
                    }
                    return 'Just now';
                  })()}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current text-red-500' : ''}`} />
                  <span>{post.likes || 0}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>
              <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Add New Blog Modal Component
const AddBlogModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, image });
    setFormData({ title: '', content: '', category: 'general' });
    setImage(null);
    setPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Create New Blog Post</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter your blog title..."
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="general">General</option>
                  <option value="health">Health & Wellness</option>
                  <option value="technology">Technology</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="personal">Personal Story</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog content..."
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 h-40 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="blog-image-upload"
                />
                <label
                  htmlFor="blog-image-upload"
                  className="block w-full text-center py-4 px-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-yellow-400 cursor-pointer transition duration-300"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <span className="text-gray-400">Click to upload an image</span>
                </label>
                {previewUrl && (
                  <div className="relative mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setImage(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const categoryMap = {
  general: 'Other',
  health: 'Other', // Map as needed
  technology: 'Technology',
  lifestyle: 'Lifestyle',
  personal: 'Other', // Map as needed
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useAuth();
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const maxPreviewLength = 150;

  // Cloudinary credentials
  const CLOUDINARY_UPLOAD_PRESET = 'KahaniAI';
  const CLOUDINARY_CLOUD_NAME = 'dqsixqhky';

  useEffect(() => {
    fetchPosts();
  }, [sortBy, selectedCategory]);

  useEffect(() => {
    const filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredPosts(filtered);
  }, [searchQuery, posts, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!isSignedIn) {
      alert('Please login to like posts');
      return;
    }

    try {
      const postRef = doc(firestore, 'blog_posts', postId);
      const post = posts.find(p => p.id === postId);
      const likesCollectionRef = collection(postRef, 'likes');
      
      if (post.isLiked) {
        // Unlike the post
        const likeQuery = query(likesCollectionRef, where('userId', '==', user.id));
        const likeSnapshot = await getDocs(likeQuery);
        
        if (!likeSnapshot.empty) {
          await deleteDoc(likeSnapshot.docs[0].ref);
        }
        
        await updateDoc(postRef, {
          likes: Math.max((post.likes || 0) - 1, 0)
        });

        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: Math.max((p.likes || 0) - 1, 0), isLiked: false }
            : p
        ));
      } else {
        // Like the post
        await addDoc(likesCollectionRef, {
          userId: user.id,
          createdAt: serverTimestamp()
        });

        await updateDoc(postRef, {
          likes: (post.likes || 0) + 1
        });

        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: (p.likes || 0) + 1, isLiked: true }
            : p
        ));
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleCreateBlog = async (blogData) => {
    if (!isSignedIn) {
      alert('Please login to create a blog post');
      return;
    }

    try {
      setLoading(true);
      let imageUrl = '';
      if (blogData.image) {
        imageUrl = await uploadImageToCloudinary(blogData.image);
      }
      // Map category to backend enum
      const backendCategory = categoryMap[blogData.category] || 'Other';
      const payload = {
        title: blogData.title,
        content: blogData.content,
        category: backendCategory,
        image: imageUrl,
        author: user?.fullName || user?.emailAddresses?.[0]?.emailAddress || 'Anonymous',
        authorId: user?.id,
      };
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchPosts();
      } else {
        alert('Error creating blog post: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Error creating blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content) => {
    if (content.length <= maxPreviewLength) return content;
    return content.substring(0, maxPreviewLength) + '...';
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'personal', label: 'Personal Story' }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0b1d] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b1d] py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Stories that <span className="text-yellow-400">Inspire</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Share your creative journey, inspire others, and be part of our growing community.
        </p>
      </motion.div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="newest">Newest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Blog Button */}
        {isSignedIn && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Blog</span>
          </motion.button>
        )}
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="text-white text-xl">Loading posts...</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(searchQuery || selectedCategory !== 'all' ? filteredPosts : posts).map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/30 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition duration-300"
            >
              {post.imageUrl && (
                <div 
                  className="aspect-video w-full overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    {post.category || 'general'}
                  </span>
                  {isSignedIn && user?.id === post.authorId && (
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <h2 
                  className="text-xl font-bold text-white mb-3 cursor-pointer hover:text-yellow-400 transition-colors"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.title}
                </h2>
                <div className="text-gray-400 mb-4">
                  <p>{truncateContent(post.content)}</p>
                  {post.content.length > maxPreviewLength && (
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-yellow-400 hover:text-yellow-300 mt-2 font-medium transition-colors"
                    >
                      Read More
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {(() => {
                        if (!post.createdAt) return 'Just now';
                        if (typeof post.createdAt === 'string' || post.createdAt instanceof Date) {
                          const date = new Date(post.createdAt);
                          if (!isNaN(date)) return date.toLocaleDateString();
                        }
                        if (typeof post.createdAt === 'object' && typeof post.createdAt.toDate === 'function') {
                          return post.createdAt.toDate().toLocaleDateString();
                        }
                        return 'Just now';
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 ${
                        post.isLiked ? 'text-red-500' : 'text-gray-400'
                      } hover:text-red-500 transition-colors duration-200`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-yellow-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && (searchQuery || selectedCategory !== 'all' ? filteredPosts : posts).length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="text-gray-400 text-xl">
            {searchQuery ? 'No posts found matching your search.' : 'No blog posts yet.'}
          </div>
          {isSignedIn && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-300"
            >
              Create the first blog post!
            </button>
          )}
        </div>
      )}

      {/* Blog Post Modal */}
      {selectedPost && (
        <BlogModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Add New Blog Modal */}
      <AddBlogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateBlog}
        loading={loading}
      />
    </div>
  );
};

export default Blog;