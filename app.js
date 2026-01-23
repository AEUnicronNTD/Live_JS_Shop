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

// 假設我們有一個函式用來處理加入購物車的邏輯
function addToCart(productId) {
	console.log('將商品加入購物車，商品ID:', productId);
}


const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');

removeFromCartButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    alert('已從購物車移除！');
    const productId = button.dataset.productId;  // 從按鈕本身拿 ID
    removeFromCart(productId);  // 傳真實 ID 進去
  });
});

// 假設我們有一個函式用來處理從購物車移除的邏輯
function removeFromCart(productId) {
	console.log('將商品從購物車移除，商品ID:', productId);
}