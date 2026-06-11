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
const ORDER_STATUSES = ["pending", "confirmed", "loaded", "in transit", "delivered"];
const STATUS_DISPLAY = {
    en: { pending:"Pending", confirmed:"Confirmed", loaded:"Loaded (ready for pickup)", "in transit":"In Transit", delivered:"Delivered" },
    sw: { pending:"Inasubiri", confirmed:"Imethibitishwa", loaded:"Imepakuliwa tayari", "in transit":"Iko njiani", delivered:"Imewasilishwa" }
};

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
        fillAll:"Please fill all fields.", passwordMismatch:"Passwords do not match.", userExists:"Username already exists. Please choose another.",
        invalidLogin:"Invalid username or password.", listingAdded:"Fish listing added!", sellerContact:"Seller Contact",
        buyerContact:"Buyer Contact", ordersReceived:"Orders Received", mapTitle:"📍 Our Location – Lake Victoria, Kenya",
        confirmOrder:"Confirm order", updateLocation:"📍 Update My Location", viewOnMap:"View on map",
        locationSaved:"Location saved! Others will see this when you place or receive orders.",
        status:"Status", registrationSuccess:"Registration successful! Please log in."
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
        fillAll:"Jaza sehemu zote", passwordMismatch:"Manenosiri hayafanani", userExists:"Jina lipo. Tafadhali chagua lingine.",
        invalidLogin:"Jina au nenosiri si sahihi.", listingAdded:"Samaki ameongezwa!", sellerContact:"Mawasiliano ya muuzaji",
        buyerContact:"Mawasiliano ya mnunuzi", ordersReceived:"Maagizo yaliyopokelewa", mapTitle:"📍 Eneo letu – Ziwa Victoria, Kenya",
        confirmOrder:"Thibitisha oda", updateLocation:"📍 Sasisha Eneo Langu", viewOnMap:"Tazama kwenye ramani",
        locationSaved:"Eneo limehifadhiwa!", status:"Hali", registrationSuccess:"Usajili umefanikiwa! Tafadhali ingia."
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
            { username: "seller1", password: "pass", role: "seller", name: "John Muigai", phone: "0712345678", beach: "Dunga Beach", photoUrl: "", location: null },
            { username: "buyer1", password: "pass", role: "buyer", name: "Jane Akinyi", phone: "0722334455", beach: "", photoUrl: "", location: null }
        ];
        saveToLocalStorage();
    }
    const storedListings = localStorage.getItem(STORAGE_LISTINGS);
    if (storedListings) listings = JSON.parse(storedListings);
    else {
        listings = [
            { id: "1", seller: "seller1", sellerName: "Dunga Beach Coop", sellerPhone: "0712345678", sellerPhoto: "", sellerLocation: null, fishType: "Tilapia", kg: 120, price: 380, gutted: true, timestamp: Date.now() },
            { id: "2", seller: "seller1", sellerName: "Dunga Beach Coop", sellerPhone: "0712345678", sellerPhoto: "", sellerLocation: null, fishType: "Nile Perch", kg: 80, price: 450, gutted: false, timestamp: Date.now() }
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

function getUserLocation(callback) {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        if (callback) callback(null);
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => callback({ lat: position.coords.latitude, lon: position.coords.longitude }),
        (error) => { alert("Location access denied"); callback(null); },
        { enableHighAccuracy: true, timeout: 15000 }
    );
}

function addNotification(toUsername, type, message) {
    const notif = { id: Date.now()+Math.random(), toUser: toUsername, type, message, timestamp: Date.now(), read: false };
    notifications.push(notif);
    saveToLocalStorage();
    console.log(`📱 SMS to ${toUsername}: ${message}`);
    if (currentUser && currentUser.username === toUsername) alert(`🔔 ${message}`);
    render();
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    order.status = newStatus;
    saveToLocalStorage();
    const buyer = users.find(u => u.username === order.buyer);
    if (buyer) {
        const statusMsg = (lang === 'en' ? STATUS_DISPLAY.en[newStatus] : STATUS_DISPLAY.sw[newStatus]) || newStatus;
        addNotification(order.buyer, "order", `Order ${order.id} status: ${statusMsg}`);
    }
    render();
}

// ----- Helper: render a live map with Google navigation -----
function renderLiveMap(containerId, targetLat, targetLon, targetLabel, isDeliverer) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const info = document.createElement('div');
    info.style.marginBottom = '8px';
    info.style.fontSize = '0.9rem';
    info.innerHTML = `<strong>${targetLabel}</strong><br>📍 Lat: ${targetLat.toFixed(5)}, Lon: ${targetLon.toFixed(5)}`;
    container.appendChild(info);
    const navBtn = document.createElement('button');
    navBtn.textContent = '🧭 Navigate with Google Maps';
    navBtn.style.background = '#4285f4';
    navBtn.style.color = 'white';
    navBtn.style.margin = '5px 0';
    navBtn.style.padding = '8px';
    navBtn.style.border = 'none';
    navBtn.style.borderRadius = '8px';
    navBtn.style.cursor = 'pointer';
    navBtn.style.width = '100%';
    navBtn.onclick = () => {
        if (!targetLat || !targetLon) { alert("Location not available"); return; }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => window.open(`https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${targetLat},${targetLon}/?travelmode=driving`, '_blank'),
                () => window.open(`https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLon}`, '_blank')
            );
        } else {
            window.open(`https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLon}`, '_blank');
        }
    };
    container.appendChild(navBtn);
    const mapPreview = document.createElement('div');
    mapPreview.style.height = '200px';
    mapPreview.style.width = '100%';
    mapPreview.style.marginTop = '8px';
    mapPreview.style.borderRadius = '10px';
    mapPreview.style.overflow = 'hidden';
    container.appendChild(mapPreview);
    if (typeof L !== 'undefined') {
        const map = L.map(mapPreview).setView([targetLat, targetLon], 14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OSM'
        }).addTo(map);
        L.marker([targetLat, targetLon]).addTo(map).bindPopup(targetLabel);
        if (isDeliverer && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const myMarker = L.marker([pos.coords.latitude, pos.coords.longitude], { color: 'blue' }).addTo(map);
                myMarker.bindPopup('You (current)').openPopup();
                map.setView([pos.coords.latitude, pos.coords.longitude], 13);
            });
        }
        setTimeout(() => map.invalidateSize(), 200);
    }
}

