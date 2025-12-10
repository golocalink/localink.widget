(function () {

  const FORM_URL = "https://formspree.io/f/mzznvgvz";

  // Inject CSS
  const css = `
    .lk-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;justify-content:center;align-items:center;z-index:999999;font-family:Arial,sans-serif;}
    .lk-modal{background:#fff;padding:32px 28px;border-radius:16px;max-width:420px;width:92%;box-shadow:0 8px 25px rgba(0,0,0,.15);text-align:center;animation:lkpop .25s ease-out;}
    @keyframes lkpop{from{opacity:0;transform:scale(.92);}to{opacity:1;transform:scale(1);}}
    .lk-input{width:100%;padding:14px;margin:8px 0;border-radius:12px;border:1px solid #ccc;font-size:16px;box-sizing:border-box;}
    .lk-input.lk-error{border-color:#ff4d6d;}
    .lk-button{width:100%;padding:16px;margin-top:14px;background:#ff4d6d;border:none;color:#fff;font-size:18px;border-radius:12px;cursor:pointer;}
    .lk-spinner{width:20px;height:20px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:lks 1s linear infinite;display:none;margin:0 auto;}
    @keyframes lks{to{transform:rotate(360deg);}}
    .lk-close{margin-top:15px;cursor:pointer;display:inline-block;color:#777;font-size:15px;}
    .lk-success{display:none;text-align:center;}
    .lk-check{font-size:60px;color:#27c200;animation:lkcheck .25s ease-out;}
    @keyframes lkcheck{from{opacity:0;transform:scale(0);}to{opacity:1;transform:scale(1);}}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // Build modal
  const modal = document.createElement("div");
  modal.className = "lk-backdrop";
  modal.id = "lk-backdrop";
  modal.innerHTML = `
    <div class="lk-modal">
      <div id="lk-form">
        <h3>Check Local Availability</h3>
        <p>Enter your details and we’ll search nearby stores.</p>

        <input id="lk_email" class="lk-input" type="email" placeholder="Your Email">
        <input id="lk_postal" class="lk-input" type="text" placeholder="Postal Code">

        <input type="hidden" id="lk_product">
        <input type="hidden" id="lk_sku">
        <input type="hidden" id="lk_variant">
        <input type="hidden" id="lk_merchant">

        <button id="lk_submit" class="lk-button">
          <span id="lk_submit_text">Check Availability</span>
          <div id="lk_spinner" class="lk-spinner"></div>
        </button>

        <div id="lk_close" class="lk-close">Cancel</div>
      </div>

      <div id="lk_success" class="lk-success">
        <div class="lk-check">✔</div>
        <h3>Request Received</h3>
        <p>We're checking nearby partners now.</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Open modal
  document.addEventListener("click", function (e) {
    const link = e.target.closest(".localink-check");
    if (!link) return;

    document.getElementById("lk_product").value = link.dataset.product || "";
    document.getElementById("lk_sku").value = link.dataset.sku || "";
    document.getElementById("lk_variant").value = link.dataset.variant || "";
    document.getElementById("lk_merchant").value = link.dataset.merchant || "";

    modal.style.display = "flex";
  });

  // Close modal
  document.getElementById("lk_close").onclick = () =>
    (modal.style.display = "none");

  // Submit handler
  document.getElementById("lk_submit").onclick = async function () {

    const email = document.getElementById("lk_email");
    const postal = document.getElementById("lk_postal");

    email.classList.remove("lk-error");
    postal.classList.remove("lk-error");

    if (!email.value) { email.classList.add("lk-error"); return; }
    if (!postal.value) { postal.classList.add("lk-error"); return; }

    // Show spinner
    const spinner = document.getElementById("lk_spinner");
    const text = document.getElementById("lk_submit_text");

    spinner.style.display = "block";
    text.style.display = "none";

    const payload = {
      email: email.value,
      postal_code: postal.value,
      product_name: document.getElementById("lk_product").value,
      product_sku: document.getElementById("lk_sku").value,
      variant: document.getElementById("lk_variant").value,
      merchant: document.getElementById("lk_merchant").value,
      source: "Localink Widget"
    };

    let ok = true;

    try {
      const res = await fetch(FORM_URL, {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(payload),
});


      if (!res.ok) {
        console.warn("Formspree returned:", res.status);
        ok = false;
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      ok = false;
    }

    // Always show success UI (MVP flow)
    const form = document.getElementById("lk_form");
    const success = document.getElementById("lk_success");

    if (form && success) {
      form.style.display = "none";
      success.style.display = "block";
    }

  };

})();

