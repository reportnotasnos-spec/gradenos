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
  tbody.innerHTML = '';

  let totalAvg = 0;

  studentRecords.forEach(record => {
    const avg = ((record.grade1 + record.grade2 + record.grade3) / 3).toFixed(1);
    totalAvg += parseFloat(avg);
    const avgClass = parseFloat(avg) >= 10.5 ? 'grade-approved' : 'grade-failed';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.subject}</td>
      <td class="grade-cell ${record.grade1 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade1}</td>
      <td class="grade-cell ${record.grade2 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade2}</td>
      <td class="grade-cell ${record.grade3 >= 11 ? 'grade-approved' : 'grade-failed'}">${record.grade3}</td>
      <td class="grade-cell ${avgClass}">${avg}</td>
    `;
    tbody.appendChild(row);
  });

  if (studentRecords.length > 1) {
    const generalAvg = (totalAvg / studentRecords.length).toFixed(1);
    const avgClass = parseFloat(generalAvg) >= 10.5 ? 'grade-approved' : 'grade-failed';
    const avgRow = document.createElement('tr');
    avgRow.className = 'average-row';
    avgRow.innerHTML = `
      <td colspan="4"><strong>Promedio General</strong></td>
      <td class="grade-cell ${avgClass}"><strong>${generalAvg}</strong></td>
    `;
    tbody.appendChild(avgRow);
  }
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
          <p><strong>Año:</strong> <span id="studentYear"></span></p>
        </div>
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
