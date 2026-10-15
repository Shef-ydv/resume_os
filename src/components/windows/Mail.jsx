import React, { useState } from 'react';
import MacWindow from './MacWindow';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

const Mail = () => {
  const [formData, setFormData] = useState({
    to: 'shefaliyadav1709@gmail.com',
    from: '',
    subject: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      setErrorMsg('Please enter a subject line.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your message.');
      return;
    }

    sounds.success();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    // Launch mailto fallback so it opens user's email client
    const mailtoUri = `mailto:${formData.to}?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `From: ${formData.from}\n\n${formData.message}`
    )}`;
    window.open(mailtoUri, '_blank');

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setFormData({
        to: 'shefaliyadav1709@gmail.com',
        from: '',
        subject: '',
        message: ''
      });
    }, 3500);
  };

  return (
    <MacWindow windowId="mail">
      <div className="mail-window">
        {/* Mail Toolbar */}
        <div className="mail-toolbar">
          <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
            Compose to Shefali Yadav
          </div>

          <button type="button" className="btn-send" onClick={handleSend}>
            <Send />
            <span>Send Message</span>
          </button>
        </div>

        {/* Mail Form */}
        <form className="mail-form" onSubmit={handleSend}>
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 69, 58, 0.15)',
                border: '1px solid #ff453a',
                color: '#ff453a',
                fontSize: '12px'
              }}
            >
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mail-field-row">
            <label>To:</label>
            <input type="email" value={formData.to} readOnly style={{ opacity: 0.8 }} />
          </div>

          <div className="mail-field-row">
            <label>Your Email:</label>
            <input
              type="email"
              placeholder="recruiter@company.com (optional)"
              value={formData.from}
              onChange={(e) => handleChange('from', e.target.value)}
            />
          </div>

          <div className="mail-field-row">
            <label>Subject:</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Role @ Tech Innovators"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              required
            />
          </div>

          <div className="mail-body-area">
            <textarea
              placeholder="Hello Shefali, we came across your Resume OS portfolio and would love to chat about..."
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              required
            />
          </div>
        </form>

        {/* Success Toast */}
        {showToast && (
          <div className="mail-toast">
            <CheckCircle2 />
            <div>
              <strong>Message Prepared!</strong>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Opened email composer & dispatched to shefaliyadav1709@gmail.com
              </div>
            </div>
          </div>
        )}
      </div>
    </MacWindow>
  );
};

export default Mail;
