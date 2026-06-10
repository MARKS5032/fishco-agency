// ---------- DATA STORAGE KEYS ----------
const STORAGE_USERS = "fishco_users";
const STORAGE_LISTINGS = "fishco_listings";
const STORAGE_ORDERS = "fishco_orders";
const STORAGE_NOTIFICATIONS = "fishco_notifications";
const STORAGE_SESSION = "fishco_session";

let currentUser = null;
let listings = [];
let orders = [];
let notifications = [];
let lang = "en";
let users = [];

const fishTypes = ["Tilapia", "Nile Perch", "Omena (Dagaa)", "Lungfish", "Catfish", "Ningu"];

// Translations
const texts = {
    en: {
        login:"Login", register:"Register", username:"Username", password:"Password", confirmPassword:"Confirm Password",
        role:"Role", seller:"Fish Seller / Company", buyer:"Buyer / Customer", fullName:"Full Name", phone:"Phone Number",
        beach:"Beach / Company Name", photo:"Profile Photo", loginGoogle:"Login with Google (Demo)", registerBtn:"Create Account",
        loginBtn:"Login", switchToRegister:"No account? Register", switchToLogin:"Already have an account? Login",
        logout:"Logout", welcome:"Welcome", dashboard:"Dashboard", addFish:"Add Fish Listing", fishType:"Fish Type",
        kgAvailable:"Kilograms Available", pricePerKg:"Price per Kg (KES)", gutted:"Gutted?", yes:"Gutted", no:"Not Gutted",
        submitListing:"Publish Listing", myListings:"My Listings", availableFish:"Available Fish for Sale", search:"Search...",
        order:"Order", myOrders:"My Orders", notificationsTitle:"Notifications", markRead:"Mark read", aiAssistant:"AI Preservation Assistant",
        askAI:"Ask for advice", raiseAlarm:"Raise Alarm", alarmMessage:"Alarm message", send:"Send", ussdOrder:"USSD Order (Offline)",
        noListings:"No fish listings yet.", stockAlert:"New stock alert", sellerAlarm:"Seller alarm", orderPlaced:"Order placed!",
        fillAll:"Please fill all fields.", passwordMismatch:"Passwords do not match.", userExists:"Username exists.",
        invalidLogin:"Invalid login.", listingAdded:"Fish listing added!", contact:"Contact", sellerContact:"Seller Contact",
        buyerContact:"Buyer Contact", ordersReceived:"Orders Received", mapTitle:"📍 Our Location – Lake Victoria, Kenya",
        confirmOrder:"Confirm order", orderDetails:"Order details"
    },
    sw: {
        login:"Ingia", register:"Jiunge", username:"Jina la mtumiaji", password:"Nenosiri", confirmPassword:"Thibitisha nenosiri",
        role:"Nafasi", seller:"Mchuuzi / Kampuni", buyer:"Mnunuzi", fullName:"Jina kamili", phone:"Nambari ya simu",
        beach:"Ufukwe / Kampuni", photo:"Picha yako", loginGoogle:"Ingia kwa Google (Mfano)", registerBtn:"Unda Akaunti",
        loginBtn:"Ingia", switchToRegister:"Huna akaunti? Jisajili", switchToLogin:"Tayari una akaunti? Ingia",
        logout:"Toka", welcome:"Karibu", dashboard:"Dashibodi", addFish:"Ongeza Samaki", fishType:"Aina ya Samaki",
        kgAvailable:"Kilogramu", pricePerKg:"Bei kwa Kg (KES)", gutted:"Kutolewa matumbo?", yes:"Ndio", no:"Hapana",
        submitListing:"Chapisha", myListings:"Samaki wangu", availableFish:"Samaki wanaouzwa", search:"Tafuta...",
        order:"Agiza", myOrders:"Maagizo yangu", notificationsTitle:"Arifa", markRead:"Soma", aiAssistant:"Msaidizi wa Uhifadhi",
        askAI:"Uliza ushauri", raiseAlarm:"Tahadhari", alarmMessage:"Ujumbe", send:"Tuma", ussdOrder:"Oda kwa USSD",
        noListings:"Hakuna samaki", stockAlert:"Arifa ya samaki wapya", sellerAlarm:"Tahadhari ya wauzaji", orderPlaced:"Oda imetumwa!",
        fillAll:"Jaza sehemu zote", passwordMismatch:"Manenosiri hayafanani", userExists:"Jina lipo", invalidLogin:"Kosa la ingizo",
        listingAdded:"Samaki ameongezwa!", sellerContact:"Mawasiliano ya muuzaji", buyerContact:"Mawasiliano ya mnunuzi",
        ordersReceived:"Maagizo yaliyopokelewa", mapTitle:"📍 Eneo letu – Ziwa Victoria, Kenya", confirmOrder:"Thibitisha oda",
        orderDetails:"Maelezo ya oda"
    }
};

