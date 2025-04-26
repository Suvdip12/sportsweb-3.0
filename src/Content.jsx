import { useEffect, useState } from 'react';
import './h.css';

function Content() {
  const [contentHtml, setContentHtml] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://content-jiovoot.voot.com/psapi/voot/v1/voot-web/content/specific/editorial-clone?query=include%3A138e719e9fe75a4f4dee0dc7f0f7112d&source=CMS&discounting=false&aspectRatio=16x9&responseType=common')
      .then(response => response.json())
      .then(data => {
        const seoDataArray = data.result;
        if (!seoDataArray || seoDataArray.length === 0) {
          setError('No content found.');
          return;
        }

        const html = seoDataArray.map(seoData => {
          const { title, description, ogImage: imageUrl, urlStructureNew: watchUrl } = seoData.seo;

          return (
            `<article class="ripple sports-card normal tray-slide">
              <a href="/in/">
                <div class="thumbnail-container">
                  <div class="card card-img-container">
                    <img src="${imageUrl}" class="img-loader lazy-img-loader loaded" loading="lazy" alt="">
                  </div>
                </div>
                <div class="meta-desc">
                  <div class="play-icon"></div>
                  <div class="meta-wrapper">
                    <div class="title ellipsize">
                      <span class="content-title">${description}</span>
                    </div>
                  </div>
                </div>
              </a>
            </article>`
          );
        }).join('');

        setContentHtml(html);
      })
      .catch(err => {
        console.error('Error fetching SEO data:', err);
        setError('Error fetching content. Please try again later.');
      });
  }, []);

  return (
    <div id="app" dir="ltr">
      <div className="watch-page-container">
        <div className="master-container">
          <div className="master-container-inner">
            <div className="tray-area">
              <div className="trays-container">
                <div className="trays">
                  <div className="tray-container"></div>
                  <div className="paginator-waypoint"></div>
                  <div className="tray-container">
                    <div className="tray-wrapper">
                      <div className="tray-carousel">
                        <div className="video-shows-section sport-video-block vfx-item-ptb">
                          <div className="container-fluid">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="vfx-item-section">
                                  <a href="/collections/best-in-sports/3" title="Best in Sports">
                                    <h3>Best in Sports</h3>
                                  </a>
                                  <span className="view-more">
                                    <a href="/collections/best-in-sports/3" title="view-more">View All</a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="container">
                            <div className="middle-mob-tray-container">
                              <div className="inner-mob-tray-container">
                                {error ? <p>{error}</p> : (
                                  <div
                                    id="content"
                                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}

export default Content;
