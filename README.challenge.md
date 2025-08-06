# 🎓 Campus Mini App Challenge 2025 — Reference Guide

> This file contains all the official instructions and setup notes for the Campus Mini App Challenge hosted by Base. Use this for reference during your build.

---

## 📣 Overview

The **Campus Mini App Challenge** scouts highly talented and high-intensity builders creating next-level Mini Apps on Base.  
🗓️ The challenge runs from **August 1 to August 25, 2025** (11:59 PM UTC+8).

This initiative highlights the innovation of various universities in the Philippines and serves as a gateway to:

- 💸 **Support and funding** through grants  
- 💼 **Internship and job opportunities**  
- 🧑‍💻 **Recognition as a top student Web3 builder**

---

## 🧑‍🤝‍🧑 Who Can Join?

- ✅ Open to **students or alumni** of any college or university in the Philippines  
- ✅ Solo developers or team submissions are allowed  
- ✅ At least one team member must be a student or alumnus

---

## 🛠️ What to Build?

You’ll build a **simple onchain app using Base**.

💡 Ideas include:
- Mini tools
- Social dApps
- Small games
- Onchain utilities

> 🔥 Judging criteria: **functionality**, **creativity**, and **usability** — not complexity.

---

## 🎓 Representing Your School

When submitting your project, just **indicate your school or university name**.  
Submissions are counted by school.

---

## 🧰 Tech Stack + Resources

### Required Platform:
- **Base** (Ethereum L2)

### Optional Tools You Can Use:
- `viem`
- `wagmi`
- `thirdweb`
- `scaffold-eth`

### 📚 Recommended Docs:
- [MiniKit Quickstart](https://docs.base.org/wallet-app/build-with-minikit/quickstart)
- [Wrap Existing App as MiniKit](https://docs.base.org/wallet-app/build-with-minikit/existing-app-integration)
- [Guide: Thinking Social](https://docs.base.org/wallet-app/guides/thinking-social)
- [Demos on GitHub](https://github.com/base/demos/tree/master/minikit)

---

## 🏁 Challenge Timeline

- 🗓️ Starts: **August 1, 2025**
- ⏳ Deadline: **August 25, 2025 at 11:59 PM (UTC+8)**

---

## 💰 Prizes

🏆 **Top 3 schools with the most valid Mini App submissions** will each receive:  
**₱50,000** in funding

---

## ✅ Winning Criteria

For a submission to be valid:
- It **must work** with its intended functionality
- It **must use the MiniKit** framework
- MiniKit manifest setup **is required**
- It should be kid-safe and usable on Farcaster

---

## 🧑‍💻 Workshops & Build Sprints

Join instructor-led and hands-on workshops:

- ⏱️ 3 hours of learning + 3 hours of sprint building  
- 📍 Available **on-site or virtually**  
- 📅 Book here: [https://calendly.com/basepilipinas](https://calendly.com/basepilipinas)

---

## 🔐 Setup Guide Summary

### 🌀 What is a Mini App?

A **Mini App** is a lightweight web app that runs inside **Farcaster**, launching instantly from posts. It feels native, behaves like a normal web app, and is built using familiar tools like **Next.js** + `minikit`.

### ⚙️ Initial Setup Steps

```bash
npx create-onchain --mini
cd your-project
npm install
npm run dev
