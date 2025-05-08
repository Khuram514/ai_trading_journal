# 🔍 About
The goal of this project is to help traders and investors improve their results by providing detailed AI reports based on their trading/investing history. Just simply log all your trades to the platform and you will be able to see:

- Advanced algorithms for charts to visualize your results.
- Latest Claude model to get AI reports, with detailed explanations of what you should fix and which areas you should focus on.

# Table of Contents
- [Tech Stack](#tech-stack)
- [Pages](#pages)
  - [Calendar](#calendar)
  - [History](#history)
  - [Statistics](#statistics)
  - [Trade AI](#trade-ai)
  - [Tokens](#tokens)
  - [Archive](#archive)
- [Technicals](#technicals)


## Tech Stack

- **Next.js** for both the front end and back end (server actions)  
- **TypeScript** for type safety  
- **Redux Toolkit** for state management  
- **Neon PostgreSQL** with **Drizzle** for the database and database management  
- **MUI Charts** for charts and **Shadcn/Tailwind** for styling  
- **Zod** and **React Hook Form** for form validation  
- **Clerk** for authentication  
- **GSAP** for animations
- **Claude API** for AI reports generation.
- **Stripe** for secure payments.

## Disclaimer

> [!WARNING]
>### No Financial Advice
>
>The content, tools, and features provided in this application do not constitute financial advice, investment advice, trading advice, or any other sort of advice. The >application merely serves as a tool for organizing, analyzing, and reflecting on trading activities for educational purposes.
>
>### User Responsibility
>
>By accessing and using this software, you agree to use it solely for learning purposes and accept full responsibility for your financial decisions. You also acknowledge >that trading and investing involve risk, and that you should only risk capital you can afford to lose.

## Pages

### Calendar
The Calendar page is the heart of this website - it's where all the magic happens! Since my main goal is collecting your trading data to create those AI reports, I made this page super important. I kept it simple and easy to use, but still packed it with cool features like month/year views and your complete trading history. Adding new trades is a breeze - just click on any day to pop up the entry dialog, or quickly jump between months in the year view. No complicated stuff, just a straightforward way to log your trades!


https://github.com/user-attachments/assets/409f9971-c9b4-419e-9f5a-e1ccd4c88354


### History
The History page gives you the complete picture of all your trading activity in one place. 

**Features**
- Combine filtering by instrument name, column, and time for precise results.
- Date range picker to view trade history within a specific period. 
- Delete trades. 
- Editing functionality coming in a future update.


https://github.com/user-attachments/assets/8af7b6cd-cc16-4bfe-b11f-9d2ba912876f


### Statistics
The Stats page is your trading journey visualized! I built 10+ smart algorithms that transform your data into insightful charts. Same filtering options as the History page, so you can easily focus on specific instruments and discover what's actually working for you.


https://github.com/user-attachments/assets/8b8b333a-0bfc-432c-ad23-d74de50edba3


### Trade AI
Let's face it – trading is all about making money, but emotions can seriously mess with how we see our own performance. That's why I've added the TradeAI feature! Just log your trades and let Claude's AI do the cold, rational analysis your emotional brain sometimes can't.

**Features**
- AI reports powered by Claude API (currently supports give feedback about time management, money management and instruments)
- Follow up with a question (you can keep asking Claude after it generate report)
  

https://github.com/user-attachments/assets/50ebd4b7-da6e-479b-b4ad-707c9fbf54b7


### Tokens 
- Implemented token system (Use tokens to get AI reports),
- Integrated Stripe to manage payments and tokens purchase


<img width="1710" alt="Screenshot 2025-05-06 at 13 45 38" src="https://github.com/user-attachments/assets/e58c3e34-498e-4c34-82b6-22b6d25d0ac9" />


### Archive
An Archive section where you can save your AI reports, revisit them later, or even pick up conversations with the AI right where you left off

**Features**
- Pagination for navigation through reports  
- Sorting options (oldest ↔ newest)  
- Mark reports as favorites for quick access


<img width="1710" alt="Screenshot 2025-05-06 at 13 49 52" src="https://github.com/user-attachments/assets/5855165d-c93d-402b-9d1d-9afc0edeef35" />


## Technicals

- **Redux global state**  
  On initial page load, data is fetched on the server (via Next.js server components) and then saved to the Redux store once the page renders. All subsequent data manipulations happen in Redux, so changes made on one page immediately appear on others.

- **Optimistic updates**  
  Creating or deleting a trade triggers an optimistic update, so you see the result right away (no loading spinner for a smoother UX). If the server request fails, the state rolls back to its previous value and an error toast is shown.

- **Database optimization**  
  Because a large chunk of data is fetched at startup, database optimization is crucial. I’ve added appropriate indexes to speed up queries and improve response times.







Please visit the website and try it out for yourself: [Visit](https://tradejournal.one).








