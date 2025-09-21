import { useEffect, useState } from 'react';
import './h.css';

function Content() {
  const [contentHtml, setContentHtml] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/drmlive/fancode-live-events/main/fancode.json')
      .then(response => response.json())
      .then(data => {
        const matchesArray = data.matches;
        if (!matchesArray || matchesArray.length === 0) {
          setError('No matches found.');
          return;
        }

        const html = matchesArray.map(match => {
          const { title, src: imageUrl, team_1, team_2, status, event_name, startTime } = match;

          return (
            `<article class="ripple sports-card normal tray-slide">
              <a href="/match/${match.match_id}">
                <div class="thumbnail-container">
                  <div class="card card-img-container">
                    <img src="${imageUrl}" class="img-loader lazy-img-loader loaded" loading="lazy" alt="${title}">
                  </div>
                </div>
                <div class="meta-desc">
                  <div class="play-icon"></div>
                  <div class="meta-wrapper">
                    <div class="title ellipsize">
                      <span class="content-title">${title}</span>
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
        console.error('Error fetching Fancode data:', err);
        setError('Error fetching matches. Please try again later.');
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
                                  <a href="/collections/fancode" title="Fancode Live Matches">
                                    <h3>Fancode Live Matches</h3>
                                  </a>
                                  <span className="view-more">
                                    <a href="/collections/fancode" title="view-more">View All</a>
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
