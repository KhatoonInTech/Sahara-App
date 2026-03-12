import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Plus, Send, MoreHorizontal, Flag, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../i18n';
import { Language, Post } from '../types';

interface CommunityProps {
  language: Language;
}

export default function Community({ language }: CommunityProps) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: language === 'en' ? 'I finally felt strong enough to go for a walk today. Small steps.' : 'میں نے آخر کار آج چہل قدمی کے لیے کافی طاقت محسوس کی۔ چھوٹے قدم۔',
      author: 'Anonymous Survivor',
      timestamp: Date.now() - 3600000,
      likes: 12,
      commentsCount: 3
    },
    {
      id: '2',
      content: language === 'en' ? 'Does anyone know a good therapist in Lahore who specializes in trauma?' : 'کیا کوئی لاہور میں کسی اچھے تھراپسٹ کو جانتا ہے جو صدمے میں مہارت رکھتا ہو؟',
      author: 'Anonymous User',
      timestamp: Date.now() - 86400000,
      likes: 5,
      commentsCount: 8
    }
  ]);
  const [isPosting, setIsPosting] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [activeMoreMenu, setActiveMoreMenu] = useState<string | null>(null);
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<Record<string, { id: string, text: string, timestamp: number }[]>>({
    '1': [
      { id: 'c1', text: language === 'en' ? 'So proud of you!' : 'آپ پر بہت فخر ہے!', timestamp: Date.now() - 1800000 },
      { id: 'c2', text: language === 'en' ? 'One day at a time.' : 'ایک وقت میں ایک دن۔', timestamp: Date.now() - 900000 }
    ]
  });

  const t = translations[language];

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      author: t.common.anonymous,
      timestamp: Date.now(),
      likes: 0,
      commentsCount: 0
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setIsPosting(false);
  };

  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes - 1 } : p));
    } else {
      newLikedPosts.add(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    }
    setLikedPosts(newLikedPosts);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: Date.now()
    };
    setPostComments({
      ...postComments,
      [postId]: [...(postComments[postId] || []), newComment]
    });
    setPosts(posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    setCommentText('');
  };

  const handleShare = (post: Post) => {
    const shareUrl = `${window.location.origin}/community?post=${post.id}`;
    navigator.clipboard.writeText(shareUrl);
    setSharedPostId(post.id);
    setTimeout(() => setSharedPostId(null), 2000);
  };

  const handleReport = (postId: string) => {
    // In a real app, this would send a report to the backend
    alert(language === 'en' ? 'Post reported. Thank you for keeping the community safe.' : 'پوسٹ کی اطلاع دی گئی۔ کمیونٹی کو محفوظ رکھنے کے لیے آپ کا شکریہ۔');
    setActiveMoreMenu(null);
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    setActiveMoreMenu(null);
  };

  return (
    <div className="p-6">
      <header className="mb-8 mt-4 flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.community.title}
          </h1>
          <p className={`opacity-50 text-xs ${language === 'ur' ? 'urdu-text' : ''}`}>
            {language === 'en' ? 'Share and support anonymously.' : 'گمنام طور پر شیئر کریں اور مدد کریں۔'}
          </p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20"
        >
          <Plus size={24} />
        </button>
      </header>

      <AnimatePresence>
        {isPosting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-card-bg w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-text-muted/10">
              <h3 className={`font-bold mb-4 ${language === 'ur' ? 'urdu-text' : ''}`}>
                {t.community.createPost}
              </h3>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={t.community.postPlaceholder}
                className={`w-full h-32 bg-section-bg rounded-2xl p-4 text-sm outline-none border border-text-muted/10 focus:border-primary transition-colors text-text-primary placeholder:text-text-muted ${language === 'ur' ? 'text-right' : ''}`}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setIsPosting(false)}
                  className="flex-1 py-3 text-text-muted font-bold"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handlePost}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {language === 'en' ? 'Post' : 'پوسٹ کریں'}
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-card-gradient p-6 rounded-3xl border border-text-muted/5 shadow-sm relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-support-lavender/30 rounded-full flex items-center justify-center text-primary font-bold">
                  {post.author[0]}
                </div>
                <div>
                  <h4 className={`text-sm font-bold text-text-primary ${language === 'ur' ? 'urdu-text' : ''}`}>
                    {post.author}
                  </h4>
                  <p className="text-[10px] text-text-muted">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setActiveMoreMenu(activeMoreMenu === post.id ? null : post.id)}
                  className="text-text-muted hover:text-primary transition-colors p-1"
                >
                  <MoreHorizontal size={20} />
                </button>
                <AnimatePresence>
                  {activeMoreMenu === post.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-card-bg border border-text-muted/10 rounded-xl shadow-xl z-10 overflow-hidden"
                    >
                      <button 
                        onClick={() => handleReport(post.id)}
                        className="w-full px-4 py-2 text-left text-xs text-text-secondary hover:bg-section-bg flex items-center gap-2"
                      >
                        <Flag size={14} />
                        {language === 'en' ? 'Report' : 'رپورٹ کریں'}
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="w-full px-4 py-2 text-left text-xs text-emergency hover:bg-emergency/5 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        {language === 'en' ? 'Delete' : 'حذف کریں'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <p className={`text-sm text-text-secondary leading-relaxed mb-6 ${language === 'ur' ? 'urdu-text' : ''}`}>
              {post.content}
            </p>

            <div className="flex items-center gap-6 pt-4 border-t border-text-muted/5">
              <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 transition-colors ${likedPosts.has(post.id) ? 'text-emergency' : 'text-text-muted hover:text-emergency'}`}
              >
                <Heart size={18} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                <span className="text-xs font-medium">{post.likes}</span>
              </button>
              <button 
                onClick={() => setActiveComments(activeComments === post.id ? null : post.id)}
                className={`flex items-center gap-2 transition-colors ${activeComments === post.id ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
              >
                <MessageSquare size={18} fill={activeComments === post.id ? 'currentColor' : 'none'} />
                <span className="text-xs font-medium">{post.commentsCount}</span>
              </button>
              <button 
                onClick={() => handleShare(post)}
                className={`flex items-center gap-2 transition-colors ml-auto ${sharedPostId === post.id ? 'text-success' : 'text-text-muted hover:text-primary'}`}
              >
                {sharedPostId === post.id ? <Check size={18} /> : <Share2 size={18} />}
                {sharedPostId === post.id && <span className="text-[10px] font-bold">{language === 'en' ? 'Copied' : 'کاپی ہو گیا'}</span>}
              </button>
            </div>

            <AnimatePresence>
              {activeComments === post.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-text-muted/5 space-y-3">
                    {(postComments[post.id] || []).map(comment => (
                      <div key={comment.id} className="bg-section-bg p-3 rounded-2xl">
                        <p className={`text-xs text-text-secondary ${language === 'ur' ? 'urdu-text' : ''}`}>{comment.text}</p>
                        <p className="text-[8px] text-text-muted mt-1">{new Date(comment.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={language === 'en' ? "Add a comment..." : "تبصرہ کریں..."}
                        className={`flex-1 bg-section-bg rounded-xl px-3 py-2 text-xs outline-none border border-text-muted/10 focus:border-primary text-text-primary ${language === 'ur' ? 'text-right' : ''}`}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        className="p-2 bg-primary text-white rounded-xl active:scale-95 transition-transform"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