function t(key) { return (texts[lang] && texts[lang][key]) ? texts[lang][key] : (texts.en[key] || key); }

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_LISTINGS, JSON.stringify(listings));
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(notifications));
    if (currentUser) localStorage.setItem(STORAGE_SESSION, JSON.stringify(currentUser));
    else localStorage.removeItem(STORAGE_SESSION);
}

function loadData() {
    const storedUsers = localStorage.getItem(STORAGE_USERS);
    if (storedUsers) users = JSON.parse(storedUsers);
    else {
        users = [
            { username: "seller1", password: "pass", role: "seller", name: "John Muigai", phone: "0712345678", beach: "Dunga Beach", photoUrl: "" },
            { username: "buyer1", password: "pass", role: "buyer", name: "Jane Akinyi", phone: "0722334455", beach: "", photoUrl: "" }
        ];
        saveToLocalStorage();
    }
    const storedListings = localStorage.getItem(STORAGE_LISTINGS);
    if (storedListings) listings = JSON.parse(storedListings);
    else {
        listings = [
            { id: "1", seller: "seller1", sellerName: "Dunga Beach Coop", sellerPhone: "0712345678", sellerPhoto: "", fishType: "Tilapia", kg: 120, price: 380, gutted: true, timestamp: Date.now() },
            { id: "2", seller: "seller1", sellerName: "Dunga Beach Coop", sellerPhone: "0712345678", sellerPhoto: "", fishType: "Nile Perch", kg: 80, price: 450, gutted: false, timestamp: Date.now() }
        ];
        saveToLocalStorage();
    }
    const storedOrders = localStorage.getItem(STORAGE_ORDERS);
    orders = storedOrders ? JSON.parse(storedOrders) : [];
    const storedNotif = localStorage.getItem(STORAGE_NOTIFICATIONS);
    notifications = storedNotif ? JSON.parse(storedNotif) : [];
    const session = localStorage.getItem(STORAGE_SESSION);
    currentUser = session ? JSON.parse(session) : null;
}

function addNotification(toUsername, type, message) {
    const notif = { id: Date.now()+Math.random(), toUser: toUsername, type, message, timestamp: Date.now(), read: false };
    notifications.push(notif);
    saveToLocalStorage();
    console.log(`📱 SMS to ${toUsername}: ${message}`);
    if (currentUser && currentUser.username === toUsername) alert(`🔔 ${message}`);
    render();
}

function renderListingCards(list, isSellerView) {
    if (list.length === 0) return `<p>${t("noListings")}</p>`;
    return `<div class="grid-2">` + list.map(l => `
        <div class="card">
            <strong>🐟 ${l.fishType}</strong><br>
            📦 ${l.kg} kg | 💰 KES ${l.price}/kg | 🔪 ${l.gutted ? "Gutted" : "Not Gutted"}<br>
            🏪 ${l.sellerName}<br>
            ${!isSellerView ? `<button class="order-btn" data-id="${l.id}">${t("order")}</button>` : ''}
        </div>
    `).join('') + `</div>`;
}

function renderOrdersForBuyer(orderList) {
    if (orderList.length === 0) return "<p>No orders yet.</p>";
    return orderList.map(o => `
        <div style="border-bottom:1px solid #ccc; padding:8px; display:flex; gap:10px; align-items:center;">
            ${o.sellerPhoto ? `<img src="${o.sellerPhoto}" class="profile-pic-small" onerror="this.style.display='none'">` : `<i class="fas fa-user-circle profile-pic-small"></i>`}
            <div style="flex:1">
                <strong>${o.fishType} x ${o.quantity}kg = KES ${o.total}</strong><br>
                Status: ${o.status}<br>
                <span style="font-size:0.85rem;">📞 ${t("sellerContact")}: ${o.sellerName} (${o.sellerPhone})</span>
            </div>
        </div>
    `).join('');
}

