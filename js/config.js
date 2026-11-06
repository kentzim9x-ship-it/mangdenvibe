// ==========================================
// 1. CẤU HÌNH, STATE & GIAO DIỆN CƠ BẢN
// ==========================================

const BASE_PATH = '/mangdenvibe'; // Đường dẫn gốc trên GitHub Pages

function getResponsivePageSize() {
  return window.innerWidth <= 768 ? 7 : 15;
}

// STATE MANAGEMENT
let state = {
  view: 'dashboard',
  mode: 'list',
  filter: 'all',
  search: '',
  formData: null,
  page: 1,        // Trang hiện tại
  pageSize: getResponsivePageSize()    // Số lượng bản ghi trên mỗi trang
};

const viewMeta = {
  dashboard: { tag: 'TỔNG QUAN', title: 'Tổng Quan' },
  materials: { tag: 'DỮ LIỆU DANH MỤC', title: 'Danh Mục Hàng Hóa' },
  customers: { tag: 'DỮ LIỆU DANH MỤC', title: 'Danh Sách Khách Hàng' },
  warehouses: { tag: 'DỮ LIỆU DANH MỤC', title: 'Danh Sách Kho Hàng' },
  quotations: { tag: 'GIAO DỊCH', title: 'Bảng Báo Giá' },
  'sales-orders': { tag: 'GIAO DỊCH', title: 'Đơn Bán Hàng' },
  returns: { tag: 'GIAO DỊCH', title: 'Nhận Hàng Trả Lại' },
  grn: { tag: 'GIAO DỊCH', title: 'Phiếu Nhập Kho' },
  'report-inventory': { tag: 'BÁO CÁO', title: 'Báo Cáo Tồn Kho' },
  'report-sales': { tag: 'BÁO CÁO', title: 'Báo Cáo Bán Hàng' },
};

const Icons = {
  home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  view: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="3"/><path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z"/></svg>`,
  edit: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" /></svg>`,
  trash: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4h10M5 4V2h4v2M6 7v4M8 7v4M3 4l1 8h6l1-8" /></svg>`,
  plus: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2"><line x1="6.5" y1="1" x2="6.5" y2="12" /><line x1="1" y1="6.5" x2="12" y2="6.5" /></svg>`,
  back: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2L4 7l5 5" /></svg>`,
  search: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6.5" cy="6.5" r="4.5" /><line x1="10" y1="10" x2="14" y2="14" /></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
};

// Tạo lớp Overlay để bấm ra ngoài đóng Menu
const overlayEl = document.createElement('div');
overlayEl.className = 'mobile-overlay';
overlayEl.onclick = toggleMobileMenu;
document.body.appendChild(overlayEl);

function initMobileOverlay() {
  if (overlayEl || !document.body) return;
  overlayEl = document.createElement('div');
  overlayEl.className = 'mobile-overlay';
  overlayEl.onclick = toggleMobileMenu;
  document.body.appendChild(overlayEl);
}

function toggleMobileMenu() {
  if (!overlayEl) initMobileOverlay();
  const isMenuOpen = document.body.classList.toggle('mobile-menu-open');
  if (overlayEl) {
    if (isMenuOpen) {
      overlayEl.classList.add('active');
    } else {
      overlayEl.classList.remove('active');
    }
  }
}

// ==========================================
// 2. KẾT NỐI DB SUPABASE & REALTIME STOCK
// ==========================================

// Supabase Client Initialization
const SUPABASE_URL = 'https://ezwqfgqgcbvfsuizqvev.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ChwXzrCOxWNf5OxgCCiNOA_U8Drmc4j';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Bổ sung users vào db toàn cục
let db = {
  materials: [],
  customers: [],
  warehouses: [],
  quotations: [],
  orders: [],
  returns: [],
  grns: [],
  users: [] // <--- Thêm mảng users
};

