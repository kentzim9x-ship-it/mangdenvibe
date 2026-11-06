// ==========================================
// 5. ĐIỀU HƯỚNG & ROUTING (NAVIGATION)
// ==========================================

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

async function navigate(view, mode = 'list', itemId = null, extraState = null) {
  if (hasUnsavedFormData() && (view !== state.view || mode === 'list')) {
    const confirmLeave = await showConfirm(
      'Bạn đang nhập dữ liệu dở dang. Nếu thoát ra, toàn bộ dữ liệu đang nhập sẽ bị mất!',
      'Cảnh báo mất dữ liệu'
    );
    if (!confirmLeave) {
      return; // Người dùng chọn "Hủy bỏ" -> Giữ nguyên ở màn hình nhập liệu
    }
  }

  // --- LƯU VỊ TRÍ CUỘN HIỆN TẠI TRƯỚC KHITHAY ĐỔI STATE ---
  const contentBox = document.getElementById('app-content');
  const currentWindowScrollY = window.scrollY;
  const currentContentScrollTop = contentBox ? contentBox.scrollTop : 0;

  // Kiểm tra xem có phải thao tác chuyển đổi View <-> Edit trên cùng một Form/ID hay không
  const isSameModule = state.view === view;
  const isSwitchingBetweenViewAndEdit = isSameModule &&
    (state.mode === 'view' || state.mode === 'edit') &&
    (mode === 'view' || mode === 'edit');

  // --- BỔ SUNG: Lưu vị trí cuộn và trạng thái danh sách trước khi rời đi ---
  if (state.mode === 'list') {
    const contentBox = document.getElementById('app-content');
    // Lấy vị trí cuộn lớn hơn giữa container và window
    const scrollPos = (contentBox && contentBox.scrollTop > 0)
      ? contentBox.scrollTop
      : window.scrollY;

    sessionStorage.setItem(`scroll_pos_${state.view}`, scrollPos);
    sessionStorage.setItem(`list_state_${state.view}`, JSON.stringify({
      page: state.page,
      filter: state.filter,
      search: state.search
    }));
  }

  if ((mode === 'add' || mode === 'edit') && !checkModulePermission(view)) {
    showAlert('Tài khoản của bạn chỉ có quyền xem, không được phép thực hiện thao tác này!', 'Cảnh báo quyền');
    mode = 'list';
  }

  if (mode === 'list') {
    const savedStateRaw = sessionStorage.getItem(`list_state_${view}`);
    if (savedStateRaw) {
      const savedState = JSON.parse(savedStateRaw);
      state.page = savedState.page || 1;
      state.filter = savedState.filter || 'all';
      state.search = savedState.search || '';
    } else {
      state.filter = 'all';
      state.search = '';
      state.page = 1;
    }
  } else {
    state.filter = 'all';
    state.search = '';
    state.page = 1;
  }

  // --- BỔ SUNG: ƯU TIÊN GHI ĐÈ BỞI EXTRA STATE (NẾU ĐƯỢC TRUYỀN VÀO) ---
  if (extraState && typeof extraState === 'object') {
    if (extraState.search !== undefined) state.search = extraState.search;
    if (extraState.filter !== undefined) state.filter = extraState.filter;
    if (extraState.page !== undefined) state.page = extraState.page;
    if (extraState.ordersFromDate !== undefined) state.ordersFromDate = extraState.ordersFromDate;
    if (extraState.ordersToDate !== undefined) state.ordersToDate = extraState.ordersToDate;
  }

  state.view = view;
  state.mode = mode;

  const meta = viewMeta[view] || { tag: 'HỆ THỐNG', title: 'NEXSTOCK' };
  const tagEl = document.getElementById('view-tag');
  const titleEl = document.getElementById('view-title');

  if (tagEl) tagEl.innerText = meta.tag;
  if (titleEl) titleEl.innerText = mode === 'list' ? meta.title : (mode === 'add' ? `Thêm ${meta.title} Mới` : (mode === 'view' ? `Xem ${meta.title}` : `Chỉnh Sửa Mục`));

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === view);
  });

  if (mode !== 'list') initFormData(view, itemId);

  // Tạo URL dạng /mangden/view/mode/id
  let targetPath = `${BASE_PATH}/${view}`;
  if (mode === 'add') targetPath += '/add';
  if (mode === 'edit' && itemId) targetPath += `/edit/${itemId}`;
  if (mode === 'view' && itemId) targetPath += `/view/${itemId}`;

  if (document.body.classList.contains('mobile-menu-open')) {
    toggleMobileMenu();
  }

  if (window.location.pathname !== targetPath) {
    window.history.pushState({ view, mode, itemId }, '', targetPath);
  }

  render();

  // --- XỬ LÝ KHÔI PHỤC VỊ TRÍ CUỘN MÀN HÌNH ---
  if (isSwitchingBetweenViewAndEdit) {
    // Nếu chuyển View <-> Edit: Giữ nguyên vị trí cuộn hiện tại của người dùng
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentWindowScrollY, behavior: 'instant' });
      const activeContentBox = document.getElementById('app-content');
      if (activeContentBox) activeContentBox.scrollTop = currentContentScrollTop;
    });
  } else if (mode === 'list') {
    // Nếu quay về danh sách: Khôi phục vị trí cuộn đã lưu trước đó của danh sách
    restoreScrollPosition(view);
  } else {
    // Nếu chuyển sang tạo mới (add) hoặc chuyển module khác: Cuộn về đầu trang
    window.scrollTo({ top: 0, behavior: 'instant' });
    const activeContentBox = document.getElementById('app-content');
    if (activeContentBox) activeContentBox.scrollTop = 0;
  }
}

async function handleRouteChange() {
  if (hasUnsavedFormData()) {
    const confirmLeave = await showConfirm(
      'Bạn đang nhập dữ liệu dở dang. Nếu quay lại, toàn bộ dữ liệu đang nhập sẽ bị mất!',
      'Cảnh báo mất dữ liệu'
    );
    if (!confirmLeave) {
      // Đẩy lại URL hiện tại để giữ người dùng ở lại trang
      let currentPath = `${BASE_PATH}/${state.view}`;
      if (state.mode === 'add') currentPath += '/add';
      if (state.mode === 'edit' && state.formData?.id) currentPath += `/edit/${state.formData.id}`;
      window.history.pushState(null, '', currentPath);
      return;
    }
  }

  let pathname = window.location.pathname;
  if (pathname.startsWith(BASE_PATH)) {
    pathname = pathname.substring(BASE_PATH.length);
  }
  pathname = pathname.replace(/^\/+|\/+$/g, '');

  // Nếu URL là /mangden/login hoặc trống
  if (pathname === 'login') {
    localStorage.removeItem('app_session'); // Mặc định đăng xuất khi truy cập URL /login
    render();
    return;
  }

  if (!pathname) {
    navigate('dashboard', 'list');
    return;
  }

  const parts = pathname.split('/');
  const view = parts[0];
  let mode = parts[1] || 'list';
  const itemId = parts[2] || null;

  if (viewMeta[view]) {
    if ((mode === 'add' || mode === 'edit') && !checkModulePermission(view)) {
      showAlert('Tài khoản của bạn chỉ có quyền xem, không được phép thực hiện thao tác này!', 'Cảnh báo quyền');
      mode = 'list';
    }

    state.view = view;
    state.mode = mode;
    state.filter = 'all';
    state.search = '';
    state.page = 1;

    // Phục hồi phân trang & từ khóa tìm kiếm nếu quay lại danh sách
    if (mode === 'list') {
      const savedStateRaw = sessionStorage.getItem(`list_state_${view}`);
      if (savedStateRaw) {
        const savedState = JSON.parse(savedStateRaw);
        state.page = savedState.page || 1;
        state.filter = savedState.filter || 'all';
        state.search = savedState.search || '';
      }
    }

    const meta = viewMeta[view];
    const tagEl = document.getElementById('view-tag');
    const titleEl = document.getElementById('view-title');

    if (tagEl) tagEl.innerText = meta.tag;
    if (titleEl) titleEl.innerText = mode === 'list' ? meta.title : (mode === 'add' ? `Thêm ${meta.title} Mới` : (mode === 'view' ? `Xem ${meta.title}` : `Chỉnh Sửa Mục`));

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });

    if (mode !== 'list') {
      initFormData(view, itemId);
    }

    render();

    if (mode === 'list') {
      restoreScrollPosition(view);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const contentBox = document.getElementById('app-content');
      if (contentBox) contentBox.scrollTop = 0;
    }
  }
}

function restoreScrollPosition(view) {
  const savedScroll = sessionStorage.getItem(`scroll_pos_${view}`);
  if (savedScroll === null) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const contentBox = document.getElementById('app-content');
    if (contentBox) contentBox.scrollTop = 0;
    return;
  }

  const targetY = parseInt(savedScroll, 10);
  const contentBox = document.getElementById('app-content');

  // Hàm thực hiện cuộn
  const doScroll = () => {
    if (contentBox) {
      contentBox.scrollTop = targetY;
    }
    window.scrollTo({ top: targetY, behavior: 'instant' });
  };

  requestAnimationFrame(() => {
    doScroll();

    const targetNode = contentBox || document.body;
    const observer = new MutationObserver((mutations, obs) => {
      doScroll();
      obs.disconnect();
      sessionStorage.removeItem(`scroll_pos_${view}`);
    });

    observer.observe(targetNode, { childList: true, subtree: true });

    setTimeout(() => {
      doScroll();
      observer.disconnect();
      sessionStorage.removeItem(`scroll_pos_${view}`);
    }, 500);
  });
}

window.addEventListener('popstate', handleRouteChange);

// ==========================================
// 6. XỬ LÝ DỮ LIỆU & FORM (DATA HANDLERS)
// ==========================================

function updateField(field, value, type = 'string') {
  if (!state.formData) state.formData = {};

  let parsedValue = value;
  if (type === 'number') {
    parsedValue = value === '' ? 0 : Number(value);
  }

  state.formData[field] = parsedValue;

  if (state.view === 'materials' && (field === 'stock' || field === 'reorder')) {
    const stock = Number(state.formData.stock || 0);
    const reorder = Number(state.formData.reorder || 0);

    if (stock <= 0) {
      state.formData.status = 'out';
    } else if (stock <= reorder) {
      state.formData.status = 'low';
    } else {
      state.formData.status = 'ok';
    }
  }
}

function updateLine(lineId, field, value, type = 'text') {
  if (!state.formData || !Array.isArray(state.formData.lineItems)) return;
  const line = state.formData.lineItems.find(l => l.lineId === lineId);
  if (!line) return;

  // 1. Cập nhật giá trị vào object line (ép kiểu số nếu là qty, unitPrice, discount, tax)
  if (['qty', 'unitPrice', 'discount', 'tax', 'qtyReturned', 'receivedQty', 'unitCost'].includes(field)) {
    const numVal = parseFloat(value);
    line[field] = isNaN(numVal) ? 0 : numVal;
  } else {
    line[field] = value;
  }

  // 2. Tính toán lại tổng tiền của từng dòng và tổng của cả đơn hàng
  let subtotal = 0, discountTotal = 0, taxTotal = 0, total = 0;

  state.formData.lineItems.forEach(l => {
    let lineTotal = 0;

    if (state.view === 'quotations' || state.view === 'sales-orders') {
      const qty = Number(l.qty) || 0;
      const price = Number(l.unitPrice) || 0;
      const disc = Number(l.discount) || 0;
      const tax = Number(l.tax) || 0;

      // Công thức: Thành tiền dòng = (Số lượng * Đơn giá * (1 - %CK)) * (1 + %Thuế)
      const lineSub = qty * price * (1 - disc / 100);
      lineTotal = lineSub * (1 + tax / 100);

      // Lưu giá trị thành tiền vào chính dòng sản phẩm
      l.total = lineTotal;

      subtotal += qty * price;
      discountTotal += qty * price * (disc / 100);
      taxTotal += lineSub * (tax / 100);
    } else if (state.view === 'returns' || state.view === 'grn') {
      const qty = Number(l.qtyReturned ?? l.receivedQty ?? l.qtyImport ?? 1) || 0;
      const price = Number(l.unitPrice ?? l.unitCost ?? 0);
      lineTotal = qty * price;
      l.total = lineTotal;
      total += lineTotal;
    }
  });

  if (state.view === 'quotations' || state.view === 'sales-orders') {
    total = subtotal - discountTotal + taxTotal;
    state.formData.subtotal = subtotal;
    state.formData.discountTotal = discountTotal;
    state.formData.tax = taxTotal;
    state.formData.total = total;
  } else if (state.view === 'returns') {
    state.formData.total = total;
  } else if (state.view === 'grn') {
    state.formData.totalValue = total;
  }

  // 3. Cập nhật trực tiếp giao diện (DOM) nhanh mà không làm mất con trỏ chuột (focus)
  const qty = Number(line.qty) || 0;
  const price = Number(line.unitPrice) || 0;
  const disc = Number(line.discount) || 0;
  const tax = Number(line.tax) || 0;
  const currentLineTotal = (qty * price * (1 - disc / 100)) * (1 + tax / 100);

  // Tìm ô hiển thị thành tiền trên dòng tương ứng
  const lineRow = document.getElementById(`line-item-row-${lineId}`) ||
    document.querySelector(`tr[data-line-id="${lineId}"]`);

  if (lineRow) {
    const totalCell = lineRow.querySelector('.line-total-val') || lineRow.querySelector('td:nth-last-child(2)');
    if (totalCell && typeof fmtUSD === 'function') {
      totalCell.innerText = fmtUSD(currentLineTotal);
    }
  } else {
    // Nếu không tìm thấy bằng Row ID, render lại giao diện để đảm bảo nhảy số chính xác
    if (typeof render === 'function') {
      render();
      return;
    }
  }

  // 4. Cập nhật lại khối Tổng tiền (Tạm tính, Chiết khấu, Tổng thuế, Tổng cộng) ở góc dưới
  const summaryDivs = document.querySelectorAll('div[style*="justify-content: space-between"]');
  summaryDivs.forEach(div => {
    const spans = div.querySelectorAll('span');
    if (spans.length >= 2) {
      const lbl = spans[0].innerText.trim().toLowerCase();
      const valSpan = spans[spans.length - 1];

      if (typeof fmtUSD === 'function') {
        if (lbl === 'tạm tính') valSpan.innerText = fmtUSD(subtotal);
        else if (lbl === 'chiết khấu') valSpan.innerText = '-' + fmtUSD(discountTotal);
        else if (lbl === 'tổng thuế') valSpan.innerText = fmtUSD(taxTotal);
        else if (lbl === 'tổng cộng' || lbl === 'tổng hoàn tiền' || lbl === 'tổng giá trị') {
          valSpan.innerText = fmtUSD(total);
        }
      }
    }
  });
}

function handleLineItemKeyDown(e, module, lineIndex, fieldName) {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.stopPropagation();

    const targetInput = e.target;
    if (targetInput && state.formData && Array.isArray(state.formData.lineItems)) {
      const currentLine = state.formData.lineItems[lineIndex];
      if (currentLine && fieldName) {
        if (fieldName === 'unitPrice' || fieldName === 'unitCost') {
          currentLine[fieldName] = parseNumberInput(targetInput.value);
        } else if (['qty', 'qtyReturned', 'receivedQty', 'discount', 'tax'].includes(fieldName)) {
          currentLine[fieldName] = Number(targetInput.value) || 0;
        } else {
          currentLine[fieldName] = targetInput.value;
        }
      }
    }

    const lineItems = state.formData?.lineItems || [];
    const isLastRow = lineIndex === lineItems.length - 1;

    const fieldMapping = {
      'quotations': { name: 'name', qty: 'qty', price: 'unitPrice' },
      'sales-orders': { name: 'name', qty: 'qty', price: 'unitPrice' },
      'returns': { name: 'name', qty: 'qtyReturned', price: 'unitPrice' },
      'grn': { name: 'name', qty: 'receivedQty', price: 'unitCost' }
    };

    const currentMap = fieldMapping[module] || { name: 'name', qty: 'qty', price: 'unitPrice' };
    const firstLineId = lineItems[0]?.lineId;

    if (isLastRow) {
      if (fieldName === currentMap.name) {
        setTimeout(() => {
          const firstQtyInput = document.getElementById(`line-item-${firstLineId}-${currentMap.qty}`);
          if (firstQtyInput) {
            firstQtyInput.focus();
            if (typeof firstQtyInput.select === 'function') firstQtyInput.select();
          }
        }, 50);
      } else if (fieldName === currentMap.qty) {
        setTimeout(() => {
          const firstPriceInput = document.getElementById(`line-item-${firstLineId}-${currentMap.price}`);
          if (firstPriceInput) {
            firstPriceInput.focus();
            if (typeof firstPriceInput.select === 'function') firstPriceInput.select();
          }
        }, 50);
      } else {
        targetInput.blur();
      }
    } else {
      const nextLineId = lineItems[lineIndex + 1]?.lineId;
      if (nextLineId) {
        setTimeout(() => {
          const nextInput = document.getElementById(`line-item-${nextLineId}-${fieldName}`);
          if (nextInput) {
            nextInput.focus();
            if (typeof nextInput.select === 'function') nextInput.select();
          }
        }, 50);
      }
    }
  }
}

