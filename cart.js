const cartBody = document.querySelector("#cart-body");

const renderCart = (data) => {
    let rawHTML = '';
    let i = 1;
    let totalPrice = 0;
    data?.forEach(element => {
        let optionHTML = `<option value="${element.quantity}">${element.quantity}</option>`;
        for (let j = 1; j < 6; j++) {
            if (j !== element.quantity) {
                optionHTML += `
                <option value="${j}">${j}</option>
                `;
            }
        }
        rawHTML += `
        <tr>
            <th scope="row">${i}</th>
            <td>${element.productName}</td>
            <td>
            <select class="custom-select" id="cart-change-quantity-${element.productId}" data-id="${element.productId}"required>
                ${optionHTML}
            </select>
            </td>
            <td>${element.price}</td>
            <td>${element.price * element.quantity}</td>
            <td>
                <button class="btn btn-danger btn-remove-item" data-id="${element.productId}">移除</button>
            </td>
        </tr>`;
        i++;
        totalPrice += element.price;
    });
    cartBody.innerHTML = rawHTML;

    bindEvent();
};

function bindEvent() {
    const btnRemoveItem = document.querySelectorAll(".btn-remove-item");
    const customSelect = document.querySelectorAll(".custom-select");
    btnRemoveItem.forEach(ele => {
        ele.addEventListener("click", event => {
            event.stopImmediatePropagation();
            const id = event.target.dataset.id;
            removeFromCart(Number(id));
        });
    });
    customSelect.forEach(ele => {
        ele.addEventListener("change", event => {
            event.stopImmediatePropagation();
            const id = event.target.dataset.id;
            const value = event.target.value;
            changeQtyFromCart(Number(id), Number(value));
        });
    });
}

// 更新購物車項目數量
function changeQtyFromCart(id, value) {
    const cartData = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    if (cartData.length == 0) return;

    const item = cartData.find((element) => element.productId === id);

    item.quantity = value;

    //存回 local storage
    localStorage.setItem('cart', JSON.stringify(cartData));

}


// 刪除購物車項目
function removeFromCart(id) {
    const cartData = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    if (cartData.length == 0) return;

    const itemIndex = cartData.findIndex((element) => element.productId === id);
    if (itemIndex === -1) return;

    //刪除該項目
    cartData.splice(itemIndex, 1);

    //存回 local storage
    localStorage.setItem('cart', JSON.stringify(cartData));

    //更新頁面
    renderCart(cartData);
}


const init = () => {
    const cartData = JSON.parse(localStorage.getItem("cart"));

    renderCart(cartData);
};

init();