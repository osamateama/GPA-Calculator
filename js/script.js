let courses = [];

/* ================= Load ================= */
if (localStorage.getItem('courses')) {
  courses = JSON.parse(localStorage.getItem('courses'));
  updateCourseList();
}

/* ================= Errors ================= */
function showError(input, message) {
  clearError(input);
  input.classList.add('input-error');

  const msg = document.createElement('div');
  msg.className = 'error-msg';
  msg.innerText = message;
  input.parentElement.appendChild(msg);
}

function clearError(input) {
  input.classList.remove('input-error');
  const err = input.parentElement.querySelector('.error-msg');
  if (err) err.remove();
}

/* ================= Validation ================= */
function validateCourseInputs() {
  let valid = true;

  const nameInput = document.getElementById('courseName');
  const creditsInput = document.getElementById('credits');
  const gradeInput = document.getElementById('grade');

  [nameInput, creditsInput, gradeInput].forEach(clearError);

  const name = nameInput.value.trim();
  let credits = parseFloat(creditsInput.value);
  const grade = parseFloat(gradeInput.value);

  if (name.length < 2) {
    showError(nameInput, 'Course name must be at least 2 characters');
    valid = false;
  }

  if (isNaN(credits)) {
    creditsInput.value = 3; // default
    credits = 3;
  }

  if (credits <= 0 || credits > 10) {
    showError(creditsInput, 'Credits must be between 1 and 10');
    valid = false;
  }

  if (isNaN(grade) || grade < 0 || grade > 100) {
    showError(gradeInput, 'Grade must be between 0 and 100');
    valid = false;
  }

  return valid;
}

/* ================= Add Course ================= */
function addCourse() {
  if (!validateCourseInputs()) return;

  const name = document.getElementById('courseName').value.trim();
  const credits = parseFloat(document.getElementById('credits').value);
  const grade = parseFloat(document.getElementById('grade').value);

  courses.push({ name, credits, grade });
  localStorage.setItem('courses', JSON.stringify(courses));
  updateCourseList();

  courseName.value = '';
  creditsInput = document.getElementById('credits').value = '';
  grade.value = '';
}

/* ================= List ================= */
function updateCourseList() {
  const list = document.getElementById('coursesList');
  list.innerHTML = '';

  courses.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'course';
    div.style.borderLeftColor =
      ['#ef4444', '#3b82f6', '#16a34a', '#facc15', '#8b5cf6', '#ec4899'][i % 6];

    div.innerHTML = `
      <span>${c.name} (${c.credits} credits - ${c.grade}%)</span>
      <button onclick="removeCourse(${i})">Remove</button>
    `;
    list.appendChild(div);
  });
}

function removeCourse(i) {
  courses.splice(i, 1);
  localStorage.setItem('courses', JSON.stringify(courses));
  updateCourseList();
}

function clearAll() {
  if (confirm('Are you sure to clear all?')) {
    courses = [];
    localStorage.removeItem('courses');
    updateCourseList();

    prevCgpa.value = '';
    prevCredits.value = '';
    currentGpa.innerText = '0.00';
    finalGpa.innerText = '0.00';
  }
}

/* ================= GPA ================= */
function getGradePoints(grade) {
  if (grade >= 96) return 4.0;
  if (grade >= 92) return 3.7;
  if (grade >= 88) return 3.4;
  if (grade >= 84) return 3.2;
  if (grade >= 80) return 3.0;
  if (grade >= 76) return 2.8;
  if (grade >= 72) return 2.6;
  if (grade >= 68) return 2.4;
  if (grade >= 64) return 2.2;
  if (grade >= 60) return 2.0;
  if (grade >= 55) return 1.5;
  if (grade >= 50) return 1.0;
  return 0.0;
}

function calculateGPA() {
  if (courses.length === 0) {
    alert('Add at least one course first');
    return;
  }

  let totalPoints = 0, totalCredits = 0;

  courses.forEach(c => {
    const gp = getGradePoints(c.grade);
    totalPoints += gp * c.credits;
    totalCredits += c.credits;
  });

  const gpa = totalCredits ? totalPoints / totalCredits : 0;
  currentGpa.innerText = gpa.toFixed(2);

  const prevCgpaVal = parseFloat(prevCgpa.value) || 0;
  const prevCreditsVal = parseFloat(prevCredits.value) || 0;

  if (prevCgpaVal < 0 || prevCgpaVal > 4) {
    alert('Previous CGPA must be between 0 and 4');
    return;
  }

  let final = gpa;
  if (prevCgpaVal > 0 && prevCreditsVal > 0) {
    final = (prevCgpaVal * prevCreditsVal + totalPoints) /
            (prevCreditsVal + totalCredits);
  }

  finalGpa.innerText = final.toFixed(2);
}
