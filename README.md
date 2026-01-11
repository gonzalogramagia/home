# ✍️ Local

**Minimalist note-taking application designed for persistent browser-based storage.**

"Local" is a privacy-focused tool built to help you stay productive without your data ever leaving your device. Everything you write is stored directly in your browser's local storage—no servers, no tracking, just your notes.

---

## ✨ Key Features

- **🔒 Total Privacy**: Your data belongs to you. It's stored entirely in your browser's `localStorage`.
- **✍️ Markdown Formatting**:
    - Use `*bold*` for **bold** text.
    - Use `_italics_` for *italics*.
    - URLs are automatically turned into clickable links.
- **🖱️ Smart Interactions**:
    - **Double-click to Edit**: Prevents accidental triggers while allowing easy text selection.
- **📋 Clipboard Mastery**: One-click "Copiar" button with instant in-button feedback.
- **🗑️ Safe Deletion**: Two-step confirmation system ("Delete" ➔ "Sure?") to avoid mistakes.
- **🔗 Floating Shortcuts**:
    - **Quick Access**: Persistent floating buttons on both left and right corners for your favorite links.
    - **Fully Customizable**: Add, edit, or remove shortcuts with custom names and icons.
    - **Smart Search**: Built-in helper to find the perfect icon via Google Images.
- **✅ Daily Tasks**:
    - **Persistent Checklist**: A clean to-do list that saves your progress.
    - **Smart Reset**: Automatically unchecks all tasks at midnight (Argentina Time 🇦🇷) so you're ready for a fresh start.
- **⏳ Countdown Timer**:
    - **Event Tracking**: Set a target date and time for your important events.
    - **Visual Feedback**: Dynamic colors (Yellow < 15m, Red < 5m) and fun messages to keep you engaged.
- **🎨 Modern UI**: Clean, responsive design with dark mode support and sleek [Lucide](https://lucide.dev/) icons.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🕹️ Usage
 
 ### ✍️ Creating and Editing Notes
 - **New Note**: Click the **"+ Add Note"** (or "+ Agregar Nota") button to create a new note block.
 - **Edit Title**: Click on the note title (e.g., "Bloque #xyz") to rename it.
 - **Edit Content**: Double-click on the note body or click the **Pencil icon** to enter edit mode. 
 - **Save**: Click outside the note or press `Enter` (without Shift) to save your changes.
 
 ### 🚀 Emoji Picker
 - **Trigger**: Type `:` followed by a keyword (e.g., `:rocket`) inside any note.
 - **Select**: Use `Arrow` keys to navigate and `Enter` to insert the emoji.
 
 ### ⚡ Quick Actions
 - **Copy**: Click the **Copy icon** to copy the entire note content to your clipboard.
 - **Delete**: Click the **Trash icon** twice (Safe Delete) to permanently remove a note.
 - **Emojis Site**: Click the **Smile button** in the bottom-left corner to explore more emojis.

 ### 🔗 Floating Shortcuts
 - **Add**: Click the faded "+" button in the top corners to add a new shortcut.
 - **Edit**: Click on the specific shortcut's name tooltip to modify it.
 - **Delete**: Click the trash icon within the edit modal to remove a shortcut.

 ### ✅ Daily Tasks
 - **Add**: Use the input field at the bottom of the tasks list (left side) to add new daily todos.
 - **Reset Info**: Hover over the clock icon 🕒 to see the auto-reset time.

 ### ⏳ Countdown Timer
 - **Set Event**: Use the input fields on the right side panel to set an event name and date/time.
 - **Start**: Click "Start" to begin the countdown.
 - **Delete**: Click the trash icon to remove the countdown and set a new one.

---

## 📄 License

This project is created for personal use and is shared as-is. Feel free to explore and modify it for your own local productivity!

---

Made with 💛 by [Gonza](https://github.com/gonzalogramagia)
