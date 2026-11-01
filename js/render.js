// ==========================================
// 9. RENDER GIAO DIỆN & CÁC TRANG (VIEWS)
// ==========================================

// GIAO DIỆN ĐĂNG NHẬP SANG TRỌNG
function renderLoginForm(container) {
  const savedCredsRaw = localStorage.getItem('remembered_user');
  const savedCreds = savedCredsRaw ? JSON.parse(savedCredsRaw) : { username: '', password: '', remember: false };
  const bannerImg = 'https://res.cloudinary.com/puyb3jyd/image/upload/v1792599496/BeautyPlus-OBJECT-REMOVER-1792599386313.jpg';

  container.innerHTML = `
    <style>
      input:-webkit-autofill,
      input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus, 
      input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.3) inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
      }
    </style>

    <div style="
      min-height: 100vh; 
      width: 100%;
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 20px; 
      font-family: var(--font-jost, sans-serif);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('${bannerImg}') center/cover no-repeat;
    ">

      <!-- FORM ĐĂNG NHẬP CĂN GIỮA MÀN HÌNH -->
      <div style="
        width: 100%;
        max-width: 380px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 1;
      ">

        <form onsubmit="handleLogin(event)" style="width: 100%; display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Username Input -->
          <div style="position: relative;">
            <span style="position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: rgba(255, 255, 255, 0.7); display: flex;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input 
              type="text" 
              id="login-username" 
              required 
              value="${savedCreds.remember ? (savedCreds.username || '') : ''}"
              placeholder="Nhập tên đăng nhập" 
              style="
                width: 100%; 
                padding: 13px 16px 13px 48px; 
                background: rgba(0, 0, 0, 0.3); 
                border: 1px solid rgba(255, 255, 255, 0.25); 
                border-radius: 25px; 
                color: #ffffff; 
                outline: none; 
                font-size: 14px; 
                backdrop-filter: blur(8px);
                transition: all 0.2s ease;
                box-sizing: border-box;
              "
              onfocus="this.style.borderColor='#f0a030'; this.style.background='rgba(0,0,0,0.45)';"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.25)'; this.style.background='rgba(0,0,0,0.3)';"
            >
          </div>

          <!-- Password Input kèm Icon Mắt -->
          <div style="position: relative;">
            <span style="position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: rgba(255, 255, 255, 0.7); display: flex;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input 
              type="password" 
              id="login-password" 
              required 
              value="${savedCreds.remember ? (savedCreds.password || '') : ''}"
              placeholder="Nhập mật khẩu" 
              style="
                width: 100%; 
                padding: 13px 48px 13px 48px; 
                background: rgba(0, 0, 0, 0.3); 
                border: 1px solid rgba(255, 255, 255, 0.25); 
                border-radius: 25px; 
                color: #ffffff; 
                outline: none; 
                font-size: 14px; 
                backdrop-filter: blur(8px);
                transition: all 0.2s ease;
                box-sizing: border-box;
              "
              onfocus="this.style.borderColor='#f0a030'; this.style.background='rgba(0,0,0,0.45)';"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.25)'; this.style.background='rgba(0,0,0,0.3)';"
            >
            <!-- Toggle Password Icon Button -->
            <span 
              id="toggle-password-btn"
              onclick="togglePasswordVisibility()" 
              style="
                position: absolute; 
                right: 18px; 
                top: 50%; 
                transform: translateY(-50%); 
                cursor: pointer; 
                color: rgba(255, 255, 255, 0.7); 
                display: flex; 
                align-items: center;
                transition: color 0.2s;
              "
              onmouseover="this.style.color='#f0a030'"
              onmouseout="this.style.color='rgba(255, 255, 255, 0.7)'"
              title="Ẩn/Hiện mật khẩu"
            >
              <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </span>
          </div>

          <!-- Nút tích Ghi nhớ đăng nhập -->
          <div style="display: flex; align-items: center; justify-content: flex-start; padding: 0 4px; margin-left: 12px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255, 255, 255, 0.85); cursor: pointer; user-select: none;">
              <input 
                type="checkbox" 
                id="login-remember" 
                ${savedCreds.remember ? 'checked' : ''} 
                style="cursor: pointer; accent-color: #f0a030; width: 16px; height: 16px;"
              >
              Ghi nhớ đăng nhập
            </label>
          </div>

          <!-- Thông báo lỗi -->
          <div id="login-error" style="color: #f87171; font-size: 12px; display: none; background: rgba(0,0,0,0.45); border: 1px solid rgba(248, 113, 113, 0.3); padding: 8px 12px; border-radius: 20px; text-align: center;">
            Tài khoản hoặc mật khẩu không chính xác!
          </div>

          <!-- Nút Đăng Nhập -->
          <button 
            type="submit" 
            style="
              width: 100%; 
              padding: 13px; 
              margin-top: 4px; 
              background: #d9534f; 
              border: none; 
              border-radius: 25px !important;; 
              color: #ffffff; 
              font-family: var(--font-jost, sans-serif); 
              font-size: 15px; 
              font-weight: 600; 
              cursor: pointer; 
              transition: all 0.2s ease;
              box-shadow: 0 4px 15px rgba(217, 83, 79, 0.4);
            "
            onmouseover="this.style.background='#c9302c'; this.style.transform='translateY(-1px)';"
            onmouseout="this.style.background='#d9534f'; this.style.transform='none';"
          >
            Đăng Nhập
          </button>
        </form>

      </div>
    </div>
  `;
}

function render() {
  const appContainer = document.querySelector('.app-container');
  const c = document.getElementById('app-content');
  const session = getAuthSession();

  // CHƯA ĐĂNG NHẬP: Hiển thị Form Login & Đẩy URL về /mangden/login
  if (!session.isLoggedIn) {
    if (appContainer) appContainer.style.display = 'none';
    let loginBox = document.getElementById('login-container');
    if (!loginBox) {
      loginBox = document.createElement('div');
      loginBox.id = 'login-container';
      document.body.appendChild(loginBox);
    }

    // Tự động thay đổi URL trên thanh địa chỉ về /mangden/login nếu đang ở URL khác
    const targetLoginUrl = `${BASE_PATH}/login`;
    if (window.location.pathname !== targetLoginUrl) {
      window.history.pushState({ view: 'login' }, '', targetLoginUrl);
    }

    renderLoginForm(loginBox);
    return;
  } else {
    // ĐÃ ĐĂNG NHẬP: Gỡ Form Login và mở ứng dụng
    const loginBox = document.getElementById('login-container');
    if (loginBox) loginBox.remove();
    if (appContainer) appContainer.style.display = 'flex';
    updateUserInfoUI();
  }

  const activeId = document.activeElement ? document.activeElement.id : null;
  const activeEl = document.activeElement;
  let cursorStart = null;
  let cursorEnd = null;

  if (activeEl && typeof activeEl.selectionStart !== 'undefined') {
    cursorStart = activeEl.selectionStart;
    cursorEnd = activeEl.selectionEnd;
  }

  c.innerHTML = '';
  updateGlobalMaterialDatalist();

  if (state.mode !== 'list') {
    switch (state.view) {
      case 'materials': renderMaterialForm(c); break;
      case 'customers': renderCustomerForm(c); break;
      case 'warehouses': renderWarehouseForm(c); break;
      case 'quotations': renderQuotationForm(c); break;
      case 'sales-orders': renderSalesOrderForm(c); break;
      case 'returns': renderReturnForm(c); break;
      case 'grn': renderGRNForm(c); break;
    }
  } else {
    switch (state.view) {
      case 'dashboard': renderDashboard(c); break;
      case 'materials': renderMaterialsList(c); break;
      case 'customers': renderCustomersList(c); break;
      case 'warehouses': renderWarehousesList(c); break;
      case 'quotations': renderQuotationsList(c); break;
      case 'sales-orders': renderOrdersList(c); break;
      case 'returns': renderReturnsList(c); break;
      case 'grn': renderGRNList(c); break;
      case 'report-inventory': renderReportInventory(c); break;
      case 'report-sales': renderReportSales(c); break;
    }
  }

  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.focus();
      try {
        if (cursorStart !== null && cursorEnd !== null && !['number', 'email', 'date'].includes(el.type)) {
          // Khôi phục lại đúng vị trí con trỏ người dùng đang gõ dở
          el.setSelectionRange(cursorStart, cursorEnd);
        }
      } catch (err) { }
    }
  }
}

function renderDashboard(c) {
  const {
    salesDataReal,
    currentMonthRevenue,
    currentMonthOrders,
    recentActivityReal
  } = getSalesAnalyticsData();

  const openQuotationsCount = (db.quotations || []).filter(q => ['pending', 'chờ duyệt'].includes((q.status || '').toLowerCase())).length;

  const totalOrdersCount = (db.orders || []).length;
  const completedOrdersCount = (db.orders || []).filter(o => ['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes((o.status || '').toLowerCase())).length;
  const completionRate = totalOrdersCount > 0 ? ((completedOrdersCount / totalOrdersCount) * 100).toFixed(1) : '100.0';

  const activityHtml = recentActivityReal.map(a => {
    const hasTarget = Boolean(a.targetView && a.itemId);
    const clickAttr = hasTarget ? `onclick="navigate('${a.targetView}', 'view', '${a.itemId}')"` : '';
    const cursorStyle = hasTarget ? 'cursor: pointer;' : '';

    return `
      <div 
        class="hover-row" 
        ${clickAttr}
        onmouseover="this.style.background='color-mix(in srgb, var(--secondary) 50%, transparent)'"
        onmouseout="this.style.background='transparent'"
        style="padding: 12px 18px; border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: flex-start; justify-content: space-between; ${cursorStyle} transition: background 0.15s ease;"
        ${hasTarget ? `title="Click để xem chi tiết ${a.event}"` : ''}
      >
        <div style="font-size: 13px; font-weight: 500; flex: 1;">
          <div style="color: var(--foreground); font-weight: 600;">${a.event}</div>
          <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 2px;">${a.detail}</div>
          ${a.actor ? `<div style="font-size: 11px; color: #f0a030; font-family: var(--font-dm-mono); margin-top: 4px;">Thực hiện: ${a.actor}</div>` : ''}
        </div>
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground); white-space: nowrap; margin-left: 12px;">${a.time}</span>
      </div>
    `;
  }).join('');

  const currentMonthStr = `Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div class="kpi-grid">
        <div class="kpi-card"><span class="kpi-label">Doanh thu tháng này</span><div class="kpi-value-row"><span class="kpi-value">${fmtUSD(currentMonthRevenue)}</span></div><span class="kpi-sub">${currentMonthStr}</span></div>
        <div class="kpi-card"><span class="kpi-label">Đơn hàng tháng này</span><div class="kpi-value-row"><span class="kpi-value">${fmt(currentMonthOrders)}</span></div><span class="kpi-sub">${currentMonthStr}</span></div>
        <div class="kpi-card"><span class="kpi-label">Báo giá chưa khóa</span><div class="kpi-value-row"><span class="kpi-value">${openQuotationsCount}</span></div><span class="kpi-sub">chờ duyệt</span></div>
        <div class="kpi-card"><span class="kpi-label">Tỷ lệ hoàn thành</span><div class="kpi-value-row"><span class="kpi-value">${completionRate}%</span></div><span class="kpi-sub">giao đúng hạn</span></div>
      </div>
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;" class="grid-2">
        <div style="border: 1px solid var(--border); background: var(--card); padding: 20px;">
          <div style="font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 16px;">Doanh Thu Hàng Tháng</div>
          <div style="height: 200px;"><canvas id="chart-rev"></canvas></div>
        </div>
        <div style="border: 1px solid var(--border); background: var(--card);">
          <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground);">HOẠT ĐỘNG MỚI NHẤT</div>
          <div>
            ${activityHtml || '<div style="padding: 20px; text-align: center; color: var(--muted-foreground); font-size: 12px;">Chưa có hoạt động gần đây</div>'}
          </div>
        </div>
      </div>
    </div>
  `;

  const ctx = document.getElementById('chart-rev').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesDataReal.map(d => d.month),
      datasets: [{
        label: 'Doanh thu',
        data: salesDataReal.map(d => d.revenue),
        borderColor: '#f0a030',
        backgroundColor: 'rgba(240,160,48,0.15)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#252a33' }, ticks: { color: '#6b7585' } },
        y: { grid: { color: '#252a33' }, ticks: { color: '#6b7585' } }
      }
    }
  });
}

