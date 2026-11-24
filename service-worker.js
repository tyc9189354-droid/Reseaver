// Reseaver Service Worker with Over-The-Air (OTA) Live Sync
const CACHE_VERSION = 'reseaver-v1.1.3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
];

// 安裝階段：快取基本資源並強制進入等待啟用
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // 核心：跳過等待，立刻啟用最新版
  self.skipWaiting();
});

// 啟用階段：清除舊版本快取，並立即接管所有開啟中的客戶端 (Clients)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_VERSION) {
            console.log('[Reseaver SW] 清理舊快取:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 攔截請求：採用 Network-First (網路優先) 策略確保手機端隨時獲得最新代碼
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 只處理 GET 請求
  if (request.method !== 'GET') return;

  // 如果是 HTML 頁面，優先從網路獲取最新版，失敗才讀取離線快取
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match('./index.html');
        })
    );
    return;
  }

  // 其他靜態資源採用 Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 監聽前端發送的指令 (如跳過等待)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
