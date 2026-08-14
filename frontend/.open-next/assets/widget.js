(function() {
  const currentScript = document.currentScript;
  const twinHandle = currentScript?.getAttribute('data-twin') || 'harshal';
  const appDomain = currentScript?.getAttribute('data-domain') || window.location.origin;

  // Create floating bubble container
  const container = document.createElement('div');
  container.id = 'pavtar-widget-root';
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Create launcher button
  const button = document.createElement('button');
  button.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #aa820a 100%);
    border: 2px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  button.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  `;

  // Create modal iframe
  const iframeContainer = document.createElement('div');
  iframeContainer.style.cssText = `
    position: fixed;
    bottom: 96px;
    right: 24px;
    width: 380px;
    height: 580px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #070604;
    display: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  const iframe = document.createElement('iframe');
  iframe.src = `${appDomain}/u/${twinHandle}?embed=true`;
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
  iframe.allow = 'camera; microphone; autoplay';

  iframeContainer.appendChild(iframe);

  let isOpen = false;
  button.onclick = () => {
    isOpen = !isOpen;
    iframeContainer.style.display = isOpen ? 'block' : 'none';
    button.style.transform = isOpen ? 'rotate(90deg) scale(0.9)' : 'rotate(0deg) scale(1)';
  };

  container.appendChild(iframeContainer);
  container.appendChild(button);
  document.body.appendChild(container);
})();
