function initNotificationUI() {
  const headerRight = document.querySelector('.app-header > div:last-child') || document.querySelector('.app-header-right') || document.querySelector('.app-header');
  if (!headerRight) return;

  let bellBtn = document.getElementById('notif-bell-btn');
  if (!bellBtn) {
    bellBtn = document.createElement('button');
    bellBtn.id = 'notif-bell-btn';
    // Chèn sau phần hiển thị Ngày Tháng
    headerRight.appendChild(bellBtn);
  }

  bellBtn.className = 'header-icon-btn notif-bell-btn';
  bellBtn.style.cssText = 'margin-left: 8px; cursor: pointer; background: transparent; border: none; color: var(--foreground); display: inline-flex; align-items: center; position: relative;';
  bellBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;

  let dot = document.getElementById('notif-badge-dot');
  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'notif-badge-dot';
    dot.className = 'notif-badge-dot';
    bellBtn.appendChild(dot);
  }

  if (!document.getElementById('notif-dropdown')) {
    const dropdown = document.createElement('div');
    dropdown.id = 'notif-dropdown';
    dropdown.className = 'notif-dropdown';
    document.body.appendChild(dropdown);
  }

  bellBtn.onclick = (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('open');
    renderNotificationList();
  };

  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notif-dropdown');
    const bell = document.getElementById('notif-bell-btn');
    if (dropdown && !dropdown.contains(e.target) && !bell.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  fetchNotificationsFromSupabase();
  subscribeRealtimeNotifications();
}

function initNotificationHistoryDrawer() {
  if (document.getElementById('notif-history-drawer')) return;

  const overlay = document.createElement('div');
  overlay.id = 'notif-history-overlay';
  overlay.className = 'notif-history-overlay';
  overlay.onclick = closeNotificationHistory;

  const drawer = document.createElement('div');
  drawer.id = 'notif-history-drawer';
  drawer.className = 'notif-history-drawer';

  // Lắng nghe thao tác vuốt từ TRÁI sang PHẢI để đóng Form Lịch Sử Thông Báo
  let drawerStartX = 0, drawerStartY = 0;
  drawer.addEventListener('touchstart', (e) => {
    drawerStartX = e.touches[0].clientX;
    drawerStartY = e.touches[0].clientY;
  }, { passive: true });

  drawer.addEventListener('touchend', (e) => {
    const drawerEndX = e.changedTouches[0].clientX;
    const drawerEndY = e.changedTouches[0].clientY;
    const diffX = drawerEndX - drawerStartX; // Dương: Vuốt từ Trái sang Phải
    const diffY = drawerEndY - drawerStartY;

    // Vuốt từ trái sang phải trên 50px và là hướng vuốt ngang
    if (diffX > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      closeNotificationHistory();
    }
  }, { passive: true });

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
}

function initCustomModal() {
  if (document.getElementById('custom-modal-overlay')) return;

  const modalHtml = `
    <div id="custom-modal-overlay" style="
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      font-family: var(--font-jost, sans-serif);
    ">
      <div id="custom-modal-box" style="
        width: 100%;
        max-width: 440px;
        background: var(--card, #141821);
        border: 1px solid var(--border, rgba(255,255,255,0.1));
        border-radius: 2px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 1px rgba(240,160,48,0.3);
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        transform: scale(0.95);
        transition: transform 0.2s ease, opacity 0.2s ease;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div id="modal-icon-container" style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 2px;
            background: rgba(240, 160, 48, 0.15);
            border: 1px solid rgba(240, 160, 48, 0.3);
            color: #f0a030;
            flex-shrink: 0;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 id="modal-title" style="
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: var(--foreground, #ffffff);
            letter-spacing: 0.02em;
          ">Thông báo</h3>
        </div>

        <div id="modal-message" style="
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--muted-foreground, #a0aec0);
        "></div>

        <div id="modal-actions" style="
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 4px;
        ">
          <button id="modal-btn-cancel" style="
            padding: 8px 18px;
            background: transparent;
            border: 1px solid var(--border, rgba(255,255,255,0.15));
            border-radius: 2px;
            color: var(--foreground, #ffffff);
            font-family: var(--font-dm-mono, monospace);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.15s;
          " onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">Hủy bỏ</button>

          <button id="modal-btn-confirm" style="
            padding: 8px 20px;
            background: linear-gradient(135deg, #f0a030 0%, #d98818 100%);
            border: none;
            border-radius: 2px;
            color: #000000;
            font-family: var(--font-dm-mono, monospace);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(240, 160, 48, 0.25);
            transition: all 0.15s;
          " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'">Xác nhận</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// ==========================================
// 10. LẮNG NGHE SỰ KIỆN TỔNG (EVENT LISTENERS)
// ==========================================

// 1. Cảnh báo khi Reload (F5), đóng tab hoặc đóng trình duyệt
window.addEventListener('beforeunload', function (e) {
  if (typeof hasUnsavedFormData === 'function' && hasUnsavedFormData()) {
    e.preventDefault();
    e.returnValue = 'Bạn có dữ liệu chưa lưu. Bạn có chắc chắn muốn thoát ra không?';
    return e.returnValue;
  }
});

// 2. Lắng nghe phím tắt bàn phím
document.addEventListener('keydown', function (e) {
  // Thao tác bấm ESC để đóng Form Thông báo / Form Lịch sử
  if (e.key === 'Escape' || e.key === 'Esc') {
    // Nếu Modal Custom Cảnh báo/Xác nhận đang hiển thị thì không chạy tiếp logic bên dưới
    const modalOverlay = document.getElementById('custom-modal-overlay');
    if (modalOverlay && modalOverlay.style.display === 'flex') {
      return;
    }

    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open');
    }

    if (typeof closeNotificationHistory === 'function') {
      closeNotificationHistory();
    }

    // Đóng Drawer In tem nếu đang mở
    if (typeof closePrintLabelDrawer === 'function') {
      closePrintLabelDrawer();
    }

    return;
  }

  // Chặn tự động Submit Form khi bấm Enter trên các ô input/select
  if (e.key === 'Enter') {
    if (document.getElementById('login-container')) return;
    if (e.target.tagName === 'TEXTAREA') return;

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      e.preventDefault();
    }
  }
});

// 3. Khởi tạo ứng dụng khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', async () => {
  sessionStorage.clear();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.getAttribute('data-view')));
  });

  window.addEventListener('resize', () => {
    const newSize = getResponsivePageSize();
    if (state.pageSize !== newSize) {
      state.pageSize = newSize;
      state.page = 1;
      if (typeof currentRenderedView !== 'undefined') {
        currentRenderedView = null;
      }
      render(true);
    }
  });

  // VUỐT SANG TRÁI ĐỂ ĐÓNG MENU (MOBILE SIDEBAR)
  const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
  if (sidebar) {
    let startX = 0, startY = 0;

    sidebar.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    sidebar.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (typeof toggleMobileMenu === 'function' && document.body.classList.contains('mobile-menu-open')) {
          toggleMobileMenu();
        } else {
          sidebar.classList.remove('open', 'active', 'show');
          document.body.classList.remove('sidebar-open');
        }
      }
    }, { passive: true });
  }

  await fetchDataFromSupabase();
  subscribeAppRealtimeChanges();
  render();
  handleRouteChange();
  updateHeaderDate();
  initNotificationUI();
  initTheme();
});