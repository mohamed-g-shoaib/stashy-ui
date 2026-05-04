# Stashy — Mermaid Diagrams

## Diagram 1: System Architecture Overview

```mermaid
%%{init: {'theme': 'neutral'} }%%
graph TB
    subgraph Client["Frontend (Mobile App)"]
        Auth["Auth Pages<br/>Login/Signup"]
        Dashboard["Dashboard<br/>Daily Rates and Budget"]
        AddTrans["Add Transaction<br/>Form"]
        Tracking["Tracking Page<br/>Fixed Budget Progress"]
        FixedExp["Fixed Expenses<br/>CRUD"]
        History["Transaction History<br/>6 Filters + Transfer Merge"]
        Settings["Settings<br/>Config and Logout"]
        Nav["Navigation<br/>Tab Bar"]
    end

    subgraph Backend["API and Database"]
        AuthService["Auth Provider<br/>Authentication"]
        ApiLayer["API Layer<br/>Token Validation and Routing"]
        PostgreSQL["PostgreSQL<br/>Data Storage"]
        Scoping["Data Scoping<br/>user_id Filtering"]
    end

    %% Core flows
    Auth -->|Auth Token| AuthService
    Dashboard -->|API Requests with Bearer Token| ApiLayer
    AddTrans -->|API Requests with Bearer Token| ApiLayer
    ApiLayer -->|Validated user_id| PostgreSQL
    Scoping -->|Enforce Data Isolation| PostgreSQL
    Auth -->|Manage| AuthService
    Dashboard -->|Fetch| PostgreSQL
    AddTrans -->|Insert| PostgreSQL
    Tracking -->|Query Aggregates| ApiLayer
    FixedExp -->|CRUD| ApiLayer
    History -->|Query and Edit| ApiLayer
    Settings -->|Read/Write| ApiLayer
    Nav -->|Routes| Dashboard

    style Auth fill:#e1f5ff
    style Dashboard fill:#fff9c4
    style PostgreSQL fill:#f3e5f5
    style Scoping fill:#ffebee
```

---

## Diagram 2: Daily Rate Calculation Logic

```mermaid
%%{init: {'theme': 'neutral'} }%%
graph TD
    A["Month Start<br/>Monthly Budget: 10,000 EGP"] --> B["Fixed Expenses<br/>Rent, Subscriptions: 2,400 EGP"]
    B --> C["Base Variable Budget<br/>10,000 - 2,400 = 7,600 EGP"]
    C --> D["Collect Variable Received<br/>Income This Month<br/>Jan 5: +500, Jan 10: +300<br/>Total: +800 EGP"]
    D --> E["Adjusted Variable Budget<br/>7,600 + 800 = 8,400 EGP<br/>(ACTUAL budget for month)"]
    E --> E1["Collect Major Expenses<br/>Large purchases this month<br/>Laptop: 3,000 EGP, etc."]
    E1 --> E2["Effective Variable Budget<br/>Adjusted Budget - Fixed Overspend - Major Expenses"]

    E2 --> F["Base Rate<br/>Base Variable Budget ÷ 31 days = 245 EGP/day<br/>(CONSTANT monthly baseline)"]

    F --> G{" Is variable spending ≤<br/>Effective Budget?"}

    G -->|YES - On Budget| H["Current Rate = <br/>Effective Budget - Yesterday's Spending<br/>÷ Days Remaining<br/><br/>Reality-based dynamic target<br/>Recalculates with budget-state changes"]

    G -->|NO - Over Budget| I["Current Rate = <br/>Effective Budget - Yesterday's Spending<br/>÷ Days Remaining<br/><br/>Reality-based dynamic target<br/>Remaining Today can go negative"]

    H --> J["🟢 Status: On Track<br/>Display stable rate"]
    I --> K["🔴 Status: Over Budget<br/>Emergency Mode active"]

    J --> L["Dashboard Updates:<br/>Remaining Today<br/>Current Daily Rate<br/>Status Indicator"]
    K --> L

    L --> M["Variable Received<br/>increases rate<br/>permanently"]

    style A fill:#fff9c4
    style C fill:#c8e6c9
    style D fill:#bbdefb
    style E fill:#c8e6c9
    style E2 fill:#c8e6c9
    style F fill:#e3f2fd
    style H fill:#c8e6c9
    style I fill:#ffcdd2
    style J fill:#c8e6c9
    style K fill:#ffcdd2
    style M fill:#bbdefb
```

---

## Diagram 3: Transaction Flow & Impact

