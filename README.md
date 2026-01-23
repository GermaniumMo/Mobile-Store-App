# Mobile-Store-App

## Running the project (Local Development)

Quick steps to get both backend (Laravel) and frontend (Expo) running locally.

Prerequisites:
- PHP 8+, Composer
- Node.js 16+ and npm or yarn
- MySQL (or compatible) and a running database server (XAMPP available)

1) Backend (Laravel)

- Copy environment file and set database credentials in `.env`:

```bash
cd backend
copy .env.example .env
```

- Install PHP dependencies and generate app key:

```bash
composer install
php artisan key:generate
```

- Set your DB settings in `.env`, then run migrations and seeders (if any):

```bash
php artisan migrate --seed
```

- Create storage symlink for public files:

```bash
php artisan storage:link
```

- Start the backend dev server (option A - built-in):

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

- Option B (using XAMPP/Apache): place the `backend` folder in your webroot and configure virtual host as needed.

2) Frontend (Expo React Native)

- From the `frontend` folder install dependencies and start Expo:

```bash
cd frontend
npm install
npx expo start --web   # open in browser
# or to test on a device/tunnel: npx expo start --tunnel -c
```

- The app expects the backend API at `http://127.0.0.1:8000` by default. If you changed the backend port or host, update the API base URL in the frontend config (check `frontend/app/api.js` or `frontend/app/api/*`).

Common tips:
- If web scrolling for lists is not working, ensure you run the Expo web server (`npx expo start --web`) and open the browser preview. Reload the page after code changes.
- If CORS errors appear, ensure the backend has correct CORS settings (see `backend/config/cors.php`).
- For mobile device testing, ensure the device and dev machine are on the same network, or use `--tunnel`.

That's it — backend on port 8000 and Expo serving the frontend. If you'd like, I can add a one-line script to the root `package.json` to start both services together.