async function fetchDataFromSupabase() {
  try {
    const [custRes, matRes, whRes, invRes, quoRes, ordRes, retRes, grnRes, userRes] = await Promise.all([
      supabaseClient.from('customers').select('*').order('id', { ascending: false }),
      supabaseClient.from('materials').select('*').order('id', { ascending: false }),
      supabaseClient.from('warehouses').select('*'),
      supabaseClient.from('inventory').select('*'),
      supabaseClient.from('quotations').select('*'),
      supabaseClient.from('orders').select('*'),
      supabaseClient.from('returns').select('*'),
      supabaseClient.from('grns').select('*'),
      supabaseClient.from('userinfo').select('*') // <--- Lấy bảng userinfo
    ]);

    db.customers = custRes.data || [];
    db.materials = matRes.data || [];
    db.warehouses = whRes.data || [];
    db.inventory = invRes.data || [];
    db.users = userRes.data || [];

    db.quotations = (quoRes.data || []).map(q => ({
      ...q,
      date: q.date ? String(q.date).split('T')[0] : '',
      validbegin: (q.validbegin || q.validBegin) ? String(q.validbegin || q.validBegin).split('T')[0] : '',
      validUntil: (q.validUntil || q.validuntil) ? String(q.validUntil || q.validuntil).split('T')[0] : '',
      lineItems: Array.isArray(q.lineItems || q.lineitems) ? (q.lineItems || q.lineitems) : []
    })).sort(sortDescById);

    db.orders = (ordRes.data || []).map(o => ({
      ...o,
      date: o.date ? String(o.date).split('T')[0] : '',
      quotationId: o.quotation_id || o.quotationId || o.quotationid || null,
      warehouseCode: o.warehouse_code || o.warehouseCode || o.warehouse || '',
      lineItems: Array.isArray(o.lineItems || o.lineitems) ? (o.lineItems || o.lineitems) : []
    })).sort(sortDescById);

    db.returns = (retRes.data || []).map(r => ({
      ...r,
      date: r.date ? String(r.date).split('T')[0] : '',
      warehouseCode: r.warehouse_code || r.warehouseCode || '',
      orderId: r.order_id || r.orderId || '',
      notes: r.notes || '',
      lineItems: Array.isArray(r.lineItems || r.lineitems) ? (r.lineItems || r.lineitems) : []
    })).sort(sortDescById);

    db.grns = (grnRes.data || []).map(g => {
      let parsedItems = [];
      try {
        if (Array.isArray(g.lineitems || g.lineItems)) {
          parsedItems = g.lineitems || g.lineItems;
        } else if (typeof (g.lineitems || g.lineItems) === 'string') {
          parsedItems = JSON.parse(g.lineitems || g.lineItems);
        }
      } catch (e) {
        parsedItems = [];
      }

      return {
        ...g,
        supplier: g.supplier || '',
        warehouseCode: g.warehousecode || g.warehouseCode || '',
        warehousecode: g.warehousecode || g.warehouseCode || '',
        date: g.date ? String(g.date).split('T')[0] : '',
        status: g.status || 'Đã nhận',
        notes: g.notes || '',
        totalValue: g.totalvalue ?? g.totalValue ?? 0,
        totalvalue: g.totalvalue ?? g.totalValue ?? 0,
        lineItems: parsedItems,
        lineitems: parsedItems
      };
    }).sort(sortDescById);

  } catch (err) {
    console.error('Lỗi khi tải dữ liệu từ Supabase:', err);
  }
}

function syncRealtimeStockToSupabase(sku, warehouseCode, realStock) {
  if (!sku || !warehouseCode) return;
  setTimeout(async () => {
    try {
      const invIndex = (db.inventory || []).findIndex(i =>
        (i.sku === sku || i.material_id === sku) &&
        (i.warehouse_code === warehouseCode || i.warehouse_id === warehouseCode || i.warehouseCode === warehouseCode)
      );

      if (invIndex !== -1) {
        db.inventory[invIndex].ton_thuc_te = realStock;
        await supabaseClient
          .from('inventory')
          .update({ ton_thuc_te: realStock })
          .eq('id', db.inventory[invIndex].id);
      } else {
        const newRecord = {
          sku: sku,
          warehouse_code: warehouseCode,
          ton_thuc_te: realStock,
          stock: 0
        };
        const { data, error } = await supabaseClient.from('inventory').insert([newRecord]).select();
        if (!error && data && data.length > 0) {
          db.inventory.push(data[0]);
        }
      }
    } catch (err) {
      console.error('Lỗi cập nhật ton_thuc_te:', err);
    }
  }, 0);
}