function handleGRNLineKeyDown(event, currentIndex, currentField) {
  if (event.key !== 'Enter') return;
  event.preventDefault(); // Ngăn submit form mặc định

  const lineItems = state.formData?.lineItems || [];
  const totalLines = lineItems.length;
  if (totalLines === 0) return;

  const currentLine = lineItems[currentIndex];
  const targetInput = event.target;

  // 1. Cập nhật dữ liệu từ input hiện tại vào state.formData
  if (currentLine && targetInput) {
    if (currentField === 'name') {
      const val = targetInput.value.trim();
      currentLine.name = typeof toTitleCase === 'function' ? toTitleCase(val) : val;
      targetInput.value = currentLine.name;
    } else if (currentField === 'unit') {
      const val = targetInput.value.trim().toUpperCase();
      currentLine.unit = val;
      targetInput.value = val;
    } else if (currentField === 'unitCost' || currentField === 'hireprice') {
      const numVal = typeof parseNumberInput === 'function' ? parseNumberInput(targetInput.value) : parseFloat(targetInput.value) || 0;
      currentLine[currentField] = numVal;
      targetInput.value = (numVal ?? 0).toLocaleString('vi-VN');
    } else if (currentField === 'receivedQty') {
      const numVal = parseFloat(targetInput.value) || 0;
      currentLine.receivedQty = numVal;
      currentLine.qtyImport = numVal;
    }

    if (typeof updateLine === 'function') {
      updateLine(currentLine.lineId, currentField, currentLine[currentField], ['receivedQty', 'unitCost', 'hireprice'].includes(currentField) ? 'number' : 'text');
    }
  }

  if (currentField === 'hireprice' && currentIndex === totalLines - 1) {
    if (targetInput && typeof targetInput.blur === 'function') {
      targetInput.blur();
    }
    return;
  }

  // 2. Thứ tự nhập liệu: Tên Hàng -> Đơn Vị Tính -> Giá Nhập -> Giá Thuê
  const fieldSequence = ['name', 'unit', 'unitCost', 'hireprice'];

  let nextIndex = currentIndex;
  let nextField = currentField;

  if (currentIndex < totalLines - 1) {
    // Chưa đến dòng cuối: Nhảy xuống dòng tiếp theo trên CÙNG CỘT
    nextIndex = currentIndex + 1;
  } else {
    // Đang ở dòng cuối cùng của các cột trước (Tên Hàng / ĐVT / Giá Nhập): Nhảy sang CỘT TIẾP THEO ở DÒNG ĐẦU TIÊN (index 0)
    const currentFieldIndex = fieldSequence.indexOf(currentField);
    if (currentFieldIndex !== -1 && currentFieldIndex < fieldSequence.length - 1) {
      nextField = fieldSequence[currentFieldIndex + 1];
      nextIndex = 0;
    }
  }

  // 3. Chuyển focus tới ô tiếp theo
  requestAnimationFrame(() => {
    const nextLineObj = lineItems[nextIndex];
    if (!nextLineObj) return;

    const nextInputId = `line-item-${nextLineObj.lineId}-${nextField}`;
    const nextInput = document.getElementById(nextInputId);

    if (nextInput) {
      nextInput.focus();
      if (typeof nextInput.select === 'function') {
        nextInput.select();
      }
    }
  });
}

function addLineItem(module, focusNewName = false) {
  if (!state.formData) return;
  if (!Array.isArray(state.formData.lineItems)) state.formData.lineItems = [];
  const newLineId = Date.now().toString();
  const base = { lineId: newLineId, sku: '', name: '' };

  if (module === 'quotations') {
    state.formData.lineItems.push({ ...base, qty: 1, unitPrice: 0, discount: 0, tax: 0 });
  }
  if (module === 'sales-orders') {
    const currentWh = state.formData.warehouseCode || (db.warehouses[0] ? (db.warehouses[0].code || db.warehouses[0].id) : '');
    state.formData.lineItems.push({
      ...base,
      warehouseCode: currentWh,
      qty: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0
    });
  }
  if (module === 'returns') state.formData.lineItems.push({ ...base, qtyReturned: 1, unitPrice: 0 });
  if (module === 'grn') state.formData.lineItems.push({ ...base, receivedQty: 1, unitCost: 0 });

  render();

  if (focusNewName) {
    setTimeout(() => {
      const nameInput = document.getElementById(`line-item-${newLineId}-name`);
      if (nameInput) {
        nameInput.focus();
        if (typeof nameInput.select === 'function') nameInput.select();
      }
    }, 50);
  }
}

function removeLineItem(lineId) {
  if (!state.formData || !Array.isArray(state.formData.lineItems)) return;
  state.formData.lineItems = state.formData.lineItems.filter(l => l.lineId !== lineId);
  render();
}

async function saveForm(module) {
  const session = getAuthSession();
  const currentUserId = session.currentUser ? session.currentUser.id : 'Hệ Thống';
  const currentUserFullname = session.currentUser ? (session.currentUser.fullname || session.currentUser.username) : (session.fullName || session.username || 'Hệ Thống');

  if (!checkModulePermission(module)) {
    alert('Tài khoản của bạn chỉ có quyền xem, không thể thực hiện thao tác lưu!');
    return;
  }

  if (['quotations', 'sales-orders', 'returns', 'grn'].includes(module)) {
    const lineItems = state.formData?.lineItems || [];
    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      if (!item.name || !item.name.trim()) {
        alert('Tên Hàng không được để trống.');
        setTimeout(() => {
          const nameInput = document.getElementById(`line-item-${item.lineId}-name`);
          if (nameInput) {
            nameInput.focus();
            if (typeof nameInput.select === 'function') nameInput.select();
          }
        }, 50);
        return;
      }
    }
  }

  const tableMap = {
    'materials': 'materials',
    'customers': 'customers',
    'warehouses': 'warehouses',
    'quotations': 'quotations',
    'sales-orders': 'orders',
    'returns': 'returns',
    'grn': 'grns'
  };
  const tableName = tableMap[module];
  const targetKey = module === 'sales-orders' ? 'orders' : (module === 'grn' ? 'grns' : module);

  let rawData = { ...state.formData };
  if (Array.isArray(state.formData.lineItems)) {
    rawData.lineItems = state.formData.lineItems.map(item => ({ ...item }));
  }

  const currentDate = getTodayDateStr();
  const currentTime = getCurrentTimeStr();

  // Kiểm tra xung đột dữ liệu khi chỉnh sửa
  if (state.mode === 'edit') {
    try {
      const { data: latestRecord, error: checkErr } = await supabaseClient
        .from(tableName)
        .select('*')
        .eq('id', rawData.id)
        .single();

      if (!checkErr && latestRecord) {
        const localLastTime = `${rawData.date2 || ''} ${rawData.time2 || ''}`.trim();
        const dbLastTime = `${latestRecord.date2 || ''} ${latestRecord.time2 || ''}`.trim();

        if (dbLastTime && localLastTime && dbLastTime !== localLastTime && String(latestRecord.user_id2) !== String(currentUserId)) {

          let editorName = latestRecord.user_id2 || 'Một người dùng khác';
          const userList = db.users || db.userinfo || db.user_info || [];
          const matchedUser = userList.find(u => String(u.id) === String(latestRecord.user_id2));
          if (matchedUser) {
            editorName = matchedUser.fullname || matchedUser.full_name || matchedUser.username || editorName;
          }

          const editTime = `${latestRecord.time2 || ''} - ${latestRecord.date2 || ''}`;

          await showAlert(
            `Phiếu/Danh mục này vừa được chỉnh sửa bởi "${editorName}" vào lúc ${editTime}.\n\nHệ thống sẽ tự động cập nhật dữ liệu mới nhất và chuyển sang giao diện Xem chi tiết!`,
            'Cảnh báo xung đột dữ liệu'
          );

          const rawLines = latestRecord.lineItems || latestRecord.lineitems || [];
          const normalizedLines = Array.isArray(rawLines) ? rawLines.map(l => ({ ...l })) : [];
          latestRecord.lineItems = normalizedLines;
          latestRecord.lineitems = normalizedLines;

          if (module === 'quotations') {
            const vUntil = latestRecord.validUntil || latestRecord.validuntil || '';
            const vBegin = latestRecord.validbegin || latestRecord.validBegin || latestRecord.date || '';
            latestRecord.validUntil = vUntil;
            latestRecord.validuntil = vUntil;
            latestRecord.validBegin = vBegin;
            latestRecord.validbegin = vBegin;
          }

          if (module === 'returns' || module === 'sales-orders') {
            latestRecord.warehouseCode = latestRecord.warehouseCode || latestRecord.warehouse_code || latestRecord.warehousecode || '';
            latestRecord.warehouse_code = latestRecord.warehouseCode;
            if (module === 'returns') {
              latestRecord.orderId = latestRecord.orderId || latestRecord.order_id || null;
              latestRecord.order_id = latestRecord.orderId;
            } else {
              latestRecord.quotationId = latestRecord.quotationId || latestRecord.quotation_id || null;
              latestRecord.quotation_id = latestRecord.quotationId;
            }
          }

          if (module === 'grn') {
            const whCode = latestRecord.warehouseCode || latestRecord.warehouse_code || latestRecord.warehousecode || '';
            const totalVal = latestRecord.totalValue ?? latestRecord.totalvalue ?? 0;
            latestRecord.warehouseCode = whCode;
            latestRecord.warehousecode = whCode;
            latestRecord.totalValue = totalVal;
            latestRecord.totalvalue = totalVal;
          }

          if (!db[targetKey]) db[targetKey] = [];
          const idx = db[targetKey].findIndex(item => String(item.id) === String(rawData.id));
          if (idx !== -1) {
            db[targetKey][idx] = latestRecord;
          } else {
            db[targetKey].unshift(latestRecord);
          }

          state.formData = { ...latestRecord };
          navigate(module, 'view', rawData.id);
          return;
        }
      }
    } catch (checkEx) {
      console.warn('Không thể kiểm tra xung đột dữ liệu:', checkEx);
    }
  }

  if (state.mode === 'add') {
    rawData.user_id0 = currentUserId;
    rawData.date0 = currentDate;
    rawData.time0 = currentTime;

    rawData.user_id2 = currentUserId;
    rawData.date2 = currentDate;
    rawData.time2 = currentTime;
  } else if (state.mode === 'edit') {
    const existing = db[targetKey]?.find(item => String(item.id) === String(rawData.id));
    if (existing) {
      rawData.user_id0 = existing.user_id0 || currentUserId;
      rawData.date0 = existing.date0 || currentDate;
      rawData.time0 = existing.time0 || currentTime;
    } else {
      rawData.user_id0 = currentUserId;
      rawData.date0 = currentDate;
      rawData.time0 = currentTime;
    }

    rawData.user_id2 = currentUserId;
    rawData.date2 = currentDate;
    rawData.time2 = currentTime;
  }

  if (module === 'customers') {
    if (rawData.paymentTerms !== undefined) rawData.paymentterms = rawData.paymentTerms;
    if (rawData.creditLimit !== undefined) rawData.creditlimit = rawData.creditLimit;
  }

  const asyncBackgroundTasks = [];

  if (module === 'quotations') {
    const isNewStatusAccepted = ['accepted', 'approved', 'duyệt', 'đã duyệt'].includes((rawData.status || '').toLowerCase());
    const targetCustomer = (rawData.customer || '').trim();

    if (isNewStatusAccepted && targetCustomer) {
      const currentCust = targetCustomer.toLowerCase();

      db.quotations.forEach(q => {
        if (q && q.customer && q.customer.trim().toLowerCase() === currentCust && String(q.id) !== String(rawData.id)) {
          const currentStatus = (q.status || '').toLowerCase();
          const isCurrentAccepted = ['accepted', 'approved', 'duyệt', 'đã duyệt'].includes(currentStatus);
          if (isCurrentAccepted) {
            q.status = 'expired';
            const vUntil = q.validUntil || q.validuntil || '';
            const vBegin = q.validbegin || q.validBegin || q.date || '';
            q.validUntil = vUntil;
            q.validuntil = vUntil;
            q.validBegin = vBegin;
            q.validbegin = vBegin;
          }
        }
      });

      asyncBackgroundTasks.push(
        (async () => {
          try {
            await supabaseClient
              .from('quotations')
              .update({ status: 'expired' })
              .eq('customer', targetCustomer)
              .neq('id', rawData.id)
              .in('status', ['accepted', 'approved', 'Duyệt', 'duyệt', 'Đã duyệt', 'đã duyệt']);
          } catch (err) {
            console.error('Lỗi tự động chuyển báo giá cũ sang Hết hạn:', err);
          }
        })()
      );
    }

    try {
      const actorName = currentUserFullname;
      const actionText = state.mode === 'add' ? 'Tạo mới' : 'Cập nhật';

      const notifTitle = `Báo Giá (${actionText})`;
      const notifDetail = `${actorName} đã ${actionText.toLowerCase()} báo giá ${rawData.id} cho khách hàng ${rawData.customer || ''}`;

      const now = new Date();
      const dateStr = getTodayDateStr();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const notifPayload = {
        id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        type: 'quotations',
        title: notifTitle,
        detail: notifDetail,
        targetview: 'quotations',
        itemid: String(rawData.id || ''),
        time: timeStr,
        date: dateStr,
        created_at: now.toISOString(),
        actor: actorName
      };

      asyncBackgroundTasks.push(
        (async () => {
          try {
            const { error: notifErr } = await supabaseClient.from('notifications').insert([notifPayload]);
            if (notifErr) console.error('Lỗi Supabase khi chèn notifications:', notifErr);
          } catch (err) {
            console.error('Lỗi tạo thông báo:', err);
          }
        })()
      );
    } catch (err) {
      console.error('Lỗi chuẩn bị thông báo:', err);
    }

    const validUntilVal = rawData.validUntil || rawData.validuntil || '';
    const validBeginVal = rawData.validbegin || rawData.validBegin || rawData.date || '';

    rawData.validuntil = validUntilVal;
    rawData.validUntil = validUntilVal;
    rawData.validbegin = validBeginVal;
    rawData.validBegin = validBeginVal;

    if (Array.isArray(rawData.lineItems)) {
      rawData.lineitems = rawData.lineItems;
    }

    delete rawData.discountTotal;
    delete rawData.subtotal;
  }

  // --- BỔ SUNG: TẠO THÔNG BÁO CHO ĐƠN BÁN HÀNG (sales-orders) ---
  if (module === 'sales-orders') {
    try {
      const actorName = currentUserFullname;
      const actionText = state.mode === 'add' ? 'Tạo mới' : 'Cập nhật';

      const notifTitle = `Đơn Bán Hàng (${actionText})`;
      const notifDetail = `${actorName} đã ${actionText.toLowerCase()} đơn bán hàng ${rawData.id} cho khách hàng ${rawData.customer || ''}`;

      const now = new Date();
      const dateStr = getTodayDateStr();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const notifPayload = {
        id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        type: 'sales-orders',
        title: notifTitle,
        detail: notifDetail,
        targetview: 'sales-orders',
        itemid: String(rawData.id || ''),
        time: timeStr,
        date: dateStr,
        created_at: now.toISOString(),
        actor: actorName
      };

      asyncBackgroundTasks.push(
        (async () => {
          try {
            const { error: notifErr } = await supabaseClient.from('notifications').insert([notifPayload]);
            if (notifErr) console.error('Lỗi Supabase khi chèn notifications đơn hàng:', notifErr);
          } catch (err) {
            console.error('Lỗi tạo thông báo đơn hàng:', err);
          }
        })()
      );
    } catch (err) {
      console.error('Lỗi chuẩn bị thông báo đơn hàng:', err);
    }
  }

  // --- BỔ SUNG: TẠO THÔNG BÁO CHO PHIẾU NHẬN TRẢ LẠI (returns) ---
  if (module === 'returns') {
    try {
      const actorName = currentUserFullname;
      const actionText = state.mode === 'add' ? 'Tạo mới' : 'Cập nhật';

      const notifTitle = `Phiếu Nhận Trả Lại (${actionText})`;
      const notifDetail = `${actorName} đã ${actionText.toLowerCase()} phiếu nhận trả ${rawData.id} từ khách hàng ${rawData.customer || ''}`;

      const now = new Date();
      const dateStr = getTodayDateStr();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const notifPayload = {
        id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        type: 'returns',
        title: notifTitle,
        detail: notifDetail,
        targetview: 'returns',
        itemid: String(rawData.id || ''),
        time: timeStr,
        date: dateStr,
        created_at: now.toISOString(),
        actor: actorName
      };

      asyncBackgroundTasks.push(
        (async () => {
          try {
            const { error: notifErr } = await supabaseClient.from('notifications').insert([notifPayload]);
            if (notifErr) console.error('Lỗi Supabase khi chèn notifications phiếu trả:', notifErr);
          } catch (err) {
            console.error('Lỗi tạo thông báo phiếu trả:', err);
          }
        })()
      );
    } catch (err) {
      console.error('Lỗi chuẩn bị thông báo phiếu trả:', err);
    }
  }

  let dbPayload = { ...rawData };
  let supabasePayload = { ...rawData };

  if (module === 'materials') {
    supabasePayload = {
      id: rawData.id,
      name: rawData.name,
      category: rawData.category || 'Áo',
      location: rawData.location || '',
      stock: Number(rawData.stock ?? 1),
      cost: Number(rawData.cost || 0),
      hireprice: Number(rawData.hireprice || 0), // Đẩy giá thuê vào Database
      status: rawData.status || 'ok',
      notes: rawData.notes || '',
      unit: rawData.unit || '',
      user_id0: rawData.user_id0,
      date0: rawData.date0,
      time0: rawData.time0,
      user_id2: rawData.user_id2,
      date2: rawData.date2,
      time2: rawData.time2
    };
  }

  if (module === 'customers') {
    const limit = Number(rawData.creditLimit || rawData.creditlimit || 0);
    const terms = rawData.paymentTerms || rawData.paymentterms || '';

    supabasePayload = {
      id: rawData.id,
      name: rawData.name,
      type: rawData.type || '',
      contact: rawData.contact || '',
      email: rawData.email || '',
      phone: rawData.phone || '',
      address: rawData.address || '',
      creditLimit: limit,
      paymentterms: terms,
      status: rawData.status || 'active',
      user_id0: rawData.user_id0,
      date0: rawData.date0,
      time0: rawData.time0,
      user_id2: rawData.user_id2,
      date2: rawData.date2,
      time2: rawData.time2
    };
  }

  if (module === 'warehouses' || module === 'warehouse') {
    supabasePayload = {
      id: rawData.id,
      code: rawData.code || '',
      name: rawData.name,
      location: rawData.location || '',
      capacity: Number(rawData.capacity || 0),
      used: Number(rawData.used || 0),
      manager: rawData.manager || '',
      status: rawData.status || 'active',
      user_id0: rawData.user_id0,
      date0: rawData.date0,
      time0: rawData.time0,
      user_id2: rawData.user_id2,
      date2: rawData.date2,
      time2: rawData.time2
    };
  }

  if (module === 'quotations') {
    delete supabasePayload.validUntil;
    delete supabasePayload.validBegin;
    delete supabasePayload.lineItems;
  }

  if (module === 'returns') {
    const warehouseCode = rawData.warehouseCode || (db.warehouses[0] ? (db.warehouses[0].code || db.warehouses[0].id) : '');
    const lineItems = Array.isArray(rawData.lineItems) ? rawData.lineItems : [];

    // =========================================================================
    // 1. CẬP NHẬT TRẠNG THÁI HÀNG HÓA VỀ "Còn Hàng" TRONG CSDL BỘ NHỚ LOCAL (db)
    // =========================================================================
    if (lineItems.length > 0 && Array.isArray(db.materials)) {
      lineItems.forEach(line => {
        const mat = db.materials.find(m =>
          (line.sku && m.id === line.sku) ||
          (line.name && m.name.toLowerCase() === line.name.toLowerCase())
        );
        if (mat) {
          mat.status = 'ok'; // Hoặc 'Còn Hàng' tùy quy chuẩn hiển thị trong hệ thống của bạn
          mat.user_id2 = currentUserId;
          mat.date2 = currentDate;
          mat.time2 = currentTime;
        }
      });
    }

    // =========================================================================
    // 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG BÁN VỀ "Hoàn Thành" TRONG CSDL BỘ NHỚ LOCAL
    // =========================================================================
    if (rawData.orderId && Array.isArray(db.orders)) {
      const targetOrder = db.orders.find(o => String(o.id) === String(rawData.orderId));
      if (targetOrder) {
        targetOrder.status = 'completed'; // Hoặc 'Hoàn thành'
        targetOrder.user_id2 = currentUserId;
        targetOrder.date2 = currentDate;
        targetOrder.time2 = currentTime;
      }
    }
    // =========================================================================
    dbPayload.warehouseCode = warehouseCode;
    dbPayload.warehouse_code = warehouseCode;
    dbPayload.orderId = rawData.orderId || null;
    dbPayload.order_id = rawData.orderId || null;
    dbPayload.lineItems = lineItems;
    dbPayload.lineitems = lineItems;

    supabasePayload.warehouse_code = warehouseCode;
    supabasePayload.order_id = rawData.orderId || null;
    supabasePayload.lineitems = lineItems;

    delete supabasePayload.warehouseCode;
    delete supabasePayload.orderId;
    delete supabasePayload.lineItems;
  }

  if (module === 'grn') {
    const warehouseCode = rawData.warehouseCode || rawData.warehousecode || (db.warehouses[0] ? (db.warehouses[0].code || db.warehouses[0].id) : '');
    const lineItems = Array.isArray(rawData.lineItems) ? rawData.lineItems : (Array.isArray(rawData.lineitems) ? rawData.lineitems : []);
    const totalValue = rawData.totalValue ?? rawData.totalvalue ?? 0;

    if (!Array.isArray(db.grns)) db.grns = [];

    // Tự động thêm sản phẩm vào danh mục hàng hóa khi lập Phiếu nhập kho
    if (lineItems.length > 0) {
      if (!Array.isArray(db.materials)) db.materials = [];

      let maxSkuNum = 0;
      db.materials.forEach(m => {
        const num = parseInt(String(m.id || '').replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > maxSkuNum) maxSkuNum = num;
      });

      const newMaterialsToInsert = [];

      lineItems.forEach((l) => {
        maxSkuNum++;
        const newSku = generateAutoId('materials');
        l.sku = newSku;

        const qtyImport = Number(l.receivedQty ?? l.qtyImport ?? 0);
        const costPrice = Number(l.unitCost ?? 0);
        const hirePriceVal = Number(l.hireprice ?? l.hirePrice ?? 0); // Lấy giá thuê từ dòng nhập kho

        const newMatObj = {
          id: newSku,
          name: l.name ? l.name.trim() : '',
          unit: l.unit ? l.unit.trim().toUpperCase() : '',
          category: '',
          location: warehouseCode,
          stock: qtyImport,
          reorder: 0,
          cost: costPrice,
          hireprice: hirePriceVal, // Đẩy giá thuê vào danh mục hàng hóa
          status: 'ok',
          reserved: 0,
          user_id0: currentUserId,
          date0: currentDate,
          time0: currentTime,
          user_id2: currentUserId,
          date2: currentDate,
          time2: currentTime
        };

        db.materials.unshift(newMatObj);

        newMaterialsToInsert.push({
          id: newMatObj.id,
          name: newMatObj.name,
          unit: newMatObj.unit,
          category: newMatObj.category,
          location: newMatObj.location,
          stock: newMatObj.stock,
          reorder: newMatObj.reorder,
          cost: newMatObj.cost,
          hireprice: newMatObj.hireprice, // Đồng bộ lên Supabase
          status: newMatObj.status,
          reserved: 0,
          user_id0: newMatObj.user_id0,
          date0: newMatObj.date0,
          time0: newMatObj.time0,
          user_id2: newMatObj.user_id2,
          date2: newMatObj.date2,
          time2: newMatObj.time2
        });
      });

      asyncBackgroundTasks.push(
        (async () => {
          try {
            const { error: matErr } = await supabaseClient.from('materials').insert(newMaterialsToInsert);
            if (matErr) console.error('Lỗi khi tự động thêm sản phẩm vào bảng materials:', matErr);
          } catch (err) {
            console.error('Lỗi insert materials:', err);
          }
        })()
      );
    }

    dbPayload.warehouseCode = warehouseCode;
    dbPayload.warehousecode = warehouseCode;
    dbPayload.lineItems = lineItems;
    dbPayload.lineitems = lineItems;
    dbPayload.totalValue = totalValue;
    dbPayload.totalvalue = totalValue;

    supabasePayload.warehousecode = warehouseCode;
    supabasePayload.lineitems = lineItems;
    supabasePayload.totalvalue = totalValue;

    delete supabasePayload.warehouseCode;
    delete supabasePayload.warehouse_code;
    delete supabasePayload.lineItems;
    delete supabasePayload.totalValue;
    delete supabasePayload.total_value;
  }

  if (module === 'sales-orders') {
    const warehouseCode = rawData.warehouseCode || (db.warehouses[0] ? (db.warehouses[0].code || db.warehouses[0].id) : '');
    const lineItems = Array.isArray(rawData.lineItems) ? rawData.lineItems : [];

    // Tự động cập nhật trạng thái trong danh mục hàng hóa (db.materials)
    if (lineItems.length > 0 && Array.isArray(db.materials)) {
      const updatedMaterialsToSync = [];

      lineItems.forEach(l => {
        const matSku = l.sku;
        const matName = l.name;
        if (!matSku && !matName) return;

        const matIndex = db.materials.findIndex(m =>
          (matSku && m.id === matSku) || (matName && m.name.toLowerCase() === matName.toLowerCase())
        );

        if (matIndex !== -1) {
          const isSale = Boolean(l.sale_yn);
          const newStatus = isSale ? 'out' : 'rent';

          db.materials[matIndex].status = newStatus;
          db.materials[matIndex].user_id2 = currentUserId;
          db.materials[matIndex].date2 = currentDate;
          db.materials[matIndex].time2 = currentTime;

          updatedMaterialsToSync.push({
            id: db.materials[matIndex].id,
            status: newStatus,
            user_id2: currentUserId,
            date2: currentDate,
            time2: currentTime
          });
        }
      });

      if (updatedMaterialsToSync.length > 0) {
        asyncBackgroundTasks.push(
          (async () => {
            try {
              for (const matItem of updatedMaterialsToSync) {
                await supabaseClient
                  .from('materials')
                  .update({
                    status: matItem.status,
                    user_id2: matItem.user_id2,
                    date2: matItem.date2,
                    time2: matItem.time2
                  })
                  .eq('id', matItem.id);
              }
            } catch (err) {
              console.error('Lỗi tự động cập nhật trạng thái sản phẩm:', err);
            }
          })()
        );
      }
    }

    dbPayload.warehouseCode = warehouseCode;
    dbPayload.warehouse_code = warehouseCode;
    dbPayload.lineItems = lineItems;
    dbPayload.lineitems = lineItems;
    dbPayload.quotationId = rawData.quotationId || null;
    dbPayload.quotation_id = rawData.quotationId || null;

    supabasePayload.warehouse_code = warehouseCode;
    supabasePayload.quotation_id = rawData.quotationId || null;
    supabasePayload.lineitems = lineItems;

    delete supabasePayload.warehouseCode;
    delete supabasePayload.quotationId;
    delete supabasePayload.quotationid;
    delete supabasePayload.discountTotal;
    delete supabasePayload.discounttotal;
    delete supabasePayload.subtotal;
    delete supabasePayload.lineItems;
  }

  const currentMode = state.mode;
  try {
    // Nếu là phiếu nhận trả -> Đẩy task cập nhật Database Supabase chạy ngầm
    if (module === 'returns') {
      const lineItems = Array.isArray(rawData.lineItems) ? rawData.lineItems : [];

      // Task 1: Cập nhật trạng thái từng sản phẩm về "ok" (Còn Hàng) trên Supabase
      if (lineItems.length > 0) {
        asyncBackgroundTasks.push(
          (async () => {
            try {
              for (const line of lineItems) {
                const mat = (db.materials || []).find(m =>
                  (line.sku && m.id === line.sku) ||
                  (line.name && m.name.toLowerCase() === line.name.toLowerCase())
                );
                if (mat) {
                  await supabaseClient
                    .from('materials')
                    .update({
                      status: 'ok',
                      user_id2: currentUserId,
                      date2: currentDate,
                      time2: currentTime
                    })
                    .eq('id', mat.id);
                }
              }
            } catch (err) {
              console.error('Lỗi tự động cập nhật trạng thái mặt hàng khi nhận trả:', err);
            }
          })()
        );
      }

      // Task 2: Cập nhật trạng thái Đơn Bán Hàng tương ứng về "completed" (Hoàn thành) trên Supabase
      if (rawData.orderId) {
        asyncBackgroundTasks.push(
          (async () => {
            try {
              await supabaseClient
                .from('orders')
                .update({
                  status: 'completed',
                  user_id2: currentUserId,
                  date2: currentDate,
                  time2: currentTime
                })
                .eq('id', rawData.orderId);
            } catch (err) {
              console.error('Lỗi tự động cập nhật trạng thái đơn hàng bán khi nhận trả:', err);
            }
          })()
        );
      }
    }

    if (asyncBackgroundTasks.length > 0) {
      Promise.all(asyncBackgroundTasks).catch(err => console.error('Lỗi task nền:', err));
    }

    if (currentMode === 'add') {
      const { data: insertedData, error } = await supabaseClient.from(tableName).insert([supabasePayload]).select();
      if (error) throw error;
      if (insertedData && insertedData[0]) {
        dbPayload = { ...dbPayload, ...insertedData[0] };
      }
    } else {
      const { error } = await supabaseClient.from(tableName).update(supabasePayload).eq('id', dbPayload.id);
      if (error) throw error;
    }

    if (['quotations', 'sales-orders', 'returns', 'grn'].includes(module)) {
      const lines = rawData.lineItems || rawData.lineitems || [];
      dbPayload.lineItems = lines;
      dbPayload.lineitems = lines;
    }

    if (!db[targetKey]) db[targetKey] = [];

    if (currentMode === 'add') {
      db[targetKey].unshift(dbPayload);
    } else {
      const idx = db[targetKey].findIndex(item => String(item.id) === String(dbPayload.id));
      if (idx !== -1) {
        db[targetKey][idx] = dbPayload;
      } else {
        db[targetKey].unshift(dbPayload);
      }
    }

    if (['quotations', 'orders', 'returns', 'grns'].includes(targetKey)) {
      if (typeof sortDescById === 'function') {
        db[targetKey].sort(sortDescById);
      }
    }

    if (module === 'materials' && typeof updateGlobalMaterialDatalist === 'function') {
      updateGlobalMaterialDatalist();
    }

    if (typeof invalidateStockCache === 'function') {
      invalidateStockCache();
    }

    showToast(currentMode === 'add' ? 'Thêm mới dữ liệu thành công!' : 'Cập nhật dữ liệu thành công!', 'success');

    if (currentMode === 'add') {
      state.formData = null;
      navigate(module, 'list');
    } else {
      navigate(module, 'view', dbPayload.id);
    }

  } catch (error) {
    console.error('Lỗi lưu Supabase:', error);
    if (typeof showAlert === 'function') {
      showAlert('Lưu thất bại: ' + (error.message || error), 'Lỗi DB');
    }
  }
}