function renderOrdersForSeller(orderList) {
    if (orderList.length === 0) return "<p>No orders received.</p>";
    return orderList.map(o => `
        <div style="border-bottom:1px solid #ccc; padding:8px; display:flex; gap:10px; align-items:center;">
            ${o.buyerPhoto ? `<img src="${o.buyerPhoto}" class="profile-pic-small" onerror="this.style.display='none'">` : `<i class="fas fa-user-circle profile-pic-small"></i>`}
            <div style="flex:1">
                <strong>${o.fishType} x ${o.quantity}kg = KES ${o.total}</strong><br>
                Buyer: ${o.buyerName}<br>
                <span style="font-size:0.85rem;">📞 ${t("buyerContact")}: ${o.buyerPhone}</span>
            </div>
        </div>
    `).join('');
}

function renderNotifs(notifList) {
    if (notifList.length === 0) return "<p>No notifications</p>";
    return notifList.map(n => `
        <div style="border-bottom:1px solid #eee; padding:8px 0;">
            <strong>${n.type === "stock" ? "📢 Stock Alert" : (n.type === "order" ? "🛒 New Order" : "🚨 Seller Alarm")}</strong><br>
            ${n.message}<br>
            <small>${new Date(n.timestamp).toLocaleString()}</small>
            ${!n.read ? `<button class="mark-read" data-id="${n.id}">${t("markRead")}</button>` : ''}
        </div>
    `).join('');
}

function attachOrderButtons() {
    document.querySelectorAll(".order-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const listingId = btn.getAttribute("data-id");
            const listing = listings.find(l => l.id === listingId);
            if (!listing) return;
            const qty = prompt(`Enter kg of ${listing.fishType} (max ${listing.kg} kg):`, "1");
            const kg = parseFloat(qty);
            if (isNaN(kg) || kg <= 0 || kg > listing.kg) { alert("Invalid quantity"); return; }
            const total = kg * listing.price;
            if (confirm(`${t("confirmOrder")}: ${kg}kg ${listing.fishType} from ${listing.sellerName} for KES ${total}?`)) {
                const newOrder = {
                    id: Date.now().toString(),
                    buyer: currentUser.username,
                    buyerName: currentUser.name,
                    buyerPhone: currentUser.phone,
                    buyerPhoto: currentUser.photoUrl || "",
                    seller: listing.seller,
                    sellerName: listing.sellerName,
                    sellerPhone: listing.sellerPhone,
                    sellerPhoto: listing.sellerPhoto || "",
                    listingId: listing.id,
                    fishType: listing.fishType,
                    quantity: kg,
                    total: total,
                    status: "pending",
                    timestamp: Date.now()
                };
                orders.push(newOrder);
                listing.kg -= kg;
                if (listing.kg <= 0) listings = listings.filter(l => l.id !== listing.id);
                saveToLocalStorage();
                addNotification(listing.seller, "order", `New order from ${currentUser.name}: ${kg}kg of ${listing.fishType}, total KES ${total}. Contact buyer: ${currentUser.phone}`);
                alert(t("orderPlaced"));
                render();
            }
        });
    });
}

function attachMarkRead() {
    document.querySelectorAll(".mark-read").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseFloat(btn.getAttribute("data-id"));
            const notif = notifications.find(n => n.id === id);
            if (notif) notif.read = true;
            saveToLocalStorage();
            render();
        });
    });
}

