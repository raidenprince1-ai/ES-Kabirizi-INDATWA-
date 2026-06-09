const db = {
  students: "kabiriziStudents",
  teachers: "kabiriziTeachers",
  users: "kabiriziUsers",
  donations: "kabiriziDonations",
  gallery: "kabiriziGallery",
  news: "kabiriziNews",
  babyeyi: "kabiriziBabyeyi",
  admin: "kabiriziAdmin"
};

const defaults = {
  students: [
    { name: "Maya Chen", className: "Senior 4", status: "Present" },
    { name: "Ari Patel", className: "Senior 2", status: "Present" },
    { name: "Leah Brooks", className: "Senior 5", status: "Absent" }
  ],
  teachers: [
    { name: "Mr. Hakizimana", subject: "Mathematics", contact: "math@kabirizi.edu" },
    { name: "Ms. Uwase", subject: "Biology", contact: "biology@kabirizi.edu" },
    { name: "Mr. Niyonsenga", subject: "History", contact: "history@kabirizi.edu" }
  ],
  users: [],
  donations: [],
  gallery: [],
  news: [
    { category: "Academics", title: "Senior students earn regional science honors", date: "2026-05-06" },
    { category: "Arts", title: "Spring concert brings choir, strings, and jazz together", date: "2026-04-29" },
    { category: "Community", title: "Families collect 3,000 books for local reading program", date: "2026-04-18" }
  ],
  babyeyi: [
    { name: "Parent Committee", student: "All classes", phone: "+250 780 000 000", message: "Supports school-family communication" }
  ]
};

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#039;"
}[char]));

const readData = (key, fallback = []) => {
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
};

const writeData = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const ensureData = () => {
  Object.entries(defaults).forEach(([name, value]) => {
    if (!localStorage.getItem(db[name])) writeData(db[name], value);
  });
};

ensureData();

const adminPage = document.querySelector("[data-admin-page]");
const logoutButton = document.querySelector("[data-logout]");
const announcementForm = document.querySelector("[data-announcement-form]");
const adminNote = document.querySelector("[data-admin-note]");

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

if (adminPage && sessionStorage.getItem(db.admin) !== "true") {
  window.location.href = "login.html";
}

logoutButton?.addEventListener("click", () => {
  sessionStorage.removeItem(db.admin);
  window.location.href = "login.html";
});

announcementForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  announcementForm.reset();
  adminNote.textContent = "Announcement saved for review.";
});

const rowButton = (index, type) => `<button class="mini-button" type="button" data-delete-${type}="${index}">Delete</button>`;

const renderAdmin = () => {
  if (!adminPage) return;
  const students = readData(db.students);
  const teachers = readData(db.teachers);
  const donations = readData(db.donations);
  const users = readData(db.users);
  const news = readData(db.news);
  const gallery = readData(db.gallery);
  const babyeyi = readData(db.babyeyi);

  document.querySelector("[data-admin-students]").innerHTML = students.map((student, index) => `<tr><td>${escapeHtml(student.name)}</td><td>${escapeHtml(student.className)}</td><td>${escapeHtml(student.status)}</td><td>${rowButton(index, "student")}</td></tr>`).join("");
  document.querySelector("[data-admin-teachers]").innerHTML = teachers.map((teacher, index) => `<tr><td>${escapeHtml(teacher.name)}</td><td>${escapeHtml(teacher.subject)}</td><td>${escapeHtml(teacher.contact || "")}</td><td>${rowButton(index, "teacher")}</td></tr>`).join("");
  document.querySelector("[data-admin-donations]").innerHTML = donations.map((donation) => `<tr><td>${escapeHtml(donation.name)}</td><td>$${Number(donation.amount || 0).toLocaleString()}</td><td>${escapeHtml(donation.purpose)}</td></tr>`).join("");
  document.querySelector("[data-admin-accounts]").innerHTML = users.map((user) => `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.role)}</td></tr>`).join("");
  document.querySelector("[data-admin-news]").innerHTML = news.map((item, index) => `<tr><td>${escapeHtml(item.category)}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.date)}</td><td>${rowButton(index, "news")}</td></tr>`).join("");
  document.querySelector("[data-admin-babyeyi]").innerHTML = babyeyi.map((item, index) => {
    const attachmentLabel = item.attachment ? escapeHtml(item.attachment.name) : "—";
    return `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.student)}</td><td>${escapeHtml(item.phone)}</td><td>${attachmentLabel}</td><td>${rowButton(index, "babyeyi")}</td></tr>`;
  }).join("");
  document.querySelector("[data-admin-gallery]").innerHTML = gallery.map((item, index) => `<article><img src="${item.src}" alt="${escapeHtml(item.title)}"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.caption || "")}</span></div>${rowButton(index, "gallery")}</article>`).join("");
};

