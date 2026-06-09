# 🐟 FISHCo AGENCY – Lake Victoria Fish Marketplace

**FISHCo AGENCY** is a bilingual (English/Kiswahili) digital marketplace connecting fishing communities around Lake Victoria, Kenya. It enables fish sellers (fishermen, beach cooperatives) to list their catch and buyers (local traders, households, restaurants) to order directly – reducing post-harvest losses, increasing incomes, and building trust through transparency.

🌐 **Live Demo:** [Your Vercel URL here after deployment]  
📁 **Repository:** [Link to your GitHub repo]

---

## ✨ Features

- **Two user roles:** Seller (fish seller/company) and Buyer (customer)
- **User registration & login** with username/password (localStorage-based)
- **Google login simulation** for quick demo access
- **Profile pictures** (upload during registration, displayed circular)
- **Seller dashboard:**
  - Add fish listings (type, kg, price per kg, gutted/ungutted)
  - View my listings
  - View orders received with buyer contact details (name, phone, photo)
  - AI assistant providing low-cost fish preservation tips
  - Raise alarm to other sellers (too much stock / need stock)
  - Receive notifications (new orders, stock alerts, seller alarms)
- **Buyer dashboard:**
  - Browse all available fish listings
  - Search by fish type
  - Place orders online (with confirmation step)
  - USSD simulation for offline ordering (step-by-step prompts)
  - View order history with seller contact details
  - Receive notifications (new stock alerts, order confirmations)
- **Bilingual interface:** English / Kiswahili toggle
- **Low-bandwidth friendly:** Lightweight, no external dependencies (except Font Awesome icons)
- **Simulated SMS:** Notifications logged to console and shown as browser alerts
- **Static map:** Lake Victoria location image (clickable to Google Maps)
- **Partner section:** Displays partner logos and names in footer

---

## 🧱 Tech Stack

- HTML5
- CSS3 (responsive, mobile-first)
- Vanilla JavaScript (ES6)
- Font Awesome (icons)
- LocalStorage (client-side data persistence)

No backend, no database, no API keys required – runs entirely in the browser.

---

## 📁 Project Structure
fishco-website/
├── index.html # Main HTML file
├── style.css # All styles
├── script.js # All application logic
└── README.md # This file
## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- (Optional) Local web server for development – but opening `index.html` directly works fine.

### Installation

1. Clone the repository or download the ZIP:
   ```bash
   git clone https://github.com/yourusername/fishco-agency.git