function renderMaterialsList(c) {
  const hasPermission = checkModulePermission('materials');

  const filtered = db.materials.filter(m => {
    if (state.filter !== 'all' && m.status !== state.filter) return false;
    const searchKey = normalizeSearchText(state.search);
    if (searchKey && !normalizeSearchText(m.name).includes(searchKey) && !normalizeSearchText(m.id).includes(searchKey)) return false;
    return true;
  });

  // TÍNH TOÁN PHÂN TRANG
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + state.pageSize);

  const totalSku = db.materials.length;
  const totalStock = db.materials.reduce((a, i) => a + (Number(i.stock) || 0), 0);
  const lowCount = db.materials.filter(i => (i.status || '').toLowerCase() === 'low').length;
  const outCount = db.materials.filter(i => (i.status || '').toLowerCase() === 'out').length;

  const kpiHtml = [
    { label: 'TỔNG SỐ SKU', value: fmt(totalSku), color: 'var(--foreground)' },
    { label: 'TỔNG TỒN KHO', value: fmt(totalStock), color: '#34d399' },
    { label: 'SẮP HẾT', value: fmt(lowCount), color: '#fbbf24' },   // Thống kê Sắp hết (Màu vàng/cam)
    { label: 'HẾT HÀNG', value: fmt(outCount), color: '#f87171' }    // Thống kê Hết hàng (Màu đỏ)
  ].map(s => `
    <div style="background-color: var(--card); padding: 16px 20px;">
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${s.label}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 24px; font-weight: 300; color: ${s.color};">${s.value}</div>
    </div>
  `).join('');

  const columnConfig = [
    { title: 'Mã Hàng (SKU)', width: '30px', align: 'center' },
    { title: 'Tên Hàng', width: '100px', align: 'center' },
    { title: 'Đơn Vị', width: '20px', align: 'center' },
    { title: 'Danh Mục', width: '40px', align: 'center' },
    { title: 'Vị Trí Lưu Kho', width: '40px', align: 'center' },
    { title: 'Tồn Kho Ban Đầu', width: '30px', align: 'center' },
    { title: 'Đơn Giá', width: '30px', align: 'center' },
    { title: 'Trạng Thái', width: '50px', align: 'center' },
    { title: 'Người Tạo', width: '50px', align: 'center' },
    { title: 'Ngày Tạo', width: '30px', align: 'center' },
    { title: 'Giờ Tạo', width: '20px', align: 'center' },
    { title: 'Người Sửa', width: '50px', align: 'center' },
    { title: 'Ngày Sửa', width: '30px', align: 'center' },
    { title: 'Giờ Sửa', width: '20px', align: 'center' },
    { title: 'Hành Động', width: '80px', align: 'center' }
  ];

  const headersHtml = columnConfig.map(col => `
  <th style="width: ${col.width}; min-width: ${col.width}; padding: 9px 16px; text-align: ${col.align}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">
    ${col.title}
  </th>
`).join('');

  const rowsHtml = paginatedItems.map(m => `
    <tr style="border-bottom: 1px solid var(--border);" class="hover-row" ondblclick="navigate('materials', '${hasPermission ? 'edit' : 'view'}', '${m.id}')" onclick="navigate('materials', 'view', '${m.id}')">
      <td data-label="Mã Hàng" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: left; color: var(--primary);">${m.id}</td>
      <td data-label="Tên Hàng" style="padding: 11px 16px; font-size: 13px;">${m.name}</td>
      <td data-label="Đơn Vị" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--foreground);">${m.unit || '—'}</td>
      <td data-label="Danh Mục" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${m.category || '—'}</td>
      <td data-label="Vị Trí Lưu Kho" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center;">${m.location || '—'}</td>
      <td data-label="Tồn Kho Ban Đầu" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right;">${m.stock ?? 0}</td>
      <td data-label="Đơn Giá" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right;">${fmtUSD(m.cost || 0)}</td>
      <td data-label="Trạng Thái" style="padding: 11px 16px; text-align: center;">
        <span class="badge ${getBadgeClass(m.status)}">${getStatusLabel(m.status)}</span>
      </td>
      
      <td data-label="Người Tạo" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(m.user_id0)}</td>
      <td data-label="Ngày Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(m.date0)}</td>
      <td data-label="Giờ Táo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(m.time0)}</td>
      <td data-label="Người Sửa" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(m.user_id2)}</td>
      <td data-label="Ngày Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(m.date2)}</td>
      <td data-label="Giờ Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(m.time2)}</td>

      <td data-label="Hành Động" style="padding: 8px 16px; text-align: center; white-space: nowrap;">
        <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
          <button class="btn-action" onclick="event.stopPropagation(); navigate('materials', 'view', '${m.id}')">${Icons.view} Xem</button>
          ${hasPermission ? `<button class="btn-action" onclick="event.stopPropagation(); navigate('materials', 'edit', '${m.id}')">${Icons.edit} Sửa</button>` : ''}
          ${hasPermission ? `<button class="btn-action btn-action-del" onclick="event.stopPropagation(); deleteItem('materials', '${m.id}')">${Icons.trash} Xóa</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        ${kpiHtml}
      </div>
      <div class="filter-search-container" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        ${getFilterBar([['all', 'TẤT CẢ'], ['ok', 'ĐỦ HÀNG'], ['low', 'SẮP HẾT'], ['out', 'HẾT HÀNG']])}
        <div class="mobile-search-action-group" style="display: flex; gap: 8px; flex-wrap: wrap; width: 100%; max-width: 550px;">
          <div style="display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); background: var(--card); padding: 0 12px; flex: 1; min-width: 200px; height: 38px; box-sizing: border-box;">
            <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
            <input type="text" id="global-search" placeholder="Tìm kiếm..." value="${state.search || ''}" oninput="state.search=this.value; state.page=1; render();" style="background: transparent; border: none; outline: none; color: var(--foreground); font-family: var(--font-jost); font-size: 13px; width: 100%; height: 100%; padding: 0;">
          </div>
          ${hasPermission ? `<button class="btn-primary" onclick="navigate('materials', 'add')">${Icons.plus} Thêm Mới</button>` : ''}
          <button class="btn-action pc-only-print-btn" onclick="openPrintLabelDrawer()" style="height: 38px; padding: 0 14px; background: var(--card); border: 1px solid var(--border); color: var(--foreground); font-family: var(--font-jost); font-size: 13px; font-weight: 500; cursor: pointer; align-items: center; gap: 6px; white-space: nowrap;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            In Tem Sản Phẩm
          </button>
        </div>
      </div>

      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary);">
              ${headersHtml}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        ${filtered.length === 0 ? `<div style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px;">Không tìm thấy dữ liệu</div>` : ''}
      </div>

      <!-- THANH ĐIỀU HƯỚNG PHÂN TRANG -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
          Hiển thị ${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} / Tổng ${totalItems} mục
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
          <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${totalPages}</span>
          <button ${state.page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
        </div>
      </div>
    </div>
  `;
}

function renderCustomersList(c) {
  const hasPermission = checkModulePermission('customers');

  const filtered = db.customers.filter(c => {
    const matchStatus = (state.filter === 'all' || c.status === state.filter);
    const searchKey = normalizeSearchText(state.search);
    const matchSearch = !searchKey ||
      normalizeSearchText(c.name).includes(searchKey) ||
      normalizeSearchText(c.id).includes(searchKey) ||
      normalizeSearchText(c.contact).includes(searchKey) ||
      normalizeSearchText(c.address || c.diachi).includes(searchKey);
    return matchStatus && matchSearch;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + state.pageSize);

  const totalCount = db.customers.length;
  const activeCount = db.customers.filter(c => c.status === 'active').length;
  const inactiveCount = db.customers.filter(c => c.status === 'inactive').length;
  const suspendedCount = db.customers.filter(c => c.status === 'suspended').length;

  // TÁCH THÀNH 4 Ô KPI VỚI MÀU SẮC CHUẨN
  const kpiHtml = [
    { label: 'TỔNG KHÁCH HÀNG', value: fmt(totalCount), color: 'var(--foreground)' },
    { label: 'ĐANG HOẠT ĐỘNG', value: fmt(activeCount), color: '#34d399' },
    { label: 'NGỪNG HOẠT ĐỘNG', value: fmt(inactiveCount), color: 'var(--muted-foreground)' },
    { label: 'TẠM KHÓA', value: fmt(suspendedCount), color: '#f87171' }
  ].map(s => `
    <div style="background-color: var(--card); padding: 16px 20px;">
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${s.label}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 24px; font-weight: 300; color: ${s.color};">${s.value}</div>
    </div>
  `).join('');

  const columnConfig = [
    { title: 'Mã Khách Hàng', width: '30px', align: 'center' },
    { title: 'Tên Công Ty / KH', width: '100px', align: 'center' },
    { title: 'Người Liên Hệ', width: '60px', align: 'center' },
    { title: 'Email', width: '60px', align: 'center' },
    { title: 'Số Điện Thoại', width: '40px', align: 'center' },
    { title: 'Địa Chỉ', width: '120px', align: 'center' },
    { title: 'Trạng Thái', width: '50px', align: 'center' },
    { title: 'Người Tạo', width: '50px', align: 'center' },
    { title: 'Ngày Tạo', width: '30px', align: 'center' },
    { title: 'Giờ Tạo', width: '20px', align: 'center' },
    { title: 'Người Sửa', width: '50px', align: 'center' },
    { title: 'Ngày Sửa', width: '30px', align: 'center' },
    { title: 'Giờ Sửa', width: '20px', align: 'center' },
    { title: 'Hành Động', width: '80px', align: 'center' }
  ];

  const headersHtml = columnConfig.map(col => `
  <th style="width: ${col.width}; min-width: ${col.width}; padding: 9px 16px; text-align: ${col.align}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">
    ${col.title}
  </th>
`).join('');

  const rowsHtml = paginatedItems.map(c => `
    <tr style="border-bottom: 1px solid var(--border);" class="hover-row" ondblclick="navigate('customers', '${hasPermission ? 'edit' : 'view'}', '${c.id}')" onclick="navigate('customers', 'view', '${c.id}')">
      <td data-label="Mã Khách Hàng" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: left; color: var(--primary); text-align: left;">${c.id || '—'}</td>
      <td data-label="Tên Công Ty / Khách Hàng" style="padding: 11px 16px; font-size: 13px; font-weight: 500; text-align: left;">${c.name || '—'}</td>
      <td data-label="Người Liên Hệ" style="padding: 11px 16px; font-size: 13px; text-align: left;">${c.contact || '—'}</td>
      <td data-label="Email" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground); text-align: left;">${c.email || '—'}</td>
      <td data-label="Số Điện Thoại" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: left;">${c.phone || '—'}</td>
      <td data-label="Địa Chỉ" style="padding: 11px 16px; font-size: 13px; text-align: left;">${c.address || c.diachi || '—'}</td>
      <td data-label="Trạng Thái" style="padding: 11px 16px; text-align: center;"><span class="badge ${getBadgeClass(c.status)}">${getStatusLabel(c.status)}</span></td>

      <td data-label="Người Tạo" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(c.user_id0)}</td>
      <td data-label="Ngày Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(c.date0)}</td>
      <td data-label="Giờ Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(c.time0)}</td>
      <td data-label="Người Sửa" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(c.user_id2)}</td>
      <td data-label="Ngày Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(c.date2)}</td>
      <td data-label="Giờ Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(c.time2)}</td>
    
      <td data-label="Hành Động" style="padding: 8px 16px; text-align: center; white-space: nowrap;">
        <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
          <button class="btn-action" onclick="event.stopPropagation(); navigate('customers', 'view', '${c.id}')">${Icons.view} Xem</button>
          ${hasPermission ? `<button class="btn-action" onclick="event.stopPropagation(); navigate('customers', 'edit', '${c.id}')">${Icons.edit} Sửa</button>` : ''}
          ${hasPermission ? `<button class="btn-action btn-action-del" onclick="event.stopPropagation(); deleteItem('customers', '${c.id}')">${Icons.trash} Xóa</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        ${kpiHtml}
      </div>
      <div class="filter-search-container" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        ${getFilterBar([['all', 'Tất cả'], ['active', 'Đang Hoạt Động'], ['inactive', 'Ngừng Hoạt Động'], ['suspended', 'Tạm Khóa']])}
        <div class="mobile-search-action-group" style="display: flex; gap: 8px; flex-wrap: wrap; width: 100%; max-width: 450px;">
          <div style="display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); background: var(--card); padding: 0 12px; flex: 1; min-width: 200px; height: 38px; box-sizing: border-box;">
            <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
            <input type="text" id="global-search" placeholder="Tìm kiếm..." value="${state.search || ''}" oninput="state.search=this.value; state.page=1; render();" style="background: transparent; border: none; outline: none; color: var(--foreground); font-family: var(--font-jost); font-size: 13px; width: 100%; height: 100%; padding: 0;">
          </div>
          ${hasPermission ? `<button class="btn-primary" onclick="navigate('customers', 'add')">${Icons.plus} Thêm Mới</button>` : ''}
        </div>
      </div>     

      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary);">
              ${headersHtml}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        ${filtered.length === 0 ? `<div style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px;">Không tìm thấy dữ liệu</div>` : ''}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
          Hiển thị ${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} / Tổng ${totalItems} mục
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
          <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${totalPages}</span>
          <button ${state.page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
        </div>
      </div>
    </div>
  `;
}

function renderWarehousesList(c) {
  const hasPermission = checkModulePermission('warehouses');

  const cardsHtml = db.warehouses.map(w => {
    const pct = Math.round((w.used / w.capacity) * 100);
    const barColor = pct > 90 ? '#f87171' : pct > 75 ? '#fbbf24' : 'var(--primary)';
    return `
      <div style="border: 1px solid var(--border); background: var(--card); position: relative; cursor: pointer;" ondblclick="navigate('warehouses', '${hasPermission ? 'edit' : 'view'}', '${w.id}')" onclick="navigate('warehouses', 'view', '${w.id}')">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: var(--primary); font-family: var(--font-dm-mono); font-size: 14px; font-weight: 500;">${w.code || w.id}</span>
            <span style="color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">${w.name}</span>
          </div>
          <span class="badge ${getBadgeClass(w.status)}">${getWarehouseStatusLabel(w.status)}</span>
        </div>
        <div style="padding: 16px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div><div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">VỊ TRÍ</div><div style="font-size: 12px;">${w.location}</div></div>
          <div><div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">QUẢN LÝ</div><div style="font-size: 13px;">${w.manager}</div></div>
          <div style="grid-column: span 2;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em;">SỨC CHỨA</span>
              <span style="font-family: var(--font-dm-mono); font-size: 11px; color: ${pct > 75 ? barColor : 'var(--foreground)'}">${fmt(w.used || 0)} / ${fmt(w.capacity || 0)} đơn vị (${pct || 0}%)</span>
            </div>
            <div style="height: 3px; background: var(--muted);"><div style="width: ${pct || 0}%; height: 100%; background: ${barColor};"></div></div>
          </div>
        </div>
        <div style="padding: 10px 20px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-action" onclick="event.stopPropagation(); navigate('warehouses', 'view', '${w.id}')">${Icons.view} Xem</button>
          ${hasPermission ? `<button class="btn-action" onclick="event.stopPropagation(); navigate('warehouses', 'edit', '${w.id}')">${Icons.edit} Sửa</button>` : ''}
          ${hasPermission ? `<button class="btn-action btn-action-del" onclick="event.stopPropagation(); deleteItem('warehouses', '${w.id}')">${Icons.trash} Xóa</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Chuyển justify-content thành flex-start để căn sát lề trái -->
      <div style="display: flex; justify-content: flex-start;">
        ${hasPermission ? `<button class="btn-primary" onclick="navigate('warehouses', 'add')">${Icons.plus} Thêm Mới</button>` : ''}
      </div>
      <div class="grid-2">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function renderQuotationsList(c) {
  const hasPermission = checkModulePermission('quotations');

  // Khởi tạo state ngày từ - đến cho Báo Giá
  if (!state.quotationsFromDate) state.quotationsFromDate = getFirstDayOfMonthStr();
  if (!state.quotationsToDate) state.quotationsToDate = getLastDayOfMonthStr();

  const filtered = db.quotations.filter(q => {
    const matchStatus = (state.filter === 'all' || q.status === state.filter);

    // Lọc theo khoảng ngày lập phiếu (date)
    const dateStr = q.date || '';
    const matchDate = dateStr >= state.quotationsFromDate && dateStr <= state.quotationsToDate;

    const searchKey = normalizeSearchText(state.search);
    const dateFormatted = dateStr.includes('-') ? dateStr.split('-').reverse().join('/') : dateStr;
    const statusLabel = getStatusLabel(q.status);

    const matchSearch = !searchKey ||
      normalizeSearchText(q.customer).includes(searchKey) ||
      normalizeSearchText(q.customerId || q.customerid).includes(searchKey) ||
      normalizeSearchText(q.id).includes(searchKey) ||
      normalizeSearchText(dateStr).includes(searchKey) ||
      normalizeSearchText(dateFormatted).includes(searchKey) ||
      normalizeSearchText(q.status).includes(searchKey) ||
      normalizeSearchText(statusLabel).includes(searchKey);

    return matchStatus && matchDate && matchSearch;
  });

  // TÍNH TOÁN PHÂN TRANG
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + state.pageSize);

  const kpiHtml = [
    ['all', 'Tổng Báo Giá'],
    ['accepted', 'Duyệt'],
    ['pending', 'Chờ Duyệt'],
    ['rejected', 'Từ Chối'],
    ['expired', 'Hết Hạn']
  ].map(([s, label]) => {
    const count = s === 'all'
      ? db.quotations.length
      : db.quotations.filter(q => q.status === s || (s === 'accepted' && q.status === 'approved') || (s === 'pending' && q.status === 'draft')).length;

    const color = s === 'all' ? 'var(--foreground)'
      : s === 'accepted' ? '#34d399'
        : s === 'pending' ? 'var(--foreground)'
          : s === 'rejected' ? '#818cf8'
            : '#f87171';

    return `
      <div style="background-color: var(--card); padding: 16px 20px;">
        <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${label}</div>
        <div style="font-family: var(--font-dm-mono); font-size: 24px; font-weight: 300; color: ${color};">${count}</div>
      </div>
    `;
  }).join('');

  const columnConfig = [
    { title: 'Mã Báo Giá', width: '30px', align: 'center' },
    { title: 'Ngày Lập Phiếu', width: '30px', align: 'center' },
    { title: 'Khách Hàng', width: '50px', align: 'center' },
    { title: 'Ngày Bắt Đầu', width: '30px', align: 'center' },
    { title: 'Ngày Kết Thúc', width: '30px', align: 'center' },
    { title: 'Số Dòng', width: '20px', align: 'center' },
    { title: 'Trạng Thái', width: '40px', align: 'center' },
    { title: 'Người Tạo', width: '50px', align: 'center' },
    { title: 'Ngày Tạo', width: '30px', align: 'center' },
    { title: 'Giờ Tạo', width: '20px', align: 'center' },
    { title: 'Người Sửa', width: '50px', align: 'center' },
    { title: 'Ngày Sửa', width: '30px', align: 'center' },
    { title: 'Giờ Sửa', width: '20px', align: 'center' },
    { title: 'Hành Động', width: '80px', align: 'center' }
  ];

  const headersHtml = columnConfig.map(col => `
  <th style="width: ${col.width}; min-width: ${col.width}; padding: 9px 16px; text-align: ${col.align}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">
    ${col.title}
  </th>
`).join('');

  const rowsHtml = paginatedItems.map(q => `
    <tr style="border-bottom: 1px solid var(--border);" class="hover-row" ondblclick="navigate('quotations', '${hasPermission ? 'edit' : 'view'}', '${q.id}')" onclick="navigate('quotations', 'view', '${q.id}')">
      <td data-label="Mã Báo Giá" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: left; color: var(--primary);">${q.id}</td>
      <td data-label="Ngày Lập" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${q.date || '—'}</td>
      <td data-label="Khách Hàng" style="padding: 12px 16px; font-size: 13px; font-weight: 500;">${q.customer}</td>      
      <td data-label="Ngày Bắt Đầu" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${q.validbegin || q.validBegin || '—'}</td>
      <td data-label="Ngày Kết Thúc" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${q.validUntil}</td>
      <td data-label="Số Dòng" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center;">${(q.lineItems || []).length}</td>
      <td data-label="Trạng Thái" style="padding: 12px 16px; text-align: center;"><span class="badge ${getBadgeClass(q.status)}">${getStatusLabel(q.status)}</span></td>

      <td data-label="Người Tạo" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(q.user_id0)}</td>
      <td data-label="Ngày Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(q.date0)}</td>
      <td data-label="Giờ Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(q.time0)}</td>
      <td data-label="Người Sửa" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(q.user_id2)}</td>
      <td data-label="Ngày Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(q.date2)}</td>
      <td data-label="Giờ Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(q.time2)}</td>

      <td data-label="Hành Động" style="padding: 8px 16px; text-align: center; white-space: nowrap;">
        <button class="btn-action" onclick="event.stopPropagation(); navigate('quotations', 'view', '${q.id}')">${Icons.view} Xem</button>
        ${hasPermission ? `<button class="btn-action" onclick="event.stopPropagation(); navigate('quotations', 'edit', '${q.id}')">${Icons.edit} Sửa</button>` : ''}
        ${hasPermission ? `<button class="btn-action btn-action-del" onclick="event.stopPropagation(); deleteItem('quotations', '${q.id}')">${Icons.trash} Xóa</button>` : ''}
      </td>
    </tr>
  `).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        ${kpiHtml}
      </div>

      <div class="filter-search-container" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        ${getFilterBar([['all', 'Tất cả'], ['accepted', 'Duyệt'], ['pending', 'Chờ duyệt'], ['rejected', 'Từ chối'], ['expired', 'Hết hạn']])}
        
        <div class="filter-controls-wrapper">
          <!-- Cụm Tìm kiếm + Thêm mới (Nằm trên ở Mobile) -->
          <div class="mobile-search-action-group">
            <div class="search-box-input">
              <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
              <input type="text" id="global-search" placeholder="Tìm kiếm..." value="${state.search || ''}" oninput="state.search=this.value; state.page=1; render();">
            </div>
            ${hasPermission ? `<button class="btn-primary" onclick="navigate('quotations', 'add')">${Icons.plus} Thêm Mới</button>` : ''}
          </div>

          <!-- Cụm Chọn Ngày (Nằm dưới ở Mobile) -->
          <div class="date-filter-group">
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Từ ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.quotationsFromDate}" onchange="state.quotationsFromDate=this.value; state.page=1; render();">
            </div>
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Đến ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.quotationsToDate}" onchange="state.quotationsToDate=this.value; state.page=1; render();">
            </div>
          </div>
        </div>
      </div>

      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary);">
              ${headersHtml}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        ${filtered.length === 0 ? `<div style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px;">Không tìm thấy dữ liệu phù hợp</div>` : ''}
      </div>

      <!-- THANH ĐIỀU HƯỚNG PHÂN TRANG -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
          Hiển thị ${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} / Tổng ${totalItems} mục
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
          <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${totalPages}</span>
          <button ${state.page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
        </div>
      </div>
    </div>
  `;
}

function renderOrdersList(c) {
  const hasPermission = checkModulePermission('sales-orders');

  // Khởi tạo state ngày từ - đến cho Đơn Bán Hàng
  if (!state.ordersFromDate) state.ordersFromDate = getFirstDayOfMonthStr();
  if (!state.ordersToDate) state.ordersToDate = getLastDayOfMonthStr();

  const filtered = db.orders.filter(o => {
    const matchStatus = (state.filter === 'all' || o.status === state.filter);

    // Lọc theo khoảng ngày lập phiếu (date)
    const dateStr = o.date || '';
    const matchDate = dateStr >= state.ordersFromDate && dateStr <= state.ordersToDate;

    const searchKey = normalizeSearchText(state.search);
    const dateFormatted = dateStr.includes('-') ? dateStr.split('-').reverse().join('/') : dateStr;
    const statusLabel = getStatusLabel(o.status);

    const matchSearch = !searchKey ||
      normalizeSearchText(o.customer).includes(searchKey) ||
      normalizeSearchText(o.customerId || o.customerid).includes(searchKey) ||
      normalizeSearchText(o.id).includes(searchKey) ||
      normalizeSearchText(dateStr).includes(searchKey) ||
      normalizeSearchText(dateFormatted).includes(searchKey) ||
      normalizeSearchText(o.status).includes(searchKey) ||
      normalizeSearchText(statusLabel).includes(searchKey);

    return matchStatus && matchDate && matchSearch;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + state.pageSize);

  // ĐỒNG BỘ KPI ĐỜN BÁN HÀNG
  const kpiHtml = [
    { label: 'Tổng đơn hàng', val: db.orders.length, color: 'var(--foreground)' },
    { label: 'Hoàn thành', val: db.orders.filter(o => ['completed', 'hoàn thành'].includes((o.status || '').toLowerCase())).length, color: '#60a5fa' },
    { label: 'Duyệt', val: db.orders.filter(o => ['accepted', 'approved', 'duyệt', 'đã duyệt'].includes((o.status || '').toLowerCase())).length, color: '#34d399' },
    { label: 'Chờ duyệt', val: db.orders.filter(o => ['pending', 'chờ duyệt', 'processing', 'đang xử lý'].includes((o.status || '').toLowerCase())).length, color: '#fbbf24' },
    { label: 'Đã Hủy', val: db.orders.filter(o => ['cancelled', 'đã hủy'].includes((o.status || '').toLowerCase())).length, color: '#f87171' },
  ].map(s => `
    <div style="background-color: var(--card); padding: 16px 20px;">
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${s.label}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 24px; font-weight: 300; color: ${s.color};">${s.val}</div>
    </div>
  `).join('');

  const columnConfig = [
    { title: 'Mã Đơn Hàng', width: '30px', align: 'center' },
    { title: 'Ngày Lập Phiếu', width: '30px', align: 'center' },
    { title: 'Khách Hàng', width: '50px', align: 'center' },
    { title: 'Ghi Chú', width: '60px', align: 'center' },
    { title: 'Số Dòng', width: '20px', align: 'center' },
    { title: 'Tổng Tiền', width: '30px', align: 'center' },
    { title: 'Trạng Thái', width: '40px', align: 'center' },
    { title: 'Người Tạo', width: '50px', align: 'center' },
    { title: 'Ngày Tạo', width: '30px', align: 'center' },
    { title: 'Giờ Tạo', width: '20px', align: 'center' },
    { title: 'Người Sửa', width: '50px', align: 'center' },
    { title: 'Ngày Sửa', width: '30px', align: 'center' },
    { title: 'Giờ Sửa', width: '20px', align: 'center' },
    { title: 'Hành Động', width: '80px', align: 'center' }
  ];

  const headersHtml = columnConfig.map(col => `
  <th style="width: ${col.width}; min-width: ${col.width}; padding: 9px 16px; text-align: ${col.align}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">
    ${col.title}
  </th>
`).join('');

  const rowsHtml = paginatedItems.map(o => `
    <tr style="border-bottom: 1px solid var(--border);" class="hover-row" ondblclick="navigate('sales-orders', '${hasPermission ? 'edit' : 'view'}', '${o.id}')" onclick="navigate('sales-orders', 'view', '${o.id}')">
      <td data-label="Mã Đơn Hàng" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: left; color: var(--primary);">${o.id}</td>
      <td data-label="Ngày Lập Phiếu" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${o.date}</td>
      <td data-label="Khách Hàng" style="padding: 12px 16px; font-size: 13px; font-weight: 500;">${o.customer}</td>
      <td data-label="Ghi Chú" style="padding: 12px 16px; font-size: 12px; text-align: left; color: var(--muted-foreground);">${o.notes || '—'}</td>
      <td data-label="Số Dòng" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center;">${(o.lineItems || o.lineitems || []).length || o.items || 0}</td>
      <td data-label="Tổng Tiền" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 13px; font-weight: 500; text-align: right;">${fmtUSD(o.total)}</td>
      <td data-label="Trạng Thái" style="padding: 12px 16px; text-align: center;"><span class="badge ${getBadgeClass(o.status)}">${getStatusLabel(o.status)}</span></td>

      <td data-label="Người Tạo" style="padding: 12px 16px; font-size: 12px;">${getUserFullName(o.user_id0)}</td>
      <td data-label="Ngày Tạo" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(o.date0)}</td>
      <td data-label="Giờ Tạo" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(o.time0)}</td>
      <td data-label="Người Sửa" style="padding: 12px 16px; font-size: 12px;">${getUserFullName(o.user_id2)}</td>
      <td data-label="Ngày Sửa" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(o.date2)}</td>
      <td data-label="Giờ Sửa" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(o.time2)}</td>

      <td data-label="Hành Động" style="padding: 8px 16px; text-align: center; white-space: nowrap;">
        <button class="btn-action" onclick="event.stopPropagation(); navigate('sales-orders', 'view', '${o.id}')">${Icons.view} Xem</button>
        ${hasPermission ? `<button class="btn-action" onclick="event.stopPropagation(); navigate('sales-orders', 'edit', '${o.id}')">${Icons.edit} Sửa</button>` : ''}
        ${hasPermission ? `<button class="btn-action btn-action-del" onclick="event.stopPropagation(); deleteItem('sales-orders', '${o.id}')">${Icons.trash} Xóa</button>` : ''}
      </td>
    </tr>
  `).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        ${kpiHtml}
      </div>

      <div class="filter-search-container" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        ${getFilterBar([['all', 'Tất cả'], ['accepted', 'Duyệt'], ['pending', 'Chờ duyệt'], ['rejected', 'Từ chối'], ['expired', 'Hết hạn']])}
        
        <div class="filter-controls-wrapper">
          <!-- Cụm Tìm kiếm + Thêm mới (Nằm trên ở Mobile) -->
          <div class="mobile-search-action-group">
            <div class="search-box-input">
              <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
              <input type="text" id="global-search" placeholder="Tìm kiếm..." value="${state.search || ''}" oninput="state.search=this.value; state.page=1; render();">
            </div>
            ${hasPermission ? `<button class="btn-primary" onclick="navigate('sales-orders', 'add')">${Icons.plus} Thêm Mới</button>` : ''}
          </div>

          <!-- Cụm Chọn Ngày (Nằm dưới ở Mobile) -->
          <div class="date-filter-group">
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Từ ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.ordersFromDate}" onchange="state.ordersFromDate=this.value; state.page=1; render();">
            </div>
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Đến ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.ordersToDate}" onchange="state.ordersToDate=this.value; state.page=1; render();">
            </div>
          </div>
        </div>
      </div>

      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary);">
              ${headersHtml}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        ${filtered.length === 0 ? `<div style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px;">Không tìm thấy dữ liệu phù hợp</div>` : ''}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
          Hiển thị ${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} / Tổng ${totalItems} mục
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
          <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${totalPages}</span>
          <button ${state.page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
        </div>
      </div>
    </div>
  `;
}

function renderReturnsList(c) {
  const hasPermission = checkModulePermission('returns');

  if (!state.returnsFromDate) state.returnsFromDate = getFirstDayOfMonthStr();
  if (!state.returnsToDate) state.returnsToDate = getLastDayOfMonthStr();

  const filtered = db.returns.filter(r => {
    const matchStatus = (state.filter === 'all' || r.status === state.filter);

    const dateStr = r.date || '';
    const matchDate = dateStr >= state.returnsFromDate && dateStr <= state.returnsToDate;

    const searchKey = normalizeSearchText(state.search);
    const dateFormatted = dateStr.includes('-') ? dateStr.split('-').reverse().join('/') : dateStr;
    const statusLabel = getStatusLabel(r.status);

    const matchSearch = !searchKey ||
      normalizeSearchText(r.id).includes(searchKey) ||
      normalizeSearchText(r.orderId).includes(searchKey) ||
      normalizeSearchText(r.customer).includes(searchKey) ||
      normalizeSearchText(r.reason).includes(searchKey) ||
      normalizeSearchText(dateStr).includes(searchKey) ||
      normalizeSearchText(dateFormatted).includes(searchKey) ||
      normalizeSearchText(r.status).includes(searchKey) ||
      normalizeSearchText(statusLabel).includes(searchKey);

    return matchStatus && matchDate && matchSearch;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + state.pageSize);

  const kpiHtml = [
    { label: 'Tổng số phiếu', val: db.returns.length, color: 'var(--foreground)' },
    { label: 'Hoàn thành', val: db.returns.filter(r => ['processed', 'hoàn thành', 'đã xử lý'].includes((r.status || '').toLowerCase())).length, color: '#60a5fa' },
    { label: 'Duyệt', val: db.returns.filter(r => ['approved', 'duyệt', 'đã duyệt'].includes((r.status || '').toLowerCase())).length, color: '#34d399' },
    { label: 'Chờ duyệt', val: db.returns.filter(r => ['pending', 'chờ duyệt'].includes((r.status || '').toLowerCase())).length, color: 'var(--foreground)' },
    { label: 'Từ chối', val: db.returns.filter(r => ['rejected', 'từ chối'].includes((r.status || '').toLowerCase())).length, color: '#818cf8' }
  ].map(s => `
    <div style="background-color: var(--card); padding: 16px 20px;">
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${s.label}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 24px; font-weight: 300; color: ${s.color};">${s.val}</div>
    </div>
  `).join('');

  const columnConfig = [
    { title: 'Mã Nhận Trả', width: '30px', align: 'center' },
    { title: 'Ngày Nhận Trả', width: '30px', align: 'center' },
    { title: 'Đơn Hàng Bán', width: '30px', align: 'center' },
    { title: 'Khách Hàng', width: '50px', align: 'center' },
    { title: 'Lý Do', width: '50px', align: 'center' },
    { title: 'Số Dòng', width: '20px', align: 'center' },
    { title: 'Tổng Hoàn Tiền', width: '30px', align: 'center' },
    { title: 'Trạng Thái', width: '40px', align: 'center' },
    { title: 'Người Tạo', width: '50px', align: 'center' },
    { title: 'Ngày Tạo', width: '30px', align: 'center' },
    { title: 'Giờ Tạo', width: '20px', align: 'center' },
    { title: 'Người Sửa', width: '50px', align: 'center' },
    { title: 'Ngày Sửa', width: '30px', align: 'center' },
    { title: 'Giờ Sửa', width: '20px', align: 'center' },
    { title: 'Hành Động', width: '80px', align: 'center' }
  ];

  const headersHtml = columnConfig.map(col => `
  <th style="width: ${col.width}; min-width: ${col.width}; padding: 9px 16px; text-align: ${col.align}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">
    ${col.title}
  </th>
`).join('');

  const rowsHtml = paginatedItems.map(r => {
    const totalLines = (r.lineItems || r.lineitems || []).length;
    return `
      <tr style="border-bottom: 1px solid var(--border);" class="hover-row" ondblclick="navigate('returns', '${hasPermission ? 'edit' : 'view'}', '${r.id}')" onclick="navigate('returns', 'view', '${r.id}')">
        <td data-label="Mã Nhận Trả" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: left; color: var(--primary);">${r.id}</td>
        <td data-label="Ngày Nhận Trả" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${r.date}</td>
        <td data-label="Đơn Hàng Bán" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${r.orderId || '—'}</td>
        <td data-label="Khách Hàng" style="padding: 12px 16px; font-size: 13px; font-weight: 500;">${r.customer}</td>        
        <td data-label="Lý Do" style="padding: 12px 16px; font-size: 13px;">${r.reason}</td>
        <td data-label="Số Dòng" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center;">${totalLines}</td>
        <td data-label="Tổng Hoàn Tiền" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 13px; color: #f87171; text-align: right;">${fmtUSD(r.total)}</td>
        <td data-label="Trạng Thái" style="padding: 12px 16px; text-align: center;"><span class="badge ${getBadgeClass(r.status)}">${getStatusLabel(r.status)}</span></td>

        <td data-label="Người Tạo" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(r.user_id0)}</td>
        <td data-label="Ngày Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(r.date0)}</td>
        <td data-label="Giờ Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(r.time0)}</td>
        <td data-label="Người Sửa" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(r.user_id2)}</td>
        <td data-label="Ngày Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(r.date2)}</td>
        <td data-label="Giờ Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(r.time2)}</td>

        <td data-label="Hành Động" style="padding: 8px 16px; text-align: center; white-space: nowrap;">
          <button class="btn-action" onclick="event.stopPropagation(); navigate('returns', 'view', '${r.id}')">${Icons.view} Xem</button>
          ${hasPermission ? `<button class="btn-action" onclick="event.stopPropagation(); navigate('returns', 'edit', '${r.id}')">${Icons.edit} Sửa</button>` : ''}
          ${hasPermission ? `<button class="btn-action btn-action-del" onclick="event.stopPropagation(); deleteItem('returns', '${r.id}')">${Icons.trash} Xóa</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        ${kpiHtml}
      </div>

      <div class="filter-search-container" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        ${getFilterBar([['all', 'Tất cả'], ['accepted', 'Duyệt'], ['pending', 'Chờ duyệt'], ['rejected', 'Từ chối'], ['expired', 'Hết hạn']])}
        
        <div class="filter-controls-wrapper">
          <!-- Cụm Tìm kiếm + Thêm mới (Nằm trên ở Mobile) -->
          <div class="mobile-search-action-group">
            <div class="search-box-input">
              <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
              <input type="text" id="global-search" placeholder="Tìm kiếm..." value="${state.search || ''}" oninput="state.search=this.value; state.page=1; render();">
            </div>
            ${hasPermission ? `<button class="btn-primary" onclick="navigate('returns', 'add')">${Icons.plus} Thêm Mới</button>` : ''}
          </div>

          <!-- Cụm Chọn Ngày (Nằm dưới ở Mobile) -->
          <div class="date-filter-group">
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Từ ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.returnsFromDate}" onchange="state.returnsFromDate=this.value; state.page=1; render();">
            </div>
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Đến ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.returnsToDate}" onchange="state.returnsToDate=this.value; state.page=1; render();">
            </div>
          </div>
        </div>
      </div>

      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary);">
              ${headersHtml}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        ${filtered.length === 0 ? `<div style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px;">Không tìm thấy dữ liệu</div>` : ''}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
          Hiển thị ${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} / Tổng ${totalItems} mục
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
          <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${totalPages}</span>
          <button ${state.page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
        </div>
      </div>
    </div>
  `;
}

function renderGRNList(c) {
  const hasPermission = checkModulePermission('grn');

  // Khởi tạo state ngày từ - đến cho Phiếu Nhập Kho
  if (!state.grnFromDate) state.grnFromDate = getFirstDayOfMonthStr();
  if (!state.grnToDate) state.grnToDate = getLastDayOfMonthStr();

  const filtered = db.grns.filter(g => {
    const matchStatus = (state.filter === 'all' || g.status === state.filter);

    // Lọc theo khoảng ngày nhập kho (date)
    const dateStr = g.date || '';
    const matchDate = dateStr >= state.grnFromDate && dateStr <= state.grnToDate;

    const searchKey = normalizeSearchText(state.search);
    const dateFormatted = dateStr.includes('-') ? dateStr.split('-').reverse().join('/') : dateStr;
    const statusLabel = getStatusLabel(g.status);

    const matchSearch = !searchKey ||
      normalizeSearchText(g.id).includes(searchKey) ||
      normalizeSearchText(g.supplier).includes(searchKey) ||
      normalizeSearchText(g.warehouseCode || g.warehouse_code).includes(searchKey) ||
      normalizeSearchText(dateStr).includes(searchKey) ||
      normalizeSearchText(dateFormatted).includes(searchKey) ||
      normalizeSearchText(g.status).includes(searchKey) ||
      normalizeSearchText(statusLabel).includes(searchKey);

    return matchStatus && matchDate && matchSearch;
  });

  // TÍNH TOÁN PHÂN TRANG
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + state.pageSize);

  // ĐỒNG BỘ 4 THẺ KPI ĐÚNG THỨ TỰ VÀ MÀU SẮC CHUẨN (Tổng số -> Đã nhận -> Bản nháp -> Đã xác minh)
  const kpiHtml = [
    { label: 'Tổng số phiếu nhập', val: db.grns.length, color: 'var(--foreground)' },
    { label: 'Đã nhận', val: db.grns.filter(g => ['Đã nhận', 'received'].includes(g.status)).length, color: '#fbbf24' },
    { label: 'Bản nháp', val: db.grns.filter(g => ['Bản nháp', 'draft'].includes(g.status)).length, color: 'var(--muted-foreground)' },
    { label: 'Đã xác minh', val: db.grns.filter(g => ['Đã xác minh', 'verified'].includes(g.status)).length, color: '#34d399' }
  ].map(s => `
    <div style="background-color: var(--card); padding: 16px 20px;">
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${s.label}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 24px; font-weight: 300; color: ${s.color};">${s.val}</div>
    </div>
  `).join('');

  const columnConfig = [
    { title: 'Mã Nhập Kho', width: '30px', align: 'center' },
    { title: 'Ngày Nhập Kho', width: '30px', align: 'center' },
    { title: 'Nhà Cung Cấp', width: '50px', align: 'center' },
    { title: 'Mã Kho', width: '30px', align: 'center' },
    { title: 'Số Dòng', width: '20px', align: 'center' },
    { title: 'Tổng Tiền', width: '30px', align: 'center' },
    { title: 'Trạng Thái', width: '40px', align: 'center' },
    { title: 'Người Tạo', width: '50px', align: 'center' },
    { title: 'Ngày Tạo', width: '30px', align: 'center' },
    { title: 'Giờ Tạo', width: '20px', align: 'center' },
    { title: 'Người Sửa', width: '50px', align: 'center' },
    { title: 'Ngày Sửa', width: '30px', align: 'center' },
    { title: 'Giờ Sửa', width: '20px', align: 'center' },
    { title: 'Hành Động', width: '80px', align: 'center' }
  ];

  const headersHtml = columnConfig.map(col => `
  <th style="width: ${col.width}; min-width: ${col.width}; padding: 9px 16px; text-align: ${col.align}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">
    ${col.title}
  </th>
`).join('');

  const rowsHtml = paginatedItems.map(g => {
    const totalLines = (g.lineItems || []).length;
    const wCode = g.warehouseCode || g.warehouse_code || '—';
    return `
      <tr style="border-bottom: 1px solid var(--border);" class="hover-row" ondblclick="navigate('grn', '${hasPermission ? 'edit' : 'view'}', '${g.id}')" onclick="navigate('grn', 'view', '${g.id}')">
        <td data-label="Mã Nhập Kho" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: left; color: var(--primary);">${g.id}</td>
        <td data-label="Ngày Nhập Kho" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${g.date}</td>
        <td data-label="Nhà Cung Cấp" style="padding: 12px 16px; font-size: 13px; font-weight: 500;">${g.supplier || '—'}</td>      
        <td data-label="Mã Kho" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${wCode}</td>
        <td data-label="Số Dòng" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center;">${totalLines}</td>
        <td data-label="Tổng Giá Trị" style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 13px; font-weight: 500; text-align: right;">${fmtUSD(g.totalValue)}</td>
        <td data-label="Trạng Thái" style="padding: 12px 16px; text-align: center;"><span class="badge ${getBadgeClass(g.status)}">${getStatusLabel(g.status)}</span></td>

        <td data-label="Người Tạo" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(g.user_id0)}</td>
        <td data-label="Ngày Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(g.date0)}</td>
        <td data-label="Giờ Tạo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(g.time0)}</td>
        <td data-label="Người Sửa" style="padding: 11px 16px; font-size: 12px;">${getUserFullName(g.user_id2)}</td>
        <td data-label="Ngày Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtDateStr(g.date2)}</td>
        <td data-label="Giờ Sửa" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${fmtTimeStr(g.time2)}</td>

        <td data-label="Hành Động" style="padding: 8px 16px; text-align: center; white-space: nowrap;">
          <button class="btn-action" onclick="event.stopPropagation(); navigate('grn', 'view', '${g.id}')">${Icons.view} Xem</button>
          ${hasPermission ? `<button class="btn-action" onclick="event.stopPropagation(); navigate('grn', 'edit', '${g.id}')">${Icons.edit} Sửa</button>` : ''}
          ${hasPermission ? `<button class="btn-action btn-action-del" onclick="event.stopPropagation(); deleteItem('grn', '${g.id}')">${Icons.trash} Xóa</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        ${kpiHtml}
      </div>

      <div class="filter-search-container" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        ${getFilterBar([['all', 'Tất cả'], ['accepted', 'Duyệt'], ['pending', 'Chờ duyệt'], ['rejected', 'Từ chối'], ['expired', 'Hết hạn']])}
        
        <div class="filter-controls-wrapper">
          <!-- Cụm Tìm kiếm + Thêm mới (Nằm trên ở Mobile) -->
          <div class="mobile-search-action-group">
            <div class="search-box-input">
              <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
              <input type="text" id="global-search" placeholder="Tìm kiếm..." value="${state.search || ''}" oninput="state.search=this.value; state.page=1; render();">
            </div>
            ${hasPermission ? `<button class="btn-primary" onclick="navigate('grn', 'add')">${Icons.plus} Thêm Mới</button>` : ''}
          </div>

          <!-- Cụm Chọn Ngày (Nằm dưới ở Mobile) -->
          <div class="date-filter-group">
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Từ ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.grnFromDate}" onchange="state.grnFromDate=this.value; state.page=1; render();">
            </div>
            <div class="date-input-item">
              <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase;">Đến ngày:</label>
              <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${state.grnToDate}" onchange="state.grnToDate=this.value; state.page=1; render();">
            </div>
          </div>
        </div>
      </div>

      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary);">
              ${headersHtml}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        ${filtered.length === 0 ? `<div style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px;">Không tìm thấy dữ liệu</div>` : ''}
      </div>

      <!-- THANH ĐIỀU HƯỚNG PHÂN TRANG -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
          Hiển thị ${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} / Tổng ${totalItems} mục
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
          <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${totalPages}</span>
          <button ${state.page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
        </div>
      </div>
    </div>
  `;
}

function renderMaterialForm(c) {
  const d = state.formData || {};
  const isView = state.mode === 'view';
  const hasPermission = checkModulePermission('materials');

  c.innerHTML = `
    <div style="max-width: 900px;">
      ${getBreadcrumb('Sản Phẩm & Vật Tư', isView ? `Xem ${d.id}` : (state.mode === 'edit' ? `Sửa ${d.id}` : 'Thêm Sản Phẩm Mới'), 'materials')}
      <form onsubmit="event.preventDefault(); saveForm('materials');">
        <input type="hidden" value="${d.id || ''}">

        <div class="section-panel">
          <div class="section-header">
            <span class="section-num">01</span>
            <span class="section-title">Thông tin cơ bản</span>
          </div>
          <div class="section-body grid-3">
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Tên sản phẩm *</label>
              <input 
                  type="text" 
                  class="form-input" 
                  value="${d.name || ''}" 
                  ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : `
                    oninput="this.value = toTitleCase(this.value); updateField('name', this.value.trim());"
                    onchange="this.value = toTitleCase(this.value.trim()); updateField('name', this.value.trim());"
                  `} 
                  placeholder="Nhập tên sản phẩm..." 
                  required
                >
            </div>
            <div class="form-group">
              <label class="form-label">Đơn vị tính *</label>
              <input 
                type="text" 
                class="form-input" 
                value="${d.unit || ''}" 
                ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : `
                  oninput="this.value = toUpperCaseStr(this.value); updateField('unit', this.value.trim());"
                  onchange="this.value = toUpperCaseStr(this.value.trim()); updateField('unit', this.value.trim());"
                `} 
                placeholder="CÁI, HỘP, BỘ, KG..." 
                required
              >
            </div>
            <div class="form-group">
              <label class="form-label">Danh mục</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'category\', this.value)"'}>
                ${['Hoa quả', 'Rau củ', 'Khác'].map(cat => `<option value="${cat}" ${d.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="section-panel">
          <div class="section-header">
            <span class="section-num">02</span>
            <span class="section-title">Kho hàng & Chi phí (Tùy chọn)</span>
          </div>
          <div class="section-body grid-4">
            <div class="form-group">
              <label class="form-label">Vị trí lưu kho</label>
              <input type="text" class="form-input" value="${d.location || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'location\', this.value.trim())"'} placeholder="Ví dụ: A-12-03">
            </div>
            <div class="form-group">
              <label class="form-label">Tồn kho ban đầu</label>
              <input 
                type="number" 
                step="any" 
                inputmode="decimal" 
                class="form-input" 
                value="${d.stock ?? 0}" 
                ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'stock\', this.value, \'number\')"'}>
            </div>
            <div class="form-group">
              <label class="form-label">Mức định mức</label>
              <input type="number" step="any" inputmode="decimal" class="form-input" value="${d.reorder ?? 0}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'reorder\', this.value, \'number\')"'} >
            </div>
            <div class="form-group">
              <label class="form-label">Đơn giá (VNĐ)</label>
              <input type="number" step="any" inputmode="numeric" class="form-input" value="${d.cost ?? 0}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'cost\', this.value, \'number\')"'} >
            </div>
          </div>
        </div>

        <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-cancel" style="padding: 8px 16px; font-size: 13px;" onclick="state.mode === 'edit' ? navigate('materials', 'view', '${d.id}') : navigate('materials')">
            ${isView ? 'Quay Lại' : 'Hủy'}
          </button>
          <div style="display: flex; gap: 8px;">
            ${isView && hasPermission ? `
              <button type="button" class="btn-action" style="padding: 8px 16px; font-size: 13px;" onclick="navigate('materials', 'edit', '${d.id}')">${Icons.edit} Sửa</button>
              <button type="button" class="btn-action btn-action-del" style="padding: 8px 16px; font-size: 13px;" onclick="deleteItem('materials', '${d.id}')">${Icons.trash} Xóa</button>
            ` : ''}
            ${!isView ? `<button type="submit" class="btn-submit" style="padding: 8px 16px; font-size: 13px;">${state.mode === 'add' ? 'Lưu sản phẩm' : 'Cập nhật'}</button>` : ''}
          </div>
        </div>
      </form>
    </div>
  `;
}

function renderCustomerForm(c) {
  const d = state.formData || {};
  const isView = state.mode === 'view';
  const hasPermission = checkModulePermission('customers');

  c.innerHTML = `
    <div style="max-width: 900px;">
      ${getBreadcrumb('Khách hàng', isView ? `Xem ${d.id}` : (state.mode === 'edit' ? `Chỉnh sửa ${d.id}` : 'Thêm mới khách hàng'), 'customers')}
      <form onsubmit="event.preventDefault(); saveForm('customers');">
        <input type="hidden" value="${d.id || ''}">

        <div class="section-panel">
          <div class="section-header">
            <span class="section-num">01</span>
            <span class="section-title">Thông tin khách hàng</span>
          </div>
          <div class="section-body grid-3">
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Tên công ty / Khách hàng *</label>
              <input type="text" class="form-input" value="${d.name || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : `
                oninput="this.value = toTitleCase(this.value); updateField('name', this.value.trim());"
                onchange="this.value = toTitleCase(this.value.trim()); updateField('name', this.value.trim());"
              `} placeholder="Nhập tên công ty hoặc tên khách hàng..." required>
            </div>
            <div class="form-group">
              <label class="form-label">Loại khách hàng</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'type\', this.value)"'}>
                ${['Khách vãng lai', 'Khách hàng tiềm năng', 'Khách hàng trung thành', 'Khách hàng cũ', 'Khách hàng tiêu cực'].map(t => `<option value="${t}" ${d.type === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Người liên hệ</label>
              <input type="text" class="form-input" value="${d.contact || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : `
                oninput="this.value = toTitleCase(this.value); updateField('contact', this.value);"
                onchange="this.value = toTitleCase(this.value.trim()); updateField('contact', this.value.trim());"
              `} placeholder="Tên người đại diện...">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" value="${d.email || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'email\', this.value.trim())"'} placeholder="example@domain.com">
            </div>
            <div class="form-group">
              <label class="form-label">Số điện thoại</label>
              <input type="tel" inputmode="tel" class="form-input" value="${d.phone || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'phone\', this.value.trim())"'} placeholder="090x xxx xxx">
            </div>
            <div class="form-group" style="grid-column: span 3;">
              <label class="form-label">Địa chỉ</label>
              <input type="text" class="form-input" value="${d.address || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'address\', this.value.trim())"'} placeholder="Nhập địa chỉ trụ sở/giao hàng...">
            </div>
          </div>
        </div>

        <div class="section-panel">
          <div class="section-header">
            <span class="section-num">02</span>
            <span class="section-title">Điều khoản thương mại</span>
          </div>
          <div class="section-body grid-3">
            <div class="form-group">
              <label class="form-label">Hạn mức tín dụng (VNĐ)</label>
              <input type="number" step="any" inputmode="numeric" class="form-input" value="${d.creditLimit ?? 0}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'creditLimit\', this.value, \'number\')"'} >
            </div>
            <div class="form-group">
              <label class="form-label">Điều khoản thanh toán</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'paymentTerms\', this.value)"'}>
                ${['Thanh toán ngay', 'Thanh toán gối đầu', 'Thanh toán cuối tháng', 'Net 30', 'Net 60'].map(t => `<option value="${t}" ${d.paymentTerms === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Trạng thái</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'status\', this.value)"'}>
                <option value="active" ${d.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                <option value="inactive" ${d.status === 'inactive' ? 'selected' : ''}>Ngừng hoạt động</option>
                <option value="suspended" ${d.status === 'suspended' ? 'selected' : ''}>Tạm khóa</option>
              </select>
            </div>
          </div>
        </div>

        <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-cancel" style="padding: 8px 16px; font-size: 13px;" onclick="state.mode === 'edit' ? navigate('customers', 'view', '${d.id}') : navigate('customers')">
            ${isView ? 'Quay Lại' : 'Hủy'}
          </button>
          <div style="display: flex; gap: 8px;">
            ${isView && hasPermission ? `
              <button type="button" class="btn-action" style="padding: 8px 16px; font-size: 13px;" onclick="navigate('customers', 'edit', '${d.id}')">${Icons.edit} Sửa</button>
              <button type="button" class="btn-action btn-action-del" style="padding: 8px 16px; font-size: 13px;" onclick="deleteItem('customers', '${d.id}')">${Icons.trash} Xóa</button>
            ` : ''}
            ${!isView ? `<button type="submit" class="btn-submit" style="padding: 8px 16px; font-size: 13px;">${state.mode === 'add' ? 'Lưu khách hàng' : 'Cập nhật'}</button>` : ''}
          </div>
        </div>
      </form>
    </div>
  `;
}

function renderWarehouseForm(c) {
  const d = state.formData || {};
  const isView = state.mode === 'view';
  const hasPermission = checkModulePermission('warehouses');

  c.innerHTML = `
    <div style="max-width: 900px;">
      ${getBreadcrumb('Kho hàng', isView ? `Xem ${d.code || ''}` : (state.mode === 'edit' ? `Chỉnh sửa ${d.code || ''}` : 'Thêm mới kho hàng'), 'warehouses')}
      <form onsubmit="event.preventDefault(); saveForm('warehouses');">
        <input type="hidden" value="${d.id || ''}">

        <div class="section-panel">
          <div class="section-header">
            <span class="section-num">01</span>
            <span class="section-title">Thông tin kho hàng</span>
          </div>
          <div class="section-body grid-3">
            <div class="form-group">
              <label class="form-label">Mã kho (Tự động) *</label>
              <input type="text" class="form-input" value="${(d.code || '').trim()}" readonly style="background: var(--muted); cursor: not-allowed; color: var(--primary);" title="Mã kho tự động sinh">
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Tên kho *</label>
              <input type="text" class="form-input" value="${d.name || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="this.value = this.value.trim(); updateField(\'name\', this.value.trim())"'} placeholder="Nhập tên kho hàng..." required>
            </div>
            <div class="form-group" style="grid-column: span 3;">
              <label class="form-label">Địa chỉ / Vị trí *</label>
              <input type="text" class="form-input" value="${d.location || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="this.value = this.value.trim(); updateField(\'location\', this.value.trim())"'} placeholder="Nhập địa chỉ kho hàng..." required>
            </div>
          </div>
        </div>

        <div class="section-panel">
          <div class="section-header">
            <span class="section-num">02</span>
            <span class="section-title">Sức chứa & Quản lý</span>
          </div>
          <div class="section-body grid-4">
            <div class="form-group">
              <label class="form-label">Sức chứa (Đơn vị)</label>
              <input type="number" step="any" inputmode="decimal" class="form-input" value="${d.capacity ?? 0}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'capacity\', this.value, \'number\')"'} >
            </div>
            <div class="form-group">
              <label class="form-label">Đã sử dụng</label>
              <input type="number" step="any" inputmode="decimal" class="form-input" value="${d.used ?? 0}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'used\', this.value, \'number\')"'} >
            </div>
            <div class="form-group">
              <label class="form-label">Quản lý kho</label>
              <input type="text" class="form-input" value="${d.manager || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="this.value = this.value.trim(); updateField(\'manager\', this.value.trim())"'} placeholder="Tên quản lý kho...">
            </div>
            <div class="form-group">
              <label class="form-label">Trạng thái</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'status\', this.value)"'}>
                <option value="active" ${d.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
                <option value="maintenance" ${d.status === 'maintenance' ? 'selected' : ''}>Bảo trì</option>
                <option value="closed" ${d.status === 'closed' ? 'selected' : ''}>Đóng cửa</option>
              </select>
            </div>
          </div>
        </div>

        <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-cancel" style="padding: 8px 16px; font-size: 13px;" onclick="state.mode === 'edit' ? navigate('warehouses', 'view', '${d.id}') : navigate('warehouses')">
            ${isView ? 'Quay Lại' : 'Hủy'}
          </button>
          <div style="display: flex; gap: 8px;">
            ${isView && hasPermission ? `
              <button type="button" class="btn-action" style="padding: 8px 16px; font-size: 13px;" onclick="navigate('warehouses', 'edit', '${d.id}')">${Icons.edit} Sửa</button>
              <button type="button" class="btn-action btn-action-del" style="padding: 8px 16px; font-size: 13px;" onclick="deleteItem('warehouses', '${d.id}')">${Icons.trash} Xóa</button>
            ` : ''}
            ${!isView ? `<button type="submit" class="btn-submit" style="padding: 8px 16px; font-size: 13px;">${state.mode === 'add' ? 'Lưu kho hàng' : 'Cập nhật'}</button>` : ''}
          </div>
        </div>
      </form>
    </div>
  `;
}

function renderQuotationForm(c) {
  const d = state.formData || {};
  const isView = state.mode === 'view';
  const isEdit = state.mode === 'edit';
  const hasPermission = checkModulePermission('quotations');
  d.lineItems = Array.isArray(d.lineItems) ? d.lineItems : [];

  const isDetailsDisabled = !isView && state.mode === 'add' && !d.customer;

  d.subtotal = d.lineItems.reduce((s, l) => s + ((l.qty || 0) * (l.unitPrice || 0)), 0);
  d.discountTotal = d.lineItems.reduce((s, l) => s + ((l.qty || 0) * (l.unitPrice || 0) * ((l.discount || 0) / 100)), 0);

  d.tax = d.lineItems.reduce((s, l) => {
    const lineSub = (l.qty || 0) * (l.unitPrice || 0) * (1 - (l.discount || 0) / 100);
    return s + (lineSub * ((l.tax || 0) / 100));
  }, 0);

  d.total = d.subtotal - d.discountTotal + d.tax;

  let datalistEl = document.getElementById('global-materials-list');
  if (!datalistEl) {
    datalistEl = document.createElement('datalist');
    datalistEl.id = 'global-materials-list';
    document.body.appendChild(datalistEl);
  }

  const sortedMaterials = JSON.parse(JSON.stringify(db.materials || [])).sort((a, b) =>
    (a.id || '').localeCompare(b.id || '', undefined, { numeric: true, sensitivity: 'base' })
  );

  datalistEl.innerHTML = sortedMaterials.map(m =>
    `<option value="${m.name}">${m.id} - ${m.name} (${fmtUSD(m.cost || 0)})</option>`
  ).join('');

  const customerOptions = (db.customers || []).map(cust =>
    `<option value="${cust.name}" ${d.customer === cust.name ? 'selected' : ''}>${cust.name}</option>`
  ).join('');

  const gridLayout = isView
    ? "10px 100px minmax(180px, 1.5fr) 55px 70px 100px 70px 70px 120px"
    : "10px 100px minmax(180px, 1.5fr) 55px 70px 100px 70px 70px 120px 32px";

  const linesHtml = d.lineItems.map((l, idx) => {
    const lineSub = (l.qty || 0) * (l.unitPrice || 0) * (1 - (l.discount || 0) / 100);
    const lineTotal = lineSub * (1 + (l.tax || 0) / 100);
    const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
    const unitName = mat ? (mat.unit || '—') : '—';

    return `
      <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; border-bottom: 1px solid var(--border); align-items: center; ${isDetailsDisabled ? 'opacity: 0.5; pointer-events: none;' : ''}">
        <span style="font-family: var(--font-dm-mono, monospace); font-size: 10px; font-weight: 400; color: var(--muted-foreground); min-width: 12px; text-align: right; user-select: none;">
          ${idx + 1}.
        </span>
        <input type="text" id="line-item-${l.lineId}-sku" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; color: var(--primary);" value="${l.sku || ''}" readonly title="Mã hàng tự động">
        
        <input type="text" id="line-item-${l.lineId}-name" autocomplete="off" ${(isView || isDetailsDisabled) ? '' : 'list="global-materials-list"'} class="form-input" style="padding: 6px 8px; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.name || ''}" ${(isView || isDetailsDisabled) ? 'readonly' : 'onkeydown="handleLineItemKeyDown(event, \'quotations\', ' + idx + ', \'name\')" onchange="handleMaterialSelectInLine(\'' + l.lineId + '\', this.value)"'} placeholder="${isDetailsDisabled ? 'Vui lòng chọn khách hàng...' : 'Chọn/nhập tên hàng...'}" required>
        
        <input type="text" id="line-item-${l.lineId}-unit" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; text-align: center;" value="${unitName}" readonly title="Đơn vị tính">
        
        <input type="number" id="line-item-${l.lineId}-qty" step="any" inputmode="decimal" class="form-input" style="padding: 6px 8px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.qty ?? 1}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'quotations', ${idx}, 'qty')" onchange="updateLine('${l.lineId}', 'qty', this.value, 'number')"`}>
        
        <input 
          type="text" 
          id="line-item-${l.lineId}-unitPrice"
          inputmode="numeric"
          class="form-input" 
          style="padding: 6px 8px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" 
          value="${(l.unitPrice ?? 0).toLocaleString('vi-VN')}" 
          ${(isView || isDetailsDisabled) ? 'readonly' : `
            onkeydown="handleLineItemKeyDown(event, 'quotations', ${idx}, 'unitPrice')"
            onfocus="this.value = parseNumberInput(this.value) || ''" 
            onblur="this.value = formatVNDInput(this.value)" 
            onchange="updateLine('${l.lineId}', 'unitPrice', parseNumberInput(this.value), 'number')"
          `}
        >
        
        <input type="number" id="line-item-${l.lineId}-discount" step="any" inputmode="decimal" class="form-input" style="padding: 6px 8px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.discount ?? 0}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'quotations', ${idx}, 'discount')" onchange="updateLine('${l.lineId}', 'discount', this.value, 'number')"`}>
        
        <input type="number" id="line-item-${l.lineId}-tax" step="any" inputmode="decimal" class="form-input" style="padding: 6px 8px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.tax ?? 0}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'quotations', ${idx}, 'tax')" onchange="updateLine('${l.lineId}', 'tax', this.value, 'number')"`}>
        
        <div style="font-family: var(--font-dm-mono); text-align: right; font-weight: 500;">${fmtUSD(lineTotal)}</div>
        ${(!isView && !isDetailsDisabled) ? `<button type="button" style="background: none; border: none; cursor: pointer; color: var(--muted-foreground); display: flex; align-items: center; justify-content: center;" onclick="removeLineItem('${l.lineId}')">${Icons.trash}</button>` : ''}
      </div>
`;
  }).join('');

  c.innerHTML = `
    <div style="max-width: 1050px;">
      ${getBreadcrumb('Báo giá', isView ? `Xem ${d.id || ''}` : (isEdit ? `Chỉnh sửa ${d.id || ''}` : 'Tạo báo giá mới'), 'quotations')}
      <form onsubmit="event.preventDefault(); saveForm('quotations');">

        <input type="hidden" value="${d.id || ''}">

          <div class="section-panel">
            <div class="section-header">
              <span class="section-num">01</span>
              <span class="section-title">Thông tin báo giá</span>
            </div>
            <div class="section-body grid-3">
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Khách hàng *</label>
                <select class="form-select" ${(isView || isEdit) ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="handleCustomerSelectInQuotation(this.value)"'} required>
                  <option value="">-- Chọn khách hàng --</option>
                  ${customerOptions}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Ngày lập phiếu *</label>
                <input type="date" class="form-input" value="${d.date || getTodayDateStr()}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'date\', this.value)"'} required>
              </div>
              <div class="form-group">
                <label class="form-label">Ngày bắt đầu *</label>
                <input type="date" class="form-input" value="${d.validbegin || d.validBegin || getFirstDayOfMonthStr()}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'validbegin\', this.value)"'} required>
              </div>
              <div class="form-group">
                <label class="form-label">Ngày kết thúc *</label>
                <input type="date" class="form-input" value="${d.validUntil || d.validuntil || ''}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'validUntil\', this.value)"'} required>
              </div>
              <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'status\', this.value)"'}>
                  <option value="accepted" ${['accepted', 'approved', 'Duyệt'].includes(d.status) ? 'selected' : ''}>Duyệt</option>
                  <option value="pending" ${['pending', 'draft', 'bản nháp', 'Chờ Duyệt'].includes(d.status) || !d.status ? 'selected' : ''}>Chờ Duyệt</option>
                  <option value="rejected" ${['rejected', 'Từ Chối'].includes(d.status) ? 'selected' : ''}>Từ Chối</option>
                  <option value="expired" ${['expired', 'Hết Hạn'].includes(d.status) ? 'selected' : ''}>Hết Hạn</option>
                </select>
              </div>

              <div class="form-group" style="grid-column: span 3; margin-top: 6px;">
                <label class="form-label">Ghi chú</label>
                <textarea class="form-textarea" rows="2" style="resize: vertical; ${isView ? 'background: var(--muted); cursor: not-allowed;' : ''}" ${isView ? 'readonly' : 'onchange="updateField(\'notes\', this.value)"'} placeholder="Nhập thông tin ghi chú (tùy chọn)...">${d.notes || ''}</textarea>
              </div>
            </div>
          </div>

          <div class="section-panel">
            <div class="section-header" style="justify-content: space-between;">
              <div style="display:flex; gap:10px;"><span class="section-num">02</span><span class="section-title">Danh sách sản phẩm</span></div>
              <!-- Nút Header: Tự động ẩn trên PC -->
              ${getAddLineButton('quotations', isDetailsDisabled, 'header')}
            </div>

            <div style="overflow-x: auto;">
              <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; background: var(--secondary); border-bottom: 1px solid var(--border); align-items: center; min-width: 850px; box-sizing: border-box;">
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;"></span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Mã Hàng</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Tên sản phẩm</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Đơn Vị</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Số Lượng</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Đơn Giá</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Chiết Khấu %</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Thuế %</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Thành tiền</span>
                ${!isView ? `<span></span>` : ''}
              </div>

              <!-- DANH SÁCH CÁC DÒNG SẢN PHẨM -->
              <div style="min-width: 850px;">
                ${linesHtml}
              </div>
            </div>

            <!-- CẤU TRÚC PHÍA DƯỚI: NÚT THÊM DÒNG THẲNG HÀNG MÃ HÀNG & CÙNG HÀNG NGANG VỚI TẠM TÍNH -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 26px 10px 26px; flex-wrap: wrap; gap: 12px;">
              <!-- Khung chứa nút Thêm Dòng: Chiều rộng cố định khớp đúng cột Mã hàng -->
              <div style="width: 110px; flex-shrink: 0;">
                ${getAddLineButton('quotations', isDetailsDisabled, 'footer')}
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; min-width: 260px;">
                <div style="display: flex; justify-content: space-between; align-items: center; height: 36px;"><span class="form-label" style="margin:0;">Tạm tính</span><span style="font-family: var(--font-dm-mono);">${fmtUSD(d.subtotal)}</span></div>
                <div style="display: flex; justify-content: space-between;"><span class="form-label">Chiết khấu</span><span style="font-family: var(--font-dm-mono);">-${fmtUSD(d.discountTotal)}</span></div>
                <div style="display: flex; justify-content: space-between;"><span class="form-label">Tổng Thuế</span><span style="font-family: var(--font-dm-mono);">${fmtUSD(d.tax)}</span></div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 8px; margin-top: 2px;"><span class="form-label" style="font-weight: 600;">Tổng cộng</span><span style="font-family: var(--font-dm-mono); font-size: 15px; color: var(--foreground); font-weight: 500;">${fmtUSD(d.total)}</span></div>
              </div>
            </div>
          </div>

          <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-cancel" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="state.mode === 'edit' ? navigate('quotations', 'view', '${d.id}') : navigate('quotations')">
              ${isView ? 'Quay Lại' : 'Hủy'}
            </button>
            <div style="display: flex; gap: 8px;">                          
              ${isView ? `
                ${hasPermission ? `
                  <button type="button" class="btn-action" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="navigate('quotations', 'edit', '${d.id}')">${Icons.edit} Sửa</button>
                  <button type="button" class="btn-action btn-action-del" style="padding: 8px 16px; font-size: 13px;" onclick="deleteItem('quotations', '${d.id}')">${Icons.trash} Xóa</button>
                ` : ''}
                <button type="button" class="btn-primary" onclick="exportQuotationToPDF()" style="background: #e11d48; color: #ffffff; padding: 8px 16px; font-size: 13px; cursor: pointer;">Xuất PDF</button>
              ` : ''}
              ${!isView ? `
                <button type="submit" class="btn-submit" style="padding: 8px 16px; font-size: 13px;" ${isDetailsDisabled ? 'disabled style="opacity: 0.5; cursor: not-allowed; pointer-events: none;"' : ''}>
                  ${state.mode === 'add' ? 'Tạo báo giá' : 'Cập nhật'}
                </button>
              ` : ''}
            </div>
          </div>
      </form>
    </div>
    `;
}

