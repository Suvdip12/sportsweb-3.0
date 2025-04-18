import React, { useState } from 'react';

function Footer() {
  const [activeSection, setActiveSection] = useState(null);

  const footerToggle = (sectionName) => {
    setActiveSection(prev => (prev === sectionName ? null : sectionName));
  };

  return (
    <footer className="mui-style-bxb9f6-footer">
      <div className="mui-style-1ap3u4h-container">
        <div className="mui-style-hniq2h-footerColAndSupportContainer">
          {/* Yaari Sports */}
          <div className="col-3">
            <div
              className={`link-cat ${activeSection === 'yaari' ? 'btnActive' : ''}`}
              onClick={() => footerToggle('yaari')}
            >
              <span className="footer-toggle"></span>
              <span className="footer-cat"><b>Yaari Sports</b></span>
            </div>
            <ul className={`footer-cat-links ${activeSection === 'yaari' ? 'active' : ''}`}>
              <li><a href="#"><span>For You</span></a></li>
              <li><a href="#"><span>Sports</span></a></li>
              <li><a href="#"><span>TV</span></a></li>
              <li><a href="#"><span>Premium</span></a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-3">
            <div
              className={`link-cat ${activeSection === 'support' ? 'btnActive' : ''}`}
              onClick={() => footerToggle('support')}
            >
              <span className="footer-toggle"></span>
              <span className="footer-cat"><b>Support</b></span>
            </div>
            <ul className={`footer-cat-links ${activeSection === 'support' ? 'active' : ''}`}>
              <li><a href="#"><span>Help Center</span></a></li>
              <li><a href="#"><span>Terms Of Use</span></a></li>
              <li><a href="#"><span>Privacy Policy</span></a></li>
              <li><a href="#"><span>Content Complaints</span></a></li>
            </ul>
          </div>
        </div>

        {/* Socials */}
        <hr className="mui-style-n8i6o-divider" />
        <div className="mui-style-1eh3rtd-socialsContainer">
          <div className="mui-style-1eurazx-flex_1">
            <div className="mui-style-14vitgg-flex_col-flex_1">
              <span className="MuiTypography-root MuiTypography-heading2ExtraBold mui-style-b0yzeq-mb_2x">
                Connect With Us
              </span>
              <div className="mui-style-14gto0e-flex-items_center-mb_2x-iconsContainer">
                {[
                  { name: 'Facebook', url: 'https://www.jiocinema.com/images/facebook.svg' },
                  { name: 'Twitter', url: 'https://www.jiocinema.com/images/twitter.svg' },
                  { name: 'Instagram', url: 'https://www.jiocinema.com/images/instagram.svg' },
                  { name: 'YouTube', url: 'https://www.jiocinema.com/images/youtube.svg' },
                ].map((social, index) => (
                  <a href="#" key={index} className="mui-style-17kt6dh-socialIconSpace">
                    <div className="mui-style-1en7gzj-iconBackground">
                      <img
                        alt={social.name}
                        src={social.url}
                        className="mui-style-1s38i07-socials-mr_2x footerIcon"
                        loading="lazy"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <hr className="mui-style-n8i6o-divider" />

          {/* App Download */}
          <div className="mui-style-1eurazx-flex_1">
            <span className="mui-style-12v59qj-mb_x">Download the App</span>
            <div className="mui-style-bpw69w-flex-items_center">
              <a className="mui-style-xnwyuu-mr_x" href="#" target="_blank" rel="noreferrer">
                <img
                  alt="Google Play"
                  src="https://www.jiocinema.com/images/googlePlay.svg"
                  loading="lazy"
                />
              </a>
              <a className="mui-style-xnwyuu-mr_x" href="#" target="_blank" rel="noreferrer">
                <img
                  alt="Apple Store"
                  src="https://www.jiocinema.com/images/appleStore.svg"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rights Section */}
      <div className="mui-style-1azjl7a-rightsSection">
        <p className="mui-style-1ydwkpd">
          Copyright © 2025 YAARI SPORTS Media PVT LTD. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
