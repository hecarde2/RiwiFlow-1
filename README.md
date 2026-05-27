# RiwiFlow — Kanban Task Manager

SPA built with **Vanilla JS + Vite + Tailwind CSS** and a **json-server** REST backend.

---

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start json-server (API)

```bash
npx json-server --watch db.json --port 3001
```

This exposes:
- `GET/POST /users`
- `GET/PUT/DELETE /users/:id`
- `GET/POST /tasks`
- `GET/PUT/DELETE /tasks/:id`

### 3. Start Vite dev server (in a new terminal)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Default Credentials

| Role  | Email             | Password   |
|-------|-------------------|------------|
| Admin | admin@riwi.io     | admin123   |
| Coder | coder@riwi.io     | coder123   |

---

## 👥 Roles

| Capability              | Admin | Coder |
|-------------------------|:-----:|:-----:|
| View all tasks          |  ✅   |  ✅   |
| Create tasks            |  ✅   |  ❌   |
| Edit any task           |  ✅   |  ❌   |
| Edit own tasks          |  ✅   |  ✅   |
| Delete tasks            |  ✅   |  ❌   |
| Drag & drop tasks       |  ✅   |  ✅*  |
| Manage users            |  ✅   |  ❌   |
| Create users            |  ✅   |  ❌   |

> *Coders can drag only their own tasks

---

## 📁 Project Structure

```
riwiflow/
├── index.html               # App shell (Tailwind config + fonts)
├── db.json                  # json-server database
├── .env                     # VITE_API_URL=http://localhost:3001
├── package.json
└── src/
    ├── main.js              # Entry point — boots the router
    ├── router.js            # SPA router with auth guards
    ├── services/
    │   ├── api.js           # All fetch() calls to json-server
    │   └── session.js       # localStorage session helpers
    ├── components/
    │   ├── sidebar.js       # Persistent sidebar (never reloads)
    │   ├── taskCard.js      # Task card HTML renderer
    │   ├── dragDrop.js      # HTML5 Drag & Drop logic
    │   └── modal.js         # Reusable modal dialog
    └── pages/
        ├── login.js         # Login page
        ├── board.js         # Authenticated app shell
        └── views/
            ├── kanbanView.js # Kanban board view
            └── usersView.js  # User directory view (admin)
```

---

## 🔄 Kanban Columns

| Status      | Description                  |
|-------------|------------------------------|
| todo        | Not started yet              |
| in progress | Currently being worked on    |
| in review   | Awaiting review/approval     |
| done        | Completed                    |

---

## 🧠 Key Technical Decisions

- **SPA without reload**: The sidebar is rendered once. Only `#main-content` swaps when navigating.
- **Drag & Drop**: Uses the native HTML5 `draggable` API — no external libraries needed.
- **Role guards**: Route `/board` checks localStorage; users view checks `role === 'admin'`.
- **Modal**: Generic reusable component used for create/edit/delete confirmations.
