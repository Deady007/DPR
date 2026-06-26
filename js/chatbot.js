/* =========================================================
   AI Chatbot — Anthropic claude-sonnet-4-6
   ========================================================= */

const chatState = {
  messages: [],     /* {role:'user'|'assistant', content:string}[] */
  loading: false,
};

const SYSTEM_PROMPT = `You are a smart project management assistant for Shreemay Associates,
a construction and interior design firm. You help project managers, site engineers, and
clients with questions about project tracking, DPR (Daily Progress Reports), SOPs,
purchase orders, and construction workflows. Be concise, professional, and practical.
When giving lists or steps, keep them brief. If asked about something outside construction
project management, politely redirect.`;

const QUICK_PROMPTS = [
  'How do I write a good DPR?',
  'What is an SOP checklist?',
  'How to track pending work?',
  'Tips for site inspection',
];

function getApiKey() {
  return sessionStorage.getItem('shreemay_api_key') || '';
}
function setApiKey(k) {
  sessionStorage.setItem('shreemay_api_key', k.trim());
}

/* ── Main render ── */
function renderChatbot() {
  const key = getApiKey();

  const msgHtml = chatState.messages.length
    ? chatState.messages.map(m => `
        <div class="chat-bubble ${m.role}">
          <div class="chat-text">${escChat(m.content)}</div>
        </div>`).join('')
    : `<div class="chat-welcome">
        <div class="chat-welcome-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="42" height="42" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="chat-welcome-title">Shreemay Assistant</div>
        <div class="chat-welcome-sub">Ask me anything about project management, DPR, SOPs, or site work.</div>
      </div>`;

  const chips = chatState.messages.length === 0
    ? `<div class="chat-chips">
        ${QUICK_PROMPTS.map(q => `<button class="chat-chip" onclick="sendQuick(${JSON.stringify(q)})">${q}</button>`).join('')}
      </div>` : '';

  const loadingBubble = chatState.loading
    ? `<div class="chat-bubble assistant"><div class="chat-typing"><span></span><span></span><span></span></div></div>`
    : '';

  const content = `
    <main class="screen chat-screen">
      ${key ? '' : apiKeyBanner()}
      <div class="chat-messages" id="chatMessages">
        ${msgHtml}
        ${loadingBubble}
      </div>
      ${chips}
      <div class="chat-input-row">
        <textarea class="chat-input" id="chatInput" rows="1"
          placeholder="Ask anything…"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}"
          oninput="autoResizeChatInput(this)"></textarea>
        <button class="chat-send" onclick="sendMessage()" ${chatState.loading ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="22" height="22" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </main>`;

  mountShell(content, { title: 'AI Assistant', back: true });
  scrollChat();
}

function apiKeyBanner() {
  return `
    <div class="api-key-banner">
      <div style="font-size:15px;font-weight:700;margin-bottom:8px">Enter Anthropic API Key</div>
      <div class="api-key-row">
        <input class="input api-key-input" id="apiKeyInput" type="password" placeholder="sk-ant-…"
               value="${getApiKey()}">
        <button class="btn btn-primary btn-sm" onclick="saveApiKey()">Save</button>
      </div>
      <div class="faint" style="font-size:12px;margin-top:6px">Stored only in this browser session.</div>
    </div>`;
}

function saveApiKey() {
  const val = document.getElementById('apiKeyInput')?.value.trim();
  if (!val) { toast('Enter a valid API key'); return; }
  setApiKey(val);
  toast('API key saved');
  renderChatbot();
}

/* ── Messaging ── */
function sendQuick(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

async function sendMessage() {
  if (chatState.loading) return;
  const input = document.getElementById('chatInput');
  const text  = input?.value.trim();
  if (!text) return;

  const key = getApiKey();
  if (!key) { toast('Please enter your API key first'); return; }

  input.value = '';
  autoResizeChatInput(input);
  chatState.messages.push({ role: 'user', content: text });
  chatState.loading = true;
  renderChatbot();

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-calls': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: chatState.messages,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const reply = data.content?.[0]?.text || 'No response.';
    chatState.messages.push({ role: 'assistant', content: reply });
  } catch (e) {
    chatState.messages.push({ role: 'assistant', content: `Error: ${e.message}` });
  }

  chatState.loading = false;
  renderChatbot();
}

function clearChat() {
  chatState.messages = [];
  renderChatbot();
}

function autoResizeChatInput(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function scrollChat() {
  const el = document.getElementById('chatMessages');
  if (el) el.scrollTop = el.scrollHeight;
}

function escChat(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\n/g, '<br>');
}