function renderSalesOrderForm(c) {
  const d = state.formData || {};
  const isView = state.mode === 'view';
  const isEdit = state.mode === 'edit';
  const hasPermission = checkModulePermission('sales-orders');
  d.lineItems = Array.isArray(d.lineItems) ? d.lineItems : [];

  const isDetailsDisabled = !isView && state.mode === 'add' && !d.customer;

  if (!d.warehouseCode && db.warehouses.length > 0) {
    d.warehouseCode = db.warehouses[0].code || db.warehouses[0].id;
  }

  d.lineItems.forEach(l => {
    l.warehouseCode = d.warehouseCode;
  });

  d.subtotal = d.lineItems.reduce((s, l) => s + ((l.qty || 0) * (l.unitPrice || 0)), 0);
  d.discountTotal = d.lineItems.reduce((s, l) => s + ((l.qty || 0) * (l.unitPrice || 0) * ((l.discount || 0) / 100)), 0);
  d.tax = d.lineItems.reduce((s, l) => {
    const lineSub = (l.qty || 0) * (l.unitPrice || 0) * (1 - (l.discount || 0) / 100);
    return s + (lineSub * ((l.tax || 0) / 100));
  }, 0);
  d.total = d.subtotal - d.discountTotal + d.tax;

  // XỬ LÝ LẤY SẢN PHẨM: GIỮ NGUYÊN THỨ TỰ BÁO GIÁ + ĐƯỜNG KẺ PHÂN CÁCH TRÊN SAFARI/PC
  const currentCustomer = (d.customer || '').trim();
  const orderDate = d.date || getTodayDateStr();

  let activeQuotation = null;
  if (currentCustomer) {
    activeQuotation = (db.quotations || [])
      .filter(q => {
        if (!q || !q.customer) return false;
        if (q.customer.trim().toLowerCase() !== currentCustomer.toLowerCase()) return false;

        const status = (q.status || '').toLowerCase();
        const isAccepted = ['accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status);
        if (!isAccepted) return false;

        const vBegin = q.validbegin || q.validBegin || q.date || '';
        const vUntil = q.validUntil || q.validuntil || '';

        if (vBegin && vUntil) {
          return orderDate >= vBegin && orderDate <= vUntil;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  }

  const sortBySkuAsc = (a, b) => (a.id || '').localeCompare(b.id || '', undefined, { numeric: true, sensitivity: 'base' });
  const allMaterials = JSON.parse(JSON.stringify(db.materials || []));

  let inQuotationList = [];
  let outQuotationList = [];

  if (activeQuotation && Array.isArray(activeQuotation.lineItems) && activeQuotation.lineItems.length > 0) {
    const matchedSkusAndNames = new Set();

    // 1. Lấy đúng thứ tự và GIÁ trong Báo Giá
    activeQuotation.lineItems.forEach(qItem => {
      const qSku = (qItem.sku || qItem.id || '').trim().toLowerCase();
      const qName = (qItem.name || '').trim().toLowerCase();

      const mat = allMaterials.find(m => {
        const mSku = (m.id || '').trim().toLowerCase();
        const mName = (m.name || '').trim().toLowerCase();
        return (qSku && mSku === qSku) || (qName && mName === qName);
      });

      if (mat) {
        const matKey = (mat.id || mat.name || '').toLowerCase();
        if (!matchedSkusAndNames.has(matKey)) {
          matchedSkusAndNames.add(matKey);
          // Gán giá báo giá ưu tiên vào object sản phẩm
          const quotedPrice = qItem.unitPrice ?? qItem.price ?? mat.unitPrice ?? mat.price ?? mat.cost ?? 0;
          inQuotationList.push({
            ...mat,
            quotedPrice: quotedPrice
          });
        }
      }
    });

    // 2. Lấy các sản phẩm còn lại và sắp xếp theo SKU tăng dần
    outQuotationList = allMaterials.filter(m => {
      const matKey = (m.id || m.name || '').toLowerCase();
      return !matchedSkusAndNames.has(matKey);
    });
    outQuotationList.sort(sortBySkuAsc);
  } else {
    outQuotationList = allMaterials.sort(sortBySkuAsc);
  }

  // CẬP NHẬT HOẶC TẠO LẠI DATALIST RIÊNG DÀNH CHO FORM ĐƠN BÁN HÀNG
  let datalistEl = document.getElementById('global-materials-list');
  if (!datalistEl) {
    datalistEl = document.createElement('datalist');
    datalistEl.id = 'global-materials-list';
    document.body.appendChild(datalistEl);
  }

  // TẠO OPTION HIỂN THỊ ĐÚNG GIÁ BÁO GIÁ
  if (inQuotationList.length > 0 && outQuotationList.length > 0) {
    const quotedHtml = inQuotationList.map(m => {
      const priceToDisplay = m.quotedPrice ?? m.unitPrice ?? m.price ?? m.cost ?? 0;
      return `<option value="${m.name}">${m.id} - ${m.name} (${fmtUSD(priceToDisplay)}) ★ Báo giá</option>`;
    }).join('');

    const otherHtml = outQuotationList.map(m => {
      const priceToDisplay = m.unitPrice ?? m.price ?? m.cost ?? 0;
      return `<option value="${m.name}">${m.id} - ${m.name} (${fmtUSD(priceToDisplay)})</option>`;
    }).join('');

    datalistEl.innerHTML = `
      ${quotedHtml}
      <option value="----------------------------------------" disabled>------------------ SẢN PHẨM KHÁC ------------------</option>
      ${otherHtml}
    `;
  } else {
    datalistEl.innerHTML = (inQuotationList.length > 0 ? inQuotationList : outQuotationList).map(m => {
      const priceToDisplay = m.quotedPrice ?? m.unitPrice ?? m.price ?? m.cost ?? 0;
      const isQuoted = m.quotedPrice !== undefined;
      return `<option value="${m.name}">${m.id} - ${m.name} (${fmtUSD(priceToDisplay)})${isQuoted ? ' ★ Báo giá' : ''}</option>`;
    }).join('');
  }

  const customerOptions = (db.customers || []).map(cust =>
    `<option value="${cust.name || ''}" ${d.customer === cust.name ? 'selected' : ''}>${cust.name || ''}</option>`
  ).join('');

  const warehouseOptions = (db.warehouses || []).map(w => {
    const wCode = w.code || w.id;
    return `<option value="${wCode}" ${d.warehouseCode === wCode ? 'selected' : ''}>${wCode} - ${w.name}</option>`;
  }).join('');

  const gridLayout = isView
    ? "10px 100px minmax(170px, 1.5fr) 60px 70px 65px 65px 90px 70px 60px 120px"
    : "10px 100px minmax(170px, 1.5fr) 60px 70px 65px 65px 90px 70px 60px 120px 32px";

  const linesHtml = d.lineItems.map((l, idx) => {
    const lineSub = (l.qty || 0) * (l.unitPrice || 0) * (1 - (l.discount || 0) / 100);
    const lineTotal = lineSub * (1 + (l.tax || 0) / 100);

    const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
    const unitName = mat ? (mat.unit || '—') : '—';
    const stockQty = calculateRealtimeStock(l.sku, d.warehouseCode, d.id);

    return `
      <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; border-bottom: 1px solid var(--border); align-items: center; ${isDetailsDisabled ? 'opacity: 0.5; pointer-events: none;' : ''}">
        <span style="font-family: var(--font-dm-mono, monospace); font-size: 10px; font-weight: 400; color: var(--muted-foreground); min-width: 14px; text-align: right; user-select: none;">
          ${idx + 1}.
        </span>
        <input type="text" id="line-item-${l.lineId}-sku" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; color: var(--primary);" value="${l.sku || ''}" readonly title="Mã hàng tự động">
        
        <input type="text" id="line-item-${l.lineId}-name" autocomplete="off" ${(isView || isDetailsDisabled) ? '' : 'list="global-materials-list"'} class="form-input" style="padding: 6px 8px; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.name || ''}" ${(isView || isDetailsDisabled) ? 'readonly' : 'onkeydown="handleLineItemKeyDown(event, \'sales-orders\', ' + idx + ', \'name\')" onchange="handleMaterialSelectInLine(\'' + l.lineId + '\', this.value)"'} placeholder="${isDetailsDisabled ? 'Vui lòng chọn khách hàng...' : 'Chọn/nhập tên hàng...'}" required>
        
        <input type="text" id="line-item-${l.lineId}-unit" class="form-input" style="padding: 6px 6px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; text-align: center;" value="${unitName}" readonly title="Đơn vị tính từ danh mục hàng">
        
        <input type="text" id="line-item-${l.lineId}-warehouseCode" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; text-align: center;" value="${d.warehouseCode || '—'}" readonly title="Mã kho từ mục 01">
        
        <input type="number" id="line-item-${l.lineId}-qty" step="any" inputmode="decimal" class="form-input" style="padding: 6px 6px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.qty ?? 1}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'sales-orders', ${idx}, 'qty')" onchange="updateLine('${l.lineId}', 'qty', this.value, 'number')"`}>
        
        <input type="text" id="line-item-${l.lineId}-stock" class="form-input" style="padding: 6px 6px; text-align: right; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; color: ${stockQty < 0 ? '#f87171' : 'var(--foreground)'};" value="${stockQty}" readonly title="Tồn thực tế">
        
        <input 
          type="text" 
          id="line-item-${l.lineId}-unitPrice"
          inputmode="numeric"
          class="form-input" 
          style="padding: 6px 6px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" 
          value="${(l.unitPrice ?? 0).toLocaleString('vi-VN')}" 
          ${(isView || isDetailsDisabled) ? 'readonly' : `
            onkeydown="handleLineItemKeyDown(event, 'sales-orders', ${idx}, 'unitPrice')"
            onfocus="this.value = parseNumberInput(this.value) || ''" 
            onblur="this.value = formatVNDInput(this.value)" 
            onchange="updateLine('${l.lineId}', 'unitPrice', parseNumberInput(this.value), 'number')"
          `}
        >
        
        <input type="number" id="line-item-${l.lineId}-discount" step="any" inputmode="decimal" class="form-input" style="padding: 6px 6px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.discount ?? 0}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'sales-orders', ${idx}, 'discount')" onchange="updateLine('${l.lineId}', 'discount', this.value, 'number')"`}>
        
        <input type="number" id="line-item-${l.lineId}-tax" step="any" inputmode="decimal" class="form-input" style="padding: 6px 6px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.tax ?? 0}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'sales-orders', ${idx}, 'tax')" onchange="updateLine('${l.lineId}', 'tax', this.value, 'number')"`}>
        
        <div style="font-family: var(--font-dm-mono); text-align: right; font-weight: 500; font-size: 12px;">${fmtUSD(lineTotal)}</div>
        ${(!isView && !isDetailsDisabled) ? `<button type="button" style="background: none; border: none; cursor: pointer; color: var(--muted-foreground); display: flex; align-items: center; justify-content: center;" onclick="removeLineItem('${l.lineId}')">${Icons.trash}</button>` : ''}
      </div>
    `;
  }).join('');

  c.innerHTML = `
    <div style="max-width: 1050px;">
      ${getBreadcrumb('Đơn bán hàng', isView ? `Xem ${d.id || ''}` : (isEdit ? `Chỉnh sửa ${d.id || ''}` : 'Tạo đơn bán hàng mới'), 'sales-orders')}
      <form onsubmit="event.preventDefault(); saveForm('sales-orders');">

        <input type="hidden" value="${d.id || ''}">

          <div class="section-panel">
            <div class="section-header">
              <span class="section-num">01</span>
              <span class="section-title">Thông tin đơn bán hàng</span>
            </div>
            <div class="section-body grid-3">
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Khách hàng *</label>
                <select class="form-select" ${(isView || isEdit) ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="handleCustomerSelectInOrder(this.value)"'} required>
                  <option value="">-- Chọn khách hàng --</option>
                  ${customerOptions}
                </select>
                ${d.quotationId ? `<div style="font-size: 11px; color: var(--primary); font-family: var(--font-dm-mono); margin-top: 4px;">✔ Đã tự động áp dụng Báo giá: ${d.quotationId}</div>` : ''}
              </div>
              <div class="form-group">
                <label class="form-label">Mã kho (Xuất kho) *</label>
                <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'warehouseCode\', this.value)"'} required>
                  ${warehouseOptions}
                </select>
              </div>                                     
              <div class="form-group">
                <label class="form-label">Ngày lập phiếu *</label>
                <input type="date" class="form-input" value="${d.date || getTodayDateStr()}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'date\', this.value)"'} required>
              </div>
              <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'status\', this.value)"'}>
                  <option value="completed" ${d.status && ['completed', 'hoàn thành'].includes((d.status || '').toLowerCase()) ? 'selected' : ''}>Hoàn thành</option>
                  <option value="accepted" ${(!d.status || ['accepted', 'approved', 'duyệt', 'đã duyệt'].includes((d.status || '').toLowerCase())) ? 'selected' : ''}>Duyệt</option>
                  <option value="pending" ${d.status && ['pending', 'chờ duyệt', 'processing', 'đang xử lý'].includes((d.status || '').toLowerCase()) ? 'selected' : ''}>Chờ duyệt</option>
                  <option value="cancelled" ${d.status && ['cancelled', 'đã hủy'].includes((d.status || '').toLowerCase()) ? 'selected' : ''}>Đã hủy</option>
                </select>
              </div>
              <div class="form-group" style="grid-column: span 3;">
                <label class="form-label">Ghi chú</label>
                <textarea class="form-textarea" rows="2" style="resize: vertical; ${isView ? 'background: var(--muted); cursor: not-allowed;' : ''}" ${isView ? 'readonly' : 'onchange="updateField(\'notes\', this.value)"'} placeholder="Nhập ghi chú đơn hàng (tùy chọn)...">${d.notes || ''}</textarea>
              </div>
            </div>
          </div>

          <div class="section-panel">
            <div class="section-header" style="justify-content: space-between;">
              <div style="display:flex; gap:10px;"><span class="section-num">02</span><span class="section-title">Danh sách sản phẩm</span></div>
              <!-- Nút Header: Tự động ẩn trên PC -->
              ${getAddLineButton('sales-orders', isDetailsDisabled, 'header')}
            </div>

            <div style="overflow-x: auto;">
              <!-- HEADER BẢNG: ĐỒNG BỘ MIN-WIDTH 1000PX, GAP 6PX VÀ PADDING 10PX 16PX -->
              <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; background: var(--secondary); border-bottom: 1px solid var(--border); align-items: center; min-width: 1000px; box-sizing: border-box;">
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;"></span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Mã Hàng</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Tên sản phẩm</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Đơn Vị</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Mã Kho</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Số Lượng</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Tồn</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Đơn giá</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Chiết Khấu %</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Thuế %</span>
                <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Thành tiền</span>
                ${!isView ? `<span></span>` : ''}
              </div>

              <!-- DANH SÁCH CÁC DÒNG SẢN PHẨM -->
              <div style="min-width: 1000px;">
                ${linesHtml}
              </div>
            </div>

            <!-- CẤU TRÚC PHÍA DƯỚI: NÚT THÊM DÒNG THẲNG HÀNG MÃ HÀNG & CÙNG HÀNG NGANG VỚI TẠM TÍNH -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 26px 10px 26px; flex-wrap: wrap; gap: 12px;">
              <!-- Khung chứa nút Thêm Dòng: Chiều rộng cố định khớp đúng cột Mã hàng -->
              <div style="width: 110px; flex-shrink: 0;">
                ${getAddLineButton('sales-orders', isDetailsDisabled, 'footer')}
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; min-width: 260px;">
                <div style="display: flex; justify-content: space-between; align-items: center; height: 36px;"><span class="form-label" style="margin:0;">Tạm tính</span><span style="font-family: var(--font-dm-mono);">${fmtUSD(d.subtotal)}</span></div>
                <div style="display: flex; justify-content: space-between;"><span class="form-label">Chiết khấu</span><span style="font-family: var(--font-dm-mono);">-${fmtUSD(d.discountTotal)}</span></div>
                <div style="display: flex; justify-content: space-between;"><span class="form-label">Tổng Thuế</span><span style="font-family: var(--font-dm-mono);">${fmtUSD(d.tax)}</span></div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 8px; margin-top: 2px;"><span class="form-label" style="font-weight: 600;">Tổng cộng</span><span style="font-family: var(--font-dm-mono); font-size: 15px; color: var(--primary); font-weight: 500;">${fmtUSD(d.total)}</span></div>
              </div>
            </div>
          </div>

          <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn-cancel" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="state.mode === 'edit' ? navigate('sales-orders', 'view', '${d.id}') : navigate('sales-orders')">
              ${isView ? 'Quay Lại' : 'Hủy'}
            </button>
            <div style="display: flex; gap: 8px;">              
              ${isView ? `
                ${hasPermission ? `
                  <button type="button" class="btn-action" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="navigate('sales-orders', 'edit', '${d.id}')">${Icons.edit} Sửa</button>
                  <button type="button" class="btn-action btn-action-del" style="padding: 8px 16px; font-size: 13px;" onclick="deleteItem('sales-orders', '${d.id}')">${Icons.trash} Xóa</button>
                ` : ''}
                <button type="button" class="btn-primary" onclick="exportSalesOrderToPDF()" style="background: #e11d48; color: #ffffff; padding: 8px 16px; font-size: 13px; cursor: pointer;">Xuất PDF</button>
              ` : ''}
              ${!isView ? `
                <button type="submit" class="btn-submit" style="padding: 8px 16px; font-size: 13px;" ${isDetailsDisabled ? 'disabled style="opacity: 0.5; cursor: not-allowed; pointer-events: none;"' : ''}>
                  ${state.mode === 'add' ? 'Tạo đơn hàng' : 'Cập nhật'}
                </button>
              ` : ''}
            </div>
          </div>
      </form>
    </div>
    `;
}

function renderReturnForm(c) {
  const d = state.formData || {};
  const isView = state.mode === 'view';
  const isEdit = state.mode === 'edit';
  const hasOrder = Boolean(d.orderId);
  const hasPermission = checkModulePermission('returns');

  d.lineItems = Array.isArray(d.lineItems) ? d.lineItems : [];
  d.total = d.lineItems.reduce((s, l) => s + ((l.qtyReturned || 0) * (l.unitPrice || 0)), 0);

  const isDetailsDisabled = !isView && state.mode === 'add' && !d.customer;

  if (!d.warehouseCode && db.warehouses.length > 0) {
    d.warehouseCode = db.warehouses[0].code || db.warehouses[0].id;
  }

  let datalistEl = document.getElementById('global-materials-list');
  if (!datalistEl) {
    datalistEl = document.createElement('datalist');
    datalistEl.id = 'global-materials-list';
    document.body.appendChild(datalistEl);
  }

  const sortedMaterials = JSON.parse(JSON.stringify(db.materials || [])).sort((a, b) =>
    (a.id || '').localeCompare(b.id || '', undefined, { numeric: true, sensitivity: 'base' })
  );

  datalistEl.innerHTML = sortedMaterials.map(m =>
    `<option value="${m.name}">${m.id} - ${m.name} (${fmtUSD(m.cost || 0)})</option>`
  ).join('');

  const warehouseOptions = (db.warehouses || []).map(w => {
    const wCode = w.code || w.id;
    return `<option value="${wCode}" ${d.warehouseCode === wCode ? 'selected' : ''}>${wCode} - ${w.name}</option>`;
  }).join('');

  const customerOptions = (db.customers || []).map(cust =>
    `<option value="${cust.name || ''}" ${d.customer === cust.name ? 'selected' : ''}>${cust.name || ''}</option>`
  ).join('');

  // Lọc danh sách Đơn Hàng Bán: Nếu đã chọn Khách Hàng -> Chỉ lấy các đơn của KH đó
  const filteredOrders = (db.orders || []).filter(o => {
    if (!d.customer) return true; // Nếu chưa chọn Khách Hàng -> Hiển thị tất cả đơn hàng
    return o.customer && String(o.customer).trim().toLowerCase() === String(d.customer).trim().toLowerCase();
  });

  // Tạo các thẻ <option> từ danh sách đã lọc
  const orderOptions = filteredOrders.map(o =>
    `<option value="${o.id}" ${d.orderId === o.id ? 'selected' : ''}>${o.id} - ${o.customer || 'Khách không tên'}</option>`
  ).join('');

  const gridLayout = isView ? "10px 100px 1fr 60px 70px 65px 65px 100px 100px" : "10px 100px 1fr 60px 70px 65px 65px 100px 100px 32px";

  const linesHtml = d.lineItems.map((l, idx) => {
    const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
    const unitName = mat ? (mat.unit || '—') : '—';
    const stockQty = calculateRealtimeStock(l.sku, d.warehouseCode, d.id);

    return `
      <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; border-bottom: 1px solid var(--border); align-items: center; ${isDetailsDisabled ? 'opacity: 0.5; pointer-events: none;' : ''}">
        <span style="font-family: var(--font-dm-mono, monospace); font-size: 10px; font-weight: 400; color: var(--muted-foreground); min-width: 14px; text-align: right; user-select: none;">
          ${idx + 1}.
        </span>
        <input type="text" id="line-item-${l.lineId}-sku" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; color: var(--primary);" value="${l.sku || ''}" readonly title="Mã hàng không cho sửa">
        
        <input type="text" id="line-item-${l.lineId}-name" autocomplete="off" ${(isView || isDetailsDisabled) ? '' : 'list="global-materials-list"'} class="form-input" style="padding: 6px 8px; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.name || ''}" ${(isView || isDetailsDisabled) ? 'readonly' : 'onkeydown="handleLineItemKeyDown(event, \'returns\', ' + idx + ', \'name\')" onchange="handleMaterialSelectInLine(\'' + l.lineId + '\', this.value)"'} placeholder="${isDetailsDisabled ? 'Vui lòng chọn khách hàng...' : 'Chọn/nhập tên hàng...'}" required>
        
        <input type="text" id="line-item-${l.lineId}-unit" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; text-align: center;" value="${unitName}" readonly title="Đơn vị tính lấy từ Material">
        
        <input type="text" id="line-item-${l.lineId}-warehouseCode" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; text-align: center;" value="${d.warehouseCode || '—'}" readonly title="Mã kho lấy từ mục 01 xuống">
        
        <input type="number" id="line-item-${l.lineId}-qtyReturned" step="any" inputmode="decimal" class="form-input" style="padding: 6px 6px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.qtyReturned ?? 1}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'returns', ${idx}, 'qtyReturned')" onchange="updateLine('${l.lineId}', 'qtyReturned', this.value, 'number')"`}>
        
        <input type="text" id="line-item-${l.lineId}-stock" class="form-input" style="padding: 6px 6px; text-align: right; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; color: ${stockQty < 0 ? '#f87171' : 'var(--foreground)'};" value="${stockQty}" readonly title="Tồn thực tế">
        
        <input 
          type="text" 
          id="line-item-${l.lineId}-unitPrice"
          inputmode="numeric"
          class="form-input" 
          style="padding: 6px 6px; text-align: right; ${(isView || hasOrder || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" 
          value="${(l.unitPrice ?? 0).toLocaleString('vi-VN')}" 
          ${(isView || hasOrder || isDetailsDisabled) ? 'readonly' : `
            onkeydown="handleLineItemKeyDown(event, 'returns', ${idx}, 'unitPrice')"
            onfocus="this.value = parseNumberInput(this.value) || ''" 
            onblur="this.value = formatVNDInput(this.value)" 
            onchange="updateLine('${l.lineId}', 'unitPrice', parseNumberInput(this.value), 'number')"
          `}
        >
        
        <div style="font-family: var(--font-dm-mono); text-align: right; color: #f87171; font-weight: 500; font-size: 12px;">${fmtUSD((l.qtyReturned || 0) * (l.unitPrice || 0))}</div>
        ${(!isView && !isDetailsDisabled) ? `<button type="button" style="background: none; border: none; cursor: pointer; color: var(--muted-foreground); display: flex; align-items: center; justify-content: center;" onclick="removeLineItem('${l.lineId}')">${Icons.trash}</button>` : ''}
      </div>
    `;
  }).join('');

  c.innerHTML = `
    <div style="max-width: 1050px;">
      ${getBreadcrumb('Nhận Hàng Bán Trả Lại', isView ? `Xem ${d.id}` : (isEdit ? `Chỉnh sửa ${d.id}` : 'Tạo phiếu nhận trả mới'), 'returns')}
      <form onsubmit="event.preventDefault(); saveForm('returns');">
        <div class="section-panel">
          <div class="section-header"><span class="section-num">01</span><span class="section-title">Thông tin phiếu nhận trả</span></div>
          <div class="section-body grid-3">
            <div class="form-group">
              <label class="form-label">Đơn hàng bán (Tùy chọn)</label>
              <select class="form-select" ${(isView || isEdit) ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="handleOrderSelectInReturn(this.value)"'}>
                <option value="">-- Không theo đơn hàng --</option>
                ${orderOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tên khách hàng *</label>
              <select class="form-select" ${(isView || isEdit || hasOrder) ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'customer\', this.value); render();"'} required>
                <option value="">-- Chọn khách hàng --</option>
                ${customerOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Mã kho *</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'warehouseCode\', this.value)"'} required>
                ${warehouseOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Lý do *</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'reason\', this.value)"'}>
                ${['Hàng lỗi/hỏng', 'Giao nhầm sản phẩm', 'Đặt hàng thừa', 'Hủy đơn hàng', 'Hư hỏng do vận chuyển', 'Khác'].map(w => `<option value="${w}" ${d.reason === w ? 'selected' : ''}>${w}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Ngày nhận trả *</label>
              <input type="date" class="form-input" value="${d.date || getTodayDateStr()}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'date\', this.value)"'} required>
            </div>
            <div class="form-group">
              <label class="form-label">Trạng thái</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'status\', this.value)"'}>                                                      
                <option value="completed" ${d.status && ['completed', 'hoàn thành', 'đã xử lý'].includes((d.status || '').toLowerCase()) ? 'selected' : ''}>Hoàn thành</option>
                <option value="accepted" ${(!d.status || ['accepted', 'duyệt', 'đã duyệt'].includes((d.status || '').toLowerCase())) ? 'selected' : ''}>Duyệt</option>
                <option value="pending" ${d.status && ['pending', 'chờ duyệt'].includes((d.status || '').toLowerCase()) ? 'selected' : ''}>Chờ duyệt</option>
                <option value="rejected" ${d.status && ['rejected', 'từ chối'].includes((d.status || '').toLowerCase()) ? 'selected' : ''}>Từ chối</option>
              </select>
            </div>
            <div class="form-group" style="grid-column: span 3;">
              <label class="form-label">Ghi chú nhập tay</label>
              <textarea class="form-textarea" rows="2" style="resize: vertical; ${isView ? 'background: var(--muted); cursor: not-allowed;' : ''}" ${isView ? 'readonly' : 'onchange="updateField(\'notes\', this.value)"'} placeholder="Nhập ghi chú chi tiết...">${d.notes || ''}</textarea>
            </div>
          </div>
        </div>

        <div class="section-panel">
          <div class="section-header" style="justify-content: space-between;">
            <div style="display:flex; gap:10px;"><span class="section-num">02</span><span class="section-title">Danh sách hàng nhận trả</span></div>
            ${getAddLineButton('returns', isDetailsDisabled, 'header')}
          </div>
          <div style="overflow-x: auto;">
            <!-- HEADER BẢNG: ĐỒNG BỘ MIN-WIDTH 850PX, GAP 6PX VÀ PADDING 10PX 16PX -->
            <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; background: var(--secondary); border-bottom: 1px solid var(--border); align-items: center; min-width: 850px; box-sizing: border-box;">
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;"></span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Mã Hàng</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Tên Hàng</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Đơn Vị</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Mã Kho</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">SL Trả Lại</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Tồn</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Đơn giá</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Thành tiền</span>
              ${!isView ? `<span></span>` : ''}
            </div>

            <!-- DANH SÁCH CÁC DÒNG SẢN PHẨM -->
            <div style="min-width: 850px;">
              ${linesHtml}
            </div>
          </div>

          <!-- NÚT THÊM DÒNG RỘNG BẰNG CỘT MÃ HÀNG VÀ THẲNG HÀNG DỌC -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 26px 10px 26px; flex-wrap: wrap; gap: 12px;">
              <div style="width: 110px; flex-shrink: 0;">
                ${getAddLineButton('returns', isDetailsDisabled, 'footer')}
              </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 8px; min-width: 260px; height: 36px;"><span class="form-label" style="font-weight: 600; margin:0;">Tổng hoàn tiền</span><span style="font-family: var(--font-dm-mono); font-size: 15px; color: #f87171; font-weight: 500;">${fmtUSD(d.total)}</span></div>
          </div>
        </div>

        <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-cancel" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="state.mode === 'edit' ? navigate('returns', 'view', '${d.id}') : navigate('returns')">
            ${isView ? 'Quay Lại' : 'Hủy'}
          </button>
          <div style="display: flex; gap: 8px;">
            ${isView && hasPermission ? `
              <button type="button" class="btn-action" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="navigate('returns', 'edit', '${d.id}')">${Icons.edit} Sửa</button>
              <button type="button" class="btn-action btn-action-del" style="padding: 8px 16px; font-size: 13px;" onclick="deleteItem('returns', '${d.id}')">${Icons.trash} Xóa</button>
            ` : ''}
            ${!isView ? `<button type="submit" class="btn-submit" style="padding: 8px 16px; font-size: 13px;" ${isDetailsDisabled ? 'disabled style="opacity: 0.5; cursor: not-allowed; pointer-events: none;"' : ''}>${state.mode === 'add' ? 'Tạo phiếu nhận trả' : 'Cập nhật'}</button>` : ''}
          </div>
        </div>
      </form>
    </div>
    `;
}

function renderGRNForm(c) {
  const d = state.formData || {};
  const isView = state.mode === 'view';
  const hasPermission = checkModulePermission('grn');
  d.lineItems = Array.isArray(d.lineItems) ? d.lineItems : [];

  const isDetailsDisabled = !isView && state.mode === 'add' && !d.supplier;

  if (!d.warehouseCode && db.warehouses.length > 0) {
    d.warehouseCode = db.warehouses[0].code || db.warehouses[0].id;
  }

  d.lineItems.forEach(l => {
    l.warehouseCode = d.warehouseCode;
  });

  d.totalValue = d.lineItems.reduce((s, l) => s + ((l.receivedQty || l.qtyImport || 0) * (l.unitCost || 0)), 0);

  let datalistEl = document.getElementById('global-materials-list');
  if (!datalistEl) {
    datalistEl = document.createElement('datalist');
    datalistEl.id = 'global-materials-list';
    document.body.appendChild(datalistEl);
  }

  const sortedMaterials = JSON.parse(JSON.stringify(db.materials || [])).sort((a, b) =>
    (a.id || '').localeCompare(b.id || '', undefined, { numeric: true, sensitivity: 'base' })
  );

  datalistEl.innerHTML = sortedMaterials.map(m =>
    `<option value="${m.name}">${m.id} - ${m.name} (${fmtUSD(m.cost || 0)})</option>`
  ).join('');

  const warehouseOptions = (db.warehouses || []).map(w => {
    const wCode = w.code || w.id;
    return `<option value="${wCode}" ${d.warehouseCode === wCode ? 'selected' : ''}>${wCode} - ${w.name}</option>`;
  }).join('');

  const gridLayout = isView ? "10px 100px 1fr 60px 70px 65px 65px 100px 100px" : "10px 100px 1fr 60px 70px 65px 65px 100px 100px 32px";

  const linesHtml = d.lineItems.map((l, idx) => {
    const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
    const unitName = mat ? (mat.unit || '—') : '—';
    const stockQty = calculateRealtimeStock(l.sku, d.warehouseCode, d.id);
    const qtyVal = l.receivedQty ?? l.qtyImport ?? 1;

    return `
      <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; border-bottom: 1px solid var(--border); align-items: center; ${isDetailsDisabled ? 'opacity: 0.5; pointer-events: none;' : ''}">
        <span style="font-family: var(--font-dm-mono, monospace); font-size: 10px; font-weight: 400; color: var(--muted-foreground); min-width: 14px; text-align: right; user-select: none;">
          ${idx + 1}.
        </span>
        <input type="text" id="line-item-${l.lineId}-sku" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; color: var(--primary);" value="${l.sku || ''}" readonly title="Mã hàng tự động điền theo tên hàng">
        
        <input type="text" id="line-item-${l.lineId}-name" autocomplete="off" ${(isView || isDetailsDisabled) ? '' : 'list="global-materials-list"'} class="form-input" style="padding: 6px 8px; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${l.name || ''}" ${(isView || isDetailsDisabled) ? 'readonly' : 'onkeydown="handleLineItemKeyDown(event, \'grn\', ' + idx + ', \'name\')" onchange="handleMaterialSelectInLine(\'' + l.lineId + '\', this.value)"'} placeholder="${isDetailsDisabled ? 'Vui lòng nhập nhà cung cấp...' : 'Chọn/nhập tên hàng...'}" required>
        
        <input type="text" id="line-item-${l.lineId}-unit" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; text-align: center;" value="${unitName}" readonly title="Đơn vị tính lấy từ danh mục">
        
        <input type="text" id="line-item-${l.lineId}-warehouseCode" class="form-input" style="padding: 6px 8px; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; text-align: center;" value="${d.warehouseCode || '—'}" readonly title="Mã kho từ mục 01 xuống">
        
        <input type="number" id="line-item-${l.lineId}-receivedQty" step="any" inputmode="decimal" class="form-input" style="padding: 6px 6px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" value="${qtyVal}" ${(isView || isDetailsDisabled) ? 'readonly' : `onkeydown="handleLineItemKeyDown(event, 'grn', ${idx}, 'receivedQty')" onchange="updateLine('${l.lineId}', 'receivedQty', this.value, 'number'); updateLine('${l.lineId}', 'qtyImport', this.value, 'number');"`}>
        
        <input type="text" id="line-item-${l.lineId}-stock" class="form-input" style="padding: 6px 6px; text-align: right; font-family: var(--font-dm-mono); background: var(--muted); cursor: not-allowed; color: ${stockQty < 0 ? '#f87171' : 'var(--foreground)'};" value="${stockQty}" readonly title="Tồn thực tế tính tự động">
        
        <input 
          type="text" 
          id="line-item-${l.lineId}-unitCost"
          inputmode="numeric"
          class="form-input" 
          style="padding: 6px 6px; text-align: right; ${(isView || isDetailsDisabled) ? 'background: var(--muted); cursor: not-allowed;' : ''}" 
          value="${(l.unitCost ?? 0).toLocaleString('vi-VN')}" 
          ${(isView || isDetailsDisabled) ? 'readonly' : `
            onkeydown="handleLineItemKeyDown(event, 'grn', ${idx}, 'unitCost')"
            onfocus="this.value = parseNumberInput(this.value) || ''" 
            onblur="this.value = formatVNDInput(this.value)" 
            onchange="updateLine('${l.lineId}', 'unitCost', parseNumberInput(this.value), 'number')"
          `}
        >
        
        <div style="font-family: var(--font-dm-mono); text-align: right; font-weight: 500; font-size: 12px;">${fmtUSD((qtyVal) * (l.unitCost || 0))}</div>
        ${(!isView && !isDetailsDisabled) ? `<button type="button" style="background: none; border: none; cursor: pointer; color: var(--muted-foreground); display: flex; align-items: center; justify-content: center;" onclick="removeLineItem('${l.lineId}')">${Icons.trash}</button>` : ''}
      </div>
    `;
  }).join('');

  c.innerHTML = `
    <div style="max-width: 1050px;">
      ${getBreadcrumb('Phiếu nhập kho', isView ? `Xem ${d.id}` : (state.mode === 'edit' ? `Chỉnh sửa ${d.id}` : 'Tạo phiếu nhập kho mới'), 'grn')}
      <form onsubmit="event.preventDefault(); saveForm('grn');">
        <div class="section-panel">
          <div class="section-header"><span class="section-num">01</span><span class="section-title">Chi tiết nhập kho</span></div>
          <div class="section-body grid-3">
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Nhà cung cấp *</label>
              <input 
                  type="text" 
                  class="form-input" 
                  value="${d.supplier || ''}" 
                  ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : `
                    oninput="this.value = toTitleCase(this.value); updateField('supplier', this.value.trim());" 
                    onblur="if(this.value.trim()) render();"
                    onchange="this.value = toTitleCase(this.value.trim()); updateField('supplier', this.value.trim()); render();"
                  `} 
                  placeholder="Nhập tên nhà cung cấp..." 
                  required
                >
            </div>
            <div class="form-group">
              <label class="form-label">Mã kho *</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'warehouseCode\', this.value)"'} required>
                ${warehouseOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Ngày nhập kho *</label>
              <input type="date" class="form-input" value="${d.date || getTodayDateStr()}" ${isView ? 'readonly style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'date\', this.value)"'} required>
            </div>
            <div class="form-group">
              <label class="form-label">Trạng thái</label>
              <select class="form-select" ${isView ? 'disabled style="background: var(--muted); cursor: not-allowed;"' : 'onchange="updateField(\'status\', this.value)"'}>
                <option value="Đã nhận" ${d.status === 'Đã nhận' || d.status === 'received' ? 'selected' : ''}>Đã nhận</option>
                <option value="Bản nháp" ${d.status === 'Bản nháp' || d.status === 'draft' ? 'selected' : ''}>Bản nháp</option>
                <option value="Đã xác minh" ${d.status === 'Đã xác minh' || d.status === 'verified' ? 'selected' : ''}>Đã xác minh</option>
              </select>
            </div>
            <div class="form-group" style="grid-column: span 3;">
              <label class="form-label">Ghi chú</label>
              <textarea class="form-textarea" rows="2" style="resize: vertical; ${isView ? 'background: var(--muted); cursor: not-allowed;' : ''}" ${isView ? 'readonly' : 'onchange="updateField(\'notes\', this.value)"'} placeholder="Nhập ghi chú phiếu nhập kho...">${d.notes || ''}</textarea>
            </div>
          </div>
        </div>

        <div class="section-panel">
          <div class="section-header" style="justify-content: space-between;">
            <div style="display:flex; gap:10px;"><span class="section-num">02</span><span class="section-title">Danh sách sản phẩm</span></div>
            ${getAddLineButton('grn', isDetailsDisabled, 'header')}
          </div>
          <div style="overflow-x: auto;">
            <!-- HEADER BẢNG: ĐỒNG BỘ MIN-WIDTH 850PX, GAP 6PX VÀ PADDING 10PX 16PX -->
            <div style="display: grid; grid-template-columns: ${gridLayout}; gap: 6px; padding: 10px 16px 10px 10px; background: var(--secondary); border-bottom: 1px solid var(--border); align-items: center; min-width: 850px; box-sizing: border-box;">
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;"></span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Mã Hàng</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Tên Hàng</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Đơn Vị</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Mã Kho</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">SL Nhập</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Tồn</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Giá nhập</span>
              <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--foreground); text-transform: uppercase; text-align: center;">Thành tiền</span>
              ${!isView ? `<span></span>` : ''}
            </div>

            <!-- DANH SÁCH CÁC DÒNG SẢN PHẨM -->
            <div style="min-width: 850px;">
              ${linesHtml}
            </div>
          </div>

          <!-- BỐ TRÍ KHU VỰC TỔNG TIỀN VÀ NÚT THÊM DÒNG TRÊN PC -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 26px 10px 26px; flex-wrap: wrap; gap: 12px;">
            <div style="width: 110px; flex-shrink: 0;">
              ${getAddLineButton('grn', isDetailsDisabled, 'footer')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 8px; min-width: 260px; height: 36px;">
              <span class="form-label" style="font-weight: 600; margin: 0;">Tổng giá trị</span>
              <span style="font-family: var(--font-dm-mono); font-size: 15px; color: var(--primary); font-weight: 500;">${fmtUSD(d.totalValue)}</span>
            </div>
          </div>
        </div>

        <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
          <button type="button" class="btn-cancel" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="state.mode === 'edit' ? navigate('grn', 'view', '${d.id}') : navigate('grn')">
            ${isView ? 'Quay Lại' : 'Hủy'}
          </button>
          <div style="display: flex; gap: 8px;">
            ${isView && hasPermission ? `
              <button type="button" class="btn-action" style="padding: 8px 16px; font-size: 13px;" event.preventDefault(); onclick="navigate('grn', 'edit', '${d.id}')">${Icons.edit} Sửa</button>
              <button type="button" class="btn-action btn-action-del" style="padding: 8px 16px; font-size: 13px;" onclick="deleteItem('grn', '${d.id}')">${Icons.trash} Xóa</button>
            ` : ''}
            ${!isView ? `<button type="submit" class="btn-submit" style="padding: 8px 16px; font-size: 13px;" ${isDetailsDisabled ? 'disabled style="opacity: 0.5; cursor: not-allowed; pointer-events: none;"' : ''}>${state.mode === 'add' ? 'Tạo phiếu nhập' : 'Cập nhật'}</button>` : ''}
          </div>
        </div>
      </form>
    </div>
    `;
}

function renderReportInventory(c) {
  const materials = db.materials;
  const hasPermission = checkModulePermission('materials');

  if (state.reportInvSearch === undefined) state.reportInvSearch = '';

  const getActualStock = (m) => {
    const invList = (db.inventory || []).filter(i => i.sku === m.id || i.material_id === m.id);
    if (invList.length > 0) {
      return invList.reduce((sum, inv) => sum + Number(inv.ton_thuc_te ?? inv.stock ?? 0), 0);
    }
    return m.stock ?? 0;
  };

  const getFilteredList = () => {
    const searchKey = normalizeSearchText(state.reportInvSearch);
    return materials.filter(m => {
      const matchCat = (state.filter === 'all' || m.category === state.filter);
      const matchSearch = !searchKey ||
        normalizeSearchText(m.id).includes(searchKey) ||
        normalizeSearchText(m.name).includes(searchKey) ||
        normalizeSearchText(m.location).includes(searchKey) ||
        normalizeSearchText(m.unit).includes(searchKey);
      return matchCat && matchSearch;
    });
  };

  const filtered = getFilteredList();

  // TÍNH TOÁN PHÂN TRANG
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const visibleList = filtered.slice(startIndex, startIndex + state.pageSize);

  const totalVal = filtered.reduce((s, m) => s + getActualStock(m) * (m.cost || 0), 0);

  const lowCount = filtered.filter(m => (m.status || '').toLowerCase() === 'low').length;
  const outCount = filtered.filter(m => (m.status || '').toLowerCase() === 'out').length;

  const categories = Array.from(new Set(materials.map(m => m.category)));
  const catBreakdown = categories.map(cat => {
    const items = materials.filter(m => m.category === cat);
    return { category: cat, count: items.length, value: items.reduce((s, m) => s + getActualStock(m) * (m.cost || 0), 0) };
  }).sort((a, b) => b.value - a.value);
  const maxVal = catBreakdown[0]?.value || 1;

  const kpiHtml = [
    { label: 'Tổng số SKU', value: fmt(materials.length), sub: 'đang hoạt động' },
    { label: 'Giá trị tồn thực tế', value: fmtUSD(materials.reduce((s, m) => s + getActualStock(m) * (m.cost || 0), 0)), sub: 'theo giá vốn' },
    { label: 'Giá trị đã giữ', value: fmtUSD(materials.reduce((s, m) => s + (m.reserved || 0) * (m.cost || 0), 0)), sub: 'cam kết đơn hàng' },
    { label: 'Sản phẩm cảnh báo', value: fmt(materials.filter(m => ['low', 'critical', 'out'].includes(m.status)).length), sub: 'dưới mức định mức' },
  ].map(s => `
    <div style="background-color: var(--card); padding: 16px 20px;">
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">${s.label}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 22px; font-weight: 300; margin-bottom: 4px;">${s.value}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground);">${s.sub}</div>
    </div>
    `).join('');

  const catBreakdownHtml = catBreakdown.map(cat => `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-family: var(--font-dm-mono); font-size: 11px; width: 100px; color: var(--muted-foreground);">${cat.category}</span>
      <div style="flex: 1; height: 8px; background: var(--muted);"><div style="width: ${(cat.value / maxVal) * 100}%; height: 100%; background: var(--primary);"></div></div>
      <span style="font-family: var(--font-dm-mono); font-size: 11px; width: 90px; text-align: right;">${fmtUSD(cat.value)}</span>
    </div>
    `).join('');

  const alertsHtml = materials.filter(m => ['low', 'critical', 'out'].includes(m.status)).map(m => `
    <div style="padding: 8px 12px; border: 1px solid var(--border); background: var(--secondary);">
      <div style="font-size: 12px; font-weight: 500;">${m.name}</div>
      <div style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground);">${m.id} · ${getActualStock(m)} / ${m.reorder ?? 0} đơn vị</div>
    </div>
    `).join('');

  const columnConfig = [
    { title: 'Mã Hàng (SKU)', width: '30px', align: 'center' },
    { title: 'Tên Hàng', width: '100px', align: 'center' },
    { title: 'Đơn Vị', width: '20px', align: 'center' },
    { title: 'Danh Mục', width: '40px', align: 'center' },
    { title: 'Vị Trí', width: '50px', align: 'center' },
    { title: 'Tồn Đầu Kỳ', width: '20px', align: 'center' },
    { title: 'Tồn Thực Tế', width: '20px', align: 'center' },
    { title: 'Mức Cảnh Báo', width: '20px', align: 'center' },
    { title: 'Giá Vốn', width: '20px', align: 'center' },
    { title: 'Trạng Thái', width: '50px', align: 'center' }
  ];

  const headersHtml = columnConfig.map(col => `
  <th style="width: ${col.width}; min-width: ${col.width}; padding: 9px 16px; text-align: ${col.align}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">
    ${col.title}
  </th>