async function deleteItem(module, id) {
  if (!checkModulePermission(module)) {
    await showAlert('Tài khoản của bạn chỉ có quyền xem, không được phép xóa!', 'Cảnh báo quyền');
    return;
  }

  const confirmDelete = await showConfirm(`Bạn có chắc chắn muốn xóa thông tin có ID: ${id}?`, 'Xác nhận xóa');

  if (confirmDelete) {
    const targetDeleteId = String(id);
    window.isLocalDeletingId = targetDeleteId;

    const tableMap = {
      'materials': 'materials',
      'customers': 'customers',
      'warehouses': 'warehouses',
      'quotations': 'quotations',
      'sales-orders': 'orders',
      'returns': 'returns',
      'grn': 'grns'
    };
    const tableName = tableMap[module];
    const targetKey = module === 'sales-orders' ? 'orders' : (module === 'grn' ? 'grns' : module);

    try {
      const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
      if (error) throw error;

      if (db[targetKey]) {
        db[targetKey] = db[targetKey].filter(item => String(item.id) !== targetDeleteId);
      }

      if (module === 'materials' && typeof updateGlobalMaterialDatalist === 'function') {
        updateGlobalMaterialDatalist();
      }

      sessionStorage.removeItem(`scroll_pos_${module}`);

      if (typeof invalidateStockCache === 'function') {
        invalidateStockCache();
      }

      showToast('Đã xóa bản ghi thành công!', 'success');

      if (state.mode !== 'list') {
        state.formData = null;
        navigate(module, 'list');
      } else {
        render();
      }

      if (typeof BroadcastChannel !== 'undefined') {
        const appChannel = new BroadcastChannel('app_data_sync_channel');
        appChannel.postMessage('REFRESH_DATA');
      }

    } catch (error) {
      console.error('Lỗi khi xóa bản ghi:', error);
      await showAlert('Xóa trên CSDL thất bại: ' + (error.message || error), 'Lỗi kết nối');
    } finally {
      setTimeout(() => {
        if (window.isLocalDeletingId === targetDeleteId) {
          window.isLocalDeletingId = null;
        }
      }, 1500);
    }
  }
}

function initFormData(module, id) {
  const keyMap = { 'sales-orders': 'orders', 'grn': 'grns' };
  const targetKey = keyMap[module] || module;
  const collection = db[targetKey] || [];

  if (id) {
    const foundData = collection.find(x => String(x.id) === String(id));
    if (foundData) {
      state.formData = JSON.parse(JSON.stringify(foundData));

      if (['quotations', 'sales-orders', 'returns', 'grn'].includes(module)) {
        const rawLines = state.formData.lineItems || state.formData.lineitems || [];
        state.formData.lineItems = Array.isArray(rawLines) ? JSON.parse(JSON.stringify(rawLines)) : [];
      }

      if (module === 'quotations') {
        state.formData.validUntil = state.formData.validUntil || state.formData.validuntil || '';
        state.formData.validbegin = state.formData.validbegin || state.formData.validBegin || state.formData.date || '';
      }

      if (module === 'sales-orders' || module === 'returns' || module === 'grn') {
        state.formData.warehouseCode = state.formData.warehouseCode || state.formData.warehouse_code || state.formData.warehousecode || '';
      }
    }
  } else {
    const autoId = generateAutoId(module);
    if (module === 'materials') {
      state.formData = {
        id: autoId,
        name: '',
        unit: '',
        category: 'Áo',
        location: '',
        stock: 1,
        cost: 0,
        hireprice: 0, // Giá thuê mặc định bằng 0
        status: 'ok',
        notes: ''
      };
    }

    if (module === 'customers') {
      state.formData = {
        id: autoId, name: '', type: 'B2B', contact: '', email: '', phone: '', address: '', creditLimit: 0, paymentTerms: 'Net 30', status: 'active'
      };
    }

    if (module === 'warehouses') {
      state.formData = {
        id: autoId, code: autoId, name: '', location: '', capacity: 0, used: 0, manager: '', status: 'active'
      };
    }

    if (module === 'quotations') {
      const today = getTodayDateStr();
      const firstDay = getFirstDayOfMonthStr();
      const { lastDay } = getMonthRange();
      state.formData = {
        id: autoId, customer: '', date: today, validbegin: firstDay, validUntil: lastDay, status: 'accepted', notes: '',
        lineItems: [{ lineId: Date.now().toString(), sku: '', name: '', qty: 1, unitPrice: 0, discount: 0, tax: 0 }]
      };
    }

    if (module === 'sales-orders') {
      const defaultWh = db.warehouses[0] ? (db.warehouses[0].code || db.warehouses[0].id) : '';
      state.formData = {
        id: autoId,
        customer: '',
        warehouseCode: defaultWh,
        quotationId: null,
        date: getTodayDateStr(),
        status: 'accepted',
        notes: '',
        tax: 0,
        total: 0,
        lineItems: [
          {
            lineId: Date.now().toString(),
            warehouseCode: defaultWh,
            sku: '',
            name: '',
            sale_yn: false,
            qty: 1,
            unitPrice: 0,
            discount: 0,
            tax: 0
          }
        ]
      };
    }

    if (module === 'returns') {
      const defaultWh = db.warehouses[0] ? (db.warehouses[0].code || db.warehouses[0].id) : '';
      state.formData = {
        id: autoId, warehouseCode: defaultWh, orderId: '', customer: '', date: getTodayDateStr(), reason: 'Hàng thuê trả lại', notes: '', status: 'accepted',
        lineItems: [{ lineId: Date.now().toString(), sku: '', name: '', qtyReturned: 1, unitPrice: 0 }]
      };
    }

    if (module === 'grn') {
      const defaultWh = db.warehouses[0] ? (db.warehouses[0].code || db.warehouses[0].id) : '';
      state.formData = {
        id: autoId,
        supplier: '',
        warehouseCode: defaultWh,
        notes: '',
        date: getTodayDateStr(),
        status: 'Đã nhận',
        lineItems: [{ lineId: Date.now().toString(), sku: '', name: '', receivedQty: 1, unitCost: 0 }]
      };
    }
  }
}