```mermaid
%%{init: {'theme': 'neutral'} }%%
graph TD
    A["Add Transaction"] --> B{Select Type}

    B -->|VARIABLE| C["Amount, Payment Method,<br/>Direction: Expense/Received"]
    B -->|FIXED| D["Category, Amount,<br/>Direction: Expense/Received"]
    B -->|MAJOR| MA["Amount, Payment Method<br/>Direction: ALWAYS Expense<br/>Confirmation Dialog (Current Month Only)"]

    C -->|Expense| E["Add to Total<br/>Variable Spent"]
    C -->|Received| F["Add to Total<br/>Variable Received"]

    D -->|Expense| G["Updates Tracking<br/>Page Progress Bar"]
    D -->|Received| H["Decreases Category<br/>Progress"]

    E --> I["Dashboard Changes:<br/>✓ Total Spent ↑<br/>✓ Current Rate ↓<br/>✓ Remaining Today ↓"]

    F --> J["Dashboard Changes:<br/>✓ Adjusted Budget ↑<br/>✓ Current Rate ↑<br/>✓ Remaining Today ↑<br/>✓ Permanent: affects rest of month"]

    G --> K["Tracking Changes:<br/>✓ Progress Bar % ↑<br/>✓ Category Status"]

    H --> L["Tracking Changes:<br/>✓ Progress Bar % ↓<br/>✓ Remaining ↑"]

    MA -->|Submit - confirm if current month| MAI["Reduce Effective<br/>Variable Budget"]
    MAI --> MAJ["Dashboard Changes:<br/>✓ Effective Budget ↓<br/>✓ Daily Rate ↓ - permanent<br/>✓ Remaining Today ↓<br/>✓ Major Expenses Card appears<br/>✓ Payment Totals ↑<br/>✗ Spent Today unchanged"]

    I --> M["Real-time Impact<br/>User sees consequences<br/>Spending reduces rate today"]
    J --> M2["Increases Budget Pool<br/>Spreads across remaining days<br/>Not just today"]
    K --> N["Separate Tracking<br/>Does not affect daily rate"]
    L --> N
    M --> O["Final Dashboard<br/>reflects all changes"]
    M2 --> O
    MAJ --> O

    style A fill:#fff9c4
    style E fill:#ffcdd2
    style F fill:#c8e6c9
    style G fill:#bbdefb
    style H fill:#bbdefb
    style I fill:#ffcdd2
    style J fill:#c8e6c9
    style M fill:#ffcdd2
    style M2 fill:#c8e6c9
    style MA fill:#fff9c4
    style MAI fill:#ffe0b2
    style MAJ fill:#ffe0b2
    style N fill:#bbdefb
```

---

## Diagram 4: Fixed Expense Dual Tracking

```mermaid
%%{init: {'theme': 'neutral'} }%%
graph TD
    A["Fixed Expenses Setup"] --> B{Expense Type}

    B -->|Auto-Pay<br/>Subscriptions| C["Spotify: 100 EGP<br/>Day: 5th of month<br/>Toggle: Auto ✓"]
    B -->|Manual Budgets| D["Coffee: 500 EGP<br/>Toggle: Manual"]

    C --> E["Auto-Pay Mechanism<br/>POST /api/v1/fixed-expenses/catch-up"]
    E --> F{Transaction<br/>exists?}
    F -->|NO| G["Auto-insert<br/>Spotify 100 EGP<br/>Expense on Day 5"]
    F -->|YES| H["Skip<br/>Idempotent"]

    D --> I["Manual Tracking<br/>Multiple transactions<br/>per month"]
    I --> J["Transaction 1: 50 EGP<br/>Transaction 2: 50 EGP<br/>Transaction 3: 60 EGP<br/>..."]

    G --> K["Tracking Page"]
    H --> K
    J --> K

    K --> L["Fixed Expense Cards"]
    L --> M["Coffee Card:<br/>Budget: 500 EGP<br/>Paid: 480 EGP<br/>Progress: 96%<br/>Status: ⚡ Low Remaining"]
    L --> N["Spotify Card:<br/>Budget: 100 EGP<br/>Paid: 100 EGP<br/>Progress: 100%<br/>Status: ✓ Paid"]

    M --> O["Color Coding:<br/>🟢 Green < 90%<br/>🟡 Yellow 90-100%<br/>🔴 Red > 100%"]
    N --> O

    style C fill:#bbdefb
    style D fill:#fff9c4
    style G fill:#c8e6c9
    style H fill:#e0e0e0
    style M fill:#fff9c4
    style N fill:#c8e6c9
    style O fill:#f3e5f5
```

---

## Diagram 5: Authentication & Data Isolation

