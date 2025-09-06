// Hamburger toggle
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("active");
});

// ==========================
// SHOW/HIDE PAYMENT BOX
// ==========================
function showPayment() {
  const box = document.getElementById("paymentBox");
  box.style.display = box.style.display === "none" || box.style.display === "" ? "block" : "none";
}

// ==========================
// LOGOUT FUNCTION
// ==========================
function logout() {
  alert("You have been logged out!");
  localStorage.clear();
  window.location.href = "login.html";
}

// ==========================
// REGISTER HANDLER
// ==========================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value.trim();
    const role = registerForm.role.value;
    const msg = document.getElementById("registerMessage");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (data.success) {
        msg.style.color = "green";
        msg.innerText = data.message;

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        msg.style.color = "red";
        msg.innerText = data.message || "Registration failed";
      }
    } catch (err) {
      msg.style.color = "red";
      msg.innerText = "Server error: " + err.message;
    }
  });
}

// ==========================
// LOGIN HANDLER
// ==========================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim(); // backend expects "email"
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const msg = document.getElementById("message");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (data.success) {
        msg.style.color = "green";
        msg.innerText = data.message;

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Redirect based on role
        if (data.role === "student") {
          window.location.href = "notice.html";
        } else if (data.role === "admin") {
          window.location.href = "admin.html";
        } else {
          msg.style.color = "red";
          msg.innerText = "Unknown role";
        }
      } else {
        msg.style.color = "red";
        msg.innerText = data.message || "Login failed";
      }
    } catch (err) {
      msg.style.color = "red";
      msg.innerText = "Server error: " + err.message;
    }
  });
}

// ==========================
// FETCH AND SHOW DASHBOARD DATA FOR STUDENT
// ==========================
async function loadStudentDashboard() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/student/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.success) {
      const { notices, homework } = data;

      document.getElementById("notices").innerHTML = notices
        .map(
          (n) =>
            `<li><b>${n.title}</b><br>${n.content}<br><small>${new Date(
              n.date
            ).toDateString()}</small></li>`
        )
        .join("");

      document.getElementById("homework").innerHTML = homework
        .map(
          (h) =>
            `<li><b>${h.subject}</b><br>${h.details}<br><small>Due: ${new Date(
              h.dueDate
            ).toDateString()}</small></li>`
        )
        .join("");
    } else {
      alert("Failed to load dashboard: " + data.message);
    }
  } catch (err) {
    alert("Server error: " + err.message);
  }
}

// Call dashboard loader on notice.html
if (window.location.pathname.includes("notice.html")) {
  loadStudentDashboard();
}

