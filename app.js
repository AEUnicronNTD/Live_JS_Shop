//先選取到該元素
const loginBtn = document.getElementById('loginBtn');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.login-modal');
const closeBtn = document.querySelector('.close-login');

//針對元素進行展開彈窗操作
function openLoginModal() {
  if (!overlay || !modal) return;
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
}
//關閉彈窗
function closeLoginModal() {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
}
//滑鼠點擊事件
if (loginBtn) {
  loginBtn.addEventListener('click', openLoginModal);
} //按X關閉彈窗
if (closeBtn) {
  closeBtn.addEventListener('click', closeLoginModal);
} //點選背景也能關閉彈窗
if (overlay) {
  overlay.addEventListener('click', closeLoginModal);
}

//資料驗證彈窗內部按鈕綁定
const submitLogin = document.querySelector(".submitLogin");

if (submitLogin) {
  submitLogin.addEventListener("click", function() {
  
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    // 2. 取得它們的 value
    const usernameValue = usernameInput.value;
    const passwordValue = passwordInput.value;

    // 3. 設定正確的帳號密碼
    const correctUsername = 'admin@gmail.com';  //正確的帳號資料測試用
    const correctPassword = 'abc1234';
    //主要驗證資料的函式(validateLogin)套用
    const result = validateLogin(usernameValue, passwordValue);

      if (result.ok) {  // 驗證格式成功
      // 再比對帳號密碼是否正確
        if (usernameValue === correctUsername && passwordValue === correctPassword) {
          alert('帳號登入成功！');
          closeLoginModal(); //關閉視窗
        } else {
          alert('帳號或密碼錯誤');
        }
      } else {  // 驗證格式失敗
          alert(result.errors.join('\n'));  // 顯示所有錯誤（換行分隔）
      }
    })
  };
  
    
  //驗證資料的主要函式
function validateLogin (emailRaw,passwordRaw) {
    //去掉空白
    const email = emailRaw.trim();
    const password = passwordRaw.trim();
    //裝所有錯誤訊息的陣列
    const errors = []; 

    //確認資料是否為全空白
    if (!email ) {
      errors.push("請輸入電子郵件地址");
    }
    if (!password) {
      errors.push("請輸入密碼");
    }
  
    //先檢查email格式     
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push("電子郵件格式不正確!"); //error.push = 丟進errors陣列裡
    }
    //檢查密碼長度
    if (password.length < 6) {
      errors.push("密碼至少需6個字元");
    }
    
    // 如果有錯誤，回傳 ok: false
    if (errors.length > 0) {
        return {
            ok: false, //表示驗證「沒通過」
            errors: errors //把所有累積的錯誤訊息陣列一起送回去。
        };
    }
    // 沒有錯誤，回傳 ok: true
    return {
      ok: true
    };
  }

let cart = []; //購物車變數
let allProducts = [];  // 用來存放商品資料

//導入json資料
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

// 函式用來處理加入購物車的項目
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

//移除購物車項目
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