```mermaid
%%{init: {'theme': 'neutral'} }%%
graph TD
    A["User Opens App"] --> B["Client Auth Check"]
    B --> C{Authenticated?}

    C -->|NO| D["Redirect to Login"]
    C -->|YES| E["Render Dashboard"]

    D --> F["Login/Signup Page"]
    F -->|Submit| G["Auth Provider"]
    G -->|Verify| H["Issue ID Token"]
    H -->|Token to Client| E

    E --> J["Dashboard Loads"]
    J --> K["Get user_id from<br/>verified token"]

    K --> L["Query API<br/>WHERE user_id = verified_user_id"]

    L --> M["Data Scoping Applied"]
    M --> N{Valid<br/>user_id?}

    N -->|YES| O["Return User's Data<br/>✓ User A sees A's data<br/>✓ User B sees B's data"]
    N -->|NO| P["Access DENIED ❌<br/>Security Block"]

    O --> Q["Display Dashboard<br/>with User's Data"]
    P --> R["Error Message"]

    style D fill:#ffcdd2
    style E fill:#c8e6c9
    style H fill:#e3f2fd
    style M fill:#ffebee
    style O fill:#c8e6c9
    style P fill:#ffcdd2
    style Q fill:#f1f8e9
```

---

## Diagram 6: Dashboard Data Flow

```mermaid
%%{init: {'theme': 'neutral'} }%%
graph TD
    A["Dashboard Component Mount"] --> B["Auth Check"]
    B --> C["Get user_id"]

    C --> D["Parallel Queries<br/>all filtered by user_id"]

    D --> E["Query 1:<br/>settings table<br/>monthly_budget"]
    D --> F["Query 2:<br/>fixed_expenses table"]
    D --> G["Query 3:<br/>payment_methods table"]
    D --> H["Query 4:<br/>transactions table<br/>current month"]

    E --> I["Calculate Values"]
    F --> I
    G --> I
    H --> I

    I --> J["Fixed Total<br/>= SUM fixed_expenses"]
    I --> K["Adjusted Variable Budget<br/>= (monthly - fixed) + variable_received + total_budget_injections"]
    I --> MA["Major Expenses Total<br/>= SUM major expenses"]
    I --> EFF["Effective Variable Budget<br/>= adjusted - fixed_overspend - major"]
    I --> L["Base Rate<br/>= base_variable_budget ÷ days_in_month"]
    I --> M["Spent Today<br/>= SUM variable expenses only"]
    I --> N["Today's Rate (FIXED)<br/>based on yesterday's spending"]
    I --> O["Fixed Progress %<br/>= paid ÷ budgeted"]
    I --> MAC["Major Expenses Count<br/>Major Percentage"]
    I --> P["Payment Totals<br/>per method (includes major)"]
    I --> Q["Tomorrow's Rate<br/>= remaining ÷ (days - 1)"]

    J --> R["Render Dashboard"]
    K --> R
    MA --> R
    EFF --> R
    L --> R
    M --> R
    N --> R
    O --> R
    MAC --> R
    P --> R
    Q --> R

    R --> S["Budget Overview Card:<br/>Monthly, Fixed, Variable, Days Left"]
    R --> T["Daily Spending Card:<br/>Remaining Today (hero)<br/>Base | Today's Rate | Spent"]
    R --> U["Tomorrow's Rate Impact Card:<br/>(conditional - only if overspending and not in emergency mode)"]
    R --> EM["Emergency Mode Banner:<br/>Over budget by X EGP<br/>Inject budget funds action"]
    R --> V["Fixed Budget Card:<br/>Progress Bar"]
    R --> MAD["Major Expenses Card:<br/>Total, %, Count, Warning"]
    R --> W["Payment Methods Card:<br/>Breakdown by Method"]

    S --> X["Complete Dashboard View"]
    T --> X
    U --> X
    EM --> X
    V --> X
    MAD --> X
    W --> X

    style A fill:#fff9c4
    style D fill:#e3f2fd
    style I fill:#f3e5f5
    style R fill:#fff9c4
    style X fill:#c8e6c9
```

---

## Diagram 8: Complete User Journey

```mermaid
%%{init: {'theme': 'neutral'} }%%
journey
    title Budget Manager User Journey
    section Onboarding
      Signup with email: 5: User
      Verify email: 5: User
      Set monthly budget: 5: Settings
    section Setup Phase
      Add payment methods: 4: Settings
      Create fixed expenses: 5: Fixed Expenses
      Set auto-pay dates: 5: Fixed Expenses
    section Daily Usage
      View dashboard: 5: Dashboard
      Add transaction: 5: Add Transaction
      Monitor today's rate: 5: Dashboard
      Check overspend impact: 4: Dashboard
      Review tracking: 4: Tracking Page
    section Review
      Review spending patterns: 4: Tracking
      Adjust budgets: 4: Fixed Expenses
    section Maintenance
      Adjust language/preferences: 5: Settings
      Logout: 5: Settings

    section Daily Rate Impact
      Spend under rate: 5: Dashboard
      See fixed rate: 5: Dashboard
      Overspend: 3: Dashboard
      View tomorrow's impact: 4: Dashboard
      Overspend: 2: Dashboard
      See rate drop: 1: Dashboard
      Feel consequences: 1: Dashboard
      Return to budget: 5: Dashboard
```