let stockMemoCache = {};
let isStockCacheValid = false;

function invalidateStockCache() {
  isStockCacheValid = false;
  stockMemoCache = {};
}

function calculateRealtimeStock(sku, warehouseCode, currentDocId = null) {
  if (!sku) return 0;

  // Trả về dữ liệu đệm nếu cache còn hiệu lực
  const cacheKey = `${sku}_${warehouseCode || 'all'}_${currentDocId || 'none'}`;
  if (isStockCacheValid && stockMemoCache[cacheKey] !== undefined) {
    return stockMemoCache[cacheKey];
  }

  let initialStock = 0;
  if (warehouseCode && db.inventory && db.inventory.length > 0) {
    const inv = db.inventory.find(i =>
      (i.sku === sku || i.material_id === sku) &&
      (i.warehouse_code === warehouseCode || i.warehouse_id === warehouseCode || i.warehouseCode === warehouseCode)
    );
    if (inv) {
      initialStock = Number(inv.stock ?? inv.qty ?? inv.quantity ?? 0);
    }
  } else {
    const mat = db.materials.find(m => m.id === sku);
    if (mat) initialStock = Number(mat.stock || 0);
  }

  let totalGRN = 0;
  (db.grns || []).forEach(g => {
    if (currentDocId && String(g.id) === String(currentDocId)) return;
    const status = (g.status || '').toLowerCase();
    const gWh = g.warehouseCode || g.warehousecode || g.warehouse_code || '';

    if (gWh === warehouseCode && ['verified', 'received', 'đã nhận', 'đã xác minh'].includes(status)) {
      (g.lineItems || g.lineitems || []).forEach(item => {
        if (item.sku === sku) {
          totalGRN += Number(item.receivedQty || item.qtyImport || item.qty || 0);
        }
      });
    }
  });

  let totalOrders = 0;
  (db.orders || []).forEach(o => {
    if (currentDocId && String(o.id) === String(currentDocId)) return;
    const status = (o.status || '').toLowerCase();
    const oWh = o.warehouseCode || o.warehousecode || o.warehouse_code || '';

    if (oWh === warehouseCode && ['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status)) {
      (o.lineItems || o.lineitems || []).forEach(item => {
        if (item.sku === sku) {
          totalOrders += Number(item.qty || 0);
        }
      });
    }
  });

  let totalReturns = 0;
  (db.returns || []).forEach(r => {
    if (currentDocId && String(r.id) === String(currentDocId)) return;
    const status = (r.status || '').toLowerCase();
    const rWh = r.warehouseCode || r.warehousecode || r.warehouse_code || '';

    if (rWh === warehouseCode && ['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status)) {
      (r.lineItems || r.lineitems || []).forEach(item => {
        if (item.sku === sku) {
          totalReturns += Number(item.qtyReturned || item.qty || 0);
        }
      });
    }
  });

  const realtimeStock = Number((initialStock + totalGRN - totalOrders - totalReturns).toFixed(2));

  if (warehouseCode) {
    syncRealtimeStockToSupabase(sku, warehouseCode, realtimeStock);
  }

  // LƯU KẾT QUẢ VÀO CACHE
  stockMemoCache[cacheKey] = realtimeStock;
  isStockCacheValid = true;

  return realtimeStock;
}

// ==========================================
// 4. TIỆN ÍCH (HELPERS) & FORMATTER
// ==========================================

function sortDescById(a, b) {
  return String(b.id || '').localeCompare(String(a.id || ''), undefined, { numeric: true, sensitivity: 'base' });
}

// Hàm chuyển đổi từ user_id sang fullname
function getUserFullName(userId) {
  if (!userId) return '—';
  const user = (db.users || []).find(u => String(u.id) === String(userId) || String(u.username) === String(userId));
  return user ? (user.fullname || user.username || userId) : userId;
}

// Hàm hỗ trợ định dạng ngày VN (DD/MM/YYYY) nếu ngày lưu dạng YYYY-MM-DD
function fmtDateStr(dateStr) {
  if (!dateStr) return '—';
  if (dateStr.includes('T')) dateStr = dateStr.split('T')[0];
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

// Hàm hỗ trợ cắt bỏ giây nếu cần (HH:mm:ss -> HH:mm)
function fmtTimeStr(timeStr) {
  if (!timeStr) return '—';
  return String(timeStr).substring(0, 5);
}

// ==========================================
// 4. TIỆN ÍCH (HELPERS) & FORMATTER
// ==========================================

// Hàm tiện ích lấy ngày đầu tiên & ngày cuối cùng của tháng hiện tại (định dạng YYYY-MM-DD)
function getDefaultDateRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const formatDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return {
    fromDate: formatDate(firstDay),
    toDate: formatDate(lastDay)
  };
}

// Khởi tạo ngày mặc định trong state nếu chưa có
if (!state.fromDate || !state.toDate) {
  const defaultDates = getDefaultDateRange();
  state.fromDate = state.fromDate || defaultDates.fromDate;
  state.toDate = state.toDate || defaultDates.toDate;
}

// Component HTML hiển thị 2 ô chọn ngày ở giữa
function getDateRangeFilterUI() {
  return `
    <div style="display: flex; align-items: center; gap: 8px; font-family: var(--font-dm-mono, monospace); font-size: 12px; color: var(--muted-foreground);">
      <span>Từ:</span>
      <input 
        type="date" 
        value="${state.fromDate}" 
        onchange="state.fromDate = this.value; state.page = 1; render();"
        style="border: 1px solid var(--border); background: var(--card); color: var(--foreground); padding: 6px 10px; font-family: var(--font-jost); font-size: 13px; outline: none; border-radius: 2px;"
      />
      <span>đến:</span>
      <input 
        type="date" 
        value="${state.toDate}" 
        onchange="state.toDate = this.value; state.page = 1; render();"
        style="border: 1px solid var(--border); background: var(--card); color: var(--foreground); padding: 6px 10px; font-family: var(--font-jost); font-size: 13px; outline: none; border-radius: 2px;"
      />
    </div>
  `;
}

function getBadgeClass(status) {
  const s = String(status || '').toLowerCase().trim();
  const map = {
    // 🟢 XANH LÁ (Thành công / Hoàn thành / Duyệt / Đã xác minh / Hoạt động)
    'approved': 'badge-emerald', 'đã duyệt': 'badge-emerald',
    'accepted': 'badge-emerald', 'duyệt': 'badge-emerald', 'đã chấp nhận': 'badge-emerald',
    'verified': 'badge-emerald', 'đã xác minh': 'badge-emerald',
    'active': 'badge-emerald', 'hoạt động': 'badge-emerald', 'đang hoạt động': 'badge-emerald',
    'ok': 'badge-emerald', 'đủ hàng': 'badge-emerald', 'còn hàng': 'badge-emerald',
    'Còn Hàng': 'badge-emerald',

    // 🟡 VÀNG / CAM (Đang xử lý / Chờ duyệt / Đã nhận / Sắp hết)
    'processing': 'badge-amber', 'đang xử lý': 'badge-amber',
    'received': 'badge-amber', 'đã nhận': 'badge-amber',
    'maintenance': 'badge-amber', 'bảo trì': 'badge-amber',
    'low': 'badge-amber', 'sắp hết': 'badge-amber',
    'Cho Thuê': 'badge-amber', 'rent': 'badge-amber',

    // 🔘 XÁM (Ngừng hoạt động / Bản nháp)
    'inactive': 'badge-zinc', 'ngừng hoạt động': 'badge-zinc',
    'draft': 'badge-zinc', 'bản nháp': 'badge-zinc',
    'pending': 'badge-zinc', 'chờ duyệt': 'badge-zinc', 'chờ xử lý': 'badge-zinc',

    // 🔴 ĐỎ (Đã hủy / Từ chối / Tạm khóa / Hết hạn)
    'cancelled': 'badge-red', 'đã hủy': 'badge-red',
    'suspended': 'badge-red', 'tạm khóa': 'badge-red',
    'expired': 'badge-red', 'hết hạn': 'badge-red',
    'closed': 'badge-red', 'đóng cửa': 'badge-red',
    'critical': 'badge-red', 'nguy cấp': 'badge-red',
    'out': 'badge-red', 'hết hàng': 'badge-red',


    // 🔵 XANH DƯƠNG / BLUE
    'processed': 'badge-blue', 'Hoàn thành': 'badge-blue',
    'completed': 'badge-blue', 'Hoàn thành': 'badge-blue',

    // 🟪 XANH CHÀM / INDIGO
    'rejected': 'badge-indigo', 'từ chối': 'badge-indigo'
  };
  return map[s] || 'badge-zinc';
}

function getStatusLabel(status) {
  const s = String(status || '').toLowerCase().trim();
  const map = {
    // Đơn hàng bán & Báo giá
    'completed': 'Hoàn thành',
    'hoàn thành': 'Hoàn thành',
    'accepted': 'Duyệt',
    'approved': 'Duyệt',
    'duyệt': 'Duyệt',
    'pending': 'Chờ duyệt',
    'chờ duyệt': 'Chờ duyệt',
    'processing': 'Đang xử lý',
    'cancelled': 'Đã hủy',
    'đã hủy': 'Đã hủy',
    'rejected': 'Từ chối',
    'expired': 'Hết hạn',
    'draft': 'Bản nháp',

    // Nhận hàng bán trả lại
    'processed': 'Hoàn thành',

    // Phiếu nhập kho (GRN)
    'received': 'Đã nhận',
    'verified': 'Đã xác minh',

    // Khách hàng & Kho hàng
    'active': 'Đang hoạt động',
    'inactive': 'Ngừng hoạt động',
    'suspended': 'Tạm khóa',
    'maintenance': 'Bảo trì',
    'closed': 'Đóng cửa',

    // Vật tư & Tồn kho
    'ok': 'Còn Hàng',
    'còn hàng': 'Còn hàng',
    'low': 'Sắp hết',
    'sắp hết': 'Sắp hết',
    'cho thuê': 'Cho Thuê',
    'rent': 'Cho Thuê',
    'out': 'Hết hàng',
    'hết hàng': 'Hết hàng'
  };

  return map[s] || (status ? String(status).toUpperCase() : '—');
}

function getWarehouseStatusLabel(status) {
  const map = { 'active': 'HOẠT ĐỘNG', 'maintenance': 'BẢO TRÌ', 'closed': 'ĐÓNG CỬA' };
  return map[status?.toLowerCase()] || (status ? status.toUpperCase() : 'HOẠT ĐỘNG');
}

function getBreadcrumb(parentText, currentText, targetView) {
  return `
    <div class="breadcrumb" style="margin-bottom: 20px; font-size: 14px; font-weight: 600; text-transform: uppercase;">
      <span 
        onclick="navigate('${targetView}', 'list')" 
        style="cursor: pointer; color: var(--muted-color, #666); margin-right: 8px;">
        &lt; ${parentText}
      </span>
      <span style="color: #ccc; margin-right: 8px;">/</span>
      <span style="color: var(--text-color, #333);">${currentText}</span>
    </div>
  `;
}

function getFilterBar(options) {
  const buttonsHtml = options.map(([val, label]) => `
    <button onclick="state.filter='${val}'; render();" style="padding: 6px 14px; font-family: var(--font-dm-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; background: ${state.filter === val ? 'var(--primary)' : 'transparent'}; color: ${state.filter === val ? 'var(--primary-foreground)' : 'var(--muted-foreground)'}; border: none; cursor: pointer; transition: all 0.15s;">${label}</button>
  `).join('');

  return `
    <div style="display: flex; gap: 1px; background: var(--muted); width: fit-content; max-width: 100%; overflow-x: auto;">
      ${buttonsHtml}
    </div>
  `;
}

function generateAutoId(module) {
  const collection = db[module === 'sales-orders' ? 'orders' : (module === 'grn' ? 'grns' : module)] || [];
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');

  // 1. SKU: SKU-YYMM0001
  if (module === 'materials') {
    const prefix = `SKU-${yy}${mm}`;
    const maxNum = collection.reduce((m, x) => {
      const currentId = String(x.id || x.code || '');
      const regex = new RegExp(`^${prefix}(\\d+)`, 'i');
      const match = currentId.match(regex);
      return match ? Math.max(m, parseInt(match[1], 10)) : m;
    }, 0);
    return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
  }

  // 2. Khách hàng: CUS-YYMM0001
  if (module === 'customers') {
    const prefix = `CUS-${yy}${mm}`;
    const maxNum = collection.reduce((m, x) => {
      const currentId = String(x.id || x.code || '');
      const regex = new RegExp(`^${prefix}(\\d+)`, 'i');
      const match = currentId.match(regex);
      return match ? Math.max(m, parseInt(match[1], 10)) : m;
    }, 0);
    return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
  }

  // 3. Kho hàng: WH-01
  if (module === 'warehouses') {
    const maxNum = collection.reduce((m, x) => {
      const match = ((x.code || x.id) || '').match(/(?:WH|KHO)-(\d+)/i);
      return match ? Math.max(m, parseInt(match[1], 10)) : m;
    }, 0);
    return `WH-${String(maxNum + 1).padStart(2, '0')}`;
  }

  // 4. Báo giá: BBG-YYMM0001
  if (module === 'quotations') {
    const prefix = `BBG-${yy}${mm}`;
    const maxNum = collection.reduce((m, x) => {
      if (!x.id) return m;
      const regex = new RegExp(`^${prefix}-?(\\d+)`, 'i');
      const match = x.id.match(regex);
      return match ? Math.max(m, parseInt(match[1], 10)) : m;
    }, 0);
    return `${prefix}-${String(maxNum + 1).padStart(4, '0')}`;
  }

  // 5. Đơn bán hàng: DHB-YYMM0001
  if (module === 'sales-orders') {
    const prefix = `DHB-${yy}${mm}`;
    const maxNum = collection.reduce((m, x) => {
      if (!x.id) return m;
      const regex = new RegExp(`^${prefix}-?(\\d+)`, 'i');
      const match = x.id.match(regex);
      return match ? Math.max(m, parseInt(match[1], 10)) : m;
    }, 0);
    return `${prefix}-${String(maxNum + 1).padStart(4, '0')}`;
  }

  // 6. Nhận trả lại: HBTL-YYMM0001
  if (module === 'returns') {
    const prefix = `HBTL-${yy}${mm}`;
    const maxNum = collection.reduce((m, x) => {
      if (!x.id) return m;
      const regex = new RegExp(`^${prefix}-?(\\d+)`, 'i');
      const match = x.id.match(regex);
      return match ? Math.max(m, parseInt(match[1], 10)) : m;
    }, 0);
    return `${prefix}-${String(maxNum + 1).padStart(4, '0')}`;
  }

  // 7. Phiếu nhập kho: PNK-YYMM0001
  if (module === 'grn') {
    const prefix = `PNK-${yy}${mm}`;
    const maxNum = collection.reduce((m, x) => {
      const currentId = String(x.id || '');
      const regex = new RegExp(`^${prefix}-?(\\d+)`, 'i');
      const match = currentId.match(regex);
      return match ? Math.max(m, parseInt(match[1], 10)) : m;
    }, 0);
    return `${prefix}-${String(maxNum + 1).padStart(4, '0')}`;
  }
}

function getMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const firstDay = `${year}-${month}-01`;
  const lastDayNum = new Date(year, now.getMonth() + 1, 0).getDate();
  const lastDay = `${year}-${month}-${String(lastDayNum).padStart(2, '0')}`;

  return { firstDay, lastDay };
}

function parseDateParts(dateStr) {
  let dayStr = '02', monthStr = '10', yearStr = '2026';
  if (dateStr) {
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        yearStr = parts[0];
        monthStr = parts[1];
        dayStr = parts[2];
      }
    } else if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        dayStr = parts[0].padStart(2, '0');
        monthStr = parts[1].padStart(2, '0');
        yearStr = parts[2];
      }
    }
  } else {
    const today = new Date();
    dayStr = String(today.getDate()).padStart(2, '0');
    monthStr = String(today.getMonth() + 1).padStart(2, '0');
    yearStr = String(today.getFullYear());
  }
  return { dayStr, monthStr, yearStr };
}