// ==========================================
// 7. CÁC HÀM XỬ LÝ CHỌN LỌC TỰ ĐỘNG DỮ LIỆU
// ==========================================

function updateGlobalMaterialDatalist() {
  let dl = document.getElementById('global-materials-list');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'global-materials-list';
    document.body.appendChild(dl);
  }
  dl.innerHTML = (db.materials || []).map(m => {
    const safeName = m.name || '';
    const safeId = m.id || '';
    const safeCost = m.cost || 0;
    return `<option value="${safeName}">${safeId} - ${safeName} (${fmtUSD(safeCost)})</option>`;
  }).join('');
}

// Khi chọn đơn hàng bán trong phiếu trả hàng
function handleReturnSalesOrderChange(soId) {
  updateField('salesOrderId', soId);
  if (!soId) return;

  const so = (db.salesOrders || []).find(item => item.id === soId);
  if (so) {
    if (so.customer) updateField('customer', so.customer);
    if (so.phone) {
      updateField('phone', so.phone);
    } else {
      // Tìm phone trong DB khách hàng nếu trên đơn hàng không ghi SĐT
      const custObj = (db.customers || []).find(c => c.name === so.customer);
      if (custObj && custObj.phone) {
        updateField('phone', custObj.phone);
      }
    }

    // Lấy thông tin dòng hàng: sale_yn === false thì đơn giá = 0
    if (Array.isArray(so.lineItems) && so.lineItems.length > 0) {
      state.formData.lineItems = so.lineItems.map(l => {
        const isSale = l.sale_yn !== false && l.sale_yn !== 'false' && l.sale_yn !== 0;
        const unitPriceVal = isSale ? (l.unitPrice ?? l.price ?? 0) : 0;

        return {
          lineId: generateId(),
          itemCode: l.itemCode || l.code || '',
          name: l.name || '',
          unit: l.unit || '',
          returnQty: l.qty || l.quantity || 1,
          qty: l.qty || l.quantity || 1,
          unitPrice: unitPriceVal,
          price: unitPriceVal,
          sale_yn: l.sale_yn
        };
      });
    }
  }
  render();
}

// Khi chọn hoặc đổi Khách hàng trong phiếu trả
function handleReturnCustomerChange(val) {
  const custName = val.trim();
  updateField('customer', custName);

  // Tự động tìm SĐT tương ứng trong danh mục khách hàng
  const custObj = (db.customers || []).find(c => c.name.toLowerCase() === custName.toLowerCase());
  if (custObj && custObj.phone) {
    updateField('phone', custObj.phone);
  }
  render();
}

// Khi nhập xong SĐT và rời ô hoặc Enter/Tab
function handleReturnPhoneChange(phoneVal) {
  const cleanPhone = (phoneVal || '').trim();
  updateField('phone', cleanPhone);

  const noticeEl = document.getElementById('return-phone-notice');

  if (!cleanPhone) {
    if (noticeEl) noticeEl.style.display = 'none';
    return;
  }

  // Tự động đối chiếu với danh sách Khách hàng
  const custObj = (db.customers || []).find(c => (c.phone || '').trim() === cleanPhone);
  if (custObj && custObj.name) {
    state.formData.customer = custObj.name;
  } else {
    state.formData.customer = '';
  }
  render();
}

function handleOrderSelectInReturn(orderId) {
  if (!state.formData || state.mode === 'view') return;

  const safeOrderId = String(orderId || '').trim();
  state.formData.orderId = safeOrderId;

  // Nếu người dùng chọn "-- Không theo đơn hàng --" (Bỏ chọn đơn)
  if (!safeOrderId) {
    if (!state.formData.customer) {
      state.formData.lineItems = [{
        lineId: Date.now().toString(),
        sku: '',
        name: '',
        qtyReturned: 1,
        unitPrice: 0
      }];
    }
    render();
    return;
  }

  // Trường hợp chọn 1 Đơn hàng bán cụ thể
  const targetOrder = (db.orders || []).find(o => String(o.id) === safeOrderId);

  if (targetOrder) {
    // Tự động gắn Khách hàng & SĐT từ Đơn hàng bán
    state.formData.customer = targetOrder.customer || '';

    if (targetOrder.phone) {
      state.formData.phone = targetOrder.phone;
    } else {
      const custObj = (db.customers || []).find(c => c.name === targetOrder.customer);
      if (custObj && custObj.phone) {
        state.formData.phone = custObj.phone;
      }
    }

    // Sao chép các dòng sản phẩm từ đơn bán hàng sang phiếu nhận trả
    const rawLines = targetOrder.lineItems || targetOrder.lineitems || [];
    if (Array.isArray(rawLines) && rawLines.length > 0) {
      state.formData.lineItems = rawLines.map(item => {
        // Kiểm tra sale_yn: true -> lấy đơn giá, false/khác -> gán bằng 0
        const isSale = item.sale_yn === true || item.sale_yn === 'true';
        const priceVal = isSale ? (Number(item.unitPrice || item.price) || 0) : 0;

        return {
          lineId: Date.now().toString() + Math.random().toString(36).substr(2, 4),
          sku: item.sku || '',
          name: item.name || '',
          qtyReturned: Number(item.qty || item.quantity) || 1,
          unitPrice: priceVal,
          sale_yn: item.sale_yn
        };
      });
    }
  }

  render();
}

function handleMaterialSelectInLine(lineId, selectedName) {
  if (!state.formData || state.mode === 'view') return;
  const line = (state.formData.lineItems || []).find(l => l.lineId === lineId);
  if (!line) return;

  const valStr = selectedName ? String(selectedName).trim() : '';
  if (!valStr) {
    line.name = '';
    line.sku = '';
    line.sale_yn = false;
    line.unitPrice = 0;
    render();
    return;
  }

  let cleanName = valStr;
  if (valStr.includes(' - ')) {
    const parts = valStr.split(' - ');
    cleanName = parts.length > 1 ? parts.slice(1).join(' - ').split(' (')[0].trim() : valStr;
  }

  const mat = (db.materials || []).find(m =>
    (m.name && m.name.toLowerCase() === cleanName.toLowerCase()) ||
    (m.id && m.id.toLowerCase() === valStr.toLowerCase())
  );

  if (mat) {
    line.name = mat.name || '';
    line.sku = mat.id || '';

    if (line.sale_yn === undefined || line.sale_yn === null) {
      line.sale_yn = false;
    }

    const currentCustomer = (state.formData.customer || '').trim();
    const orderDate = state.formData.date || getTodayDateStr();

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

    let qItem = null;
    if (activeQuotation && Array.isArray(activeQuotation.lineItems)) {
      qItem = activeQuotation.lineItems.find(item =>
        (item.sku && item.sku === mat.id) ||
        (item.name && item.name.toLowerCase() === mat.name.toLowerCase())
      );
    }

    if (line.sale_yn) {
      // Hàng bán: Lấy giá bán trong Báo giá hoặc Giá bán niêm yết trong danh mục
      line.unitPrice = qItem ? Number(qItem.unitPrice ?? qItem.price ?? 0) : Number(mat.price ?? mat.unitPrice ?? 0);
    } else {
      // Hàng thuê: Ưu tiên lấy Giá thuê trong Báo giá -> Giá thuê trong Danh mục -> Giá vốn/Đơn giá chung
      if (qItem && (qItem.hirePrice !== undefined && qItem.hirePrice !== null)) {
        line.unitPrice = Number(qItem.hirePrice) || 0;
      } else if (mat.hireprice !== undefined || mat.hirePrice !== undefined) {
        line.unitPrice = Number(mat.hireprice ?? mat.hirePrice ?? 0);
      } else {
        line.unitPrice = Number(mat.unitPrice ?? mat.price ?? mat.cost ?? 0);
      }
    }

    line.unitCost = Number(mat.cost || 0);
  } else {
    line.name = cleanName;
    line.unitPrice = 0;
  }

  render();
}

async function checkAndAddNewCustomerFromOrder() {
  const currentCustName = (state.formData?.customer || '').trim();

  if (!currentCustName) {
    showAlert('Vui lòng nhập tên khách hàng trước khi kiểm tra/thêm mới!', 'Thông báo');
    return;
  }

  const formattedName = toTitleCase(currentCustName);
  state.formData.customer = formattedName;

  const existingCustomer = (db.customers || []).find(c =>
    c.name && c.name.trim().toLowerCase() === formattedName.toLowerCase()
  );

  if (existingCustomer) {
    showToast(`Khách hàng "${formattedName}" đã có trong danh mục!`, 'info');
  } else {
    openQuickAddCustomerModal(formattedName);
  }
}

async function handleCustomerSelectInQuotation(customerName) {
  if (!state.formData || state.mode === 'view') return;
  const safeCustomer = String(customerName || '').trim();
  state.formData.customer = safeCustomer;

  if (!safeCustomer) {
    state.formData.lineItems = [{
      lineId: Date.now().toString(), sku: '', name: '', qty: 1, unitPrice: 0, discount: 0, tax: 0
    }];
    render();
    return;
  }

  const latestQuotation = (db.quotations || [])
    .filter(q => q && q.customer === safeCustomer)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];

  if (latestQuotation && Array.isArray(latestQuotation.lineItems) && latestQuotation.lineItems.length > 0) {
    const confirmInherit = await showConfirm(
      `Khách hàng "${safeCustomer}" đã có báo giá cũ (${latestQuotation.id}). Bạn có muốn kế thừa thông tin chi tiết từ báo giá này không?`,
      'Xác nhận kế thừa báo giá'
    );

    if (confirmInherit) {
      state.formData.lineItems = latestQuotation.lineItems.map(item => ({
        lineId: Date.now().toString() + Math.random().toString(36).substr(2, 4),
        sku: item.sku || '',
        name: item.name || '',
        qty: item.qty ?? 1,
        unitPrice: item.unitPrice ?? 0,
        discount: item.discount ?? 0,
        tax: item.tax ?? 0
      }));
    } else {
      state.formData.lineItems = [{
        lineId: Date.now().toString(), sku: '', name: '', qty: 1, unitPrice: 0, discount: 0, tax: 0
      }];
    }
  } else {
    state.formData.lineItems = [{
      lineId: Date.now().toString(), sku: '', name: '', qty: 1, unitPrice: 0, discount: 0, tax: 0
    }];
  }

  render();
}