function simulateUSSD() {
    if (listings.length === 0) { alert(t("noListings")); return; }
    let step = 1;
    let selectedListing = null;
    let quantity = 0;
    function ussdPrompt() {
        if (step === 1) {
            let msg = "USSD: Select fish type:\n";
            listings.forEach((l, idx) => { msg += `${idx+1}. ${l.fishType} (${l.kg}kg, ${l.price}KES/kg)\n`; });
            msg += "0. Cancel";
            const choice = prompt(msg);
            if (choice && choice !== "0") {
                const idx = parseInt(choice)-1;
                if (listings[idx]) { selectedListing = listings[idx]; step=2; ussdPrompt(); }
                else { alert("Invalid choice"); step=1; ussdPrompt(); }
            } else { alert("Order cancelled"); return; }
        } else if (step === 2) {
            const kgInput = prompt(`How many kg of ${selectedListing.fishType}? Max ${selectedListing.kg}kg`);
            const kg = parseFloat(kgInput);
            if (!isNaN(kg) && kg>0 && kg<=selectedListing.kg) {
                quantity = kg;
                step=3;
                ussdPrompt();
            } else { alert("Invalid quantity"); step=2; ussdPrompt(); }
        } else if (step === 3) {
            const total = quantity * selectedListing.price;
            if (confirm(`Confirm order: ${quantity}kg of ${selectedListing.fishType} from ${selectedListing.sellerName}. Total KES ${total}. OK?`)) {
                const newOrder = {
                    id: Date.now().toString(),
                    buyer: currentUser.username,
                    buyerName: currentUser.name,
                    buyerPhone: currentUser.phone,
                    buyerPhoto: currentUser.photoUrl || "",
                    seller: selectedListing.seller,
                    sellerName: selectedListing.sellerName,
                    sellerPhone: selectedListing.sellerPhone,
                    sellerPhoto: selectedListing.sellerPhoto || "",
                    listingId: selectedListing.id,
                    fishType: selectedListing.fishType,
                    quantity: quantity,
                    total: total,
                    status: "pending",
                    timestamp: Date.now()
                };
                orders.push(newOrder);
                selectedListing.kg -= quantity;
                if (selectedListing.kg <= 0) listings = listings.filter(l => l.id !== selectedListing.id);
                saveToLocalStorage();
                addNotification(selectedListing.seller, "order", `New order via USSD from ${currentUser.name}: ${quantity}kg of ${selectedListing.fishType}, total KES ${total}. Contact buyer: ${currentUser.phone}`);
                alert(t("orderPlaced"));
                render();
            } else { alert("Cancelled"); }
        }
    }
    ussdPrompt();
}

function renderAuth(container) {
    container.innerHTML = `
        <div class="card" id="login-card">
            <h2>${t("login")}</h2>
            <input type="text" id="login-username" placeholder="${t("username")}">
            <input type="password" id="login-password" placeholder="${t("password")}">
            <button id="do-login">${t("loginBtn")}</button>
            <button id="google-login" class="btn-secondary" style="margin-top:5px">${t("loginGoogle")}</button>
            <hr>
            <p><a href="#" id="show-register">${t("switchToRegister")}</a></p>
        </div>
        <div class="card" id="register-card" style="display:none">
            <h2>${t("register")}</h2>
            <input type="text" id="reg-username" placeholder="${t("username")}">
            <input type="password" id="reg-password" placeholder="${t("password")}">
            <input type="password" id="reg-confirm" placeholder="${t("confirmPassword")}">
            <select id="reg-role"><option value="seller">${t("seller")}</option><option value="buyer">${t("buyer")}</option></select>
            <input type="text" id="reg-name" placeholder="${t("fullName")}">
            <input type="text" id="reg-phone" placeholder="${t("phone")}">
            <input type="text" id="reg-beach" placeholder="${t("beach")}">
            <input type="file" id="reg-photo" accept="image/*">
            <button id="do-register">${t("registerBtn")}</button>
            <hr>
            <p><a href="#" id="show-login">${t("switchToLogin")}</a></p>
        </div>
    `;

    document.getElementById("do-login").onclick = () => {
        const uname = document.getElementById("login-username").value;
        const pwd = document.getElementById("login-password").value;
        const user = users.find(u => u.username === uname && u.password === pwd);
        if (user) { currentUser = { ...user }; saveToLocalStorage(); render(); }
        else alert(t("invalidLogin"));
    };
    document.getElementById("google-login").onclick = () => {
        const email = prompt("Simulated Google Login. Enter email:", "demo@example.com");
        if (email) {
            let uname = email.split('@')[0];
            if (users.find(u => u.username === uname)) uname = uname + "_" + Date.now();
            const newUser = { username: uname, password: "google_auth", role: "buyer", name: uname, phone: "07xxxx", beach: "", photoUrl: "" };
            users.push(newUser);
            currentUser = newUser;
            saveToLocalStorage();
            render();
        }
    };
    document.getElementById("show-register").onclick = (e) => { e.preventDefault(); document.getElementById("login-card").style.display = "none"; document.getElementById("register-card").style.display = "block"; };
    document.getElementById("show-login").onclick = (e) => { e.preventDefault(); document.getElementById("login-card").style.display = "block"; document.getElementById("register-card").style.display = "none"; };
    document.getElementById("do-register").onclick = () => {
        const uname = document.getElementById("reg-username").value;
        const pwd = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm").value;
        const role = document.getElementById("reg-role").value;
        const name = document.getElementById("reg-name").value;
        const phone = document.getElementById("reg-phone").value;
        const beach = document.getElementById("reg-beach").value;
        const photoFile = document.getElementById("reg-photo").files[0];
        if (!uname || !pwd || !name || !phone) { alert(t("fillAll")); return; }
        if (pwd !== confirm) { alert(t("passwordMismatch")); return; }
        if (users.find(u => u.username === uname)) { alert(t("userExists")); return; }
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(e) { finish(e.target.result); };
            reader.readAsDataURL(photoFile);
        } else finish("");
        function finish(photoUrl) {
            const newUser = { username: uname, password: pwd, role, name, phone, beach, photoUrl };
            users.push(newUser);
            currentUser = newUser;
            saveToLocalStorage();
            render();
        }
    };
}

