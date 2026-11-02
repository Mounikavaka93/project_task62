export const contact = {
  name: 'Halden Markets',
  line1: '1200 Market Street, Suite 400',
  line2: 'San Francisco, CA 94105',
  phone: '+1 (415) 555-0198',
  phoneHref: 'tel:+14155550198',
  email: 'hello@halden.example',
  emailHref: 'mailto:hello@halden.example',
}

export const reasons = [
  {
    icon: 'shield',
    title: 'Secure trading',
    body: 'Every ticket asks you to review size and price before the book changes. The simulated portfolio stays in this browser, and buying power is checked on each order.',
  },
  {
    icon: 'activity',
    title: 'Real-time market insights',
    body: 'Session clocks follow New York, London, Tokyo, and Hong Kong weekday hours. Index cards show last price, percentage change, and whether that window is open.',
  },
  {
    icon: 'layout',
    title: 'Easy-to-use platform',
    body: 'Buy and sell from a stock row, a watchlist card, or the trading desk. The ticket, the review step, and the receipt all use the same language.',
  },
  {
    icon: 'chart',
    title: 'Advanced analytics',
    body: 'Weight, average cost, unrealized P/L, and today’s move sit beside the holdings. The performance path rescales to the value of the book you hold right now.',
  },
]

export const steps = [
  {
    title: 'Read the session',
    body: 'Start with the indices and the city clocks so you know which cash markets are open before you look at single names.',
  },
  {
    title: 'Build a list',
    body: 'Star names from the stock board or add them on the watchlist. Cards keep price, change, and a sparkline in view.',
  },
  {
    title: 'Work the ticket',
    body: 'Choose buy or sell, set a quantity, review the total, and confirm. Holdings, cash, and P/L update together.',
  },
]

export const news = [
  {
    id: 'fed-minutes',
    title: 'Fed minutes show patience as core inflation drifts lower',
    category: 'Macro',
    date: '2026-11-02',
    source: 'Halden Desk',
    excerpt: 'Officials described inflation as cool enough to wait, not finished. Rate-sensitive names on the sample board firmed with the indices.',
    paragraphs: [
      'The sample minutes left the policy rate unchanged and described the next move as data-dependent. Traders marked the path of cuts as slower, then bought quality balance sheets rather than the most speculative names.',
      'On this desk the macro card is context for the index row. When the narrative is “wait and watch,” large-cap technology and the S&P proxy tend to move together, which is what the sample quotes show today.',
    ],
  },
  {
    id: 'chip-orders',
    title: 'Equipment orders lift the semiconductor complex',
    category: 'Equities',
    date: '2026-11-01',
    source: 'Halden Desk',
    excerpt: 'A fresh data-center booking put NVIDIA and AMD at the front of the sample gainers, with the heaviest volume on the board.',
    paragraphs: [
      'Semiconductor equipment names reported a cluster of orders tied to data-center buildouts. In the sample book, NVIDIA and AMD carry the move, and Broadcom follows with a smaller gain.',
      'A single customer headline can reprice the whole group. The watchlist keeps those symbols one click from the ticket so you can compare the move with the weight you already hold.',
    ],
  },
  {
    id: 'crude-stocks',
    title: 'Crude gives back gains after a surprise inventory build',
    category: 'Commodities',
    date: '2026-10-31',
    source: 'Halden Desk',
    excerpt: 'WTI slipped after stockpiles rose more than the sample survey. Exxon stayed green, a reminder that the equity is not the barrel.',
    paragraphs: [
      'The sample inventory print showed a larger build than desks had penciled in, and the WTI card turned lower. Energy equities were mixed rather than uniformly weak.',
      'Exxon remains a separate row from the crude quote on purpose. Commodity moves do not pass one-for-one into integrated oil majors, and the board lets you see both at once.',
    ],
  },
  {
    id: 'yields-ease',
    title: 'Treasury yields ease ahead of the payrolls report',
    category: 'Rates',
    date: '2026-10-30',
    source: 'Halden Desk',
    excerpt: 'Accounts squared up into the jobs print. Lower yields in the sample narrative supported longer-duration growth names.',
    paragraphs: [
      'Yields drifted down as positioning lightened before the employment report. Nothing in the sample tape suggests a regime change — it is a positioning session.',
      'Rates are the bridge between the index move and the stock move. When yields fall on this board, the longer-duration names in technology and communication tend to firm.',
    ],
  },
  {
    id: 'bank-credit',
    title: 'Money-center banks steady after a quiet credit update',
    category: 'Financials',
    date: '2026-10-29',
    source: 'Halden Desk',
    excerpt: 'Charge-off guidance was left unchanged. JPMorgan held a small gain while the financials sleeve stayed orderly.',
    paragraphs: [
      'Large banks reported a credit update that did not reset guidance. Spreads in the sample narrative stayed contained, and the group traded as a slow grind rather than a gap.',
      'JPMorgan is the financials anchor in the opening book. A quiet tape is still information: the sleeve did not become the day’s source of P/L.',
    ],
  },
  {
    id: 'breadth-bid',
    title: 'Defensive shares attract bids as leadership broadens',
    category: 'Markets',
    date: '2026-10-28',
    source: 'Halden Desk',
    excerpt: 'Breadth improved beyond chips, even as Lilly and UnitedHealth lagged. Sector labels are not uniforms.',
    paragraphs: [
      'Buyers stepped into parts of consumer staples while the chip group kept the headline. Healthcare in the sample list did not follow: Lilly and UnitedHealth both finished lower.',
      'The hero card counts advancers and decliners in the sixteen-name book. If most names rise while a heavy holding fades, the portfolio can still be down — check weight before adding size.',
    ],
  },
]