function getCustomerAddress(customerNameOrId) {
  if (!customerNameOrId) return '—';
  const cust = (db.customers || []).find(c =>
    (c.name && c.name.trim().toLowerCase() === customerNameOrId.trim().toLowerCase()) ||
    (c.id && c.id.trim().toLowerCase() === customerNameOrId.trim().toLowerCase())
  );
  return cust ? (cust.address || cust.diachi || '—') : '—';
}

function getTodayDateStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Hàm lấy ngày đầu tiên của tháng hiện tại (Định dạng: YYYY-MM-DD)
function getFirstDayOfMonthStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

// Hàm lấy ngày cuối cùng của tháng hiện tại (Định dạng: YYYY-MM-DD)
function getLastDayOfMonthStr() {
  const now = new Date();
  // Ngày 0 của tháng tiếp theo chính là ngày cuối cùng của tháng hiện tại
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const year = lastDay.getFullYear();
  const month = String(lastDay.getMonth() + 1).padStart(2, '0');
  const day = String(lastDay.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentTimeStr() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatDateVN(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return dateStr;
}

function parseNumberInput(val) {
  if (val === null || val === undefined || val === '') return 0;
  const str = String(val).trim();
  const cleanStr = str.replace(/[^0-9-]/g, '');
  return cleanStr ? Number(cleanStr) : 0;
}

function formatVNDInput(val) {
  const num = parseNumberInput(val);
  return num ? num.toLocaleString('vi-VN') : '0';
}

function fmt(n) { return new Intl.NumberFormat('en-US').format(n); }

function fmtUSD(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);
}

function updateHeaderDate() {
  const dateElement = document.getElementById('header-date');
  if (dateElement) {
    const now = new Date();
    const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    dateElement.innerText = now.toLocaleDateString('vi-VN', options);
  }
}

function toTitleCase(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/(^|\s)\S/g, function (firstLetter) {
    return firstLetter.toUpperCase();
  });
}

