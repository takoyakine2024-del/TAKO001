// =======================
// ?? Inisialisasi Keranjang
// =======================
let cart = {};
let addons = {};

// =======================
// ?? Update Waktu Real-Time
// =======================
    function updateWaktu() {
      const sekarang = new Date();
      const optionsTanggal = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const tanggal = sekarang.toLocaleDateString('id-ID', optionsTanggal);
      const jam = sekarang.toLocaleTimeString('id-ID');
      document.getElementById('tanggal').textContent = tanggal;
      document.getElementById('jam').textContent = jam;
    }

    setInterval(updateWaktu, 1000);
    updateWaktu();

// =======================
// ?? Fungsi Tambah/Kurang Item
// =======================
    function increaseItem(name, price) {
      if (!cart[name]) cart[name] = { qty: 0, price };
      cart[name].qty++;
      updateCart();
    }

    function decreaseItem(name) {
      if (cart[name] && cart[name].qty > 0) {
        cart[name].qty--;
        updateCart();
      }
    }

    function increaseAddon(name, price) {
      if (!addons[name]) addons[name] = { qty: 0, price };
      addons[name].qty++;
      updateCart();
    }

    function decreaseAddon(name) {
      if (addons[name] && addons[name].qty > 0) {
        addons[name].qty--;
        updateCart();
      }
    }

// =======================
// ?? Ambil Topping yang Dicentang
// =======================
    function getSelectedToppings() {
      const checkboxes = document.querySelectorAll('input[name="topping"]:checked');
      return Array.from(checkboxes).map(cb => cb.value);
    }

// =======================
// ?? Update Tampilan Keranjang
// =======================
    function updateCart() {
      const cartItems = document.getElementById('cart-items');
      const totalDisplay = document.getElementById('total');
      cartItems.innerHTML = '';
      let total = 0;

      for (let name in cart) {
        const item = cart[name];
        const qtySpan = document.getElementById(`qty-${name}`);
        if (qtySpan) qtySpan.textContent = item.qty;
        if (item.qty > 0) {
          cartItems.innerHTML += `<div class="cart-item">${name} x ${item.qty} = Rp${item.qty * item.price}</div>`;
          total += item.qty * item.price;
        }
      }

      for (let name in addons) {
        const item = addons[name];
        const qtySpan = document.getElementById(`addon-${name}`);
        if (qtySpan) qtySpan.textContent = item.qty;
        if (item.qty > 0) {
          cartItems.innerHTML += `<div class="cart-item">${name} (+ Isi) x ${item.qty} = Rp${item.qty * item.price}</div>`;
          total += item.qty * item.price;
        }
      }

      const toppings = getSelectedToppings();
      if (toppings.length > 0) {
        cartItems.innerHTML += `<div class="cart-item">Topping: ${toppings.join(', ')}</div>`;
      }

      const isMemberDiscount = document.getElementById('member-discount')?.checked;
      const isMemberFree = document.getElementById('member-free')?.checked;

      if (isMemberDiscount) {
        total -= 5000;
        cartItems.innerHTML += `<div class="cart-item">Potongan Member: -Rp5.000</div>`;
      }

      let bonusCount = 0;
      if (total >= 35000) bonusCount++;
      if (isMemberFree) bonusCount++;

      if (bonusCount > 0) {
        cartItems.innerHTML += `<div class="cart-item">Bonus: ${bonusCount}x Item Gratis</div>`;
      }

      totalDisplay.textContent = total < 0 ? 0 : total;
    }

// =======================
// ?? Reset Order
// =======================
    function cancelOrder() {
      cart = {};
      addons = {};
      document.querySelectorAll('input[name="topping"]').forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
      });
      document.getElementById('member-discount').checked = false;
      document.getElementById('member-free').checked = false;
      document.querySelectorAll('[id^="qty-"], [id^="addon-"]').forEach(span => {
        span.textContent = '0';
      });
      updateCart();
    }

// =======================
// ?? Format Struk
// =======================
    function formatLine(left, right, width = 32) {
      const space = width - left.length - right.length;
      return left + ' '.repeat(space > 0 ? space : 0) + right;
    }

    function formatHarga(qty, harga) {
      return `x${qty} @ Rp. ${harga.toLocaleString('id-ID')}`;
    }

    function formatTotal(harga) {
      return `Rp. ${harga.toLocaleString('id-ID')}`;
    }

    function centerText(text, width = 32) {
      const space = Math.floor((width - text.length) / 2);
      return ' '.repeat(space > 0 ? space : 0) + text;
    }