export const legal = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'November 2, 2026',
    intro: 'This policy describes the Halden demonstration. It is a browser interface, not a brokerage account.',
    sections: [
      {
        heading: 'What this demo is',
        body: [
          'Halden Markets is a front-end trading and investment interface. Quotes, news, and fundamentals are illustrative. Nothing on this site opens a real brokerage account or transmits an order to an exchange.',
        ],
      },
      {
        heading: 'Information that stays on your device',
        body: [
          'If you sign in, the name and email you type are saved in local storage so the desk can greet you on the next visit. Your simulated cash, holdings, watchlist, and order receipts are stored the same way.',
          'That information is not sent to a server by this project. Clearing site data for this origin removes it.',
        ],
      },
      {
        heading: 'What this demo does not collect',
        body: [
          'There is no account password database, no payment card form, and no analytics beacon in this build. The contact form confirms locally and does not deliver email.',
          'Fonts are requested from Google Fonts when the page loads. That request is subject to Google’s own policies.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          'Questions about this demonstration can be addressed to hello@halden.example. The address and phone number in the footer are sample contact details.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'November 2, 2026',
    intro: 'By using this interface you agree that it is a simulation for exploring a trading-desk layout.',
    sections: [
      {
        heading: 'Not a broker and not an offer',
        body: [
          'Halden does not offer securities, commodities, custody, or investment advice. No content on the site is a solicitation to buy or sell any financial instrument.',
        ],
      },
      {
        heading: 'Sample market data',
        body: [
          'Prices, index levels, fundamentals, and news are static sample figures chosen for the interface. They are not real-time exchange data and must not be used to make investment decisions.',
          'Session status uses your device clock and simplified weekday hours. Exchange holidays are not modeled.',
        ],
      },
      {
        heading: 'Simulated portfolio',
        body: [
          'Buy and sell confirmations change a ledger in your browser only. Fills are immediate and free of commission inside the demo, including limit tickets, which fill at the price you enter when you confirm.',
          'You can reset the sample book from the portfolio page. Reset restores the opening cash, holdings, and watchlist.',
        ],
      },
      {
        heading: 'Acceptable use',
        body: [
          'Do not treat the interface as a live trading system, and do not submit personal financial information you would not put in a public demo. The sign-in form accepts any email and an 8-character password because it does not authenticate anyone.',
        ],
      },
      {
        heading: 'Changes',
        body: [
          'The demonstration may change as the interface is revised. Continued use of a local copy means you accept the terms shipped with that copy.',
        ],
      },
    ],
  },
}