function toUpperCaseStr(str) {
  if (!str) return '';
  return str.toUpperCase();
}

// ==========================================
// HÀM BỔ TRỢ: TẢI FILE EXCEL HOẶC CHIA SẺ QUA ZALO
// ==========================================
async function downloadOrShareXLSX(workbook, fileName) {
  if (typeof XLSX === 'undefined') {
    showAlert('Thư viện XLSX chưa được tải, vui lòng kiểm tra lại kết nối!', 'Lỗi');
    return;
  }

  const fullFileName = `${fileName}.xlsx`;

  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 1. DÀNH CHO MOBILE: MỞ BẢNG CHIA SẺ (ZALO / MESSENGER)
    if (isMobile && navigator.canShare) {
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const file = new File([blob], fullFileName, { type: blob.type });

      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: fullFileName,
            text: `Gửi file Excel ${fullFileName}`
          });
          return;
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') {
            console.warn('Lỗi chia sẻ file Excel:', shareErr);
          }
          return;
        }
      }
    }

    // 2. DÀNH CHO PC: TẢI TRỰC TIẾP FILE EXCEL VỀ MÁY
    XLSX.writeFile(workbook, fullFileName);

  } catch (err) {
    console.error('Lỗi khi xuất file Excel:', err);
    showAlert('Có lỗi xảy ra trong quá trình tạo file Excel!', 'Lỗi');
  }
}