// ----- Render functions (generate HTML strings, with inline onclick handlers) -----
function renderListingCards(list, isSellerView) {
    if (list.length === 0) return `<p>${t("noListings")}</p>`;
    return `<div class="grid-2">` + list.map(l => {
        let locationHtml = "";
        if (!isSellerView && l.sellerLocation) {
            locationHtml = `<br>📍 <a href="https://www.openstreetmap.org/?mlat=${l.sellerLocation.lat}&mlon=${l.sellerLocation.lon}&zoom=14" target="_blank">${t("viewOnMap")}</a>`;
        }
        return `
        <div class="card">
            <strong>🐟 ${l.fishType}</strong><br>
            📦 ${l.kg} kg | 💰 KES ${l.price}/kg | 🔪 ${l.gutted ? "Gutted" : "Not Gutted"}<br>
            🏪 ${l.sellerName}<br>
            ${locationHtml}
            ${!isSellerView ? `<button class="order-btn" data-id="${l.id}" onclick="window.orderProduct('${l.id}')">${t("order")}</button>` : ''}
        </div>
    `}).join('') + `</div>`;
}

function renderOrdersForBuyer(orderList) {
    if (orderList.length === 0) return "<p>No orders yet.</p>";
    return orderList.map(o => {
        let locationHtml = "";
        if (o.sellerLocation) {
            locationHtml = `<br>📍 <a href="https://www.openstreetmap.org/?mlat=${o.sellerLocation.lat}&mlon=${o.sellerLocation.lon}&zoom=14" target="_blank">${t("viewOnMap")}</a>`;
        }
        const statusDisplay = (lang === 'en' ? STATUS_DISPLAY.en[o.status] : STATUS_DISPLAY.sw[o.status]) || o.status;
        const mapId = `order-map-buyer-${o.id}`;
        const hasBothLocs = o.sellerLocation && currentUser && currentUser.location;
        return `
        <div style="border-bottom:1px solid #ccc; padding:8px; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; gap:10px; align-items:flex-start;">
                ${o.sellerPhoto ? `<img src="${o.sellerPhoto}" class="profile-pic-small" onerror="this.style.display='none'">` : `<i class="fas fa-user-circle profile-pic-small"></i>`}
                <div style="flex:1">
                    <strong>${o.fishType} x ${o.quantity}kg = KES ${o.total}</strong><br>
                    <span style="font-size:0.85rem;">📞 ${t("sellerContact")}: ${o.sellerName} (${o.sellerPhone})</span>
                    ${locationHtml}<br>
                    <strong>${t("status")}:</strong> ${statusDisplay}
                </div>
            </div>
            ${hasBothLocs ? `<button onclick="window.toggleMap('buyer-${o.id}')" class="map-toggle-btn">🗺️ Show Live Map</button>
            <div id="${mapId}" class="order-map" style="display:none;"></div>` : ''}
        </div>
    `}).join('');
}

