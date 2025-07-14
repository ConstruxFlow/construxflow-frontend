import React, { useState } from "react";
import { FaHeadset, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments" },
];

const ContactSupport = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend or support system
    setSubmitted(true);
  };

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar links={navLinks} logoSrc="/logo1.png" />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <FaHeadset className="text-2xl text-deep_green" />
          <h2 className="text-3xl font-bold text-gray-800">Contact Support</h2>
        </div>
        <p className="text-gray-500 mb-8">
          Need help? Reach out to our support team and we’ll get back to you as soon as possible.
        </p>

        <div className="bg-white border border-gray-200 rounded-xl shadow p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-main_dark mb-1">
              <FaEnvelope className="text-lg" />
              <span>support@supplychain.com</span>
            </div>
            <div className="flex items-center gap-2 text-main_dark">
              <FaPhoneAlt className="text-lg" />
              <span>+91 98765 43210</span>
            </div>
          </div>

          {submitted ? (
            <div className="text-green-600 font-semibold text-center py-8">
              Thank you! Your message has been sent. Our team will contact you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-deep_green"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-deep_green"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium" htmlFor="message">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-deep_green"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-deep_green text-white font-semibold py-2 rounded hover:bg-deep_green/90 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
