import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  DollarSign,
  FileText,
  Lock,
  Github,
  ExternalLink
} from 'lucide-react';

const demo = () => {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const tagline = '> Property Management Platform';

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < tagline.length) {
        setTypedText(tagline.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const features = [
    {
      icon: Home,
      label: 'Property Management',
      desc: 'Track all your properties in one place'
    },
    {
      icon: Users,
      label: 'Tenant Tracking',
      desc: 'Manage tenants and leases efficiently'
    },
    {
      icon: DollarSign,
      label: 'Rent Collection',
      desc: 'Automated rent tracking & payments'
    },
    {
      icon: FileText,
      label: 'Document Generation',
      desc: 'Contracts, invoices & notices'
    },
    { icon: Lock, label: 'Secure & Private', desc: 'Enterprise-grade security' }
  ];

  const screenshots = [
    { label: 'Properties', desc: 'Manage your portfolio' },
    { label: 'Tenants', desc: 'Track leases & contacts' },
    { label: 'Rents', desc: 'Payment tracking' },
    { label: 'Documents', desc: 'Generate contracts' }
  ];

  return (
    <div
      style={{
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: '#00ff88'
      }}
    >
      {/* Terminal Window Header */}
      <div
        style={{
          backgroundColor: '#1a1a1a',
          padding: '12px 20px',
          borderBottom: '1px solid #1f1f1f',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ff5f56'
          }}
        ></div>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ffbd2e'
          }}
        ></div>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#27c93f'
          }}
        ></div>
        <span style={{ marginLeft: '20px', color: '#666', fontSize: '14px' }}>
          prabhat@rentroo:~$ rentroo --demo
        </span>
      </div>

      {/* Main Content */}
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}
      >
        {/* ASCII Art Logo */}
        <pre
          style={{
            color: '#00ff88',
            fontSize: '14px',
            lineHeight: '1.2',
            textAlign: 'center',
            marginBottom: '40px',
            textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
          }}
        >
          {`   ██████╗ ███████╗███╗   ██╗████████╗██████╗  ██████╗ 
   ██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗
   ██████╔╝█████╗  ██╔██╗ ██║   ██║   ██████╔╝██║   ██║
   ██╔══██╗██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗██║   ██║
   ██║  ██║███████╗██║ ╚████║   ██║   ██║  ██║╚██████╔╝
   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ `}
        </pre>

        {/* Tagline with Typewriter Effect */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ color: '#00d9ff', fontSize: '24px' }}>
            {typedText}
            <span
              style={{
                opacity: showCursor ? 1 : 0,
                color: '#00ff88',
                animation: 'blink 1s infinite'
              }}
            >
              █
            </span>
          </span>
        </div>

        <div
          style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '16px',
            marginBottom: '60px'
          }}
        >
          {'>'} Built with Next.js + Node.js
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '60px' }}>
          <div
            style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}
          >
            $ cat features.txt
          </div>

          <div
            style={{
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              backgroundColor: '#111111',
              padding: '30px'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}
            >
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    border: '1px solid #1f1f1f',
                    borderRadius: '4px',
                    backgroundColor: '#0a0a0a'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '10px'
                    }}
                  >
                    <feature.icon size={20} color="#00ff88" />
                    <span style={{ color: '#00ff88', fontSize: '14px' }}>
                      {feature.label}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {feature.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Screenshots Grid */}
        <div style={{ marginBottom: '60px' }}>
          <div
            style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}
          >
            $ ls screenshots/
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {screenshots.map((screen, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #1f1f1f',
                  borderRadius: '8px',
                  backgroundColor: '#111111',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#1a1a1a',
                    padding: '8px 12px',
                    borderBottom: '1px solid #1f1f1f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#ff5f56'
                    }}
                  ></div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#ffbd2e'
                    }}
                  ></div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#27c93f'
                    }}
                  ></div>
                </div>
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div
                    style={{
                      color: '#00ff88',
                      fontSize: '18px',
                      marginBottom: '8px'
                    }}
                  >
                    {screen.label}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {screen.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}
          >
            $ ./start-demo.sh
          </div>

          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <a
              href="/signin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                border: '2px solid #00ff88',
                color: '#00ff88',
                padding: '16px 32px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '16px',
                transition: 'all 0.3s',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00ff88';
                e.currentTarget.style.color = '#0a0a0a';
                e.currentTarget.style.boxShadow =
                  '0 0 30px rgba(0, 255, 136, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#00ff88';
                e.currentTarget.style.boxShadow =
                  '0 0 20px rgba(0, 255, 136, 0.3)';
              }}
            >
              <span style={{ fontFamily: 'monospace' }}>[</span>
              Launch Landlord Demo
              <span style={{ fontFamily: 'monospace' }}>]</span>
            </a>

            <a
              href="/tenant"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                border: '2px solid #00d9ff',
                color: '#00d9ff',
                padding: '16px 32px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '16px',
                transition: 'all 0.3s',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00d9ff';
                e.currentTarget.style.color = '#0a0a0a';
                e.currentTarget.style.boxShadow =
                  '0 0 30px rgba(0, 217, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#00d9ff';
                e.currentTarget.style.boxShadow =
                  '0 0 20px rgba(0, 217, 255, 0.3)';
              }}
            >
              <span style={{ fontFamily: 'monospace' }}>[</span>
              Launch Tenant Portal
              <span style={{ fontFamily: 'monospace' }}>]</span>
            </a>
          </div>

          <div style={{ marginTop: '20px', color: '#00ff88' }}>
            $<span style={{ animation: 'blink 1s infinite' }}>█</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #1f1f1f',
            paddingTop: '40px',
            textAlign: 'center',
            color: '#666'
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            Built by{' '}
            <span style={{ color: '#00ff88' }}>Sensible Analytics</span>
          </div>

          <div
            style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
          >
            <a
              href="https://github.com/Sensible-Analytics/rentroo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#666',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://www.sensibleanalytics.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#666',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ExternalLink size={16} />
              SensibleAnalytics.co
            </a>
          </div>

          <div style={{ marginTop: '30px', fontSize: '12px', color: '#333' }}>
            rentroo © 2026 | MIT License
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default demo;
