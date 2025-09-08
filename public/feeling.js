// 🔗 Use relative paths (works on Render)
const API_BASE = "";

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
    const res = await fetch(`/feelings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, text }),
    });

    const data = await res.json();
    console.log("✅ Submitted:", data);

    textarea.value = "";
    charCount.textContent = "0/1000";

    loadFeelings();
  } catch (err) {
    console.error("❌ Error submitting feeling:", err);
  }
}

// Load all feelings
async function loadFeelings() {
  try {
    const res = await fetch(`/feelings`);
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
        <button onclick="deleteFeeling(${f.id})">🗑 Delete</button>
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
    await fetch(`/feelings/${id}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    loadFeelings();
  } catch (err) {
    console.error("❌ Error reacting:", err);
  }
}

// Delete a feeling
async function deleteFeeling(id) {
  console.log("🗑 Trying to delete ID:", id);
  try {
    const res = await fetch(`/feelings/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to delete");

    const data = await res.json();
    console.log("✅ Deleted:", data);
    loadFeelings();
  } catch (err) {
    console.error("❌ Error deleting feeling:", err);
    alert("Delete failed!");
  }
}

// Auto-load on page load
window.onload = loadFeelings;