function renderOrdersForSeller(orderList) {
    if (orderList.length === 0) return "<p>No orders received.</p>";
    return orderList.map(o => {
        let locationHtml = "";
        if (o.buyerLocation) {
            locationHtml = `<br>📍 <a href="https://www.openstreetmap.org/?mlat=${o.buyerLocation.lat}&mlon=${o.buyerLocation.lon}&zoom=14" target="_blank">${t("viewOnMap")}</a>`;
        }
        const currentStatus = o.status;
        const nextStatuses = ORDER_STATUSES.slice(ORDER_STATUSES.indexOf(currentStatus) + 1);
        const statusDisplay = (lang === 'en' ? STATUS_DISPLAY.en[currentStatus] : STATUS_DISPLAY.sw[currentStatus]) || currentStatus;
        let buttonsHtml = "";
        if (currentStatus !== "delivered") {
            buttonsHtml = `<div style="margin-top:8px;">${nextStatuses.map(s => 
                `<button onclick="window.updateOrderStatus('${o.id}', '${s}')" style="width:auto; margin-right:5px; padding:4px 8px; font-size:0.8rem;">${t(s)}</button>`
            ).join('')}</div>`;
        }
        const mapId = `order-map-seller-${o.id}`;
        const hasBothLocs = o.buyerLocation && currentUser && currentUser.location;
        return `
        <div style="border-bottom:1px solid #ccc; padding:8px; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; gap:10px; align-items:flex-start;">
                ${o.buyerPhoto ? `<img src="${o.buyerPhoto}" class="profile-pic-small" onerror="this.style.display='none'">` : `<i class="fas fa-user-circle profile-pic-small"></i>`}
                <div style="flex:1">
                    <strong>${o.fishType} x ${o.quantity}kg = KES ${o.total}</strong><br>
                    Buyer: ${o.buyerName}<br>
                    <span style="font-size:0.85rem;">📞 ${t("buyerContact")}: ${o.buyerPhone}</span>
                    ${locationHtml}<br>
                    <strong>${t("status")}:</strong> ${statusDisplay}
                    ${buttonsHtml}
                </div>
            </div>
            ${hasBothLocs ? `<button onclick="window.toggleMap('seller-${o.id}')" class="map-toggle-btn">🗺️ Show Live Map (Buyer location)</button>
            <div id="${mapId}" class="order-map" style="display:none;"></div>` : ''}
        </div>
    `}).join('');
}