`).join('');

  const renderRows = (list) => {
    return list.map(m => {
      const tonThucTe = getActualStock(m);
      const tonDauKy = m.stock ?? 0;

      return `
        <tr style="border-bottom: 1px solid var(--border);" class="hover-row" ondblclick="navigate('materials', '${hasPermission ? 'edit' : 'view'}', '${m.id}')" onclick="navigate('materials', 'view', '${m.id}')">
          <td data-label="Mã Hàng (SKU)" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: left; color: var(--primary);">${m.id}</td>
          <td data-label="Tên Hàng" style="padding: 11px 16px; font-size: 13px;">${m.name}</td>
          <td data-label="Đơn Vị" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--foreground);">${m.unit || '—'}</td>
          <td data-label="Danh Mục" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 11px; text-align: center; color: var(--muted-foreground);">${m.category || '—'}</td>
          <td data-label="Vị Trí" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center;">${m.location || '—'}</td>
          <td data-label="Tồn Đầu Kỳ" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right; color: var(--muted-foreground);">${tonDauKy}</td>
          <td data-label="Tồn Thực Tế" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right; font-weight: 600; color: var(--primary);">${tonThucTe}</td>
          <td data-label="Mức Cảnh Báo" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right; color: var(--muted-foreground);">${m.reorder ?? 0}</td>
          <td data-label="Giá Vốn" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right;">${fmtUSD(m.cost || 0)}</td>
          <td data-label="Trạng Thái" style="padding: 11px 16px; text-align: center;"><span class="badge ${getBadgeClass(m.status)}">${getStatusLabel(m.status)}</span></td>
        </tr>
        `;
    }).join('');
  };

  const isMobile = window.innerWidth <= 768;

  const filterOptions = [
    ['all', 'TẤT CẢ'],
    ['Rau củ', 'RAU CỦ'],
    ['Hoa quả', 'HOA QUẢ'],
    ['Khác', 'KHÁC']
  ];

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        ${kpiHtml}
      </div>

      <!--
      <div style="display: grid; grid-template-columns: 1fr 320px; gap: 16px;" class="grid-2">
        <div style="border: 1px solid var(--border); background: var(--card); padding: 20px;">
          <div style="font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 16px;">Giá Trị Tồn Kho Theo Danh Mục</div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${catBreakdownHtml}
          </div>
        </div>
        <div style="border: 1px solid var(--border); background: var(--card); padding: 20px;">
          <div style="font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 12px;">Cảnh Báo Hàng Tồn Kho</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${alertsHtml}
          </div>
        </div>
      </div>
      -->

      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;" id="inventory-report-table-box">

        <div style="padding: ${isMobile ? '12px 12px' : '13px 20px'}; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <span style="font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground);">Báo Cáo Tồn Kho Chi Tiết & Định Giá</span>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; width: ${isMobile ? '100%' : 'auto'}; flex-direction: ${isMobile ? 'column-reverse' : 'row'};">
            
            <div style="display: flex; align-items: center; gap: 6px; border: 1px solid var(--border); background: var(--card); padding: 0 12px; border-radius: 2px; width: ${isMobile ? '100%' : '220px'}; height: ${isMobile ? '38px' : '31px'}; box-sizing: border-box;">
              <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
              <input type="text" id="report-inv-search-input" placeholder="Tìm kiếm..." value="${state.reportInvSearch}" style="background: transparent; border: none; outline: none; color: var(--foreground); font-family: var(--font-jost); font-size: 13px; width: 100%; height: 100%; box-sizing: border-box; padding: 0;">
            </div>

            <!-- Tự động áp dụng getFilterBar trên PC và giữ giao diện mobile -->
            ${isMobile ? `
              <div style="display: flex; gap: 4px; flex-wrap: wrap; width: 100%; justify-content: flex-start;">
                ${filterOptions.map(([val, label]) => `
                  <button 
                    onclick="state.filter='${val}'; state.page=1; render();" 
                    style="
                      padding: 6px 10px; 
                      font-family: var(--font-dm-mono); 
                      font-size: 10px; 
                      letter-spacing: 0.05em;
                      text-transform: uppercase; 
                      border-radius: 2px; 
                      cursor: pointer;
                      transition: all 0.2s ease;
                      ${state.filter === val
      ? 'background: #f0a030; color: #000000; border: 1px solid #f0a030;'
      : 'background: rgba(255, 255, 255, 0.03); color: var(--muted-foreground); border: 1px solid var(--border);'
    }
                    "
                  >
                    ${label}
                  </button>
                `).join('')}
              </div>
            ` : getFilterBar(filterOptions)}

          </div>
        </div>

        <div style="padding: 8px 20px 4px; display: flex; justify-content: flex-end; border-bottom: 1px solid var(--border); background: var(--secondary);">
          <span style="font-family: var(--font-dm-mono); font-size: 12px; color: var(--muted-foreground);" id="report-inv-summary-text">
            Đang hiển thị <strong>${totalItems === 0 ? 0 : startIndex + 1}-${Math.min(startIndex + state.pageSize, totalItems)}/${totalItems}</strong> mặt hàng · Tổng giá trị: <strong style="color: var(--primary);">${fmtUSD(totalVal)}</strong> · Sắp hết: ${lowCount} · Hết hàng: ${outCount}
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary);">
              ${headersHtml}
            </tr>
          </thead>
          <tbody id="report-inv-tbody">
            ${renderRows(visibleList)}
          </tbody>
        </table>

        <div id="report-inv-empty-msg" style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px; display: ${filtered.length === 0 ? 'block' : 'none'};">
          Không tìm thấy dữ liệu mặt hàng phù hợp
        </div>

      </div>

      <!-- THANH ĐIỀU HƯỚNG PHÂN TRANG -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
        <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
          Hiển thị ${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + state.pageSize, totalItems)} / Tổng ${totalItems} mục
        </span>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
          <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${totalPages}</span>
          <button ${state.page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
        </div>
      </div>
    </div>
    `;

  // Xử lý ô Tìm kiếm
  const searchInput = document.getElementById('report-inv-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.reportInvSearch = e.target.value;
      state.page = 1;
      render();
    });
  }
}

