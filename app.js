const loginBtn = document.getElementById('loginBtn');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.login-modal');
const closeBtn = document.querySelector('.close-login');

function openLoginModal() {
  if (!overlay || !modal) return;
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}

function closeLoginModal() {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
}

if (loginBtn) {
  loginBtn.addEventListener('click', openLoginModal);
}
if (closeBtn) {
  closeBtn.addEventListener('click', closeLoginModal);
}
if (overlay) {
  overlay.addEventListener('click', closeLoginModal);
}




let cart = [];
let allProducts = [];  // 用來存放商品資料

fetch("products.json")
	.then(function (response) {
		if (!response.ok) {
			// 狀態碼不是 200~299
			throw new Error("Network response was not ok");
		} else {
			// 狀態碼正常
			return response.json();
		}
	})
	.then(function (products) {
		if (!Array.isArray(products) || products.length === 0) {
			console.log("目前沒有商品可以顯示");
			return; // 提早結束這個 then
		}

		// 把商品資料存到全域變數
		allProducts = products;

		// 有商品資料的情況
		console.log("載入到的商品資料:", products);
		console.log(
			products[0].name, products[0].stock,
			products[1].name, products[1].stock, 
			products[2].name, products[2].stock);
		// 之後在這裡呼叫 renderProducts(products) 之類的函式
	})
	.catch(function (error) {
		console.error("讀取 products.json 發生錯誤:", error);
	});

const addToCartButtons = document.querySelectorAll('.add-to-cart');

// 加入購物車按鈕
addToCartButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    alert('已加入購物車！');
    const productId = button.dataset.productId;  // 從按鈕拿 ID
    addToCart(productId);  // 傳真實 ID 進去
  });
});

const existingItem = cart.find(function(item) {
  return item.id === productId;
});

// 函式用來處理加入購物車的邏輯
function addToCart(productId) {
  const existingItem = cart.find(function(item) {
    return item.id === productId;
  });

  if (existingItem) {
    // 已經在購物車裡 → 數量 +1
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    // 還沒在購物車裡 → 新增一筆
    cart.push({ id: productId, quantity: 1 });
  }

  console.log('目前購物車:', cart);
  console.log('購物車總價:', calculateTotal());
  renderCartSummary();
}


const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');

removeFromCartButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    alert('已從購物車移除！');
    const productId = button.dataset.productId;  // 從按鈕本身拿 ID
    removeFromCart(productId);  // 傳真實 ID 進去
  });
});

// 函式用來處理從購物車移除的邏輯
function removeFromCart(productId) {
  const existingItem = cart.find(function(item) {
    return item.id === productId;
  });

  if (existingItem) {
    if (existingItem.quantity > 1) {
      // 數量大於 1 → 數量 -1
      existingItem.quantity = existingItem.quantity - 1;
    } else {
      // 數量等於 1 → 整筆移除
      cart = cart.filter(function(item) {
        return item.id !== productId;
      });
    }
  }

  console.log('目前購物車:', cart);
  console.log('購物車總價:', calculateTotal());
  renderCartSummary();
}

// 計算商品價格的函式
function calculateTotal() {
  let total = 0;

  cart.forEach(function(item) {
    // 根據 item.id 從 allProducts 找到對應的商品資料
    const product = allProducts.find(function(p) {
      return p.id === item.id;
    });

    // 如果找到了對應的商品資料，就把價格乘以數量加到 total 上
    if (product) {
      const subtotal = product.price * item.quantity;
      total = total + subtotal;
    }
  });
  
  return total;
}

//計算最後總價的函式
function renderCartSummary() {
  // 計算總件數
  let totalCount = 0;
  cart.forEach(function(item) {
    totalCount = totalCount + item.quantity;
  });

  // 計算總價
  const totalPrice = calculateTotal();

  // 顯示在頁面上
  document.querySelector('.cart-count').textContent = totalCount;
  document.querySelector('.cart-total').textContent = totalPrice;
}