async function handleCustomerSelectInOrder(customerName) {
  if (!state.formData || state.mode === 'view') return;
  const safeCustomer = String(customerName || '').trim();
  state.formData.customer = safeCustomer;

  if (!safeCustomer) {
    state.formData.quotationId = null;
    state.formData.lineItems = [{
      lineId: Date.now().toString(),
      warehouseCode: state.formData.warehouseCode || '',
      sku: '', name: '', qty: 1, unitPrice: 0, discount: 0, tax: 0
    }];
    render();
    return;
  }

  const orderDate = state.formData.date || getTodayDateStr();

  const activeQuotation = (db.quotations || [])
    .filter(q => {
      if (!q || q.customer !== safeCustomer) return false;
      if ((q.status || '').toLowerCase() !== 'accepted') return false;

      const vBegin = q.validbegin || q.validBegin || q.date || '';
      const vUntil = q.validUntil || q.validuntil || '';

      if (vBegin && vUntil) {
        return orderDate >= vBegin && orderDate <= vUntil;
      }
      return false;
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];

  if (activeQuotation) {
    const confirmImport = await showConfirm(
      "Bạn có muốn nhập toàn bộ mã hàng, đơn giá theo Bảng báo giá không?",
      "Áp dụng báo giá"
    );

    if (confirmImport) {
      state.formData.quotationId = activeQuotation.id || null;
      if (Array.isArray(activeQuotation.lineItems) && activeQuotation.lineItems.length > 0) {
        state.formData.lineItems = activeQuotation.lineItems.map(item => {
          const hirePriceVal = (item.hirePrice !== undefined && item.hirePrice !== null)
            ? Number(item.hirePrice)
            : Number(item.unitPrice ?? item.price ?? 0);

          return {
            lineId: Date.now().toString() + Math.random().toString(36).substr(2, 4),
            warehouseCode: state.formData.warehouseCode || '',
            sku: item.sku || '',
            name: item.name || '',
            qty: item.qty ?? 1,
            unitPrice: hirePriceVal,
            discount: item.discount ?? 0,
            tax: item.tax ?? 0
          };
        });
      }
    } else {
      state.formData.quotationId = null;
    }
  } else {
    state.formData.quotationId = null;
  }

  render();
}

function handleSaleYnChangeInLine(lineId, isSaleChecked) {
  if (!state.formData || !Array.isArray(state.formData.lineItems)) return;
  const line = state.formData.lineItems.find(l => l.lineId === lineId);
  if (!line) return;

  // 1. Cập nhật trạng thái cờ Hàng bán
  line.sale_yn = Boolean(isSaleChecked);

  const currentCustomer = (state.formData.customer || '').trim();
  const orderDate = state.formData.date || (typeof getTodayDateStr === 'function' ? getTodayDateStr() : new Date().toISOString().split('T')[0]);

  // 2. Tra cứu Bảng báo giá hợp lệ của khách hàng (nếu có)
  let activeQuotation = null;
  if (currentCustomer) {
    activeQuotation = (db.quotations || [])
      .filter(q => {
        if (!q || !q.customer) return false;
        if (q.customer.trim().toLowerCase() !== currentCustomer.toLowerCase()) return false;
        const status = (q.status || '').toLowerCase();
        if (!['accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status)) return false;
        const vBegin = q.validbegin || q.validBegin || q.date || '';
        const vUntil = q.validUntil || q.validuntil || '';
        if (vBegin && vUntil) return orderDate >= vBegin && orderDate <= vUntil;
        return true;
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  }

  // 3. Tìm sản phẩm trong Danh mục hàng hóa (db.materials)
  const mat = (db.materials || []).find(m =>
    (line.sku && m.id === line.sku) ||
    (line.name && m.name.toLowerCase() === line.name.toLowerCase())
  );

  // 4. Tìm dòng tương ứng trong Báo giá (nếu có)
  let qItem = null;
  if (activeQuotation && Array.isArray(activeQuotation.lineItems)) {
    qItem = activeQuotation.lineItems.find(q => {
      const qSku = (q.sku || q.id || '').trim().toLowerCase();
      const qName = (q.name || '').trim().toLowerCase();
      const lSku = (line.sku || '').trim().toLowerCase();
      const lName = (line.name || '').trim().toLowerCase();
      return (lSku && qSku === lSku) || (lName && qName === lName);
    });
  }

  // 5. Tính toán Đơn giá dựa theo cờ isSaleChecked
  let newUnitPrice = 0;
  if (isSaleChecked) {
    // TÍCH CHỌN: Lấy giá bán trong Báo giá -> Nếu không có lấy Giá bán (cost/price) trong Danh mục hàng hóa
    if (qItem && (qItem.unitPrice !== undefined || qItem.price !== undefined)) {
      newUnitPrice = Number(qItem.unitPrice ?? qItem.price ?? 0);
    } else if (mat) {
      newUnitPrice = Number(mat.cost ?? mat.price ?? mat.unitPrice ?? 0);
    }
  } else {
    // BỎ TÍCH CHỌN: Lấy giá thuê trong Báo giá -> Nếu không có lấy Giá thuê (hireprice/hirePrice) trong Danh mục hàng hóa
    if (qItem && (qItem.hirePrice !== undefined && qItem.hirePrice !== null)) {
      newUnitPrice = Number(qItem.hirePrice) || 0;
    } else if (mat && (mat.hireprice !== undefined || mat.hirePrice !== undefined)) {
      newUnitPrice = Number(mat.hireprice ?? mat.hirePrice ?? 0);
    } else if (mat) {
      newUnitPrice = Number(mat.unitPrice ?? mat.price ?? mat.cost ?? 0);
    }
  }

  line.unitPrice = newUnitPrice;

  // 6. ĐỒNG BỘ TRỰC TIẾP LÊN Ô INPUT ĐƠN GIÁ TRÊN GIAO DIỆN (DOM)
  const unitPriceInput = document.getElementById(`line-item-${lineId}-unitPrice`);
  if (unitPriceInput) {
    unitPriceInput.value = newUnitPrice.toLocaleString('vi-VN');
  }

  // 7. Gọi updateLine để tính lại Thành tiền và các dòng Tổng phía dưới
  if (typeof updateLine === 'function') {
    updateLine(lineId, 'unitPrice', line.unitPrice, 'number');
  } else if (typeof render === 'function') {
    render();
  }
}

// ==========================================
// CÁC HÀM XỬ LÝ SỰ KIỆN ĐƠN BÁN HÀNG (SALES ORDERS HANDLERS)
// ==========================================

// 1. Xử lý khi chọn Khách hàng trên form Đơn bán hàng
function handleOrderCustomerSelect(val) {
  const cust = (db.customers || []).find(c => c.name === val);
  const phoneInput = document.getElementById('so-phone-input');
  const checkBtn = document.getElementById('so-check-phone-btn');
  const noticeEl = document.getElementById('phoneNotice');

  if (noticeEl) noticeEl.style.display = 'none';

  if (cust) {
    if (phoneInput) phoneInput.value = cust.phone || '';
    if (checkBtn) {
      checkBtn.disabled = true;
      checkBtn.innerText = 'Kiểm Tra';
      checkBtn.style.opacity = '0.5';
      checkBtn.style.cursor = 'not-allowed';
    }
    if (state.formData) state.formData.phone = cust.phone || '';
  } else {
    if (phoneInput) phoneInput.value = '';
    if (checkBtn) {
      checkBtn.disabled = true;
      checkBtn.innerText = 'Kiểm Tra';
      checkBtn.style.opacity = '0.5';
      checkBtn.style.cursor = 'not-allowed';
    }
    if (state.formData) state.formData.phone = '';
  }
  handleCustomerSelectInOrder(val);
}

// 2. Xử lý khi gõ Số điện thoại trên form Đơn bán hàng
function handleOrderPhoneInput(phoneVal) {
  const cleanPhone = phoneVal.replace(/[^0-9]/g, '');
  const phoneInput = document.getElementById('so-phone-input');
  if (phoneInput && phoneInput.value !== cleanPhone) {
    phoneInput.value = cleanPhone;
  }

  if (state.formData) {
    state.formData.phone = cleanPhone;
    // Khi người dùng sửa số điện thoại, reset ô tên khách hàng về mặc định (rỗng)
    state.formData.customer = '';
  }

  // Đặt lại ô input tên khách hàng trên DOM nếu có
  const custInput = document.getElementById('so-customer-input') || document.querySelector('input[data-field="customer"]');
  if (custInput) custInput.value = '';

  const checkBtn = document.getElementById('so-check-phone-btn');
  const noticeEl = document.getElementById('phoneNotice');

  if (noticeEl) noticeEl.style.display = 'none';

  if (!checkBtn) return;

  if (cleanPhone.trim().length > 0) {
    checkBtn.disabled = false;
    checkBtn.innerText = 'Kiểm Tra';
    checkBtn.style.opacity = '1';
    checkBtn.style.cursor = 'pointer';
    checkBtn.onclick = handleCheckOrAddCustomerPhone;
  } else {
    checkBtn.disabled = true;
    checkBtn.innerText = 'Kiểm Tra';
    checkBtn.style.opacity = '0.5';
    checkBtn.style.cursor = 'not-allowed';
  }
}

// 3. Kiểm tra số điện thoại hoặc gợi ý thêm mới
function handleCheckOrAddCustomerPhone() {
  const phoneInput = document.getElementById('so-phone-input');
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const btnCheck = document.getElementById('so-check-phone-btn');
  const noticeEl = document.getElementById('phoneNotice');

  if (!phone) return;

  const foundCustomer = (db.customers || []).find(c => (c.phone || '').trim() === phone);

  if (!foundCustomer) {
    // 1. Reset tên khách hàng trong state về rỗng
    if (state.formData) {
      state.formData.customer = '';
    }

    // 2. Cập nhật thẻ select trên DOM về option mặc định (giá trị rỗng)
    const selectCust = document.querySelector('select[onchange*="handleOrderCustomerSelect"]') ||
      document.getElementById('so-customer-select');
    if (selectCust) selectCust.value = '';

    if (noticeEl) {
      noticeEl.innerText = "⚠ Khách hàng chưa có trong hệ thống";
      noticeEl.style.display = "block";
    }

    if (btnCheck) {
      btnCheck.innerText = "Thêm mới";
      btnCheck.disabled = false;
      btnCheck.style.opacity = '1';
      btnCheck.style.cursor = 'pointer';
      btnCheck.onclick = function () {
        if (typeof openQuickCustomerDrawer === 'function') {
          openQuickCustomerDrawer(phone);
        }
      };
    }
  } else {
    if (noticeEl) noticeEl.style.display = "none";
    if (state.formData) {
      state.formData.customer = foundCustomer.name || '';
      state.formData.phone = foundCustomer.phone || '';
    }

    // Đồng bộ lại thẻ select khách hàng
    const selectCust = document.querySelector('select[onchange*="handleOrderCustomerSelect"]') ||
      document.getElementById('so-customer-select');
    if (selectCust) selectCust.value = foundCustomer.name;

    if (typeof handleCustomerSelectInOrder === 'function') {
      handleCustomerSelectInOrder(foundCustomer.name);
    }
  }
}

// 4. Mở Drawer Thêm nhanh khách hàng
function openQuickCustomerDrawer(phoneStr) {
  const validPhone = (typeof phoneStr === 'string' || typeof phoneStr === 'number')
    ? phoneStr
    : (state.formData ? state.formData.phone || '' : '');

  let drawer = document.getElementById('quick-customer-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'quick-customer-drawer';
    drawer.className = 'customer-drawer';
    document.body.appendChild(drawer);
  }

  drawer.innerHTML = `
    <div class="drawer-overlay" onclick="closeQuickCustomerDrawer()"></div>
    <div class="drawer-content">
      <div class="drawer-header">
        <h3>Thêm Nhanh Khách Hàng</h3>
        <button type="button" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--foreground);" onclick="closeQuickCustomerDrawer()">✕</button>
      </div>
      <div class="drawer-body">
        <form onsubmit="event.preventDefault(); saveQuickCustomer();">
          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label">Tên Công ty / Khách hàng *</label>
            <input type="text" id="quick-cust-name" class="form-input" required placeholder="Nhập tên khách hàng..." oninput="this.value = toTitleCase(this.value);">
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <label class="form-label">Số Điện Thoại *</label>
            <input type="tel" id="quick-cust-phone" class="form-input" value="${validPhone}" required placeholder="090x xxx xxx" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label">Địa Chỉ</label>
            <input type="text" id="quick-cust-address" class="form-input" placeholder="Nhập địa chỉ...">
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn-cancel" onclick="closeQuickCustomerDrawer()">Hủy</button>
            <button type="submit" class="btn-submit">Lưu Khách Hàng</button>
          </div>
        </form>
      </div>
    </div>
  `;

  setTimeout(() => drawer.classList.add('open'), 10);
}

// 5. Đóng Drawer Thêm nhanh khách hàng
function closeQuickCustomerDrawer() {
  const drawer = document.getElementById('quick-customer-drawer');
  if (drawer) {
    drawer.classList.remove('open');
  }
}

// 6. Lưu Khách hàng tạo nhanh
// 6. Lưu Khách hàng tạo nhanh
async function saveQuickCustomer() {
  const nameVal = (document.getElementById('quick-cust-name')?.value || '').trim();
  const phoneVal = (document.getElementById('quick-cust-phone')?.value || '').trim();
  const addressVal = (document.getElementById('quick-cust-address')?.value || '').trim();

  if (!nameVal || !phoneVal) {
    if (typeof showAlert === 'function') {
      showAlert('Vui lòng nhập Tên và Số điện thoại khách hàng!', 'Cảnh báo');
    } else {
      alert('Vui lòng nhập Tên và Số điện thoại khách hàng!');
    }
    return;
  }

  const session = typeof getAuthSession === 'function' ? getAuthSession() : null;
  const currentUserId = session?.currentUser?.id || session?.user?.id || 'Hệ Thống';
  const currentDate = typeof getTodayDateStr === 'function' ? getTodayDateStr() : new Date().toISOString().split('T')[0];
  const currentTime = typeof getCurrentTimeStr === 'function' ? getCurrentTimeStr() : new Date().toTimeString().split(' ')[0];

  const newCust = {
    id: typeof generateAutoId === 'function' ? generateAutoId('customers') : ('KH' + Date.now()),
    name: nameVal,
    contact: nameVal,
    phone: phoneVal,
    address: addressVal,
    diachi: addressVal,
    type: 'Khách vãng lai',
    paymentterms: 'Thanh toán ngay',
    paymentTerms: 'Thanh toán ngay',
    status: 'active',
    creditlimit: 0,
    creditLimit: 0,
    user_id0: currentUserId,
    date0: currentDate,
    time0: currentTime,
    user_id2: currentUserId,
    date2: currentDate,
    time2: currentTime
  };

  try {
    if (typeof supabaseClient !== 'undefined') {
      const { data, error } = await supabaseClient
        .from('customers')
        .insert([newCust])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        if (!db.customers) db.customers = [];
        db.customers.unshift(data[0]);
      }
    } else {
      if (!db.customers) db.customers = [];
      db.customers.unshift(newCust);
    }

    if (state.formData) {
      state.formData.customer = nameVal;
      state.formData.phone = phoneVal;
    }

    closeQuickCustomerDrawer();
    if (typeof showToast === 'function') showToast('Thêm mới dữ liệu thành công!', 'success');
    if (typeof render === 'function') render();

  } catch (err) {
    console.error('Lỗi khi thêm nhanh khách hàng vào Database:', err);
    if (typeof showAlert === 'function') {
      showAlert('Thêm khách hàng thất bại: ' + (err.message || err), 'Lỗi');
    } else {
      alert('Thêm khách hàng thất bại: ' + (err.message || err));
    }
  }
}
window.saveQuickCustomer = saveQuickCustomer;

// Đảm bảo khi gọi saveForm hoặc hàm lưu khách hàng, bạn dùng await để chờ ghi vào database thành công:
async function handleSaveCustomer() {
  if (!checkModulePermission('customers')) {
    alert('Tài khoản của bạn chỉ có quyền xem, không thể thực hiện thao tác lưu!');
    return;
  }

  // Khai báo biến session để lấy thông tin người dùng hiện tại
  const session = typeof getAuthSession === 'function' ? getAuthSession() : null;

  const formData = state.formData || {};
  if (!formData.name || !formData.phone) {
    alert('Vui lòng nhập đầy đủ Tên và Số điện thoại khách hàng!');
    return;
  }

  try {
    if (typeof supabaseClient !== 'undefined') {
      const payload = {
        id: formData.id || ('KH' + Date.now()),
        name: formData.name.trim(),
        contact: formData.contact || formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address || '',
        email: formData.email || '',
        type: formData.type || 'Khách vãng lai',
        paymentterms: formData.paymentterms || 'Thanh toán ngay',
        status: 'active',
        user_id0: session?.currentUser?.id || session?.user?.id || 'Hệ Thống',
        date0: new Date().toISOString().split('T')[0],
        time0: new Date().toTimeString().split(' ')[0]
      };

      const { data, error } = await supabaseClient
        .from('customers')
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        if (!db.customers) db.customers = [];
        db.customers.unshift(data[0]);
      }
    }

    if (typeof closeDrawer === 'function') closeDrawer();
    if (typeof showToast === 'function') {
      showToast('Lưu khách hàng vào database thành công!', 'success');
    }
    if (typeof render === 'function') render();

  } catch (err) {
    console.error('Lỗi khi lưu khách hàng vào database:', err);
    alert('Lưu thất bại: ' + (err.message || err));
  }
}

function getSalesAnalyticsData() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const monthLabels = [];
  const monthlyMap = {};

  for (let i = 8; i >= 0; i--) {
    let d = new Date(currentYear, currentMonth - 1 - i, 1);
    let y = d.getFullYear();
    let m = d.getMonth() + 1;
    let key = `${y}-${String(m).padStart(2, '0')}`;
    let label = `Tháng ${m}`;
    monthLabels.push({ key, label, year: y, month: m });
    monthlyMap[key] = { month: label, revenue: 0, orders: 0, returns: 0 };
  }

  let currentMonthRevenue = 0;
  let currentMonthOrders = 0;

  (db.orders || []).forEach(o => {
    const status = (o.status || '').toLowerCase();
    if (['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status)) {
      const dateStr = o.date || '';
      const key = dateStr.substring(0, 7);
      const total = Number(o.total || 0);

      if (monthlyMap[key]) {
        monthlyMap[key].revenue += total;
        monthlyMap[key].orders += 1;
      }

      const currentKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
      if (key === currentKey) {
        currentMonthRevenue += total;
        currentMonthOrders += 1;
      }
    }
  });

  (db.returns || []).forEach(r => {
    const status = (r.status || '').toLowerCase();
    if (['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status)) {
      const dateStr = r.date || '';
      const key = dateStr.substring(0, 7);
      if (monthlyMap[key]) {
        monthlyMap[key].returns += 1;
      }
    }
  });

  const salesDataReal = monthLabels.map(m => monthlyMap[m.key]);

  let ytdRevenue = 0;
  let ytdOrders = 0;
  (db.orders || []).forEach(o => {
    const status = (o.status || '').toLowerCase();
    if (['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status)) {
      if (o.date && o.date.startsWith(String(currentYear))) {
        ytdRevenue += Number(o.total || 0);
        ytdOrders += 1;
      }
    }
  });

  const customerMap = {};
  (db.orders || []).forEach(o => {
    const status = (o.status || '').toLowerCase();
    if (['completed', 'hoàn thành', 'đã xử lý', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status)) {
      const cName = o.customer || 'Khách lẻ';
      if (!customerMap[cName]) customerMap[cName] = { name: cName, revenue: 0, orders: 0 };
      customerMap[cName].revenue += Number(o.total || 0);
      customerMap[cName].orders += 1;
    }
  });

  const topCustomersReal = Object.values(customerMap).sort((a, b) => b.revenue - a.revenue);

  const getActorFullName = (userId) => {
    if (!userId) return '';
    const userList = db.userinfo || db.users || db.user_info || [];
    const matchedUser = userList.find(u => String(u.id) === String(userId));
    if (matchedUser) {
      return matchedUser.fullname || matchedUser.full_name || matchedUser.username || String(userId);
    }
    return String(userId);
  };

  const allActivities = [];

  const extractActivityInfo = (item, defaultTypeLabel) => {
    const isUpdated = Boolean(item.date2 && String(item.date2).trim() !== '');
    const dStr = isUpdated ? item.date2 : (item.date0 || item.date || item.createdAt);
    const tStr = isUpdated ? (item.time2 || '00:00:00') : (item.time0 || item.time || '00:00:00');

    let timestamp = 0;
    let formattedTime = '—';

    if (dStr) {
      const cleanDate = typeof fmtDateStr === 'function' ? fmtDateStr(dStr) : dStr;
      const cleanTime = tStr ? tStr.substring(0, 5) : '';
      formattedTime = `${cleanDate} ${cleanTime}`.trim();

      const fullDateTime = `${dStr} ${tStr}`.trim();
      const pDate = new Date(fullDateTime);
      timestamp = isNaN(pDate.getTime()) ? new Date(dStr).getTime() : pDate.getTime();
      if (isNaN(timestamp)) timestamp = 0;
    }

    const actionText = isUpdated ? `Cập nhật ${defaultTypeLabel}` : `Tạo mới ${defaultTypeLabel}`;
    return { isUpdated, timestamp, formattedTime, actionText };
  };

  (db.notifications || []).forEach(n => {
    const formattedDate = typeof fmtDateStr === 'function' ? fmtDateStr(n.date || n.created_at) : (n.date || n.created_at);
    const timeStr = n.time ? n.time.substring(0, 5) : '';
    const fullDateTime = `${formattedDate} ${timeStr}`.trim();

    const fullStr = `${n.date || n.created_at} ${n.time || ''}`.trim();
    const pDate = new Date(fullStr);
    let ts = pDate.getTime();
    if (isNaN(ts)) ts = 0;

    allActivities.push({
      timestamp: ts,
      time: fullDateTime || '—',
      event: n.title || 'Thông báo',
      detail: n.detail || '',
      actor: getActorFullName(n.actor || n.user_id || n.user_fullname),
      targetView: n.targetview || n.type || '',
      itemId: n.itemid || ''
    });
  });

  (db.orders || []).forEach(o => {
    const info = extractActivityInfo(o, 'đơn hàng');
    allActivities.push({
      timestamp: info.timestamp,
      time: info.formattedTime,
      event: info.actionText,
      detail: `Mã phiếu: ${o.id || ''} - Khách: ${o.customer || 'Khách lẻ'} (${typeof fmtUSD === 'function' ? fmtUSD(o.total || 0) : o.total})`,
      actor: getActorFullName(o.user_id2 || o.user_id0),
      targetView: 'sales-orders',
      itemId: o.id
    });
  });

  (db.quotations || []).forEach(q => {
    const info = extractActivityInfo(q, 'báo giá');
    allActivities.push({
      timestamp: info.timestamp,
      time: info.formattedTime,
      event: info.actionText,
      detail: `Mã phiếu: ${q.id || ''} - Khách: ${q.customer || 'Khách hàng'}`,
      actor: getActorFullName(q.user_id2 || q.user_id0),
      targetView: 'quotations',
      itemId: q.id
    });
  });

  (db.returns || []).forEach(r => {
    const info = extractActivityInfo(r, 'phiếu trả hàng');
    allActivities.push({
      timestamp: info.timestamp,
      time: info.formattedTime,
      event: info.actionText,
      detail: `Mã phiếu: ${r.id || ''} - Khách: ${r.customer || 'Khách hàng'}`,
      actor: getActorFullName(r.user_id2 || r.user_id0),
      targetView: 'returns',
      itemId: r.id
    });
  });

  (db.grns || []).forEach(g => {
    const info = extractActivityInfo(g, 'phiếu nhập kho');
    allActivities.push({
      timestamp: info.timestamp,
      time: info.formattedTime,
      event: info.actionText,
      detail: `Mã phiếu: ${g.id || ''} - NCC: ${g.supplier || 'Nhà cung cấp'}`,
      actor: getActorFullName(g.user_id2 || g.user_id0),
      targetView: 'grn',
      itemId: g.id
    });
  });

  allActivities.sort((a, b) => b.timestamp - a.timestamp);
  const recentActivityReal = allActivities.slice(0, 6).map(item => ({
    time: item.time,
    event: item.event,
    detail: item.detail,
    actor: item.actor,
    targetView: item.targetView,
    itemId: item.itemId
  }));

  return {
    salesDataReal,
    currentMonthRevenue,
    currentMonthOrders,
    ytdRevenue,
    ytdOrders,
    topCustomersReal,
    recentActivityReal
  };
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const eyeIcon = document.getElementById('eye-icon');

  if (!pwdInput) return;

  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    eyeIcon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    `;
  } else {
    pwdInput.type = 'password';
    eyeIcon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    `;
  }
}

function normalizeSearchText(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFC')
    .toLowerCase()
    .trim();
}

// ==========================================
// HÀM BỔ TRỢ CHUNG: TẠO VÀ CHIA SẺ FILE PDF QUA ZALO / TẢI VỀ PC
// ==========================================
async function generateAndSharePDF(htmlElement, fileName, shareTitle) {
  if (typeof html2pdf === 'undefined') {
    showAlert('Thư viện html2pdf chưa được tải, vui lòng kiểm tra kết nối mạng!', 'Lỗi');
    return;
  }

  const fullFileName = `${fileName}.pdf`;
  const opt = {
    margin: [6, 8, 6, 8],
    filename: fullFileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: {
      mode: ['css', 'legacy'],
      avoid: ['tr', '.signature-block']
    }
  };

  try {
    const worker = html2pdf().set(opt).from(htmlElement);
    const pdfBlob = await worker.output('blob');

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.canShare) {
      const file = new File([pdfBlob], fullFileName, { type: 'application/pdf' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: shareTitle,
            text: `Gửi ${shareTitle} qua Zalo`
          });
          return;
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') {
            console.warn('Lỗi khi chia sẻ trên Mobile:', shareErr);
          }
          return;
        }
      }
    }

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Lỗi khi xuất PDF:', err);
    showAlert('Có lỗi xảy ra trong quá trình tạo file PDF!', 'Lỗi');
  }
}

