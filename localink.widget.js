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
    .lk-error-msg{color:red;font-size:14px;margin-top:10px;display:none;}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // Build modal HTML
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
        <div id="lk_error" class="lk-error-msg">Something went wrong. Please try again.</div>
      </div>

      <div id="lk_success" class="lk-success">
        <div class="lk-check">✔</div>
        <h3>Request Received</h3>
        <p>We’re checking nearby partners now.</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Open modal when a widget button is clicked
  document.addEventListener("click", function (e) {
    const link = e.target.closest(".localink-check");
    if (!link) return;

    // Populate hidden fields
    document.getElementById("lk_product").value = link.dataset.product || "";
    document.getElementById("lk_sku").value = link.dataset.sku || "";
    document.getElementById("lk_variant").value = link.dataset.variant || "";
    document.getElementById("lk_merchant").value = link.dataset.merchant || "";

    modal.style.display = "flex";
  });

  // Close modal
  document.addEventListener("click", function (e) {
    if (e.target.id === "lk_close") {
      modal.style.display = "none";
    }
  });

  // Submit handler
  document.addEventListener("click", async function (e) {
    if (e.target.id !== "lk_submit") return;

    const email = document.getElementById("lk_email");
    const postal = document.getElementById("lk_postal");
    const errorBox = document.getElementById("lk_error");

    email.classList.remove("lk-error");
    postal.classList.remove("lk-error");
    errorBox.style.display = "none";

    if (!email.value) { email.classList.add("lk-error"); return; }
    if (!postal.value) { postal.classList.add("lk-error"); return; }

    // Loading animation
    document.getElementById("lk_submit_text").style.display = "none";
    document.getElementById("lk_spinner").style.display = "block";

    const payload = {
      email: email.value,
      postal_code: postal.value,
      product_name: document.getElementById("lk_product").value,
      product_sku: document.getElementById("lk_sku").value,
      variant: document.getElementById("lk_variant").value,
      merchant: document.getElementById("lk_merchant").value,
      source: "Localink Widget"
    };

    try {
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Formspree error");

      // SUCCESS HANDLING (FIXED)
      const form = document.getElementById("lk_form");
      const success = document.getElementById("lk_success");

      if (!form || !success) {
        console.error("Modal elements missing, cannot toggle success.");
        return;
      }

      form.style.display = "none";
      success.style.display = "block";

    } catch (err) {
      errorBox.style.display = "block";
      console.error("Submission error:", err);
    } finally {
      // Always stop spinner
      document.getElementById("lk_spinner").style.display = "none";
      document.getElementById("lk_submit_text").style.display = "block";
    }
  });

})();

