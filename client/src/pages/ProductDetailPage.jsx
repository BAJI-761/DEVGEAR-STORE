import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { ShoppingCart, Heart, Star, Send, Loader } from 'lucide-react';

export default function ProductDetailPage() {
  const { identifier } = useParams();
  const { user } = useAuth();
  const [state, setState] = useState({ product: null, loading: true, error: '' });
  const [reviews, setReviews] = useState({ items: [], loading: true, error: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [actionMessage, setActionMessage] = useState('');
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const response = await api.get(`/products/${identifier}`);
        if (active) {
          setState({ product: response.data.data.product, loading: false, error: '' });
        }
      } catch (error) {
        if (active) {
          setState({ product: null, loading: false, error: error.message });
        }
      }
    }

    loadProduct();
    return () => { active = false; };
  }, [identifier]);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        const response = await api.get(`/products/${identifier}/reviews`);
        if (active) {
          setReviews({ items: response.data.data.reviews, loading: false, error: '' });
        }
      } catch (error) {
        if (active) {
          setReviews({ items: [], loading: false, error: error.message });
        }
      }
    }

    loadReviews();
    return () => { active = false; };
  }, [identifier]);

  async function addToCart() {
    const img = document.querySelector('.product-main-img');
    try {
      if (img) {
        const evt = new CustomEvent('devgear:fly', { detail: { img } });
        window.dispatchEvent(evt);
      }
      await api.post(`/cart/items/${state.product._id}`, { quantity: 1 });
      setActionMessage('Added to cart');
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: `${state.product.name} added to cart`, type: 'success' } }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: `Failed to add to cart`, type: 'error' } }));
    }
  }

  async function addToWishlist() {
    try {
      await api.post(`/wishlist/items/${state.product._id}`);
      setActionMessage('Added to wishlist');
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: `${state.product.name} saved to wishlist`, type: 'success' } }));
    } catch (err) {
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: `Failed to save to wishlist`, type: 'error' } }));
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    await api.post(`/products/${state.product._id}/reviews`, reviewForm);
    setReviewForm({ rating: 5, title: '', comment: '' });
    setActionMessage('Review saved');
    const response = await api.get(`/products/${identifier}/reviews`);
    setReviews({ items: response.data.data.reviews, loading: false, error: '' });
  }

  function getImageSrc(img) {
    if (!img) return '/images/placeholder.png';
    const variants = img.variants || {};
    const sizes = Object.keys(variants).sort((a, b) => Number(a) - Number(b));
    if (sizes.length > 0) {
      const mid = sizes[Math.floor(sizes.length / 2)];
      return variants[mid]?.jpg || img.url;
    }
    return img.url;
  }

  // Loading
  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader className="w-10 h-10 animate-spin-slow" strokeWidth={3} />
        <p className="font-black text-xl uppercase tracking-wider">Loading product…</p>
      </div>
    );
  }

  // Error
  if (state.error) {
    return (
      <div className="neo-card !bg-accent text-center py-12">
        <p className="font-bold text-lg">{state.error}</p>
      </div>
    );
  }

  if (!state.product) return null;

  const product = state.product;
  const currentImg = mainImage || (product.images && product.images[0]) || null;

  return (
    <section className="animate-fade-in">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8">
        Product Detail
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ── IMAGE GALLERY ── */}
        <div>
          <div className="neo-card !p-3 mb-4">
            {currentImg ? (
              (() => {
                const variants = currentImg.variants || {};
                const sizes = Object.keys(variants).sort((a, b) => Number(a) - Number(b));
                const webpSrcSet = sizes.map((w) => `${variants[w].webp} ${w}w`).join(', ');
                const jpgSrcSet = sizes.map((w) => `${variants[w].jpg} ${w}w`).join(', ');
                return (
                  <picture>
                    {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} /> : null}
                    <img
                      className="product-main-img w-full h-72 md:h-96 object-contain bg-canvas border-4 border-ink p-3"
                      src={currentImg.url}
                      srcSet={jpgSrcSet}
                      alt={product.name}
                      loading="lazy"
                    />
                  </picture>
                );
              })()
            ) : (
              <img className="product-main-img w-full h-72 md:h-96 object-contain bg-canvas border-4 border-ink p-3" src="/images/placeholder.png" alt={product.name} loading="lazy" />
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 ? (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, idx) => (
                <button
                  key={img.publicId || idx}
                  type="button"
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-12 border-4 border-ink overflow-hidden cursor-pointer transition-all duration-100 ${currentImg === img ? 'bg-secondary shadow-neo-sm -translate-y-1' : 'hover:shadow-neo-sm hover:-translate-y-0.5'}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={getImageSrc(img)}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="flex flex-col gap-4">
          {/* Category badge */}
          <div className="neo-badge bg-muted self-start rotate-1">{product.category}</div>

          <h3 className="text-3xl md:text-4xl font-black uppercase leading-tight">{product.name}</h3>
          <p className="text-lg font-bold leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="inline-flex items-center self-start px-4 py-2 bg-accent border-4 border-ink shadow-neo-sm -rotate-1">
            <span className="text-3xl font-black">₹{product.price}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button type="button" className="neo-btn neo-btn-primary text-base flex-1 !shadow-neo" onClick={addToCart}>
              <ShoppingCart className="w-5 h-5" strokeWidth={3} />
              Add to cart
            </button>
            <button type="button" className="neo-btn neo-btn-secondary text-base flex-1 !shadow-neo" onClick={addToWishlist}>
              <Heart className="w-5 h-5" strokeWidth={3} />
              Save
            </button>
          </div>

          {actionMessage ? (
            <div className="neo-badge bg-secondary self-start animate-fade-in">{actionMessage}</div>
          ) : null}
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Reviews</h3>
          <Star className="w-6 h-6 fill-secondary text-secondary" strokeWidth={0} />
        </div>

        {reviews.loading ? (
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 animate-spin-slow" strokeWidth={3} />
            <p className="font-bold uppercase text-sm">Loading reviews…</p>
          </div>
        ) : null}

        {reviews.error ? <p className="font-bold text-accent">{reviews.error}</p> : null}

        <div className="grid gap-4 mb-8">
          {reviews.items.map((review) => (
            <article key={review._id} className="neo-card !p-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <strong className="font-black text-lg uppercase">{review.title}</strong>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-secondary text-secondary' : 'text-ink opacity-20'}`}
                      strokeWidth={i < review.rating ? 0 : 2}
                    />
                  ))}
                </div>
              </div>
              <p className="font-medium">{review.comment}</p>
            </article>
          ))}
        </div>

        {/* Review form */}
        {user ? (
          <form className="neo-card !bg-canvas grid gap-4 max-w-2xl" onSubmit={submitReview}>
            <h4 className="font-black text-lg uppercase">Leave a review</h4>
            <label className="grid gap-1.5">
              <span className="font-bold text-xs uppercase tracking-wider">Rating</span>
              <select
                value={reviewForm.rating}
                onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}
                className="neo-input cursor-pointer"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{'★'.repeat(value)}{'☆'.repeat(5 - value)} ({value})</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="font-bold text-xs uppercase tracking-wider">Title</span>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })}
                required
                className="neo-input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-bold text-xs uppercase tracking-wider">Comment</span>
              <textarea
                value={reviewForm.comment}
                onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
                required
                rows={4}
                className="neo-input resize-y"
              />
            </label>
            <button type="submit" className="neo-btn neo-btn-primary self-start">
              <Send className="w-4 h-4" strokeWidth={3} />
              Submit review
            </button>
          </form>
        ) : (
          <div className="neo-card !bg-muted/30 text-center py-6">
            <p className="font-bold text-lg uppercase">Sign in to leave a review.</p>
          </div>
        )}
      </div>
    </section>
  );
}