const BASE_URL = 'http://127.0.0.1:8080';

const dataPanel = document.querySelector("#data-panel");
const searchKeyword = document.querySelector("#search-keyword");
const paginator = document.querySelector("#paginator");
const PER_PAGE = 12;

const productsList = [];

const showProductModal = (id) => {
    const modalTitle = document.querySelector("#mall-modal-title");
    const modalImage = document.querySelector("#mall-modal-image");
    const modalDesc = document.querySelector("#mall-modal-description");
    const modalCategory = document.querySelector("#mall-modal-category");
    axios.get(`${BASE_URL}/products/${id}`).then(res => {
        const data = res.data;
        modalTitle.innerText = data.productName;
        modalImage.innerHTML = `<img src="${data.imageUrl}" alt="poster" class="img-fluid">`;
        modalDesc.innerText = `描述: ${data.description}`;
        modalCategory.innerText = `分類: ${data.category}`;
    }).catch(e => {
        console.log('error', e);
    });
};

const search = (keyword, page = 1) => {
    axios.get(`${BASE_URL}/products`, {
        params: {
            search: keyword,
            limit: PER_PAGE,
            offset: (page - 1) * PER_PAGE
        }
    }).then(res => {
        productsList.length = 0;
        productsList.push(...res.data.results);
        renderPaginator(res.data.total);
        renderProductList(productsList);
    }).catch(e => {
        console.log('error', e);
    });
};

const renderProductList = (data) => {
    let rawHTML = "";

    data.forEach(element => {
        rawHTML += `
        <div class="col-sm-3">
            <div class="mb-2">
                <div class="card">
                    <img
                    src="${element.imageUrl}"
                    class="card-img-top"
                    alt="Poster"/>
                    <div class="card-body">
                        <h5 class="card-title">${element.productName}</h5>
                        <h6 class="card-info">價格: $ ${formatNumber(element.price)}</h6>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary btn-show-mall" data-toggle="modal" data-target="#mall-modal" data-id="${element.productId}">More</button>
                        <button class="btn btn-info btn-add-cart" data-id="${element.productId}">加入購物車</button>
                    </div>
                </div>
            </div>
        </div>`;
    });

    dataPanel.innerHTML = rawHTML;
};

function formatNumber(price) {
    const comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
    const formatNum = price.toString().replace(comma, ',');
    return formatNum;
}

//頁碼顯示
function renderPaginator(amount) {
    //計算總頁數
    const numberOfPages = Math.ceil(amount / PER_PAGE);
    //製作 template 
    let rawHTML = '';

    for (let page = 1; page <= numberOfPages; page++) {
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
    }
    //放回 HTML
    paginator.innerHTML = rawHTML;
}

// 加入購物車行動
const addToCart = (id) => {
    const list = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    const product = productsList.find(element => {
        return element.productId === id;
    });
    if (list.some((element) => element.productId === id)) {
        list.find(element => {
            if (element.productId === id) {
                element.quantity++;
            }
        });
        localStorage.setItem('cart', JSON.stringify(list));
        return;
    }
    product.quantity = 1;
    list.push(product);
    localStorage.setItem('cart', JSON.stringify(list));
    alert('成功加入購物車');
};

// 點擊more/加入購物車
dataPanel.addEventListener('click', function onPanelClicked(event) {
    const id = event.target.dataset.id;
    if (event.target.matches(".btn-show-mall")) {
        showProductModal(Number(id));
    } else if (event.target.matches(".btn-add-cart")) {
        addToCart(Number(id));
    }
});

// 搜尋關鍵字
searchKeyword.addEventListener('submit', function onSearchSubmit(event) {
    const searchInput = document.querySelector('#search-input');
    event.preventDefault();
    const keyword = searchInput.value.trim();
    search(keyword);
});

// 分頁結果+搜尋
paginator.addEventListener('click', function onPaginatorClicked(event) {
    if (event.target.tagName !== 'A') return;
    const page = Number(event.target.dataset.page);

    const searchInput = document.querySelector('#search-input');
    event.preventDefault();
    const keyword = searchInput.value.trim();

    search(keyword, page);
});


// 首頁
const init = (page) => {
    axios.get(`${BASE_URL}/products`, {
        params: {
            limit: PER_PAGE,
            offset: (page - 1) * PER_PAGE
        }
    }).then(res => {
        productsList.length = 0;
        productsList.push(...res.data.results);
        renderPaginator(res.data.total);
        renderProductList(productsList);
    }).catch(e => {
        console.log('error', e);
    });
};

init(1);