document.querySelector("[data-student-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const students = readData(db.students);
  students.push({ name: String(formData.get("name")).trim(), className: String(formData.get("className")).trim(), status: String(formData.get("status")) });
  writeData(db.students, students);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-teacher-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const teachers = readData(db.teachers);
  teachers.push({ name: String(formData.get("name")).trim(), subject: String(formData.get("subject")).trim(), contact: String(formData.get("contact")).trim() });
  writeData(db.teachers, teachers);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-news-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const news = readData(db.news);
  news.unshift({ category: String(formData.get("category")).trim(), title: String(formData.get("title")).trim(), date: String(formData.get("date")) });
  writeData(db.news, news);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-babyeyi-form]")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const file = formData.get("attachment");
  const attachment = file instanceof File && file.size
    ? { name: String(file.name), type: file.type, src: await readFileAsDataUrl(file) }
    : null;
  const babyeyi = readData(db.babyeyi);
  babyeyi.unshift({
    name: String(formData.get("name")).trim(),
    student: String(formData.get("student")).trim(),
    phone: String(formData.get("phone")).trim(),
    message: String(formData.get("message")).trim(),
    attachment,
    date: new Date().toISOString()
  });
  writeData(db.babyeyi, babyeyi);
  event.currentTarget.reset();
  renderAdmin();
});

document.querySelector("[data-gallery-form]")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const file = formData.get("image");
  if (!(file instanceof File) || !file.size) return;
  const gallery = readData(db.gallery);
  gallery.unshift({
    title: String(formData.get("title")).trim(),
    caption: String(formData.get("caption")).trim(),
    src: await readFileAsDataUrl(file)
  });
  writeData(db.gallery, gallery);
  event.currentTarget.reset();
  renderAdmin();
});

document.addEventListener("click", (event) => {
  [
    ["student", db.students],
    ["teacher", db.teachers],
    ["news", db.news],
    ["babyeyi", db.babyeyi],
    ["gallery", db.gallery]
  ].forEach(([type, key]) => {
    const button = event.target.closest(`[data-delete-${type}]`);
    if (!button) return;
    const items = readData(key);
    items.splice(Number(button.dataset[`delete${type[0].toUpperCase()}${type.slice(1)}`]), 1);
    writeData(key, items);
    renderAdmin();
  });
});

document.querySelector("[data-clear-students]")?.addEventListener("click", () => { writeData(db.students, []); renderAdmin(); });
document.querySelector("[data-clear-teachers]")?.addEventListener("click", () => { writeData(db.teachers, []); renderAdmin(); });
document.querySelector("[data-clear-news]")?.addEventListener("click", () => { writeData(db.news, []); renderAdmin(); });
document.querySelector("[data-clear-babyeyi]")?.addEventListener("click", () => { writeData(db.babyeyi, []); renderAdmin(); });
document.querySelector("[data-clear-gallery]")?.addEventListener("click", () => { writeData(db.gallery, []); renderAdmin(); });

renderAdmin();
