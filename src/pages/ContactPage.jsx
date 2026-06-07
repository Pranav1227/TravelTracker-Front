import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, MapPin, Phone, MessagesSquare } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll reply soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center py-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-3">
            Contact Us
          </h1>
          <p className="text-zinc-500 max-w-md mx-auto text-sm">
            Have questions, feedback, or need support? Drop us a line and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Info Card */}
          <div className="space-y-4 md:col-span-1">
            <div className="card h-full flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <MessagesSquare className="w-5 h-5 text-zinc-700" /> Connect
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  Feel free to reach out directly through any of these channels or submit the form.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Email us</p>
                      <p className="text-xs font-semibold text-zinc-800">support@traveltracker.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Call us</p>
                      <p className="text-xs font-semibold text-zinc-800">+1 (800) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Headquarters</p>
                      <p className="text-xs font-semibold text-zinc-800">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-zinc-100 text-xxs text-zinc-400">
                Support is available Mon-Fri: 9 AM - 6 PM EST.
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="md:col-span-2">
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="input-field !py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="input-field !py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Feedback, Feature Request, Bug Report"
                    className="input-field !py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="input-field !py-2.5 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full text-sm !py-2.5"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
