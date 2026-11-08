/* ==========================================================================
   SHREYA & RAHUL – FOREVER BEGINS
   CENTRAL CONFIGURATION  (the ONLY file you need to edit)
   --------------------------------------------------------------------------
   • Anything marked  ✏️ EDIT  is a placeholder – replace it with real details.
   • Nothing here is invented: unknown details are neutral placeholders.
   ========================================================================== */

window.WEDDING = {

  /* ---------- Couple ---------- */
  bride: "Shreya",
  groom: "Rahul",
  tagline: "Forever Begins",
  inviteLine: "Invite you to their wedding celebration",

  /* ---------- Date & time ---------- */
  // ✏️ EDIT: PLACEHOLDER DATE – replace with the real date/time.
  // Format: "YYYY-MM-DDTHH:MM:00"  (local time of the venue, Germany)
  weddingDateISO: "2027-06-12T15:00:00",
  timeZone: "Europe/Berlin",
  durationHours: 8,                 // used for "Add to Calendar"

  /* ---------- Location (Germany) ---------- */
  country: "Germany",
  flag: "🇩🇪",
  venue: {
    city: "Your City",              // ✏️ EDIT  e.g. "Munich"
    name: "Wedding Venue Name",     // ✏️ EDIT
    address: "Street and number, Postcode City, Germany", // ✏️ EDIT
    // ✏️ EDIT: paste a Google Maps share link. If left empty, the buttons
    // search Google Maps using the name + address above.
    mapsUrl: "",
    photo: "images/10-gallery-3.jpg",   // replace with your venue photo
    note: "Venue details will be confirmed with every invitation."
  },

  /* ---------- Contact / sharing ---------- */
  // ✏️ EDIT: WhatsApp number with country code, digits only. Germany = 49…
  // Example format: "49XXXXXXXXXX". Leave "" to hide the WhatsApp RSVP button.
  whatsappNumber: "",
  // ✏️ EDIT: the final public address of the site (used in Share / Copy link).
  // Leave "" to use whatever address the page is opened from.
  siteUrl: "",

  /* ---------- Music ---------- */
  music: {
    src: "music/wedding-music.mp3",   // 2 min 30 s – loops from the start
    volume: 0.7
  },

  /* ---------- Photos (all editable) ---------- */
  photos: {
    groomPortrait: "images/01-groom-portrait.jpg",
    bridePortrait: "images/02-bride-portrait.jpg",
    cover:         "images/03-cover-couple.jpg",
    final:         ["images/17-final-1.jpg", "images/18-final-2.jpg"],
    gallery: [
      "images/04-story-1.jpg",
      "images/08-gallery-1.jpg",
      "images/09-gallery-2.jpg",
      "images/10-gallery-3.jpg",
      "images/11-gallery-4.jpg",
      "images/12-gallery-5.jpg",
      "images/13-gallery-6.jpg",
      "images/14-gallery-7.jpg",
      "images/15-gallery-8.jpg",
      "images/16-gallery-9.jpg"
    ]
  },

  /* ---------- Couple introduction ---------- */
  people: {
    bride: { label: "The Bride", text: "A few words about Shreya – edit this text in config.js." },
    groom: { label: "The Groom", text: "A few words about Rahul – edit this text in config.js." }
  },

  /* ---------- Love story (✏️ EDIT every description) ---------- */
  story: [
    { title: "How We Met",         photo: "images/04-story-1.jpg", text: "Tell the story of how you first met. Edit this text in config.js." },
    { title: "Our First Memories", photo: "images/05-story-2.jpg", text: "Share a favourite early memory together. Edit this text in config.js." },
    { title: "The Proposal",       photo: "images/06-story-3.jpg", text: "Describe the moment the question was asked. Edit this text in config.js." },
    { title: "Forever Together",   photo: "images/07-story-4.jpg", text: "And now, the beginning of forever. Edit this text in config.js." }
  ],

  /* ---------- Schedule (✏️ EDIT times & text) ---------- */
  schedule: [
    { time: "14:00", title: "Guest Arrival",      text: "Welcome drinks and seating." },
    { time: "15:00", title: "Welcome Ceremony",   text: "A warm welcome to family and friends." },
    { time: "15:30", title: "Wedding Ceremony",   text: "The exchange of vows." },
    { time: "16:30", title: "Photography",        text: "Portraits and group photographs." },
    { time: "18:00", title: "Dinner",             text: "A celebratory dinner together." },
    { time: "20:00", title: "Reception",          text: "Speeches, first dance and toasts." },
    { time: "21:00", title: "Celebration",        text: "Music, dancing and joy until late." }
  ],

  /* ---------- Dress code (✏️ EDIT) ---------- */
  dressCode: {
    men:   "Suit & tie",
    women: "Cocktail dress or elegant evening wear",
    palette: ["#E9DFC9", "#FFFFFF", "#9A8466", "#0B4A40"],   // suggested colours
    note: "Please avoid wearing white."
  },

  /* ---------- Accommodation (✏️ EDIT) ---------- */
  accommodation: {
    name: "Hotel Name",
    address: "Hotel address, Germany",
    phone: "",
    email: "",
    bookingUrl: "",       // booking link; button hidden if empty
    mapsUrl: "",          // optional; otherwise a search link is generated
    note: "Mention the wedding when booking for the special guest rate (if available)."
  },

  /* ---------- Registry (✏️ EDIT) ---------- */
  registry: {
    url: "",              // registry link; button hidden if empty
    message: "Your presence at our wedding is the greatest gift. If you would like to give something more, we have created a registry to help us build beautiful memories together."
  },

  /* ---------- RSVP ----------
     The form only reports "success" when a real backend accepts the data.
     Pick ONE of these (details in README.md):
       A) Formspree  → endpoint: "https://formspree.io/f/xxxxxxx"
       B) Google Apps Script web-app URL (writes to a Google Sheet)
       C) Any endpoint that accepts a JSON POST.
     If endpoint is empty, guests are told RSVP is not live yet and are
     offered the WhatsApp fallback (if a number is set). Nothing is faked.   */
  rsvp: {
    endpoint: "",
    deadlineText: "",           // e.g. "Please reply by 1 May 2027" (optional)
    maxGuests: 8
  }
};
