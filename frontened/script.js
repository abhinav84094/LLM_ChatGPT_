window.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.getElementById('chat-container');
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send-btn');
  const toggleBtn = document.getElementById('toggle-mode');


 

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

 async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, 'user');
  input.value = '';

  console.log(`Sending message to backend... ${userText}`);

  // Show thinking message
  const thinkingMsg = document.createElement('div');
  thinkingMsg.classList.add('message', 'gpt');
  thinkingMsg.textContent = "⏳ Thinking...";
  chatContainer.appendChild(thinkingMsg);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    });

    const data = await res.json();
    console.log("Received response:", data);

    thinkingMsg.remove(); // remove "Thinking..."

    const gptText = `${data.text}"`;
    appendMessage(gptText, 'gpt');
  } catch (err) {
    thinkingMsg.remove(); // remove "Thinking..."
    appendMessage("❌ Error connecting to server.", 'gpt');
    console.error(err);
  }
}


  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleBtn.textContent = document.body.classList.contains('dark')
      ? '☀️ Light Mode'
      : '🌙 Dark Mode';
  });
});
