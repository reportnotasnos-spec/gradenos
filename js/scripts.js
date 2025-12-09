let studentsData = [];

async function loadStudentsData() {
  try {
    const response = await fetch('students_grades.json');
    studentsData = await response.json();
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
}

function findStudentByDni(dni) {
  return studentsData.filter(student => student.dni === dni);
}

function validateLogin(dni, password) {
  const studentRecords = findStudentByDni(dni);
  if (studentRecords.length === 0) {
    return { success: false, message: 'DNI no encontrado' };
  }
  // La contrasena es el mismo DNI
  if (password !== dni) {
    return { success: false, message: 'Contrasena incorrecta' };
  }
  return { success: true, student: studentRecords };
}

function showDashboard(studentRecords) {
  const student = studentRecords[0];

  document.querySelector('.login-container').style.display = 'none';
  document.querySelector('.dashboard-container').style.display = 'block';

  document.getElementById('studentName').textContent = student.student;
  document.getElementById('studentDni').textContent = student.dni;
  document.getElementById('studentEmail').textContent = student.email;
  document.getElementById('studentProgram').textContent = student.program;
  document.getElementById('studentCycle').textContent = student.cycle;
  document.getElementById('studentYear').textContent = student.year;

  const tbody = document.getElementById('gradesBody');
  const cardsContainer = document.getElementById('gradesCards');
  tbody.innerHTML = '';
  cardsContainer.innerHTML = '';

  let totalAvg = 0;

  studentRecords.forEach(record => {
    const avg = Math.round((record.grade1 + record.grade2 + record.grade3) / 3);
    totalAvg += avg;
    const avgClass = avg >= 11 ? 'grade-approved' : 'grade-failed';

    // Table row for desktop
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.subject}</td>
      <td class="grade-cell ${record.grade1 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade1}</td>
      <td class="grade-cell ${record.grade2 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade2}</td>
      <td class="grade-cell ${record.grade3 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade3}</td>
      <td class="grade-cell ${avgClass}">${avg}</td>
    `;
    tbody.appendChild(row);

    // Card for mobile
    const card = document.createElement('div');
    card.className = 'grade-card';
    card.innerHTML = `
      <div class="grade-card-subject">${record.subject}</div>
      <div class="grade-card-grades">
        <div class="grade-card-item">
          <span>Nota 1</span>
          <strong class="${record.grade1 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade1}</strong>
        </div>
        <div class="grade-card-item">
          <span>Nota 2</span>
          <strong class="${record.grade2 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade2}</strong>
        </div>
        <div class="grade-card-item">
          <span>Nota 3</span>
          <strong class="${record.grade3 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade3}</strong>
        </div>
        <div class="grade-card-item">
          <span>Promedio</span>
          <strong class="${avgClass}">${avg}</strong>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  // General average
  const generalAvg = Math.round(totalAvg / studentRecords.length);
  const avgClass = generalAvg >= 11 ? 'grade-approved' : 'grade-failed';

  if (studentRecords.length > 1) {
    // Table row for desktop
    const avgRow = document.createElement('tr');
    avgRow.className = 'average-row';
    avgRow.innerHTML = `
      <td colspan="4"><strong>Promedio General</strong></td>
      <td class="grade-cell ${avgClass}"><strong>${generalAvg}</strong></td>
    `;
    tbody.appendChild(avgRow);
  }

  // Card for mobile (always show general average)
  const avgCard = document.createElement('div');
  avgCard.className = 'grade-card-average';
  avgCard.innerHTML = `
    <span>Promedio General</span>
    <strong class="${avgClass}">${generalAvg}</strong>
  `;
  cardsContainer.appendChild(avgCard);
}

function showLogin() {
  document.querySelector('.login-container').style.display = 'block';
  document.querySelector('.dashboard-container').style.display = 'none';
  document.getElementById('loginForm').reset();
  document.getElementById('errorMessage').textContent = '';
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadStudentsData();

  // Crear el dashboard dinamicamente
  const dashboardHTML = `
    <div class="dashboard-container">
      <div class="dashboard-box">
        <div class="dashboard-header">
          <h1>Mis Notas</h1>
          <button class="btn-logout" id="btnLogout">Cerrar Sesion</button>
        </div>
        <div class="student-info">
          <p><strong>Estudiante:</strong> <span id="studentName"></span></p>
          <p><strong>DNI:</strong> <span id="studentDni"></span></p>
          <p><strong>Email:</strong> <span id="studentEmail"></span></p>
          <p><strong>Programa:</strong> <span id="studentProgram"></span></p>
          <p><strong>Ciclo:</strong> <span id="studentCycle"></span></p>
          <p><strong>A�o:</strong> <span id="studentYear"></span></p>
        </div>
        <!-- Table for tablets and desktop -->
        <div class="table-wrapper">
          <table class="grades-table">
            <thead>
              <tr>
                <th>Asignatura</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Nota 3</th>
                <th>Promedio</th>
              </tr>
            </thead>
            <tbody id="gradesBody"></tbody>
          </table>
        </div>
        <!-- Cards for mobile -->
        <div class="grades-cards" id="gradesCards"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', dashboardHTML);

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const dni = document.getElementById('dni').value.trim();
    const password = document.getElementById('password').value;

    const result = validateLogin(dni, password);

    if (result.success) {
      showDashboard(result.student);
    } else {
      document.getElementById('errorMessage').textContent = result.message;
    }
  });

  document.getElementById('btnLogout').addEventListener('click', showLogin);
});