function renderSellerDashboard(container) {
    const myListings = listings.filter(l => l.seller === currentUser.username);
    const myOrdersReceived = orders.filter(o => o.seller === currentUser.username);
    const userNotifs = notifications.filter(n => n.toUser === currentUser.username);
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:1rem;">
            <div style="display:flex; align-items:center; gap:15px;">
                ${currentUser.photoUrl ? `<img src="${currentUser.photoUrl}" class="profile-pic" onerror="this.style.display='none'">` : `<i class="fas fa-user-circle profile-pic" style="font-size:60px; color:gold;"></i>`}
                <h2>${t("welcome")} ${currentUser.name} (${t("seller")})</h2>
            </div>
            <button id="logout-btn" class="btn-secondary">${t("logout")}</button>
        </div>
        <div class="grid-2">
            <div class="card">
                <h3>${t("addFish")}</h3>
                <select id="fish-type">${fishTypes.map(f => `<option>${f}</option>`).join('')}</select>
                <input type="number" id="fish-kg" placeholder="${t("kgAvailable")}">
                <input type="number" id="fish-price" placeholder="${t("pricePerKg")}">
                <select id="fish-gutted"><option value="yes">${t("yes")}</option><option value="no">${t("no")}</option></select>
                <button id="publish-listing">${t("submitListing")}</button>
            </div>
            <div class="card">
                <h3>${t("aiAssistant")}</h3>
                <p id="ai-tip">💡 Click below for low-cost preservation advice</p>
                <button id="ask-ai">${t("askAI")}</button>
            </div>
        </div>
        <div class="card"><h3>${t("myListings")}</h3><div id="seller-listings">${renderListingCards(myListings, true)}</div></div>
        <div class="card"><h3>${t("ordersReceived")}</h3><div id="orders-received">${renderOrdersForSeller(myOrdersReceived)}</div></div>
        <div class="card"><h3>${t("notificationsTitle")} (${userNotifs.filter(n=>!n.read).length})</h3><div id="seller-notifs">${renderNotifs(userNotifs)}</div><button id="raise-alarm" class="btn-secondary">${t("raiseAlarm")}</button></div>
    `;

    document.getElementById("publish-listing")?.addEventListener("click", () => {
        const fishType = document.getElementById("fish-type").value;
        const kg = parseFloat(document.getElementById("fish-kg").value);
        const price = parseFloat(document.getElementById("fish-price").value);
        const gutted = document.getElementById("fish-gutted").value === "yes";
        if (!fishType || isNaN(kg) || isNaN(price)) { alert(t("fillAll")); return; }
        const newListing = {
            id: Date.now().toString(),
            seller: currentUser.username,
            sellerName: currentUser.beach || currentUser.name,
            sellerPhone: currentUser.phone,
            sellerPhoto: currentUser.photoUrl || "",
            fishType, kg, price, gutted, timestamp: Date.now()
        };
        listings.push(newListing);
        saveToLocalStorage();
        users.filter(u => u.role === "buyer").forEach(b => addNotification(b.username, "stock", `${t("stockAlert")}: ${fishType} ${kg}kg @ ${price}KES from ${currentUser.name}`));
        alert(t("listingAdded"));
        render();
    });
    document.getElementById("ask-ai")?.addEventListener("click", () => {
        const tips = ["🐟 Salt drying under sun: layer fish with salt, dry 2 days.","❄️ Clay pot cooling: wet sand between two pots keeps fish cool for 48h.","🌿 Smoke with mango leaves – repels insects.","🧊 Bury in cool damp sand near lake shore (shade)."];
        document.getElementById("ai-tip").innerHTML = `💡 ${tips[Math.floor(Math.random()*tips.length)]}`;
    });
    document.getElementById("raise-alarm")?.addEventListener("click", () => {
        const msg = prompt(t("alarmMessage"), "I have excess Nile Perch, need help or can supply others.");
        if (msg) {
            users.filter(u => u.role === "seller" && u.username !== currentUser.username).forEach(s => addNotification(s.username, "alarm", `${t("sellerAlarm")} from ${currentUser.name}: ${msg}`));
            alert("Alarm sent to other sellers via SMS & dashboard");
        }
    });
    document.getElementById("logout-btn")?.addEventListener("click", () => { currentUser = null; saveToLocalStorage(); render(); });
}

function renderBuyerDashboard(container) {
    const myOrders = orders.filter(o => o.buyer === currentUser.username);
    const buyerNotifs = notifications.filter(n => n.toUser === currentUser.username);
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:1rem;">
            <div style="display:flex; gap:15px; align-items:center;">
                ${currentUser.photoUrl ? `<img src="${currentUser.photoUrl}" class="profile-pic" onerror="this.style.display='none'">` : `<i class="fas fa-user-circle profile-pic" style="font-size:60px;"></i>`}
                <h2>${t("welcome")} ${currentUser.name} (${t("buyer")})</h2>
            </div>
            <button id="logout-btn" class="btn-secondary">${t("logout")}</button>
        </div>
        <div class="card">
            <h3>${t("notificationsTitle")} <span class="notification-badge">${buyerNotifs.filter(n=>!n.read).length}</span></h3>
            <div id="buyer-notifs">${renderNotifs(buyerNotifs)}</div>
            <button id="ussd-btn" class="btn-secondary">${t("ussdOrder")}</button>
        </div>
        <div class="card">
            <h3>${t("availableFish")}</h3>
            <input type="text" id="search-fish" placeholder="${t("search")}">
            <div id="listings-container">${renderListingCards(listings, false)}</div>
        </div>
        <div class="card">
            <h3>${t("myOrders")}</h3>
            <div id="my-orders">${renderOrdersForBuyer(myOrders)}</div>
        </div>
    `;

    document.getElementById("search-fish")?.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = listings.filter(l => l.fishType.toLowerCase().includes(term));
        document.getElementById("listings-container").innerHTML = renderListingCards(filtered, false);
        attachOrderButtons();
    });
    document.getElementById("ussd-btn")?.addEventListener("click", () => simulateUSSD());
    document.getElementById("logout-btn")?.addEventListener("click", () => { currentUser = null; saveToLocalStorage(); render(); });
    attachOrderButtons();
}

function render() {
    const main = document.getElementById("main-content");
    if (!currentUser) renderAuth(main);
    else if (currentUser.role === "seller") renderSellerDashboard(main);
    else renderBuyerDashboard(main);
    updateLanguageButtons();
    attachMarkRead();
}

function updateLanguageButtons() {
    const enBtn = document.getElementById("btn-en");
    const swBtn = document.getElementById("btn-sw");
    if (!enBtn || !swBtn) return;
    enBtn.onclick = () => { lang = "en"; render(); };
    swBtn.onclick = () => { lang = "sw"; render(); };
    if (lang === "en") { enBtn.classList.add("lang-active"); swBtn.classList.remove("lang-active"); }
    else { swBtn.classList.add("lang-active"); enBtn.classList.remove("lang-active"); }
    document.getElementById("map-title").innerText = t("mapTitle");
    document.getElementById("footer-partners-title").innerText = "🤝 " + (lang === "en" ? "Our Partners" : "Washirika Wetu");
    document.getElementById("footer-text").innerHTML = (lang === "en" ? "🐟 Empowering Lake Victoria fishing communities | Powered by wisdom & conscience" : "🐟 Kuwasaidia wavuvi wa Ziwa Victoria | Kwa hekima na dhamiri");
}

loadData();
render();