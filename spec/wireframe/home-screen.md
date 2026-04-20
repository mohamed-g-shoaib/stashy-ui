### UI Description Breakdown

**1. Global Layout & Header**

- **Header Top Row:**
  - Top-left: A circular avatar placeholder (to show user's profile image).
  - Adjacent text: A greeting reading "Hi, [User Name]" with a date beneath it stating today's date for users and days left in month, here's an example: "Sat, 18/Apr 12 Days Left".
  - Top-right: Two icon buttons horizontally aligned (a question mark icon for Help, and a gear icon for Settings).
- **Divider:** A thin, full-width horizontal line separates the header from the main scrollable content area.

**2. "Daily Rate" Section**

- **Header:** The section title "Daily Rate" is aligned to the leading edge.
- **Card Container:** The content is enclosed in a sharply outlined rectangular box.
  - **Top Row:** Two large numeric values. The left value is "615.38 EGP" which represents what remains from the daily allowance, and the right value is "815.38 EGP" which represents the total daily allowance.
  - **Middle Row:** A horizontal progress bar. The left portion is solidly filled which represents what remains from the daily allowance, and the right portion features a diagonal hatched pattern which represents the portion of the allowance that has been used.
  - **Bottom Row (Split):** The left side reads "Spent Today: 200 EGP", and the right side reads "On Track" and could also read "Overspent" if the user has exceeded their daily allowance.
  - **Footer:** Below the main split, text reads "Your Rate Tomorrow: 860 EGP" followed by a small upward-trending chart icon or a downward-trending chart icon depending on the user's spending trend.

**3. "Budget Overivew" Section**

- **Header:** The section title "Budget Overivew" is aligned to the leading edge.
- **Card Container:** Enclosed in an outlined rectangular box.
  - **Left Element:** A thick circular donut chart graphic containing the text "10,000 EGP" which is the budget the user sets, perfectly centered inside the ring, the ring shows variable and fixed budgets, which are also demonstrated in the donut chart.
  - **Middle Column:** A stacked text group containing the label "Variable", the value "7,960EGP", and a small caption "Total money after fixed expenses".
  - **Right Column:** A stacked text group containing the label "Fixed", the value "1,240EGP", and a small caption "Total money that must be paid".

**4. "Major Expenses" Section**

- **Header:** The section title "Major Expenses" is aligned to the leading edge.
- **Card Container:** Enclosed in an outlined rectangular box.
  - **Top Row:** Left shows total amount (e.g., "3000 EGP of 10,000 EGP budget"), Right shows percentage badge (e.g., "15%").
  - **Middle Row:** A horizontal progress bar representing the usage.
  - **Warning (If >25%):** Inline text: "Major expenses are high this month".

**5. "Upcoming Fixed Payments" Section**

- **Header:** The section title "Upcoming Fixed Payments" is on the left, with a "View All" actionable label aligned to the right edge.
- **List Items:** Contains two separate, heavily outlined rectangular cards stacked vertically which represent the upcoming fixed payments.
  - **Item 1:** Left side shows "Rent" stacked above "1 Day Left". Right side shows "3000 EGP" stacked above "Mon, 20/Apr".
  - **Item 2:** Left side shows "Internet" stacked above "2 Days Left". Right side shows "260 EGP" stacked above "Tue, 21/Apr".

**6. "History" Section**

- **Header:** The section title "History" is on the left, with "Filter" and "View All" actionable labels aligned to the right.
- **List Items:** Contains three separate, identically formatted outlined cards stacked vertically.
  - **Each Item:** Features a circular "$" icon on the far left which also could be a credit card icon, it shows the payment method icon in genral. Next to it is a negative value (e.g., "-200 EGP", "-800 EGP", "-1200 EGP") or could be a positive value depending on the transaction type. The far right side displays a the date of the transaction (e.g., "Fri, 17/Apr").

**7. Floating Action Button (FAB)**

- A large, outlined circular button containing a "+" icon, positioned in the bottom trailing corner, floating above the content layout.

**8. Bottom Navigation**

- A full-width horizontal bar at the very bottom containing four equally spaced text labels: "Home", "Tracker", "Analytics", and "Settings" each with proper icons.

---

### ASCII Art Representation

```text
+-------------------------------------------------+
|  (O)  Hi, Mohamed                         (?) {O} |
|       Sat, 18/Apr  12 Days Left                   |
|---------------------------------------------------|
|                                                   |
|  Daily Rate                                       |
|  +---------------------------------------------+  |
|  |  615.38 EGP                      815.38 EGP |  |
|  |  [==========>/////////////////////////////] |  |
|  |  Spent Today: 200 EGP              On Track |  |
|  |  Your Rate Tomorrow: 860 EGP ~              |  |
|  +---------------------------------------------+  |
|                                                   |
|  Budget Overivew                                  |
|  +---------------------------------------------+  |
|  |  ( 10,000 )   Variable          Fixed       |  |
|  |  (   EGP  )   7,960EGP          1,240EGP    |  |
|  |               Total money..    Total money..|  |
|  +---------------------------------------------+  |
|                                                   |
|  Major Expenses                                   |
|  +---------------------------------------------+  |
|  |  3000 EGP of 10,000 EGP               [15%] |  |
|  |  [=====>                                  ] |  |
|  |  ! Major expenses are high this month       |  |
|  +---------------------------------------------+  |
|                                                   |
|  Upcoming Fixed Payments              View All    |
|  +---------------------------------------------+  |
|  | Rent                               3000 EGP |  |
|  | 1 Day Left                      Mon, 20/Apr |  |
|  +---------------------------------------------+  |
|  +---------------------------------------------+  |
|  | Internet                            260 EGP |  |
|  | 2 Days Left                     Tue, 21/Apr |  |
|  +---------------------------------------------+  |
|                                                   |
|  History                       Filter View All    |
|  +---------------------------------------------+  |
|  | ($) -200 EGP                    Fri, 17/Apr |  |
|  +---------------------------------------------+  |
|  +---------------------------------------------+  |
|  | ($) -800 EGP                    Fri, 17/Apr |  |
|  +---------------------------------------------+  |
|  +---------------------------------------------+  |
|  | ($) -1200 EGP                   Fri, 17/Apr |  |
|  +---------------------------------------------+  |
|                                                   |
|                                            (+)    |
|                                                   |
|  Home      Tracker      Analytics     Settings    |
+-------------------------------------------------+
```

---