// ==========================================
// 1. XUẤT PDF BẢNG BÁO GIÁ
// ==========================================
async function exportQuotationToPDF() {
  const d = state.formData;
  if (!d) return;

  const custAddress = getCustomerAddress(d.customer);
  const { dayStr, monthStr, yearStr } = parseDateParts(d.date);
  const fromDateVN = formatDateVN(d.validbegin || d.validBegin || d.date);
  const toDateVN = formatDateVN(d.validUntil || d.validuntil);
  const items = (d.lineItems || d.lineitems || []);

  let totalQty = 0;
  let totalAmount = 0;

  const maxRows = Math.max(items.length, 12);
  let rowsHtml = '';

  for (let i = 0; i < maxRows; i++) {
    if (i < items.length) {
      const l = items[i];
      const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
      const unitName = mat ? (mat.unit || '—') : (l.unit || '—');
      const qty = Number(l.qty) || 0;
      const price = Number(l.unitPrice) || 0;
      const discount = Number(l.discount) || 0;
      const tax = Number(l.tax) || 0;

      const lineSub = qty * price * (1 - discount / 100);
      const lineTotal = lineSub * (1 + tax / 100);

      totalQty += qty;
      totalAmount += lineTotal;

      rowsHtml += `
       <tr style="height: 24px; page-break-inside: avoid; break-inside: avoid;">
          <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px 3px;">${i + 1}</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 10pt; padding: 2px 5px;">${l.name || ''}</td>
          <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px 3px;">${unitName}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${price ? Math.round(price).toLocaleString('vi-VN') : ''}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${qty ? qty.toLocaleString('vi-VN') : ''}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${discount ? discount + '%' : '0%'}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${tax ? tax + '%' : '0%'}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${lineTotal ? Math.round(lineTotal).toLocaleString('vi-VN') : ''}</td>
        </tr>
      `;
    } else {
      rowsHtml += `
       <tr style="height: 24px; page-break-inside: avoid; break-inside: avoid;">
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
        </tr>
      `;
    }
  }

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.boxSizing = 'border-box';
  container.style.padding = '0px';
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = "'Times New Roman', serif";

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 10pt; page-break-inside: auto; margin-bottom: 6px;">
      <tr>
        <td style="width: 50%; font-size: 9.5pt; text-align: center; vertical-align: top; line-height: 1.3;">
          ĐC: Số 9 - Ngách 35A/2 - đường Tiền Thái 1<br>
          Xã Sơn Đồng – TP Hà Nội<br>
          ĐT: 0936.35.31.37
        </td>
        <td style="width: 50%; font-size: 9.5pt; text-align: center; vertical-align: top; line-height: 1.3;">
          Giấy phép ĐKKD số: 01U8005300<br>
          Địa chỉ nhận hóa đơn: nhambc@gmail.com<br>
          MST: 0110640531
        </td>
      </tr>
    </table>

    <div style="font-size: 15pt; font-weight: bold; text-align: center; margin: 10px 0 10px 0;">
      CÔNG TY TNHH THƯƠNG MẠI HOA QUẢ MINH KHUÊ
    </div>

    <table style="width: 100%; font-size: 10.5pt; margin-bottom: 8px; border-collapse: collapse; line-height: 1.5;">
      <tr>
        <td style="width: 50%; padding: 1px 0; vertical-align: top;">Khách hàng: ${d.customer || ''}</td>
        <td style="width: 50%; padding: 1px 0; text-align: left; vertical-align: top;">Bảng báo giá: ${d.id || ''}</td>
      </tr>
      <tr>
        <td style="padding: 1px 0;">Địa chỉ: ${custAddress}</td>
        <td style="padding: 1px 0; text-align: left;">Ngày hiệu lực: từ ngày ${fromDateVN} - đến ngày ${toDateVN}</td>
      </tr>
    </table>

    <div style="border: 1.5px solid #000000; box-sizing: border-box;">
      <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
        <thead>
          <tr style="background-color: #8db4e2; font-weight: bold; text-align: center; height: 24px;">
            <td style="border: 1px solid #000000; width: 4%;">STT</td>
            <td style="border: 1px solid #000000; width: 32%;">Tên Hàng</td>
            <td style="border: 1px solid #000000; width: 8%;">ĐVT</td>
            <td style="border: 1px solid #000000; width: 12%;">Đơn Giá</td>
            <td style="border: 1px solid #000000; width: 11%;">Số Lượng</td>
            <td style="border: 1px solid #000000; width: 8%;">CK%</td>
            <td style="border: 1px solid #000000; width: 8%;">Thuế%</td>
            <td style="border: 1px solid #000000; width: 17%;">Thành Tiền</td>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="height: 24px; font-weight: bold; page-break-inside: avoid; break-inside: avoid;">
            <td colspan="4" style="border: 1px solid #000000; text-align: center;">Tổng Cộng</td>
            <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalQty ? totalQty.toLocaleString('vi-VN') : ''}</td>
            <td style="border: 1px solid #000000;"></td>
            <td style="border: 1px solid #000000;"></td>
            <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalAmount ? Math.round(totalAmount).toLocaleString('vi-VN') : ''}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="signature-block" style="margin-top: 12px; display: flex; justify-content: flex-end; page-break-inside: avoid; break-inside: avoid;">
      <div style="width: 240px; text-align: center; font-size: 10pt;">
        <div>Hà Nội, ngày ${dayStr} tháng ${monthStr} năm ${yearStr}</div>
        <div style="font-weight: bold; margin-top: 4px; margin-bottom: 45px;">Đại diện nhà cung cấp</div>
        <div style="font-weight: bold;">BÙI CAO NHÂM</div>
      </div>
    </div>
  `;

  await generateAndSharePDF(container, `BaoGia_${d.id || 'Export'}`, `Bảng Báo Giá ${d.id || ''}`);
}

// ==========================================
// 2. XUẤT PDF ĐƠN BÁN HÀNG
// ==========================================
async function exportSalesOrderToPDF() {
  const d = state.formData;
  if (!d) return;

  const custAddress = getCustomerAddress(d.customer);
  const { dayStr, monthStr, yearStr } = parseDateParts(d.date);
  const items = (d.lineItems || d.lineitems || []);

  let totalQty = 0;
  let totalAmount = 0;

  const maxRows = Math.max(items.length, 12);
  let rowsHtml = '';

  for (let i = 0; i < maxRows; i++) {
    if (i < items.length) {
      const l = items[i];
      const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
      const unitName = mat ? (mat.unit || '—') : (l.unit || '—');
      const qty = Number(l.qty) || 0;
      const price = Number(l.unitPrice) || 0;
      const discount = Number(l.discount) || 0;
      const tax = Number(l.tax) || 0;

      const lineSub = qty * price * (1 - discount / 100);
      const lineTotal = lineSub * (1 + tax / 100);

      totalQty += qty;
      totalAmount += lineTotal;

      rowsHtml += `
        <tr style="height: 24px; page-break-inside: avoid; break-inside: avoid;">
          <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px 3px;">${i + 1}</td>
          <td style="border: 1px solid #000; text-align: left; font-size: 10pt; padding: 2px 5px;">${l.name || ''}</td>
          <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px 3px;">${unitName}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${price ? Math.round(price).toLocaleString('vi-VN') : ''}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${qty ? qty.toLocaleString('vi-VN') : ''}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${discount ? discount + '%' : '0%'}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${tax ? tax + '%' : '0%'}</td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${lineTotal ? Math.round(lineTotal).toLocaleString('vi-VN') : ''}</td>
        </tr>
      `;
    } else {
      rowsHtml += `
        <tr style="height: 24px; page-break-inside: avoid; break-inside: avoid;">
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
        </tr>
      `;
    }
  }

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.boxSizing = 'border-box';
  container.style.padding = '0px';
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = "'Times New Roman', serif";

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 10pt; page-break-inside: auto; margin-bottom: 6px;">
      <tr>
        <td style="width: 50%; font-size: 9.5pt; text-align: center; vertical-align: top; line-height: 1.3;">
          ĐC: Số 9 - Ngách 35A/2 - đường Tiền Thái 1<br>
          Xã Sơn Đồng – TP Hà Nội<br>
          ĐT: 0936.35.31.37
        </td>
        <td style="width: 50%; font-size: 9.5pt; text-align: center; vertical-align: top; line-height: 1.3;">
          Giấy phép ĐKKD số: 01U8005300<br>
          Địa chỉ nhận hóa đơn: nhambc@gmail.com<br>
          MST: 0110640531
        </td>
      </tr>
    </table>

    <div style="font-size: 15pt; font-weight: bold; text-align: center; margin: 10px 0 10px 0;">
      CÔNG TY TNHH THƯƠNG MẠI HOA QUẢ MINH KHUÊ
    </div>

    <table style="width: 100%; font-size: 10.5pt; margin-bottom: 8px; border-collapse: collapse; line-height: 1.5;">
      <tr>
        <td style="width: 50%; padding: 1px 0; vertical-align: top;">Khách hàng: ${d.customer || ''}</td>
        <td style="width: 50%; padding: 1px 0; text-align: left; vertical-align: top;">Đơn hàng bán: ${d.id || ''}</td>
      </tr>
      <tr>
        <td style="padding: 1px 0;">Địa chỉ: ${custAddress}</td>
        <td style="padding: 1px 0; text-align: left;">Ghi chú: ${d.notes || ''}</td>
      </tr>
    </table>

    <div style="border: 1.5px solid #000000; box-sizing: border-box;">
      <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
        <thead>
          <tr style="background-color: #8db4e2; font-weight: bold; text-align: center; height: 24px;">
            <td style="border: 1px solid #000000; width: 4%;">STT</td>
            <td style="border: 1px solid #000000; width: 32%;">Tên Hàng</td>
            <td style="border: 1px solid #000000; width: 8%;">ĐVT</td>
            <td style="border: 1px solid #000000; width: 12%;">Đơn Giá</td>
            <td style="border: 1px solid #000000; width: 11%;">Số Lượng</td>
            <td style="border: 1px solid #000000; width: 8%;">CK%</td>
            <td style="border: 1px solid #000000; width: 8%;">Thuế%</td>
            <td style="border: 1px solid #000000; width: 17%;">Thành Tiền</td>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="height: 24px; font-weight: bold; page-break-inside: avoid; break-inside: avoid;">
            <td colspan="4" style="border: 1px solid #000000; text-align: center;">Tổng Cộng</td>
            <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalQty ? totalQty.toLocaleString('vi-VN') : ''}</td>
            <td style="border: 1px solid #000000;"></td>
            <td style="border: 1px solid #000000;"></td>
            <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalAmount ? Math.round(totalAmount).toLocaleString('vi-VN') : ''}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="signature-block" style="margin-top: 12px; display: flex; justify-content: flex-end; page-break-inside: avoid; break-inside: avoid;">
      <div style="width: 240px; text-align: center; font-size: 10pt;">
        <div>Hà Nội, ngày ${dayStr} tháng ${monthStr} năm ${yearStr}</div>
        <div style="font-weight: bold; margin-top: 4px; margin-bottom: 45px;">Đại diện nhà cung cấp</div>
        <div style="font-weight: bold;">BÙI CAO NHÂM</div>
      </div>
    </div>
  `;

  await generateAndSharePDF(container, `DonHang_${d.id || 'Export'}`, `Đơn Bán Hàng ${d.id || ''}`);
}