function renderReportSales(c) {
  const {
    salesDataReal,
    ytdRevenue,
    ytdOrders
  } = getSalesAnalyticsData();

  const totalReturnsCount = (db.returns || []).filter(r => ['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes((r.status || '').toLowerCase())).length;
  const returnRatePercent = ytdOrders > 0 ? ((totalReturnsCount / ytdOrders) * 100).toFixed(1) : '0.0';
  const avgOrderValue = ytdOrders > 0 ? (ytdRevenue / ytdOrders) : 0;

  // 1. Khởi tạo State cho Ngày Từ - Đến, Khách hàng & Loại Báo Cáo
  if (!state.reportSalesFromDate) {
    state.reportSalesFromDate = getFirstDayOfMonthStr(); // Mặc định ngày đầu tiên của tháng
  }
  if (!state.reportSalesToDate) {
    state.reportSalesToDate = getLastDayOfMonthStr();   // Mặc định ngày cuối cùng của tháng
  }
  if (state.reportSalesCustomer === undefined) {
    state.reportSalesCustomer = '';
  }
  if (!state.reportType) {
    state.reportType = 'summary'; // Mặc định là 'summary' (Báo cáo tổng hợp)
  }
  // Khởi tạo limit cho Lazy Loading (áp dụng riêng cho Báo cáo chi tiết)
  if (!state.reportSalesLimit) {
    state.reportSalesLimit = 40;
  }

  const currentYear = new Date().getFullYear();
  const selectedFromDate = state.reportSalesFromDate;
  const selectedToDate = state.reportSalesToDate;
  const selectedCustomer = state.reportSalesCustomer;
  const reportType = state.reportType;

  // Tra cứu Đơn Vị từ danh mục Vật tư / Sản phẩm theo SKU hoặc Tên
  const getMaterialUnit = (sku, name) => {
    const mat = (db.materials || []).find(m => (sku && m.id === sku) || (name && m.name === name));
    return mat ? (mat.unit || '—') : '—';
  };

  // Lọc dữ liệu đơn hàng: Trạng thái Duyệt / Hoàn Thành và Ngày lập (Date) nằm trong khoảng Từ Ngày - Đến Ngày
  const filteredOrdersForDateRange = (db.orders || []).filter(o => {
    const status = (o.status || '').toLowerCase();
    const isValidStatus = ['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status);
    if (!isValidStatus) return false;
    if (!o.date) return false;

    return o.date >= selectedFromDate && o.date <= selectedToDate;
  });

  // Top khách hàng trong khoảng thời gian đã chọn
  const customerMap = {};
  filteredOrdersForDateRange.forEach(o => {
    const cName = o.customer || 'Khách lẻ';
    if (!customerMap[cName]) customerMap[cName] = { name: cName, revenue: 0, orders: 0 };
    customerMap[cName].revenue += Number(o.total || 0);
    customerMap[cName].orders += 1;
  });
  const topCustomersReal = Object.values(customerMap).sort((a, b) => b.revenue - a.revenue);

  // 2. Xử lý Dữ liệu hiển thị Bảng (Tổng hợp vs Chi tiết)
  let detailRowsHtml = '';
  let totalDisplayItemsCount = 0;

  // Cấu hình Cột Header: Đổi cột đầu tiên thành 'Đơn Hàng Bán' ở Báo cáo Chi tiết
  const headersConfig = reportType === 'detail'
    ? ['Đơn Hàng Bán', 'Tên Hàng', 'Đơn Vị', 'Số Lượng', 'Đơn Giá', 'Thành Tiền']
    : ['Mã Hàng (SKU)', 'Tên Hàng', 'Đơn Vị', 'Tổng Số Lượng', 'Tổng Tiền'];

  const detailHeaders = headersConfig
    .map(h => `<th style="padding: 10px 16px; text-align: ${['Số Lượng', 'Tổng Số Lượng', 'Đơn Giá', 'Thành Tiền', 'Tổng Tiền'].includes(h) ? 'right' : (h === 'Đơn Vị' ? 'center' : 'left')}; font-family: var(--font-dm-mono); font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted-foreground); font-weight: 400; white-space: nowrap;">${h}</th>`)
    .join('');

  if (reportType === 'summary') {
    // === BÁO CÁO TỔNG HỢP ===
    const itemSummaryMap = {};
    let grandTotalQty = 0;
    let grandTotalAmount = 0;

    filteredOrdersForDateRange.forEach(o => {
      if (!selectedCustomer || (o.customer && o.customer.trim().toLowerCase() === selectedCustomer.trim().toLowerCase())) {
        const items = Array.isArray(o.lineItems || o.lineitems) ? (o.lineItems || o.lineitems) : [];
        items.forEach(item => {
          const sku = item.sku || '—';
          const name = item.name || '—';
          const qty = Number(item.qty || 0);
          const price = Number(item.unitPrice || 0);
          const disc = Number(item.discount || 0);
          const tax = Number(item.tax || 0);
          const lineSub = qty * price * (1 - disc / 100);
          const lineTotal = lineSub * (1 + tax / 100);
          const unit = item.unit || getMaterialUnit(sku, name);

          if (!itemSummaryMap[sku]) {
            itemSummaryMap[sku] = { sku, name, unit, qty: 0, totalAmount: 0 };
          }
          itemSummaryMap[sku].qty += qty;
          itemSummaryMap[sku].totalAmount += lineTotal;

          grandTotalQty += qty;
          grandTotalAmount += lineTotal;
        });
      }
    });

    const detailItemsList = Object.values(itemSummaryMap).sort((a, b) => b.totalAmount - a.totalAmount);
    totalDisplayItemsCount = detailItemsList.length;

    // Phân trang
    const totalPages = Math.ceil(totalDisplayItemsCount / state.pageSize) || 1;
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;

    const startIndex = (state.page - 1) * state.pageSize;
    const paginatedDetailItems = detailItemsList.slice(startIndex, startIndex + state.pageSize);

    // Dòng tổng cộng ngay dưới header cho mẫu tổng hợp
    const grandTotalRowHtml = `
      <tr style="border-bottom: 2px solid var(--border); background: var(--secondary); font-weight: 600;">
        <td colspan="3" style="padding: 12px 16px; font-size: 13px; color: var(--foreground); text-transform: uppercase;"></td>
        <td style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 13px; text-align: right; color: var(--primary);">${fmt(grandTotalQty)}</td>
        <td style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 13px; text-align: right; color: var(--primary);">${fmtUSD(grandTotalAmount)}</td>
      </tr>
    `;

    const rowsHtml = paginatedDetailItems.map(item => `
      <tr style="border-bottom: 1px solid var(--border);" class="hover-row">
        <td data-label="Mã Hàng (SKU)" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; color: var(--primary);">${item.sku}</td>
        <td data-label="Tên Hàng" style="padding: 11px 16px; font-size: 13px; font-weight: 500;">${item.name}</td>
        <td data-label="Đơn Vị" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${item.unit}</td>
        <td data-label="Tổng Số Lượng" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right;">${fmt(item.qty)}</td>
        <td data-label="Tổng Tiền" style="padding: 11px 16px; font-family: var(--font-dm-mono); font-size: 13px; font-weight: 500; text-align: right; color: var(--primary);">${fmtUSD(item.totalAmount)}</td>
      </tr>
    `).join('');

    detailRowsHtml = grandTotalRowHtml + rowsHtml;

  } else {
    // === BÁO CÁO CHI TIẾT ===
    if (!selectedCustomer) {
      detailRowsHtml = `
        <tr>
          <td colspan="6" style="padding: 40px; text-align: center; color: #f87171; font-family: var(--font-dm-mono); font-size: 13px; font-weight: 500;">
            ⚠️ Vui lòng chọn khách hàng để xem báo cáo chi tiết!
          </td>
        </tr>
      `;
    } else {
      const customerOrders = filteredOrdersForDateRange.filter(o =>
        o.customer && o.customer.trim().toLowerCase() === selectedCustomer.trim().toLowerCase()
      );

      const dailyMap = {};
      let grandTotalQty = 0;
      let grandTotalAmount = 0;

      customerOrders.forEach(o => {
        const orderDateStr = o.date;
        if (!dailyMap[orderDateStr]) {
          dailyMap[orderDateStr] = {
            dateStr: orderDateStr,
            orders: []
          };
        }
        dailyMap[orderDateStr].orders.push(o);

        const items = Array.isArray(o.lineItems || o.lineitems) ? (o.lineItems || o.lineitems) : [];
        items.forEach(item => {
          const qty = Number(item.qty || 0);
          const price = Number(item.unitPrice || 0);
          const disc = Number(item.discount || 0);
          const tax = Number(item.tax || 0);
          const lineSub = qty * price * (1 - disc / 100);
          const lineTotal = lineSub * (1 + tax / 100);

          grandTotalQty += qty;
          grandTotalAmount += lineTotal;
        });
      });

      const sortedDates = Object.keys(dailyMap).sort((a, b) => new Date(a) - new Date(b));

      let rows = [];
      let itemCount = 0;
      let renderedItemCount = 0;

      for (const dateStr of sortedDates) {
        if (renderedItemCount >= state.reportSalesLimit) break;

        const dateParts = dateStr.split('-');
        const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : dateStr;

        const dayData = dailyMap[dateStr];
        dayData.orders.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));

        let dayTotalQty = 0;
        let dayTotalAmount = 0;
        let dayRows = [];

        dayRows.push(`
          <tr style="background: var(--secondary); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); cursor: pointer;" class="hover-row" onclick="navigate('sales-orders', 'list', null, { search: '${dateStr}', page: 1 });" title="Click để xem các Đơn hàng bán ngày ${formattedDate}">
            <td style="padding: 8px 16px;"></td>
            <td style="padding: 8px 16px;"></td>
            <td style="padding: 8px 16px; font-size: 13px; font-weight: 700; color: #f0a030; font-family: var(--font-dm-mono); text-align: center;">${formattedDate}</td>
            <td style="padding: 8px 16px; font-family: var(--font-dm-mono); font-size: 12px; font-weight: 700; text-align: right; color: #f0a030;">DAY_QTY_PLACEHOLDER</td>
            <td style="padding: 8px 16px; text-align: right;"></td>
            <td style="padding: 8px 16px; font-family: var(--font-dm-mono); font-size: 12px; font-weight: 700; text-align: right; color: #f0a030;">DAY_AMT_PLACEHOLDER</td>
          </tr>
        `);

        dayData.orders.forEach(o => {
          let orderQty = 0;
          let orderTotalAmount = 0;
          const items = Array.isArray(o.lineItems || o.lineitems) ? (o.lineItems || o.lineitems) : [];

          const orderHeaderIndex = dayRows.length;
          dayRows.push(''); // Phao chờ chèn HTML dòng tổng đơn hàng

          items.forEach(item => {
            const qty = Number(item.qty || 0);
            const price = Number(item.unitPrice || 0);
            const disc = Number(item.discount || 0);
            const tax = Number(item.tax || 0);
            const lineSub = qty * price * (1 - disc / 100);
            const lineTotal = lineSub * (1 + tax / 100);
            const sku = item.sku || '—';
            const name = item.name || '—';
            const unit = item.unit || getMaterialUnit(sku, name);

            orderQty += qty;
            orderTotalAmount += lineTotal;
            dayTotalQty += qty;
            dayTotalAmount += lineTotal;
            itemCount++;
            renderedItemCount++;

            dayRows.push(`
              <tr style="border-bottom: 1px solid var(--border); cursor: pointer;" class="hover-row" onclick="navigate('sales-orders', 'view', '${o.id}')" ondblclick="navigate('sales-orders', 'edit', '${o.id}')">
                <td data-label="Đơn Hàng Bán" style="padding: 9px 16px;"></td>
                <td data-label="Tên Hàng" style="padding: 9px 16px; font-size: 13px;">${name}</td>
                <td data-label="Đơn Vị" style="padding: 9px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: center; color: var(--muted-foreground);">${unit}</td>
                <td data-label="Số Lượng" style="padding: 9px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right;">${fmt(qty)}</td>
                <td data-label="Đơn Giá" style="padding: 9px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right;">${fmtUSD(price)}</td>
                <td data-label="Thành Tiền" style="padding: 9px 16px; font-family: var(--font-dm-mono); font-size: 12px; font-weight: 500; text-align: right;">${fmtUSD(lineTotal)}</td>
              </tr>
            `);
          });

          dayRows[orderHeaderIndex] = `
            <tr style="border-bottom: 1px solid var(--border); background: var(--secondary); font-weight: 600;" class="hover-row" onclick="navigate('sales-orders', 'view', '${o.id}')" ondblclick="navigate('sales-orders', 'edit', '${o.id}')">
              <td data-label="Đơn Hàng Bán" style="padding: 9px 16px; font-family: var(--font-dm-mono); font-size: 12px; color: var(--primary); font-weight: 600;">${o.id || '—'}</td>
              <td data-label="Ghi Chú" style="padding: 9px 16px; font-size: 12px; color: var(--muted-foreground); font-weight: 600;">${o.notes || '—'}</td>
              <td style="padding: 9px 16px; font-size: 12px; color: var(--muted-foreground); font-weight: 600; text-align: center;">—</td>
              <td data-label="Tổng Số Lượng" style="padding: 9px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right; color: var(--foreground);">${fmt(orderQty)}</td>
              <td style="padding: 9px 16px; font-size: 12px; color: var(--muted-foreground); font-weight: 600; text-align: right;">—</td>
              <td data-label="Tổng Tiền" style="padding: 9px 16px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right; color: var(--foreground);">${fmtUSD(orderTotalAmount)}</td>
            </tr>
          `;
        });

        dayRows[0] = dayRows[0]
          .replace('DAY_QTY_PLACEHOLDER', fmt(dayTotalQty))
          .replace('DAY_AMT_PLACEHOLDER', fmtUSD(dayTotalAmount));

        rows.push(...dayRows);
      }

      totalDisplayItemsCount = Object.values(dailyMap).reduce((sum, d) => sum + d.orders.reduce((s, o) => s + (o.lineItems || o.lineitems || []).length, 0), 0);

      if (rows.length === 0) {
        detailRowsHtml = `
          <tr>
            <td colspan="6" style="padding: 40px; text-align: center; color: var(--muted-foreground); font-family: var(--font-dm-mono); font-size: 12px;">
              Không có dữ liệu đơn hàng chi tiết trong khoảng thời gian đã chọn
            </td>
          </tr>
        `;
      } else {
        const grandTotalRowHtml = `
          <tr style="border-bottom: 2px solid var(--border); background: var(--secondary); font-weight: 600;">
            <td colspan="3" style="padding: 12px 16px; font-size: 13px; color: var(--foreground); text-transform: uppercase;"></td>
            <td style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 13px; text-align: right; color: var(--primary);">${fmt(grandTotalQty)}</td>
            <td style="padding: 12px 16px;"></td>
            <td style="padding: 12px 16px; font-family: var(--font-dm-mono); font-size: 13px; text-align: right; color: var(--primary);">${fmtUSD(grandTotalAmount)}</td>
          </tr>
        `;
        detailRowsHtml = grandTotalRowHtml + rows.join('');
      }
    }
  }

  const customersHtml = topCustomersReal.slice(0, 5).map((cus, i) => `
    <tr style="border-bottom: 1px solid var(--border); cursor: pointer;" class="hover-row" onclick="navigate('sales-orders', 'list', null, { search: '${cus.name.replace(/'/g, "\\'")}', page: 1 });" title="Click để xem danh sách đơn hàng của ${cus.name}">
      <td data-label="" style="padding: 9px 14px; font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground); width: 28px;">${String(i + 1)}.</td>
      <td data-label="" style="padding: 9px 14px; font-size: 13px; font-weight: 500; color: var(--foreground);">${cus.name}</td>
      <td data-label="" style="padding: 9px 14px; font-family: var(--font-dm-mono); font-size: 12px; text-align: right; color: var(--primary);">${fmtUSD(cus.revenue)}</td>
      <td data-label="" style="padding: 9px 14px; font-family: var(--font-dm-mono); font-size: 11px; text-align: right; color: var(--muted-foreground);">${cus.orders} đơn</td>
    </tr>
  `).join('');

  const customerSelectOptions = (db.customers || []).map(cust => `
    <option value="${cust.name}" ${selectedCustomer === cust.name ? 'selected' : ''}>${cust.name}</option>
  `).join('');

  c.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">

      <!-- KPI CARDS -->
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background-color: var(--border);" class="kpi-grid">
        <div class="kpi-card"><span class="kpi-label">Doanh Thu Lũy Kế Năm</span><div class="kpi-value-row"><span class="kpi-value">${fmtUSD(ytdRevenue)}</span></div><span class="kpi-sub">Năm ${currentYear}</span></div>
        <div class="kpi-card"><span class="kpi-label">Tổng Đơn Bán</span><div class="kpi-value-row"><span class="kpi-value">${fmt(ytdOrders)}</span></div><span class="kpi-sub">Năm ${currentYear}</span></div>
        <div class="kpi-card"><span class="kpi-label">Tỷ Lệ Trả Hàng</span><div class="kpi-value-row"><span class="kpi-value">${returnRatePercent}%</span></div><span class="kpi-sub">theo số lượt nhận trả</span></div>
        <div class="kpi-card"><span class="kpi-label">Giá Trị Đơn Trung Bình</span><div class="kpi-value-row"><span class="kpi-value">${fmtUSD(avgOrderValue)}</span></div><span class="kpi-sub">AOV năm ${currentYear}</span></div>
      </div>

      <!-- BIỂU ĐỒ DOANH SỐ & TOP KHÁCH HÀNG -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;" class="grid-2">
        <div style="border: 1px solid var(--border); background: var(--card); padding: 20px;" class="sales-chart-box">
        <div style="font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 16px;">Biểu Đồ Doanh Thu & Sản Lượng Đơn Bán</div>
        <div style="height: 220px;"><canvas id="chart-sales"></canvas></div>
      </div>
       
      <!-- Bảng Top Khách Hàng (Tối ưu vừa màn hình Mobile) -->
        <div style="border: 1px solid var(--border); background: var(--card);" class="top-customers-card">
          <div style="padding: 16px 20px; border-bottom: 1px solid var(--border); font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground);">Top Khách Hàng</div>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${customersHtml || '<tr><td colspan="4" style="padding: 20px; text-align: center; color: var(--muted-foreground); font-size: 12px;">Chưa có dữ liệu khách hàng</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- BẢNG THỐNG KÊ CHI TIẾT THEO KHÁCH HÀNG -->
      <div style="border: 1px solid var(--border); background: var(--card); overflow-x: auto;">
        <div style="padding: 12px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">

          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; font-weight: 600; color: var(--foreground);">
              Thống Kê ${reportType === 'detail' ? 'Chi Tiết' : 'Tổng Hợp'} Theo Khách Hàng ${selectedCustomer ? `(${selectedCustomer})` : ''}
            </span>
            <span style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--primary);">
              Tổng số mặt hàng: ${totalDisplayItemsCount}
            </span>
          </div>

          <div class="report-filter-wrapper">

            <!-- HÀNG 1 MOBILE: TỪ NGÀY & ĐẾN NGÀY -->
            <div class="report-filter-row">
              <div class="report-filter-item" style="display: flex; align-items: center; gap: 6px;">
                <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; white-space: nowrap;">TỪ NGÀY:</label>
                <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${selectedFromDate}" onchange="state.reportSalesFromDate=this.value; state.reportSalesLimit=40; state.page=1; render();">
              </div>

              <div class="report-filter-item" style="display: flex; align-items: center; gap: 6px;">
                <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; white-space: nowrap;">ĐẾN NGÀY:</label>
                <input type="date" class="form-input" style="width: 125px; padding: 4px 6px; font-size: 12px; height: 38px; box-sizing: border-box;" value="${selectedToDate}" onchange="state.reportSalesToDate=this.value; state.reportSalesLimit=40; state.page=1; render();">
              </div>
            </div>

            <!-- HÀNG 2 MOBILE: LOẠI BÁO CÁO & KHÁCH HÀNG -->
            <div class="report-filter-row">
              <div class="report-filter-item" style="display: flex; align-items: center; gap: 6px;">
                <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; white-space: nowrap;">LOẠI BÁO CÁO:</label>
                <select class="form-select" style="height: 38px; font-size: 12px; box-sizing: border-box;" onchange="state.reportType=this.value; state.reportSalesLimit=40; state.page=1; render();">
                  <option value="summary" ${reportType === 'summary' ? 'selected' : ''}>Báo cáo tổng hợp</option>
                  <option value="detail" ${reportType === 'detail' ? 'selected' : ''}>Báo cáo chi tiết</option>
                </select>
              </div>

              <div class="report-filter-item" style="display: flex; align-items: center; gap: 6px;">
                <label style="font-family: var(--font-dm-mono); font-size: 10px; color: var(--muted-foreground); text-transform: uppercase; white-space: nowrap;">KHÁCH HÀNG:</label>
                <select class="form-select" style="height: 38px; font-size: 12px; box-sizing: border-box;" onchange="state.reportSalesCustomer=this.value; state.reportSalesLimit=40; state.page=1; render();">
                  <option value="">-- Tất cả khách hàng --</option>
                  ${customerSelectOptions}
                </select>
              </div>
            </div>

            <!-- HÀNG 3 MOBILE: NÚT XUẤT PDF SÁT LỀ TRÁI / TRÊN PC XẾP CÙNG HÀNG THẲNG LỀ CÁC Ô FILTER -->
            <div class="report-pdf-btn-container">
              <button 
                type="button" 
                class="btn-primary" 
                onclick="exportSalesReportToPDF()" 
                ${(reportType === 'detail' && !selectedCustomer) ? 'disabled style="height: 38px; box-sizing: border-box; background: #e11d48; color: #ffffff; padding: 0 12px; font-size: 12px; opacity: 0.5; cursor: not-allowed; display: inline-flex; align-items: center; gap: 4px; border: none; border-radius: 2px; white-space: nowrap;"' : 'style="height: 38px; box-sizing: border-box; background: #e11d48; color: #ffffff; padding: 0 12px; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; border: none; border-radius: 2px; white-space: nowrap;"'}
              >
                Xuất PDF
              </button>
            </div>

          </div>

        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border); background: #232730;">
              ${detailHeaders}
            </tr>
          </thead>
          <tbody>
            ${detailRowsHtml}
          </tbody>
        </table>

        ${reportType === 'detail' && selectedCustomer ? `
          <!-- KHU VỰC SENTINEL LAZY LOADING -->
          <div id="sales-report-lazy-sentinel" style="padding: 16px; text-align: center; font-family: var(--font-dm-mono); font-size: 12px; color: var(--muted-foreground); background: var(--card); border-top: 1px solid var(--border);">
            ${(state.reportSalesLimit < totalDisplayItemsCount)
        ? `⏳ Đang hiển thị ${Math.min(state.reportSalesLimit, totalDisplayItemsCount)} / ${totalDisplayItemsCount} mục. Cuộn xuống để tải thêm...`
        : `✔ Đã hiển thị toàn bộ ${totalDisplayItemsCount} mục.`}
          </div>
        ` : ''}
      </div>

      <!-- THANH ĐIỀU HƯỚNG PHÂN TRANG (CHỈ HIỂN THỊ TRONG BÁO CÁO TỔNG HỢP) -->
      ${reportType === 'summary' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--card); border: 1px solid var(--border); flex-wrap: wrap; gap: 10px;">
          <span style="font-family: var(--font-dm-mono); font-size: 11px; color: var(--muted-foreground);">
            Hiển thị ${totalDisplayItemsCount === 0 ? 0 : ((state.page - 1) * state.pageSize) + 1} - ${Math.min(state.page * state.pageSize, totalDisplayItemsCount)} / Tổng ${totalDisplayItemsCount} mục
          </span>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button ${state.page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page--; render();">❮ Trước</button>
            <span style="font-family: var(--font-dm-mono); font-size: 11px; padding: 0 8px; color: var(--foreground);">Trang ${state.page} / ${Math.ceil(totalDisplayItemsCount / state.pageSize) || 1}</span>
            <button ${state.page >= (Math.ceil(totalDisplayItemsCount / state.pageSize) || 1) ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''} class="btn-action" onclick="state.page++; render();">Sau ❯</button>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // KÍCH HOẠT LAZY LOADING CHO BÁO CÁO CHI TIẾT
  if (reportType === 'detail' && selectedCustomer) {
    setTimeout(() => {
      const sentinel = document.getElementById('sales-report-lazy-sentinel');
      if (sentinel && state.reportSalesLimit < totalDisplayItemsCount) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            state.reportSalesLimit += 30;
            render();
          }
        }, { threshold: 0.1 });

        observer.observe(sentinel);
      }
    }, 100);
  }

  new Chart(document.getElementById('chart-sales').getContext('2d'), {
    type: 'line',
    data: {
      labels: salesDataReal.map(d => d.month),
      datasets: [
        { yAxisID: 'yRev', label: 'Doanh thu', data: salesDataReal.map(d => d.revenue), borderColor: '#f0a030', tension: 0.3 },
        { yAxisID: 'yOrd', label: 'Đơn hàng', data: salesDataReal.map(d => d.orders), borderColor: '#60a5fa', tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        yRev: { position: 'left', grid: { color: '#252a33' } },
        yOrd: { position: 'right', grid: { drawOnChartArea: false } },
        x: { grid: { color: '#252a33' } }
      }
    }
  });
}