function renderNotifs(notifList) {
    if (notifList.length === 0) return "<p>No notifications</p>";
    return notifList.map(n => `
        <div style="border-bottom:1px solid #eee; padding:8px 0;">
            <strong>${n.type === "stock" ? "📢 Stock Alert" : (n.type === "order" ? "🛒 New Order" : "🚨 Seller Alarm")}</strong><br>
            ${n.message}<br>
            <small>${new Date(n.timestamp).toLocaleString()}</small>
            ${!n.read ? `<button onclick="window.markNotificationRead('${n.id}')">${t("markRead")}</button>` : ''}
        </div>
    `).join('');
}

// ----- Global actions (called by inline onclick) -----
window.orderProduct = function(listingId) {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    const qty = parseFloat(prompt(`Enter kg of ${listing.fishType} (max ${listing.kg}):`, "1"));
    if (isNaN(qty) || qty <= 0 || qty > listing.kg) { alert("Invalid quantity"); return; }
    const total = qty * listing.price;
    if (confirm(`Order ${qty}kg ${listing.fishType} from ${listing.sellerName} for KES ${total}?`)) {
        getUserLocation((coords) => {
            const newOrder = {
                id: Date.now().toString(),
                buyer: currentUser.username,
                buyerName: currentUser.name,
                buyerPhone: currentUser.phone,
                buyerPhoto: currentUser.photoUrl || "",
                buyerLocation: coords || currentUser.location,
                seller: listing.seller,
                sellerName: listing.sellerName,
                sellerPhone: listing.sellerPhone,
                sellerPhoto: listing.sellerPhoto || "",
                sellerLocation: listing.sellerLocation,
                listingId: listing.id,
                fishType: listing.fishType,
                quantity: qty,
                total: total,
                status: "pending",
                timestamp: Date.now()
            };
            orders.push(newOrder);
            listing.kg -= qty;
            if (listing.kg <= 0) listings = listings.filter(l => l.id !== listing.id);
            saveToLocalStorage();
            addNotification(listing.seller, "order", `New order from ${currentUser.name}: ${qty}kg ${listing.fishType}. Contact: ${currentUser.phone}`);
            alert(t("orderPlaced"));
            render();
        });
    }
};

window.updateOrderStatus = function(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus);
};

window.markNotificationRead = function(notifId) {
    const notif = notifications.find(n => n.id == notifId);
    if (notif) notif.read = true;
    saveToLocalStorage();
    render();
};

window.toggleMap = function(ref) {
    const isSeller = ref.startsWith("seller-");
    const orderId = ref.replace("seller-","").replace("buyer-","");
    const mapDiv = document.getElementById(`order-map-${isSeller ? "seller" : "buyer"}-${orderId}`);
    if (!mapDiv) return;
    if (mapDiv.style.display === "none") {
        mapDiv.style.display = "block";
        const order = orders.find(o => o.id === orderId);
        if (order && currentUser) {
            if (isSeller && order.buyerLocation) {
                renderLiveMap(mapDiv.id, order.buyerLocation.lat, order.buyerLocation.lon, `Buyer: ${order.buyerName}`, true);
            } else if (!isSeller && order.sellerLocation) {
                renderLiveMap(mapDiv.id, order.sellerLocation.lat, order.sellerLocation.lon, `Seller: ${order.sellerName}`, false);
            } else {
                mapDiv.innerHTML = "<p style='color:red'>Location not shared by the other party.</p>";
            }
        }
        const btn = event.target;
        if (btn) btn.textContent = "🗺️ Hide Live Map";
    } else {
        mapDiv.style.display = "none";
        const btn = event.target;
        if (btn) btn.textContent = "🗺️ Show Live Map";
    }
};

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
                getUserLocation((coords) => {
                    const buyerLocation = coords || (currentUser.location || null);
                    const newOrder = {
                        id: Date.now().toString(),
                        buyer: currentUser.username,
                        buyerName: currentUser.name,
                        buyerPhone: currentUser.phone,
                        buyerPhoto: currentUser.photoUrl || "",
                        buyerLocation: buyerLocation,
                        seller: selectedListing.seller,
                        sellerName: selectedListing.sellerName,
                        sellerPhone: selectedListing.sellerPhone,
                        sellerPhoto: selectedListing.sellerPhoto || "",
                        sellerLocation: selectedListing.sellerLocation || null,
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
                });
            } else { alert("Cancelled"); }
        }
    }
    ussdPrompt();
}