// ==========================================
// 3. XUẤT PDF BÁO CÁO BÁN HÀNG (TỔNG HỢP & CHI TIẾT)
// ==========================================
async function exportSalesReportToPDF() {
  const selectedCustomer = state.reportSalesCustomer || '';
  const selectedMonth = state.reportSalesMonth || (new Date().getMonth() + 1);
  const currentYear = new Date().getFullYear();
  const reportType = state.reportType || 'summary';
  const isDetail = reportType === 'detail';

  const custAddress = selectedCustomer ? getCustomerAddress(selectedCustomer) : 'Tất cả địa chỉ';
  const { dayStr, monthStr, yearStr } = parseDateParts(getTodayDateStr());

  const resolveUnit = (sku, name, itemUnit) => {
    if (itemUnit && itemUnit !== '—') return itemUnit;
    const mat = (db.materials || []).find(m => (sku && m.id === sku) || (name && m.name === name));
    return (mat && mat.unit) ? mat.unit : '—';
  };

  const filteredOrders = (db.orders || []).filter(o => {
    const status = (o.status || '').toLowerCase();
    const isValidStatus = ['completed', 'hoàn thành', 'accepted', 'approved', 'duyệt', 'đã duyệt'].includes(status);
    if (!isValidStatus || !o.date) return false;
    const parts = o.date.split('-');
    return parts.length >= 2 && parseInt(parts[0], 10) === currentYear && parseInt(parts[1], 10) == selectedMonth;
  });

  let rowsHtml = '';
  let totalQty = 0;
  let totalAmount = 0;

  if (!isDetail) {
    const itemSummaryMap = {};
    filteredOrders.forEach(o => {
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
          const unit = resolveUnit(sku, name, item.unit);

          if (!itemSummaryMap[sku]) {
            itemSummaryMap[sku] = { sku, name, unit, qty: 0, totalAmount: 0 };
          }
          itemSummaryMap[sku].qty += qty;
          itemSummaryMap[sku].totalAmount += lineTotal;
        });
      }
    });

    const itemList = Object.values(itemSummaryMap).sort((a, b) => b.totalAmount - a.totalAmount);
    const maxRows = Math.max(itemList.length, 12);

    for (let i = 0; i < maxRows; i++) {
      if (i < itemList.length) {
        const it = itemList[i];
        totalQty += it.qty;
        totalAmount += it.totalAmount;
        rowsHtml += `
          <tr style="height: 22px; page-break-inside: avoid; break-inside: avoid;">
            <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px;">${i + 1}</td>
            <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px;">${it.sku}</td>
            <td style="border: 1px solid #000; text-align: left; font-size: 10pt; padding: 2px 5px;">${it.name}</td>
            <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px;">${it.unit}</td>
            <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${it.qty ? it.qty.toLocaleString('vi-VN') : '0'}</td>
            <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${it.totalAmount ? Math.round(it.totalAmount).toLocaleString('vi-VN') : '0'}</td>
          </tr>
        `;
      } else {
        rowsHtml += `
          <tr style="height: 22px; page-break-inside: avoid; break-inside: avoid;">
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
          </tr>
        `;
      }
    }

  } else {
    const customerOrders = filteredOrders.filter(o =>
      o.customer && o.customer.trim().toLowerCase() === selectedCustomer.trim().toLowerCase()
    );

    const dailyMap = {};
    customerOrders.forEach(o => {
      const orderDateStr = o.date;
      if (!dailyMap[orderDateStr]) dailyMap[orderDateStr] = [];
      dailyMap[orderDateStr].push(o);
    });

    const sortedDates = Object.keys(dailyMap).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(dateStr => {
      const dateParts = dateStr.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      const dayOrders = dailyMap[dateStr];
      dayOrders.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));

      let dayTotalQty = 0;
      let dayTotalAmount = 0;
      let dayRowsHtml = '';

      dayOrders.forEach(o => {
        const items = Array.isArray(o.lineItems || o.lineitems) ? (o.lineItems || o.lineitems) : [];

        let orderTotalQty = 0;
        let orderTotalAmount = 0;
        let orderItemsHtml = '';

        items.forEach(item => {
          const qty = Number(item.qty || 0);
          const price = Number(item.unitPrice || 0);
          const disc = Number(item.discount || 0);
          const tax = Number(item.tax || 0);
          const lineSub = qty * price * (1 - disc / 100);
          const lineTotal = lineSub * (1 + tax / 100);
          const sku = item.sku || '—';
          const name = item.name || '—';
          const unit = resolveUnit(sku, name, item.unit);

          orderTotalQty += qty;
          orderTotalAmount += lineTotal;

          orderItemsHtml += `
            <tr style="height: 22px; page-break-inside: avoid; break-inside: avoid;">
              <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px;"></td>
              <td style="border: 1px solid #000; text-align: left; font-size: 10pt; padding: 2px 5px;">${name}</td>
              <td style="border: 1px solid #000; text-align: center; font-size: 10pt; padding: 2px;">${unit}</td>
              <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${qty ? qty.toLocaleString('vi-VN') : '0'}</td>
              <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${price ? Math.round(price).toLocaleString('vi-VN') : '0'}</td>
              <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${lineTotal ? Math.round(lineTotal).toLocaleString('vi-VN') : '0'}</td>
            </tr>
          `;
        });

        dayTotalQty += orderTotalQty;
        dayTotalAmount += orderTotalAmount;
        totalQty += orderTotalQty;
        totalAmount += orderTotalAmount;

        const orderHeaderHtml = `
          <tr style="height: 22px; background-color: #8db5e251; font-weight: bold; page-break-inside: avoid; break-inside: avoid;">
            <td style="border: 1px solid #000; text-align: left; font-size: 10pt; padding: 2px 5px; color: #d97706;">${o.id || '—'}</td>
            <td style="border: 1px solid #000; text-align: left; font-size: 10pt; padding: 2px 5px; font-weight: normal;">${o.notes || '—'}</td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${orderTotalQty ? orderTotalQty.toLocaleString('vi-VN') : '0'}</td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px;">${orderTotalAmount ? Math.round(orderTotalAmount).toLocaleString('vi-VN') : '0'}</td>
          </tr>
        `;

        dayRowsHtml += orderHeaderHtml + orderItemsHtml;
      });

      rowsHtml += `
        <tr style="height: 22px; background-color: #8db5e251; font-weight: bold; page-break-inside: avoid; break-inside: avoid;">
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000; text-align: left; font-size: 10pt; padding: 2px 5px; color: #d97706;">${formattedDate}</td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px; color: #d97706;">${dayTotalQty ? dayTotalQty.toLocaleString('vi-VN') : '0'}</td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000; text-align: right; font-size: 10pt; padding: 2px 5px; color: #d97706;">${dayTotalAmount ? Math.round(dayTotalAmount).toLocaleString('vi-VN') : '0'}</td>
        </tr>
      ` + dayRowsHtml;
    });
  }

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.boxSizing = 'border-box';
  container.style.padding = '0px';
  container.style.background = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = "'Times New Roman', serif";

  const tableHeaderHtml = !isDetail ? `
    <tr style="background-color: #8db4e2; font-weight: bold; text-align: center; height: 24px;">
      <td style="border: 1px solid #000000; width: 6%;">STT</td>
      <td style="border: 1px solid #000000; width: 18%;">Mã Hàng (SKU)</td>
      <td style="border: 1px solid #000000; width: 38%;">Tên Hàng</td>
      <td style="border: 1px solid #000000; width: 10%;">ĐVT</td>
      <td style="border: 1px solid #000000; width: 12%;">Tổng Số Lượng</td>
      <td style="border: 1px solid #000000; width: 16%;">Tổng Số Tiền</td>
    </tr>
  ` : `
    <tr style="background-color: #8db4e2; font-weight: bold; text-align: center; height: 24px;">
      <td style="border: 1px solid #000000; width: 18%;">Đơn Hàng Bán</td>
      <td style="border: 1px solid #000000; width: 35%;">Tên Hàng</td>
      <td style="border: 1px solid #000000; width: 9%;">ĐVT</td>
      <td style="border: 1px solid #000000; width: 11%;">Số Lượng</td>
      <td style="border: 1px solid #000000; width: 12%;">Đơn Giá</td>
      <td style="border: 1px solid #000000; width: 15%;">Thành Tiền</td>
    </tr>
  `;

  const totalRowHtml = !isDetail ? `
    <tr style="height: 24px; font-weight: bold; page-break-inside: avoid; break-inside: avoid;">
      <td colspan="4" style="border: 1px solid #000000; text-align: center;">Tổng Cộng</td>
      <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalQty ? totalQty.toLocaleString('vi-VN') : '0'}</td>
      <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalAmount ? Math.round(totalAmount).toLocaleString('vi-VN') : '0'}</td>
    </tr>
  ` : `
    <tr style="height: 24px; font-weight: bold; page-break-inside: avoid; break-inside: avoid;">
      <td colspan="3" style="border: 1px solid #000000; text-align: center;">Tổng Cộng</td>
      <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalQty ? totalQty.toLocaleString('vi-VN') : '0'}</td>
      <td style="border: 1px solid #000000;"></td>
      <td style="border: 1px solid #000000; text-align: right; padding-right: 5px;">${totalAmount ? Math.round(totalAmount).toLocaleString('vi-VN') : '0'}</td>
    </tr>
  `;

  container.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 10pt; page-break-inside: auto; margin-bottom: 6px;">
      <tr>
        <td style="width: 50%; font-size: 9.5pt; text-align: center; vertical-align: top; line-height: 1.3;">
          ĐC: Số 9 - Ngách 35A/2 - đường Tiền Thái 1<br>
          Xã Sơn Đồng – TP Hà Nội<br>
          ĐT: 0936.35.31.37
        </td>
        <td style="width: 50%; font-size: 9.5pt; text-align: center; vertical-align: top; line-height: 1.3;">
          Giấy phép ĐKKD số: 01U8005300<br>
          Địa chỉ nhận hóa đơn: nhambc@gmail.com<br>
          MST: 0110640531
        </td>
      </tr>
    </table>

    <div style="font-size: 15pt; font-weight: bold; text-align: center; margin: 10px 0 10px 0;">
      CÔNG TY TNHH THƯƠNG MẠI HOA QUẢ MINH KHUÊ
    </div>

    <table style="width: 100%; font-size: 10.5pt; margin-bottom: 8px; border-collapse: collapse; line-height: 1.5;">
      <tr>
        <td style="width: 50%; padding: 1px 0; vertical-align: top;">Khách hàng: ${selectedCustomer || 'Tất cả khách hàng'}</td>
        <td style="width: 50%; padding: 1px 0; text-align: left; vertical-align: top;">Báo cáo: tháng ${selectedMonth} năm ${currentYear}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 1px 0;">Địa chỉ: ${custAddress}</td>
      </tr>
    </table>

    <div style="border: 1.5px solid #000000; box-sizing: border-box;">
      <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
        <thead>
          ${tableHeaderHtml}
        </thead>
        <tbody>
          ${rowsHtml}
          ${totalRowHtml}
        </tbody>
      </table>
    </div>

    <div class="signature-block" style="margin-top: 12px; display: flex; justify-content: flex-end; page-break-inside: avoid; break-inside: avoid;">
      <div style="width: 240px; text-align: center; font-size: 10pt;">
        <div>Hà Nội, ngày ${dayStr} tháng ${monthStr} năm ${yearStr}</div>
        <div style="font-weight: bold; margin-top: 4px; margin-bottom: 45px;">Đại diện nhà cung cấp</div>
        <div style="font-weight: bold;">BÙI CAO NHÂM</div>
      </div>
    </div>
  `;

  const custTitle = selectedCustomer ? selectedCustomer.replace(/\s+/g, '_') : 'Tat_Ca';
  const filePrefix = isDetail ? `Bao_cao_ban_hang_chi_tiet_${custTitle}` : `Bao_cao_tong_hop_${custTitle}`;
  await generateAndSharePDF(container, filePrefix, `Báo cáo bán hàng ${isDetail ? 'Chi tiết' : 'Tổng hợp'}`);
}

// ==========================================
// 1. Xuất Excel Báo Giá
// ==========================================
function exportQuotationToExcel() {
  const d = state.formData;
  if (!d) return;

  if (typeof XLSX === 'undefined') {
    showAlert('Thư viện XLSX chưa được tải, vui lòng kiểm tra kết nối mạng!', 'Lỗi');
    return;
  }

  const custAddress = getCustomerAddress(d.customer);
  const { dayStr, monthStr, yearStr } = parseDateParts(d.date);
  const fromDateVN = formatDateVN(d.validbegin || d.validBegin || d.date);
  const toDateVN = formatDateVN(d.validUntil || d.validuntil);

  const sheetData = [
    ["ĐC: Số 9 - Ngách 35A/2 - đường Tiền Thái 1", "", "", "", "Giấy phép ĐKKD số: 01U8005300", "", "", ""],
    ["Xã Sơn Đồng – TP Hà Nội", "", "", "", "Địa chỉ nhận hóa đơn: nhambc@gmail.com", "", "", ""],
    ["ĐT: 0936.35.31.37", "", "", "", "MST: 0110640531", "", "", ""],
    ["CÔNG TY TNHH THƯƠNG MẠI HOA QUẢ MINH KHUÊ", "", "", "", "", "", "", ""],
    [`Khách hàng: ${d.customer || ''}`, "", "", "", `Bảng báo giá: ${d.id || ''}`, "", "", ""],
    [`Địa chỉ: ${custAddress}`, "", "", "", `Ngày hiệu lực: từ ngày ${fromDateVN} - đến ngày ${toDateVN}`, "", "", ""],
    [""],
    ["STT", "Tên Hàng", "ĐVT", "Đơn Giá", "Số Lượng", "CK%", "Thuế%", "Thành Tiền"]
  ];

  let totalQty = 0;
  let totalAmount = 0;
  const items = (d.lineItems || d.lineitems || []);

  items.forEach((l, idx) => {
    const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
    const unitName = mat ? (mat.unit || '—') : (l.unit || '—');
    const qty = Number(l.qty) || 0;
    const price = Number(l.unitPrice) || 0;
    const discount = Number(l.discount) || 0;
    const tax = Number(l.tax) || 0;

    const lineSub = qty * price * (1 - discount / 100);
    const lineTotal = lineSub * (1 + tax / 100);

    totalQty += qty;
    totalAmount += lineTotal;

    sheetData.push([
      idx + 1,
      l.name || '',
      unitName,
      price,
      qty,
      `${discount}%`,
      `${tax}%`,
      Math.round(lineTotal)
    ]);
  });

  sheetData.push(
    ["Tổng Cộng", "", "", "", totalQty, "", "", Math.round(totalAmount)],
    [""],
    ["", "", "", "", "", `Hà Nội, ngày ${dayStr} tháng ${monthStr} năm ${yearStr}`, "", ""],
    ["", "", "", "", "", "Đại diện nhà cung cấp", "", ""],
    [""],
    [""],
    ["", "", "", "", "", "BÙI CAO NHÂM", "", ""]
  );

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, { s: { r: 1, c: 4 }, e: { r: 1, c: 7 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, { s: { r: 2, c: 4 }, e: { r: 2, c: 7 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } }, { s: { r: 4, c: 4 }, e: { r: 4, c: 7 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, { s: { r: 5, c: 4 }, e: { r: 5, c: 7 } },
    { s: { r: sheetData.length - 7, c: 0 }, e: { r: sheetData.length - 7, c: 3 } },
    { s: { r: sheetData.length - 5, c: 5 }, e: { r: sheetData.length - 5, c: 7 } },
    { s: { r: sheetData.length - 4, c: 5 }, e: { r: sheetData.length - 4, c: 7 } },
    { s: { r: sheetData.length - 1, c: 5 }, e: { r: sheetData.length - 1, c: 7 } }
  ];

  ws['!cols'] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 10 },
    { wch: 14 },
    { wch: 10 },
    { wch: 8 },
    { wch: 8 },
    { wch: 16 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BaoGia");

  downloadOrShareXLSX(wb, `BaoGia_${d.id || 'Export'}`);
}

// ==========================================
// 2. Xuất Excel Đơn Bán Hàng
// ==========================================
function exportSalesOrderToExcel() {
  const d = state.formData;
  if (!d) return;

  if (typeof XLSX === 'undefined') {
    showAlert('Thư viện XLSX chưa được tải, vui lòng kiểm tra kết nối mạng!', 'Lỗi');
    return;
  }

  const custAddress = getCustomerAddress(d.customer);
  const { dayStr, monthStr, yearStr } = parseDateParts(d.date);

  const sheetData = [
    ["ĐC: Số 9 - Ngách 35A/2 - đường Tiền Thái 1", "", "", "", "Giấy phép ĐKKD số: 01U8005300", "", "", ""],
    ["Xã Sơn Đồng – TP Hà Nội", "", "", "", "Địa chỉ nhận hóa đơn: nhambc@gmail.com", "", "", ""],
    ["ĐT: 0936.35.31.37", "", "", "", "MST: 0110640531", "", "", ""],
    ["CÔNG TY TNHH THƯƠNG MẠI HOA QUẢ MINH KHUÊ", "", "", "", "", "", "", ""],
    [`Khách hàng: ${d.customer || ''}`, "", "", "", `Đơn hàng bán: ${d.id || ''}`, "", "", ""],
    [`Địa chỉ: ${custAddress}`, "", "", "", `Ghi chú: ${d.notes || ''}`, "", "", ""],
    [""],
    ["STT", "Tên Hàng", "ĐVT", "Đơn Giá", "Số Lượng", "CK%", "Thuế%", "Thành Tiền"]
  ];

  let totalQty = 0;
  let totalAmount = 0;
  const items = (d.lineItems || d.lineitems || []);

  items.forEach((l, idx) => {
    const mat = (db.materials || []).find(m => m.id === l.sku || m.name === l.name);
    const unitName = mat ? (mat.unit || '—') : (l.unit || '—');
    const qty = Number(l.qty) || 0;
    const price = Number(l.unitPrice) || 0;
    const discount = Number(l.discount) || 0;
    const tax = Number(l.tax) || 0;

    const lineSub = qty * price * (1 - discount / 100);
    const lineTotal = lineSub * (1 + tax / 100);

    totalQty += qty;
    totalAmount += lineTotal;

    sheetData.push([
      idx + 1,
      l.name || '',
      unitName,
      price,
      qty,
      `${discount}%`,
      `${tax}%`,
      Math.round(lineTotal)
    ]);
  });

  sheetData.push(
    ["Tổng Cộng", "", "", "", totalQty, "", "", Math.round(totalAmount)],
    [""],
    ["", "", "", "", "", `Hà Nội, ngày ${dayStr} tháng ${monthStr} năm ${yearStr}`, "", ""],
    ["", "", "", "", "", "Đại diện nhà cung cấp", "", ""],
    [""],
    [""],
    ["", "", "", "", "", "BÙI CAO NHÂM", "", ""]
  );

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, { s: { r: 1, c: 4 }, e: { r: 1, c: 7 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, { s: { r: 2, c: 4 }, e: { r: 2, c: 7 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } }, { s: { r: 4, c: 4 }, e: { r: 4, c: 7 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 3 } }, { s: { r: 5, c: 4 }, e: { r: 5, c: 7 } },
    { s: { r: sheetData.length - 7, c: 0 }, e: { r: sheetData.length - 7, c: 3 } },
    { s: { r: sheetData.length - 5, c: 5 }, e: { r: sheetData.length - 5, c: 7 } },
    { s: { r: sheetData.length - 4, c: 5 }, e: { r: sheetData.length - 4, c: 7 } },
    { s: { r: sheetData.length - 1, c: 5 }, e: { r: sheetData.length - 1, c: 7 } }
  ];

  ws['!cols'] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 10 },
    { wch: 14 },
    { wch: 10 },
    { wch: 8 },
    { wch: 8 },
    { wch: 16 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "DonHang");

  downloadOrShareXLSX(wb, `DonHang_${d.id || 'Export'}`);
}

function hasUnsavedFormData() {
  if (!['add', 'edit'].includes(state.mode)) return false;
  if (!['quotations', 'sales-orders', 'returns', 'grn'].includes(state.view)) return false;

  const d = state.formData;
  if (!d) return false;

  if (d.customer || d.supplier) return true;

  const lineItems = Array.isArray(d.lineItems) ? d.lineItems : (d.lineitems || []);
  const hasItems = lineItems.some(item => item.name && item.name.trim() !== '');

  return hasItems;
}

if (typeof BroadcastChannel !== 'undefined') {
  const syncChannel = new BroadcastChannel('app_data_sync_channel');
  syncChannel.onmessage = (event) => {
    if (event.data === 'REFRESH_DATA' && state.mode === 'list') {
      render();
    }
  };
}

// ==========================================
// CHỨC NĂNG IN TEM SẢN PHẨM (PRINT LABELS DRAWER)
// ==========================================

function initPrintLabelDrawerUI() {
  if (document.getElementById('print-label-drawer')) return;

  if (typeof QRCode === 'undefined' && !document.getElementById('qrcode-script-tag')) {
    const script = document.createElement('script');
    script.id = 'qrcode-script-tag';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    document.head.appendChild(script);
  }

  const overlay = document.createElement('div');
  overlay.id = 'print-label-overlay';
  overlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 9998;
    transition: opacity 0.3s ease;
  `;
  overlay.onclick = closePrintLabelDrawer;

  const drawer = document.createElement('div');
  drawer.id = 'print-label-drawer';
  drawer.style.cssText = `
    position: fixed;
    top: 0; right: -33.33vw;
    width: 33.33vw; height: 100vh;
    background: var(--card, #141821);
    border-left: 1px solid var(--border, rgba(255,255,255,0.1));
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: var(--font-jost, sans-serif);
    box-sizing: border-box;
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
}

function openPrintLabelDrawer() {
  initPrintLabelDrawerUI();

  const drawer = document.getElementById('print-label-drawer');
  const overlay = document.getElementById('print-label-overlay');

  window.printLabelState = {
    search: '',
    selectedSkus: new Set()
  };

  renderPrintLabelDrawerContent();

  overlay.style.display = 'block';
  setTimeout(() => {
    drawer.style.right = '0';
  }, 10);
}

function closePrintLabelDrawer() {
  const drawer = document.getElementById('print-label-drawer');
  const overlay = document.getElementById('print-label-overlay');
  if (drawer) drawer.style.right = '-33.33vw';
  if (overlay) {
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }
}

function renderPrintLabelDrawerContent() {
  const drawer = document.getElementById('print-label-drawer');
  if (!drawer) return;

  const searchKey = normalizeSearchText(window.printLabelState.search || '');

  const sortedMaterials = [...(db.materials || [])].sort((a, b) => {
    return String(b.id || '').localeCompare(String(a.id || ''), undefined, { numeric: true, sensitivity: 'base' });
  });

  const filteredMaterials = sortedMaterials.filter(m => {
    if (!searchKey) return true;
    return normalizeSearchText(m.id).includes(searchKey) || normalizeSearchText(m.name).includes(searchKey);
  });

  const selectedSet = window.printLabelState.selectedSkus;
  const isAllSelected = filteredMaterials.length > 0 && filteredMaterials.every(m => selectedSet.has(m.id));
  const selectedCount = selectedSet.size;

  const rowsHtml = filteredMaterials.map(m => {
    const isChecked = selectedSet.has(m.id);
    return `
      <div 
        style="
          display: grid; 
          grid-template-columns: 32px 90px 1fr 90px; 
          gap: 8px; 
          align-items: center; 
          padding: 10px 16px; 
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.08)); 
          cursor: pointer; 
          transition: background 0.15s;
          background: ${isChecked ? 'rgba(240, 160, 48, 0.08)' : 'transparent'};
        "
        onclick="toggleSelectPrintLabel('${m.id}')"
        onmouseover="this.style.background='var(--secondary, #1a1e26)'"
        onmouseout="this.style.background='${isChecked ? 'rgba(240, 160, 48, 0.08)' : 'transparent'}'"
      >
        <input 
          type="checkbox" 
          ${isChecked ? 'checked' : ''} 
          onclick="event.stopPropagation(); toggleSelectPrintLabel('${m.id}')"
          style="accent-color: #f0a030; cursor: pointer; width: 16px; height: 16px;"
        >
        <span style="font-family: var(--font-dm-mono, monospace); font-size: 12px; color: var(--primary, #f0a030); font-weight: 500;">${m.id}</span>
        <span style="font-size: 13px; color: var(--foreground, #ffffff); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${m.name}">${m.name}</span>
        <span style="font-family: var(--font-dm-mono, monospace); font-size: 12px; text-align: right; color: var(--muted-foreground, #a0aec0);">${fmtUSD(m.cost || 0)}</span>
      </div>
    `;
  }).join('');

  drawer.innerHTML = `
    <!-- HEADER DRAWER -->
    <div style="padding: 16px; border-bottom: 1px solid var(--border); background: var(--secondary, #1a1e26); display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-dm-mono); font-size: 13px; text-transform: uppercase; font-weight: 600; color: var(--foreground); letter-spacing: 0.05em;">IN TEM SẢN PHẨM</span>
        <button onclick="closePrintLabelDrawer()" style="background: none; border: none; color: var(--muted-foreground); cursor: pointer; padding: 4px; display: flex; align-items: center;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='var(--muted-foreground)'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); background: var(--card); padding: 0 12px; height: 36px; border-radius: 2px;">
        <span style="color: var(--muted-foreground); display: flex; align-items: center;">${Icons.search}</span>
        <input 
          type="text" 
          id="print-label-search-input"
          placeholder="Tìm theo mã SKU, tên sản phẩm..." 
          value="${window.printLabelState.search || ''}" 
          oninput="window.printLabelState.search = this.value; renderPrintLabelDrawerContent();" 
          style="background: transparent; border: none; outline: none; color: var(--foreground); font-family: var(--font-jost); font-size: 13px; width: 100%; height: 100%;"
        >
      </div>
    </div>

    <!-- BODY HEADER BAR -->
    <div style="display: grid; grid-template-columns: 32px 90px 1fr 90px; gap: 8px; align-items: center; padding: 8px 16px; background: var(--card); border-bottom: 1px solid var(--border); font-family: var(--font-dm-mono); font-size: 11px; text-transform: uppercase; color: var(--muted-foreground);">
      <input 
        type="checkbox" 
        ${isAllSelected ? 'checked' : ''} 
        onclick="toggleSelectAllPrintLabels(this.checked)"
        style="accent-color: #f0a030; cursor: pointer; width: 16px; height: 16px;"
        title="Chọn tất cả"
      >
      <span>MÃ SKU</span>
      <span>TÊN SẢN PHẨM</span>
      <span style="text-align: right;">GIÁ VỐN</span>
    </div>

    <!-- BODY LIST -->
    <div style="flex: 1; overflow-y: auto;">
      ${filteredMaterials.length > 0 ? rowsHtml : '<div style="padding: 40px; text-align: center; color: var(--muted-foreground); font-size: 12px; font-family: var(--font-dm-mono);">Không tìm thấy sản phẩm phù hợp</div>'}
    </div>

    <!-- FOOTER DRAWER -->
    <div style="padding: 16px; border-top: 1px solid var(--border); background: var(--secondary, #1a1e26); display: flex; justify-content: space-between; align-items: center;">
      <span style="font-family: var(--font-dm-mono); font-size: 12px; color: var(--muted-foreground);">
        Đã chọn: <strong style="color: #f0a030;">${selectedCount}</strong> sản phẩm
      </span>
      <button 
        id="btn-execute-print-labels"
        onclick="executePrintLabels()"
        ${selectedCount === 0 ? 'disabled style="padding: 10px 20px; background: rgba(255,255,255,0.1); border: none; border-radius: 2px; color: rgba(255,255,255,0.4); font-family: var(--font-jost); font-size: 13px; font-weight: 600; cursor: not-allowed; display: inline-flex; align-items: center; gap: 6px;"' : 'style="padding: 10px 20px; background: #f0a030; border: none; border-radius: 2px; color: #000000; font-family: var(--font-jost); font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(240, 160, 48, 0.3); transition: all 0.2s;"'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        In tem sản phẩm (${selectedCount})
      </button>
    </div>
  `;

  const inputEl = document.getElementById('print-label-search-input');
  if (inputEl && document.activeElement !== inputEl) {
    inputEl.focus();
    inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
  }
}

function toggleSelectPrintLabel(sku) {
  const selectedSet = window.printLabelState.selectedSkus;
  if (selectedSet.has(sku)) {
    selectedSet.delete(sku);
  } else {
    selectedSet.add(sku);
  }
  renderPrintLabelDrawerContent();
}

function toggleSelectAllPrintLabels(isChecked) {
  const searchKey = normalizeSearchText(window.printLabelState.search || '');
  const sortedMaterials = [...(db.materials || [])].sort((a, b) => {
    return String(b.id || '').localeCompare(String(a.id || ''), undefined, { numeric: true, sensitivity: 'base' });
  });

  const filteredMaterials = sortedMaterials.filter(m => {
    if (!searchKey) return true;
    return normalizeSearchText(m.id).includes(searchKey) || normalizeSearchText(m.name).includes(searchKey);
  });

  const selectedSet = window.printLabelState.selectedSkus;
  filteredMaterials.forEach(m => {
    if (isChecked) {
      selectedSet.add(m.id);
    } else {
      selectedSet.delete(m.id);
    }
  });

  renderPrintLabelDrawerContent();
}

async function executePrintLabels() {
  const selectedSet = window.printLabelState.selectedSkus;
  if (selectedSet.size === 0) return;

  const selectedMaterials = (db.materials || []).filter(m => selectedSet.has(m.id));

  const pageSize = 20;
  const pages = [];
  for (let i = 0; i < selectedMaterials.length; i += pageSize) {
    pages.push(selectedMaterials.slice(i, i + pageSize));
  }

  let printFrame = document.getElementById('print-label-frame');
  if (printFrame) printFrame.remove();

  printFrame = document.createElement('iframe');
  printFrame.id = 'print-label-frame';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = 'none';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;

  const pagesHtml = pages.map((pageItems, pageIdx) => {
    const itemsHtml = pageItems.map((m, itemIdx) => `
      <div class="label-item">
        <div class="qr-container" id="qr-${pageIdx}-${itemIdx}"></div>
        <div class="label-info">
          <div class="sku-code">${m.id || ''}</div>
          <div class="product-name" title="${m.name || ''}">${m.name || ''}</div>
        </div>
      </div>
    `).join('');

    return `<div class="page-a4">${itemsHtml}</div>`;
  }).join('');

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>In Tem Sản Phẩm</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
      <style>
        @page {
          size: A4 portrait;
          margin: 0;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
        }
        .page-a4 {
          width: 210mm;
          height: 297mm;
          padding: 8mm 6mm;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(5, 54mm);
          gap: 2mm 3mm;
          page-break-after: always;
          page-break-inside: avoid;
          overflow: hidden;
        }
        .page-a4:last-child {
          page-break-after: auto;
        }
        .label-item {
          border: 1px dashed #cccccc;
          border-radius: 4px;
          padding: 3mm 2mm;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #ffffff;
          overflow: hidden;
        }
        .qr-container {
          width: 28mm;
          height: 28mm;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 1mm;
        }
        .qr-container img, .qr-container canvas {
          width: 26mm !important;
          height: 26mm !important;
          object-fit: contain;
          display: block;
        }
        .label-info {
          width: 100%;
          margin-top: 1mm;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sku-code {
          font-family: monospace;
          font-size: 10pt;
          font-weight: bold;
          color: #000000;
          line-height: 1.2;
        }
        .product-name {
          font-size: 8.5pt;
          color: #222222;
          line-height: 1.15;
          margin-top: 0.5mm;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          max-height: 20pt;
        }
      </style>
    </head>
    <body>
      ${pagesHtml}
    </body>
    </html>
  `);
  frameDoc.close();

  setTimeout(() => {
    pages.forEach((pageItems, pageIdx) => {
      pageItems.forEach((m, itemIdx) => {
        const qrBox = frameDoc.getElementById(`qr-${pageIdx}-${itemIdx}`);
        if (qrBox) {
          const qrData = String(m.id || '');

          new printFrame.contentWindow.QRCode(qrBox, {
            text: qrData,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: printFrame.contentWindow.QRCode.CorrectLevel.M
          });
        }
      });
    });

    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    }, 400);
  }, 300);
}

