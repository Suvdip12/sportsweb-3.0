function Header() {
  const navItems = [
    { label: 'For You', href: '/', icon: '/home-av.svg' },
    { label: 'Sports', href: '/live/StarSports.html', icon: '/cric_of.svg' },
    { label: 'Free', href: '/TV', icon: 'https://v3img.voot.com/v3Storage/menu/jv/ic_free_nn.svg' },
    { label: 'Fancode', href: '/tv-shows', icon: 'https://v3img.voot.com/v3Storage/menu/jv/ic_premium_inactive_20nn.svg' },
    { label: 'More', href: '/tv-shows', icon: 'https://v3img.voot.com/v3Storage/menu/jv/more.svg' },
  ];

  return (
    <div className="mui-style-1cevdr4-scrollOffsetSpace">
      {/* Web Header */}
      <div className="mui-style-1y43hhl-webHeaderContainer" style={{ transform: 'none', transition: 'transform 400ms cubic-bezier(0, 0, 0.2, 1) 0ms' }}>
        <div className="mui-style-1xnl3zj-webroot">
          <div className="mui-style-138c29f-headerMain">
            <div className="mui-style-3ir3rb-headerItems">
              <img src="/logo.jpg" alt="ivy" style={{ height: '57px', cursor: 'pointer' }} />
              <div className="webNavItems">
                <a className="aWebText" href="/">For You</a>
              </div>
              <div className="webNavItems">
                <a className="aWebText" href="/live/StarSports.html">Sports</a>
              </div>
              <div className="webNavItems">
                <a className="aWebText" href="/TV">Free</a>
              </div>
              <div className="webNavItems">
                <a className="aWebText" href="/tv-shows">Fancode</a>
              </div>
              <div className="mui-style-84vpf0-spacer"></div>
              <img src="https://v3img.voot.com/v3Storage/menu/jv/search.svg" alt="SEARCH" className="mui-style-uarirv-searchIcon" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="mui-style-1ppgfts-mobileHeaderContainer">
        <div className="mui-style-s0rqyb-mobileroot">
          <div className="mui-style-1tu68iv-mobileNavItems">
            {navItems.map((item, idx) => (
              <div className="mui-style-1cd54w9-aMobile" key={idx}>
                <a className="mui-style-wbuig5-aMobileText-mobileText" href={item.href}>
                  <span style={{ boxSizing: 'border-box', display: 'inline-block', overflow: 'hidden', position: 'relative', maxWidth: '100%' }}>
                    <span style={{ display: 'block', maxWidth: '100%' }}>
                      <img
                        aria-hidden="true"
                        alt=""
                        src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%20width='20'%20height='20'/%3e"
                        style={{ display: 'block', maxWidth: '100%' }}
                      />
                    </span>
                    <img
                      alt={item.label}
                      src={item.icon}
                      decoding="async"
                      style={{
                        position: 'absolute',
                        inset: '0px',
                        boxSizing: 'border-box',
                        padding: 0,
                        border: 'none',
                        margin: 'auto',
                        display: 'block',
                        width: '0px',
                        height: '0px',
                        minWidth: '100%',
                        maxWidth: '100%',
                        minHeight: '100%',
                        maxHeight: '100%',
                      }}
                    />
                  </span>
                  <br />
                  <p className="mui-style-uf14py">{item.label}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
