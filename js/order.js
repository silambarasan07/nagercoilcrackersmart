/* ---------- Helper Functions ---------- */
    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    /* ---------- LocalStorage Cart Persistence ---------- */
    function loadCart() {
      try {
        const saved = localStorage.getItem('nagercoil_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.assign(cart, parsed);
        }
      } catch (e) { console.error(e); }
    }

    function saveCart() {
      try {
        localStorage.setItem('nagercoil_cart', JSON.stringify(cart));
      } catch (e) { console.error(e); }
    }

    /* ---------- Scroll Visibility (Top Button, Sticky Home Button & Header Scroll Hide/Show) ---------- */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const stickyHomeBtn = document.getElementById('stickyHomeBtn');
    const controlsEl = document.querySelector('.controls');
    const catNavElScroll = document.getElementById('catNav');
    let lastScrollYOrder = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 200) {
        scrollTopBtn?.classList.add('visible');
        stickyHomeBtn?.classList.add('visible');
      } else {
        scrollTopBtn?.classList.remove('visible');
        stickyHomeBtn?.classList.remove('visible');
      }

      // Mobile view header controls hide/show logic (hides .controls & #catNav on scroll down)
      // Note: .cart-bar and .cart-bar-inner remain fixed & visible at bottom as requested
      if (window.innerWidth < 1024) {
        if (currentScrollY > lastScrollYOrder && currentScrollY > 120) {
          // Scrolling DOWN -> Hide top controls (.controls and #catNav)
          if (controlsEl) {
            controlsEl.style.transform = 'translateY(-100%)';
            controlsEl.style.opacity = '0';
            controlsEl.style.pointerEvents = 'none';
          }
        } else {
          // Scrolling UP or at top -> Show top controls
          if (controlsEl) {
            controlsEl.style.transform = 'translateY(0)';
            controlsEl.style.opacity = '1';
            controlsEl.style.pointerEvents = 'auto';
          }
        }
      } else {
        // Desktop reset
        if (controlsEl) {
          controlsEl.style.transform = 'translateY(0)';
          controlsEl.style.opacity = '1';
          controlsEl.style.pointerEvents = 'auto';
        }
      }

      lastScrollYOrder = currentScrollY;
    });

    /* ---------- Icon set ---------- */
    const ICONS = {
      sparkler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none"/></svg>`,
      flowerpot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11h10l-1.3 8.5a1 1 0 0 1-1 .8H9.3a1 1 0 0 1-1-.8L7 11z"/><path d="M12 11V4"/><path d="M12 4c-1.5-1.5-4-1-4 1M12 4c1.5-1.5 4-1 4 1M12 6.5c-1.2-1-3-.7-3 .6M12 6.5c1.2-1 3-.7 3 .6"/></svg>`,
      chakar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 10c2-3 6-3 6 0s-4 3-6 0zM12 14c-2 3-6 3-6 0s4-3 6 0zM10 12c-3-2-3-6 0-6s3 4 0 6zM14 12c3 2 3 6 0 6s-3-4 0-6z"/></svg>`,
      cracker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="3" height="12" rx="1"/><rect x="10.5" y="6" width="3" height="14" rx="1"/><rect x="15" y="9" width="3" height="11" rx="1"/><path d="M8 8c-1-2 0-4 2-5M12 6c-.5-2 .5-4 2-4"/></svg>`,
      pencil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l2-13h2l2 13a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M11 7 12 2l1 5"/><path d="M9.5 15h5"/></svg>`,
      kids: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3"/><path d="M6 21c0-4 2.5-6 6-6s6 2 6 6"/><path d="M4 10l2 2M20 10l-2 2"/></svg>`,
      star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.6 6.2L21 9l-5 4.4L17.4 21 12 17.3 6.6 21 8 13.4 3 9l6.4-.8z"/></svg>`,
      rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 2 4 6 4 10l-4 4-4-4c0-4 1-8 4-10z"/><path d="M9 14l-3 3 1 3 3-3M15 14l3 3-1 3-3-3"/><circle cx="12" cy="9" r="1.4" fill="currentColor" stroke="none"/></svg>`,
      bomb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="14" r="6"/><path d="M14.5 8.5 17 6M17 6l1.5-1.5M17 6l1.5 1.5"/></svg>`,
      gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11" rx="1"/><path d="M4 9h16v3H4z"/><path d="M12 9v11"/><path d="M12 9c-1-3-5-4-5-1.5S9 9 12 9zM12 9c1-3 5-4 5-1.5S15 9 12 9z"/></svg>`,
      skyshot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 21V9"/><path d="M12 9l-5-6M12 9l5-6"/><path d="M7 4l5-2 5 2"/><circle cx="12" cy="9" r="1.6" fill="currentColor" stroke="none"/></svg>`,
      pipe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="10" width="6" height="10" rx="1"/><path d="M12 10V6M9 6l3-4 3 4"/><path d="M7 5l1.5 1M17 5l-1.5 1"/></svg>`,
      multishot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 20V10"/><path d="M12 10 8 4M12 10l4-6M12 10l-2-7M12 10l2-7"/><rect x="9" y="20" width="6" height="2"/></svg>`,
      fountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22v-9"/><path d="M12 13c-3-2-4-6-2-9M12 13c3-2 4-6 2-9M12 13c-1.5-3-1-7 0-10M12 13c1.5-3 1-7 0-10"/><rect x="8" y="20" width="8" height="2" rx="1" fill="currentColor" stroke="none"/></svg>`,
      candle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10h4v10a2 2 0 0 1-2 2 2 2 0 0 1-2-2V10z"/><path d="M12 3c1.4 1.6 1.8 2.8.9 4-1 1.3-1 2 0 3"/></svg>`,
      paperblast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12 4 6l3 6-3 6z"/><path d="M12 12l8-6-3 6 3 6z"/></svg>`,
      digital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="10" rx="2"/><path d="M8 11h2m2 0h2m2 0h0M9 14h6"/></svg>`,
      giftbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M12 8c-1.2-3.5-6-4.5-6-1.5S8 8 12 8zM12 8c1.2-3.5 6-4.5 6-1.5S16 8 12 8z"/></svg>`,
    };

    function iconFor(catName) {
      const c = (catName || '').toLowerCase();
      if (c.includes('spark')) return ICONS.sparkler;
      if (c.includes('flower') || c.includes('mud')) return ICONS.flowerpot;
      if (c.includes('chakar') || c.includes('rider')) return ICONS.chakar;
      if (c.includes('sound cracker') || c.includes('bijili')) return ICONS.cracker;
      if (c.includes('pencil')) return ICONS.pencil;
      if (c.includes('childrens') || c.includes('galatta') || c.includes('dhamaka')) return ICONS.kids;
      if (c.includes('twinkling')) return ICONS.star;
      if (c.includes('rocket')) return ICONS.rocket;
      if (c.includes('bomb')) return ICONS.bomb;
      if (c.includes('funjoy') || c.includes('day wonder') || c.includes('arrivals')) return ICONS.gift;
      if (c.includes('sky shot')) return ICONS.skyshot;
      if (c.includes('pipe')) return ICONS.pipe;
      if (c.includes('multi colour') || c.includes('multi series')) return ICONS.multishot;
      if (c.includes('fountain') || c.includes('vip') || c.includes('night wonder')) return ICONS.fountain;
      if (c.includes('candle')) return ICONS.candle;
      if (c.includes('paper blast') || c.includes('smoke')) return ICONS.paperblast;
      if (c.includes('digital')) return ICONS.digital;
      if (c.includes('gift box')) return ICONS.giftbox;
      return ICONS.sparkler;
    }

    function onImgError(imgEl) {
      imgEl.style.display = 'none';
      const parent = imgEl.parentElement;
      if (!parent.querySelector('.p-icon-fallback')) {
        const catKey = imgEl.getAttribute('data-cat') || '';
        const fallback = document.createElement('div');
        fallback.className = 'p-icon-fallback';
        fallback.innerHTML = iconFor(catKey);
        parent.appendChild(fallback);
      }
    }

    /* ---------- Catalog data ---------- */
    const CATALOG = [
      ["Sparklers", [
        ["7 cm Electric colour/sparkeler", "10 Pcs", 40, 12],
        ["10 cm Electric sparkeler", "10 Pcs", 80, 24],
        ["10 cm Colour sparkeler", "10 Pcs", 90, 27],
        ["10 cm Green sparkeler", "10 Pcs", 95, 29],
        ["15 cm Electric sparkeler", "10 Pcs", 160, 48],
        ["15 cm Colour sparkeler", "10 Pcs", 175, 50],
        ["15 cm Green sparkeler", "10 Pcs", 180, 52],
        ["15 cm Red sparkeler", "10 Pcs", 195, 54],
        ["30 cm Electric sparklers", "5 Pcs", 160, 60],
        ["30 cm Colour Sparklers", "5 Pcs", 175, 53],
        ["50cm Electric Sparklers", "5 Pcs", 695, 175],
        ["50 cm colour Sparklers", "5 Pcs", 825, 195],
        ["Heart / Celebration Sparklers", "4 Pcs", 810, 205],
      ]],
      ["Flower Pots (Economy)", [
        ["Flower Pots Big -I", "10 Pcs", 290, 70],
        ["Flower Pots Special-I", "10 Pcs", 365, 95],
        ["Flower Pots Ashoka-I", "10 Pcs", 445, 115],
        ["Colour Koti-I", "10 Pcs", 740, 185],
      ]],
      ["Flower Pots (Premium)", [
        ["Flower Pot deluxe-II (P)", "5 Pcs", 975, 235],
        ["Tri Colour Pots", "5 Pcs", 1125, 265],
        ["Sony Violet Colour Koti", "10 Pcs", 3960, 825],
      ]],
      ["Vanitha Brand Flower Pots (Premium)", [
        ["Vanitha Flower Cone - II", "10 Pcs", 1750, 395],
        ["Colour Cone", "10 Pcs", 3475, 750],
        ["Vanitha Colour World", "10 Pcs", 4615, 985],
        ["Vanitha Fun Time", "10 Pcs", 6030, 1350],
        ["Vanitha Colour Koti", "", 3350, 750],
      ]],
      ["Ground Chakar", [
        ["Ground Chakar", "10 Pcs", 165, 50],
        ["Ground Chakar Special", "10 Pcs", 295, 87],
        ["Chocolate Wheel 4 in1", "5 Pcs", 650, 155],
        ["Wire Chakar", "10 Pcs", 850, 195],
        ["Whistle Wheel", "5 Pcs", 625, 160],
      ]],
      ["Vanitha Brand Ground Chakar", [
        ["Vanitha Spinner Super Deluxe", "10 Pcs", 1825, 425],
        ["Vanitha Spinner Mix", "8 Pcs", 975, 240],
        ["Vanitha Colour Spinner", "6 Pcs", 1175, 270],
      ]],
      ["Sound Cracker (Economy)", [
        ["2 3/4\" Sparrow Crackers-I (Kuruvi)", "5 Pcs", 40, 14],
        ["3 1/2\" Lakshmi Crackers-I", "5 Pcs", 55, 18],
        ["4\" Lakshmi Crackers-I", "5 Pcs", 85, 25],
        ["4\" Gold Lakshmi Crackers-I", "5 Pcs", 135, 40],
      ]],
      ["Sound Cracker (Premium)", [
        ["P-2 3/4\" Sparrow Crackers-II (Kuruvi)", "5 Pcs", 50, 20],
        ["P-3 1/2\" Lakshmi Crackers-II", "5 Pcs", 70, 25],
        ["P-4\" Lakshmi Crackers-II", "5 Pcs", 105, 30],
        ["P-4\" Lakshmi Deluxe Crackers-II", "10 Pcs", 125, 40],
        ["P-4\" Lakshmi Super Deluxe Crackers-II", "5 Pcs", 165, 45],
        ["P-2 Sound Crackers-II", "5 Pcs", 160, 50],
        ["Mega Deluxe 25Ply Crackers", "5 Pcs", 395, 90],
        ["5\" Jallikattu Crackers", "5 Pcs", 295, 75],
      ]],
      ["Pencil", [
        ["Colour Pencil", "5 Pcs", 295, 75],
      ]],
      ["Childrens Special", [
        ["Kit Kat / Chit Put", "10 Pcs", 120, 40],
        ["Snake Tablet", "50 Pcs", 90, 25],
        ["Roll Cap", "100 Rolls", 360, 90],
        ["Mini Colour Matches", "100 Pcs", 190, 70],
        ["Unicorn Match Stick", "100 Pcs", 560, 135],
        ["Ben 10 Match Stick", "", 300, 75],
        ["100 Colour Match Stick Large", "100 Pcs", 975, 220],
      ]],
      ["Twinkling Star", [
        ["1 1/2\" Twinkling Star", "10 Pcs", 115, 40],
        ["4\" Twinkling Star", "10 Pcs", 295, 70],
      ]],
      ["Rockets", [
        ["Rocket Bomb", "10 Pcs", 290, 75],
        ["Lunik Rocket", "10 Pcs", 575, 140],
        ["Vanitha Mark-1 Crackling Rocket", "10 Pcs", 2815, 675],
      ]],
      ["Bijili Crackers", [
        ["Special Red Bijili", "50 Pcs", 85, 30],
        ["Special Red Bijili", "100 Pcs", 175, 60],
        ["Special Stripped Bijili", "100 Pcs", 195, 70],
        ["Vanitha Striped Bijili", "100 Pcs", 665, 150],
      ]],
      ["Bombs", [
        ["Mini Bullet Bomb", "10 Pcs", 145, 45],
        ["Hydrogen Bomb", "10 Pcs", 375, 95],
        ["King Bomb", "10 Pcs", 560, 135],
        ["Classic / Tracer Bomb", "10 Pcs", 640, 155],
        ["King Rider Bomb", "10 Pcs", 1300, 295],
      ]],
      ["Enjoy Funjoy", [
        ["Mickey Mouse", "1 Pcs", 3750, 775],
      ]],
      ["Sky Shot Items", [
        ["Mini Sky Shot", "5 Pcs", 375, 110],
        ["7 Shots", "5 Pcs", 440, 120],
        ["Penta Sky Shot", "5 Pcs", 760, 205],
        ["3 Up", "5 Pcs", 880, 225],
      ]],
      ["Vanitha Brand Sky Shots", [
        ["Chip Mix", "2 Pcs", 725, 175],
        ["Lazer Show", "6 Pcs", 1375, 320],
        ["Miracle", "4 Pcs", 1545, 350],
        ["Gelly", "18 Pcs", 1915, 499],
        ["Fly Machine", "10 Pcs", 3260, 799],
        ["Rising Effect", "6 Pcs", 5930, 1275],
      ]],
      ["Fancy Pipe Out", [
        ["1 1/4\" Fancy Pipe", "1 Pcs", 175, 55],
        ["2\" Fancy Pipe", "1 Pcs", 490, 130],
        ["2\" Fancy Pipe (Premium)", "3 Pcs", 1240, 349],
        ["3 1/2\" Fancy Pipe (Economy)", "", 1150, 299],
        ["4\" Fancy Pipe (Premium)", "", 1575, 395],
        ["3 1/2\" Special Pipe (Niagra / Sizzling)", "", 1490, 370],
        ["3 1/2\" Double Ball Pipe", "", 2250, 579],
      ]],
      ["Ultra Premium Fancy Pipe Out", [
        ["Wow Lemon", "", 2425, 599],
        ["Wow Pink/Purple", "", 2425, 599],
        ["Pink Out (Vanitha Brand)", "", 8675, 1990],
        ["Purple Rain Out (Vanitha Brand)", "", 9925, 2385],
        ["Jungle Party (Vanitha Brand)", "", 9925, 2399],
        ["Orange Out (Vanitha Brand)", "", 9925, 2399],
        ["Sky Copter", "", 9925, 2445],
        ["Green Leaf Out (Vanitha Brand)", "", 3975, 1195],
        ["City Out (Vanitha Brand)", "", 2540, 978],
        ["4\" Jumbo Shooter", "2 Pcs", 4965, 1249],
      ]],
      ["Repeating Multi Colour Shots", [
        ["30 Shot Multi Colour", "", 1850, 570],
        ["60 Shot Multi Colour", "", 3700, 980],
        ["120 Shot Multi Colour", "", 7400, 1890],
        ["240 Shot Multi Colour", "", 13750, 3670],
      ]],
      ["Premium Repeating Multi Colour Shots", [
        ["30 Shot Multi Colour (Premium)", "", 2350, 749],
        ["60 Shot Multi Colour (Premium)", "", 4700, 1499],
        ["120 Shot Multi Colour (Premium)", "", 9400, 3500],
        ["240 Shot Multi Colour (Premium)", "", 18800, 5590],
      ]],
      ["Elite Multi Series", [
        ["Eye in The Sky 18 Shot (Vanitha Brand)", "", 4900, 1349],
        ["Sonny Sweet 16 Whistle", "", 2640, 865],
      ]],
      ["Repeating Rider & Crackling Shots", [
        ["12 Shot Rider", "", 675, 189],
        ["12 Shot Colour Sizzling Rider", "", 975, 268],
      ]],
      ["New Fancy Fountains", [
        ["Hip Hop", "", 210, 85],
        ["Tom & Jerry", "", 210, 85],
        ["Wow", "", 210, 85],
        ["Falls", "", 210, 85],
        ["Hi-Coo", "", 140, 45],
      ]],
      ["Siren & Crackling Fountains", [
        ["Mini Siren Fountain", "5 Pcs", 675, 195],
        ["Mega Siren Fountain", "5 Pcs", 740, 225],
        ["Sing Pop / Fire Splendor", "", 840, 245],
        ["100 K Crackling Fountain", "", 2845, 775],
        ["Wonder Mix", "", 1090, 325],
      ]],
      ["Vanitha Kids Galatta", [
        ["Do Do", "", 1100, 295],
        ["Hai Hai", "3 Pcs", 2370, 650],
        ["Dragon Fly", "5 Pcs", 2475, 685],
        ["Crystal", "3 Pcs", 4340, 1070],
        ["Rope Colour", "4 Pcs", 1090, 290],
        ["Cosmic Force", "3 Pcs", 4625, 1295],
        ["Halloween", "", 2825, 780],
        ["Golden Lion", "", 4925, 1450],
        ["Hot Wheels", "5 Pcs", 3465, 890],
        ["Autograph", "2 Pcs", 3725, 990],
        ["Tiny Gun", "6 Pcs", 2140, 670],
        ["Bubble", "2 Pcs", 1490, 435],
        ["Lotto", "3 Pcs", 1550, 450],
      ]],
      ["Kids Fountains", [
        ["Pogo / Holi Fountain", "", 155, 65],
        ["Angry Bird Fountain", "", 275, 85],
        ["Rock Star / Star War Fountain", "", 490, 145],
        ["4\" Fountain Mix / High Voltage", "", 900, 225],
        ["Lemon Tree Fountain", "", 740, 195],
        ["Dragon Fruit Mix / Motupatlu Mix Fountain", "", 800, 245],
      ]],
      ["Night Wonder Attractions", [
        ["Croods Mix Fountain (Double Wonder)", "", 790, 245],
        ["Helicopter", "5 Pcs", 425, 140],
        ["Drone", "5 Pcs", 550, 190],
        ["Lotus Wheel / 4x4 Wheel", "5 Pcs", 625, 205],
        ["Pinky Panky", "", 800, 275],
        ["Top Gun", "5 Pcs", 1200, 325],
        ["Bada Peacock Shower", "", 1975, 525],
      ]],
      ["Magic Candles", [
        ["King Candle", "", 175, 40],
        ["Queen Candle", "", 175, 40],
      ]],
      ["Magical Items", [
        ["Dancing Butterfly", "10 Pcs", 340, 145],
        ["Peacock Feather", "5 Pcs", 410, 120],
        ["Elephant Shower", "5 Pcs", 535, 145],
        ["Photo Flash", "5 Pcs", 265, 110],
        ["Golden Drops", "5 Pcs", 410, 125],
      ]],
      ["New Fancy Candles", [
        ["Crocodile / Shark Candle", "", 440, 120],
        ["Sea Horse Candle", "", 470, 130],
        ["Ultra Pencil", "3 Pcs", 335, 90],
      ]],
      ["Colour Smoke & Paper Sky Shots", [
        ["Colour Smoke Candle", "3 Pcs", 675, 155],
        ["Colour Smoke Sparklers", "10 Pcs", 290, 80],
        ["Magic Money Show", "2 Pcs", 990, 245],
        ["Party Zone", "", 1325, 305],
      ]],
      ["Vip Special Items", [
        ["Tin Beer Fountain", "", 445, 125],
        ["Peacock Shower", "", 625, 165],
        ["5G (Multi Colour)", "", 580, 165],
        ["Pappu Shower", "", 645, 175],
        ["Angry Birds (Whistle)", "5 Pcs", 990, 225],
        ["Cute Repeating 6 Colour Fountain", "", 1875, 450],
        ["Holi Fruits", "2 Pcs", 2345, 625],
        ["Chakkar Celebration", "4 Pcs", 2400, 590],
      ]],
      ["Kids Dhamaka", [
        ["Snacks Series Fountain", "5 Pcs", 865, 220],
        ["Panchamirtham Fountain", "5 Pcs", 640, 178],
        ["Redsun Mix Fountain", "5 Pcs", 770, 190],
        ["Sunfeast Mix Fountain", "5 Pcs", 770, 190],
      ]],
      ["Paper Blast", [
        ["Paper Blast - I", "", 210, 65],
        ["Paper Blast - II", "", 420, 115],
        ["Paper Blast - III", "", 840, 225],
        ["Colour Paper Blast", "", 285, 85],
        ["Avatar Paper Blast", "10 Pcs", 1490, 345],
      ]],
      ["Digital Crackling Attractions", [
        ["Alert Lar (Wala)", "", 690, 225],
        ["1000 Rider", "5 Pcs", 825, 265],
        ["90 Watts", "3 Pcs", 540, 145],
      ]],
      ["Day Wonder Attractions", [
        ["Old is Gold (Olla Pattas)", "20-25 Pcs", 840, 195],
        ["Money Bank / Bouncer", "", 190, 55],
        ["Cylinder Smoke Boom", "", 800, 205],
      ]],
      ["Mud Flower Pots", [
        ["Mini Pearl", "5 Pcs", 940, 235],
        ["Tim Tim", "5 Pcs", 1090, 265],
        ["Little Star", "10 Pcs", 1725, 385],
        ["2 in 1", "10 Pcs", 2125, 460],
        ["Colour Changing", "5 Pcs", 2175, 475],
        ["Gift Pack", "4 Pcs", 4075, 905],
        ["Deluxe Mansatti", "4 Pcs", 3240, 750],
      ]],
      ["New Arrivals (2026)", [
        ["Barbie Sky", "4 Pcs", 1915, 420],
        ["Cracker Samosa", "4 Pcs", 1540, 370],
        ["Race Car", "2 Pcs", 1075, 280],
        ["Ice Cone", "2 Pcs", 1275, 290],
      ]],
      ["Gift Box", [
        ["Gift Box 20 Item", "", 1450, 350],
        ["Gift Box 25 Item", "", 1925, 450],
        ["Gift Box 30 Item", "", 2200, 505],
        ["Gift Box 40 Item", "", 3250, 795],
        ["Gift Box 50 Item", "", 4450, 1040],
        ["Gift Box 60 Item", "", 5600, 1295],
      ]],
    ];

    /* ---------- Product Image Mapping ---------- */
    const PRODUCT_IMAGES = {
      "p0": "assets/Sparklers/7 cm Electric colour-sparkeler.jpg",
      "p1": "assets/Sparklers/10 cm Electric sparkeler.png",
      "p2": "assets/Sparklers/10 cm Colour sparkeler.png",
      "p3": "assets/Sparklers/10 cm Green sparkeler.png",
      "p4": "assets/Sparklers/15 cm Electric sparkeler.png",
      "p5": "assets/Sparklers/15 cm Colour sparkeler.png",
      "p6": "assets/Sparklers/15 cm Green sparkeler.png",
      "p7": "assets/Sparklers/15 cm Red sparkeler.png",
      "p8": "assets/Sparklers/30 cm Electric sparklers.png",
      "p9": "assets/Sparklers/30 cm Colour Sparklers.png",
      "p10": "assets/Sparklers/50-cm-Electric-Sparklers.png",
      "p11": "assets/Sparklers/50 cm colour Sparklers.webp",
      "p12": "assets/Sparklers/Heart-Celebration Sparklers.jpg",
      "p13": "assets/Flower Pots(Economy)/Flower Pots Big -I.jpg",
      "p14": "assets/Flower Pots(Economy)/Flower Pots Special-I.jpeg",
      "p15": "assets/Flower Pots(Economy)/Flower Pots Ashoka-I.jpg",
      "p16": "assets/Flower Pots(Economy)/Colour Koti-I.jpg",
      "p17": "assets/Flower Pots (Premium)/Flower Pot deluxe-II (P).png",
      "p18": "assets/Flower Pots (Premium)/Tri Colour Pots.jpg",
      "p19": "assets/Flower Pots (Premium)/Sony Violet Colour Koti.jpeg",
      "p20": "assets/Vanitha Brand Flower Pots (Premium)/Vanitha Flower Cone - II.jpg",
      "p21": "assets/Vanitha Brand Flower Pots (Premium)/Colour Cone.webp",
      "p22": "assets/Vanitha Brand Flower Pots (Premium)/Vanitha Colour World.jpg",
      "p23": "assets/Vanitha Brand Flower Pots (Premium)/Vanitha Fun Time.webp",
      "p24": "assets/Vanitha Brand Flower Pots (Premium)/Vanitha Colour Koti.jpg",
      "p25": "assets/Ground Chakar/Ground Chakar.jpg",
      "p26": "assets/Ground Chakar/Ground Chakar Special.jpg",
      "p27": "assets/Ground Chakar/Chocolate Wheel 4 in1.jpg",
      "p28": "assets/Ground Chakar/Wire Chakar.jpg",
      "p29": "assets/Ground Chakar/Whistle Wheel.jpg",
      "p30": "assets/Vanitha Brand Ground Chakar/Vanitha Spinner Super Deluxe.jpg",
      "p31": "assets/Vanitha Brand Ground Chakar/Vanitha Spinner Mix.jpg",
      "p32": "assets/Vanitha Brand Ground Chakar/Vanitha Colour Spinner.jpg",
      "p33": "assets/Sound Cracker (Economy)/2 3-4 Sparrow Crackers-I (Kuruvi).jpg",
      "p34": "assets/Sound Cracker (Economy)/3 1-2-Lakshmi Crackers-I.jpg",
      "p35": "assets/Sound Cracker (Economy)/4-Lakshmi Crackers-I.webp",
      "p36": "assets/Sound Cracker (Economy)/4-Gold Lakshmi Crackers-I.webp",
      "p37": "assets/Sound Cracker (Premium)/P-2 3-4-Sparrow Crackers-II (Kuruvi).jpg",
      "p38": "assets/Sound Cracker (Premium)/P-3 1-2-Lakshmi Crackers-II.jpg",
      "p39": "assets/Sound Cracker (Premium)/P-4- Lakshmi Crackers-II.jpg",
      "p40": "assets/Sound Cracker (Premium)/P-4- Lakshmi Deluxe Crackers-II.jpg",
      "p41": "assets/Sound Cracker (Premium)/P-4-Lakshmi Super Deluxe Crackers-II.webp",
      "p42": "assets/Sound Cracker (Premium)/P-2 Sound Crackers-II.jpg",
      "p43": "assets/Sound Cracker (Premium)/Mega Deluxe 25Ply Crackers.jpg",
      "p44": "assets/Sound Cracker (Premium)/5- Jallikattu Crackers.jpg",
      "p45": "assets/Pencil/Colour Pencil.webp",
      "p46": "assets/Childrens Special/Kit Kat - Chit Put.jpg",
      "p47": "assets/Childrens Special/Snake Tablet.webp",
      "p48": "assets/Childrens Special/Roll Cap.jpg",
      "p49": "assets/Childrens Special/Mini Colour Matches.jpeg",
      "p50": "assets/Childrens Special/Unicorn Match Stick.webp",
      "p51": "assets/Childrens Special/Ben 10 Match Stick.jpg",
      "p52": "assets/Childrens Special/100 Colour Match Stick Large.webp",
      "p53": "assets/Twinkling Star/1 1-2- Twinkling Star.jpg",
      "p54": "assets/Twinkling Star/4- Twinkling Star.jpg",
      "p55": "assets/Rockets/Rocket Bomb.jpg",
      "p56": "assets/Rockets/Lunik Rocket.webp",
      "p57": "assets/Rockets/Vanitha Mark-1 Crackling Rocket.webp",
      "p58": "assets/Bijili Crackers/Special Red Bijili-100pice.jpg",
      "p59": "assets/Bijili Crackers/Special Red Bijili-100pice.jpg",
      "p60": "assets/Bijili Crackers/Special Stripped Bijili (100 Pcs).jpg",
      "p61": "assets/Bijili Crackers/Vanitha Striped Bijili (100 Pcs).jpeg",
      "p62": "assets/Bombs/Mini Bullet Bomb (10 Pcs).jpg",
      "p63": "assets/Bombs/Hydrogen Bomb (10 Pcs).jpg",
      "p64": "assets/Bombs/King Bomb (10 Pcs).webp",
      "p65": "assets/Bombs/Classic - Tracer Bomb (10 Pcs).jpg",
      "p66": "assets/Bombs/King Rider Bomb (10 Pcs).jpg",
      "p67": "assets/Enjoy Funjoy/Mickey Mouse.webp",
      "p68": "assets/Sky Shot Items/Mini Sky Shot (5 Pcs).jpg",
      "p69": "assets/Sky Shot Items/7 Shots (5 Pcs).jpg",
      "p70": "assets/Sky Shot Items/Penta Sky Shot (5 Pcs).jpg",
      "p71": "assets/Sky Shot Items/3 Up (5 Pcs).jpg",
      "p72": "assets/Vanitha Brand Sky Shots/Chip Mix (2 Pcs).webp",
      "p73": "assets/Vanitha Brand Sky Shots/Lazer Show (6 Pcs).jpeg",
      "p74": "assets/Vanitha Brand Sky Shots/Miracle (4 Pcs).jpg",
      "p75": "assets/Vanitha Brand Sky Shots/Gelly (18 Pcs).webp",
      "p76": "assets/Vanitha Brand Sky Shots/Fly Machine (10 Pcs).webp",
      "p77": "assets/Vanitha Brand Sky Shots/Rising Effect (6 Pcs).png",
      "p78": "assets/Fancy Pipe Out/1 1-4- Fancy Pipe (1 Pcs).jpeg",
      "p79": "assets/Fancy Pipe Out/2-Fancy Pipe (1 Pcs).jpg",
      "p80": "assets/Fancy Pipe Out/2-Fancy Pipe (Premium) (3 Pcs).jpeg",
      "p81": "assets/Fancy Pipe Out/3 1-2 Fancy Pipe (Economy).jpg",
      "p82": "assets/Fancy Pipe Out/4- Fancy Pipe (Premium).jpg",
      "p83": "assets/Fancy Pipe Out/3 1-2- Special Pipe (Niagra -Sizzling).jpeg",
      "p84": "assets/Fancy Pipe Out/3 1-2- Double Ball Pipe.jpg",
      "p85": "assets/Ultra Premium Fancy Pipe Out/Wow Lemon.jpeg",
      "p86": "assets/Ultra Premium Fancy Pipe Out/Wow Pink-Purple.jpg",
      "p87": "assets/Ultra Premium Fancy Pipe Out/Pink Out (Vanitha Brand).jpeg",
      "p88": "assets/Ultra Premium Fancy Pipe Out/Purple Rain Out (Vanitha Brand).webp",
      "p89": "assets/Ultra Premium Fancy Pipe Out/Jungle Party (Vanitha Brand).jpg",
      "p90": "assets/Ultra Premium Fancy Pipe Out/Orange Out (Vanitha Brand).png",
      "p91": "assets/Ultra Premium Fancy Pipe Out/Sky Copter.png",
      "p92": "assets/Ultra Premium Fancy Pipe Out/Green Leaf Out (Vanitha Brand).png",
      "p93": "assets/Ultra Premium Fancy Pipe Out/City Out (Vanitha Brand).jpg",
      "p94": "assets/Ultra Premium Fancy Pipe Out/4-Jumbo Shooter (2 Pcs).webp",
      "p95": "assets/Repeating Multi Colour Shots/30 Shot Multi Colour.jpeg",
      "p96": "assets/Repeating Multi Colour Shots/60 Shot Multi Colour.jpg",
      "p97": "assets/Repeating Multi Colour Shots/120 Shot Multi Colour.jpg",
      "p98": "assets/Repeating Multi Colour Shots/240 Shot Multi Colour.jpg",
      "p99": "assets/Premium Repeating Multi Colour Shots/30 Shot Multi Colour (Premium).webp",
      "p100": "assets/Premium Repeating Multi Colour Shots/60 Shot Multi Colour (Premium).png",
      "p101": "assets/Premium Repeating Multi Colour Shots/120 Shot Multi Colour (Premium).webp",
      "p102": "assets/Premium Repeating Multi Colour Shots/240 Shot Multi Colour (Premium).jpg",
      "p103": "assets/Elite Multi Series/eyeinthesky-big-500x500.webp",
      "p104": "assets/Elite Multi Series/Sonny Sweet 16 Whistle.jpg",
      "p105": "assets/Repeating Rider & Crackling Shots/12 Shot Rider.jpg",
      "p106": "assets/Repeating Rider & Crackling Shots/12 Shot Colour Sizzling Rider.jpeg",
      "p107": "assets/New Fancy Fountains/Hip Hop.jpg",
      "p108": "assets/New Fancy Fountains/Tom & Jerry.jpg",
      "p109": "assets/New Fancy Fountains/Wow.jpeg",
      "p110": "assets/New Fancy Fountains/Falls.jpg",
      "p111": "assets/New Fancy Fountains/Hi-Coo.jpg",
      "p112": "assets/Siren & Crackling Fountains/Mini Siren Fountain (5 Pcs).webp",
      "p113": "assets/Siren & Crackling Fountains/Mega Siren Fountain (5 Pcs).jpg",
      "p114": "assets/Siren & Crackling Fountains/Sing Pop -Fire Splendor.jpg",
      "p115": "assets/Siren & Crackling Fountains/100 K Crackling Fountain.jpeg",
      "p116": "assets/Siren & Crackling Fountains/Wonder Mix.webp",
      "p117": "assets/dodo.png",
      "p118": "assets/Vanitha Kids Galatta/Hai Hai (3 Pcs).webp",
      "p119": "assets/Vanitha Kids Galatta/Dragon Fly (5 Pcs).jpeg",
      "p120": "assets/Vanitha Kids Galatta/Crystal (3 Pcs).jpg",
      "p121": "assets/Vanitha Kids Galatta/Rope Colour (4 Pcs).jpg",
      "p122": "assets/Vanitha Kids Galatta/Cosmic Force (3 Pcs).webp",
      "p123": "assets/Haloween.png",
      "p124": "assets/Vanitha Kids Galatta/Golden Lion.jpg",
      "p125": "assets/Vanitha Kids Galatta/Hot Wheels (5 Pcs).webp",
      "p126": "assets/Vanitha Kids Galatta/Autograph (2 Pcs).jpg",
      "p127": "assets/Vanitha Kids Galatta/Tiny Gun (6 Pcs).jpg",
      "p128": "assets/Vanitha Kids Galatta/Bubble (2 Pcs).jpg",
      "p129": "assets/Vanitha Kids Galatta/Lotto (3 Pcs).png",
      "p130": "assets/Kids Fountains/Pogo -Holi Fountain.jpeg",
      "p131": "assets/Kids Fountains/Angry Bird Fountain.jpeg",
      "p132": "assets/Kids Fountains/Rock Star -Star War Fountain.jpg",
      "p133": "assets/Kids Fountains/4- Fountain Mix - High Voltage.jpg",
      "p134": "assets/Kids Fountains/Lemon Tree Fountain.jpg",
      "p135": "assets/Kids Fountains/Dragon Fruit Mix - Motupatlu Mix Fountain.webp",
      "p136": "assets/Night Wonder Attractions/Croods Mix Fountain (Double Wonder).jpeg",
      "p137": "assets/Night Wonder Attractions/Helicopter (5 Pcs).jpg",
      "p138": "assets/Night Wonder Attractions/Drone (5 Pcs).jpg",
      "p139": "assets/Night Wonder Attractions/Lotus Wheel - 4x4 Wheel (5 Pcs).jpg",
      "p140": "assets/Night Wonder Attractions/Pinky Panky.webp",
      "p141": "assets/Night Wonder Attractions/Top Gun (5 Pcs).jpg",
      "p142": "assets/Night Wonder Attractions/Bada Peacock Shower.webp",
      "p143": "assets/Magic Candles/King Candle.jpg",
      "p144": "assets/Magic Candles/Queen-Candle-Silver.webp",
      "p145": "assets/Magical Items/Dancing Butterfly (10 Pcs).jpg",
      "p146": "assets/Magical Items/Peacock Feather (5 Pcs).jpg",
      "p147": "assets/Magical Items/lephant Shower (5 Pcs).jpg",
      "p148": "assets/Magical Items/Photo Flash (5 Pcs).webp",
      "p149": "assets/Magical Items/Golden Drops (5 Pcs).jpg",
      "p150": "assets/New Fancy Candles/Crocodile -Shark Candle.jpg",
      "p151": "assets/New Fancy Candles/Sea Horse Candle.jpg",
      "p152": "assets/New Fancy Candles/Ultra Pencil (3 Pcs).jpg",
      "p153": "assets/Colour Smoke & Paper Sky Shots/Colour Smoke Candle (3 Pcs).jpg",
      "p154": "assets/Colour Smoke & Paper Sky Shots/Colour Smoke Sparklers (10 Pcs).jpg",
      "p155": "assets/Colour Smoke & Paper Sky Shots/Magic Money Show (2 Pcs).jpg",
      "p156": "assets/Colour Smoke & Paper Sky Shots/Party Zone.webp",
      "p157": "assets/Vip Special Items/Tin Beer Fountain.webp",
      "p158": "assets/Vip Special Items/Peacock Shower.png",
      "p159": "assets/Vip Special Items/5G (Multi Colour).webp",
      "p160": "assets/Vip Special Items/Pappu Shower.jpg",
      "p161": "assets/Vip Special Items/Angry Birds (Whistle) (5 Pcs).jpg",
      "p162": "assets/Vip Special Items/Cute Repeating 6 Colour Fountain.jpg",
      "p163": "assets/Vip Special Items/Holi Fruits (2 Pcs).png",
      "p164": "assets/Vip Special Items/Chakkar Celebration (4 Pcs).jpeg",
      "p165": "assets/Kids Dhamaka/Snacks Series Fountain (5 Pcs).jpeg",
      "p166": "assets/Kids Dhamaka/Panchamirtham Fountain (5 Pcs).webp",
      "p167": "assets/Kids Dhamaka/Redsun Mix Fountain (5 Pcs).png",
      "p168": "assets/Kids Dhamaka/Sunfeast Mix Fountain (5 Pcs).webp",
      "p169": "assets/Paper Blast/Paper Blast - I.jpg",
      "p170": "assets/Paper Blast/Paper Blast - II.jpeg",
      "p171": "assets/Paper Blast/Paper Blast - III.webp",
      "p172": "assets/Paper Blast/Colour Paper Blast.jpeg",
      "p173": "assets/Paper Blast/Avatar Paper Blast (10 Pcs).webp",
      "p174": "assets/Digital Crackling Attractions/Alert Lar (Wala).jpg",
      "p175": "assets/Digital Crackling Attractions/1000 Rider (5 Pcs).png",
      "p176": "assets/Digital Crackling Attractions/90 Watts (3 Pcs).jpg",
      "p177": "assets/Day Wonder Attractions/Old is Gold (Olla Pattas) (20-25 Pcs).jpeg",
      "p178": "assets/Day Wonder Attractions/Money Bank - Bouncer.jpg",
      "p179": "assets/Day Wonder Attractions/Cylinder Smoke Boom.jpg",
      "p180": "assets/Mud Flower Pots/Mini Pearl (5 Pcs).jpg",
      "p181": "assets/Mud Flower Pots/Tim Tim (5 Pcs).webp",
      "p182": "assets/Mud Flower Pots/Little Star (10 Pcs).jpg",
      "p183": "assets/Mud Flower Pots/2 in 1 (10 Pcs).jpg",
      "p184": "assets/Mud Flower Pots/Colour Changing (5 Pcs).jpeg",
      "p185": "assets/Mud Flower Pots/Gift Pack (4 Pcs).webp",
      "p186": "assets/Mud Flower Pots/Deluxe Mansatti (4 Pcs).png",
      "p187": "assets/New Arrivals (2026)/Barbie Sky (4 Pcs).jpg",
      "p188": "assets/New Arrivals (2026)/Cracker Samosa (4 Pcs).jpg",
      "p189": "assets/New Arrivals (2026)/Race Car (2 Pcs).jpeg",
      "p190": "assets/New Arrivals (2026)/ce Cone (2 Pcs).webp",
      "p191": "assets/Gift Box/Gift Box 20 Item.jpg",
      "p192": "assets/Gift Box/Gift Box 25 Item.webp",
      "p193": "assets/Gift Box/Gift Box 30 Item.png",
      "p194": "assets/Gift Box/Gift Box 40 Item.webp",
      "p195": "assets/Gift Box/Gift Box 50 Item.jpg",
      "p196": "assets/Gift Box/Gift Box 60 Item.jpg"
    };

    // Flatten CATALOG with unique IDs
    let uid = 0;
    CATALOG.forEach(cat => cat[1].forEach(item => item.push('p' + (uid++))));

    const cart = {}; // id -> qty
    let viewMode = 'grid'; // 'grid' | 'list'
    let activeLightboxId = null;

    const catalogEl = document.getElementById('catalog');
    const catNavEl = document.getElementById('catNav');

    function slug(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

    const itemMeta = {}; // id -> {name, pack, offer, mrp, cat}
    CATALOG.forEach(([cat, items]) => items.forEach(([name, pack, mrp, offer, id]) => {
      itemMeta[id] = { name, pack, offer, mrp, cat };
    }));

    function getImgPath(id) {
      if (PRODUCT_IMAGES[id]) return PRODUCT_IMAGES[id];
      const m = itemMeta[id];
      if (m) {
        const catLower = m.cat.toLowerCase();
        if (catLower.includes('flower pot')) return 'assets/crackers-imgs/Flower Pots.jpg';
        if (catLower.includes('sparkler')) return 'assets/crackers-imgs/sparklers images.jpg';
        if (catLower.includes('bomb')) return 'assets/crackers-imgs/Bombs crackers.jpg';
        if (catLower.includes('children')) return 'assets/crackers-imgs/Childrens Special crackers.jpg';
      }
      return null;
    }

    function render() {
      catalogEl.innerHTML = '';
      catNavEl.innerHTML = '';
      const q = document.getElementById('searchInput').value.trim().toLowerCase();

      CATALOG.forEach(([catName, items]) => {
        const filtered = q ? items.filter(it => it[0].toLowerCase().includes(q)) : items;
        if (q && filtered.length === 0) return;

        const chip = document.createElement('button');
        chip.className = 'cat-chip';
        chip.dataset.cat = slug(catName);
        chip.textContent = catName;
        chip.onclick = () => {
          document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const target = document.getElementById('cat-' + slug(catName));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        catNavEl.appendChild(chip);

        const section = document.createElement('section');
        section.className = 'category';
        section.id = 'cat-' + slug(catName);

        const head = document.createElement('div');
        head.className = 'category-head';
        head.innerHTML = `<h2>${escapeHtml(catName)}</h2><div class="rule"></div><div class="count">${filtered.length} item${filtered.length > 1 ? 's' : ''}</div>`;
        section.appendChild(head);

        const icon = iconFor(catName);

        if (viewMode === 'grid') {
          const grid = document.createElement('div');
          grid.className = 'product-grid';

          filtered.forEach(([name, pack, mrp, offer, id]) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.id = id;
            const qty = cart[id] || 0;
            if (qty > 0) card.classList.add('in-cart');

            const imgUrl = getImgPath(id);
            const discount = Math.round(((mrp - offer) / mrp) * 100);
            const safeName = escapeHtml(name);
            const safePack = escapeHtml(pack);
            const safeCat = escapeHtml(catName);

            card.innerHTML = `
          ${discount > 0 ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
          <div class="p-img-box" onclick="openLightbox('${id}')">
            ${imgUrl ? `<img src="${imgUrl}" alt="${safeName}" data-cat="${safeCat}" loading="lazy" onerror="onImgError(this)" />` : `<div class="p-icon-fallback">${icon}</div>`}
          </div>
          <div class="p-card-body">
            <div class="p-card-title">${safeName}</div>
            <div class="p-card-pack">${safePack ? safePack : '&nbsp;'}</div>
            <div class="p-card-bottom">
              <div class="p-card-price">
                <span class="mrp">MRP: ₹${mrp.toLocaleString('en-IN')}</span>
                <span class="offer">₹${offer.toLocaleString('en-IN')}</span>
              </div>
              <div class="qty-stepper">
                <button class="dec" aria-label="Decrease" onclick="event.stopPropagation(); changeQty('${id}', -1);">-</button>
                <span class="qty-val">${qty}</span>
                <button class="inc" aria-label="Increase" onclick="event.stopPropagation(); changeQty('${id}', 1);">+</button>
              </div>
            </div>
          </div>`;
            grid.appendChild(card);
          });
          section.appendChild(grid);
        } else {
          // List View
          const list = document.createElement('div');
          list.className = 'product-list-view';

          filtered.forEach(([name, pack, mrp, offer, id]) => {
            const row = document.createElement('div');
            row.className = 'product-row';
            row.dataset.id = id;
            const qty = cart[id] || 0;
            if (qty > 0) row.classList.add('in-cart');
            const imgUrl = getImgPath(id);
            const safeName = escapeHtml(name);
            const safePack = escapeHtml(pack);
            const safeCat = escapeHtml(catName);

            row.innerHTML = `
          <div class="p-icon-thumb" onclick="openLightbox('${id}')">
            ${imgUrl ? `<img src="${imgUrl}" alt="${safeName}" data-cat="${safeCat}" loading="lazy" onerror="onImgError(this)" />` : icon}
          </div>
          <div class="p-name" onclick="openLightbox('${id}')" style="cursor:pointer;">
            ${safeName}${safePack ? ` <span class="pack" style="color:var(--ink-dim); font-size:12.5px;">(${safePack})</span>` : ''}
          </div>
          <div class="p-price">
            <span class="mrp" style="display:block; font-size:13px; color:var(--mrp-color); text-decoration:line-through; text-decoration-color:var(--mrp-line-color); font-weight:600;">MRP: ₹${mrp.toLocaleString('en-IN')}</span>
            <span class="offer" style="font-size:18px; font-weight:700; color:var(--offer-green);">₹${offer.toLocaleString('en-IN')}</span>
          </div>
          <div class="qty-stepper">
            <button class="dec" aria-label="Decrease" onclick="event.stopPropagation(); changeQty('${id}', -1);">-</button>
            <span class="qty-val">${qty}</span>
            <button class="inc" aria-label="Increase" onclick="event.stopPropagation(); changeQty('${id}', 1);">+</button>
          </div>`;
            list.appendChild(row);
          });
          section.appendChild(list);
        }

        catalogEl.appendChild(section);
      });

      if (q && catalogEl.innerHTML === '') {
        catalogEl.innerHTML = `<p class="empty-note">No crackers match "${escapeHtml(q)}". Try searching for another item.</p>`;
      }
    }

    /* ---------- Cart Management ---------- */
    const MIN_ORDER = 2500;

    function getPackingFee(total) {
      if (total >= 10000) return 50;
      if (total >= 5000)  return 60;
      return 75;
    }

    function calcCartTotals() {
      let offerTotal = 0, mrpTotal = 0;
      Object.keys(cart).forEach(id => {
        const m = itemMeta[id];
        if (!m) return;
        offerTotal += m.offer * cart[id];
        mrpTotal   += m.mrp   * cart[id];
      });
      const packing = Object.keys(cart).length > 0 ? getPackingFee(offerTotal) : 0;
      return { offerTotal, mrpTotal, packing, grand: offerTotal + packing };
    }

    function changeQty(id, delta) {
      const next = Math.max(0, (cart[id] || 0) + delta);
      if (next === 0) delete cart[id]; else cart[id] = next;
      saveCart();
      render();
      updateCartBar();
      if (activeLightboxId === id) {
        const lbQty = document.getElementById('lightboxQty');
        if (lbQty) lbQty.textContent = next;
      }
    }

    function changeQtyFromLightbox(delta) {
      if (!activeLightboxId) return;
      const nextQty = Math.max(0, (cart[activeLightboxId] || 0) + delta);
      if (nextQty === 0) delete cart[activeLightboxId];
      else cart[activeLightboxId] = nextQty;
      saveCart();
      const lbQty = document.getElementById('lightboxQty');
      if (lbQty) lbQty.textContent = nextQty;
      updateCartBar();
      render();
    }

    function updateCartBar() {
      const ids        = Object.keys(cart);
      const totalItems = ids.reduce((s, id) => s + (cart[id] || 0), 0);
      const { offerTotal, mrpTotal } = calcCartTotals();

      const countEl  = document.getElementById('cartCount');
      const totalEl  = document.getElementById('cartTotal');
      const saveEl   = document.getElementById('cartSave');
      const orderBtn = document.getElementById('orderBtn');
      if (!orderBtn) return;

      // Update totals display
      totalEl.innerHTML = `₹${offerTotal.toLocaleString('en-IN')}`;

      if (totalItems === 0) {
        countEl.textContent = 'No items selected yet';
        saveEl.textContent  = '';
        setOrderBtn(orderBtn, false, '');

      } else if (offerTotal < MIN_ORDER) {
        const needed = (MIN_ORDER - offerTotal).toLocaleString('en-IN');
        countEl.textContent = `${ids.length} product${ids.length > 1 ? 's' : ''} · ${totalItems} pack${totalItems > 1 ? 's' : ''} — Add ₹${needed} more`;
        saveEl.textContent  = `⚠ Min order ₹2,500`;
        setOrderBtn(orderBtn, false, `Add ₹${needed} more to place order`);

      } else {
        const savings = mrpTotal - offerTotal;
        countEl.textContent = `${ids.length} product${ids.length > 1 ? 's' : ''} · ${totalItems} pack${totalItems > 1 ? 's' : ''}`;
        saveEl.textContent  = savings > 0 ? `you save ₹${savings.toLocaleString('en-IN')}` : '';
        setOrderBtn(orderBtn, true, '');
      }
    }

    function setOrderBtn(btn, enabled, title) {
      // Class-based approach � no inline styles � no specificity fights
      if (enabled) {
        btn.classList.remove('btn-off');
      } else {
        btn.classList.add('btn-off');
      }
      btn.title = title || '';
    }

    /* ---------- Step 2: Cart Preview Modal ---------- */
    function openCartModal() {
      renderCartTable();
      refreshCartModalTotals();
      document.getElementById('cartModal').classList.add('active');
    }

    function renderCartTable() {
      const tbody = document.getElementById('cartTableBody');
      tbody.innerHTML = '';
      Object.keys(cart).forEach(id => {
        const m      = itemMeta[id];
        if (!m) return;
        const qty      = cart[id];
        const subtotal = m.offer * qty;
        const imgUrl   = getImgPath(id);
        const tr = document.createElement('tr');
        tr.id = `cartRow_${id}`;
        tr.innerHTML = `
          <td>${imgUrl ? `<img class="cart-thumb" src="${imgUrl}" alt="${escapeHtml(m.name)}" onerror="this.style.display='none'" loading="lazy">` : '??'}</td>
          <td><b>${escapeHtml(m.name)}</b>${m.pack ? `<br><small style="color:#64748b">${escapeHtml(m.pack)}</small>` : ''}</td>
          <td style="white-space:nowrap">₹${m.offer.toLocaleString('en-IN')}</td>
          <td>
            <div class="qty-stepper" style="display:inline-flex;">
              <button onclick="cartQtyChange('${id}',-1)" style="width:30px;height:30px;font-size:18px;line-height:1;">-</button>
              <span class="qty-val" id="cqv_${id}">${qty}</span>
              <button onclick="cartQtyChange('${id}',1)"  style="width:30px;height:30px;font-size:18px;line-height:1;" class="inc">+</button>
            </div>
          </td>
          <td style="color:#15803d;font-weight:700;white-space:nowrap" id="csub_${id}">₹${subtotal.toLocaleString('en-IN')}</td>
          <td>
            <button class="btn-remove-row" onclick="deleteFromCart('${id}')" title="Remove item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function refreshCartModalTotals() {
      const { offerTotal, packing, grand } = calcCartTotals();
      const belowMin = offerTotal < MIN_ORDER;
      const ids = Object.keys(cart);

      document.getElementById('cartSubTotal').textContent    = `₹${offerTotal.toLocaleString('en-IN')}`;
      document.getElementById('cartPackingFee').textContent  = `₹${packing}`;
      document.getElementById('cartGrandTotal').textContent  = `₹${grand.toLocaleString('en-IN')}`;
      document.getElementById('cartModalMinAlert').style.display = belowMin ? 'flex' : 'none';

      const proceedBtn = document.getElementById('proceedCheckoutBtn');
      const canProceed = ids.length > 0 && !belowMin;
      proceedBtn.disabled         = !canProceed;
      proceedBtn.style.opacity    = canProceed ? '1' : '0.5';
      proceedBtn.style.cursor     = canProceed ? 'pointer' : 'not-allowed';
      proceedBtn.style.pointerEvents = canProceed ? 'auto' : 'none';
    }

    function cartQtyChange(id, delta) {
      const next = Math.max(0, (cart[id] || 0) + delta);
      if (next === 0) {
        deleteFromCart(id);
        return;
      }
      cart[id] = next;
      saveCart();

      // Update qty display in cart modal
      const qEl = document.getElementById(`cqv_${id}`);
      if (qEl) qEl.textContent = next;
      // Update subtotal display
      const sEl = document.getElementById(`csub_${id}`);
      if (sEl) sEl.textContent = `₹${(itemMeta[id].offer * next).toLocaleString('en-IN')}`;

      refreshCartModalTotals();
      updateCartBar();
      render();
    }

    function deleteFromCart(id) {
      delete cart[id];
      saveCart();

      // Remove row from modal table
      const row = document.getElementById(`cartRow_${id}`);
      if (row) row.remove();

      if (Object.keys(cart).length === 0) {
        closeCartModal();
      } else {
        refreshCartModalTotals();
      }
      updateCartBar();
      render();
    }

    function closeCartModal() {
      document.getElementById('cartModal').classList.remove('active');
    }

    /* ---------- Step 3: Checkout Modal ---------- */
    function openCheckoutModal() {
      const { offerTotal, packing, grand } = calcCartTotals();
      document.getElementById('finalSubTotal').textContent   = `₹${offerTotal.toLocaleString('en-IN')}`;
      document.getElementById('finalPackingFee').textContent = `₹${packing}`;
      document.getElementById('finalGrandTotal').textContent = `₹${grand.toLocaleString('en-IN')}`;
      closeCartModal();
      document.getElementById('checkoutModal').classList.add('active');
    }

    function closeCheckoutModal() {
      document.getElementById('checkoutModal').classList.remove('active');
    }

    async function submitWhatsAppOrder() {
      const nameEl     = document.getElementById('custName');
      const mobileEl   = document.getElementById('custMobile');
      const whatsappEl = document.getElementById('custWhatsapp');
      const emailEl    = document.getElementById('custEmail');
      const addressEl  = document.getElementById('custAddress');
      const cityEl     = document.getElementById('custCity');
      const pincodeEl  = document.getElementById('custPincode');
      const stateEl    = document.getElementById('custState');

      const name     = nameEl ? nameEl.value.trim() : '';
      const mobile   = mobileEl ? mobileEl.value.trim() : '';
      const whatsapp = whatsappEl ? whatsappEl.value.trim() : '';
      const email    = emailEl ? emailEl.value.trim() : '';
      const address  = addressEl ? addressEl.value.trim() : '';
      const city     = cityEl ? cityEl.value.trim() : '';
      const pincode  = pincodeEl ? pincodeEl.value.trim() : '';
      const state    = stateEl ? stateEl.value.trim() : '';

      const fieldsMap = {
        name: { el: nameEl, name: 'custName' },
        mobile: { el: mobileEl, name: 'custMobile' },
        whatsapp: { el: whatsappEl, name: 'custWhatsapp' },
        address: { el: addressEl, name: 'custAddress' },
        city: { el: cityEl, name: 'custCity' },
        pincode: { el: pincodeEl, name: 'custPincode' }
      };

      const showError = (fieldKey, message) => {
        const item = fieldsMap[fieldKey];
        if (!item || !item.el) return;
        item.el.classList.add('invalid', 'is-invalid');
        item.el.style.borderColor = '#ef4444';

        let errorDiv = item.el.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
          errorDiv = document.createElement('div');
          errorDiv.className = 'invalid-feedback';
          errorDiv.style.fontSize = '0.75rem';
          errorDiv.style.color = '#ef4444';
          errorDiv.style.marginTop = '0.25rem';
          errorDiv.style.fontWeight = '600';
          item.el.parentNode.appendChild(errorDiv);
        }
        errorDiv.innerText = message;
        errorDiv.style.display = 'block';
      };

      const clearError = (fieldKey) => {
        const item = fieldsMap[fieldKey];
        if (!item || !item.el) return;
        item.el.classList.remove('invalid', 'is-invalid');
        item.el.style.borderColor = '';
        let errorDiv = item.el.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
          errorDiv.style.display = 'none';
        }
      };

      // Clear all errors initially
      Object.keys(fieldsMap).forEach(key => clearError(key));

      let isValid = true;
      let firstInvalidEl = null;

      // Sequential validation check
      if (!name) {
        showError('name', 'Please Enter Your Full Name');
        isValid = false;
        firstInvalidEl = nameEl;
      } else if (!mobile) {
        showError('mobile', 'Please Enter Your Mobile Number');
        isValid = false;
        firstInvalidEl = mobileEl;
      } else if (!/^[0-9]{10}$/.test(mobile.replace(/\D/g, ''))) {
        showError('mobile', 'Please Enter a Valid 10-Digit Mobile Number');
        isValid = false;
        firstInvalidEl = mobileEl;
      } else if (!whatsapp) {
        showError('whatsapp', 'Please Enter Your WhatsApp Number');
        isValid = false;
        firstInvalidEl = whatsappEl;
      } else if (!/^[0-9]{10}$/.test(whatsapp.replace(/\D/g, ''))) {
        showError('whatsapp', 'Please Enter a Valid 10-Digit WhatsApp Number');
        isValid = false;
        firstInvalidEl = whatsappEl;
      } else if (!address) {
        showError('address', 'Please Enter Your Full Delivery Address');
        isValid = false;
        firstInvalidEl = addressEl;
      } else if (!city) {
        showError('city', 'Please Enter Your City / District');
        isValid = false;
        firstInvalidEl = cityEl;
      } else if (!pincode) {
        showError('pincode', 'Please Enter Your 6-Digit Pin Code');
        isValid = false;
        firstInvalidEl = pincodeEl;
      } else if (!/^[0-9]{6}$/.test(pincode.replace(/\D/g, ''))) {
        showError('pincode', 'Please Enter a Valid 6-Digit Pin Code');
        isValid = false;
        firstInvalidEl = pincodeEl;
      }

      if (!isValid) {
        if (firstInvalidEl) {
          firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalidEl.focus();
        }
        return;
      }

      // Show submitting state on button
      const submitBtn = document.querySelector('.btn-submit-order');
      let originalBtnHtml = '';
      if (submitBtn) {
        originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.style.cursor = 'wait';
        submitBtn.innerHTML = 'Sending Email & Order... ⏳';
      }

      const { offerTotal, packing, grand } = calcCartTotals();
      const ids = Object.keys(cart);

      let msg = `✨ *NAGERCOIL CRACKERS MART* ✨\n`;
      msg += `🎆 *DIWALI 2026 ORDER INVOICE* 🎆\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `👤 *Customer Details*\n`;
      msg += `• *Name:* ${name}\n`;
      msg += `• *Mobile:* ${mobile}\n`;
      msg += `• *WhatsApp:* ${whatsapp}\n`;
      if (email) msg += `• *Email:* ${email}\n`;
      msg += `• *Address:* ${address}, ${city} - ${pincode}, ${state}\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `📦 *ORDER ITEMS TABLE*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;

      ids.forEach((id, idx) => {
        const m = itemMeta[id];
        const qty = cart[id];
        const line = m.offer * qty;
        const itemName = `${m.name}${m.pack ? ` (${m.pack})` : ''}`;
        msg += `${idx + 1}. *${itemName}*\n`;
        msg += `   └─ Qty: ${qty} x ₹${m.offer.toLocaleString('en-IN')} = *₹${line.toLocaleString('en-IN')}*\n`;
      });

      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `💵 *Sub Total:* ₹${offerTotal.toLocaleString('en-IN')}\n`;
      msg += `📦 *Packing Fee:* ₹${packing}\n`;
      msg += `💰 *GRAND TOTAL:* *₹${grand.toLocaleString('en-IN')}*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `🙏 *Thank you for ordering with Nagercoil Crackers Mart! Please confirm availability & delivery.* 🪔`;

      // Generate invoice payload for localStorage
      const invoiceNo = `NCM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const invoiceItems = ids.map(id => {
        const m = itemMeta[id];
        const qty = cart[id];
        return {
          name: m.name,
          pack: m.pack || '',
          qty: qty,
          price: m.offer,
          total: m.offer * qty
        };
      });

      const invoicePayload = {
        invoiceNo: invoiceNo,
        date: new Date().toLocaleDateString('en-IN'),
        customer: { name, mobile, whatsapp, email, address, city, pincode, state },
        items: invoiceItems,
        totals: { offerTotal, packing, grand }
      };

      try {
        localStorage.setItem('lastOrderInvoice', JSON.stringify(invoicePayload));
      } catch (err) {
        console.error("Failed to save order invoice:", err);
      }

      // Send HTML Invoice Email via PHP and wait for response (or 4s timeout)
      try {
        const fetchPromise = fetch('php/send-mail.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            formType: 'orderInquiry',
            ...invoicePayload
          })
        }).then(res => res.json());

        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ status: 'timeout' }), 4000));
        const mailResult = await Promise.race([fetchPromise, timeoutPromise]);
        console.log('Email Sent Status:', mailResult);
      } catch (err) {
        console.error('Email sending error:', err);
      }

      // Clear cart items and reset localStorage back to 0
      try {
        Object.keys(cart).forEach(k => delete cart[k]);
        localStorage.removeItem('nagercoil_cart');
        if (typeof updateCartBar === 'function') updateCartBar();
        if (typeof render === 'function') render();
      } catch (e) {
        console.error("Cart clear error:", e);
      }

      // Launch WhatsApp message
      const waUrl = `https://wa.me/918248159490?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');

      // Redirect to printable Invoice page
      closeCheckoutModal();
      window.location.href = 'invoice.html';
    }

    /* ---------- Lightbox Modal ---------- */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImgWrap = document.getElementById('lightboxImgWrap');

    function openLightbox(id) {
      const m = itemMeta[id];
      if (!m) return;
      activeLightboxId = id;
      const imgUrl = getImgPath(id);
      const icon = iconFor(m.cat);

      const safeName = escapeHtml(m.name);
      const safeCat = escapeHtml(m.cat);

      if (imgUrl) {
        lightboxImgWrap.innerHTML = `<img id="lightboxImg" src="${imgUrl}" alt="${safeName}" data-cat="${safeCat}" onerror="onImgError(this)" />`;
      } else {
        lightboxImgWrap.innerHTML = `<div style="width:120px; height:120px; color:var(--gold); display:flex; align-items:center; justify-content:center;">${icon}</div>`;
      }

      document.getElementById('lightboxCat').textContent = m.cat;
      document.getElementById('lightboxTitle').textContent = m.name;
      document.getElementById('lightboxPack').textContent = m.pack ? `Pack Size: ${m.pack}` : 'Standard Box Pack';
      document.getElementById('lightboxMrp').textContent = `₹${m.mrp.toLocaleString('en-IN')}`;
      document.getElementById('lightboxOffer').textContent = `₹${m.offer.toLocaleString('en-IN')}`;

      const saveAmount = m.mrp - m.offer;
      const savePercent = Math.round((saveAmount / m.mrp) * 100);
      document.getElementById('lightboxSaveTag').textContent = `You save ₹${saveAmount.toLocaleString('en-IN')} (${savePercent}% OFF)`;

      // Sync current quantity
      const currentQty = cart[id] || 0;
      const lbQty = document.getElementById('lightboxQty');
      if (lbQty) lbQty.textContent = currentQty;

      lightboxModal.classList.add('active');
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      activeLightboxId = null;
    }

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        closeCartModal();
        closeCheckoutModal();
      }
    });

    /* ---------- View Toggle ---------- */
    const gridBtn = document.getElementById('viewGridBtn');
    const listBtn = document.getElementById('viewListBtn');

    gridBtn.addEventListener('click', () => {
      viewMode = 'grid';
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
      render();
    });

    listBtn.addEventListener('click', () => {
      viewMode = 'list';
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
      render();
    });

    document.getElementById('searchInput').addEventListener('input', render);

    document.getElementById('clearBtn').addEventListener('click', () => {
      Object.keys(cart).forEach(k => delete cart[k]);
      saveCart();
      render();
      updateCartBar();
    });

    document.getElementById('orderBtn').addEventListener('click', () => {
      const btn = document.getElementById('orderBtn');
      if (btn.classList.contains('btn-off')) return;
      if (Object.keys(cart).length === 0) return;
      openCartModal();
    });

    // Enforce numbers-only and length restrictions for Mobile, WhatsApp and Pin Code fields
    const restrictNumericInput = (id, maxLen) => {
      const input = document.getElementById(id);
      if (!input) return;
      ['input', 'paste'].forEach(evtType => {
        input.addEventListener(evtType, () => {
          setTimeout(() => {
            input.value = input.value.replace(/\D/g, '').slice(0, maxLen);
          }, 0);
        });
      });
    };

    restrictNumericInput('custMobile', 10);
    restrictNumericInput('custWhatsapp', 10);
    restrictNumericInput('custPincode', 6);

    loadCart();
    render();
    updateCartBar();




