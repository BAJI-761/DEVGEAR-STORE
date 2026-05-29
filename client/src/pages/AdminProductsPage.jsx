import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Package, Plus, Trash2, Edit3, Save, Upload, X, Image } from 'lucide-react';

const emptyProduct = {
  name: '',
  slug: '',
  sku: '',
  description: '',
  category: '',
  subcategory: '',
  brand: '',
  price: '',
  compareAtPrice: '',
  stock: '',
  isFeatured: false,
  isActive: true,
  imageRows: [{ url: '', alt: '' }],
  tagsText: '',
  specsRows: [{ key: '', value: '' }]
};

function toImageRows(images) {
  if (!Array.isArray(images) || images.length === 0) {
    return [{ url: '', alt: '' }];
  }
  return images.map((image) => ({
    url: image?.url || '',
    alt: image?.alt || '',
    variants: image?.variants || {}
  }));
}

function toSpecRows(specs) {
  const entries = specs && typeof specs === 'object' ? Object.entries(specs) : [];
  if (entries.length === 0) {
    return [{ key: '', value: '' }];
  }
  return entries.map(([key, value]) => ({ key, value }));
}

function buildPayload(form) {
  const images = form.imageRows
    .map((row) => ({ url: row.url.trim(), alt: row.alt.trim(), variants: row.variants || {} }))
    .filter((row) => row.url);

  const tags = form.tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const specs = form.specsRows.reduce((accumulator, row) => {
    const key = row.key.trim();
    const value = row.value.trim();
    if (key && value) {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});

  return {
    name: form.name,
    slug: form.slug,
    sku: form.sku,
    description: form.description,
    category: form.category,
    subcategory: form.subcategory,
    brand: form.brand,
    price: Number(form.price),
    compareAtPrice: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
    stock: Number(form.stock),
    images,
    tags,
    specs,
    isFeatured: form.isFeatured,
    isActive: form.isActive
  };
}

const TEXT_FIELDS = [
  { key: 'name', required: true },
  { key: 'slug', required: true },
  { key: 'sku', required: true },
  { key: 'description', required: true, textarea: true },
  { key: 'category', required: true },
  { key: 'subcategory', required: false },
  { key: 'brand', required: false },
  { key: 'price', required: true, type: 'number' },
  { key: 'compareAtPrice', required: false, type: 'number' },
  { key: 'stock', required: true, type: 'number' },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState(null);

  async function loadProducts() {
    setError('');
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data.data.products);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateImageRow(index, field, value) {
    setForm((current) => {
      const nextRows = [...current.imageRows];
      nextRows[index] = { ...nextRows[index], [field]: value };
      return { ...current, imageRows: nextRows };
    });
  }

  function addImageRow() {
    setForm((current) => ({ ...current, imageRows: [...current.imageRows, { url: '', alt: '' }] }));
  }

  function removeImageRow(index) {
    setForm((current) => {
      const nextRows = current.imageRows.filter((_, rowIndex) => rowIndex !== index);
      return { ...current, imageRows: nextRows.length > 0 ? nextRows : [{ url: '', alt: '' }] };
    });
  }

  async function uploadImageFile(index, file) {
    if (!file) return;
    setUploadingIndex(index);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/admin/uploads/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedImage = response.data.data.image;
      setForm((current) => {
        const nextRows = [...current.imageRows];
        nextRows[index] = {
          url: uploadedImage.url,
          alt: nextRows[index]?.alt || file.name,
          variants: uploadedImage.variants || {}
        };
        return { ...current, imageRows: nextRows };
      });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploadingIndex(null);
    }
  }

  function updateSpecRow(index, field, value) {
    setForm((current) => {
      const nextRows = [...current.specsRows];
      nextRows[index] = { ...nextRows[index], [field]: value };
      return { ...current, specsRows: nextRows };
    });
  }

  function addSpecRow() {
    setForm((current) => ({ ...current, specsRows: [...current.specsRows, { key: '', value: '' }] }));
  }

  function removeSpecRow(index) {
    setForm((current) => {
      const nextRows = current.specsRows.filter((_, rowIndex) => rowIndex !== index);
      return { ...current, specsRows: nextRows.length > 0 ? nextRows : [{ key: '', value: '' }] };
    });
  }

  async function saveProduct(event) {
    event.preventDefault();
    setError('');
    const payload = buildPayload(form);
    try {
      if (form._id) {
        await api.put(`/admin/products/${form._id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }
      setForm(emptyProduct);
      await loadProducts();
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Product saved', type: 'success' } }));
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  function editProduct(product) {
    setForm({
      _id: product._id,
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      description: product.description || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      price: product.price ?? '',
      compareAtPrice: product.compareAtPrice ?? '',
      stock: product.stock ?? '',
      isFeatured: Boolean(product.isFeatured),
      isActive: Boolean(product.isActive),
      imageRows: toImageRows(product.images),
      tagsText: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      specsRows: toSpecRows(product.specs)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteProduct(productId) {
    setError('');
    try {
      await api.delete(`/admin/products/${productId}`);
      await loadProducts();
      window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Product deleted', type: 'info' } }));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <section>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
        <Package className="w-10 h-10 md:w-12 md:h-12 inline-block mr-3 -mt-1" strokeWidth={3} />
        Admin Products
      </h2>

      {error ? (
        <div className="border-4 border-ink bg-accent px-4 py-3 font-bold text-sm uppercase mb-6">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ── FORM ── */}
        <form className="neo-card" onSubmit={saveProduct}>
          <div className="flex items-center gap-3 pb-4 mb-4 border-b-4 border-ink">
            <div className="p-2 bg-secondary border-4 border-ink">
              {form._id ? <Edit3 className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
            </div>
            <h3 className="text-xl font-black uppercase">{form._id ? 'Edit Product' : 'Create Product'}</h3>
          </div>

          <div className="grid gap-4">
            {/* Text fields */}
            {TEXT_FIELDS.map((field) => (
              <label key={field.key} className="grid gap-1.5">
                <span className="font-bold text-xs uppercase tracking-wider">{field.key}</span>
                {field.textarea ? (
                  <textarea
                    value={form[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    rows={4}
                    required={field.required}
                    className="neo-input resize-y"
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    value={form[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    required={field.required}
                    className="neo-input"
                  />
                )}
              </label>
            ))}

            {/* Switches */}
            <div className="flex flex-wrap gap-4 p-4 border-4 border-ink bg-canvas">
              <label className="flex items-center gap-2 font-bold text-sm uppercase cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => updateField('isFeatured', event.target.checked)}
                  className="w-5 h-5 accent-accent"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 font-bold text-sm uppercase cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => updateField('isActive', event.target.checked)}
                  className="w-5 h-5 accent-secondary"
                />
                Active
              </label>
            </div>

            {/* Images */}
            <div className="p-4 border-4 border-ink bg-secondary/20">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-5 h-5" strokeWidth={3} />
                <h4 className="font-black text-sm uppercase">Images</h4>
              </div>
              <div className="grid gap-3">
                {form.imageRows.map((row, index) => (
                  <div key={`image-${index}`} className="p-3 border-4 border-ink bg-surface grid gap-3">
                    <label className="grid gap-1.5">
                      <span className="font-bold text-xs uppercase tracking-wider">Image URL</span>
                      <input value={row.url} onChange={(event) => updateImageRow(index, 'url', event.target.value)} placeholder="https://..." className="neo-input" />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="font-bold text-xs uppercase tracking-wider">Alt text</span>
                      <input value={row.alt} onChange={(event) => updateImageRow(index, 'alt', event.target.value)} placeholder="Preview description" className="neo-input" />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="font-bold text-xs uppercase tracking-wider">Upload image</span>
                      <input type="file" accept="image/*" onChange={(event) => uploadImageFile(index, event.target.files?.[0])} className="neo-input !p-2 cursor-pointer" />
                    </label>
                    {uploadingIndex === index ? (
                      <p className="font-bold text-sm uppercase text-accent animate-pulse">Uploading…</p>
                    ) : null}
                    <button type="button" className="neo-btn text-xs self-start" onClick={() => removeImageRow(index)}>
                      <X className="w-3 h-3" strokeWidth={3} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="neo-btn neo-btn-secondary text-xs mt-3" onClick={addImageRow}>
                <Plus className="w-3 h-3" strokeWidth={3} />
                Add image
              </button>
            </div>

            {/* Tags */}
            <label className="grid gap-1.5">
              <span className="font-bold text-xs uppercase tracking-wider">Tags</span>
              <input
                value={form.tagsText}
                onChange={(event) => updateField('tagsText', event.target.value)}
                placeholder="keyboard, mechanical, hot-swap"
                className="neo-input"
              />
            </label>

            {/* Specs */}
            <div className="p-4 border-4 border-ink bg-muted/20">
              <h4 className="font-black text-sm uppercase mb-3">Specs</h4>
              <div className="grid gap-3">
                {form.specsRows.map((row, index) => (
                  <div key={`spec-${index}`} className="flex gap-2 items-end flex-wrap">
                    <label className="grid gap-1.5 flex-1 min-w-[120px]">
                      <span className="font-bold text-xs uppercase tracking-wider">Key</span>
                      <input value={row.key} onChange={(event) => updateSpecRow(index, 'key', event.target.value)} placeholder="Switch type" className="neo-input" />
                    </label>
                    <label className="grid gap-1.5 flex-1 min-w-[120px]">
                      <span className="font-bold text-xs uppercase tracking-wider">Value</span>
                      <input value={row.value} onChange={(event) => updateSpecRow(index, 'value', event.target.value)} placeholder="Tactile" className="neo-input" />
                    </label>
                    <button type="button" className="neo-btn !p-2 !min-h-0" onClick={() => removeSpecRow(index)}>
                      <X className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="neo-btn neo-btn-secondary text-xs mt-3" onClick={addSpecRow}>
                <Plus className="w-3 h-3" strokeWidth={3} />
                Add spec
              </button>
            </div>

            <button type="submit" className="neo-btn neo-btn-primary text-base !shadow-neo">
              <Save className="w-5 h-5" strokeWidth={3} />
              {form._id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>

        {/* ── CATALOG ── */}
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Catalog</h3>
          {loading ? (
            <div className="neo-card text-center py-8">
              <p className="font-bold text-sm uppercase animate-pulse">Loading products…</p>
            </div>
          ) : null}
          <div className="grid gap-3">
            {products.map((product) => (
              <article key={product._id} className="neo-stack-item animate-fade-in">
                <div className="flex-1 min-w-0">
                  <strong className="font-black text-base uppercase block truncate">{product.name}</strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="neo-badge bg-muted text-[10px]">{product.category}</span>
                    <span className="neo-badge bg-canvas text-[10px]">₹{product.price}</span>
                    <span className="neo-badge bg-canvas text-[10px]">{Array.isArray(product.images) ? `${product.images.length} img` : '0 img'}</span>
                  </div>
                  {Array.isArray(product.tags) && product.tags.length > 0 ? (
                    <p className="text-xs font-medium mt-1 truncate">{product.tags.join(', ')}</p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="neo-btn neo-btn-secondary text-xs" onClick={() => editProduct(product)}>
                    <Edit3 className="w-3 h-3" strokeWidth={3} />
                    Edit
                  </button>
                  <button type="button" className="neo-btn text-xs" onClick={() => deleteProduct(product._id)}>
                    <Trash2 className="w-3 h-3" strokeWidth={3} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}