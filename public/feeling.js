// function submitEmotion() {
//   const input = document.getElementById('emotionInput');
//   const mood = document.getElementById('moodSelect').value;
//   const text = input.value.trim();
//   const time = new Date().toLocaleString();

//   if (text === '') {
//     alert('Please write something before submitting.');
//     return;
//   }

//   const newEntry = {
//     id: Date.now().toString(),
//     text: text || '',   // undefined fix
//     mood: mood || '🙂', // undefined fix
//     time: time,
//     likes: 0
//   };

//   const entries = JSON.parse(localStorage.getItem('entries') || '[]');
//   entries.unshift(newEntry);
//   localStorage.setItem('entries', JSON.stringify(entries));

//   input.value = '';
//   updateCharCount();
//   renderEntries();
// }

// function renderEntries() {
//   const entries = JSON.parse(localStorage.getItem('entries') || '[]');
//   const container = document.getElementById('entriesContainer');
//   container.innerHTML = '';

//   entries.forEach(entry => {
//     if (!entry.text || !entry.mood) return; // skip broken data
//     const div = document.createElement('div');
//     div.className = 'entry';
//     div.innerHTML = `
//       <strong>${entry.mood}</strong> ${entry.text}
//       <br><small>${entry.time}</small>
//       <br>
//       <button onclick="likeEntry('${entry.id}')">❤️ ${entry.likes}</button>
//     `;
//     container.appendChild(div);
//   });
// }

// function likeEntry(id) {
//   const entries = JSON.parse(localStorage.getItem('entries') || '[]');
//   const updated = entries.map(entry => {
//     if (entry.id === id) entry.likes += 1;
//     return entry;
//   });
//   localStorage.setItem('entries', JSON.stringify(updated));
//   renderEntries();
// }

// function clearAllEntries() {
//   if (confirm("Are you sure you want to clear all entries?")) {
//     localStorage.removeItem('entries');
//     renderEntries();
//   }
// }

// function toggleDarkMode() {
//   document.body.classList.toggle('dark-mode');
// }

// function updateCharCount() {
//   const len = document.getElementById('emotionInput').value.length;
//   document.getElementById('charCount').textContent = `${len}/1000`;
// }

// document.addEventListener('DOMContentLoaded', () => {
//   renderEntries();
//   updateCharCount();
//   document.getElementById('emotionInput').addEventListener('input', updateCharCount);
// });
// function submitEmotion() {
//   const input = document.getElementById('emotionInput');
//   const mood = document.getElementById('moodSelect').value;
//   const text = input.value.trim();
//   const time = new Date().toLocaleString();

//   if (text === '') {
//     alert('Please write something before submitting.');
//     return;
//   }

//   const newEntry = {
//     id: Date.now().toString(),
//     text,
//     mood,
//     time,
//     likes: 0
//   };

//   const entries = JSON.parse(localStorage.getItem('entries') || '[]');
//   entries.unshift(newEntry);
//   localStorage.setItem('entries', JSON.stringify(entries));

//   // WhatsApp notification
//   fetch('http://localhost:5000/send-whatsapp', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(newEntry)
//   }).catch(err => console.error("WhatsApp Error:", err));

//   input.value = '';
//   updateCharCount();
//   renderEntries();
// }

// fetch('https://backendtest-github-io.onrender.com/', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(newEntry)
// })
// async function loadFeelings() {
//   const res = await fetch("http://localhost:5000/feelings");
//   const data = await res.json();
//   const container = document.getElementById("entriesContainer");
//   container.innerHTML = "";

//   data.forEach(f => {
//     const div = document.createElement("div");
//     div.className = "entry";
//     div.innerHTML = `
//       <p>${f.mood} ${f.text}</p>
//       <button onclick="react(${f.id}, 'like')">👍 ${f.reactions.like}</button>
//       <button onclick="react(${f.id}, 'love')">❤️ ${f.reactions.love}</button>
//       <button onclick="react(${f.id}, 'laugh')">😂 ${f.reactions.laugh}</button>
//     `;
//     container.appendChild(div);
//   });
// }

// async function submitEmotion() {
//   const mood = document.getElementById("moodSelect").value;
//   const text = document.getElementById("emotionInput").value;

//   if (!text.trim()) return alert("Please enter your feeling");

//   await fetch("http://localhost:5000/feelings", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ mood, text })
//   });

//   document.getElementById("emotionInput").value = "";
//   loadFeelings();
// }

// async function react(id, type) {
//   await fetch(`http://localhost:5000/feelings/${id}/react`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ type })
//   });
//   loadFeelings();
// }

// window.onload = loadFeelings;

// 🔗 Your Render backend API
const API_BASE = "https://shareur-filing-io.onrender.com";

// Character counter
const textarea = document.getElementById("emotionInput");
const charCount = document.getElementById("charCount");
textarea.addEventListener("input", () => {
  charCount.textContent = `${textarea.value.length}/1000`;
});

// Submit feeling
async function submitEmotion() {
  const mood = document.getElementById("moodSelect").value;
  const text = textarea.value.trim();

  if (!text) {
    alert("Please write your feeling before submitting!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/feelings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, text }),
    });

    const data = await res.json();
    console.log("✅ Submitted:", data);

    // Reset input
    textarea.value = "";
    charCount.textContent = "0/1000";

    // Refresh feed
    loadFeelings();
  } catch (err) {
    console.error("❌ Error submitting feeling:", err);
  }
}

// Load all feelings
async function loadFeelings() {
  try {
    const res = await fetch(`${API_BASE}/feelings`);
    const data = await res.json();

    const container = document.getElementById("entriesContainer");
    container.innerHTML = "";

    data.forEach((f) => {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `
        <p><strong>${f.mood}</strong> - ${f.text}</p>
        <div>
          ❤️ ${f.reactions.like} 
          😂 ${f.reactions.laugh} 
          💕 ${f.reactions.love}
        </div>
        <button onclick="reactToFeeling(${f.id}, 'like')">❤️ Like</button>
        <button onclick="reactToFeeling(${f.id}, 'laugh')">😂 Laugh</button>
        <button onclick="reactToFeeling(${f.id}, 'love')">💕 Love</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Error loading feelings:", err);
  }
}

// React to a feeling
async function reactToFeeling(id, type) {
  try {
    const res = await fetch(`${API_BASE}/feelings/${id}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    const data = await res.json();
    console.log("✅ Reacted:", data);

    // Refresh feed
    loadFeelings();
  } catch (err) {
    console.error("❌ Error reacting:", err);
  }
}

// Auto-load on page load
window.onload = loadFeelings;