// ==========================================
// CHỨC NĂNG IN TEM TẤT CẢ SẢN PHẨM TRONG PHIẾU NHẬP KHO
// ==========================================
async function printGRNProductLabels() {
  const d = state.formData;
  if (!d || !Array.isArray(d.lineItems) || d.lineItems.length === 0) {
    showAlert('Phiếu nhập kho này chưa có danh sách sản phẩm để in tem!', 'Thông báo');
    return;
  }

  const lineItems = d.lineItems;

  const productsToPrint = lineItems.map(l => {
    const mat = (db.materials || []).find(m => (l.sku && m.id === l.sku) || (l.name && m.name === l.name));
    return {
      id: l.sku || (mat ? mat.id : ''),
      name: l.name || (mat ? mat.name : ''),
      cost: l.unitCost || (mat ? mat.cost : 0)
    };
  });

  const pageSize = 20;
  const pages = [];
  for (let i = 0; i < productsToPrint.length; i += pageSize) {
    pages.push(productsToPrint.slice(i, i + pageSize));
  }

  let printFrame = document.getElementById('print-label-frame');
  if (printFrame) printFrame.remove();

  printFrame = document.createElement('iframe');
  printFrame.id = 'print-label-frame';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = 'none';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;

  const pagesHtml = pages.map((pageItems, pageIdx) => {
    const itemsHtml = pageItems.map((m, itemIdx) => `
      <div class="label-item">
        <div class="qr-container" id="qr-${pageIdx}-${itemIdx}"></div>
        <div class="label-info">
          <div class="sku-code">${m.id || ''}</div>
          <div class="product-name" title="${m.name || ''}">${m.name || ''}</div>
        </div>
      </div>
    `).join('');

    return `<div class="page-a4">${itemsHtml}</div>`;
  }).join('');

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>In Tem Sản Phẩm Phiếu Nhập ${d.id || ''}</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
      <style>
        @page {
          size: A4 portrait;
          margin: 0;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          background: #ffffff;
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
        }
        .page-a4 {
          width: 210mm;
          height: 297mm;
          padding: 8mm 6mm;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(5, 54mm);
          gap: 2mm 3mm;
          page-break-after: always;
          page-break-inside: avoid;
          overflow: hidden;
        }
        .page-a4:last-child {
          page-break-after: auto;
        }
        .label-item {
          border: 1px dashed #cccccc;
          border-radius: 4px;
          padding: 3mm 2mm;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #ffffff;
          overflow: hidden;
        }
        .qr-container {
          width: 28mm;
          height: 28mm;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 1mm;
        }
        .qr-container img, .qr-container canvas {
          width: 26mm !important;
          height: 26mm !important;
          object-fit: contain;
          display: block;
        }
        .label-info {
          width: 100%;
          margin-top: 1mm;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sku-code {
          font-family: monospace;
          font-size: 10pt;
          font-weight: bold;
          color: #000000;
          line-height: 1.2;
        }
        .product-name {
          font-size: 8.5pt;
          color: #222222;
          line-height: 1.15;
          margin-top: 0.5mm;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          max-height: 20pt;
        }
      </style>
    </head>
    <body>
      ${pagesHtml}
    </body>
    </html>
  `);
  frameDoc.close();

  setTimeout(() => {
    pages.forEach((pageItems, pageIdx) => {
      pageItems.forEach((m, itemIdx) => {
        const qrBox = frameDoc.getElementById(`qr-${pageIdx}-${itemIdx}`);
        if (qrBox) {
          new printFrame.contentWindow.QRCode(qrBox, {
            text: String(m.id || m.name || ''),
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: printFrame.contentWindow.QRCode.CorrectLevel.M
          });
        }
      });
    });

    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    }, 400);
  }, 300);
}

// ==========================================
// HÀM MỞ MODAL QUÉT QR CHUẨN GIAO DIỆN MOBILE
// ==========================================

function openQRScannerModal(onSuccessCallback, targetSearchField) {
  // 1. Tự động xóa sạch ô tìm kiếm trước khi quét
  if (targetSearchField === 'reportInv') {
    state.reportInvSearch = '';
  } else if (targetSearchField === 'materials') {
    state.search = '';
  }

  let modal = document.getElementById('qr-scanner-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'qr-scanner-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <!-- Header Ngang Hàng: Nút <-- Bên Trái & Tiêu Đề Căn Giữa -->
    <div class="qr-header-bar">
      <button type="button" class="qr-back-btn" onclick="closeQRScannerModal()" title="Quay lại">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <span class="qr-header-title">Scan Your QR</span>
    </div>

    <!-- Container Camera -->
    <div id="qr-reader-container" style="width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; overflow: hidden;"></div>

    <!-- Khung Viền Quét Bo Góc Màu Trắng -->
    <div class="qr-scan-frame-wrapper">
      <div class="qr-corner-white qr-corner-white-tl"></div>
      <div class="qr-corner-white qr-corner-white-tr"></div>
      <div class="qr-corner-white qr-corner-white-bl"></div>
      <div class="qr-corner-white qr-corner-white-br"></div>
      <div class="qr-laser-line-modern"></div>
    </div>

    <!-- Dòng chữ SCANNING... phía dưới vùng scan -->
    <div class="qr-scanning-text">SCANNING...</div>
  `;
  modal.style.display = 'flex';

  if (typeof Html5Qrcode !== 'undefined') {
    window.html5QrCodeScanner = new Html5Qrcode("qr-reader-container");
    window.html5QrCodeScanner.start(
      { facingMode: "environment" },
      { fps: 20, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        closeQRScannerModal();
        if (window[onSuccessCallback]) window[onSuccessCallback](decodedText);
      },
      () => { }
    ).catch(err => {
      console.warn("Không thể mở camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền trình duyệt!");
    });
  } else {
    alert("Thư viện quét mã QR đang được tải, vui lòng thử lại!");
  }
}

function closeQRScannerModal() {
  const modal = document.getElementById('qr-scanner-modal');
  if (window.html5QrCodeScanner) {
    window.html5QrCodeScanner.stop().then(() => {
      window.html5QrCodeScanner.clear();
      if (modal) modal.style.display = 'none';
    }).catch(() => {
      if (modal) modal.style.display = 'none';
    });
  } else if (modal) {
    modal.style.display = 'none';
  }
}

// Xử lý đọc từ tệp ảnh QR
function handleQRImageUpload(event, onSuccessCallback) {
  const file = event.target.files[0];
  if (!file) return;

  if (typeof Html5Qrcode !== 'undefined') {
    const html5QrCode = new Html5Qrcode("qr-reader-container");
    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        closeQRScannerModal();
        if (window[onSuccessCallback]) window[onSuccessCallback](decodedText);
      })
      .catch(err => {
        alert("Không tìm thấy mã QR hợp lệ trong ảnh vừa chọn!");
      });
  }
}

// Callbacks cập nhật dữ liệu quét
function onScanReportInvSuccess(scannedCode) {
  state.reportInvSearch = scannedCode;
  state.page = 1;
  render();
}

function onScanMaterialsSuccess(scannedCode) {
  state.search = scannedCode;
  state.page = 1;
  render();
}