FISHCo AGENCY – Lake Victoria Fish Marketplace

FISHCo AGENCY is a bilingual (English/Kiswahili) digital marketplace connecting fishing communities around Lake Victoria, Kenya. It enables fish sellers (fishermen, beach cooperatives) to list their catch and buyers (local traders, households, restaurants) to order directly – reducing post-harvest losses, increasing incomes, and building trust through transparency.

Live Demo: https://fishco-agency.vercel.app/
Repository:

Features

- Two user roles: Seller (fish seller/company) and Buyer (customer)
- User registration & login with username/password (localStorage-based)
- Google login simulation for quick demo access
- Profile pictures (upload during registration, displayed circular)
- Seller dashboard:
  - Add fish listings (type, kg, price per kg, gutted/ungutted)
  - View my listings
  - View orders received with buyer contact details (name, phone, photo)
  - AI assistant providing low-cost fish preservation tips
  - Raise alarm to other sellers (too much stock / need stock)
  - Receive notifications (new orders, stock alerts, seller alarms)
  - Update order status (Pending → Confirmed → Loaded → In Transit → Delivered)
- Buyer dashboard:
  - Browse all available fish listings
  - Search by fish type
  - Place orders online with payment method selection (M-Pesa, Credit/Debit Card, Cash on Delivery)
  - USSD simulation for offline ordering (step-by-step prompts)
  - View order history with seller contact details and payment method
  - Receive notifications (new stock alerts, order status updates)
- Payment methods:
  - M-Pesa (enter phone number for STK push simulation)
  - Credit/Debit Card (card details for demo)
  - Cash on Delivery (pay when fish arrives)
- Real-time order status updates (buyer sees status change immediately)
- Live location sharing with Google Maps navigation for deliveries
- Bilingual interface: English / Kiswahili toggle
- Low-bandwidth friendly: Lightweight, no external dependencies (except Font Awesome and Leaflet icons)
- Simulated SMS: Notifications logged to console and shown as browser alerts
- Static map: Lake Victoria location image (clickable to Google Maps)
- Partner section: Displays partner logos and names in footer

Tech Stack

- HTML5
- CSS3 (responsive, mobile-first)
- Vanilla JavaScript (ES6)
- Font Awesome (icons)
- Leaflet (maps)
- LocalStorage (client-side data persistence)

No backend, no database, no API keys required – runs entirely in the browser.

Project Structure

fishco-agency/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # All application logic
└── README.md           # This file

Getting Started

Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- (Optional) Local web server for development – but opening index.html directly works fine.

Installation

1. Clone the repository or download the ZIP:
   git clone https://github.com/yourusername/fishco-agency.git

2. Navigate to the project folder:
   cd fishco-agency

3. Open index.html in your browser – double-click or use a local server.

No build step, no dependencies to install.

Demo Accounts

| Role     | Username | Password |
|----------|----------|----------|
| Seller   | seller1  | pass     |
| Buyer    | buyer1   | pass     |

Or register a new account with any username/password. Profile photo is optional.

Deployment to Vercel (Free)

1. Push this project to a GitHub repository.
2. Log in to Vercel with your GitHub account.
3. Click Add New → Project and import your repository.
4. Vercel auto-detects static files – click Deploy.
5. Your live URL will be https://your-project-name.vercel.app

Order Status Flow

Pending → Confirmed → Loaded (ready for pickup) → In Transit → Delivered

When a seller updates the status, the buyer receives an instant notification and sees the new status in their order history.

Payment Methods

When placing an order, the buyer selects one of three payment methods:
- M-Pesa: Enter phone number (simulates STK push)
- Credit/Debit Card: Enter card details (demo mode)
- Cash on Delivery: Pay when fish is delivered

The payment method is displayed on the order card for both buyer and seller.

Location Sharing

- Users click "Update My Location" to share their GPS coordinates
- When an order is placed, both buyer and seller locations are saved
- Each order has a "Show Live Map" button that opens Google Maps with turn-by-turn navigation from deliverer to recipient

Limitations & Future Improvements

- Data persistence: Uses browser localStorage – clearing browser data erases all accounts/listings/orders.
- SMS & USSD: Simulated via console logs and browser prompts – production would require Africa's Talking or Twilio integration.
- Real-time updates: No WebSockets – status updates require re-render (handled automatically on status change).
- Payment: Simulated – production would require M-Pesa API, Stripe, or other payment gateway.
- Map: Uses Leaflet with OpenStreetMap – requires internet connection.

Frameworks Alignment (Capstone)

This project demonstrates all four expeditions from the AI Fluency & Ethical AI course:

| Expedition | Frameworks | Evidence in Project |
|------------|------------|----------------------|
| Savannah Precision | AIM, MAP, OCEAN | AI assistant prompts, USSD order flow, hallucination prevention |
| Tsavo Fluency | 4D (Delegation, Description, Discernment, Diligence) | Clear role delegation, user input validation, transparency in AI use |
| Ethical Savannah | ETHOS, TRACK, OASIS, PRIDE, HORIZON | Empathy-first UI, bias audit, data sovereignty (localStorage), human oversight, long-term impact |
| Agent Savannah | RANK, TRAIL, HUNT, GUARD, CYCLE | Listing/Order/Notification agents with boundaries, handoffs, safety rails, manual improvement loops |

Contributors

Mark Sam Okope Ogweno – Design, development, documentation

License

This project is for educational/demonstration purposes as part of a capstone portfolio. Free to use and modify for non-commercial community projects.

Acknowledgements

- Lake Victoria fishing communities for inspiration
- Course materials: Savannah Precision, Tsavo Fluency, Ethical Savannah, Agent Savannah frameworks
- Font Awesome for icons
- Leaflet for maps
- OpenStreetMap for map tiles

Built with conscience, for the community.
🐟 Empowering Lake Victoria, one catch at a time.