---

## Diagram 9: Data Security & Isolation

```mermaid
%%{init: {'theme': 'neutral'} }%%
graph TB
    subgraph Users["Users in System"]
        UA["User A<br/>90281771..."]
        UB["User B<br/>xxxx-yyyy"]
        UC["User C<br/>zzzz-wwww"]
    end

    subgraph Auth["Auth Provider"]
        Sessions["Session Management<br/>Email/Password + OAuth"]
        Tokens["ID Tokens<br/>Issued to Client"]
    end

    subgraph Scoping["Data Scoping Layer"]
        P1["Scope: transactions<br/>WHERE user_id = verified_user_id"]
        P2["Scope: payment_methods<br/>WHERE user_id = verified_user_id"]
        P3["Scope: fixed_expenses<br/>WHERE user_id = verified_user_id"]
        P4["Scope: settings<br/>WHERE user_id = verified_user_id"]
    end

    subgraph Data["PostgreSQL Data"]
        T1["User A's Transactions<br/>user_id = A"]
        T2["User B's Transactions<br/>user_id = B"]
        T3["User C's Transactions<br/>user_id = C"]
        PM1["User A's Methods"]
        PM2["User B's Methods"]
    end

    UA -->|Login| Sessions
    UB -->|Login| Sessions
    UC -->|Login| Sessions

    Sessions -->|Issue| Tokens

    Tokens -->|Query via API| P1
    Tokens -->|Query via API| P2
    Tokens -->|Query via API| P3
    Tokens -->|Query via API| P4

    P1 --> T1
    P1 --> T2
    P1 --> T3
    P2 --> PM1
    P2 --> PM2

    T1 -.->|Accessible| UA
    T2 -.->|Blocked| UA
    T3 -.->|Blocked| UA

    T2 -.->|Accessible| UB
    T1 -.->|Blocked| UB

    style UA fill:#e3f2fd
    style UB fill:#f3e5f5
    style UC fill:#fff9c4
    style T1 fill:#e3f2fd
    style T2 fill:#f3e5f5
    style Sessions fill:#c8e6c9
    style P1 fill:#ffebee
    style P2 fill:#ffebee
```

---

## Diagram 10: Request Lifecycle with Data Scoping

```mermaid
%%{init: {'theme': 'neutral'} }%%
sequenceDiagram
    participant User as User A
    participant Client as Client App
    participant API as API Layer
    participant DB as Database

    User->>Client: Click "Add Transaction"
    Client->>Client: Verify Auth (Client-side check)
    Client->>Client: Collect form data (amount, desc, etc)

    Client->>API: POST /transactions {amount, ..., token}
    API->>API: Validate token, extract user_id = "A"
    API->>DB: INSERT transaction {amount, ..., user_id: "A"}
    DB->>DB: Save transaction
    DB-->>API: ✓ Success
    API-->>Client: ✓ Success

    Client->>API: GET /transactions (current month)
    API->>API: Extract user_id from token
    API->>DB: SELECT WHERE user_id = "A"
    DB-->>API: Return A's transactions
    API-->>Client: Return only A's transactions

    Client->>Client: Recalculate rates
    Client->>User: Update dashboard

    Note over API: If User B tries same ID:<br/>Data scoping blocks (user_id mismatch)
```

---

**How to Use These Diagrams:**

1. **Copy the entire mermaid code block** (between triple backticks)
2. **Paste into one of these viewers:**
   - [Mermaid Live Editor](https://mermaid.live) - Best for editing & exporting
   - [GitHub markdown](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams) - Works in README.md
   - [Notion](https://www.notion.so) - Supports Mermaid natively
   - Your documentation tool (Confluence, GitBook, etc.)

3. **Export as:**
   - PNG/SVG image
   - PDF document
   - Embedded in markdown

**Recommended diagram order for presentation:**

1. System Architecture (Diagram 1) - "Here's how the system works"
2. Daily Rate Logic (Diagram 2) - "Core calculation engine"
3. Transaction Flow (Diagram 3) - "What happens when users spend"
4. Authentication (Diagram 5) - "How we protect data"
5. Data Security (Diagram 9) - "Why User A can't see User B's data"
6. Complete Journey (Diagram 8) - "User experience flow"