// ----- LOGIN & REGISTRATION FUNCTIONS -----
window.handleLogin = function() {
    const uname = document.getElementById("login-username").value.trim();
    const pwd = document.getElementById("login-password").value;
    console.log("Attempting login with:", uname);
    const user = users.find(u => u.username === uname && u.password === pwd);
    if (user) {
        currentUser = { ...user };
        saveToLocalStorage();
        render();
    } else {
        alert(t("invalidLogin"));
    }
};

window.handleGoogleLogin = function() {
    const email = prompt("Google login demo – enter any email");
    if (email) {
        let uname = email.split('@')[0];
        if (users.find(u => u.username === uname)) uname += "_" + Date.now();
        const newUser = { username: uname, password: "google", role: "buyer", name: uname, phone: "07xxxx", beach: "", photoUrl: "", location: null };
        users.push(newUser);
        saveToLocalStorage();
        currentUser = newUser;
        render();
    }
};

window.handleRegister = function() {
    const uname = document.getElementById("reg-username").value.trim();
    const pwd = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    const role = document.getElementById("reg-role").value;
    const name = document.getElementById("reg-name").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const beach = document.getElementById("reg-beach").value.trim();
    const photoFile = document.getElementById("reg-photo").files[0];

    if (!uname || !pwd || !name || !phone) {
        alert(t("fillAll"));
        return;
    }
    if (pwd !== confirm) {
        alert(t("passwordMismatch"));
        return;
    }
    if (users.find(u => u.username === uname)) {
        alert(t("userExists"));
        return;
    }

    const finish = (photoUrl) => {
        users.push({
            username: uname,
            password: pwd,
            role: role,
            name: name,
            phone: phone,
            beach: beach,
            photoUrl: photoUrl || "",
            location: null
        });
        saveToLocalStorage();
        alert(t("registrationSuccess"));
        document.getElementById("login-card").style.display = "block";
        document.getElementById("register-card").style.display = "none";
        document.getElementById("reg-username").value = "";
        document.getElementById("reg-password").value = "";
        document.getElementById("reg-confirm").value = "";
        document.getElementById("reg-name").value = "";
        document.getElementById("reg-phone").value = "";
        document.getElementById("reg-beach").value = "";
        document.getElementById("reg-photo").value = "";
    };
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = (e) => finish(e.target.result);
        reader.readAsDataURL(photoFile);
    } else {
        finish("");
    }
};

window.showRegisterForm = function() {
    document.getElementById("login-card").style.display = "none";
    document.getElementById("register-card").style.display = "block";
};

window.showLoginForm = function() {
    document.getElementById("login-card").style.display = "block";
    document.getElementById("register-card").style.display = "none";
};

// ----- Dashboard actions -----
window.publishListing = function() {
    const fishType = document.getElementById("fish-type").value;
    const kg = parseFloat(document.getElementById("fish-kg").value);
    const price = parseFloat(document.getElementById("fish-price").value);
    const gutted = document.getElementById("fish-gutted").value === "yes";
    if (!fishType || isNaN(kg) || isNaN(price)) { alert(t("fillAll")); return; }
    getUserLocation((coords) => {
        const sellerLocation = coords || currentUser.location;
        listings.push({
            id: Date.now().toString(),
            seller: currentUser.username,
            sellerName: currentUser.beach || currentUser.name,
            sellerPhone: currentUser.phone,
            sellerPhoto: currentUser.photoUrl,
            sellerLocation,
            fishType, kg, price, gutted, timestamp: Date.now()
        });
        if (coords) { currentUser.location = coords; saveToLocalStorage(); }
        saveToLocalStorage();
        users.filter(u => u.role === "buyer").forEach(b => addNotification(b.username, "stock", `${t("stockAlert")}: ${fishType} ${kg}kg @ KES ${price} from ${currentUser.name}`));
        alert(t("listingAdded"));
        render();
    });
};