function getAddLineButton(moduleName, isDetailsDisabled, position) {
  if (state.mode === 'view' || isDetailsDisabled) return '';

  const isMobile = window.innerWidth <= 768;

  if (position === 'header' && !isMobile) return '';
  if (position === 'footer' && isMobile) return '';

  // SỬA: Đặt width: 100% để lấp đầy container 90px phía ngoài
  const buttonStyle = position === 'footer'
    ? 'width: 100%; height: 36px; padding: 0 4px; justify-content: center; box-sizing: border-box; font-size: 13px;'
    : '';

  return `
    <button type="button" class="btn-action btn-add-line-${position}" onclick="addLineItem('${moduleName}')" style="display: inline-flex; align-items: center; gap: 4px; ${buttonStyle}">
      ${Icons.plus} Thêm dòng
    </button>
  `;
}

function getSortedMaterialsForOrder(customerName, orderDateStr) {
  const materials = JSON.parse(JSON.stringify(db.materials || []));
  const currentCust = (customerName || '').trim().toLowerCase();
  const currentDate = orderDateStr || getTodayDateStr();

  // Hàm bổ trợ so sánh mã SKU tăng dần
  const sortBySkuAsc = (a, b) => (a.id || '').localeCompare(b.id || '', undefined, { numeric: true, sensitivity: 'base' });

  // 1. Tìm Báo giá có trạng thái "Duyệt" và còn hiệu lực của Khách hàng
  let activeQuotation = null;
  if (currentCust) {
    activeQuotation = (db.quotations || [])
      .filter(q => {
        if (!q || !q.customer) return false;
        if (q.customer.trim().toLowerCase() !== currentCust) return false;

        const status = (q.status || '').toLowerCase();
        const isAccepted = ['accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status);
        if (!isAccepted) return false;

        const vBegin = q.validbegin || q.validBegin || q.date || '';
        const vUntil = q.validUntil || q.validuntil || '';

        if (vBegin && vUntil) {
          return currentDate >= vBegin && currentDate <= vUntil;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  }

  // 2. Trường hợp KHÔNG có báo giá hợp lệ -> Trả về danh sách sản phẩm gốc
  if (!activeQuotation || !Array.isArray(activeQuotation.lineItems) || activeQuotation.lineItems.length === 0) {
    return materials.sort(sortBySkuAsc);
  }

  // 3. Trường hợp CÓ báo giá hợp lệ: Map đơn giá từ Báo Giá vào Sản phẩm
  const quoteItemMap = {};
  activeQuotation.lineItems.forEach(item => {
    const sku = (item.sku || '').trim().toLowerCase();
    const name = (item.name || '').trim().toLowerCase();
    const price = (item.unitPrice !== undefined && item.unitPrice !== null) ? Number(item.unitPrice) : 0;

    if (sku) quoteItemMap[`sku:${sku}`] = price;
    if (name) quoteItemMap[`name:${name}`] = price;
  });

  const inQuotationList = [];
  const outQuotationList = [];

  materials.forEach(m => {
    const matSku = (m.id || '').trim().toLowerCase();
    const matName = (m.name || '').trim().toLowerCase();

    const hasInQuote = (matSku && quoteItemMap[`sku:${matSku}`] !== undefined) ||
      (matName && quoteItemMap[`name:${matName}`] !== undefined);

    if (hasInQuote) {
      // LẤY ĐƠN GIÁ ĐANG KHAI BÁO TRONG BÁO GIÁ ĐỂ GHI ĐÈ GIÁ DANH MỤC
      const quotedPrice = (matSku && quoteItemMap[`sku:${matSku}`] !== undefined)
        ? quoteItemMap[`sku:${matSku}`]
        : quoteItemMap[`name:${matName}`];

      m.price = quotedPrice;
      m.cost = quotedPrice; // Đảm bảo Datalist lấy đúng giá Báo giá (VD: 34.000 đ)
      m.isQuoted = true;    // Đánh dấu thẻ "★ Báo giá"

      inQuotationList.push(m);
    } else {
      outQuotationList.push(m);
    }
  });

  // Sắp xếp từng nhóm theo SKU tăng dần
  inQuotationList.sort(sortBySkuAsc);
  outQuotationList.sort(sortBySkuAsc);

  // Ghép nhóm trong Báo giá (mang giá Báo giá) lên trước, các mặt hàng khác phía sau
  return [...inQuotationList, ...outQuotationList];
}