# Restaurant Menu QR Generator

A free online tool for restaurants and cafes to create a digital menu and generate a real QR code that opens that menu page.

## Important Testing Note

Deploy the site on Vercel first, then generate the QR from the live Vercel website.

If you generate the QR while opening the HTML file directly from your laptop, the QR may point to a local file path that phones cannot open. On Vercel, the QR points to the live `menu.html?data=...` page and works correctly.

## Features

- Add restaurant details
- Add menu items with prices
- Generate a customer-facing menu page
- Generate a real QR code image
- QR opens the actual menu page using a query parameter
- Download QR code
- Required "Built for Digital Heroes" button
- Full name and email visible
- Deployable on Vercel free Hobby plan

## Personal Use Case

I have personally seen cafes and small restaurants using QR menus, but many simple QR menu services are paid or complicated. This tool gives small restaurants a free and easy way to create a QR menu.

## Tech Stack

HTML, CSS and JavaScript.