window.askAI = function() {
    const tips = ["🐟 Salt drying under sun: layer fish with salt, dry 2 days.","❄️ Clay pot cooling: wet sand between two pots keeps fish cool for 48h.","🌿 Smoke with mango leaves – repels insects.","🧊 Bury in cool damp sand near lake shore (shade)."];
    document.getElementById("ai-tip").innerHTML = `💡 ${tips[Math.floor(Math.random()*tips.length)]}`;
};

window.raiseAlarm = function() {
    const msg = prompt(t("alarmMessage"), "I have excess fish");
    if (msg) {
        users.filter(u => u.role === "seller" && u.username !== currentUser.username).forEach(s => addNotification(s.username, "alarm", `${currentUser.name}: ${msg}`));
        alert("Alarm sent to other sellers");
    }
};

window.updateUserLocation = function() {
    getUserLocation((coords) => {
        if (coords) {
            currentUser.location = coords;
            const dbUser = users.find(u => u.username === currentUser.username);
            if (dbUser) dbUser.location = coords;
            saveToLocalStorage();
            alert(t("locationSaved"));
            render();
        }
    });
};

window.logout = function() {
    currentUser = null;
    saveToLocalStorage();
    render();
};

window.filterListings = function() {
    const term = document.getElementById("search-fish").value.toLowerCase();
    const filtered = listings.filter(l => l.fishType.toLowerCase().includes(term));
    document.getElementById("listings-container").innerHTML = renderListingCards(filtered, false);
};

// ----- Render Auth or Dashboard -----
function renderAuth(container) {
    container.innerHTML = `
        <div class="card" id="login-card">
            <h2>${t("login")}</h2>
            <input type="text" id="login-username" placeholder="${t("username")}">
            <input type="password" id="login-password" placeholder="${t("password")}">
            <button onclick="window.handleLogin()">${t("loginBtn")}</button>
            <button onclick="window.handleGoogleLogin()" class="btn-secondary">${t("loginGoogle")}</button>
            <hr>
            <p><a href="#" onclick="window.showRegisterForm(); return false;">${t("switchToRegister")}</a></p>
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
            <button onclick="window.handleRegister()">${t("registerBtn")}</button>
            <hr>
            <p><a href="#" onclick="window.showLoginForm(); return false;">${t("switchToLogin")}</a></p>
        </div>
    `;
}

