import { useEffect, useState } from 'react';
import api from '../lib/api';
import { User, MapPin, Save, Plus } from 'lucide-react';

const emptyAddress = {
  label: 'Home',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: false
};

const ADDRESS_FIELDS = ['label', 'fullName', 'phone', 'line1', 'line2', 'city', 'state', 'postalCode', 'country'];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [addressForm, setAddressForm] = useState(emptyAddress);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await api.get('/users/profile');
        if (active) {
          setUser(response.data.data.user);
          setProfileForm({ name: response.data.data.user.name || '', phone: response.data.data.user.phone || '' });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => { active = false; };
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    const response = await api.put('/users/profile', profileForm);
    setUser(response.data.data.user);
    window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Profile saved', type: 'success' } }));
  }

  async function addAddress(event) {
    event.preventDefault();
    const response = await api.post('/users/addresses', addressForm);
    setUser(response.data.data.user);
    setAddressForm(emptyAddress);
    window.dispatchEvent(new CustomEvent('devgear:toast', { detail: { message: 'Address added', type: 'success' } }));
  }

  return (
    <section>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
        <User className="w-10 h-10 md:w-12 md:h-12 inline-block mr-3 -mt-1" strokeWidth={3} />
        Profile
      </h2>

      {loading ? (
        <div className="neo-card text-center py-12">
          <p className="font-bold text-lg uppercase animate-pulse">Loading profile…</p>
        </div>
      ) : null}

      {user ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Account form */}
          <form className="neo-card" onSubmit={saveProfile}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b-4 border-ink">
              <div className="p-2 bg-accent border-4 border-ink">
                <User className="w-5 h-5" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black uppercase">Account</h3>
            </div>
            <div className="grid gap-4">
              <label className="grid gap-1.5">
                <span className="font-bold text-xs uppercase tracking-wider">Name</span>
                <input
                  value={profileForm.name}
                  onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                  className="neo-input"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="font-bold text-xs uppercase tracking-wider">Phone</span>
                <input
                  value={profileForm.phone}
                  onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })}
                  className="neo-input"
                />
              </label>
              <button type="submit" className="neo-btn neo-btn-primary self-start">
                <Save className="w-4 h-4" strokeWidth={3} />
                Save profile
              </button>
            </div>
          </form>

          {/* Address form */}
          <form className="neo-card" onSubmit={addAddress}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b-4 border-ink">
              <div className="p-2 bg-secondary border-4 border-ink">
                <MapPin className="w-5 h-5" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-black uppercase">New Address</h3>
            </div>
            <div className="grid gap-4">
              {ADDRESS_FIELDS.map((field) => (
                <label key={field} className="grid gap-1.5">
                  <span className="font-bold text-xs uppercase tracking-wider">{field}</span>
                  <input
                    value={addressForm[field]}
                    onChange={(event) => setAddressForm({ ...addressForm, [field]: event.target.value })}
                    className="neo-input"
                  />
                </label>
              ))}
              <button type="submit" className="neo-btn neo-btn-secondary self-start">
                <Plus className="w-4 h-4" strokeWidth={3} />
                Add address
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Saved addresses */}
      {user?.addresses?.length > 0 ? (
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Saved Addresses</h3>
          <div className="grid gap-4">
            {user.addresses.map((address) => (
              <article key={address._id} className="neo-stack-item animate-fade-in">
                <div>
                  <div className="neo-badge bg-muted mb-2">{address.label}</div>
                  <p className="font-bold">{address.fullName}</p>
                  <p className="font-medium">{address.line1}</p>
                  <p className="font-medium">{address.city}, {address.state} {address.postalCode}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}