// =======================
// ?? Simpan & Bayar
// =======================
    function simpanDanBayar(method) {
      const nomorTransaksi = "TX-" + Date.now();
      const waktu = new Date().toISOString().split("T")[0];
      const kasir = "Lilik";
      let total = 0;
      let struk = "";

      struk += formatLine("No. Transaksi", nomorTransaksi) + "\n";
      struk += centerText("TAKOYAKI NE") + "\n";
      struk += centerText("Alfamart Ngelom") + "\n";
      struk += centerText("Telp: 083 890 890 296") + "\n";
      struk += "-".repeat(32) + "\n";
      struk += formatLine("Kasir", kasir) + "\n";
      struk += formatLine("Metode", method) + "\n";
      struk += formatLine("Waktu", new Date().toLocaleString('id-ID')) + "\n";
      struk += "-".repeat(32) + "\n";

      for (let name in cart) {
        const item = cart[name];
        if (item.qty > 0) {
          const subtotal = item.qty * item.price;
          struk += name + "\n";
          struk += formatLine(formatHarga(item.qty, item.price), formatTotal(subtotal)) + "\n";
          total += subtotal;
        }
      }

      for (let name in addons) {
        const item = addons[name];
        if (item.qty > 0) {
          const subtotal = item.qty * item.price;
          struk += name + " (+Isi)\n";
          struk += formatLine(formatHarga(item.qty, item.price), formatTotal(subtotal)) + "\n";
          total += subtotal;
        }
      }

      const toppings = getSelectedToppings();
      if (toppings.length > 0) {
        struk += "-".repeat(32) + "\n";
        struk += formatLine("Topping", toppings.join(", ")) + "\n";
      }

      const isMemberDiscount = document.getElementById('member-discount')?.checked;
      const isMemberFree = document.getElementById('member-free')?.checked;

      if (isMemberDiscount) {
        total -= 5000;
        struk += formatLine("Diskon Member", "-Rp. 5.000") + "\n";
      }

      let bonusCount = 0;
      if (total >= 35000) bonusCount++;
      if (isMemberFree) bonusCount++;

      if (bonusCount > 0) {
        struk += "-".repeat(32) + "\n";
        struk += formatLine("Bonus", `${bonusCount}x Item Gratis`) + "\n";
      }

      struk += "-".repeat(32) + "\n";
      struk += formatLine("TOTAL", formatTotal(total < 0 ? 0 : total)) + "\n";
      struk += "-".repeat(32) + "\n";
      struk += centerText("Terima kasih!") + "\n";
      struk += centerText("Selamat menikmati!") + "\n\n";

      window.location.href = "rawbt:" + encodeURIComponent(struk);

      const transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];
      transaksi.push({
        waktu,
        nomorTransaksi,
        total: total < 0 ? 0 : total,
        method,
        struk
      });

      localStorage.setItem('transaksi', JSON.stringify(transaksi));
      alert("Transaksi berhasil disimpan!");
      cancelOrder();
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('input[name="topping"]').forEach(cb => {
        cb.addEventListener('change', updateCart);
      });

      document.getElementById('member-discount').addEventListener('change', updateCart);
      document.getElementById('member-free').addEventListener('change', updateCart);

      const dicampur = document.querySelector('input[name="topping"][value="Dicampur"]');
      const dipisah = document.querySelector('input[name="topping"][value="Dipisah"]');

      if (dicampur && dipisah) {
        dicampur.addEventListener('change', () => {
          dipisah.disabled = dicampur.checked;
        });
        dipisah.addEventListener('change', () => {
          dicampur.disabled = dipisah.checked;
        });
      }
    });


// =======================
// ?? sembunyikan menu tambah isi
// =======================
  const toggleBtn = document.getElementById("toggleAddonBtn");
  const addonContainer = document.getElementById("addonContainer");

  toggleBtn.addEventListener("click", function () {
    const isVisible = addonContainer.style.display === "block";
    addonContainer.style.display = isVisible ? "none" : "block";
    toggleBtn.textContent = isVisible ? "Tampilkan Tambah Isi" : "Sembunyikan Tambah Isi";
  });