function renderSellerDashboard(container) {
    const myListings = listings.filter(l => l.seller === currentUser.username);
    const myOrdersReceived = orders.filter(o => o.seller === currentUser.username);
    const userNotifs = notifications.filter(n => n.toUser === currentUser.username);
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:15px;">
                ${currentUser.photoUrl ? `<img src="${currentUser.photoUrl}" class="profile-pic">` : `<i class="fas fa-user-circle profile-pic" style="font-size:60px; color:gold;"></i>`}
                <h2>${t("welcome")} ${currentUser.name} (${t("seller")})</h2>
            </div>
            <div>
                <button onclick="window.updateUserLocation()" class="btn-secondary">📍 ${t("updateLocation")}</button>
                <button onclick="window.logout()" class="btn-secondary">${t("logout")}</button>
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <h3>${t("addFish")}</h3>
                <select id="fish-type">${fishTypes.map(f => `<option>${f}</option>`).join('')}</select>
                <input type="number" id="fish-kg" placeholder="${t("kgAvailable")}">
                <input type="number" id="fish-price" placeholder="${t("pricePerKg")}">
                <select id="fish-gutted"><option value="yes">${t("yes")}</option><option value="no">${t("no")}</option></select>
                <button onclick="window.publishListing()">${t("submitListing")}</button>
            </div>
            <div class="card">
                <h3>${t("aiAssistant")}</h3>
                <p id="ai-tip">💡 Click below for preservation advice</p>
                <button onclick="window.askAI()">${t("askAI")}</button>
            </div>
        </div>
        <div class="card"><h3>${t("myListings")}</h3><div id="seller-listings">${renderListingCards(myListings, true)}</div></div>
        <div class="card"><h3>${t("ordersReceived")}</h3><div id="orders-received">${renderOrdersForSeller(myOrdersReceived)}</div></div>
        <div class="card"><h3>${t("notificationsTitle")} (${userNotifs.filter(n=>!n.read).length})</h3>
            <div id="seller-notifs">${renderNotifs(userNotifs)}</div>
            <button onclick="window.raiseAlarm()" class="btn-secondary">${t("raiseAlarm")}</button>
        </div>
    `;
}

function renderBuyerDashboard(container) {
    const myOrders = orders.filter(o => o.buyer === currentUser.username);
    const buyerNotifs = notifications.filter(n => n.toUser === currentUser.username);
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; gap:15px; align-items:center;">
                ${currentUser.photoUrl ? `<img src="${currentUser.photoUrl}" class="profile-pic">` : `<i class="fas fa-user-circle profile-pic" style="font-size:60px;"></i>`}
                <h2>${t("welcome")} ${currentUser.name} (${t("buyer")})</h2>
            </div>
            <div>
                <button onclick="window.updateUserLocation()" class="btn-secondary">📍 ${t("updateLocation")}</button>
                <button onclick="window.logout()" class="btn-secondary">${t("logout")}</button>
            </div>
        </div>
        <div class="card">
            <h3>${t("notificationsTitle")} <span class="notification-badge">${buyerNotifs.filter(n=>!n.read).length}</span></h3>
            <div id="buyer-notifs">${renderNotifs(buyerNotifs)}</div>
            <button onclick="window.simulateUSSD()" class="btn-secondary">${t("ussdOrder")}</button>
        </div>
        <div class="card">
            <h3>${t("availableFish")}</h3>
            <input type="text" id="search-fish" placeholder="${t("search")}" onkeyup="window.filterListings()">
            <div id="listings-container">${renderListingCards(listings, false)}</div>
        </div>
        <div class="card">
            <h3>${t("myOrders")}</h3>
            <div id="my-orders">${renderOrdersForBuyer(myOrders)}</div>
        </div>
    `;
}

function render() {
    const main = document.getElementById("main-content");
    if (!main) return;
    if (!currentUser) renderAuth(main);
    else if (currentUser.role === "seller") renderSellerDashboard(main);
    else renderBuyerDashboard(main);
    updateLanguageButtons();
}

function updateLanguageButtons() {
    const enBtn = document.getElementById("btn-en");
    const swBtn = document.getElementById("btn-sw");
    if (enBtn && swBtn) {
        enBtn.onclick = () => { lang = "en"; render(); };
        swBtn.onclick = () => { lang = "sw"; render(); };
        if (lang === "en") { enBtn.classList.add("lang-active"); swBtn.classList.remove("lang-active"); }
        else { swBtn.classList.add("lang-active"); enBtn.classList.remove("lang-active"); }
    }
    const mapTitle = document.getElementById("map-title");
    if (mapTitle) mapTitle.innerText = t("mapTitle");
    const footerTitle = document.getElementById("footer-partners-title");
    if (footerTitle) footerTitle.innerHTML = "🤝 " + (lang === "en" ? "Our Partners" : "Washirika Wetu");
    const footerText = document.getElementById("footer-text");
    if (footerText) footerText.innerText = lang === "en" ? "🐟 Empowering Lake Victoria fishing communities | Powered by wisdom & conscience" : "🐟 Kuwasaidia wavuvi wa Ziwa Victoria | Kwa hekima na dhamiri";
}

window.simulateUSSD = simulateUSSD;

loadData();
render();
