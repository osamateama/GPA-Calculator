let courses = [];

// Load from localStorage
if(localStorage.getItem('courses')){
  courses = JSON.parse(localStorage.getItem('courses'));
  updateCourseList();
}

function addCourse(){
  const name = document.getElementById('courseName').value.trim();
  let credits = parseFloat(document.getElementById('credits').value);
  const grade = parseFloat(document.getElementById('grade').value);

  if(!name || isNaN(grade)){ 
    alert('Please fill course name and grade correctly'); 
    return; 
  }

  if(isNaN(credits)) credits = 3;

  courses.push({name, credits, grade});
  localStorage.setItem('courses', JSON.stringify(courses));
  updateCourseList();

  document.getElementById('courseName').value=''; 
  document.getElementById('credits').value=''; 
  document.getElementById('grade').value='';
}

function updateCourseList(){
  const list=document.getElementById('coursesList'); list.innerHTML='';
  courses.forEach((c,i)=>{
    const div=document.createElement('div'); div.className='course';
    div.style.borderLeftColor = ['#ef4444','#3b82f6','#16a34a','#facc15','#8b5cf6','#ec4899'][i%6];
    div.innerHTML = `<span>${c.name} (${c.credits} credits - ${c.grade}%)</span><button onclick="removeCourse(${i})">Remove</button>`;
    list.appendChild(div);
  });
}

function removeCourse(i){
  courses.splice(i,1);
  localStorage.setItem('courses', JSON.stringify(courses));
  updateCourseList();
}

function clearAll(){
  if(confirm('Are you sure to clear all?')){
    courses=[]; localStorage.removeItem('courses'); updateCourseList();
    document.getElementById('prevCgpa').value=''; document.getElementById('prevCredits').value=''; 
    document.getElementById('currentGpa').innerText='0.00'; document.getElementById('finalGpa').innerText='0.00';
  }
}

function getGradePoints(grade){
  if(grade>=96) return 4.0; if(grade>=92) return 3.7; if(grade>=88) return 3.4;
  if(grade>=84) return 3.2; if(grade>=80) return 3.0; if(grade>=76) return 2.8;
  if(grade>=72) return 2.6; if(grade>=68) return 2.4; if(grade>=64) return 2.2;
  if(grade>=60) return 2.0; if(grade>=55) return 1.5; if(grade>=50) return 1.0; return 0.0;
}

function calculateGPA(){
  let totalPoints=0,totalCredits=0;
  courses.forEach(c=>{ const gp=getGradePoints(c.grade); totalPoints+=gp*c.credits; totalCredits+=c.credits; });
  const gpa = totalCredits>0 ? totalPoints/totalCredits : 0;
  document.getElementById('currentGpa').innerText=gpa.toFixed(2);
  const prevCgpa=parseFloat(document.getElementById('prevCgpa').value)||0;
  const prevCredits=parseFloat(document.getElementById('prevCredits').value)||0;
  let finalGpa=gpa;
  if(prevCgpa>0 && prevCredits>0){ finalGpa=(prevCgpa*prevCredits+totalPoints)/(prevCredits+totalCredits); }
  document.getElementById('finalGpa').innerText=finalGpa.toFixed(2);
}
